import React from 'react'
import DateCard from './DateCard.tsx';
import TrainsFilter from '../../../../types/trainsFilters.ts';
import { useNavigate } from 'react-router-dom';

type Props = {
    trainsFilter: TrainsFilter,
    handleDateSelectorBtnClick: (date: string) => (event: React.MouseEvent<HTMLButtonElement>) => void
}

const daysOfWeek = ['Нд.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'];
const months = ['Січ.', 'Лют.', 'Бер.', 'Кв.', 'Тр', 'Чер.', 'Лип.', 'Сер.', 'Вер.', 'Жов.', 'Лист.', 'Гр.'];


function generateDateDetails(startDate: string) {
    const date = new Date(startDate);
    console.log(startDate)
    const dateDetails: { dayOfWeek: string, dayOfMonth: number, month: string, date: string }[] = [];

    for (let i = 0; i < 7; i++) {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + i);

        const year = newDate.getFullYear();
        const month = newDate.getMonth() + 1;
        const dayOfMonth = newDate.getDate();

        dateDetails.push({
            dayOfWeek: daysOfWeek[newDate.getDay()],
            dayOfMonth: newDate.getDate(),
            month: months[newDate.getMonth()],
            date: `${year}-${month < 10 ? '0' + month : month}-${dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth}`
        });
    }

    return dateDetails;
}


export default function DateSelector({ trainsFilter, handleDateSelectorBtnClick }) {

    const navigate = useNavigate();

    // const handleDateCardBtnClick = (date: Date) =>
    //     (event: React.MouseEvent<HTMLButtonElement>) => {
    //         const year = date.getFullYear();
    //         const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //         const day = date.getDate().toString().padStart(2, '0');

    //         const resultDate = `${year}-${month}-${day}`;

    //         navigate(`/trains?departurePoint=${trainsFilter.departurePoint}&arrivalPoint=${trainsFilter.arrivalPoint}&departureDate=${resultDate}&isRoundTrip=${trainsFilter.isRoundTrip}`)
    //     }


    const currentDate = new Date(trainsFilter.departureDate);
    const dateDetails = generateDateDetails(trainsFilter.departureDate);

    return (
        <div className="date-selector">
            {dateDetails.map((detail, index) => (
                <DateCard
                    key={index}
                    isChosen={currentDate.getDate() === detail.dayOfMonth}
                    dayOfWeek={detail.dayOfWeek}
                    dayOfMonth={detail.dayOfMonth}
                    month={detail.month}
                    handleDateCardBtnClick={handleDateSelectorBtnClick(detail.date)}
                />
            ))}
        </div>
    );
}
