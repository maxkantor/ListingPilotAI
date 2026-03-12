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
    copy: 'Capture address, price, features.',
  },
  {
    step: '02',
    title: 'Generate marketing assets',
    copy: 'MLS copy, Instagram captions, emails.',
  },
  {
    step: '03',
    title: 'Publish and export',
    copy: 'Copy, export, and launch listings.',
  },
];

const benefits = [
  {
    title: 'Fast listing launches',
    copy: 'Turn one brief into launch-ready copy without reworking each channel by hand.',
  },
  {
    title: 'MLS-safe language',
    copy: 'Keep outputs grounded, polished, and easier to review before publishing.',
  },
  {
    title: 'Multi-channel marketing',
    copy: 'Generate MLS descriptions, social captions, and email campaigns from the same source of truth.',
  },
  {
    title: 'Reusable listing history',
    copy: 'Keep winning outputs close so agents can relaunch faster and reuse proven messaging.',
  },
];

const depthFeatures = [
  {
    title: 'User roles',
    copy: 'Separate agent, admin, and team workflows without cluttering the core experience.',
  },
  {
    title: 'Lead tracking',
    copy: 'Route listing responses into a lightweight CRM view with clear ownership and follow-up.',
  },
  {
    title: 'Audit history',
    copy: 'Keep a visible record of listing activity, edits, and review decisions for lean teams.',
  },
  {
    title: 'Plan controls',
    copy: 'Manage seats, limits, and rollout settings with a back office that feels calm and simple.',
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
              <div className={styles.heroVisual}>
                <div className={styles.previewTopBar}>
                  <span className={styles.previewPill}>Launch Studio</span>
                  <span className={styles.previewMeta}>Calm workflow · high-trust output</span>
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
                        <span>Publish-ready output</span>
                        <strong>MLS, social, and email from one brief</strong>
                      </div>
                      <p>
                        Refined Buckhead living with statement entertaining spaces, a light-filled plan, and a primary suite designed for calm, elevated everyday living.
                      </p>
                    </article>
                    <article className={styles.previewCardSecondary}>
                      <span>Saved history</span>
                      <p>Keep winning listing launches close so agents can relaunch without starting from zero.</p>
                    </article>
                    <article className={styles.previewCardSecondary}>
                      <span>Team controls</span>
                      <p>Favorites, exports, review flow, and role-based back office controls stay close but unobtrusive.</p>
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
            <h2>See the product before the pitch.</h2>
            <p>A tighter, product-first workspace that shows agents exactly how ListingPilot turns one listing brief into launch-ready output.</p>
          </div>

          <div className={styles.demoGrid}>
            <article className={styles.propertyShowcase}>
              <div className={styles.propertyMedia} />
              <div className={styles.propertyMeta}>
                <strong>4812 Wieuca Road NE</strong>
                <span>Atlanta, GA · $1,275,000 · 5 beds · 4.5 baths</span>
              </div>
              <div className={styles.propertySpecs}>
                <span>Chef’s kitchen</span>
                <span>Pool + terrace</span>
                <span>Move-in ready</span>
              </div>
            </article>

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
                  <p>Per listing launch compared with writing each asset manually.</p>
                </article>
                <article>
                  <strong>Fewer rewrites</strong>
                  <p>Sharper first drafts mean less cleanup before agents publish.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="features">
        <div className="container">
          <div className={styles.sectionIntroCompact}>
            <span className={styles.sectionKicker}>How it works</span>
            <h2>From brief to publish in three tight steps.</h2>
          </div>
          <div className={styles.workflowRail}>
            {workflow.map((item) => (
              <article key={item.step} className={styles.workflowCard}>
                <span className={styles.workflowStep}>{item.step}</span>
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
            <h2>Real product value, not filler messaging.</h2>
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
            <div className={styles.depthCopy}>
              <span className={styles.sectionKicker}>Product depth</span>
              <h2>Built for serious agents and lean teams</h2>
              <p>
                ListingPilot is not just a copy generator. It gives small teams a composed operational layer for shipping listing campaigns, keeping history close, and coordinating follow-through.
              </p>
              <p>
                The product stays product-first: generate assets fast, keep roles clear, and support launches with lightweight CRM and admin controls that feel calm rather than enterprise-heavy.
              </p>
            </div>
            <div className={styles.depthFeatureGrid}>
              {depthFeatures.map((feature) => (
                <article key={feature.title} className={styles.depthFeatureCard}>
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
            <h2>Simple plans for agents and teams.</h2>
          </div>
          <div className={styles.pricingGrid}>
            {pricing.map((plan) => (
              <article key={plan.name} className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}>
                <span className={styles.pricingLabel}>{plan.name}</span>
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
              <p>Start free or book a demo to see how ListingPilot helps serious agents ship polished listing launches faster.</p>
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
