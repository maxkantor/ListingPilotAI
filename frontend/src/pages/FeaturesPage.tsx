import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MarketingPremium.module.css';

const clusters = [
  {
    title: 'Listing intelligence',
    points: ['Structured brief builder', 'Tone and channel controls', 'Compliance-aware generation'],
  },
  {
    title: 'Launch workflow',
    points: ['MLS + social + email in one run', 'Copy, favorite, export actions', 'Reusable winning launch templates'],
  },
  {
    title: 'Team operations',
    points: ['Shared workspace history', 'Role-based controls', 'Rollup visibility for managers'],
  },
];

const operations = [
  { title: 'Compliance', copy: 'Keep output grounded with review controls and standardized team language.' },
  { title: 'Collaboration', copy: 'Coordinate agents and operators with shared templates and clean ownership.' },
  { title: 'Launch speed', copy: 'Reduce cycles from hours to minutes with reusable launch workflows.' },
  { title: 'Reuse and remix', copy: 'Promote top-performing assets into reusable campaign frameworks.' },
];

export const FeaturesPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <span className={styles.kicker}>Features</span>
            <h1 className={styles.title}>Structured product depth for real listing operations.</h1>
            <p className={styles.lead}>ListingPilot combines generation, team workflow, and operational controls in one calm, fast system.</p>
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.productPanels}>
            {clusters.map((cluster) => (
              <article key={cluster.title} className={styles.panelBlock}>
                <span className={styles.pillDark}>{cluster.title}</span>
                <h3>{cluster.title}</h3>
                <ul>
                  {cluster.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.workflowShell}>
            <div className={styles.twoCol}>
              <article className={styles.surface}>
                <span className={styles.pillDark}>Workflow block</span>
                <h3>Brief → Outputs → Review → Launch</h3>
                <p>Capture listing details once, generate cross-channel assets, apply team review controls, and launch faster.</p>
              </article>
              <article className={styles.surface}>
                <span className={styles.pillDark}>Operations block</span>
                <h3>Pipeline → Follow-up → Conversion</h3>
                <p>Connect generated campaigns to CRM activity so teams can prioritize what is moving buyers.</p>
              </article>
            </div>
            <div className={styles.proofRow}>
              <article className={styles.proofCard}><h3>Compliance</h3><p>Keep output grounded with review controls and standardized team language.</p></article>
              <article className={styles.proofCard}><h3>Collaboration</h3><p>Coordinate agents and operators with shared templates and clean ownership.</p></article>
              <article className={styles.proofCard}><h3>Launch speed</h3><p>Reduce cycles from hours to minutes with reusable launch workflows.</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Team capabilities</span>
            <h2 className={styles.sectionTitle}>Built for launch, compliance, collaboration, and reuse.</h2>
          </div>
          <div className={styles.productPanels}>
            {operations.map((item) => (
              <article key={item.title} className={styles.panelBlock}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>

          <div className={styles.ctaBand}>
            <h2 className={styles.sectionTitle}>See how this works in your team workflow.</h2>
            <div className={styles.buttonRow}>
              <Link to="/demo" className={styles.primaryBtn}>View demo</Link>
              <Link to="/workspace" className={styles.ghostBtn}>Start free trial</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
