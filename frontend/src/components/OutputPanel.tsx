import React from 'react';
import type { GeneratedOutput } from '../types';
import { OutputCard } from './OutputCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { Button } from './Button';
import styles from './OutputPanel.module.css';

interface OutputPanelProps {
  output: GeneratedOutput | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

const OUTPUT_CONFIGS = [
  {
    key: 'mlsDescription' as keyof GeneratedOutput,
    title: 'MLS Description',
    icon: '🏷️',
    platform: 'MLS / Real Estate Portals',
  },
  {
    key: 'luxuryDescription' as keyof GeneratedOutput,
    title: 'Luxury Description',
    icon: '✨',
    platform: 'Premium Marketing',
  },
  {
    key: 'facebookPost' as keyof GeneratedOutput,
    title: 'Facebook Post',
    icon: '📘',
    platform: 'Facebook',
  },
  {
    key: 'instagramCaption' as keyof GeneratedOutput,
    title: 'Instagram Caption',
    icon: '📸',
    platform: 'Instagram',
  },
  {
    key: 'linkedInPost' as keyof GeneratedOutput,
    title: 'LinkedIn Post',
    icon: '💼',
    platform: 'LinkedIn',
  },
  {
    key: 'emailBlurb' as keyof GeneratedOutput,
    title: 'Email Blurb',
    icon: '📧',
    platform: 'Email / Newsletter',
  },
];

export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  isLoading,
  error,
  onRegenerate,
}) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);

  const exportAll = () => {
    if (!output) {
      return;
    }

    const content = OUTPUT_CONFIGS.map((config) => `${config.title}\n\n${output[config.key]}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'listingpilot-assets.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const saveWorkspace = () => {
    setSaveMessage('Saved to workspace');
    window.setTimeout(() => setSaveMessage(null), 1800);
  };

  if (isLoading) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Generated Copy</h2>
          <span className={styles.generating}>
            <span className={styles.dot} />
            Generating...
          </span>
        </div>
        <div className={styles.panelBody}>
          <LoadingSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Generated Copy</h2>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Generation Failed</h3>
            <p>{error}</p>
            <Button variant="primary" onClick={onRegenerate}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!output) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Generated Copy</h2>
        </div>
        <div className={styles.panelBody}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✦</div>
            <h3 className={styles.emptyTitle}>Ready to Generate</h3>
            <p className={styles.emptyText}>
              Fill in the property details on the left and click{' '}
              <strong>Generate Marketing Copy</strong> to create six pieces of
              polished marketing content instantly.
            </p>
            <ul className={styles.emptyList}>
              {OUTPUT_CONFIGS.map((c) => (
                <li key={c.key}>
                  <span>{c.icon}</span>
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Generated Copy</h2>
          {saveMessage && <span className={styles.saveState}>{saveMessage}</span>}
        </div>
        <div className={styles.actionRow}>
          <Button variant="ghost" size="sm" onClick={() => setIsFavorite((current) => !current)}>
            {isFavorite ? '★ Favorited' : '☆ Favorite'}
          </Button>
          <Button variant="ghost" size="sm" onClick={saveWorkspace}>Save</Button>
          <Button variant="ghost" size="sm" onClick={exportAll}>Export</Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            leftIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
              </svg>
            }
          >
            Regenerate
          </Button>
        </div>
      </div>
      <div className={styles.panelBody}>
        <div className={styles.outputGrid}>
          {OUTPUT_CONFIGS.map((config) => (
            <OutputCard
              key={config.key}
              title={config.title}
              icon={config.icon}
              content={output[config.key]}
              platform={config.platform}
            />
          ))}
        </div>
        <div className={styles.complianceNote}>
          <span className={styles.complianceIcon}>ℹ️</span>
          <p>
            <strong>Compliance Note:</strong> AI-generated content should be reviewed for accuracy
            and MLS compliance before publishing. Verify all factual claims, school information,
            and property details prior to use.
          </p>
        </div>
      </div>
    </div>
  );
};
