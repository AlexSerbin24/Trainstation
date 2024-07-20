import React, { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import User, { UserContextType } from "../types/userContext.ts";

const UserContext = createContext<UserContextType | null>(null);

type Props = {
    children: ReactNode
}
const UserProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
