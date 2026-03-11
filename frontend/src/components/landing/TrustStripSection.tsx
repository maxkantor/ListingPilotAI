import React from 'react';
import styles from './LandingV2.module.css';

const proofs = [
  'MLS-safe language built into every prompt flow',
  'Multi-channel output for MLS, social, and email',
  'Launch new listings without copy-pasting between tools',
  'Built for agents, marketing coordinators, and teams',
];

export const TrustStripSection: React.FC = () => {
  return (
    <section className={styles.trustStripSection}>
      <div className="container">
        <div className={styles.trustStrip}>
          {proofs.map((proof) => (
            <div key={proof} className={styles.trustStripItem}>
              <span>✦</span>
              <span>{proof}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
