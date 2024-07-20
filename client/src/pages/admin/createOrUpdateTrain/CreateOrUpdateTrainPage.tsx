import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrainCreate, StationData, CreateCarriage, TrainDataForCreaionOrUpdate } from '../../../types/trainCreate';
import { Station } from '../../../types/train';
import { Params, useLoaderData, useParams } from 'react-router-dom';
import AdminService from '../../../services/AdminService.ts';

interface TrainFormProps {
  isEditMode: boolean;
}

const CreateOrUpdateTrain: React.FC<TrainFormProps> = ({ isEditMode }) => {
  const trainId = (useParams() as Readonly<Params<string>>).id;

  const { stations: allStations, trainData } = useLoaderData() as { stations: Station[], trainData?: TrainDataForCreaionOrUpdate };
  console.log(allStations);
  console.log(trainData)

  const [trainNumber, setTrainNumber] = useState<number>(0);
  const [trainType, setTrainType] = useState<string>('Common');
  const [stations, setStations] = useState<StationData[]>([]);
  const [carriages, setCarriages] = useState<CreateCarriage[]>([]);

  useEffect(() => {
    if (trainData) {
      setTrainNumber(trainData.trainNumber);
      setTrainType(trainData.trainType);
      setStations(trainData.stations);
      setCarriages(trainData.carriages);
    }
  }, [trainData]);

  useEffect(() => {
    if (trainType === "Intercity") {
      setCarriages(prevState => prevState.map((carr, index) => {
        if (index === 0) return { ...carr, carriageType: "Intercity_head" }
        else return { ...carr, carriageType: "Intercity" }
      }))
    }

    else setCarriages(prevState => prevState.map((carr) => ({ ...carr, carriageType: "Coupe" })));


  }, [trainType])


  const handleAddStation = () => {
    setStations([...stations, { stationId: 0, departureDate: null, arrivalDate: null }]);
  };

  const handleStationChange = (index: number, field: keyof StationData, value: any) => {
    const newStations = [...stations];
    newStations[index] = {
      ...newStations[index],
      [field]: value
    };
    setStations(newStations);
  };

  const handleRemoveStation = (index: number) => {
    const newStations = stations.filter((_, i) => i !== index);
    setStations(newStations);
  };

  const handleAddCarriage = () => {
    const newCarriageNumber = carriages.length + 1;
    const newCarriageType = trainType !== 'Intercity' ? "Coupe" : newCarriageNumber === 1 ? "Intercity_head" : "Intercity";
    setCarriages([...carriages, { carriageNumber: newCarriageNumber, carriageType: newCarriageType }]);
  };

  const handleCarriageTypeChange = (index: number, value: string) => {
    const newCarriages = [...carriages];
    newCarriages[index].carriageType = value;
    setCarriages(newCarriages);
  };

  const handleRemoveCarriage = (index: number) => {
    const newCarriages = carriages.filter((_, i) => i !== index);
    setCarriages(newCarriages);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    try {
      if (isEditMode && trainId) {
        await AdminService.updateTrain(+trainId, { stations, carriages });
      } else {
        await AdminService.createTrain({
          trainNumber,
          trainType,
          stations,
          carriages,
        })
      }
    } catch (error) {
      console.error('Error submitting train data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isEditMode &&
        <>
          <div>
            <label>Номер поїзду:</label>
            <input
              type="number"
              value={trainNumber}
              onChange={(e) => setTrainNumber(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label>Тип поїзду:</label>
            <select value={trainType} onChange={(e) => setTrainType(e.target.value)}>
              <option value="Common">Звичайний</option>
              <option value="Intercity">Інтерсіті</option>
            </select>
          </div>
        </>
      }
      <div>
        <h3>Станції</h3>
        {stations.map((station, index) => (
          <div key={index}>
            <select
              value={station.stationId}
              onChange={(e) => handleStationChange(index, 'stationId', Number(e.target.value))}
              required
            >
              <option value="">Виберіть станцію</option>
              {allStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            {index > 0 && (
              <input
                type="datetime-local"
                value={station.arrivalDate ? new Date(station.arrivalDate).toISOString().slice(0, -1) : ''}
                onChange={(e) => handleStationChange(index, 'arrivalDate', e.target.value)}
                placeholder="Час прибуття"
              />
            )}
            {index < stations.length - 1 && (
              <input
                type="datetime-local"
                value={station.departureDate ? new Date(station.departureDate).toISOString().slice(0, -1) : ''}
                onChange={(e) => handleStationChange(index, 'departureDate', e.target.value)}
                placeholder="Час відправлення"
              />
            )}
            <button type="button" onClick={() => handleRemoveStation(index)}>
              Удалить станцию
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddStation}>
          Додати станцію
        </button>
      </div>
      <div>
        <h3>Вагони</h3>
        {carriages.map((carriage, index) => (
          <div key={index}>
            <label>Тип вагона:</label>
            <select
              value={carriage.carriageType}
              onChange={(e) => handleCarriageTypeChange(index, e.target.value)}
              disabled={isEditMode && carriage.id !== undefined}
              required
            >
              {trainType === 'Common' ? (
                <>
                  <option value="Coupe">Купе</option>
                  <option value="LUX">Люкс</option>
                  <option value="Reserved_seat">Плацкарт</option>
                </>
              ) : (
                <>
                  {index === 0 ? (
                    <option value="Intercity_head">Головний Інтерсіті</option>
                  ) : (
                    <option value="Intercity">Інтерсіті</option>
                  )}
                </>
              )}
            </select>
            <button type="button" onClick={() => handleRemoveCarriage(index)}>
              Удалить вагон
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddCarriage}>
          Додати вагон
        </button>
      </div>
      <button type="submit">{isEditMode ? 'Оновити рейс' : 'Створити рейс'}</button>
    </form>
  );
};

export default CreateOrUpdateTrain;
