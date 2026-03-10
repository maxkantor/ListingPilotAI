import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.header}>
            <div className={styles.skeletonLine} style={{ width: '40%', height: '14px' }} />
            <div className={styles.skeletonLine} style={{ width: '60px', height: '28px' }} />
          </div>
          <div className={styles.body}>
            <div className={styles.skeletonLine} style={{ width: '100%', height: '12px', marginBottom: '8px' }} />
            <div className={styles.skeletonLine} style={{ width: '95%', height: '12px', marginBottom: '8px' }} />
            <div className={styles.skeletonLine} style={{ width: '88%', height: '12px', marginBottom: '8px' }} />
            <div className={styles.skeletonLine} style={{ width: '60%', height: '12px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
