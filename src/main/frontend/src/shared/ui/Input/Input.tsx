import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

export const Input: React.FC<InputProps> = ({ error, className = '', ...props }) => {
  const inputClassName = `ds-input ${error ? styles.error : ''} ${className}`;
  
  return (
    <div className={styles.wrapper}>
      <input className={inputClassName} {...props} />
      {typeof error === 'string' && error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
};
