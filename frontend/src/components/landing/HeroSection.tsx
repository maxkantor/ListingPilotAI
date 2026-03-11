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

            <div className={styles.heroMetaRow}>
              <div className={styles.heroMetaCard}>
                <strong>6 outputs</strong>
                <span>generated from one property brief</span>
              </div>
              <div className={styles.heroMetaCard}>
                <strong>30 seconds</strong>
                <span>from entry to channel-ready copy</span>
              </div>
            </div>
          </div>

          <div className={styles.heroPreview}>
            <div className={styles.previewTop}>
              <span className={styles.previewTitle}>Live Listing Workflow Preview</span>
              <span className={styles.previewTag}>Property → Multi-Channel Output</span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.formPane}>
                <div className={styles.mockCardTitle}>Property Entry</div>
                <div className={styles.mockFieldGroup}>
                  <div className={styles.mockField}>
                    <span>Address</span>
                    <strong>4812 Wieuca Road NE</strong>
                  </div>
                  <div className={styles.mockFieldSplit}>
                    <div className={styles.mockField}>
                      <span>Beds</span>
                      <strong>5</strong>
                    </div>
                    <div className={styles.mockField}>
                      <span>Baths</span>
                      <strong>4.5</strong>
                    </div>
                  </div>
                  <div className={styles.mockField}>
                    <span>Price</span>
                    <strong>$1,275,000</strong>
                  </div>
                  <div className={styles.mockFieldTall}>
                    <span>Features</span>
                    <p>Chef&apos;s kitchen, heated pool, outdoor kitchen, spa-style primary suite, smart home upgrades.</p>
                  </div>
                </div>
              </div>

              <div className={styles.outputPane}>
                <div className={styles.mockCardTitle}>Generated Marketing</div>
                <div className={styles.outputCard}>
                  <h4>MLS Description</h4>
                  <p>Move-in-ready Buckhead home with five bedrooms, 4.5 baths, chef&apos;s kitchen, heated pool, and spa-inspired primary suite.</p>
                </div>
                <div className={styles.outputCard}>
                  <h4>Instagram Caption</h4>
                  <p>✨ Elevated Buckhead living with premium entertaining spaces, polished interiors, and private-showing appeal.</p>
                </div>
                <div className={styles.outputCard}>
                  <h4>Email Campaign</h4>
                  <p>Just listed: 4,200 sq ft luxury home with standout amenities and immediate buyer-ready positioning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};