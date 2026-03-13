import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './AuthPage.module.css';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await login({ email, password, intendedDestination: '/admin' }, true);
    setMessage(result.message || 'Admin session started.');
    navigate(result.redirectTo || '/admin');
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.hero}>
          <span className={styles.kicker}>Admin access</span>
          <h1>Sign in to the CRM console.</h1>
          <p>Review user activity, reply to inquiries, audit purchases, and manage access with protected admin credentials.</p>
        </div>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h2>Admin login</h2>
          {message ? <div className={styles.message}>{message}</div> : null}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className={styles.actions}>
            <button className={styles.primary} type="submit">Enter admin</button>
            <Link className={styles.secondary} to="/login">User login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
