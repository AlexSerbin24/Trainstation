import React from 'react'
import { Link } from 'react-router-dom'
import css from "./PersonalButtonLink.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-regular-svg-icons'
import useUser from '../../../hooks/useUser.ts'
import User from '../../../types/userContext.ts'


type Props = {
    user:User|null,
}

export default function PersonalButtonLink ({user}:Props) {
    const className = user ? 'authorized' : 'unauthorized';
    const buttonClass = css[className];
    return (

        <Link to={user ? "account" : "/account/login"} className={buttonClass}>
            <span style={{ marginRight: 10 }}>{user ? "Мій аккаунт":"Вхід"}</span>
            <FontAwesomeIcon icon={faUserCircle} size='xl' />
        </Link>
    )
}
