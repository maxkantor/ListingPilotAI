import React from 'react';
import { Link } from 'react-router-dom';
import { trackCta } from '../utils/analytics';
import styles from './MarketingPremium.module.css';

const heroFeatures = ['MLS-safe language', 'Multi-channel launch assets', 'No hallucinated facts', 'Built for real agents'];

const workflow = [
  { step: '01', title: 'Enter property brief', copy: 'Capture address, price, and features in one clean form.' },
  { step: '02', title: 'Generate marketing assets', copy: 'Create MLS copy, Instagram captions, and email campaigns instantly.' },
  { step: '03', title: 'Publish and export', copy: 'Copy, export, and launch listings without extra cleanup loops.' },
];

const depthFeatures = [
  { title: 'User roles', copy: 'Give agents and admins the right level of access without adding product friction.' },
  { title: 'Lead tracking', copy: 'Capture warm inbound interest and keep owners, stages, and follow-through visible.' },
  { title: 'Audit history', copy: 'Keep a clean record of listing activity, edits, and operational decisions.' },
  { title: 'Plan controls', copy: 'Manage seats, usage, and rollout settings in a way that feels calm and lightweight.' },
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
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.kicker}>Premium AI for real estate teams</div>
              <h1 className={styles.title}>Create listing marketing in 30 seconds.</h1>
              <p className={styles.lead}>Turn one property brief into MLS descriptions, social posts, and email campaigns instantly.</p>
              <div className={styles.buttonRow}>
                <Link to="/workspace" className={styles.primaryBtn} onClick={() => trackCta('hero_start_trial', '/workspace')}>Start Free Trial</Link>
                <Link to="/demo" className={styles.secondaryBtn} onClick={() => trackCta('hero_view_demo', '/demo')}>See product demo</Link>
              </div>
              <div className={styles.chips}>{heroFeatures.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
            <div className={`${styles.surface} ${styles.primarySurface}`}>
              <div className={styles.panelHeader}><span>Product preview</span><span>Launch Studio</span></div>
              <div className={styles.twoColTight}>
                <div className={styles.panelBlock}>
                  <span className={styles.pillDark}>Property input</span>
                  <h3>1180 West Paces Ferry Rd NW</h3>
                  <p>$2,450,000 · 5 beds · 5.5 baths · 5,900 sq ft</p>
                  <p>Chef’s kitchen + prep pantry · Resort-style pool · Private office and media lounge</p>
                </div>
                <div className={styles.panelBlock}>
                  <div className={styles.tabs}>
                    <span className={styles.activeTab}>MLS</span>
                    <span>Instagram</span>
                    <span>Email</span>
                  </div>
                  <p>Refined Buckhead living with statement entertaining spaces, a light-filled open plan, and a primary suite designed for calm, elevated everyday living.</p>
                  <div className={styles.actions}>
                    <button type="button">Copy</button>
                    <button type="button">Favorite</button>
                    <button type="button">Export</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Product workflow</span>
            <h2 className={styles.sectionTitle}>Show the workflow before the pitch.</h2>
            <p className={styles.sectionBody}>A real listing input, output tabs, and action controls optimized for conversion clarity.</p>
          </div>
          <div className={styles.workflowShell}>
            <div className={styles.demoSplit}>
              <div className={styles.surface}>
                <span className={styles.pillDark}>Property input</span>
                <h3>4812 Wieuca Road NE</h3>
                <p>Atlanta, GA · $1,275,000 · 5 beds · 4.5 baths</p>
                <div className={styles.chips}><span>Chef’s kitchen</span><span>Pool + terrace</span><span>Move-in ready</span></div>
              </div>
              <div className={`${styles.surface} ${styles.primarySurface}`}>
                <span className={styles.pillDark}>Generated outputs</span>
                <div className={styles.tabs}>
                  <span className={styles.activeTab}>MLS Description</span>
                  <span>Instagram Caption</span>
                  <span>Email Campaign</span>
                </div>
                <p>Elegant Buckhead residence with a chef’s kitchen, open-concept living spaces, and a backyard designed for memorable entertaining.</p>
                <div className={styles.actions}>
                  <button type="button">Copy</button>
                  <button type="button">Favorite</button>
                  <button type="button">Export</button>
                </div>
              </div>
            </div>
            <div className={styles.proofRow}>
              <article className={styles.proofCard}><h3>30–60m saved</h3><p>Per launch cycle</p></article>
              <article className={styles.proofCard}><h3>Fewer rewrites</h3><p>Cleaner first draft output</p></article>
              <article className={styles.proofCard}><h3>MLS-safe</h3><p>Grounded language controls</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact} id="features">
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>How it works</span>
            <h2 className={styles.sectionTitle}>Three compact steps from brief to publish.</h2>
          </div>
          <div className={styles.compactSteps}>
            {workflow.map((item) => (
              <article key={item.step} className={styles.stepCard}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <div className={styles.sectionIntro}>
              <span className={styles.sectionKicker}>Product depth</span>
              <h2 className={styles.sectionTitle}>Built for serious agents and lean teams.</h2>
              <p className={styles.sectionBody}>Launch generation, reusable history, team operations, and admin controls in one system.</p>
            </div>
            <div className={styles.productPanels}>
              {depthFeatures.map((feature) => (
                <article key={feature.title} className={styles.panelBlock}>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <span className={styles.sectionKicker}>Pricing</span>
            <h2 className={styles.sectionTitle}>Simple plans. Premium output.</h2>
          </div>
          <div className={styles.pricingRow}>
            {pricing.map((plan) => (
              <article key={plan.name} className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}>
                {plan.featured ? <span className={styles.planBadge}>Most popular</span> : null}
                <h3>{plan.name}</h3>
                <p className={styles.price}>{plan.price}{plan.price === '$0' ? '' : ' / month'}</p>
                <p>{plan.note}</p>
                <Link to={plan.name === 'Agency' ? '/contact' : '/workspace'} className={styles.ghostBtn} onClick={() => trackCta(`pricing_${plan.name.toLowerCase()}`, plan.name === 'Agency' ? '/contact' : '/workspace')}>{plan.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.sectionCompact} ${styles.ctaSection}`}>
        <div className={styles.container}>
          <div className={styles.ctaBand}>
            <span className={styles.sectionKicker}>Final CTA</span>
            <h2 className={styles.sectionTitle}>Launch listing marketing like a premium SaaS product.</h2>
            <p className={styles.sectionBody}>Start free or book a guided demo.</p>
            <div className={styles.buttonRow}>
              <Link to="/workspace" className={styles.primaryBtn} onClick={() => trackCta('final_start_free', '/workspace')}>Start free</Link>
              <Link to="/contact" className={styles.ghostBtn} onClick={() => trackCta('final_book_demo', '/contact')}>Book demo</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
