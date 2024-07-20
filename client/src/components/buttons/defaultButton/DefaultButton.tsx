import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import classes from './DefaultButton.module.css'
import Button from '../Button.tsx';


interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
}


export default function DefaultButton({ children, className, ...props }: Props) {

    const buttonClasses = [classes["default-button"]];

    if (className)
        buttonClasses.push(...className.split(" "));


    return (
        <Button className={buttonClasses.join(" ")} {...props}>{children}</Button>
    )
}
