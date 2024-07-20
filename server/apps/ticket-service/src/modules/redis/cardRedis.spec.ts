import { Test, TestingModule } from '@nestjs/testing';
import { CartRedisService } from './cartRedis.service';
import Redis from 'ioredis';
import { ClientProxy } from '@nestjs/microservices';
import { TicketDataDto } from '@app/dtos';
import { UPDATE_PLACE_STATUS } from '@app/messages';
import { TICKET_TRAIN_SERVICE } from '../../constants/services.constants';
import { of } from 'rxjs';

describe('CartRedisService', () => {
    let service: CartRedisService;
    let mockPlaceClientProxy: ClientProxy;
    let redisClientMock: jest.Mocked<Redis>;
    let expireTicketsRedisMock: jest.Mocked<Redis>;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartRedisService,
                {
                    provide: TICKET_TRAIN_SERVICE,
                    useValue: {
                        emit: jest.fn(),
                    },
                },
            ],
        }).compile();

        redisClientMock = new Redis() as jest.Mocked<Redis>;

        service = module.get<CartRedisService>(CartRedisService);
        (service as any).expireTicketsRedis = expireTicketsRedisMock;
        (service as any).redis = redisClientMock
        mockPlaceClientProxy = module.get<ClientProxy>(TICKET_TRAIN_SERVICE);

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const ticketDataTemplate = {
        name: 'Name',
        lastname: 'Lastname',
        patronymic: 'Patronymic',
        carriageNumber: 1,
        totalPrice: 100,
        trainId: 1,
        trainNumber: 111,
        departurePoint: 'D1',
        arrivalPoint: 'A1',
        departureDate: new Date(),
        arrivalDate: new Date(),
        extraServices: [],
    }

    describe('CardRedisService tests', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return an array of CartItemDto', async () => {
            const userId = 1;
            const ticket1: TicketDataDto = {
                ...ticketDataTemplate,
                placeId: 101,
                placeNumber: 1
            };
            const ticket2: TicketDataDto = {
                ...ticketDataTemplate,
                placeId: 102,
                placeNumber: 2
            };
            const ticket3: TicketDataDto = {
                ...ticketDataTemplate,
                placeId: 103,
                placeNumber: 3
            };

            const keys = [`ticket:1:${userId}`, `ticket:2:${userId}`, `ticket:3:${userId}`];
            const tickets = [ticket1, ticket2, ticket3];
            const ticketJSONs = tickets.map(ticket => JSON.stringify(ticket));

            jest.spyOn(Redis.prototype, 'scan').mockResolvedValueOnce(['0', keys]);
            jest.spyOn(Redis.prototype, 'mget').mockResolvedValueOnce(ticketJSONs);

            const result = await service.getTickets(userId);

            expect(result).toHaveLength(3);
            expect(result[0].key).toEqual(keys[0]);
            expect(result[1].key).toEqual(keys[1]);
            expect(result[2].key).toEqual(keys[2]);
        });


        it('should set tickets and emit UPDATE_PLACE_STATUS event', async () => {
            const userId = 1;
            const tickets: TicketDataDto[] = [
                {
                    ...ticketDataTemplate,
                    placeId: 101,
                    placeNumber: 1
                },
                {
                    ...ticketDataTemplate,
                    placeId: 102,
                    placeNumber: 2
                },
            ];

            jest.spyOn(Redis.prototype, 'set').mockResolvedValue('OK');
            jest.spyOn(Redis.prototype, 'expire').mockResolvedValue(1);
            jest.spyOn(mockPlaceClientProxy, "emit").mockImplementation(()=>of(true));

            await service.setTickets(userId, tickets);

            expect(Redis.prototype.set).toHaveBeenCalledTimes(4);
            expect(mockPlaceClientProxy.emit).toHaveBeenCalledTimes(2);
            expect(mockPlaceClientProxy.emit).toHaveBeenNthCalledWith(1, { cmd: UPDATE_PLACE_STATUS }, { isOccupied: true, placeId: tickets[0].placeId });
            expect(mockPlaceClientProxy.emit).toHaveBeenNthCalledWith(2, { cmd: UPDATE_PLACE_STATUS }, { isOccupied: true, placeId: tickets[1].placeId });
        });

        it('should delete ticket and emit UPDATE_PLACE_STATUS event', async () => {
            const key = 'ticket:uuid:1';
            const ticket: TicketDataDto = {
                ...ticketDataTemplate,
                placeId: 101,
                placeNumber: 1
            };
            jest.spyOn(Redis.prototype, 'get').mockResolvedValueOnce(JSON.stringify(ticket));
            jest.spyOn(Redis.prototype, 'del').mockResolvedValue(1);

            await service.deleteTicket(key);

            expect(mockPlaceClientProxy.emit).toHaveBeenCalledWith({ cmd: UPDATE_PLACE_STATUS }, { isOccupied: false, placeId: ticket.placeId });
            expect(Redis.prototype.del).toHaveBeenCalledTimes(2);
            expect(Redis.prototype.del).toHaveBeenNthCalledWith(1, key);
            expect(Redis.prototype.del).toHaveBeenNthCalledWith(2, `${key}:shadow`);
        });

        it('should delete ticket without emitting UPDATE_PLACE_STATUS event', async () => {
            const key = 'ticket:uuid:1';
            const ticket: TicketDataDto = {
                ...ticketDataTemplate,
                placeId: 101,
                placeNumber: 1
            };
            jest.spyOn(Redis.prototype, 'get').mockResolvedValueOnce(JSON.stringify(ticket));
            jest.spyOn(Redis.prototype, 'del').mockResolvedValue(1);

            await service.deleteTicket(key, false);

            expect(mockPlaceClientProxy.emit).not.toHaveBeenCalled();
            expect(Redis.prototype.del).toHaveBeenCalledTimes(2);
            expect(Redis.prototype.del).toHaveBeenNthCalledWith(1, key);
            expect(Redis.prototype.del).toHaveBeenNthCalledWith(2, `${key}:shadow`);
        });
    });
});
