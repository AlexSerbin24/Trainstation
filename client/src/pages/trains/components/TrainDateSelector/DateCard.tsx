import React from 'react'
import Button from '../../../../components/buttons/Button.tsx'


type Props = {
    isChosen: boolean
    dayOfWeek: string,
    dayOfMonth: number,
    month: string,
    handleDateCardBtnClick:  (event: React.MouseEvent<HTMLButtonElement>) => void
}
export default function DateCard({ isChosen, dayOfWeek, dayOfMonth, month,handleDateCardBtnClick }: Props) {

    const classes = ['date-card'];
    if (isChosen) classes.push("chosen");

    return (
        <div className={classes.join(' ')}>
            <Button className='date-card-btn' onClick={handleDateCardBtnClick}>
                <span>{dayOfWeek} {dayOfMonth} {month}</span>
            </Button>
        </div>
    )
}
