import React from 'react';
import styles from './LandingSections.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <p className={styles.footerTitle}>ListingPilot AI</p>
            <p>Serious marketing infrastructure for modern real estate teams.</p>
          </div>

          <div className={styles.footerCol}>
            <p className={styles.footerTitle}>Product</p>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className={styles.footerCol}>
            <p className={styles.footerTitle}>Company</p>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className={styles.footerBottom}>© 2026 ListingPilot AI. All rights reserved.</div>
      </div>
    </footer>
  );
};