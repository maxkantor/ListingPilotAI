import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { DemoExperience } from '../types';
import { trackCta, trackEvent } from '../utils/analytics';
import styles from './PublicPage.module.css';

export const DemoPage: React.FC = () => {
  const [demo, setDemo] = React.useState<DemoExperience | null>(null);
  const [request, setRequest] = React.useState({ name: '', email: '', team: '', interest: '' });
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = await apiService.getDemoExperience();
        setDemo(data);
      } catch {
        // keep page resilient in offline mock scenarios
      }
    };

    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await apiService.submitDemoRequest(request);
      setStatus(response.message);
      trackEvent('demo_request_submit', { team: request.team || 'unknown' });
      setRequest({ name: '', email: '', team: '', interest: '' });
    } catch {
      setStatus('Something went wrong while requesting a demo. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.eyebrow}>Interactive demo</div>
            <h1 className={styles.heroTitle}>Preview the exact launch experience agents get inside ListingPilot AI.</h1>
            <p className={styles.heroText}>
              From a single property brief to multi-channel outputs, performance tracking, and CRM-ready next steps — this is how premium listing launches move faster.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/dashboard" className={styles.buttonPrimary} onClick={() => trackCta('demo_enter_workspace', 'trial')}>Enter workspace</Link>
              <Link to="/contact" className={styles.buttonSecondary} onClick={() => trackCta('demo_book_guided_demo', 'contact')}>Book guided demo</Link>
            </div>
          </div>
          <div className={styles.demoShell}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Launch score</span>
              <span className={styles.smallPill}>Ready to publish</span>
            </div>
            {demo?.heroImageUrl && <img className={styles.demoImage} src={demo.heroImageUrl} alt={demo.address} />}
            <div className={styles.demoBar} />
            {demo?.assets.slice(0, 3).map((asset) => (
              <div key={asset.id} className={styles.demoOutput}>
                <strong>{asset.assetType}</strong>
                <p>{asset.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>What the demo shows</div>
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3>{demo?.listingName ?? 'Luxury listing launch'}</h3>
              <p>{demo?.address ?? '4812 Wieuca Road NE, Atlanta, GA'} · {demo?.price ?? '$1,275,000'} · {demo?.beds ?? '5'} beds · {demo?.baths ?? '4.5'} baths</p>
            </div>
            <form className={styles.contactPanel} onSubmit={handleSubmit}>
              <h3>Book a guided walkthrough</h3>
              <p>We tailor demos for solo luxury agents, lean marketing teams, and brokerages rolling out modern launch workflows.</p>
              <div className={styles.form}>
                <input className={styles.input} type="text" placeholder="Full name" value={request.name} onChange={(event) => setRequest((current) => ({ ...current, name: event.target.value }))} />
                <input className={styles.input} type="email" placeholder="Work email" value={request.email} onChange={(event) => setRequest((current) => ({ ...current, email: event.target.value }))} />
                <input className={styles.input} type="text" placeholder="Team or brokerage" value={request.team} onChange={(event) => setRequest((current) => ({ ...current, team: event.target.value }))} />
                <textarea className={styles.textarea} placeholder="What kind of listings, agents, or workflows should we tailor the demo around?" value={request.interest} onChange={(event) => setRequest((current) => ({ ...current, interest: event.target.value }))} />
                {status && <p className={styles.formStatus}>{status}</p>}
                <button type="submit" className={styles.buttonPrimary}>Request demo</button>
              </div>
            </form>
          </div>
          <div className={styles.grid3}>
            <article className={styles.card}>
              <h3>AI launch brief</h3>
              <p>Capture tone, audience, positioning, and proof points in one input flow.</p>
            </article>
            <article className={styles.card}>
              <h3>Channel outputs</h3>
              <p>Generate polished MLS, social, email, and networking copy tuned to each destination.</p>
            </article>
            <article className={styles.card}>
              <h3>Follow-through signals</h3>
              <p>See top channels, likely hot leads, and what to do next without leaving the workspace.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
