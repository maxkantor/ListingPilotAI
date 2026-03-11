import React from 'react';
import styles from './LandingSections.module.css';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Simple Pricing</h2>
        <p className={styles.sectionSubtitle}>Choose the plan that fits your listing volume.</p>

        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <h3 className={styles.priceName}>FREE</h3>
            <p className={styles.priceAmount}>$0</p>
            <ul className={styles.priceList}>
              <li>3 listings per month</li>
              <li>Six-channel generation</li>
              <li>Basic support</li>
            </ul>
          </article>

          <article className={`${styles.priceCard} ${styles.featuredPrice}`}>
            <h3 className={styles.priceName}>PROFESSIONAL</h3>
            <p className={styles.priceAmount}>
              $29<span>/month</span>
            </p>
            <ul className={styles.priceList}>
              <li>Unlimited listings</li>
              <li>Six-channel generation</li>
              <li>Priority support</li>
            </ul>
          </article>

          <article className={styles.priceCard}>
            <h3 className={styles.priceName}>AGENCY</h3>
            <p className={styles.priceAmount}>
              $99<span>/month</span>
            </p>
            <ul className={styles.priceList}>
              <li>Team access</li>
              <li>Unlimited history</li>
              <li>Unlimited listings</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};