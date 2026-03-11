import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicPage.module.css';

export const DemoPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.eyebrow}>Interactive demo</div>
            <h1 className={styles.heroTitle}>Preview the exact launch experience agents get inside ListingPilot AI.</h1>
            <p className={styles.heroText}>
              From a single property brief to multi-channel outputs, performance tracking, and CRM-ready next steps — this is how listings move faster.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/dashboard" className={styles.buttonPrimary}>Enter workspace</Link>
              <Link to="/contact" className={styles.buttonSecondary}>Book guided demo</Link>
            </div>
          </div>
          <div className={styles.demoShell}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Launch score</span>
              <span className={styles.smallPill}>Ready to publish</span>
            </div>
            <div className={styles.demoBar} />
            <div className={styles.demoOutput}>
              <strong>MLS description</strong>
              <p>
                Elegant Buckhead residence with five bedrooms, a spa-caliber primary suite, chef&apos;s kitchen, and seamless indoor-outdoor entertaining.
              </p>
            </div>
            <div className={styles.demoOutput}>
              <strong>Instagram caption</strong>
              <p>Luxury lines, natural light, and a backyard built for showings that become offers. #BuckheadHomes #AtlantaLuxury</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>What the demo shows</div>
          <div className={styles.grid3}>
            <article className={styles.card}>
              <h3>AI launch brief</h3>
              <p>Capture tone, audience, positioning, and proof points in one input flow.</p>
            </article>
            <article className={styles.card}>
              <h3>Channel outputs</h3>
              <p>Generate polished MLS, social, email, and networking copy tuned to each destination.</p>
            </article>
            <article className={styles.card}>
              <h3>Follow-through signals</h3>
              <p>See top channels, likely hot leads, and what to do next without leaving the workspace.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
