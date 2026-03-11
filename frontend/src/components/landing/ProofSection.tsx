import React from 'react';
import styles from './LandingV2.module.css';

export const ProofSection: React.FC = () => {
  return (
    <section id="product" className={styles.section}>
      <div className="container">
        <div className={styles.proofTop}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Proof / Output</span>
            <h2 className={styles.title}>See ListingPilot write a real listing</h2>
            <p className={styles.subtitle}>
              One property brief becomes clean, channel-ready output with believable structure and professional tone.
            </p>
          </div>
          <div className={styles.propertyBadge}>Buckhead luxury home · 5 beds • 4.5 baths • $1,275,000</div>
        </div>

        <div className={styles.proofExperience}>
          <div className={styles.proofPropertyPanel}>
            <img
              className={styles.proofImage}
              src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80"
              alt="Luxury property interior"
            />
            <div className={styles.proofPropertyMeta}>
              <strong>4812 Wieuca Road NE</strong>
              <span>Atlanta, GA · 4,200 sq ft · Heated pool · Outdoor kitchen</span>
            </div>
            <div className={styles.proofTabRow}>
              <span className={styles.proofTabActive}>MLS</span>
              <span className={styles.proofTab}>Instagram</span>
              <span className={styles.proofTab}>Email</span>
            </div>
          </div>

          <div className={styles.proofGrid}>
            <article className={styles.proofCard}>
            <div className={styles.proofCardHeader}>
              <h3>MLS description</h3>
              <button type="button" className={styles.copyButton}>Copy</button>
            </div>
            <p>
              This Buckhead residence offers five bedrooms, 4.5 baths, and 4,200 sq ft of refined living. Highlights include a chef&apos;s kitchen with quartz countertops, open-concept living spaces, a spa-inspired primary suite, and a finished terrace level. Exterior amenities include a heated saltwater pool, covered outdoor kitchen, and professionally landscaped grounds.
            </p>
            </article>

            <article className={styles.proofCard}>
            <div className={styles.proofCardHeader}>
              <h3>Instagram caption</h3>
              <button type="button" className={styles.copyButton}>Copy</button>
            </div>
            <p>
              ✨ Buckhead luxury, done right. 5BR / 4.5BA with chef&apos;s kitchen, spa suite, heated pool, and premium outdoor living.
            </p>
            </article>

            <article className={styles.proofCard}>
            <div className={styles.proofCardHeader}>
              <h3>Email campaign</h3>
              <button type="button" className={styles.copyButton}>Copy</button>
            </div>
            <p>
              New listing alert: executive-ready Atlanta home with standout entertaining spaces, premium finishes, and immediate showing appeal.
            </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};