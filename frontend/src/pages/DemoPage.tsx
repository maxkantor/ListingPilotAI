import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { DemoExperience } from '../types';
import { trackCta, trackEvent } from '../utils/analytics';
import styles from './MarketingPage.module.css';

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
        <div className={styles.container}>
          <div className={styles.twoCol}>
          <div>
            <div className={styles.kicker}>Interactive demo</div>
            <h1 className={styles.title}>Preview the exact launch workflow agents use daily.</h1>
            <p className={styles.lead}>
              From a single property brief to multi-channel outputs, performance tracking, and CRM-ready next steps — this is how premium listing launches move faster.
            </p>
            <div className={styles.buttonRow}>
              <Link to="/workspace" className={styles.primaryBtn} onClick={() => trackCta('demo_enter_workspace', 'trial')}>Enter workspace</Link>
              <Link to="/contact" className={styles.secondaryBtn} onClick={() => trackCta('demo_book_guided_demo', 'contact')}>Book guided demo</Link>
            </div>
          </div>
          <div className={styles.surface}>
            <div className={styles.tabs}>
              <span className={styles.activeTab}>MLS Description</span>
              <span>Instagram</span>
              <span>Email</span>
            </div>
            {demo?.heroImageUrl && <img className={styles.demoImage} src={demo.heroImageUrl} alt={demo.address} />}
            {demo?.assets.slice(0, 3).map((asset) => (
              <div key={asset.id} className={styles.card}>
                <strong>{asset.assetType}</strong>
                <p>{asset.content}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.intro}><div className={styles.kicker}>What the demo shows</div><h2 className={styles.sectionTitle}>Interactive preview, realistic outputs, and clear next actions.</h2></div>
          <div className={styles.contactSplit}>
            <div className={styles.surface}>
              <h3>{demo?.listingName ?? 'Luxury listing launch'}</h3>
              <p>{demo?.address ?? '4812 Wieuca Road NE, Atlanta, GA'} · {demo?.price ?? '$1,275,000'} · {demo?.beds ?? '5'} beds · {demo?.baths ?? '4.5'} baths</p>
            </div>
            <form className={styles.surface} onSubmit={handleSubmit}>
              <h3>Book a guided walkthrough</h3>
              <p>We tailor demos for solo luxury agents, lean marketing teams, and brokerages rolling out modern launch workflows.</p>
              <div className={styles.form}>
                <input className={styles.input} type="text" placeholder="Full name" value={request.name} onChange={(event) => setRequest((current) => ({ ...current, name: event.target.value }))} />
                <input className={styles.input} type="email" placeholder="Work email" value={request.email} onChange={(event) => setRequest((current) => ({ ...current, email: event.target.value }))} />
                <input className={styles.input} type="text" placeholder="Team or brokerage" value={request.team} onChange={(event) => setRequest((current) => ({ ...current, team: event.target.value }))} />
                <textarea className={styles.textarea} placeholder="What kind of listings, agents, or workflows should we tailor the demo around?" value={request.interest} onChange={(event) => setRequest((current) => ({ ...current, interest: event.target.value }))} />
                {status && <p>{status}</p>}
                <button type="submit" className={styles.primaryBtn}>Request demo</button>
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
