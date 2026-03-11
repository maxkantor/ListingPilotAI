import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { AdminOverview, AnalyticsOverview, Lead } from '../types';
import styles from './AdminPage.module.css';

export const AdminPage: React.FC = () => {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewData, analyticsData, leadsData] = await Promise.all([
          apiService.getAdminOverview(),
          apiService.getAnalyticsOverview(),
          apiService.getLeads(),
        ]);

        setOverview(overviewData);
        setAnalytics(analyticsData);
        setLeads(leadsData.slice(0, 4));
      } catch {
        // keep mock UI resilient
      }
    };

    load();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <div className={styles.eyebrow}>Admin portal</div>
            <h1 className={styles.title}>Run ListingPilot like an operating business.</h1>
            <p className={styles.subtitle}>
              Track adoption, pipeline health, support risk, and conversion momentum across your agent base.
            </p>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Active agents</div>
                <div className={styles.metricValue}>{overview?.activeAgents ?? '—'}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Trials</div>
                <div className={styles.metricValue}>{overview?.trialAccounts ?? '—'}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>MRR</div>
                <div className={styles.metricValue}>{overview?.monthlyRecurringRevenue ?? '—'}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Support</div>
                <div className={styles.metricValue}>{overview?.openSupportTickets ?? '—'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.panelGrid}>
          <div className={styles.panel}>
            <h2>Pipeline health</h2>
            <div className={styles.pipelineGrid}>
              {overview?.pipeline.map((item) => (
                <div key={item.stage} className={styles.pipelineCard}>
                  <div className={styles.muted}>{item.stage}</div>
                  <div className={styles.pipelineValue}>{item.count}</div>
                  <div className={styles.pipelineMeta}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.alertCard}>
            <h2>Operator alerts</h2>
            <ul className={styles.alertList}>
              {overview?.alerts.map((alert) => <li key={alert}>{alert}</li>)}
            </ul>
            <ul className={styles.alertList}>
              <li>Organic growth: {analytics?.organicTrafficGrowth ?? '—'}</li>
              <li>Demo conversion: {analytics?.demoConversionRate ?? '—'}</li>
              <li>Activation rate: {analytics?.trialActivationRate ?? '—'}</li>
            </ul>
          </div>
        </section>

        <section className={styles.table}>
          <h2>Highest-intent leads</h2>
          <div className={styles.tableHead}>
            <span>Lead</span>
            <span>Stage</span>
            <span>Owner</span>
            <span>Last activity</span>
            <span>Value</span>
          </div>
          {leads.map((lead) => (
            <div key={lead.id} className={styles.tableRow}>
              <span>
                <div className={styles.leadName}>{lead.name}</div>
                <div className={styles.leadMeta}>{lead.propertyAddress}</div>
              </span>
              <span><span className={styles.badge}>{lead.stage}</span></span>
              <span>{lead.owner}</span>
              <span>{lead.lastActivity}</span>
              <span>${lead.estimatedValue.toLocaleString()}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
