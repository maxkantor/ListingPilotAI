import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './LandingPage.module.css';

const proofItems = [
  'MLS-safe language guardrails',
  'Multi-channel launch assets in seconds',
  'No scraping. No invented property facts.',
  'Built for modern agents and lean teams',
];

const workflow = [
  {
    step: '01',
    title: 'Enter the property brief',
    copy: 'Capture the address, pricing, features, buyer angle, tone, and agent notes in one polished workflow.',
  },
  {
    step: '02',
    title: 'Generate launch-ready assets',
    copy: 'Create MLS copy, luxury narratives, social posts, and an email campaign from the same source of truth.',
  },
  {
    step: '03',
    title: 'Ship, save, and follow through',
    copy: 'Copy, export, save to history, and route the hottest inbound leads to the right owner before momentum fades.',
  },
];

const featureGroups = [
  {
    title: 'Marketing engine',
    items: ['MLS description generator', 'Instagram, Facebook, and LinkedIn outputs', 'Luxury tone and variant generation', 'Email campaign and relaunch copy'],
  },
  {
    title: 'Team workflow',
    items: ['Saved history and reusable drafts', 'Favorites, export, and approval review', 'Shared presets and compliance-aware defaults', 'Usage visibility by team and plan'],
  },
  {
    title: 'Business operations',
    items: ['Lead CRM with stages and owner assignment', 'Admin analytics and user management', 'Plan, usage, and billing-ready controls', 'Audit events and support visibility'],
  },
];

