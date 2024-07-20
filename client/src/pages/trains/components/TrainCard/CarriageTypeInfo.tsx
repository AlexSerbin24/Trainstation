import React from 'react';
import CarriageType from '../../../../types/carriageType.ts';

interface Props {
    trainId: number;
    carriageType: CarriageType;
}

const getCarriageTypeName = (type: string): string => {
    switch (type) {
        case 'Reserved_seat':
            return 'Плацкарт';
        case 'Coupe':
            return 'Купе';
        case 'LUX':
            return 'Люкс';
        case 'Intercity':
        case 'Intercity_head':
            return 'Интерсити';
        default:
            return type;
    }
};

const CarriageTypeInfo: React.FC<Props> = ({ trainId, carriageType }) => {
    const carriageTypeName = getCarriageTypeName(carriageType.type);

    return (
        <div className="class-info-card">
            <div>
                <p>{carriageTypeName}</p>
            </div>
            <div>
                <p>{carriageType.notOccupiedCount} місць</p>
            </div>
        </div>
    );
};

export default CarriageTypeInfo;
