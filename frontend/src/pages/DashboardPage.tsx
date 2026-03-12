import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertyForm } from '../components/PropertyForm';
import { OutputPanel } from '../components/OutputPanel';
import { useGenerator, useHistory } from '../hooks/useGenerator';
import { apiService } from '../services/api';
import type {
  AuthSession,
  DashboardSummary,
  Lead,
  ListingProject,
  PerformanceSnapshot,
  PropertyInput,
  SubscriptionPlan,
  WorkspaceSettings,
} from '../types';
import styles from './DashboardPage.module.css';

const workspaceSections = [
  { title: 'Dashboard', caption: 'View launch metrics and active pipeline' },
  { title: 'New Listing', caption: 'Create listing assets from a property brief' },
  { title: 'History', caption: 'Search saved launches' },
  { title: 'Templates', caption: 'Manage reusable campaign frameworks' },
  { title: 'Team', caption: 'Invite members and share workflows' },
  { title: 'Analytics', caption: 'Track conversion signals' },
  { title: 'Settings', caption: 'Control team defaults' },
  { title: 'Billing', caption: 'Monitor plan and credits' },
];

const sharedTemplates = [
  { name: 'Luxury launch', detail: 'High-end residential campaigns with polished tone' },
  { name: 'Open house push', detail: 'Fast social + email bundle for weekend traffic' },
  { name: 'Price improvement relaunch', detail: 'Reactivation messaging for warm lead pools' },
];

