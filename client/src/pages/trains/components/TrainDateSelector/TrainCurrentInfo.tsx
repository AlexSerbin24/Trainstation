import React from 'react'
import TrainsFilter from '../../../../types/trainsFilters'
import Button from '../../../../components/buttons/Button.tsx'


type Props = {
    trainsFilter: TrainsFilter
}
export default function TrainCurrentInfo({ trainsFilter }: Props) {
    return (
        <div className='train-current-info'>
            <span>Вы шукали рейс:
                <span style={{ margin: "0 5px", fontWeight:"bold" }}>{trainsFilter.departurePoint}</span> -
                <span style={{ margin: "0 5px", fontWeight:"bold" }}>{trainsFilter.arrivalPoint}</span> 
                <span style={{ margin: "0 5px" }}>{trainsFilter.isRoundTrip ? "Туди й назад" : "Разовий рейс"}</span>
                {/* <Button className='change-trains-filter'>Змінити</Button> */}
            </span>
        </div>
    )
}
