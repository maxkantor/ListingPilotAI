import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './SiteFooter.module.css';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Product', to: '/product' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Demo', to: '/demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
];

export const SiteFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.brandBlock}>
            <div className={styles.mark}>LP</div>
            <div>
              <strong>ListingPilot AI</strong>
              <p>Premium listing marketing, CRM-ready workflow, and lean serverless architecture for modern real estate teams.</p>
            </div>
          </div>

          <div className={styles.columns}>
            {footerColumns.map((column) => (
              <div key={column.title} className={styles.column}>
                <span>{column.title}</span>
                {column.links.map((link) => (
                  <Link key={link.label} to={link.to} onClick={() => trackCta(`footer_${link.label.toLowerCase()}`, link.to)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};