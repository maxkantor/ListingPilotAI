import React from 'react';
import styles from './LandingSections.module.css';

const pillars = [
  'MLS-safe language',
  'Fair housing aware',
  'Human-controlled data entry',
  'No scraping of listing sites',
];

export const ComplianceSection: React.FC = () => {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.complianceLayout}>
          <div>
            <h2 className={styles.sectionTitle}>Built for Real Estate Compliance</h2>
            <p className={styles.sectionSubtitle}>
              ListingPilot is designed for credibility-first marketing workflows where agents stay in control of the facts and the final publish step.
            </p>
          </div>

          <div className={styles.complianceGrid}>
            {pillars.map((pillar) => (
              <article key={pillar} className={styles.complianceCard}>
                <h3>{pillar}</h3>
                <p>Structured property inputs and controlled generation help teams move quickly without sacrificing listing quality.</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};