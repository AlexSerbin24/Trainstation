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

export default getCarriageTypeName;