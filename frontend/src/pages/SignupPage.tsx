import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AuthPage.module.css';

export const SignupPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = React.useState({ firstName: '', lastName: '', email: '', password: '' });
  const [message, setMessage] = React.useState('');
  const destination = (location.state as { from?: string } | null)?.from ?? '/workspace';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await signUp({ ...form, intendedDestination: destination });
    setMessage(result.message);
    navigate(result.redirectTo || '/verify-email', { state: { email: form.email } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <span className={styles.kicker}>Sign up</span>
          <h1>Create your ListingPilot AI account.</h1>
          <p>Every signup starts with starter credits, secure Cognito authentication, and a clear upgrade path into package-based usage.</p>
          <ul className={styles.heroList}>
            <li><span>✦</span><span>Includes initial free credits after signup</span></li>
            <li><span>✦</span><span>Protected workspace access and persisted purchase history</span></li>
            <li><span>✦</span><span>Admin-audited activity tracking across demo and workspace flows</span></li>
          </ul>
        </div>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2>Start free</h2>
          {message ? <div className={styles.message}>{message}</div> : null}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input className={styles.input} value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last name</label>
              <input className={styles.input} value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} required />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          </div>
          <div className={styles.actions}>
            <button className={styles.primary} type="submit">Create account</button>
            <Link className={styles.secondary} to="/login">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
