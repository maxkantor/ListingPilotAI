import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Generate in Seconds',
    description:
      'Transform raw property details into polished, platform-ready marketing copy — MLS, social, and email — instantly.',
  },
  {
    icon: '🎯',
    title: 'Six Formats at Once',
    description:
      'MLS description, luxury narrative, Facebook post, Instagram caption, LinkedIn article, and email blurb — one click.',
  },
  {
    icon: '🤝',
    title: 'Fair Housing Compliant',
    description:
      'Built with compliance in mind. All generated content focuses on property features, not protected characteristics.',
  },
  {
    icon: '✏️',
    title: 'Always Editable',
    description:
      'Copy any output to your clipboard and refine it to match your voice. You stay in control of the final message.',
  },
];

const SAMPLE_OUTPUTS = [
  {
    label: 'MLS Description',
    preview:
      'Welcome to 1847 Whisperwood Lane, a stunning 4-bed, 3.5-bath single family home nestled in the heart of Whisperwood Estates, Tucker, GA. 3,200 sq ft of thoughtfully designed living space on 0.45 acres, built in 2019...',
  },
  {
    label: 'Instagram Caption',
    preview:
      '✨ New to Market ✨\n\n1847 Whisperwood Lane | Tucker, GA\n$724,900 • 4BD / 3.5BA • 3,200 sqft\n\nSwipe to see inside this stunning home in Whisperwood Estates. From the moment you walk in, you\'ll feel right at home.',
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>AI-Powered Real Estate Marketing</div>
          <h1 className={styles.heroHeadline}>
            Turn Listing Details into{' '}
            <span className={styles.heroAccent}>Marketing Gold</span>
            {' '}in Seconds
          </h1>
          <p className={styles.heroSubtitle}>
            ListingPilot AI writes your MLS descriptions, social posts, and email copy
            — so you can spend less time at your keyboard and more time closing deals.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/dashboard" className={styles.ctaPrimary}>
              Try Demo Free →
            </Link>
            <button
              className={styles.ctaSecondary}
              onClick={() => {
                document.getElementById('sample-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See Sample Output
            </button>
          </div>
          <p className={styles.heroDisclaimer}>No credit card required · Works with any listing</p>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Just Generated</div>
            <div className={styles.heroCardLabel}>MLS Description</div>
            <p className={styles.heroCardText}>
              "Welcome to 1847 Whisperwood Lane, a stunning 4-bed, 3.5-bath home in the prestigious
              Whisperwood Estates community. Smart home features, a three-car garage, and a finished
              basement set this 3,200 sq ft residence apart..."
            </p>
            <div className={styles.heroCardFooter}>
              <span className={styles.heroCardPlatform}>MLS Ready</span>
              <span className={styles.heroCardCopy}>Copy ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Why Agents Choose ListingPilot AI</div>
          <h2 className={styles.sectionHeading}>Everything you need to market a listing</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Outputs */}
      <section className={styles.sampleSection} id="sample-section">
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Real Output Examples</div>
          <h2 className={styles.sectionHeading}>See what ListingPilot AI generates</h2>
          <p className={styles.sectionSubtitle}>
            Based on a real Tucker, GA listing — generated in under 3 seconds.
          </p>
          <div className={styles.sampleGrid}>
            {SAMPLE_OUTPUTS.map((s) => (
              <div key={s.label} className={styles.sampleCard}>
                <div className={styles.sampleCardLabel}>{s.label}</div>
                <p className={styles.sampleCardText}>{s.preview}</p>
              </div>
            ))}
          </div>
          <div className={styles.sampleCta}>
            <Link to="/dashboard" className={styles.ctaPrimary}>
              Generate Your Own →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <div className={styles.sectionInner}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingBadge}>Early Access</div>
            <h2 className={styles.pricingHeading}>Simple, Agent-Friendly Pricing</h2>
            <p className={styles.pricingSubtitle}>
              We're currently in early access. Founding members will receive lifetime preferred pricing
              when we launch.
            </p>
            <div className={styles.pricingComing}>Coming Soon</div>
            <p className={styles.pricingNote}>
              In the meantime, the demo is completely free to use. No sign-up required.
            </p>
            <Link to="/dashboard" className={styles.ctaPrimary}>
              Use the Free Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogoIcon}>⬡</span>
            <span className={styles.footerLogoText}>
              ListingPilot <span className={styles.footerLogoAi}>AI</span>
            </span>
          </div>
          <p className={styles.footerDisclaimer}>
            <strong>Fair Housing Notice:</strong> All marketing content generated by ListingPilot AI
            is designed to describe property features only and does not reference race, color,
            national origin, religion, sex, familial status, disability, or any other protected class
            under the Fair Housing Act. Always review AI-generated content before publishing.
          </p>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} ListingPilot AI. For demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
