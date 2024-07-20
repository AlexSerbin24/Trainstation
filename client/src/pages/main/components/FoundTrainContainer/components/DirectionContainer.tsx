import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Station from '../../../../../types/station';


type Props = {
    departurePoint: string,
    setDeparturePoint: React.Dispatch<React.SetStateAction<string>>,
    arrivalPoint: string,
    setArrivalPoint: React.Dispatch<React.SetStateAction<string>>
};

const DirectionContainer: React.FC<Props> = ({ departurePoint, arrivalPoint, setDeparturePoint, setArrivalPoint }) => {
    const stations = useLoaderData() as Station[];

    const handleDepartureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDeparturePoint(e.target.value);
    };

    const handleArrivalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setArrivalPoint(e.target.value);
    };

    const handleSwapBtnClick = (e: React.MouseEvent) => {
        const temp = departurePoint;

        setDeparturePoint(arrivalPoint);
        setArrivalPoint(temp);
    }

    const filteredDepartureStations = stations.filter(station => station.name !== arrivalPoint);
    const filteredArrivalStations = stations.filter(station => station.name !== departurePoint);

    return (
        <div className='find-trains-form-direction-container'>
            <div className='direction-container-inputs'>
                <div className='select-container'>
                    <label htmlFor="departure">Звідки</label>
                    <select
                        id="departure"
                        value={departurePoint}
                        onChange={handleDepartureChange}
                    >
                        <option value="">Выберите станцию</option>
                        {filteredDepartureStations.map(station => (
                            <option key={station.id} value={station.name}>{station.name}</option>
                        ))}
                    </select>
                </div>
                <div className='select-container'>
                    <label htmlFor="arrival">Куди</label>
                    <select
                        id="arrival"
                        value={arrivalPoint}
                        onChange={handleArrivalChange}
                    >
                        <option value="">Выберите станцию</option>
                        {filteredArrivalStations.map(station => (
                            <option key={station.id} value={station.name}>{station.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='swap-direction-container' onClick={handleSwapBtnClick}>
                <FontAwesomeIcon className='swap-direction-btn' style={{ cursor: "pointer" }} icon={faArrowRightArrowLeft} size='2xl' rotation={90} color='dodgerblue' />
            </div>
        </div>
    );
};

export default DirectionContainer;
