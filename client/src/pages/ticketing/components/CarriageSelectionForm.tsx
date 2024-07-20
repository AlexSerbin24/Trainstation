import React, { useEffect, useState } from 'react';
import ReservedSeatBody from './CarriagesBodies/ReservedSeat/ReservedSeatBody.tsx';
import CoupeBody from './CarriagesBodies/Coupe/CoupeBody.tsx';
import LuxBody from './CarriagesBodies/Lux/LuxBody.tsx';
import IntercityBody from './CarriagesBodies/Intercity/IntercityBody.tsx';
import CarriageType from '../../../types/carriageType.ts';
import { CarriageInfo, SelectedPlace } from '../../../types/trainInfo.ts';
import { CarriagePlace } from '../../../types/train.ts';
import getCarriageTypeName from '../../../utils/getCarriageTypeName.ts';

type Props = {
    carriagesType: string[];
    carriages: CarriageInfo[];
    selectedCarriageType: string,
    selectedPlaces: SelectedPlace[];
    selectedCarriage: CarriageInfo | null,
    setSelectedCarriage: React.Dispatch<React.SetStateAction<CarriageInfo | null>>,
    setSelectedCarriageType: React.Dispatch<React.SetStateAction<string>>,
    handleSelectPlace: (place: CarriagePlace) => void,
    basePrice: number,
    updateTotalPrice: (price: number) => void
};

const CarriageSelectionForm: React.FC<Props> = ({ carriagesType, carriages, selectedPlaces, selectedCarriageType, selectedCarriage, setSelectedCarriage, setSelectedCarriageType, handleSelectPlace, basePrice, updateTotalPrice }) => {
    const filteredCarriages = carriages.filter(carriage => carriage.type === selectedCarriageType);

    useEffect(() => {
        let multiplier = 1;
        switch (selectedCarriageType) {
            case 'Reserved_seat':
                multiplier = 1.2;
                break;
            case 'Coupe':
                multiplier = 1.5;
                break;
            case 'LUX':
                multiplier = 2.0;
                break;
            case 'Intercity':
                multiplier = 1.3;
                break;
            default:
                break;
        }
        updateTotalPrice(basePrice * multiplier * selectedPlaces.length);
    }, [selectedCarriageType, selectedPlaces.length]);

    const renderCarriageBody = () => {
        if (!selectedCarriage) return null;
        const carriageProps = {
            places: selectedCarriage.carriagePlaces,
            onSelectPlace: handleSelectPlace,
            selectedPlaces
        };
        switch (selectedCarriage.type) {

            case 'Reserved_seat':
                return <ReservedSeatBody {...carriageProps} />;
            case 'Coupe':
                return <CoupeBody {...carriageProps} />;
            case 'LUX':
                return <LuxBody {...carriageProps} />;
            case 'Intercity':
                return <IntercityBody {...carriageProps} />;
            default:
                return null;
        }
    };



    return (
        <div>
            <h3>Виберіть вагон</h3>
            <div className='select-carriage-types-container'>
                <span style={{ alignSelf: 'center' }}>Тип вагону:</span>
                <div className='carriage-types'>
                    {carriagesType.map((type) => (
                        <div
                            key={type}
                            className={type === selectedCarriageType ? 'chosen' : ''}
                            onClick={() => {
                                setSelectedCarriageType(type);
                                setSelectedCarriage(null); // Сбрасываем выбранный вагон при смене типа вагона
                            }}
                        >
                            {getCarriageTypeName(type)}
                        </div>
                    ))}
                </div>
            </div>

            <div className='select-carriages-container'>
                {filteredCarriages.map((carriage) => (
                    <div
                        key={carriage.id}
                        className={carriage.carriageNumber == selectedCarriage?.carriageNumber? "carriage chosen":"carriage"}
                        onClick={() => setSelectedCarriage(carriage)}
                    >
                        <div style={{ padding: 10,width:28 }}>№{carriage.carriageNumber}</div>
                        <div style={{ width: 2, height: "100%", background: "#8ad77f", margin: "0 5px" }}></div>
                        <div style={{ padding: 2, width:170 }}>{carriage.carriagePlaces.filter(place => !place.isOccupied).length} вільних місць</div>
                    </div>
                ))}
            </div>

            {selectedCarriage &&
                <div className='select-places-container'>
                    <h3>Виберіть місце:</h3>
                    {renderCarriageBody()}
                </div>
            }

            {selectedPlaces.length !== 0 &&
                <div style={{ borderBottom: "2px solid lightgrey", paddingBottom: 15 }}>
                    <h3>Вибрані місця:</h3>
                    <div>
                        {selectedPlaces.map((place, index) => (
                            <div key={index} style={{marginBottom:15}}>
                                Пасажир {index + 1}: <span style={{ display: "inline-block", marginLeft: 5, border: "1px solid gray", borderRadius: 50, padding: "8px 12px" }}>
                                    Вагон №{place.carriageNumber}, {getCarriageTypeName(place.carriageType)}, місце {place.number}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default CarriageSelectionForm;
