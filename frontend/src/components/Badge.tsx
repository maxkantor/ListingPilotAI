import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {children}
    </span>
  );
};
