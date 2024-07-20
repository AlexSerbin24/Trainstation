import React from 'react';
import Button from '../../../../../components/buttons/Button.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSyncAlt } from '@fortawesome/free-solid-svg-icons';


type Props = {
    isRoundTrip: boolean,
    setIsRoundTrip: React.Dispatch<React.SetStateAction<boolean>>
}
const TravelTypeContainer: React.FC<Props> = ({ isRoundTrip, setIsRoundTrip }) => {
    const singleTripClasses = ["travel-type-btn"];
    const roundTripClasses = ["travel-type-btn"];

    isRoundTrip ? roundTripClasses.push("active") : singleTripClasses.push("active");


    const onSingleTripBtnClickHandler = (event: React.MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault();
        setIsRoundTrip(false);
    }

    const onRoundTripBtnClickHandler = (event: React.MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault();
        setIsRoundTrip(true);
    }


    return (
        <div className='travel-type-container'>
            <div>
                <Button className={singleTripClasses.join(" ")} onClick={onSingleTripBtnClickHandler}>
                    <FontAwesomeIcon icon={faArrowRight} />
                    <span style={{ marginLeft: 8 }}>
                        Разовий рейс
                    </span>
                </Button>
            </div>

            <div>
                <Button className={roundTripClasses.join(" ")} onClick={onRoundTripBtnClickHandler}>
                    <FontAwesomeIcon icon={faSyncAlt} />
                    <span style={{ marginLeft: 8 }}>
                        Туди й назад
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default TravelTypeContainer;
