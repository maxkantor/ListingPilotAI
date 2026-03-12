import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './LandingPage.module.css';

const heroFeatures = [
  'MLS-safe language',
  'Multi-channel launch assets',
  'No hallucinated facts',
  'Built for real agents',
];

const workflow = [
  {
    step: '01',
    title: 'Enter property brief',
    copy: 'Capture address, price, and features in one clean form.',
  },
  {
    step: '02',
    title: 'Generate marketing assets',
    copy: 'Create MLS copy, Instagram captions, and email campaigns instantly.',
  },
  {
    step: '03',
    title: 'Publish and export',
    copy: 'Copy, export, and launch listings without extra cleanup loops.',
  },
];

const benefits = [
  {
    title: 'Fast listing launches',
    copy: 'Move from listing brief to launch-ready marketing in one short workflow.',
  },
  {
    title: 'MLS-safe language',
    copy: 'Keep output polished, grounded, and easier to review before publishing.',
  },
  {
    title: 'Multi-channel marketing',
    copy: 'Generate MLS descriptions, social posts, and email campaigns from one source of truth.',
  },
  {
    title: 'Reusable listing history',
    copy: 'Keep strong launches close so agents can reuse and relaunch faster.',
  },
];

const depthFeatures = [
  {
    title: 'User roles',
    copy: 'Give agents and admins the right level of access without adding product friction.',
  },
  {
    title: 'Lead tracking',
    copy: 'Capture warm inbound interest and keep owners, stages, and follow-through visible.',
  },
  {
    title: 'Audit history',
    copy: 'Keep a clean record of listing activity, edits, and operational decisions.',
  },
  {
    title: 'Plan controls',
    copy: 'Manage seats, usage, and rollout settings in a way that feels calm and lightweight.',
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
                Turn one property brief into MLS descriptions, social posts, and email campaigns instantly — built for serious agents.
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
                {heroFeatures.map((item) => (
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
                    <div className={styles.previewLabel}>Property brief</div>
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

      <section className={`${styles.section} ${styles.productSection}`}>
        <div className="container">
          <div className={styles.sectionIntroCompact}>
            <span className={styles.sectionKicker}>Product demo</span>
            <h2>The product is the pitch.</h2>
            <p>Show the listing brief, the generated assets, and the speed benefit immediately — without hiding the real workflow below the fold.</p>
          </div>

          <div className={styles.demoGrid}>
            <div className={styles.propertyShowcase}>
              <div className={styles.propertyMedia} />
              <div className={styles.propertyMeta}>
                <strong>4812 Wieuca Road NE</strong>
                <span>Atlanta, GA · $1,275,000 · 5 beds · 4.5 baths</span>
              </div>
              <div className={styles.propertyTags}>
                <span>Chef’s kitchen</span>
                <span>Pool + terrace</span>
                <span>Move-in ready</span>
              </div>
            </div>

            <div className={styles.outputShowcase}>
              <div className={styles.tabRow}>
                <span className={styles.activeTab}>MLS Description</span>
                <span>Instagram Caption</span>
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
                  <strong>30–60 minutes saved</strong>
                  <p>Per listing launch compared with writing channel copy manually.</p>
                </article>
                <article>
                  <strong>Fewer rewrites</strong>
                  <p>Generate faster first drafts with less cleanup before publishing.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="features">
        <div className="container">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>How it works</span>
            <h2>Three compact steps from brief to publish.</h2>
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
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Benefits</span>
            <h2>Real product value for modern real estate teams.</h2>
          </div>
          <div className={styles.benefitGrid}>
            {benefits.map((benefit) => (
              <article key={benefit.title} className={styles.benefitCard}>
                <h3>{benefit.title}</h3>
                <p>{benefit.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.depthGrid}>
            <div className={styles.sectionIntroCompact}>
              <span className={styles.sectionKicker}>Product depth</span>
              <h2>Built for serious agents and lean teams.</h2>
              <p>ListingPilot goes beyond generation with a tight operational layer for saved history, team coordination, and lightweight back-office control.</p>
            </div>
            <div className={styles.depthFeatureGrid}>
              {depthFeatures.map((feature) => (
                <article key={feature.title} className={styles.depthCard}>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              ))}
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
              <h2>Launch listing marketing like a premium AI company.</h2>
              <p>Start free or book a demo to see the product in a realistic listing workflow.</p>
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
