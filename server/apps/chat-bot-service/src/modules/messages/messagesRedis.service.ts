import { RedisClientBase } from "@app/redis";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { MessageCount } from "../../dto/messageCount.dto";

@Injectable()
export class MessagesRedisService extends RedisClientBase {

    constructor() {
        super();
        this.redis = new Redis({
            host: process.env.MESSAGES_REDIS_HOST,
            port: +process.env.MESSAGES_REDIS_PORT,
            db: +process.env.MESSAGES_REDIS_DB_INDEX,
        });



    }
    async increaseMessageCounter(userId: number) {
        const redisKey = `messages-user-${userId}`;
        const data = await this.redis.get(redisKey);
        let messageCount: MessageCount;

        if (data) {
            messageCount = JSON.parse(data) as MessageCount;
            const now = new Date();
            const previousDate = new Date(messageCount.date);
            const hoursDifference = (+now - +previousDate) / (60 * 1000*60);
            if (hoursDifference >= 24) {
                messageCount = { date: now, count: 1 };
            } else if (messageCount.count <= 3) {
                messageCount.count += 1;
            }

            if (messageCount.count > 3) {
                return false;
            }

        } else {
            messageCount = { date: new Date(), count: 1 };
        }

        await this.redis.set(redisKey, JSON.stringify(messageCount));
        return true;
    }
}