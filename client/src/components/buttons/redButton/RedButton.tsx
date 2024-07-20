import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classes from './RedButton.module.css';
import Button from '../Button.tsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function RedButton({ children, className, ...props }: Props) {
  const buttonClasses = [classes["red-button"]];

  if (className) {
    buttonClasses.push(...className.split(" "));
  }

  return (
    <Button className={buttonClasses.join(" ")} {...props}>
      {children}
    </Button>
  );
}
