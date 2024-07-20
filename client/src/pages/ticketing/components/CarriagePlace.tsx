import React from 'react';
import PlaceState from '../../../types/placeState.ts';



type Props = {
    state: PlaceState;
    number: number;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    onClick?: () => void;
}

const commonCarriages = ['Reserved_seat', 'Coupe', 'Lux'];

const CarriagePlace: React.FC<Props> = ({ state, number, type, x, y, width, height, onClick }) => {
    const lineOffset = height * 0.84; // Adjust line position based on height
    const textY = y + height * 0.72; // Center text vertically

    const getColor = (state: PlaceState) => {
        switch (state) {
            case PlaceState.OCCUPIED:
                return { fill: "grey", stroke: "grey" };
            case PlaceState.CHOSEN:
                return { fill: "orange", stroke: "orange" };
            case PlaceState.FREE:
            default:
                return { fill: "dodgerblue", stroke: "dodgerblue" };
        }
    };

    const { fill, stroke } = getColor(state);

    return (
        <>
            <rect 
                x={x} 
                y={y} 
                width={width} 
                height={height} 
                fill={fill} 
                stroke={stroke} 
                strokeWidth="2" 
                onClick={onClick}
                style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickability
            />
            <text 
                x={x + width / 2} 
                y={textY} 
                fontFamily="Arial" 
                fontSize={14} 
                fill="white" 
                textAnchor="middle" 
                fontWeight="bold"
                style={{ pointerEvents: 'none' }} // Prevent text from capturing click events
            >
                {number}
            </text>

            {commonCarriages.includes(type) && number % 2 !== 0
                ? 
                <line 
                    x1={x + width * 0.12} 
                    y1={y + lineOffset} 
                    x2={x + width * 0.88} 
                    y2={y + lineOffset} 
                    stroke="white" 
                    strokeWidth="2" 
                />
                : 
                <line 
                    x1={x + width * 0.12} 
                    y1={y + height * 0.16} 
                    x2={x + width * 0.88} 
                    y2={y + height * 0.16} 
                    stroke="white" 
                    strokeWidth="2" 
                />
            }
        </>
    )
}

export default CarriagePlace;
