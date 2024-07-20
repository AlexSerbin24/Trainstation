import React from 'react';
import Train from '../../../../types/train';
import TrainActions from './TrainActions.tsx';

interface TrainTableProps {
    trains: Train[];
}

const TrainTable: React.FC<TrainTableProps> = ({ trains }) => {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Номер потяга</th>
                    <th>Статус</th>
                    <th>Тип</th>
                    <th>Операції</th>
                </tr>
            </thead>
            <tbody>
                {trains.length === 0 ?
                    <tr>
                        <td style={{textAlign:"center"}} colSpan={10}>
                            Немає рейсів
                        </td>
                    </tr>
                    :
                    trains.map(train => (
                        <tr key={train.id}>
                            <td>{train.trainNumber}</td>
                            <td>{train.trainStatus}</td>
                            <td>{train.trainType}</td>
                            <td>
                                <TrainActions trainId={train.id} />
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default TrainTable;
