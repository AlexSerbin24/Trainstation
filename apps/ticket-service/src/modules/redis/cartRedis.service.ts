import { Inject, Injectable } from '@nestjs/common';
import { RedisClientBase } from '@app/redis/redis.service.abstract';
import Redis from 'ioredis';
import { ClientProxy } from '@nestjs/microservices';
import * as uuid from 'uuid';
import { CartItemDto } from '@app/dtos/ticket/ticket-redis-entities.dto';
import { TicketDataDto } from '@app/dtos/ticket/ticket-entities.dto';
import { TICKET_TRAIN_SERVICE } from '../../constants/services.constants';
import { UPDATE_PLACE_STATUS } from '@app/messages';

@Injectable()
export class CartRedisService extends RedisClientBase {


    private readonly TIME_TO_EXPIRE = 15*60;
    protected expireTicketsRedis: Redis;

    constructor(@Inject(TICKET_TRAIN_SERVICE) private placeClientProxy: ClientProxy) {
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
            this.expireTicketsRedis.on('message', this.handleTicketExpire.bind(this));
        })

    }

    async getTickets(userId: number) {
        const keysAndValues: CartItemDto[] = [];
        let cursor = '0';
        do {
            const [newCursor, results] = await this.redis.scan(cursor, 'MATCH', `ticket:*:${userId}`);
            cursor = newCursor;

            if (results.length) {
                const values = await this.redis.mget(results);
                const tickets = values.map(val => JSON.parse(val) as TicketDataDto);
                keysAndValues.push(...results.map((key, index) => ({ key, ticket: tickets[index] })));
            }
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

            await this.redis.set(`${ticketKey}:shadow`, '');
            await this.redis.expire(`${ticketKey}:shadow`, this.TIME_TO_EXPIRE);
            keysAndValues.push({ key: ticketKey, ticket: ticket })

            this.placeClientProxy.emit({ cmd: UPDATE_PLACE_STATUS }, { placeId: ticket.placeId, isOccupied: true });

        }

        return keysAndValues;

    }

    async deleteTicket(key: string, changePlaceStatus = true) {
        if (changePlaceStatus) {
            const ticket = JSON.parse(await this.redis.get(key)) as TicketDataDto;
            this.placeClientProxy.emit({ cmd: UPDATE_PLACE_STATUS }, { placeId: ticket.placeId, isOccupied: false });
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
