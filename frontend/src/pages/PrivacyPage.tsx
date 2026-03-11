import React from 'react';
import styles from './LegalPage.module.css';

export const PrivacyPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.eyebrow}>Legal</div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            ListingPilot AI is built for professional teams. We keep data handling clear, minimal, and aligned with platform operations.
          </p>

          <section className={styles.section}>
            <h2>Information we collect</h2>
            <p>We collect account information, workspace usage data, property inputs, generated outputs, and support interactions needed to operate the service.</p>
          </section>

          <section className={styles.section}>
            <h2>How we use data</h2>
            <ul>
              <li>Provide AI-assisted content generation and account administration.</li>
              <li>Measure product performance, activation, and service reliability.</li>
              <li>Improve onboarding, support, and security monitoring.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Analytics and tracking</h2>
            <p>We may use analytics tooling such as GA4 to understand page traffic, product adoption, and conversion paths. This data is used to improve product experience and marketing efficiency.</p>
          </section>

          <section className={styles.section}>
            <h2>Data retention</h2>
            <p>We retain data only as long as required for service delivery, legal obligations, and legitimate business operations such as security review and product analytics.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
