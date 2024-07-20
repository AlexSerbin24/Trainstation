import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { TrainFullInfo } from '../../../types/trainInfo.ts';

interface TrainInfoProps {
    train: TrainFullInfo;
}

const TrainData: React.FC<TrainInfoProps> = ({ train }) => {
    console.log(train.route)
    return (
        <div className='ticketing-train-info-container'>
            <h2>Вибраний потяг</h2>
            <div className='ticketing-train-short-info'>
                <span>{new Date(train.route.departureTime).toLocaleDateString()}</span>
                <span>{train.trainNumber}</span>
                <span>{train.route.departurePoint}</span>
                <FontAwesomeIcon icon={faArrowRight} size='xs' style={{ margin: "5px 5px 0 10px" }} />
                <span>{train.route.arrivalPoint}</span>
            </div>
            <div className='ticketing-train-info'>
                <div className='ticketing-train-info-route'>
                    <div>
                        <span style={{color:"grey"}}>Відправлення</span>
                        <span>{train.route.departurePoint}</span>
                    </div>
                    <div>
                        <span style={{color:"grey"}}>{new Date(train.route.departureTime).toLocaleTimeString()}</span>
                        <span style={{fontWeight:"bold", fontSize:22}}>{new Date(train.route.departureTime).toLocaleDateString()}</span>
                    </div>
                </div>

                <div style={{alignSelf:"center"}}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>

                <div className='ticketing-train-info-route'>
                    <div>
                        <span style={{color:"grey"}}>{new Date(train.route.arrivalTime).toLocaleTimeString()}</span>
                        <span style={{fontWeight:"bold", fontSize:22}}>{new Date(train.route.arrivalTime).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span style={{color:"grey"}}>Прибуття</span>
                        <span>{train.route.arrivalPoint}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrainData;
