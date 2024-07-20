import React from 'react'
import { Link } from 'react-router-dom'
import PersonalButtonLink from './PersonalButtonLink.tsx'
import classes from "./NavbarLinks.module.css"
import CartButton from './CartButton.tsx'
import useUser from '../../../hooks/useUser.ts'
import LogoutButton from './LogoutButton.tsx'


type Props = {
    onClick: () => void;
};
export default function NavbarLinks({onClick }: Props) {
    const userValue = useUser();

    return (
        <div className={classes["navbar-links"]}>
            <Link to={"/chat"}>Чат </Link>
            <Link to={"/account/bookings"}>Мої білети</Link>

            {!userValue || !userValue.user && <Link to={"/account/registration"}>Реєстрація</Link>}
            <CartButton onClick={onClick} />
            <PersonalButtonLink user={userValue ? userValue.user : null} />
            {userValue && userValue.user && <LogoutButton></LogoutButton>}
        </div>
    )
}
