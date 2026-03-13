import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MarketingPremium.module.css';

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
  ['Launch-ready assets', 'Included', 'Included', 'Included'],
  ['Performance dashboards', 'Basic', 'Advanced', 'Advanced'],
  ['Admin portal', '—', 'Optional', 'Included'],
  ['Lead tracking + CRM', 'Basic', 'Advanced', 'Advanced'],
];

export const PricingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.intro}>
          <div>
            <div className={styles.kicker}>Pricing</div>
            <h1 className={styles.title}>Simple pricing for agents. Premium controls for teams.</h1>
            <p className={styles.lead}>
              Start with polished launches, then grow into a revenue operating system with CRM visibility, usage management, and a business-grade back office.
            </p>
            <div className={styles.buttonRow}>
              <Link to="/workspace" className={styles.primaryBtn}>Start trial</Link>
              <Link to="/contact" className={styles.secondaryBtn}>Talk sales</Link>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.pricingRow}>
            {plans.map((plan) => (
              <article key={plan.name} className={`${styles.pricingCard} ${plan.highlight ? styles.featuredPlan : ''}`}>
                {plan.highlight ? <span className={styles.planBadge}>Most popular</span> : null}
                <h3>{plan.name}</h3>
                <p>{plan.price} / month</p>
                <p>{plan.subtitle}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className={styles.buttonRow}>
                  <Link to={plan.name === 'Agency' ? '/contact' : '/workspace'} className={plan.highlight ? styles.primaryBtn : styles.ghostBtn}>
                    {plan.name === 'Agency' ? 'Talk sales' : 'Start free trial'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <div className={styles.sectionKicker}>Plan comparison</div>
            <h2 className={styles.sectionTitle}>Scale from launch automation to team-level visibility.</h2>
          </div>
          <div className={styles.table}>
            <div className={styles.tableRow}>
              <strong>Capability</strong>
              <strong>Free</strong>
              <strong>Professional</strong>
              <strong>Agency</strong>
            </div>
            {comparison.map(([label, free, pro, agency]) => (
              <div key={label} className={styles.tableRow}>
                <span>{label}</span>
                <span>{free}</span>
                <span>{pro}</span>
                <span>{agency}</span>
              </div>
            ))}
          </div>

          <div className={styles.grid3}>
            <article className={styles.faqItem}><h3>Can I switch plans anytime?</h3><p>Yes. Upgrade or downgrade at any time with usage visibility built in.</p></article>
            <article className={styles.faqItem}><h3>Is there brokerage onboarding?</h3><p>Agency includes rollout support and admin setup for multi-agent teams.</p></article>
            <article className={styles.faqItem}><h3>Do you support MLS-safe output?</h3><p>Yes. Compliance-aware controls are built into generation and review flow.</p></article>
          </div>

          <div className={styles.ctaBand}>
            <h2 className={styles.sectionTitle}>Start free, then scale with confidence.</h2>
            <div className={styles.buttonRow}>
              <Link to="/workspace" className={styles.primaryBtn}>Start free trial</Link>
              <Link to="/contact" className={styles.ghostBtn}>Talk to sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
