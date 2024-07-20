import React from 'react'
import Button from '../../../../components/buttons/Button.tsx'
import TrainCard from './TrainCard.tsx'
import TrainInfo from '../../../../types/trainInfo.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons"
import { SetURLSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import TrainsFilter from '../../../../types/trainsFilters.ts';

type Props = {
    trains: TrainInfo[],
    returnTrains?: TrainInfo[],
    handleAddReturnTrainsBtnClick: (event: React.MouseEvent<HTMLButtonElement>)=>void
}
export default function TrainsContainer({ trains, returnTrains,handleAddReturnTrainsBtnClick  }: Props) {



    return (
        <div className="trains-container ">
            <div className='trains-cards-container'>
                {trains.map((train, index) => {
                    console.log("FF")
                    return <TrainCard key={index} train={train} />
})}
            </div>
            <div className='trains-cards-container'>
                {
                    !returnTrains || returnTrains.length === 0
                        ?
                        <Button className='add-return-trains-btn' onClick={handleAddReturnTrainsBtnClick}>
                            <FontAwesomeIcon style={{ marginRight: 5 }} icon={faPlusSquare} size='lg' />
                            Додати рейс повернення
                        </Button>
                        :
                        returnTrains.map((train, index) => (
                            <TrainCard key={index} train={train} />
                        ))
                }
            </div>
        </div>
    )
}
