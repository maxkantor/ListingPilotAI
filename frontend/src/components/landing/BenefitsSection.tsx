import React from 'react';
import styles from './LandingSections.module.css';

const benefits = [
  {
    value: '30–60 min',
    label: 'saved per listing',
  },
  {
    value: '6 channels',
    label: 'generated instantly',
  },
  {
    value: 'MLS-safe',
    label: 'language by default',
  },
  {
    value: 'Consistent',
    label: 'professional quality copy',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Why Agents Love ListingPilot</h2>
        <p className={styles.sectionSubtitle}>
          Built for high-output listing teams that need speed, quality, and compliance in one workflow.
        </p>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <article key={benefit.value} className={styles.card}>
              <div className={styles.metric}>{benefit.value}</div>
              <p className={styles.metricSub}>{benefit.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};