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
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Agents Love ListingPilot</h2>
          <p className={styles.sectionSubtitle}>
            Built to compress the time between receiving a listing and launching a complete marketing push.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <article key={benefit.value} className={styles.benefitCard}>
              <div className={styles.metric}>{benefit.value}</div>
              <p className={styles.metricSub}>{benefit.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};