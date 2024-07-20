import React from 'react';
import CarriageTypeInfo from "./CarriageTypeInfo.tsx"
import TrainInfo from '../../../../types/trainInfo.ts';
import Button from '../../../../components/buttons/Button.tsx';
import { useNavigate } from 'react-router-dom';


interface Props {
    train: TrainInfo
}

const TrainCard: React.FC<Props> = ({ train }) => {

    const { id, trainNumber, route, carriagesTypes,  } = train;
    
    const navigate = useNavigate();
    const handleChooseTrainBtnClick = (event: React.MouseEvent<HTMLButtonElement>)=>{
        navigate(`/ticketing/${id}?departurePoint=${route.departurePoint}&arrivalPoint=${route.arrivalPoint}`);
    }


    console.log(carriagesTypes)
    const departureTime = new Date(route.departureTime)
    const arrivalTime = new Date(route.arrivalTime);

    return (
        <div className="schedule-card">
            <div className="schedule-header">
                {/* <h2>{trainNumber}</h2> */}
                <div>
                    <h2>{route.departurePoint}</h2>
                    <p>{departureTime.toLocaleDateString()}</p>
                </div>
                <div className="schedule-time">
                    <span>{departureTime.toLocaleTimeString()}</span> - <span>{arrivalTime.toLocaleTimeString()}</span>
                </div>
                <div>
                    <h2>{route.arrivalPoint}</h2>
                    <p>{arrivalTime.toLocaleDateString()}</p>
                </div>
            </div>
            <div className="class-info">
                {carriagesTypes.map((carriageType, index) => <CarriageTypeInfo trainId={id} carriageType={carriageType} key={index} />)}
            </div>
            <Button onClick={handleChooseTrainBtnClick} className='choose-train-btn'>Вибрати</Button>
        </div>
    );
};

export default TrainCard;