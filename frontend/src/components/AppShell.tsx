import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AppShell.module.css';

const appNav = [
  { label: 'Workspace', to: '/workspace' },
  { label: 'Listings', to: '/listings' },
  { label: 'Assets', to: '/assets' },
  { label: 'Analytics', to: '/dashboard' },
  { label: 'Settings', to: '/settings' },
];

const adminNav = [
  { label: 'Admin CRM', to: '/crm' },
  { label: 'Admin', to: '/admin' },
];

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const creditsRemaining = session?.currentUser?.creditBalance ?? 0;
  const navigationItems = isAdmin ? [...appNav, ...adminNav] : appNav;

  const activePage = navigationItems.find((item) => item.to === location.pathname)?.label ?? 'Workspace';

  const handleBack = React.useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/', { replace: true });
  }, [navigate]);

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
          {navigationItems.map((item) => (
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
          <div className={styles.topbarLead}>
            <button type="button" className={styles.backButton} onClick={handleBack} aria-label="Go back to previous page">
              ← Back
            </button>
            <div>
              <p className={styles.kicker}>Internal app</p>
              <h1>{activePage}</h1>
            </div>
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
