import React, { useEffect, useState } from 'react';
import './TrainPage.css';
import TrainCard from './components/TrainCard/TrainCard.tsx';
import TrainInfo from '../../types/trainInfo.ts';
import Button from '../../components/buttons/Button.tsx';
import TrainsFilter from '../../types/trainsFilters.ts';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import TrainSearchContainer from './components/TrainDateSelector/TrainSearchContainer .tsx';
import TrainsContainer from './components/TrainCard/TrainsContainer.tsx';

const TrainPage: React.FC = () => {


    const { outboundTrains, returnTrains } = useLoaderData() as { outboundTrains: TrainInfo[], returnTrains?: TrainInfo[] }

    const [searchParams, setSearchParams] = useSearchParams();

    const [trainsFilters, setTrainsFilter] = useState<TrainsFilter>({
        departureDate: searchParams.get("departureDate") as string,
        departurePoint: searchParams.get("departurePoint") as string,
        arrivalPoint: searchParams.get("arrivalPoint") as string,
        isRoundTrip: searchParams.get("isRoundTrip") === "true"?true:false,

    });

    useEffect(() => {
      console.log('aaaa')
      setTrainsFilter({
        departureDate: searchParams.get("departureDate") as string,
        departurePoint: searchParams.get("departurePoint") as string,
        arrivalPoint: searchParams.get("arrivalPoint") as string,
        isRoundTrip: searchParams.get("isRoundTrip") === "true"?true:false,

    })
    }, [searchParams])
    

    const navigate = useNavigate();

    const handleAddReturnTrainsBtnClick = (event: React.MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault()
        setSearchParams({
            "departurePoint": trainsFilters.departurePoint,
            "arrivalPoint":trainsFilters.arrivalPoint,
            "departureDate": trainsFilters.departureDate,
            "isRoundTrip":"true"
        })
        navigate(`/trains?departurePoint=${encodeURIComponent(trainsFilters.departurePoint)}&arrivalPoint=${encodeURIComponent(trainsFilters.arrivalPoint)}&departureDate=${encodeURIComponent(trainsFilters.departureDate)}&isRoundTrip=${encodeURIComponent(true)}`);
    }

    const handleDateSelectorBtnClick=(date:string)=>
        (event: React.MouseEvent<HTMLButtonElement>)=>{event.preventDefault();

        setSearchParams({
            "departurePoint": trainsFilters.departurePoint,
            "arrivalPoint":trainsFilters.arrivalPoint,
            "departureDate": date,
            "isRoundTrip":String(trainsFilters.isRoundTrip)
        })
        navigate(`/trains?departurePoint=${encodeURIComponent(trainsFilters.departurePoint)}&arrivalPoint=${encodeURIComponent(trainsFilters.arrivalPoint)}&departureDate=${encodeURIComponent(date)}&isRoundTrip=${encodeURIComponent(trainsFilters.isRoundTrip)}`);
    }


    return (
        <div>
            <TrainSearchContainer trainsFilter={trainsFilters} handleDateSelectorBtnClick={handleDateSelectorBtnClick} />
            <TrainsContainer trains={outboundTrains} returnTrains={returnTrains} handleAddReturnTrainsBtnClick={handleAddReturnTrainsBtnClick}/>
        </div>

    );
};

export default TrainPage