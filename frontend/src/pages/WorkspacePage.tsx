import React from 'react';
import { PropertyForm } from '../components/PropertyForm';
import { OutputPanel } from '../components/OutputPanel';
import { useAuth } from '../auth/AuthContext';
import { useGenerator } from '../hooks/useGenerator';
import { apiService } from '../services/api';
import type { DashboardSummary, Lead, PropertyInput } from '../types';
import styles from './AppPages.module.css';

export const WorkspacePage: React.FC = () => {
  const { session } = useAuth();
  const { output, usage, isLoading, error, generate, reset } = useGenerator();
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [leads, setLeads] = React.useState<Lead[]>([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, leadsData] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getLeads(),
        ]);
        setSummary(summaryData);
        setLeads(leadsData.slice(0, 4));
      } catch {
        // keep resilient in preview mode
      }
    };

    load();
  }, []);

  const handleGenerate = async (property: PropertyInput) => {
    reset();
    await generate(property, 'workspace');
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <h2>Workspace</h2>
          <p>Generate listing assets, review outputs, and launch without context switching.</p>
        </div>
        <div className={styles.actions}><button type="button">New listing</button><button type="button">Open history</button></div>
      </section>

      <section className={styles.grid4}>
        <article className={styles.stat}><span>Active listings</span><strong>{summary?.activeListings ?? '—'}</strong></article>
        <article className={styles.stat}><span>Outputs generated</span><strong>{summary?.outputsGenerated ?? '—'}</strong></article>
        <article className={styles.stat}><span>Avg turnaround</span><strong>{summary?.avgTurnaround ?? '—'}</strong></article>
        <article className={styles.stat}><span>Pipeline value</span><strong>{summary?.pipelineValue ?? '—'}</strong></article>
      </section>

      <section className={styles.grid4}>
        <article className={styles.stat}><span>Available credits</span><strong>{usage?.creditBalance ?? session?.currentUser?.creditBalance ?? '—'}</strong></article>
        <article className={styles.stat}><span>Starter credits</span><strong>{usage?.incentiveCreditBalance ?? session?.currentUser?.incentiveCreditBalance ?? '—'}</strong></article>
        <article className={styles.stat}><span>Free outputs left</span><strong>{usage?.remainingFreeOutputs ?? '—'}</strong></article>
        <article className={styles.stat}><span>Current access</span><strong>{session?.currentUser?.planCode ?? 'Starter'}</strong></article>
      </section>

      <section className={styles.grid2}>
        <div className={styles.surface}><PropertyForm onSubmit={handleGenerate} isLoading={isLoading} /></div>
        <div className={styles.surface}><OutputPanel output={output} isLoading={isLoading} error={error} onRegenerate={() => window.scrollTo({ top: 0, behavior: 'smooth' })} /></div>
      </section>

      <section className={styles.panel}>
        <h3>Follow-up queue</h3>
        <div className={styles.itemList}>
          {leads.map((lead) => (
            <article className={styles.item} key={lead.id}>
              <div className={styles.itemTop}><strong>{lead.name}</strong><span className={styles.badge}>{lead.stage}</span></div>
              <p>{lead.propertyAddress}</p>
              <div className={styles.itemMeta}><span>{lead.source}</span><span>{lead.intentScore}</span><strong>${lead.estimatedValue.toLocaleString()}</strong></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
