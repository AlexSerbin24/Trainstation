import React, { ReactElement } from 'react';
import { SelectedPlace } from '../../../../../types/trainInfo.ts';
import { CarriagePlace } from '../../../../../types/train.ts';
import CarriagePlaceComponent from '../../CarriagePlace.tsx';
import PlaceState from '../../../../../types/placeState.ts';

type Props = {
    places: CarriagePlace[],
    onSelectPlace: (place: CarriagePlace) => void,
    selectedPlaces: SelectedPlace[]
}

const LuxPlaces: React.FC<Props> = ({ places, onSelectPlace, selectedPlaces }) => {
    const isPlaceSelected = (place: CarriagePlace) => selectedPlaces.some(selected => selected.id === place.id);

    const bodiesElements: ReactElement[] = [];

    for (let i = 0, x = 140; i < 10; i++, x += 65) {
        if (i === 0) bodiesElements.push(<path key={`path-start-${i}`} d={`M ${x} 4 V 80 H ${x + 20}`} fill="none" stroke="dodgerblue" strokeWidth="2" strokeLinecap="square" />);
        else bodiesElements.push(<path key={`path-${i}`} d={`M ${x} 4 V 80 H ${x - 20} ${x + 20}`} fill="none" stroke="dodgerblue" strokeWidth="2" strokeLinecap="square" />);

        const positions = [
            { x: x + 3, y: 7, index: 1 + i * 2 },
            { x: x + 37, y: 7, index: 2 + i * 2 },
        ];

        positions.forEach(({ x, y, index }) => {
            const place = places.find(place => place.number === index);
            if (place) {
                bodiesElements.push(
                    <CarriagePlaceComponent
                        key={`place-${index}`}
                        x={x}
                        y={y}
                        state={isPlaceSelected(place)?PlaceState.CHOSEN: place.isOccupied?PlaceState.OCCUPIED:PlaceState.FREE}
                        type='Lux'
                        number={index}
                        width={25}
                        height={50}
                        onClick={() => onSelectPlace(place)}
                    />
                );
            }
        });

        if (i === 9) bodiesElements.push(<path key={`path-end-${i}`} d={`M ${x + 65} 4 V 80 H ${x + 40}`} fill="none" stroke="dodgerblue" strokeWidth="2" strokeLinecap="square" />);
    }

    return <>{bodiesElements}</>;
}

export default LuxPlaces;