const pricing = [
  { name: 'Free', price: '$0', note: 'Try the generator with a few polished launches each month.', cta: 'Start free' },
  { name: 'Professional', price: '$79', note: 'Best for serious agents who want speed, history, and premium output quality.', cta: 'Start free trial', featured: true },
  { name: 'Agency', price: '$249', note: 'Built for teams needing admin controls, usage management, and rollout support.', cta: 'Book demo' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>Premium AI for real estate teams</div>
              <h1>Create Listing Marketing in 30 Seconds</h1>
              <p className={styles.subheadline}>
                Turn one property brief into MLS descriptions, social posts, and email campaigns instantly — with a product experience that feels built for premium agents, not generic AI demos.
              </p>

              <div className={styles.ctaRow}>
                <Link to="/dashboard" className={styles.primaryCta} onClick={() => trackCta('hero_start_trial', '/dashboard')}>
                  Start Free Trial
                </Link>
                <Link to="/demo" className={styles.secondaryCta} onClick={() => trackCta('hero_view_demo', '/demo')}>
                  See Sample Output
                </Link>
              </div>

              <div className={styles.trustBadges}>
                {proofItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className={styles.heroVisualWrap}>
              <div className={styles.heroGlow} />
              <div className={styles.heroVisual}>
                <div className={styles.previewTopBar}>
                  <span className={styles.previewPill}>Launch Studio</span>
                  <span className={styles.previewMeta}>MLS-safe output mode</span>
                </div>

                <div className={styles.previewLayout}>
                  <div className={styles.previewInputCard}>
                    <div className={styles.previewLabel}>Property input</div>
                    <h3>1180 West Paces Ferry Rd NW</h3>
                    <p>$2,450,000 · 5 beds · 5.5 baths · 5,900 sq ft</p>
                    <ul>
                      <li>Chef’s kitchen + prep pantry</li>
                      <li>Resort-style pool and covered terrace</li>
                      <li>Private office + media lounge</li>
                    </ul>
                  </div>

                  <div className={styles.previewOutputStack}>
                    <article className={styles.previewCardPrimary}>
                      <div>
                        <span>MLS Description</span>
                        <strong>Ready to publish</strong>
                      </div>
                      <p>
                        Refined Buckhead living with statement entertaining spaces, a light-filled open plan, and a primary suite designed for calm, elevated everyday living.
                      </p>
                    </article>
                    <article className={styles.previewCardSecondary}>
                      <span>Instagram Caption</span>
                      <p>Buckhead luxury, layered natural light, and a backyard made for private showings that turn into offers. ✨</p>
                    </article>
                    <article className={styles.previewCardSecondary}>
                      <span>Email Campaign</span>
                      <p>New to market: executive-scale Atlanta living with premium finishes, show-ready outdoor space, and strong buyer appeal.</p>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.proofStrip}>
        <div className="container">
          <div className={styles.proofStripInner}>
            {proofItems.map((item) => (
              <div key={item} className={styles.proofChip}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="features">
        <div className="container">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Product workflow</span>
            <h2>Enter property → AI generates marketing → Copy and publish</h2>
            <p>Everything is designed to feel fast, premium, and trustworthy for real agents shipping real listings.</p>
          </div>
          <div className={styles.workflowRail}>
            {workflow.map((item) => (
              <article key={item.step} className={styles.workflowCard}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <div className={styles.demoGrid}>
            <div className={styles.propertyShowcase}>
              <div className={styles.propertyMedia} />
              <div className={styles.propertyMeta}>
                <strong>4812 Wieuca Road NE</strong>
                <span>Atlanta, GA · $1,275,000 · 5 beds · 4.5 baths</span>
              </div>
            </div>

            <div className={styles.outputShowcase}>
              <div className={styles.tabRow}>
                <span className={styles.activeTab}>MLS Description</span>
                <span>Instagram</span>
                <span>Email Campaign</span>
              </div>
              <div className={styles.outputPanel}>
                <p>
                  Elegant Buckhead residence with a chef’s kitchen, open-concept living spaces, a spa-caliber primary suite, and a backyard designed for memorable entertaining.
                </p>
                <div className={styles.copyRow}>
                  <button type="button">Copy</button>
                  <button type="button">Favorite</button>
                  <button type="button">Export</button>
                </div>
              </div>
              <div className={styles.whyWinsGrid}>
                <article>
                  <strong>30–60 min saved</strong>
                  <p>Per listing launch compared with writing channel copy manually.</p>
                </article>
                <article>
                  <strong>Fewer rewrites</strong>
                  <p>Generate variations and keep a reusable history of what wins.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Why it wins</span>
            <h2>Serious product depth for agents, teams, and lean brokerages.</h2>
          </div>
          <div className={styles.featureGrid}>
            {featureGroups.map((group) => (
              <article key={group.title} className={styles.featureCard}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <div className={styles.adminShowcase}>
            <div className={styles.sectionIntroCompact}>
              <span className={styles.sectionKicker}>Admin CRM / back office</span>
              <h2>Business-grade controls without heavyweight infrastructure.</h2>
              <p>User management, lead stages, plan visibility, support tracking, and audit history are built into the product story.</p>
            </div>
            <div className={styles.adminSnapshot}>
              <div><span>Total users</span><strong>124</strong></div>
              <div><span>Trial → paid</span><strong>29%</strong></div>
              <div><span>Leads tracked</span><strong>318</strong></div>
              <div><span>MRR placeholder</span><strong>$18.4k</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Pricing</span>
            <h2>Simple plans. Premium positioning.</h2>
          </div>
          <div className={styles.pricingGrid}>
            {pricing.map((plan) => (
              <article key={plan.name} className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}>
                <span>{plan.name}</span>
                <h3>{plan.price}<small>{plan.price === '$0' ? '' : ' / month'}</small></h3>
                <p>{plan.note}</p>
                <Link to={plan.name === 'Agency' ? '/contact' : '/dashboard'} className={styles.cardCta} onClick={() => trackCta(`pricing_${plan.name.toLowerCase()}`, plan.name === 'Agency' ? '/contact' : '/dashboard')}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCtaSection}>
        <div className="container">
          <div className={styles.finalCtaCard}>
            <div>
              <span className={styles.sectionKicker}>Launch faster</span>
              <h2>Make the first impression feel like a premium AI company.</h2>
              <p>Start free, book a demo, or preview sample output from a realistic listing launch.</p>
            </div>
            <div className={styles.ctaRow}>
              <Link to="/dashboard" className={styles.primaryCta} onClick={() => trackCta('final_start_free', '/dashboard')}>Start free</Link>
              <Link to="/contact" className={styles.secondaryCta} onClick={() => trackCta('final_book_demo', '/contact')}>Book demo</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
