import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Turn Property Details Into<br />
              <span className={styles.highlight}>Polished Marketing Copy</span>
            </h1>
            <p className={styles.heroSubtitle}>
              ListingPilot AI is your real estate agent's marketing copilot. Generate
              MLS descriptions, social media posts, and email blurbs in seconds. No
              hallucinations. No scraping. Just credible, compliant copy.
            </p>
            <div className={styles.heroActions}>
              <Link to="/dashboard" className={styles.ctaPrimary}>
                <span>Try Free Demo</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <button className={styles.ctaSecondary} onClick={scrollToFeatures}>
                See Sample Output
              </button>
            </div>
            <div className={styles.trust}>
              <p>
                Built for real estate professionals who expect enterprise quality from
                their AI tooling.
              </p>
            </div>
          </div>
          <div className={styles.heroIllustration}>
            <div className={styles.card1}>
              <div className={styles.cardHeader}>MLS Description</div>
              <div className={styles.cardContent}>
                Recently updated chef's kitchen with quartz countertops...
              </div>
            </div>
            <div className={styles.card2}>
              <div className={styles.cardHeader}>Instagram</div>
              <div className={styles.cardContent}>
                ✨ Luxury meets comfort in this stunning Buckhead estate...
              </div>
            </div>
            <div className={styles.card3}>
              <div className={styles.cardHeader}>Email</div>
              <div className={styles.cardContent}>
                Perfect for the executive family seeking premium amenities...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>What You Get</h2>
            <p>Six channels of professional, MLS-compliant copy from one property entry.</p>
          </div>

          <div className={styles.featureGrid}>
            {[
              {
                icon: '🏷️',
                title: 'MLS Description',
                desc: 'Concise, feature-focused, MLS-compliant copy for listing platforms.',
              },
              {
                icon: '✨',
                title: 'Luxury Description',
                desc: 'Elevated tone with premium wording, grounded in provided facts.',
              },
              {
                icon: '📘',
                title: 'Facebook Post',
                desc: 'Engaging social post with clear CTA and professional framing.',
              },
              {
                icon: '📸',
                title: 'Instagram Caption',
                desc: 'Social-friendly copy with optional hashtag suggestions.',
              },
              {
                icon: '💼',
                title: 'LinkedIn Post',
                desc: 'Polished, business-appropriate content for agent networks.',
              },
              {
                icon: '📧',
                title: 'Email Blurb',
                desc: 'Short, reusable copy for newsletters and email campaigns.',
              },
            ].map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Three steps from property details to publication-ready copy.</p>
          </div>

          <div className={styles.stepsGrid}>
            {[
              {
                num: '1',
                title: 'Enter Property Details',
                desc: 'Fill in the form: address, price, beds, baths, features, notes. Takes 2–3 minutes.',
              },
              {
                num: '2',
                title: 'Generate Copy',
                desc: 'AI creates six pieces of polished marketing content, grounded only in what you provided.',
              },
              {
                num: '3',
                title: 'Review & Publish',
                desc: 'Copy-paste to MLS, social, email. Review for accuracy and compliance. Done.',
              },
            ].map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className={styles.guarantees}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Built for Trust</h2>
            <p>Enterprise-grade standards for real estate marketing.</p>
          </div>

          <div className={styles.guaranteeGrid}>
            {[
              {
                icon: '✓',
                title: 'No Hallucinations',
                desc: 'AI generates only from the property data you provide. No invented details.',
              },
              {
                icon: '🔒',
                title: 'MLS Compliant',
                desc: 'Generated copy avoids discriminatory language and unsupported claims.',
              },
              {
                icon: '📋',
                title: 'Manual Entry First',
                desc: 'Primary workflow is human data entry for accuracy and control.',
              },
              {
                icon: '🎯',
                title: 'Tone Control',
                desc: 'Choose Professional, Luxury, Friendly, or High-Energy. AI respects your voice.',
              },
              {
                icon: '⚡',
                title: 'No Scraping',
                desc: 'We do not scrape Zillow or other listing sites. Fully compliant.',
              },
              {
                icon: '🔄',
                title: 'Regenerate Anytime',
                desc: 'Adjust property details and regenerate. Iterate until perfect.',
              },
            ].map((g, i) => (
              <div key={i} className={styles.guaranteeCard}>
                <div className={styles.guaranteeIcon}>{g.icon}</div>
                <h3>{g.title}</h3>
                <p>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Output */}
      <section className={styles.sampleOutput}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>See It In Action</h2>
            <p>Sample output from a real Buckhead property.</p>
          </div>

          <div className={styles.sampleGrid}>
            <div className={styles.sampleCard}>
              <h4>MLS Description</h4>
              <p>
                This stunning Buckhead estate offers 5 bedrooms, 4.5 baths, and 4,200 sq ft of
                refined luxury living. Chef's kitchen with quartz countertops opens to the main
                living area with 10-ft ceilings. Luxurious primary suite features spa-inspired
                bath. Gourmet entertaining with heated saltwater pool, covered outdoor kitchen,
                and professionally landscaped grounds. 3-car garage. Excellent schools. Move-in
                ready.
              </p>
            </div>

            <div className={styles.sampleCard}>
              <h4>Instagram Caption</h4>
              <p>
                ✨ Where luxury meets lifestyle. This exquisite Buckhead estate boasts a chef's
                kitchen, spa suite, heated pool, and resort-style entertaining spaces. The dream
                home for the executive family. 📸 Showing by appointment. DM us today. 🏠
              </p>
            </div>

            <div className={styles.sampleCard}>
              <h4>Email Blurb</h4>
              <p>
                Looking for your next luxury home? This Buckhead gem features 5 BR / 4.5 BA,
                chef's kitchen, resort-style pool, and premium finishes. Perfect for the
                discerning buyer. Schedule your private tour today.
              </p>
            </div>
          </div>

          <div className={styles.sampleCta}>
            <p>
              Ready to see your own property's potential? Jump into the dashboard and generate
              your first set of copy.
            </p>
            <Link to="/dashboard" className={styles.ctaPrimary}>
              Start Generating →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricing}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Simple Pricing</h2>
            <p>Pay only for what you use. No hidden fees.</p>
          </div>

          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <h3>Free Tier</h3>
              <p className={styles.pricingPrice}>$0</p>
              <ul className={styles.pricingFeatures}>
                <li>✓ 3 generations / month</li>
                <li>✓ Full 6-channel output</li>
                <li>✓ Community support</li>
                <li>✗ History (7 days)</li>
                <li>✗ Team management</li>
              </ul>
              <Button variant="ghost" fullWidth disabled>
                Current Plan
              </Button>
            </div>

            <div className={`${styles.pricingCard} ${styles['pricingCard--featured']}`}>
              <div className={styles.badge}>Most Popular</div>
              <h3>Professional</h3>
              <p className={styles.pricingPrice}>
                $29<span>/mo</span>
              </p>
              <ul className={styles.pricingFeatures}>
                <li>✓ Unlimited generations</li>
                <li>✓ Full 6-channel output</li>
                <li>✓ Email support</li>
                <li>✓ 90-day history</li>
                <li>✓ Tone customization</li>
              </ul>
              <Button variant="accent" fullWidth>
                Coming Soon
              </Button>
            </div>

            <div className={styles.pricingCard}>
              <h3>Agency</h3>
              <p className={styles.pricingPrice}>
                $99<span>/mo</span>
              </p>
              <ul className={styles.pricingFeatures}>
                <li>✓ Unlimited generations</li>
                <li>✓ Full 6-channel output</li>
                <li>✓ Phone + email support</li>
                <li>✓ Unlimited history</li>
                <li>✓ Team management</li>
              </ul>
              <Button variant="secondary" fullWidth disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.finalCta}>
        <div className="container">
          <h2>Ready to Transform Your Property Marketing?</h2>
          <p>Try ListingPilot AI free for 14 days. No credit card required.</p>
          <Link to="/dashboard" className={styles.ctaPrimary}>
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div>
              <h4>ListingPilot AI</h4>
              <p>Your real estate agent's marketing copilot.</p>
            </div>
            <div>
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div>
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Compliance</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 ListingPilot AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
