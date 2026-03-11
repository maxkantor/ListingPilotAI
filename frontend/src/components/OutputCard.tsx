import React, { useState } from 'react';
import styles from './OutputCard.module.css';

interface OutputCardProps {
  title: string;
  icon: string;
  content: string;
  platform?: string;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  title,
  icon,
  content,
  platform,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>{icon}</span>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {platform && <p className={styles.platform}>{platform}</p>}
          </div>
        </div>
        <button
          className={`${styles.copyBtn} ${copied ? styles['copyBtn--copied'] : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className={styles.content}>
        <p>{content}</p>
      </div>
    </div>
  );
};
