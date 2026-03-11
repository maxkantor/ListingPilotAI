import React from 'react';
import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.header}>
            <div className={styles.row}>
              <div className={`${styles.pulse} ${styles.circle}`} />
              <div>
                <div className={`${styles.pulse} ${styles.title}`} />
                <div className={`${styles.pulse} ${styles.sub}`} />
              </div>
            </div>
            <div className={`${styles.pulse} ${styles.btn}`} />
          </div>
          <div className={styles.body}>
            <div className={`${styles.pulse} ${styles.line}`} />
            <div className={`${styles.pulse} ${styles.line} ${styles['line--short']}`} />
            <div className={`${styles.pulse} ${styles.line}`} />
            <div className={`${styles.pulse} ${styles.line} ${styles['line--medium']}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
