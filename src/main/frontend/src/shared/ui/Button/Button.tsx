import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const buttonClassName = `ds-button ds-button-${variant} ${className}`;

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};
