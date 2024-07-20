import React, { useRef, useState } from 'react';
import DirectionContainer from './DirectionContainer.tsx';
import DateInput from './DateInput.tsx';
import TravelTypeContainer from './TravelTypeContainer.tsx';
import FindButton from './FindButton.tsx';
import Error from '../../../../../types/error.ts';
import {useNavigate} from 'react-router-dom';




export default function FindFlightsForm() {
    const navigate = useNavigate();


    const [errors, setErrors] = useState<Error[]>([])

    const [departurePoint, setDeparturePoint] = useState('');
    const [arrivalPoint, setArrivalPoint] = useState('');
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const departureDateInput = useRef<HTMLInputElement>(null);

    const onFindFlightsClickHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setErrors([])

        const newErrors: Error[] = [];


        const departureDate = departureDateInput.current?.value;

        if (!departurePoint) {
            newErrors.push({ name: "departurePoint", message: "Не вказано звідки повинен бути рейс" });
        }

        if (!arrivalPoint) {
            newErrors.push({ name: "arrivalPoint", message: "Не вказано куди повинен бути рейс" });
        }

        if (!departureDate) {
            newErrors.push({ name: "departureDate", message: "Не вказано дату рейсу" });
        }

        setErrors(newErrors);

        if(!newErrors.length) navigate(`/trains?departurePoint=${departurePoint}&arrivalPoint=${arrivalPoint}&departureDate=${departureDate}&isRoundTrip=${isRoundTrip}`);

    }

    return (
        <form className='find-flight-form'>
            {
                errors.length !== 0 &&
                <ul style={{ padding: 0 }}>
                    {
                        errors.map((err) => <li style={{ fontSize: 20, color: "red" }}>{err.message}</li>)
                    }
                </ul>
            }
            <DirectionContainer
                departurePoint={departurePoint}
                setDeparturePoint={setDeparturePoint}
                arrivalPoint={arrivalPoint}
                setArrivalPoint={setArrivalPoint}
            />
            <DateInput
                dateRef={departureDateInput}
            />
            <TravelTypeContainer isRoundTrip={isRoundTrip} setIsRoundTrip={setIsRoundTrip} />
            <FindButton onClick={onFindFlightsClickHandler} />
        </form>
    );
}
