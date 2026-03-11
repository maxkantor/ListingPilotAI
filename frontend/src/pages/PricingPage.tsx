import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicPage.module.css';

const plans = [
  {
    name: 'Free',
    price: '$0',
    subtitle: 'Validate the workflow with a few launch-ready outputs every month.',
    features: ['3 generations / month', 'MLS + social + email outputs', 'Sample listing workspace'],
  },
  {
    name: 'Professional',
    price: '$79',
    subtitle: 'Top producers who want premium campaigns, visibility, and faster follow-up.',
    features: ['200 generations / month', 'Workspace analytics and history', 'Lead board and concierge prompts'],
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$249',
    subtitle: 'Admin controls, onboarding, and multi-user rollout support.',
    features: ['1000 generations / month', 'Multi-agent admin portal', 'Usage governance and team workflows'],
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
              Start with polished launches, then grow into a revenue operating system with CRM visibility, usage management, and a business-grade back office.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/dashboard" className={styles.buttonPrimary}>Start trial</Link>
              <Link to="/contact" className={styles.buttonSecondary}>Talk sales</Link>
            </div>
          </div>
          <div className={`${styles.heroPanel} ${styles.highlight}`}>
            <div className={styles.kicker}>Most teams choose Professional</div>
            <div className={styles.price}>$79 <span>/ month</span></div>
            <p>
              The best fit for serious agents who want consistent launches, better follow-up, and visibility into what converts.
            </p>
            <ul className={styles.list}>
              <li><span>✓</span><span>200 monthly generations and campaign remixes</span></li>
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
              <strong>Free</strong>
              <strong>Professional / Agency</strong>
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
