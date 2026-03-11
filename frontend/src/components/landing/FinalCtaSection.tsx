import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../../utils/analytics';
import styles from './LandingV2.module.css';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className={styles.sectionDarkCta}>
      <div className="container">
        <div className={styles.finalCtaShell}>
          <div>
            <span className={styles.darkEyebrow}>Launch-ready in minutes</span>
            <h2 className={styles.darkTitle}>Make your first listing launch feel like a premium marketing team touched it.</h2>
            <p className={styles.darkSubtitle}>
              Start free, explore the sample output, or book a walkthrough for your team.
            </p>
          </div>
          <div className={styles.finalCtaActions}>
            <Link to="/dashboard" className={styles.darkPrimaryButton} onClick={() => trackCta('home_final_start_trial', 'trial')}>
              Start free trial
            </Link>
            <Link to="/demo" className={styles.darkSecondaryButton} onClick={() => trackCta('home_final_demo', 'demo')}>
              See sample output
            </Link>
            <Link to="/contact" className={styles.darkSecondaryButton} onClick={() => trackCta('home_final_contact', 'contact')}>
              Book demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
