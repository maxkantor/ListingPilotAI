import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingSections.module.css';

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div>
            <span className={styles.eyebrow}>ListingPilot AI · Real Estate Marketing Copilot</span>
            <h1 className={styles.heroTitle}>Create Listing Marketing in 30 Seconds</h1>
            <p className={styles.heroSubtitle}>
              Turn one property entry into MLS descriptions, Instagram posts, email campaigns,
              and more. Built for real estate agents who want to sell listings faster.
            </p>

            <div className={styles.trustRow}>
              <span className={styles.trustPill}>✓ MLS-safe language</span>
              <span className={styles.trustPill}>✓ No hallucinations</span>
              <span className={styles.trustPill}>✓ No scraping</span>
            </div>

            <div className={styles.heroActions}>
              <Link to="/dashboard" className={styles.primaryCta}>
                Generate My First Listing →
              </Link>
              <a href="#product-demo" className={styles.secondaryCta}>
                Watch 30-Second Demo
              </a>
            </div>
          </div>

          <div className={styles.heroPreview}>
            <div className={styles.previewTop}>
              <span className={styles.previewTitle}>Live Listing Workflow Preview</span>
              <span className={styles.previewTag}>Property → Multi-Channel Output</span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.mockCard}>
                <div className={styles.mockCardTitle}>Property Form</div>
                <div className={styles.inputRows}>
                  <div className={styles.inputRow} />
                  <div className={styles.inputRow} />
                  <div className={styles.inputRow} />
                  <div className={styles.inputRow} />
                  <div className={styles.inputRow} />
                </div>
              </div>

              <div className={styles.mockCard}>
                <div className={styles.mockCardTitle}>Generated Copy</div>
                <div className={styles.outputCard}>
                  <h4>MLS Description</h4>
                  <p>Move-in ready 5BR Buckhead home with chef&apos;s kitchen and spa-level primary suite.</p>
                </div>
                <div className={styles.outputCard}>
                  <h4>Instagram Caption</h4>
                  <p>✨ Buckhead luxury with pool, outdoor kitchen, and polished finishes. Showing by appointment.</p>
                </div>
                <div className={styles.outputCard}>
                  <h4>Email Campaign</h4>
                  <p>New luxury listing: 4,200 sq ft, 5 beds, premium amenities, and excellent schools.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};