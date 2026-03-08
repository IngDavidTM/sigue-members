import React from 'react';
import styles from './AuthBanner.module.css';

interface AuthBannerProps {
    iconUrl?: string;
    iconNode?: React.ReactNode;
    title: string;
    subtitle?: string;
}

export function AuthBanner({ iconUrl, iconNode, title, subtitle }: AuthBannerProps) {
    return (
        <div className={styles.bannerContainer}>
            <div className={styles.stripeTop} />
            <div className={styles.stripeWhite}>
                <div className={styles.contentWrapper}>
                    <div className={styles.iconBox}>
                        {iconUrl ? (
                            <img src={iconUrl} alt="Icon" className={styles.imageIcon} />
                        ) : (
                            iconNode
                        )}
                    </div>
                    <div className={styles.textContainer}>
                        <h1 className={styles.title}>{title}</h1>
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                </div>
            </div>
            <div className={styles.stripeBottom} />
        </div>
    );
}
