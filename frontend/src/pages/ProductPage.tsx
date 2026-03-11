import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicPage.module.css';

const operatingLayers = [
  {
    title: 'Launch studio',
    copy: 'Build a launch brief once and generate MLS copy, luxury narratives, social assets, and nurture email in one controlled motion.',
    items: ['AI brief builder', 'Channel-aware copy', 'Approval-ready review'],
  },
  {
    title: 'Team command layer',
    copy: 'Give brokers, marketing coordinators, and agents a single place to see listing velocity, stalled campaigns, and pipeline value.',
    items: ['Activity visibility', 'Performance rollups', 'Role-based workflows'],
  },
  {
    title: 'CRM momentum',
    copy: 'Carry every listing campaign into follow-up with lead signals, owner assignment, and concierge-grade task prompts.',
    items: ['Lead scoring', 'Stage tracking', 'Next-action recommendations'],
  },
];

const featureRails = [
  'Premium listing briefs with tone, audience, and positioning controls',
  'Cross-channel output system for MLS, Instagram, email, LinkedIn, and sales enablement',
  'History, remixing, and compliance review so teams can reuse what wins',
  'Admin analytics covering activation, conversion, support pressure, and revenue signals',
];

export const ProductPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.eyebrow}>Product operating system</div>
            <h1 className={styles.heroTitle}>The premium growth layer for modern real estate teams.</h1>
            <p className={styles.heroText}>
              ListingPilot AI turns one property brief into a full launch engine: positioning,
              copy generation, CRM follow-up, and visibility into what is actually moving buyers.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/dashboard" className={styles.buttonPrimary}>Open workspace</Link>
              <Link to="/demo" className={styles.buttonSecondary}>See sample launch</Link>
            </div>
            <div className={styles.heroMeta}>
              <span>Built for solo agents, luxury teams, and brokerages</span>
              <span>MLS-safe prompts and review flows</span>
              <span>Admin + CRM ready</span>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Platform snapshot</span>
              <span>Updated live</span>
            </div>
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Time to launch</div>
                <div className={styles.statValue}>42 sec</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Agent adoption</div>
                <div className={styles.statValue}>61%</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Lead lift</div>
                <div className={styles.statValue}>+18%</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Outputs per listing</div>
                <div className={styles.statValue}>6+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Three layers</div>
          <h2 className={styles.sectionTitle}>Designed like a serious SaaS platform, not a single-purpose AI widget.</h2>
          <p className={styles.sectionText}>
            Every surface is aligned around faster launches, better conversion, and cleaner operator visibility — with low-cost serverless infrastructure underneath.
          </p>
          <div className={styles.grid3}>
            {operatingLayers.map((layer) => (
              <article key={layer.title} className={styles.card}>
                <div className={styles.kicker}>{layer.title}</div>
                <h3>{layer.title}</h3>
                <p>{layer.copy}</p>
                <ul className={styles.list}>
                  {layer.items.map((item) => (
                    <li key={item}><span>✦</span><span>{item}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>What teams unlock</div>
          <h2 className={styles.sectionTitle}>One workspace for strategy, production, and follow-through.</h2>
          <div className={styles.grid2}>
            <div className={styles.featureRail}>
              <h3>Core capabilities</h3>
              <ul className={styles.list}>
                {featureRails.map((item) => (
                  <li key={item}><span>✓</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.kicker}>Enterprise signal</div>
              <h3>Know where conversion is rising — and where your team is leaking momentum.</h3>
              <p>
                ListingPilot AI surfaces top channels, launch bottlenecks, agent utilization, and lead stages so managers can coach faster.
              </p>
              <div className={styles.bigMetric}>$3.8M</div>
              <p>Pipeline value currently influenced by active ListingPilot-generated campaigns.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
