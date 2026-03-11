import React from 'react';
import styles from './LegalPage.module.css';

export const TermsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.eyebrow}>Legal</div>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>
            These terms describe how ListingPilot AI may be used by agents, teams, and brokerages.
          </p>

          <section className={styles.section}>
            <h2>Platform access</h2>
            <p>Access is provided on a subscription basis. Customers are responsible for maintaining account security and ensuring authorized use by their teams.</p>
          </section>

          <section className={styles.section}>
            <h2>Acceptable use</h2>
            <ul>
              <li>Do not use the platform to create misleading or unlawful listing content.</li>
              <li>Review AI-generated outputs for accuracy, brokerage policy, and MLS compliance before publishing.</li>
              <li>Do not attempt to reverse engineer, disrupt, or abuse service infrastructure.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Service changes</h2>
            <p>We may update product functionality, limits, or pricing to improve service quality. Material changes are communicated through the platform or account contacts.</p>
          </section>

          <section className={styles.section}>
            <h2>Limitation of liability</h2>
            <p>ListingPilot AI provides workflow and content assistance. Customers remain responsible for their final marketing decisions, factual accuracy, and compliance obligations.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
