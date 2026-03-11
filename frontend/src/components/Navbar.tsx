import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname === '/dashboard' || location.pathname === '/admin';

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>
            <span className={styles.brandSpark} />
            <span className={styles.brandGlyph}>L</span>
          </span>
          <span className={styles.brandName}>
            Listing<strong>Pilot</strong>
            <span className={styles.aiTag}>AI</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {!isAppRoute && (
            <>
              <Link to="/product" className={styles.navLink}>Product</Link>
              <a href="/#features" className={styles.navLink}>Features</a>
              <Link to="/pricing" className={styles.navLink}>Pricing</Link>
              <Link to="/demo" className={styles.navLink}>Demo</Link>
              <Link to="/contact" className={styles.navLink}>Contact</Link>
              <Link to="/dashboard" className={styles.secondaryCta} onClick={() => trackCta('nav_login', '/dashboard')}>
                Login
              </Link>
              <Link to="/dashboard" className={styles.primaryCta} onClick={() => trackCta('nav_start_trial', '/dashboard')}>
                Start Free Trial
              </Link>
            </>
          )}
          {isAppRoute ? (
            <>
              <Link to="/dashboard" className={styles.navLink}>Workspace</Link>
              <Link to="/admin" className={styles.navLink}>Admin CRM</Link>
              <Link to="/" className={styles.secondaryCta}>Public Site</Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