export const DashboardPage: React.FC = () => {
  const { output, isLoading, error, generate, reset } = useGenerator();
  const { history, refresh } = useHistory();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceSnapshot[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [listings, setListings] = useState<ListingProject[]>([]);
  const [settings, setSettings] = useState<WorkspaceSettings | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [historyFilter, setHistoryFilter] = useState('');
  const [selectedSection, setSelectedSection] = useState('Dashboard');

  useEffect(() => {
    const load = async () => {
      await refresh();

      try {
        const [summaryData, performanceData, leadsData, listingsData, settingsData, plansData, sessionData] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getPerformanceSnapshots(),
          apiService.getLeads(),
          apiService.getListings(),
          apiService.getSettings(),
          apiService.getAdminPlans(),
          apiService.getAuthSession(),
        ]);

        setSummary(summaryData);
        setPerformance(performanceData);
        setLeads(leadsData.slice(0, 3));
        setListings(listingsData);
        setSettings(settingsData);
        setPlans(plansData);
        setSession(sessionData);
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
    setSelectedSection('New Listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSetting = async (key: 'autoSaveEnabled' | 'requireReview' | 'complianceMode') => {
    if (!settings) {
      return;
    }

    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);

    try {
      const saved = await apiService.updateSettings(nextSettings);
      setSettings(saved);
    } catch {
      setSettings(settings);
    }
  };

  const maxOutputs = performance.reduce((max, item) => Math.max(max, item.outputs), 1);
  const currentPlan = plans.find((plan) => plan.isFeatured) ?? plans[0];
  const sectionCaption = workspaceSections.find((section) => section.title === selectedSection)?.caption ?? 'Operate your listing workspace';
  const filteredHistory = history.filter((item) => {
    const query = historyFilter.toLowerCase();
    return [item.streetAddress, item.city, item.state].join(' ').toLowerCase().includes(query);
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Workspace</span>
            <h1>Operate every listing launch from one premium control center.</h1>
            <p>
              Capture the brief, generate channel-ready assets, review performance, and pass hot pipeline activity into your CRM without leaving the workspace.
            </p>

            <div className={styles.metricStrip}>
              <div className={styles.metricCard}><span>Active listings</span><strong>{summary?.activeListings ?? '—'}</strong></div>
              <div className={styles.metricCard}><span>Outputs generated</span><strong>{summary?.outputsGenerated ?? '—'}</strong></div>
              <div className={styles.metricCard}><span>Avg turnaround</span><strong>{summary?.avgTurnaround ?? '—'}</strong></div>
              <div className={styles.metricCard}><span>Pipeline value</span><strong>{summary?.pipelineValue ?? '—'}</strong></div>
            </div>
          </div>

          <div className={styles.heroStack}>
            <div className={styles.sidePanel}>
              <div className={styles.panelHeader}><h2>Priority queue</h2><span>{summary?.conversionLift ?? '+0%'}</span></div>
              <ul className={styles.actionList}>
                {summary?.priorityActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>

            <div className={styles.commandCard}>
              <div>
                <span className={styles.commandLabel}>Current mode</span>
                <strong>{selectedSection}</strong>
                <p>{sectionCaption}</p>
              </div>
              <Link to="/admin" className={styles.commandLink}>Open Admin CRM</Link>
            </div>
          </div>
        </section>

        <section className={styles.workspaceShell}>
          <aside className={styles.workspaceSidebar}>
            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>Workspace</span>
              <div className={styles.workspaceNav}>
                {workspaceSections.map((section) => (
                  <button
                    key={section.title}
                    type="button"
                    className={`${styles.workspaceNavButton} ${selectedSection === section.title ? styles.workspaceNavButtonActive : ''}`}
                    onClick={() => setSelectedSection(section.title)}
                  >
                    <div>
                      <strong>{section.title}</strong>
                      <span>{section.caption}</span>
                    </div>
                    <em>→</em>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>Auth mode</span>
              <div className={styles.authCard}>
                <strong>{session?.identityMode ?? 'launch-preview'}</strong>
                <p>{session?.authEnabled ? 'Cognito-enabled workspace' : 'Lean preview mode for fast launch validation.'}</p>
                <div className={styles.authFeatureList}>
                  {session?.allowedFeatures.map((feature) => (
                    <span key={feature} className={styles.authPill}>{feature}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <span className={styles.sidebarLabel}>Billing-ready</span>
              <div className={styles.planCard}>
                <strong>{currentPlan?.name ?? 'Professional'}</strong>
                <p>{currentPlan ? `$${currentPlan.monthlyPrice}/month` : '$79/month'}</p>
                <span>{currentPlan?.monthlyGenerationLimit ?? 200} generation credits / month</span>
              </div>
            </div>
          </aside>

          <div className={styles.workspaceMain}>
            <div className={styles.workspaceHeader}>
              <div>
                <span className={styles.workspaceKicker}>{selectedSection}</span>
                <h2>{sectionCaption}</h2>
              </div>
              <div className={styles.workspaceBadgeRow}>
                <span>Manual input first</span>
                <span>Copy, save, export</span>
                <span>Compliance-aware</span>
              </div>
            </div>

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

            <section className={styles.workspaceLower}>
              <div className={styles.historyExplorer}>
                <div className={styles.panelHeader}>
                  <h2>Listing history</h2>
                  <span>{filteredHistory.length} matches</span>
                </div>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder="Search by address, city, or state"
                  value={historyFilter}
                  onChange={(event) => setHistoryFilter(event.target.value)}
                />
                <div className={styles.listingBoard}>
                  {listings.map((listing) => (
                    <article key={listing.id} className={styles.listingTile}>
                      <div className={styles.leadTop}>
                        <strong>{listing.title}</strong>
                        <span className={styles.stageBadge}>{listing.status}</span>
                      </div>
                      <p>{listing.streetAddress}, {listing.city}, {listing.state}</p>
                      <div className={styles.tileMeta}>
                        <span>{listing.price}</span>
                        <span>{listing.tone}</span>
                      </div>
                      <div className={styles.tileTags}>
                        {listing.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </article>
                  ))}
                </div>

                {filteredHistory.length > 0 && (
                  <div className={styles.historyGrid}>
                    {filteredHistory.slice(0, 4).map((item) => (
                      <div key={item.id} className={styles.historyCard}>
                        <div className={styles.historyHeader}>
                          <h4>{item.streetAddress}</h4>
                          <span className={styles.historyPrice}>${item.price}</span>
                        </div>
                        <p className={styles.historyLocation}>{item.city}, {item.state}</p>
                        <p className={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</p>
                        <button className={styles.historyPreview} type="button">Load draft →</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.settingsRail}>
                <div className={styles.sidePanel}>
                  <div className={styles.panelHeader}>
                    <h2>Settings</h2>
                    <span>{settings?.defaultTone ?? 'Luxury'}</span>
                  </div>
                  <div className={styles.settingsStack}>
                    <div className={styles.settingCard}>
                      <div>
                        <strong>Team preset</strong>
                        <span>{settings?.teamPreset}</span>
                      </div>
                      <small>{settings?.brandVoice}</small>
                    </div>
                    <button type="button" className={styles.toggleRow} onClick={() => handleToggleSetting('autoSaveEnabled')}>
                      <div><strong>Auto-save drafts</strong><span>Keep work in progress synced to history.</span></div>
                      <span>{settings?.autoSaveEnabled ? 'On' : 'Off'}</span>
                    </button>
                    <button type="button" className={styles.toggleRow} onClick={() => handleToggleSetting('requireReview')}>
                      <div><strong>Require review</strong><span>Flag generated outputs before publish.</span></div>
                      <span>{settings?.requireReview ? 'On' : 'Off'}</span>
                    </button>
                    <button type="button" className={styles.toggleRow} onClick={() => handleToggleSetting('complianceMode')}>
                      <div><strong>Compliance mode</strong><span>Keep language grounded and MLS-conscious.</span></div>
                      <span>{settings?.complianceMode ? 'On' : 'Off'}</span>
                    </button>
                  </div>
                </div>

                <div className={styles.sidePanel}>
                  <div className={styles.panelHeader}>
                    <h2>Usage & billing</h2>
                    <Link to="/pricing" className={styles.panelLink}>Upgrade →</Link>
                  </div>
                  <div className={styles.billingSummary}>
                    <div className={styles.billingMetric}><span>Current plan</span><strong>{currentPlan?.name ?? 'Professional'}</strong></div>
                    <div className={styles.billingMetric}><span>Credits / month</span><strong>{currentPlan?.monthlyGenerationLimit ?? 200}</strong></div>
                    <div className={styles.billingMetric}><span>Seat capacity</span><strong>{currentPlan?.teamSeats ?? 3}</strong></div>
                  </div>
                </div>

                <div className={styles.sidePanel}>
                  <div className={styles.panelHeader}>
                    <h2>Team & templates</h2>
                    <span>{session?.authEnabled ? 'Live seats' : 'Preview mode'}</span>
                  </div>
                  <div className={styles.teamSummary}>
                    <article className={styles.teamCard}>
                      <strong>Team members</strong>
                      <p>Invite admins and agents into one workspace with shared presets and governed output rules.</p>
                      <div className={styles.memberStack}>
                        <span>Admin · Brand + billing</span>
                        <span>Agent · Generate + follow-up</span>
                      </div>
                    </article>

                    <article className={styles.templateCard}>
                      <strong>Shared templates</strong>
                      <div className={styles.templateList}>
                        {sharedTemplates.map((template) => (
                          <div key={template.name} className={styles.templateRow}>
                            <div>
                              <strong>{template.name}</strong>
                              <span>{template.detail}</span>
                            </div>
                            <em>Live</em>
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

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

      </div>
    </div>
  );
};
