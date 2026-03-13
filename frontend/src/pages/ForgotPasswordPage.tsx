import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AuthPage.module.css';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, resetPassword } = useAuth();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [stage, setStage] = React.useState<'request' | 'reset'>('request');
  const [message, setMessage] = React.useState('');

  const handleRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await forgotPassword({ email });
    setMessage(result.message);
    setStage('reset');
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await resetPassword({ email, code, newPassword });
    setMessage(result.message);
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <span className={styles.kicker}>Password reset</span>
          <h1>Recover access securely.</h1>
          <p>Request a reset code by email, then set a new password without losing your saved credits, listings, or activity history.</p>
        </div>
        <form className={styles.card} onSubmit={stage === 'request' ? handleRequest : handleReset}>
          <h2>{stage === 'request' ? 'Request reset code' : 'Set a new password'}</h2>
          {message ? <div className={styles.message}>{message}</div> : null}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          {stage === 'reset' ? (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Verification code</label>
                <input className={styles.input} value={code} onChange={(event) => setCode(event.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>New password</label>
                <input className={styles.input} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
              </div>
            </>
          ) : null}
          <div className={styles.actions}>
            <button className={styles.primary} type="submit">{stage === 'request' ? 'Send reset code' : 'Reset password'}</button>
            <Link className={styles.secondary} to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
