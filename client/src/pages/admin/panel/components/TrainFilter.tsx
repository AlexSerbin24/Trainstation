import React, { useState, useEffect } from 'react';
import LightBlueButton from '../../../../components/buttons/lightBlueButton/LightBlueButton.tsx';
import DefaultButton from '../../../../components/buttons/defaultButton/DefaultButton.tsx';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Station } from '../../../../types/train.ts';
import RedButton from '../../../../components/buttons/redButton/RedButton.tsx';
import TrainFilters from '../../../../types/trainFilters.ts';

interface FilterProps {
    setFilters: (filters: TrainFilters) => void;
    stationsList: Station[];
}

const TrainFilter: React.FC<FilterProps> = ({ setFilters, stationsList }) => {
    const [trainNumber, setTrainNumber] = useState<number>(0);
    const [type, setType] = useState<string | ''>('');
    const [departureTime, setDepartureDate] = useState<string | ''>('');
    const [stations, setStations] = useState<string[]>([]);
    const [stationInput, setStationInput] = useState<string>('');
    const [availableStations, setAvailableStations] = useState<Station[]>(stationsList);

    useEffect(() => {
        // Обновляем список доступных станций при изменении фильтров
        setAvailableStations(stationsList.filter(station => !stations.includes(station.name)));
    }, [stations, stationsList]);

    const handleFilterChange = () => {
        setFilters({
            trainNumber: trainNumber,
            type: type,
            departureTime: departureTime,
            stations: stations,
        });
    };

    const handleAddStation = () => {
        if (stationInput && !stations.includes(stationInput)) {
            setStations([...stations, stationInput]);
            setStationInput('');
        }
    };

    const handleResetStations = () => {
        setFilters({
            trainNumber: 0,
            type: '',
            departureTime: '',
            stations: []
        })
    };

    return (
        <div className="filter-form">
            <div>
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="number"
                        placeholder="Номер потяга"
                        value={trainNumber}
                        onChange={(e) => setTrainNumber(Number(e.target.value))}
                    />

                    <select value={type} onChange={(e) => setType(e.target.value as string)}>
                        <option value="">Усі потяги</option>
                        <option key={"Common"} value={"Common"}>Звичайні</option>
                        <option key={"Intercity"} value={"Intercity"}>Інтерсіті</option>
                    </select>

                    <input
                        type="date"
                        placeholder="Дата"
                        value={departureTime}
                        onChange={(e) => setDepartureDate(e.target.value)}
                    />
                </div>

                <div>
                    <div style={{ marginBottom: 10 }}>
                        <select
                            value={stationInput}
                            onChange={(e) => setStationInput(e.target.value)}
                        >
                            <option value="">Виберіть станцію</option>
                            {availableStations.map((station) => (
                                <option key={station.id} value={station.name}>{station.name}</option>
                            ))}
                        </select>
                        <LightBlueButton className="add-station-filter-btn" onClick={handleAddStation}>Додати станцію</LightBlueButton>
                    </div>
                    <div>
                        {stations.map((station, index) => (
                            <React.Fragment key={index}>
                                <span style={{ fontSize: 20, marginRight: 10 }}>{station}</span>
                                {index !== stations.length - 1 && <FontAwesomeIcon style={{ marginRight: 10 }} icon={faArrowRight} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <DefaultButton className='apply-filters-btn' onClick={handleFilterChange}>Застосувати фільтри</DefaultButton>
                <RedButton className='reset-filters-btn' onClick={handleResetStations}>Скинути фільтри</RedButton>
            </div>
        </div>
    );
};

export default TrainFilter;
