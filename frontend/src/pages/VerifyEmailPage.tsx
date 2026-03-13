import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AuthPage.module.css';

export const VerifyEmailPage: React.FC = () => {
  const { confirmEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState((location.state as { email?: string } | null)?.email ?? '');
  const [code, setCode] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await confirmEmail({ email, code });
    setMessage(result.message);
    navigate(result.redirectTo || '/login', { state: { from: '/workspace' } });
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <span className={styles.kicker}>Verify email</span>
          <h1>Confirm your account.</h1>
          <p>Enter the verification code from your inbox to activate workspace access and enable package purchases.</p>
        </div>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2>Email confirmation</h2>
          {message ? <div className={styles.message}>{message}</div> : null}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Verification code</label>
            <input className={styles.input} value={code} onChange={(event) => setCode(event.target.value)} required />
          </div>
          <div className={styles.actions}>
            <button className={styles.primary} type="submit">Verify account</button>
            <Link className={styles.secondary} to="/login">Return to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
