import React, { InputHTMLAttributes, forwardRef } from 'react';
import classes from "./Input.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  labelName: string;
}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { labelName, ...inputProps } = props;

  return (
    <label>
      <span className={classes["label-name"]}>{labelName}</span>
      <input className={classes["input"]} {...inputProps} ref={ref} />
    </label>
  );
});

export default Input;