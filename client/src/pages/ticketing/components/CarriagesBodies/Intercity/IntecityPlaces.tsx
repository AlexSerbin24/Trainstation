import React, { ReactElement } from 'react';
import { SelectedPlace } from '../../../../../types/trainInfo';
import { CarriagePlace } from '../../../../../types/train.ts';
import CarriagePlaceComponent from '../../CarriagePlace.tsx';
import PlaceState from '../../../../../types/placeState.ts';


type Props = {
    places: CarriagePlace[],
    onSelectPlace: (place: CarriagePlace) => void,
    selectedPlaces: SelectedPlace[]
}

const IntecityPlaces: React.FC<Props> = ({ places, onSelectPlace, selectedPlaces }) => {
    const bodiesPlaces: ReactElement[] = [];
    const isPlaceSelected = (place: CarriagePlace) => selectedPlaces.some(selected => selected.id === place.id);

    for (let i = 0, xUpper = 120, xLower = 135; i < 14; i++, xUpper += 44, xLower += 44) {
        bodiesPlaces.push(
            <>
                <CarriagePlaceComponent x={xUpper} y={7} state={isPlaceSelected(places[4 + (i * 4) - 1]) ?PlaceState.CHOSEN: places[4 + (i * 4) - 1].isOccupied?PlaceState.OCCUPIED:PlaceState.FREE} type='Intercity' number={4 + (i * 4)} width={25} height={25} onClick={() => onSelectPlace(places[4 + (i * 4) - 1])} />
                <CarriagePlaceComponent x={xUpper} y={37} state={isPlaceSelected(places[3 + (i * 4) - 1]) ?PlaceState.CHOSEN: places[3 + (i * 4) - 1].isOccupied?PlaceState.OCCUPIED:PlaceState.FREE}  type='Intercity' number={3 + (i * 4)} width={25} height={25} onClick={() => onSelectPlace(places[3 + (i * 4) - 1])} />
                <CarriagePlaceComponent x={xLower} y={107} state={isPlaceSelected(places[2 + (i * 4) - 1]) ?PlaceState.CHOSEN: places[2 + (i * 4) - 1].isOccupied?PlaceState.OCCUPIED:PlaceState.FREE}  type='Intercity' number={2 + (i * 4)} width={25} height={25} onClick={() => onSelectPlace(places[2 + (i * 4) - 1])} />
                <CarriagePlaceComponent x={xLower} y={137} state={isPlaceSelected(places[1 + (i * 4) - 1]) ?PlaceState.CHOSEN: places[1 + (i * 4) - 1].isOccupied?PlaceState.OCCUPIED:PlaceState.FREE}  type='Intercity' number={1 + (i * 4)} width={25} height={25} onClick={() => onSelectPlace(places[1 + (i * 4) - 1])} />
            </>
        );
    }

    return <>{bodiesPlaces}</>;
}

export default IntecityPlaces;
