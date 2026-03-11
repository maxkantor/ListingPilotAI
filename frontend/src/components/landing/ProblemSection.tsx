import React from 'react';
import styles from './LandingSections.module.css';

const problems = [
  {
    title: 'Writing MLS descriptions from scratch',
    description:
      'Agents lose momentum rewriting the same listing narrative every week under tight publishing deadlines.',
  },
  {
    title: 'Creating social media posts for every listing',
    description:
      'Each platform needs different formatting and tone, which slows down listing promotion and consistency.',
  },
  {
    title: 'Writing listing emails for buyers',
    description:
      'Email outreach often gets delayed because draft quality varies and requires multiple manual revisions.',
  },
];

export const ProblemSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Real Estate Marketing Takes Too Long</h2>
        <p className={styles.sectionSubtitle}>
          Most teams spend more time drafting listing copy than actually moving inventory and scheduling showings.
        </p>

        <div className={styles.problemGrid}>
          {problems.map((problem) => (
            <article key={problem.title} className={styles.card}>
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};