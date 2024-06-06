import { Test, TestingModule } from '@nestjs/testing';
import { TrainService } from '../train.service';
import { Train, TrainStatus, TrainType } from '../../../entities/train.entity';
import { Station } from '../../../entities/station.entity';
import { Carriage, CarriageType } from '../../../entities/carriage.entity';
import { CarriagePlace } from '../../../entities/carriagePlace.entity';
import { CreateCarriage, TrainCreate, TrainsSearch, TrainUpdate } from '@app/dtos';
import { Repository } from 'typeorm';
import { RouteSegment } from '../../../entities/routeSegment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TRAIN_AUTH_SERVICE, TRAIN_NOTIFICATION_SERVICE, TRAIN_TICKET_SERVICE } from '../../../constants/service.constants';
import { of } from 'rxjs';
import { UPDATE_TRAIN_NOTIFICATION } from '@app/messages';

describe('TrainService', () => {
  let trainService: TrainService;
  let trainRepository: Repository<Train>;
  let carriageRepository: Repository<Carriage>;
  let stationRepository: Repository<Station>;
  let routeSegmentRepository: Repository<RouteSegment>;

  const trainTicketProxyMock = {
    send: jest.fn(),
    emit: jest.fn()
  }

  const trainAuthProxyMock = {
    send: jest.fn(),
    emit: jest.fn()
  }


  const trainNotificationProxyMock = {
    send: jest.fn(),
    emit: jest.fn()
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainService,
        {
          provide: getRepositoryToken(Train),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Carriage),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Station),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CarriagePlace),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(RouteSegment),
          useClass: Repository,
        },
        {
          provide: TRAIN_NOTIFICATION_SERVICE,
          useValue: trainNotificationProxyMock
        },
        {
          provide: TRAIN_TICKET_SERVICE,
          useValue: trainTicketProxyMock
        },
        {
          provide: TRAIN_AUTH_SERVICE,
          useValue: trainAuthProxyMock
        },
      ],
    }).compile();

    trainService = module.get<TrainService>(TrainService);
    trainRepository = module.get<Repository<Train>>(getRepositoryToken(Train));
    carriageRepository = module.get<Repository<Carriage>>(getRepositoryToken(Carriage));
    stationRepository = module.get<Repository<Station>>(getRepositoryToken(Station));
    routeSegmentRepository = module.get<Repository<RouteSegment>>(getRepositoryToken(RouteSegment));

  });

  //findTrainById
  it('should return a train with the specified id', async () => {
    // Arrange
    const id = 1; // Example id
    const expectedTrain = new Train();
    expectedTrain.id = id;

    jest.spyOn(trainRepository, 'findOne').mockResolvedValue(expectedTrain);

    // Act
    const result = await trainService.findTrainById(id, false);

    // Assert
    expect(result).toEqual(expectedTrain);
  });


  //findAllTrains
  it('should return empty array if no trains exist', async () => {
    jest.spyOn(trainRepository, 'find').mockResolvedValue([]);
    const result = await trainService.findAllTrains();
    expect(result).toEqual([]);
  });


  it('should return all trains', async () => {
    const mockTrains: Train[] = [{ id: 1, trainNumber: 123, trainType: TrainType.Common, trainStatus: TrainStatus.AwaitingDeparture, routeSegments: [], trainUnits: [] }];
    jest.spyOn(trainRepository, 'find').mockResolvedValue(mockTrains);
    const result = await trainService.findAllTrains();
    expect(result).toEqual(mockTrains);
  });

  //findTrainsByRouteAndDate

  it('should return trains with route passing through the specified stations and departure', async () => {
    const trainsSearchData: TrainsSearch = {
      departureStation: 'Station A',
      arrivalStation: 'Station B',
      departureTime: new Date('2024-04-15T00:00:00'),
      extraData: false
    };

    const departureStationObj = { id: 2, name: 'Station A' }; // Example departure station object
    const arrivalStationObj = { id: 3, name: 'Station B' }; // Example arrival station object


    const routeSegments: RouteSegment[] = [
      { id: 1, trainId: 1, stationId: 2, departureTime: new Date('2024-04-15T08:00:00'), arrivalTime: new Date('2024-04-15T07:55:00'), train: null, station: null },
      { id: 4, trainId: 2, stationId: 2, departureTime: new Date('2024-04-15T014:50:00'), arrivalTime: null, train: null, station: null },
    ];

    const train1 = new Train();
    train1.id = 1; train1.trainStatus = TrainStatus.AwaitingDeparture;
    train1.routeSegments = [
      { id: 1, trainId: 1, stationId: 2, departureTime: new Date('2024-04-15T06:00:00'), arrivalTime: null, train: null, station: null }, //departure station
      { id: 2, trainId: 1, stationId: 3, departureTime: new Date('2024-04-15T08:00:00'), arrivalTime: new Date('2024-04-15T07:55:00'), train: null, station: null }, //arrival stationn
      { id: 3, trainId: 1, stationId: 1, departureTime: null, arrivalTime: new Date('2024-04-15T10:00:00'), train: null, station: null }
    ];

    const train2 = new Train();
    train2.id = 2; train2.trainStatus = TrainStatus.AwaitingDeparture;
    train2.routeSegments = [
      { id: 4, trainId: 2, stationId: 2, departureTime: new Date('2024-04-15T14:50:00'), arrivalTime: null, train: null, station: null },//Departure station
      { id: 5, trainId: 2, stationId: 3, departureTime: new Date('2024-04-15T16:10:00'), arrivalTime: new Date('2024-04-15T16:05:00'), train: null, station: null },
    ]

    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(departureStationObj);
    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(arrivalStationObj);
    jest.spyOn(routeSegmentRepository, 'find').mockResolvedValue(routeSegments)
    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(train1);
    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(train2);

    // Act
    const result = await trainService.findTrainsByRouteAndDate(trainsSearchData);


    // Assert
    expect(result).toEqual([train1, train2]);
  });


  it('should return empty trains array because they dont have an arrival station', async () => {
    const trainsSearchData: TrainsSearch = {
      departureStation: 'Station A',
      arrivalStation: 'Station B',
      departureTime: new Date('2024-04-15T00:00:00'),
      extraData: false
    };

    const departureStationObj = { id: 2, name: 'Station A' }; // Example departure station object
    const arrivalStationObj = { id: 3, name: 'Station B' }; // Example arrival station object


    const routeSegments: RouteSegment[] = [
      { id: 1, trainId: 1, stationId: 2, departureTime: new Date('2024-04-15T08:00:00'), arrivalTime: new Date('2024-04-15T07:55:00'), train: null, station: null },
      { id: 3, trainId: 2, stationId: 2, departureTime: new Date('2024-04-15T014:50:00'), arrivalTime: null, train: null, station: null },
    ];

    const train1 = new Train();
    train1.id = 1; train1.trainStatus = TrainStatus.AwaitingDeparture;
    train1.routeSegments = [
      { id: 1, trainId: 1, stationId: 2, departureTime: new Date('2024-04-15T06:00:00'), arrivalTime: null, train: null, station: null }, //departure station
      { id: 2, trainId: 1, stationId: 1, departureTime: null, arrivalTime: new Date('2024-04-15T10:00:00'), train: null, station: null }
    ];

    const train2 = new Train();
    train2.id = 2; train2.trainStatus = TrainStatus.AwaitingDeparture;
    train2.routeSegments = [
      { id: 3, trainId: 2, stationId: 2, departureTime: new Date('2024-04-15T14:50:00'), arrivalTime: null, train: null, station: null },//Departure station
      { id: 4, trainId: 2, stationId: 1, departureTime: new Date('2024-04-15T16:10:00'), arrivalTime: new Date('2024-04-15T16:05:00'), train: null, station: null },
    ]

    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(departureStationObj);
    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(arrivalStationObj);
    jest.spyOn(routeSegmentRepository, 'find').mockResolvedValue(routeSegments);
    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(train1);
    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(train2);

    // Act
    const result = await trainService.findTrainsByRouteAndDate(trainsSearchData);

    // Assert
    expect(result).toEqual([]);
  })


  it('should return empty trains array because route segments with departure wont find', async () => {
    const trainsSearchData: TrainsSearch = {
      departureStation: 'Station A',
      arrivalStation: 'Station B',
      departureTime: new Date('2024-04-15T00:00:00'),
      extraData: false
    };

    const departureStationObj = { id: 2, name: 'Station A' }; // Example departure station object
    const arrivalStationObj = { id: 3, name: 'Station B' }; // Example arrival station object


    const routeSegments: RouteSegment[] = [];


    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(departureStationObj);
    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(arrivalStationObj);
    jest.spyOn(routeSegmentRepository, 'find').mockResolvedValue(routeSegments)

    // Act
    const result = await trainService.findTrainsByRouteAndDate(trainsSearchData);

    // Assert
    expect(result).toEqual([]);
  })


  it('should return train with route passing through the specified stations and departure time while having a return route', async () => {
    // Arrange
    const trainsSearchData: TrainsSearch = {
      departureStation: 'Station A',
      arrivalStation: 'Station B',
      departureTime: new Date('2024-04-15T00:00:00'),
      extraData: false
    };

    const departureStationObj = { id: 2, name: 'Station A' }; // Example departure station object
    const arrivalStationObj = { id: 3, name: 'Station B' }; // Example arrival station object

    const routeSegments: RouteSegment[] = [
      { id: 2, trainId: 1, stationId: 2, departureTime: new Date('2024-04-15T08:00:00'), arrivalTime: new Date('2024-04-15T07:55:00'), train: null, station: null },
      { id: 4, trainId: 2, stationId: 2, departureTime: new Date('2024-04-15T014:50:00'), arrivalTime: new Date('2024-04-15T14:35:00'), train: null, station: null },
    ];

    const train1 = new Train();
    train1.id = 1; train1.trainStatus = TrainStatus.AwaitingDeparture;
    train1.routeSegments = [
      { id: 1, trainId: 1, stationId: 1, departureTime: new Date('2024-04-15T06:00:00'), arrivalTime: null, train: null, station: null },
      { id: 2, trainId: 1, stationId: 2, departureTime: new Date('2024-04-15T08:00:00'), arrivalTime: new Date('2024-04-15T07:55:00'), train: null, station: null }, //Departure station
      { id: 3, trainId: 1, stationId: 3, departureTime: null, arrivalTime: new Date('2024-04-15T10:00:00'), train: null, station: null }
    ];

    //Return route
    const train2 = new Train();
    train2.id = 2; train2.trainStatus = TrainStatus.AwaitingDeparture;
    train2.routeSegments = [
      { id: 4, trainId: 2, stationId: 3, departureTime: new Date('2024-04-15T14:00:00'), arrivalTime: null, train: null, station: null },
      { id: 5, trainId: 2, stationId: 2, departureTime: new Date('2024-04-15T15:10:00'), arrivalTime: new Date('2024-04-15T15:05:00'), train: null, station: null }, //Departure station
      { id: 6, trainId: 2, stationId: 1, departureTime: new Date('2024-04-15T16:00:00'), arrivalTime: null, train: null, station: null },
    ]

    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(departureStationObj);
    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(arrivalStationObj);
    jest.spyOn(routeSegmentRepository, 'find').mockResolvedValue(routeSegments)
    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(train1);
    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(train2);

    // Act
    const result = await trainService.findTrainsByRouteAndDate(trainsSearchData);

    // Assert
    expect(result).toContainEqual(train1);
  });


  //createTrain
  it('should create a new train with specified route and carriages', async () => {
    // Arrange

    const station1 = new Station();
    station1.id = 1;

    const station2 = new Station();
    station2.id = 2;

    const carriage1: CreateCarriage = { carriageNumber: 1, carriageType: CarriageType.COUPE }

    const carriage2: CreateCarriage = { carriageNumber: 2, carriageType: CarriageType.COUPE }

    const carriage3: CreateCarriage = { carriageNumber: 3, carriageType: CarriageType.LUX }


    const trainData: TrainCreate = {
      trainNumber: 123,
      trainType: TrainType.Intercity,
      stations: [
        {
          stationId: 1,
          departureDate: new Date(),
          arrivalDate: null,
        },
        {
          stationId: 2,
          departureDate: null,
          arrivalDate: new Date(),
        },
      ],
      carriages: [carriage1, carriage2, carriage3],
    };

    const savedTrain = new Train();
    savedTrain.id = 1;



    jest.spyOn(trainRepository, 'create').mockReturnValueOnce(savedTrain);
    jest.spyOn(trainRepository, 'save').mockResolvedValue(savedTrain);
    jest.spyOn(stationRepository, 'findOne').mockResolvedValueOnce(station1).mockResolvedValue(station2);
    jest.spyOn(carriageRepository, 'save').mockResolvedValueOnce(new Carriage())
    jest.spyOn(routeSegmentRepository, "create").mockReturnValue(new RouteSegment());
    routeSegmentRepository.save = jest.fn().mockResolvedValue([new RouteSegment(), new RouteSegment()]);



    // Act
    const result = await trainService.createTrain(trainData);

    // Assert
    expect(result).toEqual(savedTrain);
    expect(trainRepository.create).toHaveBeenCalledWith({
      trainNumber: trainData.trainNumber,
      trainType: trainData.trainType,
    });
    expect(trainRepository.save).toHaveBeenCalledWith(savedTrain);
    expect(stationRepository.findOne).toHaveBeenCalledTimes(2);
    expect(carriageRepository.save).toHaveBeenCalled();
    expect(result.routeSegments).toHaveLength(2);

  });


  //updateTrain
  it("should update a train", async () => {
    const station1 = new Station();
    station1.id = 1;

    const station2 = new Station();
    station2.id = 2;



    const existedCarriage1: CreateCarriage = { id: 1, carriageNumber: 1, carriageType: CarriageType.COUPE }
    const existedCarriage2: CreateCarriage = { id: 2, carriageNumber: 2, carriageType: CarriageType.COUPE }

    const removedCarriage1: Carriage = {
      id: 3, carriageNumber: 3, carriageType: CarriageType.COUPE, trainId: 1, train: null, carriagePlaces: [{
        id: 3,
        number: 3,
        isOccupied: false,
        carriageId: 3,
        carriage: null
      }]
    }
    const removedCarriage2: Carriage = {
      id: 4, carriageNumber: 4, carriageType: CarriageType.COUPE, trainId: 1, train: null, carriagePlaces: [{
        id: 4,
        number: 4,
        isOccupied: true,
        carriageId: 4,
        carriage: null
      },
      {
        id: 5,
        number: 5,
        isOccupied: false,
        carriageId: 4,
        carriage: null
      }
      ]
    }

    const newCarriage1: CreateCarriage = { carriageNumber: 3, carriageType: CarriageType.LUX }

    const oldCarriages: Carriage[] = [
      {
        id: existedCarriage1.id, carriageNumber: existedCarriage1.carriageNumber, carriageType: existedCarriage1.carriageType, trainId: 1, train: null, carriagePlaces: [{
          id: 1,
          number: 1,
          isOccupied: false,
          carriageId: existedCarriage1.id,
          carriage: null
        }]
      },
      {
        id: existedCarriage2.id, carriageNumber: existedCarriage2.carriageNumber, carriageType: existedCarriage2.carriageType, trainId: 1, train: null, carriagePlaces: [{
          id: 2,
          number: 2,
          isOccupied: false,
          carriageId: existedCarriage2.id,
          carriage: null
        }]
      },
      removedCarriage1,
      removedCarriage2
    ]

    const trainData: TrainUpdate = {
      stations: [
        {
          stationId: 1,
          departureDate: new Date(),
          arrivalDate: null,
        },
        {
          stationId: 2,
          departureDate: null,
          arrivalDate: new Date(),
        },
      ],
      carriages: [existedCarriage1, existedCarriage2, newCarriage1],
    };

    const trainId = 1;


    const segments: RouteSegment[] = [{
      id: 1,
      stationId: 1,
      trainId,
      train: null,
      station: station1,
      departureTime: trainData.stations[0].departureDate,
      arrivalTime: trainData.stations[0].arrivalDate
    },
    {
      id: 2,
      stationId: 2,
      trainId,
      train: null,
      station: station2,
      departureTime: trainData.stations[1].departureDate,
      arrivalTime: trainData.stations[1].arrivalDate
    }]

    jest.spyOn(carriageRepository, 'find').mockResolvedValue(oldCarriages);
    jest.spyOn(carriageRepository, 'save').mockResolvedValue(new Carriage())
    jest.spyOn(carriageRepository, 'remove').mockResolvedValue(new Carriage())
    jest.spyOn(routeSegmentRepository, "save").mockResolvedValue(new RouteSegment())

    jest.spyOn(routeSegmentRepository, 'find').mockResolvedValue(segments)

    const resultTrain = new Train();
    resultTrain.routeSegments = [];
    jest.spyOn(trainRepository, 'findOne').mockResolvedValue(resultTrain);
   
    jest.spyOn(trainTicketProxyMock, 'send').mockImplementation(() => of([]));

    await trainService.updateTrain(trainId, trainData);

    expect(carriageRepository.save).toHaveBeenCalledWith([{ ...newCarriage1, trainId }]);
    expect(carriageRepository.remove).toHaveBeenCalledWith([removedCarriage1]);
    expect(routeSegmentRepository.save).toHaveBeenCalledTimes(2);  // Assuming two stations
    expect(trainNotificationProxyMock.emit).not.toHaveBeenCalledWith(
      { cmd: UPDATE_TRAIN_NOTIFICATION },
      expect.anything()
    );
  });


  //removeTrain
  it('should remove the train with the specified id', async () => {
    // Arrange
    const trainId = 1;
    const trainToRemove = new Train();
    trainToRemove.id = trainId;

    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(trainToRemove);
    jest.spyOn(trainRepository, 'remove').mockResolvedValueOnce(trainToRemove);

    // Act
    const result = await trainService.removeTrain(trainId);

    // Assert
    expect(result).toBeTruthy();
    expect(trainRepository.findOne).toHaveBeenCalledWith({ where: { id: trainId } });
    expect(trainRepository.remove).toHaveBeenCalledWith(trainToRemove);
  });


  it('should throw an error if train with the specified id is not found', async () => {
    // Arrange
    const trainId = 1;

    jest.spyOn(trainRepository, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(trainRepository, "remove");
    jest.spyOn(trainTicketProxyMock, 'send').mockImplementation(() => of([1]));
    jest.spyOn(trainAuthProxyMock, "send").mockImplementation(() => of([{ email: "test@gmail.com", firstname: "test", lastname: "test" }]));

    // Act & Assert
    await expect(trainService.removeTrain(trainId)).rejects.toThrow(`Train with id ${trainId} not found`);
    expect(trainRepository.findOne).toHaveBeenCalledWith({ where: { id: trainId } });
    expect(trainRepository.remove).not.toHaveBeenCalled();
  });




})


