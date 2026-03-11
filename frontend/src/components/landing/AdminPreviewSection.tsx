import React from 'react';
import styles from './LandingV2.module.css';

export const AdminPreviewSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.adminPreviewShell}>
          <div className={styles.sectionHeaderWide}>
            <span className={styles.eyebrow}>Admin / CRM preview</span>
            <h2 className={styles.title}>Business-grade visibility for teams, brokerages, and operators.</h2>
            <p className={styles.subtitle}>
              See agent adoption, trial-to-paid signals, lead stages, usage thresholds, and support pressure without leaving the platform.
            </p>
          </div>

          <div className={styles.adminPreviewGrid}>
            <div className={styles.adminCanvas}>
              <div className={styles.adminKpiRow}>
                <div className={styles.adminKpi}><span>Active agents</span><strong>124</strong></div>
                <div className={styles.adminKpi}><span>Trials</span><strong>38</strong></div>
                <div className={styles.adminKpi}><span>MRR</span><strong>$18.4k</strong></div>
              </div>
              <div className={styles.adminStageBoard}>
                <div><span>New</span><strong>28</strong></div>
                <div><span>Contacted</span><strong>14</strong></div>
                <div><span>Demo Scheduled</span><strong>9</strong></div>
                <div><span>Won</span><strong>4</strong></div>
              </div>
            </div>
            <div className={styles.adminBenefits}>
              <div className={styles.adminBenefit}><strong>User management</strong><span>Search, filter, plan status, usage overrides.</span></div>
              <div className={styles.adminBenefit}><strong>Lead CRM</strong><span>Track demo requests, assign owners, add notes and tags.</span></div>
              <div className={styles.adminBenefit}><strong>Plans + audit</strong><span>Usage controls, trial rules, billing-ready plan scaffolding, and event logs.</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
