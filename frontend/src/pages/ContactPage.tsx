import React from 'react';
import styles from './PublicPage.module.css';

export const ContactPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.eyebrow}>Contact</div>
            <h1 className={styles.heroTitle}>Book a demo or design your team rollout.</h1>
            <p className={styles.heroText}>
              Whether you are a solo luxury agent or a brokerage operator, we will help you shape the right workflow, rollout, and KPI expectations.
            </p>
            <div className={styles.inlineInfo}>
              <span className={styles.smallPill}>Response within 1 business day</span>
              <span className={styles.smallPill}>Enterprise onboarding available</span>
            </div>
          </div>
          <div className={styles.contactPanel}>
            <h3>Tell us about your team</h3>
            <form className={styles.form}>
              <input className={styles.input} type="text" placeholder="Full name" />
              <input className={styles.input} type="email" placeholder="Work email" />
              <input className={styles.input} type="text" placeholder="Team or brokerage" />
              <select className={styles.select} defaultValue="">
                <option value="" disabled>What best describes you?</option>
                <option>Solo agent</option>
                <option>Luxury team</option>
                <option>Brokerage operator</option>
                <option>Marketing director</option>
              </select>
              <textarea className={styles.textarea} placeholder="What are you trying to improve: listing speed, brand consistency, CRM follow-up, admin visibility, or all of the above?" />
              <button type="button" className={styles.buttonPrimary}>Request demo</button>
            </form>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.contactGrid}>
            <article className={styles.card}>
              <h3>For solo agents</h3>
              <p>Get launch-ready marketing assets without hiring a coordinator for every listing.</p>
            </article>
            <article className={styles.card}>
              <h3>For brokerages</h3>
              <p>Standardize quality, accelerate onboarding, and see which teams are converting generated demand.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
