import React from 'react';
import styles from './LandingV2.module.css';

const pillars = [
  {
    title: 'MLS description generator',
    items: ['Compliance-aware prompt framing', 'Luxury and professional tone control', 'Believable, grounded copy'],
  },
  {
    title: 'Multi-channel campaign engine',
    items: ['Instagram, Facebook, LinkedIn, email', 'Listing-specific variations', 'Copy and export actions'],
  },
  {
    title: 'Team workflow and CRM readiness',
    items: ['Saved history and favorites', 'Lead stages and admin visibility', 'Usage, billing, and audit hooks'],
  },
];

export const FeatureDepthSection: React.FC = () => {
  return (
    <section id="features" className={styles.sectionTight}>
      <div className="container">
        <div className={styles.featureDepthShell}>
          <div className={styles.sectionHeaderWide}>
            <span className={styles.eyebrow}>Product depth</span>
            <h2 className={styles.title}>Everything serious agents need to launch fast and look polished.</h2>
            <p className={styles.subtitle}>
              Go beyond one-button content generation with reusable launch systems, saved assets, and business-grade controls.
            </p>
          </div>

          <div className={styles.featureDepthGrid}>
            {pillars.map((pillar) => (
              <article key={pillar.title} className={styles.featureDepthCard}>
                <h3>{pillar.title}</h3>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}><span>✓</span><span>{item}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
