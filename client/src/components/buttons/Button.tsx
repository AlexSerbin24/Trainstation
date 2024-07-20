import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import classes from './Button.module.css'


interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}


export default function Button({ children, className, ...props }: Props) {
    const buttonClasses = [classes["app-button"]];

    if (className)
        buttonClasses.push(...className.split(" "));



    return (
        <button className={buttonClasses.join(" ")} {...props}>{children}</button>
    )
}
