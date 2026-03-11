import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { AdminAnalytics, AuditEvent, Lead, SubscriptionPlan, SupportTicket, UserSummary } from '../types';
import styles from './AdminPage.module.css';

const pipelineStages = ['New', 'Contacted', 'Demo Scheduled', 'Trial Started', 'Won', 'Lost'];

export const AdminPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [support, setSupport] = useState<SupportTicket[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsData, usersData, leadsData, supportData, plansData, auditData] = await Promise.all([
          apiService.getAdminAnalytics(),
          apiService.getAdminUsers(),
          apiService.getAdminLeads(),
          apiService.getAdminSupport(),
          apiService.getAdminPlans(),
          apiService.getAdminAudit(),
        ]);

        setAnalytics(analyticsData);
        setUsers(usersData);
        setLeads(leadsData);
        setSupport(supportData);
        setPlans(plansData);
        setAuditEvents(auditData);
      } catch {
        // keep mock UI resilient
      }
    };

    load();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = userFilter.toLowerCase();
    return [user.name, user.email, user.plan, user.status, user.teamName].join(' ').toLowerCase().includes(query);
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <div className={styles.eyebrow}>Admin portal</div>
            <h1 className={styles.title}>Run ListingPilot like an operating business.</h1>
            <p className={styles.subtitle}>
              Track adoption, pipeline health, support risk, and conversion momentum across your agent base with a lean, premium back office.
            </p>
            <div className={styles.heroBadgeRow}>
              <span>Users + plans</span>
              <span>Lead CRM</span>
              <span>Support + audit trail</span>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Total users</div>
                <div className={styles.metricValue}>{analytics?.totalUsers ?? '—'}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Active users</div>
                <div className={styles.metricValue}>{analytics?.activeUsers ?? '—'}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Trials</div>
                <div className={styles.metricValue}>{analytics?.trialUsers ?? '—'}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>MRR</div>
                <div className={styles.metricValue}>{analytics?.mrrPlaceholder ?? '—'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.panelGrid}>
          <div className={styles.panel}>
            <h2>Conversion summary</h2>
            <div className={styles.pipelineGridWide}>
              <div className={styles.pipelineCard}>
                <div className={styles.muted}>Total generations</div>
                <div className={styles.pipelineValue}>{analytics?.totalGenerations ?? '—'}</div>
                <div className={styles.pipelineMeta}>Assets produced across all workspaces</div>
              </div>
              <div className={styles.pipelineCard}>
                <div className={styles.muted}>Total leads</div>
                <div className={styles.pipelineValue}>{analytics?.totalLeads ?? '—'}</div>
                <div className={styles.pipelineMeta}>CRM pipeline records tracked</div>
              </div>
              <div className={styles.pipelineCard}>
                <div className={styles.muted}>Funnel snapshot</div>
                <div className={styles.pipelineValue}>{analytics?.funnelSummary ?? '—'}</div>
                <div className={styles.pipelineMeta}>Launch-to-paid placeholder for GTM tracking</div>
              </div>
            </div>
            <div className={styles.stageRail}>
              {pipelineStages.map((stage) => (
                <div key={stage} className={styles.stagePill}>{stage}</div>
              ))}
            </div>
          </div>

          <div className={styles.alertCard}>
            <h2>Plans / usage admin</h2>
            <div className={styles.planList}>
              {plans.map((plan) => (
                <div key={plan.id} className={styles.planRow}>
                  <div>
                    <strong>{plan.name}</strong>
                    <span>{plan.monthlyGenerationLimit} credits · {plan.teamSeats} seats</span>
                  </div>
                  <div>
                    <strong>${plan.monthlyPrice}</strong>
                    <span>{plan.ctaLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.table}>
          <div className={styles.sectionHeader}>
            <h2>User management</h2>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search users by name, email, plan, or team"
              value={userFilter}
              onChange={(event) => setUserFilter(event.target.value)}
            />
          </div>
          <div className={styles.tableHead}>
            <span>User</span>
            <span>Plan</span>
            <span>Status</span>
            <span>Team</span>
            <span>Usage</span>
          </div>
          {filteredUsers.map((user) => (
            <div key={user.id} className={styles.tableRow}>
              <span>
                <div className={styles.leadName}>{user.name}</div>
                <div className={styles.leadMeta}>{user.email}</div>
              </span>
              <span><span className={styles.badge}>{user.plan}</span></span>
              <span>{user.status}</span>
              <span>{user.teamName}</span>
              <span>{user.monthlyUsage} / {user.generationCount}</span>
            </div>
          ))}
        </section>

        <section className={styles.crmGrid}>
          <div className={styles.panel}>
            <h2>Lead CRM</h2>
            <div className={styles.leadBoard}>
              {leads.map((lead) => (
                <article key={lead.id} className={styles.leadRecord}>
                  <div className={styles.leadTopLine}>
                    <strong>{lead.name}</strong>
                    <span className={styles.badge}>{lead.stage}</span>
                  </div>
                  <p>{lead.propertyAddress}</p>
                  <div className={styles.leadDetailRow}><span>{lead.source}</span><span>{lead.owner}</span></div>
                  <div className={styles.leadDetailRow}><span>{lead.intentScore}</span><span>${lead.estimatedValue.toLocaleString()}</span></div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Support / feedback</h2>
            <div className={styles.supportList}>
              {support.map((ticket) => (
                <article key={ticket.id} className={styles.supportRecord}>
                  <div className={styles.leadTopLine}>
                    <strong>{ticket.subject}</strong>
                    <span className={styles.badge}>{ticket.priority}</span>
                  </div>
                  <p>{ticket.type} · {ticket.status} · {ticket.owner}</p>
                  <span>{ticket.createdAt}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.table}>
          <h2>Audit / activity</h2>
          <div className={styles.auditList}>
            {auditEvents.map((event) => (
              <div key={event.id} className={styles.auditRecord}>
                <div>
                  <strong>{event.action}</strong>
                  <p>{event.target}</p>
                </div>
                <div>
                  <strong>{event.actor}</strong>
                  <span>{event.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
