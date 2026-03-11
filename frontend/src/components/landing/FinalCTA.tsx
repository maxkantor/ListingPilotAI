import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingSections.module.css';

export const FinalCTA: React.FC = () => {
  return (
    <section className={styles.finalCtaSection}>
      <div className="container">
        <div className={styles.finalInner}>
          <h2>Start Creating Listing Marketing in Seconds</h2>
          <p>Try ListingPilot free for 14 days.</p>
          <Link to="/dashboard" className={styles.primaryCta}>
            Generate My First Listing →
          </Link>
        </div>
      </div>
    </section>
  );
};