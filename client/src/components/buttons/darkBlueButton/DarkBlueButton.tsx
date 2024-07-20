import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classes from './DarkBlueButton.module.css';
import Button from '../Button.tsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function DarkBlueButton({ children, className, ...props }: Props) {
  const buttonClasses = [classes["dark-blue-button"]];

  if (className) {
    buttonClasses.push(...className.split(" "));
  }

  return (
    <Button className={buttonClasses.join(" ")} {...props}>
      {children}
    </Button>
  );
}