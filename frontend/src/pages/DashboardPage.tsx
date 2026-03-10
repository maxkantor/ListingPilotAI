import { useEffect, useState } from 'react';
import PropertyForm from '../components/PropertyForm';
import OutputCard from '../components/OutputCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import HistorySection from '../components/HistorySection';
import { useGenerate } from '../hooks/useGenerate';
import { getHistory } from '../services/api';
import type { GeneratedContent, HistoryEntry, PropertyInput } from '../types';
import styles from './DashboardPage.module.css';

const OUTPUT_KEYS: (keyof GeneratedContent)[] = [
  'mlsDescription',
  'luxuryDescription',
  'facebookPost',
  'instagramCaption',
  'linkedInPost',
  'emailBlurb',
];

export default function DashboardPage() {
  const { content, isLoading, error, generate, loadSample, clearError } = useGenerate();
  const [sampleData, setSampleData] = useState<PropertyInput | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => {
        // History is non-critical; fail silently
      });
  }, [content]); // Refresh history after new generation

  const handleLoadSample = async () => {
    const sample = await loadSample();
    if (sample) setSampleData(sample);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setSampleData(entry.property);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <h1 className={styles.pageTitle}>Generate Listing Content</h1>
          <p className={styles.pageSubtitle}>
            Fill in your property details and get six ready-to-use marketing pieces in seconds.
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: Form */}
        <aside className={styles.formColumn}>
          <PropertyForm
            onSubmit={generate}
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
            sampleData={sampleData}
          />
        </aside>

        {/* Right: Outputs */}
        <main className={styles.outputColumn}>
          {error && (
            <div className={styles.errorBanner}>
              <span>⚠️ {error}</span>
              <button className={styles.errorDismiss} onClick={clearError}>×</button>
            </div>
          )}

          {isLoading && <LoadingSkeleton count={6} />}

          {!isLoading && !content && !error && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⬡</div>
              <h2 className={styles.emptyTitle}>Ready to generate</h2>
              <p className={styles.emptyText}>
                Fill in the property details on the left, then click{' '}
                <strong>Generate Content</strong> to create six platform-ready
                marketing pieces.
              </p>
              <p className={styles.emptyTip}>
                New here? Hit <strong>Load Sample</strong> to see it in action.
              </p>
            </div>
          )}

          {!isLoading && content && (
            <>
              <div className={styles.outputsHeader}>
                <h2 className={styles.outputsTitle}>Generated Content</h2>
                <span className={styles.outputsCount}>{OUTPUT_KEYS.length} pieces</span>
              </div>
              <div className={styles.outputGrid}>
                {OUTPUT_KEYS.map((key) => (
                  <OutputCard key={key} type={key} content={content[key]} />
                ))}
              </div>
            </>
          )}

          <HistorySection entries={history} onSelect={handleHistorySelect} />

          <p className={styles.disclaimer}>
            <strong>Fair Housing Notice:</strong> Always review AI-generated content before
            publishing. Ensure all copy complies with the Fair Housing Act and your local MLS rules.
          </p>
        </main>
      </div>
    </div>
  );
}
