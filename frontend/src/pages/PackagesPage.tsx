import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { PackageCatalogItem } from '../types';
import styles from './AuthPage.module.css';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = React.useState<PackageCatalogItem[]>([]);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    apiService
      .getPackages()
      .then(setPackages)
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to load packages right now.'));
  }, []);

  const handleCheckout = async (packageId: string) => {
    const response = await apiService.createCheckoutSession({
      packageCode: packageId,
      successUrl: `${window.location.origin}/workspace?checkout=success`,
      cancelUrl: `${window.location.origin}/packages?checkout=cancelled`,
    });

    window.location.href = response.checkoutUrl;
  };

  return (
    <div className={styles.page}>
      <div className={styles.packagesShell}>
        <div className={styles.packagesHeader}>
          <span className={styles.kicker}>Packages</span>
          <h1>Choose credits that match your listing volume.</h1>
          <p>Purchase one-time credit bundles through Stripe and keep your workspace, history, and billing trail in sync.</p>
          <div className={styles.inlineActions}>
            <Link className={styles.secondary} to="/signup">Create account</Link>
            <Link className={styles.secondary} to="/login">Log in</Link>
          </div>
          {message ? <div className={styles.message}>{message}</div> : null}
        </div>
        <div className={styles.packageGrid}>
          {packages.map((pkg) => (
            <article key={pkg.id} className={styles.packageCard}>
              <span className={styles.packageBadge}>{pkg.isFeatured ? 'Most popular' : 'Credits'}</span>
              <h2>{pkg.name}</h2>
              <p>{pkg.description}</p>
              <strong className={styles.packagePrice}>${pkg.priceUsd.toFixed(0)}</strong>
              <div className={styles.packageMeta}>{pkg.credits} credits</div>
              <ul>
                {pkg.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button className={styles.primary} type="button" onClick={() => void handleCheckout(pkg.id)}>
                Buy now
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
