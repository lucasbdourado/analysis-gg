import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  const buttonClassName = `${styles.button} ${className}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};
