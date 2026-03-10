import { useState } from 'react';
import type { GeneratedContent } from '../types';
import styles from './OutputCard.module.css';

const OUTPUT_LABELS: Record<keyof GeneratedContent, string> = {
  mlsDescription: 'MLS Description',
  luxuryDescription: 'Luxury Description',
  facebookPost: 'Facebook Post',
  instagramCaption: 'Instagram Caption',
  linkedInPost: 'LinkedIn Post',
  emailBlurb: 'Email Blurb',
};

const OUTPUT_ICONS: Record<keyof GeneratedContent, string> = {
  mlsDescription: '🏠',
  luxuryDescription: '✨',
  facebookPost: '📘',
  instagramCaption: '📷',
  linkedInPost: '💼',
  emailBlurb: '✉️',
};

interface OutputCardProps {
  type: keyof GeneratedContent;
  content: string;
}

export default function OutputCard({ type, content }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon}>{OUTPUT_ICONS[type]}</span>
          <h3 className={styles.title}>{OUTPUT_LABELS[type]}</h3>
        </div>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.content}>{content}</p>
      </div>
    </div>
  );
}
