import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { trackCta } from '../utils/analytics';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

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
          <NavLink to="/product" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>Product</NavLink>
          <NavLink to="/features" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>Features</NavLink>
          <NavLink to="/pricing" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>Pricing</NavLink>
          <NavLink to="/demo" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>Demo</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>Contact</NavLink>
          {isAuthenticated ? (
            <>
              <Link to="/workspace" className={styles.secondaryCta} onClick={() => trackCta('nav_workspace', '/workspace')}>
                Workspace
              </Link>
              <button
                type="button"
                className={`${styles.primaryCta} ${styles.ctaButton}`}
                onClick={() => {
                  trackCta('nav_logout', '/');
                  void logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.secondaryCta} onClick={() => trackCta('nav_login', '/login')}>
                Login
              </Link>
              <Link to="/signup" className={styles.primaryCta} onClick={() => trackCta('nav_start_trial', '/signup')}>
                Start Free Trial
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
