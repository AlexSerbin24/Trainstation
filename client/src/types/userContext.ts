import { Dispatch, SetStateAction } from "react";
import UserData from "./userData";

type User = Omit<UserData,"accessToken">

export interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

export default User;