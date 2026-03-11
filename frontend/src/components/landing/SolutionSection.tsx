import React from 'react';
import styles from './LandingSections.module.css';

const channels = [
  {
    name: 'MLS Description',
    sample: 'Feature-focused listing copy that stays factual, concise, and MLS-safe for rapid publication.',
  },
  {
    name: 'Instagram Caption',
    sample: 'Short social-ready copy with polished tone and listing highlights agents can post immediately.',
  },
  {
    name: 'Facebook Post',
    sample: 'Longer awareness post with clear CTA to drive inquiries and private-showing requests.',
  },
  {
    name: 'Email Campaign',
    sample: 'Buyer-ready campaign snippet emphasizing value, availability, and key property differentiators.',
  },
  {
    name: 'LinkedIn Post',
    sample: 'Professional market-facing copy for brokers, relocation contacts, and referral networks.',
  },
  {
    name: 'Luxury Listing Description',
    sample: 'Elevated premium narrative for high-end inventory while preserving compliance and factual accuracy.',
  },
];

export const SolutionSection: React.FC = () => {
  return (
    <section id="features" className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.solutionLayout}>
          <div className={styles.solutionIntro}>
            <h2 className={styles.sectionTitle}>One Property Entry. Six Marketing Channels.</h2>
            <p className={styles.sectionSubtitle}>
              ListingPilot turns one structured property brief into full-funnel listing marketing across the channels agents actually use.
            </p>
          </div>

          <div className={styles.solutionBoard}>
            {channels.map((channel) => (
              <article key={channel.name} className={styles.solutionCard}>
                <span className={styles.channelTag}>{channel.name}</span>
                <p>{channel.sample}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};