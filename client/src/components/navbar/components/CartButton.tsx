import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import './CartButton.css';
import { useCart } from '../../../hooks/useCart.ts';

type Props = {
    onClick: () => void;
};

const CartButton: React.FC<Props> = ({ onClick }) => {

    const {cart} = useCart()
    return (
        
        <button className="cart-button" onClick={onClick}>
            <FontAwesomeIcon icon={faCartShopping} size="2x" />
            <span className="ticket-count">{cart.length}</span>
        </button>
    );
};

export default CartButton;