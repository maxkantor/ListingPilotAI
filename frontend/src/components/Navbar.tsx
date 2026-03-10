import styles from './Navbar.module.css';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>ListingPilot <span className={styles.logoAi}>AI</span></span>
        </Link>
        <div className={styles.nav}>
          <Link
            to="/dashboard"
            className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link to="/dashboard" className={styles.ctaButton}>
            Try Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
