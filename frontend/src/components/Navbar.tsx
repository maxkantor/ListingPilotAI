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
          <span className={styles.brandIcon}>🏠</span>
          <span className={styles.brandName}>
            Listing<strong>Pilot</strong>
            <span className={styles.aiTag}>AI</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          {!isDashboard && (
            <>
              <a href="#features" className={styles.navLink}>Features</a>
              <a href="#pricing" className={styles.navLink}>Pricing</a>
            </>
          )}
          {isDashboard ? (
            <Link to="/" className={styles.navLink}>← Home</Link>
          ) : (
            <Link to="/dashboard" className={styles.ctaBtn}>
              Open Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
