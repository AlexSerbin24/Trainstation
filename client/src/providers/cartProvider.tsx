import React, { createContext, useState, useContext } from 'react';
import CartItem from '../types/cartItem.ts';
import CartContextType from '../types/cartContext.ts';

interface CartProviderProps {
    children: React.ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    return (
        <CartContext.Provider value={{ cart, setCart}}>
            {children}
        </CartContext.Provider>
    );
};

export {CartContext, CartProvider}