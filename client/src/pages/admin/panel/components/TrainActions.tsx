import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons';
import LightBlueButton from "../../../../components/buttons/lightBlueButton/LightBlueButton.tsx"
import React from 'react';

interface TrainActionsProps {
    trainId: number;
}

const TrainActions: React.FC<TrainActionsProps> = ({ trainId }) => {
    const handleUpdate = () => {

    };

    const handleDelete = () => {

    };

    const handleDetails = () => {

    };

    return (
        <div className='actions-btns-container'>
            <FontAwesomeIcon icon={faEdit} color="#2B8DD4" size='xl' onClick={handleUpdate} />
            <FontAwesomeIcon icon={faTrash} color='#A80A00' size='xl' onClick={handleDelete} />
            <LightBlueButton className='action-button-details' onClick={handleDetails}>Деталі</LightBlueButton>
        </div>
    );
};

export default TrainActions;
