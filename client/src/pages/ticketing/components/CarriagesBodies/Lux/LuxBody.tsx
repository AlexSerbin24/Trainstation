import React from 'react';
import { SelectedPlace } from '../../../../../types/trainInfo.ts';
import { CarriagePlace } from '../../../../../types/train.ts';
import LuxPlaces from './LuxPlaces.tsx';

type Props = {
    places: CarriagePlace[],
    onSelectPlace: (place: CarriagePlace) => void,
    selectedPlaces: SelectedPlace[]
}

const LuxBody: React.FC<Props> = ({ places, onSelectPlace, selectedPlaces }) => {
    return (
        <svg style={{ alignSelf: "center" }} width="880" height="120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 10 0 H 870 A 10 10 0 0 1 880 10 V 110 A 10 10 0 0 1 870 120 H 10 A 10 10 0 0 1 0 110 V 10 A 10 10 0 0 1 10 0 Z"
                fill="none" stroke="dodgerblue" strokeWidth="8" />

            <line x1="50" y1="4" x2="50" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="100" y1="4" x2="100" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="840" y1="4" x2="840" y2="50" stroke="dodgerblue" strokeWidth="2" />
            <line x1="840" y1="96" x2="840" y2="116" stroke="dodgerblue" strokeWidth="2" />

            <line x1="50" y1="86" x2="50" y2="116" stroke="dodgerblue" strokeWidth="2" />
            <line x1="100" y1="96" x2="100" y2="116" stroke="dodgerblue" strokeWidth="2" />
            <LuxPlaces places={places} onSelectPlace={onSelectPlace} selectedPlaces={selectedPlaces} />
        </svg>
    );
}

export default LuxBody;
