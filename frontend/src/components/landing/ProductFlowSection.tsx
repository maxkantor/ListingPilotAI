import React from 'react';
import styles from './LandingV2.module.css';

const steps = [
  {
    number: '1',
    title: 'Enter property details',
    text: 'Drop in address, price, beds, baths, and standout features once.',
  },
  {
    number: '2',
    title: 'AI generates marketing',
    text: 'ListingPilot writes MLS copy, social captions, and buyer email content instantly.',
  },
  {
    number: '3',
    title: 'Copy and publish instantly',
    text: 'Use the outputs across channels without rewriting the same listing over and over.',
  },
];

export const ProductFlowSection: React.FC = () => {
  return (
    <section id="product-flow" className={styles.sectionTight}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Product flow</span>
          <h2 className={styles.title}>A simple workflow built for fast-moving agents</h2>
        </div>

        <div className={styles.flowGrid}>
          {steps.map((step) => (
            <article key={step.number} className={styles.flowVisual}>
              <div className={styles.flowNumber}>{step.number}</div>
              <h3 className={styles.flowTitle}>{step.title}</h3>
              <p className={styles.flowText}>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};