import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
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
          <Link to="/workspace" className={styles.secondaryCta} onClick={() => trackCta('nav_login', '/workspace')}>
            Login
          </Link>
          <Link to="/workspace" className={styles.primaryCta} onClick={() => trackCta('nav_start_trial', '/workspace')}>
            Start Free Trial
          </Link>
        </nav>
      </div>
    </header>
  );
};
