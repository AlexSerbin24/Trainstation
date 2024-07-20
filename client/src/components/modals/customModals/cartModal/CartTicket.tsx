import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../buttons/Button.tsx';
import CartItem from '../../../../types/cartItem.ts';

type Props = {
    cartItem: CartItem;
    handleRemoveTicketBtn:(key: string)=> (event: React.MouseEvent<HTMLButtonElement>)  => Promise<void>
    onRemove: (id: string) => void;
};

const CartTicket: React.FC<Props> = ({ cartItem, handleRemoveTicketBtn, onRemove }) => {

    

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const bookTime = new Date(cartItem.bookDate).getTime();
            const timeElapsed = now - bookTime;
            const timeRemaining = 15 * 60 * 1000 - timeElapsed;
            return Math.max(timeRemaining, 0);
        };

        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft <= 0) {
                onRemove(cartItem.key);
                clearInterval(intervalId);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [cartItem.bookDate, cartItem.key, onRemove]);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const extraServices = cartItem.ticket.extraServices && cartItem.ticket.extraServices.length > 0 
        ? cartItem.ticket.extraServices.map(service=>service.name).join(', ') 
        : "Додаткові послуги не були замовлені";


        console.log(cartItem.ticket.extraServices)
    return (
        <div className="ticket-item">
            <h3>Рейс: {cartItem.ticket.trainNumber}</h3>
            <div className="ticket-info">
                <div>
                    <p><span style={{ fontWeight: 'bold' }}>Звідки:</span> {cartItem.ticket.departurePoint}</p>
                    <p><span style={{ fontWeight: 'bold' }}>Куди:</span> {cartItem.ticket.arrivalPoint}</p>
                </div>
                <div>
                    <p><span style={{ fontWeight: 'bold' }}>Дата виїзду:</span> {new Date(cartItem.ticket.departureDate).toLocaleDateString()}</p>
                    <p><span style={{ fontWeight: 'bold' }}>Дата прибуття:</span> {new Date(cartItem.ticket.arrivalDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p><span style={{ fontWeight: 'bold' }}>Номер вагона:</span> {cartItem.ticket.carriageNumber}</p>
                    {/* <p><span style={{ fontWeight: 'bold' }}>Тип вагона:</span> {cartItem.ticket.carriageType}</p> */}
                </div>
                <div>
                    <p><span style={{ fontWeight: 'bold' }}>Номер місця:</span> {cartItem.ticket.placeNumber}</p>
                    <p><span style={{ fontWeight: 'bold' }}>Додаткові послуги:</span> {extraServices}</p>
                </div>
                <div>
                    <p><span style={{ fontWeight: 'bold' }}>Ціна:</span> {cartItem.ticket.totalPrice} грн.</p>
                    <p><span style={{ fontWeight: 'bold' }}>Час до видалення:</span> {formatTime(timeLeft)}</p>
                    <Button className='remove-ticket-btn' onClick={handleRemoveTicketBtn(cartItem.key)}>
                        <FontAwesomeIcon icon={faTrash} size='2xl' color='#b81a1a'/>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartTicket;
