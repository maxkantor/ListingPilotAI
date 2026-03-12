import React from 'react';
import { apiService } from '../services/api';
import { trackCta, trackEvent } from '../utils/analytics';
import styles from './MarketingPage.module.css';

export const ContactPage: React.FC = () => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    team: '',
    role: '',
    message: '',
  });
  const [status, setStatus] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await apiService.submitContact(form);
      setStatus(response.message);
      trackEvent('contact_form_submit', { team: form.team || 'unknown' });
      setForm({ name: '', email: '', team: '', role: '', message: '' });
    } catch {
      setStatus('Something went wrong while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.contactSplit}>
          <div>
            <div className={styles.kicker}>Contact</div>
            <h1 className={styles.title}>Book a demo or design your rollout.</h1>
            <p className={styles.lead}>
              Whether you are a solo luxury agent or a brokerage operator, we will help you shape the right workflow, rollout plan, success metrics, and rollout architecture.
            </p>
            <div className={styles.chips}>
              <span>Response within 1 business day</span>
              <span>Enterprise onboarding available</span>
            </div>
            <div className={styles.surface}>
              <h3>Who this is for</h3>
              <p>Solo agents, brokerage teams, and operations leaders who need faster listing launches with quality control.</p>
            </div>
          </div>
          <div className={styles.surface}>
            <h3>Tell us about your team</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input className={styles.input} type="text" placeholder="Full name" value={form.name} onChange={(event) => handleChange('name', event.target.value)} />
              <input className={styles.input} type="email" placeholder="Work email" value={form.email} onChange={(event) => handleChange('email', event.target.value)} />
              <input className={styles.input} type="text" placeholder="Team or brokerage" value={form.team} onChange={(event) => handleChange('team', event.target.value)} />
              <select className={styles.select} value={form.role} onChange={(event) => handleChange('role', event.target.value)}>
                <option value="">What best describes you?</option>
                <option>Solo agent</option>
                <option>Luxury team</option>
                <option>Brokerage operator</option>
                <option>Marketing director</option>
              </select>
              <textarea className={styles.textarea} placeholder="What are you trying to improve: listing speed, brand consistency, CRM follow-up, admin visibility, or all of the above?" value={form.message} onChange={(event) => handleChange('message', event.target.value)} />
              {status && <p>{status}</p>}
              <button type="submit" className={styles.primaryBtn} onClick={() => trackCta('contact_request_demo', 'contact')} disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Request demo'}
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.grid3}>
            <article className={styles.card}>
              <h3>For solo agents</h3>
              <p>Get launch-ready marketing assets without hiring a coordinator for every listing.</p>
            </article>
            <article className={styles.card}>
              <h3>For brokerages</h3>
              <p>Standardize quality, accelerate onboarding, and see which teams are converting generated demand without running expensive always-on infrastructure.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
