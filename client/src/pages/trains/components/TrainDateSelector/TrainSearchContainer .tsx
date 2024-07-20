import React from 'react'
import TrainCurrentInfo from './TrainCurrentInfo.tsx'
import DateSelector from './DateSelector.tsx'
import TrainsFilter from '../../../../types/trainsFilters.ts'


type Props = {
    trainsFilter:TrainsFilter,
    handleDateSelectorBtnClick: (date: string) => (event: React.MouseEvent<HTMLButtonElement>) => void
}
export default function TrainSearchContainer({trainsFilter, handleDateSelectorBtnClick}:Props) {
    return (
        <div className='train-search-container'>
            <TrainCurrentInfo trainsFilter={trainsFilter}/>
            <DateSelector trainsFilter={trainsFilter} handleDateSelectorBtnClick={handleDateSelectorBtnClick} />
        </div>
    )
}
