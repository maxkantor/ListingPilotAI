import React from 'react';
import { apiService } from '../services/api';
import type { Lead, PerformanceSnapshot } from '../types';
import styles from './AppPages.module.css';

export const CrmPage: React.FC = () => {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [performance, setPerformance] = React.useState<PerformanceSnapshot[]>([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [leadData, performanceData] = await Promise.all([
          apiService.getLeads(),
          apiService.getPerformanceSnapshots(),
        ]);
        setLeads(leadData);
        setPerformance(performanceData);
      } catch {
        // keep resilient
      }
    };

    load();
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div><h2>CRM</h2><p>Pipeline visibility, follow-up queue, and conversion momentum in one panel set.</p></div>
      </section>

      <section className={styles.grid3}>
        {performance.map((point) => (
          <article className={styles.stat} key={point.week}>
            <span>{point.week}</span>
            <strong>{point.qualifiedLeads}</strong>
            <span>{point.outputs} outputs · {point.toursBooked} tours</span>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <h3>Lead board</h3>
        <div className={styles.itemList}>
          {leads.map((lead) => (
            <article className={styles.item} key={lead.id}>
              <div className={styles.itemTop}><strong>{lead.name}</strong><span className={styles.badge}>{lead.stage}</span></div>
              <p>{lead.propertyAddress}</p>
              <div className={styles.itemMeta}><span>{lead.source}</span><span>{lead.owner}</span><span>{lead.lastActivity}</span><strong>${lead.estimatedValue.toLocaleString()}</strong></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
