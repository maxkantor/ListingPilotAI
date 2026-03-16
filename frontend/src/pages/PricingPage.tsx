import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import type { PackageCatalogItem } from '../types';
import styles from './AuthPage.module.css';

export const PricingPage: React.FC = () => {
  const location = useLocation();
  const [packages, setPackages] = React.useState<PackageCatalogItem[]>([]);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const checkout = params.get('checkout');

    if (checkout === 'cancelled') {
      setMessage('Checkout cancelled. Your credits were not charged.');
      return;
    }

    if (checkout === 'success') {
      setMessage('Payment successful. Your credits are being applied to your workspace.');
      return;
    }

    setMessage('');
  }, [location.search]);

  React.useEffect(() => {
    apiService
      .getPackages()
      .then(setPackages)
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Unable to load pricing right now.'));
  }, []);

  const handleCheckout = async (packageId: string) => {
    try {
      const response = await apiService.createCheckoutSession({
        packageCode: packageId,
        successUrl: `${window.location.origin}/workspace?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      });

      window.location.href = response.checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start checkout right now.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.packagesShell}>
        <div className={styles.packagesHeader}>
          <span className={styles.kicker}>Pricing</span>
          <h1>Choose the credit plan that matches your listing volume.</h1>
          <p>One premium pricing page. Fast Stripe checkout. Credits instantly tied to your ListingPilot workspace and history.</p>
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
