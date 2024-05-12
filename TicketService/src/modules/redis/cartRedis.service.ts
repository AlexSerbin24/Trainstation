import { Inject, Injectable } from '@nestjs/common';
import { RedisClientBase } from './redis.service.abstract';
import Redis from 'ioredis';
import { ClientProxy } from '@nestjs/microservices';
import * as uuid from 'uuid';
import { CartItemDto } from '../../dto/cart.dto';
import { TicketDataDto } from '../../dto/ticketData.dto';
import { TRAIN_RMQ_SERVICE } from '../../constants/services.constants';
import { UPDATE_PLACE_STATUS } from '../../constants/rmq-cmds.constants';

@Injectable()
export class CartRedisService extends RedisClientBase {


    protected expireTicketsRedis: Redis;

    constructor(@Inject(TRAIN_RMQ_SERVICE) private placeClientProxy: ClientProxy) {
        super();
        this.redis = new Redis({
            host: process.env.CART_REDIS_HOST,
            port: +process.env.CART_REDIS_PORT,
            db: +process.env.CART_REDIS_DB_INDEX,
        });

        this.expireTicketsRedis = new Redis({
            host: process.env.CART_REDIS_HOST,
            port: +process.env.CART_REDIS_PORT,
            db: +process.env.CART_REDIS_DB_INDEX,
        });

        this.redis.on("ready", () => {
            this.redis.config("SET", "notify-keyspace-events", "Ex");

            this.expireTicketsRedis.subscribe("__keyevent@0__:expired");

            this.expireTicketsRedis.on('message', this.handleTicketExpire.bind(this))
        })

    }

    async getTickets(userId: number) {
        const keysAndValues: CartItemDto[] = [];
        let cursor = '0';
        do {
            const [newCursor, results] = await this.redis.scan(cursor, 'MATCH', `ticket:*:${userId}`);
            cursor = newCursor;
            const values = await this.redis.mget(...results);
            const tickets = values.map(val => JSON.parse(val) as TicketDataDto);
            keysAndValues.push(...results.map((key, index) => ({ key, ticket: tickets[index] })));
        } while (cursor !== '0');
        return keysAndValues
    }

    async setTickets(userId: number, tickets: TicketDataDto[]) {
        const keysAndValues: CartItemDto[] = [];

        for (const ticket of tickets) {
            const ticketId = uuid.v4();
            const ticketKey = `ticket:${ticketId}:${userId}`

            const ticketJSON = JSON.stringify(ticket);

            await this.redis.set(ticketKey, ticketJSON);

            await this.redis.set(`${ticketKey}:shadow`, ticketJSON)

            keysAndValues.push({ key: ticketKey, ticket: ticket })

            this.placeClientProxy.emit({ cmd: UPDATE_PLACE_STATUS }, ticket.placeId);

        }

        return keysAndValues;

    }

    async deleteTicket(key: string, changePlaceStatus = true) {
        if (changePlaceStatus) {
            const ticket = JSON.parse(await this.redis.get(key)) as TicketDataDto;
            this.placeClientProxy.emit({ cmd: UPDATE_PLACE_STATUS }, ticket.placeId);
        }

        await this.redis.del(key);

        await this.redis.del(`${key}:shadow`);

    }


    private async handleTicketExpire(channel: string, message: string) {
        const [prefix, ticketId, userId] = message.split(":");

        const key = `${prefix}:${ticketId}:${userId}`;

        await this.deleteTicket(key);
    }

}
