import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicPage.module.css';

const plans = [
  {
    name: 'Starter',
    price: '$79',
    subtitle: 'Solo agents launching listings with premium positioning.',
    features: ['25 launches / month', 'MLS + social + email outputs', 'History and reuse library'],
  },
  {
    name: 'Professional',
    price: '$199',
    subtitle: 'Top producers who want campaigns, visibility, and faster follow-up.',
    features: ['Unlimited launches', 'Workspace analytics', 'Lead board and concierge prompts'],
    highlight: true,
  },
  {
    name: 'Brokerage',
    price: 'Custom',
    subtitle: 'Admin controls, onboarding, and team-wide performance tracking.',
    features: ['Multi-agent admin portal', 'Usage governance', 'Quarterly performance review'],
  },
];

const comparison = [
  ['Launch-ready marketing assets', 'Yes', 'Yes'],
  ['Performance dashboards', 'Basic', 'Advanced'],
  ['Admin portal', 'No', 'Yes'],
  ['Lead tracking', 'Basic', 'Advanced'],
];

export const PricingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.eyebrow}>Pricing</div>
            <h1 className={styles.heroTitle}>Simple pricing for agents. Premium controls for teams.</h1>
            <p className={styles.heroText}>
              Start with polished launches, then grow into a revenue operating system with CRM and admin visibility when your team is ready.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/dashboard" className={styles.buttonPrimary}>Start trial</Link>
              <Link to="/contact" className={styles.buttonSecondary}>Talk sales</Link>
            </div>
          </div>
          <div className={`${styles.heroPanel} ${styles.highlight}`}>
            <div className={styles.kicker}>Most teams choose Professional</div>
            <div className={styles.price}>$199 <span>/ month</span></div>
            <p>
              The best fit for serious agents who want consistent launches, better follow-up, and visibility into what converts.
            </p>
            <ul className={styles.list}>
              <li><span>✓</span><span>Unlimited launches and campaign remixes</span></li>
              <li><span>✓</span><span>Workspace insights and lead tracking</span></li>
              <li><span>✓</span><span>Priority support and onboarding help</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <article key={plan.name} className={`${styles.pricingCard} ${plan.highlight ? styles.highlight : ''}`}>
                <div className={styles.kicker}>{plan.name}</div>
                <div className={styles.price}>{plan.price} {plan.price !== 'Custom' && <span>/ month</span>}</div>
                <p>{plan.subtitle}</p>
                <ul className={styles.list}>
                  {plan.features.map((feature) => (
                    <li key={feature}><span>✦</span><span>{feature}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Plan comparison</div>
          <h2 className={styles.sectionTitle}>Scale from launch automation to team-level operating visibility.</h2>
          <div className={styles.compareTable}>
            <div className={styles.compareRow}>
              <strong>Capability</strong>
              <strong>Starter</strong>
              <strong>Professional / Brokerage</strong>
            </div>
            {comparison.map(([label, starter, pro]) => (
              <div key={label} className={styles.compareRow}>
                <span>{label}</span>
                <span>{starter}</span>
                <span>{pro}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
