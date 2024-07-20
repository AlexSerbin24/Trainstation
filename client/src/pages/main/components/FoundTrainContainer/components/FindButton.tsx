import React from 'react';
import DefaultButton from '../../../../../components/buttons/defaultButton/DefaultButton.tsx';

type Props = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FindButton: React.FC<Props> = ({ onClick }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <DefaultButton className='find-trains-btn' onClick={onClick}>Знайти рейс</DefaultButton>
        </div>
    );
};

export default FindButton;
