import React, { useState, useEffect } from 'react';
import Modal from '../../Modal.tsx';
import CartTicket from './CartTicket.tsx';
import "./CartModal.css";
import Button from '../../../buttons/Button.tsx';
import { useCart } from '../../../../hooks/useCart.ts';
import CartService from '../../../../services/CartService.ts';
import useLoading from '../../../../hooks/useLoading.ts';
import Loader from '../../../loader/Loader.tsx';
import TicketService from '../../../../services/TicketService.ts';
import useUser from '../../../../hooks/useUser.ts';
import { UserContextType } from '../../../../types/userContext.ts';

type Props = {
    onClose: () => void;
};

const CartModal: React.FC<Props> = ({ onClose }) => {
    const [isBought, setIsBought] = useState(false);
    const { cart, setCart } = useCart();
    const userValue = useUser() as UserContextType;
    const [executeAsyncFunction, isLoading] = useLoading();

    useEffect(() => {
        if (isBought) {
            const timer = setTimeout(() => {
                setIsBought(false);
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isBought, onClose]);

    console.log(cart);

    const removeTicket = (key: string) => {
        setCart(prevState => prevState.filter(cart => cart.key !== key));
    };

    const handleRemoveTicketBtn = (key: string) => async (event: React.MouseEvent<HTMLButtonElement>) => {
        const response = await CartService.removeFromCart(key);
        if (response) {
            removeTicket(key);
        }
    };

    const handleClearCart = async () => {
        await executeAsyncFunction(async () => {
            const response = await CartService.clearCart(cart.map(cartItem => cartItem.key));
            if (response) setCart([]);
        });
    };

    const handleCheckout = async () => {
        await executeAsyncFunction(async () => {
            const response = await TicketService.buyTickets(userValue.user?.id as number, cart);
            if (response) {
                setCart([]);
                setIsBought(true);
            }
        });
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            {isBought ?
                <p>Квитки на потяг успішно куплені!</p>
                :
                <>
                    {isLoading && <Loader />}
                    <h2>Ваші білети</h2>
                    {cart.length === 0 ? (
                        <p>Кошик пустий</p>
                    ) : (
                        <div>
                            {cart.map(item => (
                                <CartTicket
                                    key={item.key}
                                    cartItem={item}
                                    handleRemoveTicketBtn={handleRemoveTicketBtn}
                                    onRemove={removeTicket}
                                />
                            ))}
                            <div className="cart-actions">
                                <Button className="checkout-btn" onClick={handleCheckout}>Оформити квитки</Button>
                                <Button className="clear-cart-btn" onClick={handleClearCart}>Очистити корзину</Button>
                            </div>
                        </div>
                    )}
                </>}
        </Modal>
    );
};

export default CartModal;
