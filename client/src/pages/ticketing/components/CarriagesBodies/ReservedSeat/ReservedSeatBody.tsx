import React, { ReactElement } from 'react';
import {  SelectedPlace } from '../../../../../types/trainInfo.ts';
import { CarriagePlace } from '../../../../../types/train.ts';
import ReservedSeatPlaces from './ReservedSeatPlaces.tsx';

type Props = {
    places: CarriagePlace[],
    onSelectPlace: (place: CarriagePlace) => void,
    selectedPlaces: SelectedPlace[]
}

const ReservedSeatBody: React.FC<Props> = ({ places, onSelectPlace, selectedPlaces }) => {
    const lines: ReactElement[] = [<line key="vertical-line" x1="775" y1="4" x2="775" y2="50" stroke="dodgerblue" strokeWidth="2" />];

    for (let i = 0; i < 10; i++) {
        const x = 205 + 65 * i;
        lines.push(<line key={i} x1={x} y1="120" x2={x} y2="166" stroke="dodgerblue" strokeWidth="2" />);
    }

    return (
        <svg style={{ alignSelf: "center" }} width="850" height="170" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M 10 0 H 840 A 10 10 0 0 1 850 10 V 160 A 10 10 0 0 1 840 170 H 10 A 10 10 0 0 1 0 160 V 10 A 10 10 0 0 1 10 0 Z"
                fill="none" stroke="dodgerblue" strokeWidth="8"
            />

            <line x1="50" y1="4" x2="50" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="100" y1="4" x2="100" y2="50" stroke="dodgerblue" strokeWidth="2" />

            <line x1="50" y1="106" x2="50" y2="166" stroke="dodgerblue" strokeWidth="2" />
            <line x1="100" y1="120" x2="100" y2="166" stroke="dodgerblue" strokeWidth="2" />

            <line x1="140" y1="120" x2="140" y2="166" stroke="dodgerblue" strokeWidth="2" />

            <ReservedSeatPlaces places={places} onSelectPlace={onSelectPlace} selectedPlaces={selectedPlaces} />

            {lines}
        </svg>
    );
}

export default ReservedSeatBody;
