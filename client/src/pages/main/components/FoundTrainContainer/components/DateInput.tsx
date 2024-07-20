import React from 'react';
import Input from '../../../../../components/input/Input.tsx';

type Props = {
    dateRef: React.RefObject<HTMLInputElement>;
}

const DateInput: React.FC<Props> = ({ dateRef }) => {
    return (
        <div>
            <Input ref={dateRef} labelName='Дата' type='date' style={{ border: 0, padding: "10px 0" }} />
        </div>
    );
};

export default DateInput;
