import React from 'react';
import styles from './AuthBanner.module.css';

interface AuthBannerProps {
    iconUrl?: string;
    iconNode?: React.ReactNode;
    title: string;
    subtitle?: string;
    iconShape?: 'square' | 'circle';
}

export function AuthBanner({ iconUrl, iconNode, title, subtitle, iconShape = 'square' }: AuthBannerProps) {
    return (
        <div className={styles.bannerContainer}>
            <div className={styles.stripeTop} />
            <div className={styles.stripeWhite}>
                <div className={styles.contentWrapper}>
                    <div className={styles.iconBox}>
                        {iconUrl ? (
                            <img src={iconUrl} alt="Icon" className={styles.imageIcon} />
                        ) : (
                            <div className={`${styles.iconInner} ${iconShape === 'circle' ? styles.iconInnerCircle : ''}`}>
                                {iconNode}
                            </div>
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
