import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrainFilter from './components/TrainFilter.tsx';
import TrainTable from './components/TrainTable.tsx';
import Pagination from './components/Pagination.tsx';
import Train, { Station } from '../../../types/train';
import TrainFilters from '../../../types/trainFilters';
import "./PanelPage.css"
import { useLoaderData } from 'react-router-dom';
const PanelPage: React.FC = () => {

    const { trains, stations } = useLoaderData() as { trains: Train[], stations: Station[] };


    const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [trainsPerPage, setTrainsPerPage] = useState(10);
    const [filters, setFilters] = useState<TrainFilters>({
        trainNumber: 0,
        type: "",
        departureTime: "",
        stations: [],
    });

    // Комментарий: оставляем этот код закомментированным, если мы не хотим его вызывать
    // useEffect(() => {
    //     fetchTrains();
    // }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, trains]);

    useEffect(() => {
        setCurrentPage(1); // Сбрасываем текущую страницу при изменении фильтров
    }, [filteredTrains]);

    const applyFilters = () => {
        let result = [...trains];
        if (filters.trainNumber) {
            result = result.filter(train => train.trainNumber === filters.trainNumber);
        }
        if (filters.type) {
            result = result.filter(train => train.trainType === filters.type);
        }
        if (filters.departureTime) {
            result = result.filter(train =>
                train.routeSegments.some(segment =>
                    segment.departureTime && new Date(segment.departureTime).toDateString() === new Date(filters.departureTime).toDateString()
                )
            );
        }
        if (filters.stations.length > 0) {
            result = result.filter(train =>
                filters.stations.every((station: string) =>
                    train.routeSegments.some(segment => segment.station.name === station)
                )
            );
            result = result.filter(train =>
                filters.stations.every((station: string, index: number, array: string[]) => {
                    const stationIndexes = train.routeSegments
                        .map(segment => segment.station.name)
                        .filter(name => array.includes(name))
                        .map(name => train.routeSegments.findIndex(segment => segment.station.name === name));
                    return stationIndexes.every((stationIndex, idx) => idx === 0 || stationIndex > stationIndexes[idx - 1]);
                })
            );
        }
        setFilteredTrains(result);
    };

    const getCurrentPageTrains = () => {
        const startIndex = (currentPage - 1) * trainsPerPage;
        return filteredTrains.slice(startIndex, startIndex + trainsPerPage);
    };

    return (
        <div>
            <h1>Панель адміна</h1>
            <TrainFilter stationsList={stations} setFilters={setFilters} />
            <TrainTable trains={getCurrentPageTrains()} />
            <Pagination
                currentPage={currentPage}
                totalTrains={filteredTrains.length}
                trainsPerPage={trainsPerPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default PanelPage;
