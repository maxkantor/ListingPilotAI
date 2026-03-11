import React from 'react';
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
            <a href="#product">Product</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Company</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className={styles.footerBottom}>© 2026 ListingPilot AI. All rights reserved.</div>
      </div>
    </footer>
  );
};