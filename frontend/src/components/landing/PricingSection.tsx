import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingV2.module.css';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className={styles.sectionTight}>
      <div className="container">
        <div className={styles.pricingWrap}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Pricing</span>
            <h2 className={styles.title}>Simple pricing for listing velocity</h2>
            <p className={styles.subtitle}>Free for occasional use, professional for active agents, agency for teams running volume.</p>
          </div>

          <div className={styles.pricingRail}>
            <article className={styles.priceItem}>
              <h3 className={styles.priceName}>Free</h3>
              <p className={styles.priceAmount}>$0</p>
              <p className={styles.priceText}>3 listings per month</p>
              <Link to="/dashboard" className={styles.priceSecondary}>Start free</Link>
            </article>

            <article className={`${styles.priceItem} ${styles.priceFeatured}`}>
              <h3 className={styles.priceName}>Professional</h3>
              <p className={styles.priceAmount}>$29<span>/month</span></p>
              <p className={styles.priceText}>Unlimited listings</p>
              <Link to="/dashboard" className={styles.pricePrimary}>Start free trial</Link>
            </article>

            <article className={styles.priceItem}>
              <h3 className={styles.priceName}>Agency</h3>
              <p className={styles.priceAmount}>$99<span>/month</span></p>
              <p className={styles.priceText}>Team access and unlimited history</p>
              <Link to="/dashboard" className={styles.priceSecondary}>Contact sales</Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};