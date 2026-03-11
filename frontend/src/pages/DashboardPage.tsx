import React, { useEffect } from 'react';
import { PropertyForm } from '../components/PropertyForm';
import { OutputPanel } from '../components/OutputPanel';
import { useGenerator, useHistory } from '../hooks/useGenerator';
import type { PropertyInput } from '../types';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { output, isLoading, error, generate, reset } = useGenerator();
  const { history, refresh } = useHistory();

  useEffect(() => {
    refresh();
  }, []);

  const handleGenerate = async (property: PropertyInput) => {
    reset();
    await generate(property);
  };

  const handleRegenerate = () => {
    // Would regenerate with current property if we track it
    // For now, just show message
    alert('Please adjust property details and generate again.');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Property Marketing Generator</h1>
          <p>Turn listing details into polished copy across six channels in seconds.</p>
        </div>

        <div className={styles.grid}>
          {/* Left: Form */}
          <div className={styles.formColumn}>
            <PropertyForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Right: Output */}
          <div className={styles.outputColumn}>
            <OutputPanel
              output={output}
              isLoading={isLoading}
              error={error}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className={styles.historySection}>
            <h2 className={styles.historyTitle}>Recent Generations</h2>
            <div className={styles.historyGrid}>
              {history.slice(0, 8).map((item) => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <h4>{item.streetAddress}</h4>
                    <span className={styles.historyPrice}>${item.price}</span>
                  </div>
                  <p className={styles.historyLocation}>
                    {item.city}, {item.state}
                  </p>
                  <p className={styles.historyDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    className={styles.historyPreview}
                    onClick={() => {
                      alert(
                        'In a full implementation, this would load the previous generation.'
                      );
                    }}
                  >
                    View Copy →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
