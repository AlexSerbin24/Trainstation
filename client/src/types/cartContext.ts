import CartItem from "./cartItem";
import { Dispatch, SetStateAction } from "react";
export default interface CartContextType {
    cart: CartItem[];

    setCart:Dispatch<SetStateAction<CartItem[]>>
}