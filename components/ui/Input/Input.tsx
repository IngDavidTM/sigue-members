import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    onIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, icon, onIconClick, id, ...props }, ref) => {
        const generatedId = id || React.useId();

        return (
            <div className={`${styles.wrapper} ${className}`}>
                {label && (
                    <label htmlFor={generatedId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={styles.inputContainer}>
                    <input
                        id={generatedId}
                        ref={ref}
                        className={`${styles.input} ${error ? styles.inputError : ''}`}
                        {...props}
                    />
                    {icon && (
                        <button
                            type="button"
                            className={`${styles.iconButton} ${!onIconClick ? styles.iconStatic : ''}`}
                            onClick={onIconClick}
                            tabIndex={onIconClick ? 0 : -1}
                            disabled={!onIconClick}
                        >
                            {icon}
                        </button>
                    )}
                </div>
                {error && <p className={styles.errorText}>{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
