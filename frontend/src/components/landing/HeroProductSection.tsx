import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../../utils/analytics';
import styles from './LandingV2.module.css';

export const HeroProductSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Real estate listing marketing, rebuilt</span>
            <h1 className={styles.heroTitle}>Create Listing Marketing in 30 Seconds</h1>
            <p className={styles.subtitle}>
              Turn one property brief into MLS descriptions, social posts, and email campaigns instantly — without hallucinated facts, scraping, or clunky workflows.
            </p>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>✓ MLS-safe language</span>
              <span className={styles.trustItem}>✓ No hallucinations</span>
              <span className={styles.trustItem}>✓ No scraping</span>
              <span className={styles.trustItem}>✓ Built for modern real estate teams</span>
            </div>

            <div className={styles.heroActions}>
              <Link to="/dashboard" className={styles.primaryButton} onClick={() => trackCta('hero_start_trial', 'trial')}>
                Start Free Trial
              </Link>
              <Link to="/demo" className={styles.secondaryButton} onClick={() => trackCta('hero_watch_demo', 'demo')}>
                Watch Demo
              </Link>
            </div>

            <div className={styles.heroMetaGrid}>
              <div className={styles.heroMetaCard}><strong>30 sec</strong><span>from brief to launch-ready copy</span></div>
              <div className={styles.heroMetaCard}><strong>6+</strong><span>assets per listing brief</span></div>
              <div className={styles.heroMetaCard}><strong>Teams</strong><span>agent, coordinator, and admin ready</span></div>
            </div>
          </div>

          <div className={styles.productShell}>
            <div className={styles.windowBar}>
              <div className={styles.windowMeta}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.windowLabel}>ListingPilot workspace</div>
            </div>

            <div className={styles.previewShowcase}>
              <div className={styles.previewImage}>
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80"
                  alt="Luxury property exterior"
                />
                <div className={styles.previewBadge}>Buckhead launch brief · ready</div>
                <div className={styles.previewInsightLeft}>MLS-safe narrative</div>
                <div className={styles.previewInsightRight}>Email + social synced</div>
              </div>
            </div>

            <div className={styles.productBody}>
              <div className={styles.formColumn}>
                <div className={styles.columnTitle}>Property input</div>
                <div className={styles.fieldStack}>
                  <div className={styles.field}>
                    <label>Address</label>
                    <div>4812 Wieuca Road NE, Atlanta, GA</div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Beds</label>
                      <div>5</div>
                    </div>
                    <div className={styles.field}>
                      <label>Baths</label>
                      <div>4.5</div>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Price</label>
                    <div>$1,275,000</div>
                  </div>
                  <div className={styles.fieldTall}>
                    <label>Features</label>
                    <p>Chef&apos;s kitchen, heated pool, covered outdoor kitchen, spa-style primary suite, smart home controls.</p>
                  </div>
                </div>
              </div>

              <div className={styles.outputColumn}>
                <div className={styles.columnTitle}>Generated marketing</div>
                <div className={styles.outputStack}>
                  <div className={styles.outputCard}>
                    <div className={styles.outputHeader}>
                      <span className={styles.outputLabel}>MLS Description</span>
                      <button type="button" className={styles.copyButton}>Copy</button>
                    </div>
                    <p>Elegant Buckhead residence with five bedrooms, 4.5 baths, refined main-level living, and premium outdoor entertaining.</p>
                  </div>
                  <div className={styles.outputCard}>
                    <div className={styles.outputHeader}>
                      <span className={styles.outputLabel}>Instagram Caption</span>
                      <button type="button" className={styles.copyButton}>Copy</button>
                    </div>
                    <p>✨ Buckhead luxury with chef&apos;s kitchen, heated pool, and polished indoor-outdoor living.</p>
                  </div>
                  <div className={styles.outputCard}>
                    <div className={styles.outputHeader}>
                      <span className={styles.outputLabel}>Email Campaign</span>
                      <button type="button" className={styles.copyButton}>Copy</button>
                    </div>
                    <p>New to market: 4,200 sq ft executive-ready listing with standout amenities and immediate showing appeal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};