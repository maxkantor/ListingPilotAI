import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingSections.module.css';

export const SampleOutputSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>See ListingPilot In Action</h2>
          <p className={styles.sectionSubtitle}>
            Example output generated for a Buckhead luxury home from a single property entry.
          </p>
        </div>

        <div className={styles.sampleProperty}>Buckhead luxury home · 5 beds · 4.5 baths · 4,200 sq ft · $1,275,000</div>

        <div className={styles.sampleGrid}>
          <article className={styles.sampleCard}>
            <span className={styles.channelTag}>MLS Description</span>
            <p>
              This Buckhead residence offers five bedrooms, 4.5 baths, and 4,200 sq ft of refined living. Highlights
              include a chef&apos;s kitchen with quartz countertops, open-concept main level, spa-inspired primary suite,
              and finished terrace level. Exterior features include a heated saltwater pool, covered outdoor kitchen,
              and professionally landscaped yard.
            </p>
          </article>

          <article className={styles.sampleCard}>
            <span className={styles.channelTag}>Instagram Caption</span>
            <p>
              ✨ Buckhead luxury, done right. 5BR / 4.5BA with chef&apos;s kitchen, spa suite, heated pool, and premium
              outdoor living. DM for private showing details.
            </p>
          </article>

          <article className={styles.sampleCard}>
            <span className={styles.channelTag}>Email Campaign</span>
            <p>
              New listing alert: Executive Buckhead home with 5 bedrooms, 4.5 baths, and standout entertaining spaces.
              Ideal for buyers seeking move-in-ready luxury with top-tier finishes and strong location appeal.
            </p>
          </article>
        </div>

        <div style={{ marginTop: '28px' }}>
          <Link to="/dashboard" className={styles.primaryCta}>
            Generate My First Listing →
          </Link>
        </div>
      </div>
    </section>
  );
};