import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLastUsedEmail, storeLastUsedEmail } from '../auth/authStorage';
import { useAuth } from '../auth/AuthContext';
import styles from './AuthPage.module.css';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState(getLastUsedEmail());
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const destination = (location.state as { from?: string } | null)?.from ?? '/workspace';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await login({ email, password, intendedDestination: destination });
      setMessage(result.message);
      if (result.success) {
        storeLastUsedEmail(email);
        navigate(result.redirectTo || destination, { replace: true });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in right now.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <span className={styles.kicker}>User login</span>
          <h1>Get back into your listing launch workspace.</h1>
          <p>Sign in to continue generating outputs, tracking credits, and managing paid package entitlements.</p>
          <ul className={styles.heroList}>
            <li><span>✦</span><span>Workspace access with persisted usage and purchase history</span></li>
            <li><span>✦</span><span>Free-tier starter credits and secure Cognito-backed sessions</span></li>
            <li><span>✦</span><span>Upgrade path into paid packages without losing activity history</span></li>
          </ul>
        </div>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          {message ? <div className={styles.message}>{message}</div> : null}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </div>
          <div className={styles.actions}>
            <button className={styles.primary} type="submit">Login</button>
            <Link className={styles.secondary} to="/signup">Create account</Link>
          </div>
          <div className={styles.metaRow}>
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/pricing">View pricing</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
