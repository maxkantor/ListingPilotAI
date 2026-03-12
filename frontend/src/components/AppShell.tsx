import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import styles from './AppShell.module.css';

const appNav = [
  { label: 'Workspace', to: '/workspace' },
  { label: 'Listings', to: '/listings' },
  { label: 'Assets', to: '/assets' },
  { label: 'CRM', to: '/crm' },
  { label: 'Settings', to: '/settings' },
  { label: 'Admin', to: '/admin' },
];

export const AppShell: React.FC = () => {
  const location = useLocation();

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
          {appNav.map((item) => (
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
            <button type="button">Invite</button>
            <button type="button">Export</button>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
