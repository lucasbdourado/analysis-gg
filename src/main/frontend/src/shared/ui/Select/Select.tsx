import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string | boolean;
}

export const Select: React.FC<SelectProps> = ({ options, error, className = '', ...props }) => {
  const selectClassName = `ds-select ${error ? styles.error : ''} ${className}`;

  return (
    <div className={styles.wrapper}>
      <select className={selectClassName} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className={styles.option}>
            {option.label}
          </option>
        ))}
      </select>
      {typeof error === 'string' && error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
};
