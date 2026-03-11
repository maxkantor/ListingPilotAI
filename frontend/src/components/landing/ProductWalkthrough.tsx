import React from 'react';
import styles from './LandingSections.module.css';

export const ProductWalkthrough: React.FC = () => {
  return (
    <section id="product-demo" className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Watch ListingPilot Write an Entire Listing</h2>
          <p className={styles.sectionSubtitle}>
            A single property brief becomes channel-ready marketing without bouncing between docs, MLS fields, and social drafts.
          </p>
        </div>

        <div className={styles.walkthroughShell}>
          <div className={styles.walkthroughPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelDots}>
                <span />
                <span />
                <span />
              </div>
              <strong>Property form</strong>
            </div>

            <div className={styles.walkthroughFields}>
              <div className={styles.walkthroughField}>
                <label>Address</label>
                <div>4812 Wieuca Road NE, Atlanta, GA</div>
              </div>
              <div className={styles.walkthroughFieldRow}>
                <div className={styles.walkthroughField}>
                  <label>Beds</label>
                  <div>5</div>
                </div>
                <div className={styles.walkthroughField}>
                  <label>Baths</label>
                  <div>4.5</div>
                </div>
              </div>
              <div className={styles.walkthroughField}>
                <label>Price</label>
                <div>$1,275,000</div>
              </div>
              <div className={styles.walkthroughField}>
                <label>Features</label>
                <div>Chef&apos;s kitchen, heated pool, outdoor kitchen, terrace level, smart home technology</div>
              </div>
            </div>
          </div>

          <div className={styles.walkthroughPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelDots}>
                <span />
                <span />
                <span />
              </div>
              <strong>Generated outputs</strong>
            </div>

            <div className={styles.walkthroughOutputs}>
              <article className={styles.walkthroughOutputCard}>
                <h3>MLS Description</h3>
                <p>Elegant Buckhead residence offering five bedrooms, 4.5 baths, refined main-level living, and premium outdoor entertaining.</p>
              </article>
              <article className={styles.walkthroughOutputCard}>
                <h3>Instagram Caption</h3>
                <p>🏡 Buckhead luxury with chef&apos;s kitchen, heated pool, and polished indoor-outdoor living.</p>
              </article>
              <article className={styles.walkthroughOutputCard}>
                <h3>Email Campaign</h3>
                <p>New to market: executive-ready Atlanta listing with standout amenities and immediate showing appeal.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};