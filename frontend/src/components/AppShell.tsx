import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AppShell.module.css';

const appNav = [
  { label: 'Workspace', to: '/workspace' },
  { label: 'Listings', to: '/listings' },
  { label: 'Assets', to: '/assets' },
  { label: 'CRM', to: '/crm' },
  { label: 'Analytics', to: '/dashboard' },
  { label: 'Settings', to: '/settings' },
];

export const AppShell: React.FC = () => {
  const location = useLocation();
  const { isAdmin, session } = useAuth();
  const creditsRemaining = session?.currentUser?.creditBalance ?? 0;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link to="/workspace" className={styles.brand}>
          <span className={styles.brandMark}>LP</span>
          <div>
            <strong>ListingPilot AI</strong>
            <span>Workspace</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          {[...appNav, ...(isAdmin ? [{ label: 'Admin', to: '/admin' }] : [])].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className={styles.publicLink}>Back to public site</Link>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>Internal app</p>
            <h1>{appNav.find((item) => item.to === location.pathname)?.label ?? 'Workspace'}</h1>
          </div>
          <div className={styles.topbarActions}>
            <Link to="/workspace#new-listing">New Listing</Link>
            <Link to="/workspace#history">History</Link>
            <span className={styles.creditsPill}>{creditsRemaining} credits</span>
            <Link to="/packages" className={styles.upgradeButton}>Upgrade plan</Link>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
