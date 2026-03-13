import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { trackCta } from '../utils/analytics';
import styles from './MobileStickyCta.module.css';

export const MobileStickyCta: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        <div className={styles.copy}>
          <strong>Launch listing marketing in 30 seconds</strong>
          <span>MLS-safe AI outputs for serious agents.</span>
        </div>
        <div className={styles.actions}>
          <Link to="/packages" className={styles.secondary} onClick={() => trackCta('mobile_sticky_packages', '/packages')}>
            Packages
          </Link>
          <Link to={isAuthenticated ? '/workspace' : '/signup'} className={styles.primary} onClick={() => trackCta('mobile_sticky_trial', isAuthenticated ? '/workspace' : '/signup')}>
            {isAuthenticated ? 'Open Workspace' : 'Start Trial'}
          </Link>
        </div>
      </div>
    </div>
  );
};
