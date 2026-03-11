import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingV2.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.sectionDark}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <h3 className={styles.footerHeading}>ListingPilot AI</h3>
            <p>Premium listing marketing software for serious real estate teams.</p>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Product</h4>
            <Link to="/product">Product</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/demo">Demo</Link>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Company</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>© 2026 ListingPilot AI. All rights reserved.</div>
      </div>
    </footer>
  );
};