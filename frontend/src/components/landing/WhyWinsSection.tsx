import React from 'react';
import styles from './LandingV2.module.css';

const outcomes = [
  {
    metric: '30–60 min',
    title: 'Saved per listing launch',
    copy: 'Move from agent notes to polished channel-ready copy in a single pass.',
  },
  {
    metric: '6 outputs',
    title: 'Created from one brief',
    copy: 'MLS, Instagram, Facebook, LinkedIn, email, and luxury positioning stay aligned.',
  },
  {
    metric: 'Fewer rewrites',
    title: 'Cleaner team workflow',
    copy: 'Agents, coordinators, and brokers stop rewriting the same listing in different places.',
  },
];

export const WhyWinsSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeaderWide}>
          <span className={styles.eyebrow}>Why it wins</span>
          <h2 className={styles.title}>Built to launch listings faster without sacrificing tone, credibility, or compliance.</h2>
          <p className={styles.subtitle}>
            ListingPilot is not generic AI copy. It is a workflow layer that turns messy listing prep into a consistent launch system.
          </p>
        </div>

        <div className={styles.outcomeGrid}>
          {outcomes.map((outcome) => (
            <article key={outcome.title} className={styles.outcomeCard}>
              <div className={styles.outcomeMetric}>{outcome.metric}</div>
              <h3>{outcome.title}</h3>
              <p>{outcome.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
