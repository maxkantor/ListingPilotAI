import React from 'react';
import { Link } from 'react-router-dom';
import { SiteFooter } from '../components/SiteFooter';
import styles from './PlatformPage.module.css';

const PLATFORM_URL = 'https://mk-ai-global-page.s3.us-east-1.amazonaws.com/platform/index.html';

export const PlatformPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link to="/" className={styles.backLink}>
              ← Back to Home
            </Link>
            <h1 className={styles.title}>MK Platform</h1>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loaderWrap}>
            <span className={styles.loader} aria-hidden="true" />
            <span>Loading platform…</span>
          </div>
        ) : null}

        <iframe
          title="MK Platform"
          src={PLATFORM_URL}
          className={styles.iframe}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setIsLoading(false)}
        />
      </main>

      <SiteFooter legalLine="© Max Kantor — MK AI Platform. All rights reserved." />
    </div>
  );
};
