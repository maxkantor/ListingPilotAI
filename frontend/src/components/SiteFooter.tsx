import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { trackCta } from '../utils/analytics';
import styles from './SiteFooter.module.css';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Product', to: '/product' },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Demo', to: '/demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Platform', to: '/platform' },
      { label: 'Contact', to: '/contact' },
      { label: 'Workspace', to: '/workspace' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
];

interface SiteFooterProps {
  legalLine?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ legalLine }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const companyLinks = [
    { label: 'Platform', to: '/platform' },
    { label: 'Contact', to: '/contact' },
    { label: isAuthenticated ? 'Workspace' : 'Login', to: isAuthenticated ? '/workspace' : '/login' },
    ...(isAdmin ? [{ label: 'Admin', to: '/admin' }] : []),
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.brandBlock}>
            <div className={styles.mark}>LP</div>
            <div>
              <strong>ListingPilot AI</strong>
              <p>Premium listing marketing platform for modern real estate teams.</p>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className={styles.column}>
              <span>{column.title}</span>
              {(column.title === 'Company' ? companyLinks : column.links).map((link) => (
                <Link key={link.label} to={link.to} onClick={() => trackCta(`footer_${link.label.toLowerCase()}`, link.to)}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        {legalLine ? <p className={styles.legal}>{legalLine}</p> : null}
      </div>
    </footer>
  );
};