import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingSections.module.css';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Simple Pricing</h2>
          <p className={styles.sectionSubtitle}>Clear plans for individual agents, growing teams, and agencies.</p>
        </div>

        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <h3 className={styles.priceName}>FREE</h3>
            <p className={styles.priceAmount}>$0</p>
            <ul className={styles.priceList}>
              <li>3 listings per month</li>
              <li>Six-channel generation</li>
              <li>Basic support</li>
            </ul>
            <Link to="/dashboard" className={styles.secondaryPriceButton}>Start free</Link>
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
            <Link to="/dashboard" className={styles.primaryPriceButton}>Start free trial</Link>
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
            <Link to="/dashboard" className={styles.secondaryPriceButton}>Talk to sales</Link>
          </article>
        </div>
      </div>
    </section>
  );
};