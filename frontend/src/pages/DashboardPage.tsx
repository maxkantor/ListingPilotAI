import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertyForm } from '../components/PropertyForm';
import { OutputPanel } from '../components/OutputPanel';
import { useGenerator, useHistory } from '../hooks/useGenerator';
import { apiService } from '../services/api';
import type { DashboardSummary, Lead, PerformanceSnapshot, PropertyInput } from '../types';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { output, isLoading, error, generate, reset } = useGenerator();
  const { history, refresh } = useHistory();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceSnapshot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const load = async () => {
      await refresh();

      try {
        const [summaryData, performanceData, leadsData] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getPerformanceSnapshots(),
          apiService.getLeads(),
        ]);

        setSummary(summaryData);
        setPerformance(performanceData);
        setLeads(leadsData.slice(0, 3));
      } catch {
        // Keep the workspace functional even if insight endpoints are unavailable.
      }
    };

    load();
  }, []);

  const handleGenerate = async (property: PropertyInput) => {
    reset();
    await generate(property);
  };

  const handleRegenerate = () => {
    alert('Please adjust property details and generate again.');
  };

  const maxOutputs = performance.reduce((max, item) => Math.max(max, item.outputs), 1);

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Workspace</span>
            <h1>Launch premium listing campaigns from one control center.</h1>
            <p>
              Create the brief, generate assets, monitor channel lift, and hand top-intent leads to the right person before momentum fades.
            </p>

            <div className={styles.metricStrip}>
              <div className={styles.metricCard}>
                <span>Active listings</span>
                <strong>{summary?.activeListings ?? '—'}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Outputs generated</span>
                <strong>{summary?.outputsGenerated ?? '—'}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Avg turnaround</span>
                <strong>{summary?.avgTurnaround ?? '—'}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Pipeline value</span>
                <strong>{summary?.pipelineValue ?? '—'}</strong>
              </div>
            </div>
          </div>

          <div className={styles.heroRail}>
            <div className={styles.sidePanel}>
              <div className={styles.panelHeader}>
                <h2>Priority queue</h2>
                <span>{summary?.conversionLift ?? '+0%'}</span>
              </div>
              <ul className={styles.actionList}>
                {summary?.priorityActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>

            <div className={styles.sidePanel}>
              <div className={styles.panelHeader}>
                <h2>Channel winners</h2>
                <Link to="/admin" className={styles.panelLink}>View admin →</Link>
              </div>
              <div className={styles.channelList}>
                {summary?.topChannels.map((channel) => (
                  <div key={channel.channel} className={styles.channelCard}>
                    <div>
                      <strong>{channel.label}</strong>
                      <span>{channel.status}</span>
                    </div>
                    <div>
                      <strong>{channel.conversionRate}</strong>
                      <span>{channel.engagementLift}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.grid}>
          <div className={styles.formColumn}>
            <PropertyForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          <div className={styles.outputColumn}>
            <OutputPanel
              output={output}
              isLoading={isLoading}
              error={error}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>

        <section className={styles.insightsGrid}>
          <div className={styles.performancePanel}>
            <div className={styles.panelHeader}>
              <h2>6-week performance</h2>
              <span>Outputs → leads → tours</span>
            </div>
            <div className={styles.chart}>
              {performance.map((point) => (
                <div key={point.week} className={styles.barGroup}>
                  <div className={styles.barStack}>
                    <div
                      className={styles.barPrimary}
                      style={{ height: `${(point.outputs / maxOutputs) * 160}px` }}
                    />
                    <div
                      className={styles.barSecondary}
                      style={{ height: `${(point.qualifiedLeads / maxOutputs) * 160 + 10}px` }}
                    />
                  </div>
                  <strong>{point.week}</strong>
                  <span>{point.toursBooked} tours</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.leadsPanel}>
            <div className={styles.panelHeader}>
              <h2>Hot CRM signals</h2>
              <span>{leads.length} active</span>
            </div>
            <div className={styles.leadList}>
              {leads.map((lead) => (
                <div key={lead.id} className={styles.leadCard}>
                  <div className={styles.leadTop}>
                    <strong>{lead.name}</strong>
                    <span className={styles.stageBadge}>{lead.stage}</span>
                  </div>
                  <p>{lead.propertyAddress}</p>
                  <div className={styles.leadMeta}>
                    <span>{lead.source}</span>
                    <span>{lead.intentScore}</span>
                  </div>
                  <div className={styles.leadFooter}>
                    <span>{lead.lastActivity}</span>
                    <strong>${lead.estimatedValue.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {history.length > 0 && (
          <div className={styles.historySection}>
            <h2 className={styles.historyTitle}>Recent Generations</h2>
            <div className={styles.historyGrid}>
              {history.slice(0, 8).map((item) => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <h4>{item.streetAddress}</h4>
                    <span className={styles.historyPrice}>${item.price}</span>
                  </div>
                  <p className={styles.historyLocation}>
                    {item.city}, {item.state}
                  </p>
                  <p className={styles.historyDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    className={styles.historyPreview}
                    onClick={() => {
                      alert(
                        'In a full implementation, this would load the previous generation.'
                      );
                    }}
                  >
                    View Copy →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
