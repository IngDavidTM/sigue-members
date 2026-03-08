import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'text';
    fullWidth?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    children,
    className = '',
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    icon,
    disabled,
    ...props
}: ButtonProps) {
    const rootClassName = [
        styles.button,
        styles[variant],
        fullWidth ? styles.fullWidth : '',
        isLoading ? styles.loading : '',
        className
    ].join(' ').trim();

    return (
        <button
            className={rootClassName}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className={styles.spinner}></span>
            ) : (
                <>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <span className={styles.content}>{children}</span>
                </>
            )}
        </button>
    );
}
