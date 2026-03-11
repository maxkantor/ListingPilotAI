import React from 'react';
import styles from './LandingSections.module.css';

export const ProductDemoSection: React.FC = () => {
  return (
    <section id="product-demo" className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Watch ListingPilot Write an Entire Listing</h2>
        <p className={styles.sectionSubtitle}>
          Property details go in once. Channel-ready marketing copy comes out instantly with clear,
          compliant phrasing for MLS and social publishing.
        </p>

        <div className={styles.demoGrid}>
          <div className={styles.formMock}>
            <h3>Property Input</h3>
            <div className={styles.formField}>
              <label>Address</label>
              <div />
            </div>
            <div className={styles.formField}>
              <label>Beds</label>
              <div />
            </div>
            <div className={styles.formField}>
              <label>Baths</label>
              <div />
            </div>
            <div className={styles.formField}>
              <label>Price</label>
              <div />
            </div>
            <div className={styles.formField}>
              <label>Features</label>
              <div />
            </div>
          </div>

          <div className={styles.generatedMock}>
            <h3>Generated Marketing Content</h3>
            <div className={styles.outputStack}>
              <div className={styles.outputCard}>
                <h4>MLS Description</h4>
                <p>Elegant Buckhead residence with five bedrooms, 4.5 baths, and a fully upgraded chef&apos;s kitchen.</p>
              </div>
              <div className={styles.outputCard}>
                <h4>Instagram Caption</h4>
                <p>🏡 4,200 sq ft of refined Atlanta living. Heated pool, outdoor kitchen, and spa-inspired primary suite.</p>
              </div>
              <div className={styles.outputCard}>
                <h4>Email Campaign</h4>
                <p>Now showing: luxury Buckhead listing with premium finishes, top schools, and immediate availability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};