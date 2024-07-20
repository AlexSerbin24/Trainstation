import React from 'react';
import IntecityPlaces from './IntecityPlaces.tsx';
import {SelectedPlace } from '../../../../../types/trainInfo.ts';
import { CarriagePlace } from '../../../../../types/train.ts';

type Props = {
    places: CarriagePlace[],
    onSelectPlace: (place: CarriagePlace) => void,
    selectedPlaces: SelectedPlace[]
}

const IntercityBody: React.FC<Props> = ({ places, onSelectPlace, selectedPlaces }) => {
    return (
        <svg style={{ alignSelf: "center" }} width="850" height="170" xmlns="http://www.w3.org/2000/svg">
            <path d="M 10 0 H 840 A 10 10 0 0 1 850 10 V 160 A 10 10 0 0 1 840 170 H 10 A 10 10 0 0 1 0 160 V 10 A 10 10 0 0 1 10 0 Z"
                fill="none" stroke="dodgerblue" strokeWidth="8" />

            <line x1="50" y1="4" x2="50" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="110" y1="4" x2="110" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="50" y1="166" x2="50" y2="116" stroke="dodgerblue" strokeWidth="2" />
            <line x1="110" y1="166" x2="110" y2="116" stroke="dodgerblue" strokeWidth="2" />


            <line x1="800" y1="4" x2="800" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="740" y1="4" x2="740" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="800" y1="166" x2="800" y2="116" stroke="dodgerblue" strokeWidth="2" />
            <line x1="740" y1="166" x2="740" y2="116" stroke="dodgerblue" strokeWidth="2" />

            <IntecityPlaces places={places} onSelectPlace={onSelectPlace} selectedPlaces={selectedPlaces} />
            
            <rect x={163} y={115} width={12} height={50} fill='grey' />
            
            <rect x={677} y={7} width={12} height={50} fill='grey' />
        </svg>
    );
}

export default IntercityBody;
