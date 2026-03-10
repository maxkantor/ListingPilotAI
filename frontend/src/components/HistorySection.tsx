import type { HistoryEntry } from '../types';
import styles from './HistorySection.module.css';

interface HistorySectionProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

export default function HistorySection({ entries, onSelect }: HistorySectionProps) {
  if (entries.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Recent Generations</h2>
      <div className={styles.list}>
        {entries.map((entry) => (
          <button
            key={entry.id}
            className={styles.item}
            onClick={() => onSelect(entry)}
          >
            <div className={styles.address}>
              {entry.property.streetAddress}
              {entry.property.city && `, ${entry.property.city}`}
              {entry.property.state && `, ${entry.property.state}`}
            </div>
            <div className={styles.meta}>
              <span className={styles.price}>{entry.property.price}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.date}>
                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
