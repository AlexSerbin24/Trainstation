import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import classes from './LightBlueButton.module.css';
import Button from '../Button.tsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function LightBlueButton({ children, className, ...props }: Props) {
  const buttonClasses = [classes["light-blue-button"]];

  if (className) {
    buttonClasses.push(...className.split(" "));
  }

  return (
    <Button className={buttonClasses.join(" ")} {...props}>
      {children}
    </Button>
  );
}