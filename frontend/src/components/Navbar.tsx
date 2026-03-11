import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>⌂</span>
          <span className={styles.brandName}>
            Listing<strong>Pilot</strong>
            <span className={styles.aiTag}>AI</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {!isDashboard && (
            <>
              <a href="#product" className={styles.navLink}>Product</a>
              <a href="#pricing" className={styles.navLink}>Pricing</a>
              <Link to="/dashboard" className={styles.secondaryCta}>
                Login
              </Link>
              <Link to="/dashboard" className={styles.primaryCta}>
                Start Free Trial
              </Link>
            </>
          )}
          {isDashboard ? (
            <Link to="/" className={styles.secondaryCta}>← Home</Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
