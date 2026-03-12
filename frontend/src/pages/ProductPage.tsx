import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MarketingPage.module.css';

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
        <div className={styles.container}>
          <div className={styles.twoCol}>
          <div>
            <div className={styles.kicker}>Product operating model</div>
            <h1 className={styles.title}>The software system behind every listing launch.</h1>
            <p className={styles.lead}>
              ListingPilot AI turns one property brief into a full launch engine: positioning,
              copy generation, CRM follow-up, and visibility into what is actually moving buyers.
            </p>
            <div className={styles.buttonRow}>
              <Link to="/workspace" className={styles.primaryBtn}>Open workspace</Link>
              <Link to="/demo" className={styles.secondaryBtn}>See sample launch</Link>
            </div>
            <div className={styles.chips}>
              <span>Built for solo agents and teams</span>
              <span>MLS-safe review flows</span>
              <span>CRM and admin ready</span>
            </div>
          </div>

          <div className={styles.surface}>
            <div className={styles.grid4}>
              <article className={styles.stat}><h3>42 sec</h3><p>Time to launch</p></article>
              <article className={styles.stat}><h3>61%</h3><p>Agent adoption</p></article>
              <article className={styles.stat}><h3>+18%</h3><p>Lead lift</p></article>
              <article className={styles.stat}><h3>6+</h3><p>Outputs per listing</p></article>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <div className={styles.sectionKicker}>Three layers</div>
            <h2 className={styles.sectionTitle}>Designed like software, not a one-off AI widget.</h2>
            <p className={styles.sectionBody}>
            Every surface is aligned around faster launches, better conversion, and cleaner operator visibility — with low-cost serverless infrastructure underneath.
          </p>
          </div>
          <div className={styles.productPanels}>
            {operatingLayers.map((layer) => (
              <article key={layer.title} className={styles.panelBlock}>
                <div className={styles.pillDark}>{layer.title}</div>
                <h3>{layer.title}</h3>
                <p>{layer.copy}</p>
                <ul>
                  {layer.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <div className={styles.sectionKicker}>What teams unlock</div>
            <h2 className={styles.sectionTitle}>One workspace for strategy, production, and follow-through.</h2>
          </div>
          <div className={styles.workflowShell}>
            <div className={styles.twoCol}>
              <div className={styles.surface}>
                <h3>Core capabilities</h3>
                <ul>
                  {featureRails.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.surface} ${styles.pricingCardFeatured}`}>
                <div className={styles.sectionKicker}>Enterprise signal</div>
                <h3>Know where conversion is rising — and where your team is leaking momentum.</h3>
                <p>
                  ListingPilot AI surfaces top channels, launch bottlenecks, agent utilization, and lead stages so managers can coach faster.
                </p>
                <h3>$3.8M</h3>
                <p>Pipeline value currently influenced by active ListingPilot-generated campaigns.</p>
              </div>
            </div>
            <div className={styles.proofRow}>
              <article className={styles.proofCard}><h3>42 sec</h3><p>Time to launch</p></article>
              <article className={styles.proofCard}><h3>61%</h3><p>Agent adoption</p></article>
              <article className={styles.proofCard}><h3>+18%</h3><p>Lead lift</p></article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
