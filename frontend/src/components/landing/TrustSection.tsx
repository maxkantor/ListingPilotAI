import React from 'react';
import styles from './LandingSections.module.css';

const pillars = [
  'MLS-safe language',
  'Fair housing aware',
  'Human-controlled data entry',
  'No scraping of listing sites',
];

export const TrustSection: React.FC = () => {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Built for Real Estate Compliance</h2>
        <p className={styles.sectionSubtitle}>
          Enterprise-grade standards designed to protect listing quality, brand credibility, and publication safety.
        </p>

        <div className={styles.trustGrid}>
          {pillars.map((pillar) => (
            <article key={pillar} className={styles.card}>
              <h3>{pillar}</h3>
              <p>
                ListingPilot keeps generated copy grounded in your submitted property facts and aligned with compliant
                language practices.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};