import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './MobileStickyCta.module.css';

export const MobileStickyCta: React.FC = () => {
  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        <div className={styles.copy}>
          <strong>Launch listing marketing in 30 seconds</strong>
          <span>MLS-safe AI outputs for serious agents.</span>
        </div>
        <div className={styles.actions}>
          <Link to="/demo" className={styles.secondary} onClick={() => trackCta('mobile_sticky_demo', '/demo')}>
            Demo
          </Link>
          <Link to="/workspace" className={styles.primary} onClick={() => trackCta('mobile_sticky_trial', '/workspace')}>
            Start Trial
          </Link>
        </div>
      </div>
    </div>
  );
};
