import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { AdminAnalytics, AuditEvent, Lead, SubscriptionPlan, SupportTicket, UserSummary } from '../types';
import styles from './AppPages.module.css';

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
        setLeads(leadsData.slice(0, 8));
        setSupport(supportData.slice(0, 6));
        setPlans(plansData);
        setAuditEvents(auditData.slice(0, 8));
      } catch {
        // resilient preview mode
      }
    };

    load();
  }, []);

  const filteredUsers = users.filter((user) => [user.name, user.email, user.plan, user.status, user.teamName].join(' ').toLowerCase().includes(userFilter.toLowerCase()));

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div><h2>Admin</h2><p>Operate adoption, plans, support pressure, and revenue signals from one control panel.</p></div>
        <div className={styles.actions}><input className={styles.input} placeholder="Search users" value={userFilter} onChange={(event) => setUserFilter(event.target.value)} /></div>
      </section>

      <section className={styles.grid4}>
        <article className={styles.stat}><span>Total users</span><strong>{analytics?.totalUsers ?? '—'}</strong></article>
        <article className={styles.stat}><span>Active users</span><strong>{analytics?.activeUsers ?? '—'}</strong></article>
        <article className={styles.stat}><span>Trials</span><strong>{analytics?.trialUsers ?? '—'}</strong></article>
        <article className={styles.stat}><span>MRR</span><strong>{analytics?.mrrPlaceholder ?? '—'}</strong></article>
      </section>

      <section className={styles.grid2}>
        <article className={styles.panel}>
          <h3>User management</h3>
          <div className={styles.tableHead}><strong>User</strong><strong>Plan</strong><strong>Status</strong></div>
          {filteredUsers.map((user) => (
            <div key={user.id} className={styles.tableRow}>
              <span>{user.name} · {user.email}</span>
              <span className={styles.badge}>{user.plan}</span>
              <span>{user.status}</span>
            </div>
          ))}
        </article>

        <article className={styles.panel}>
          <h3>Plan controls</h3>
          <div className={styles.itemList}>
            {plans.map((plan) => (
              <div key={plan.id} className={styles.item}>
                <div className={styles.itemTop}><strong>{plan.name}</strong><span className={styles.badge}>${plan.monthlyPrice}/mo</span></div>
                <p>{plan.monthlyGenerationLimit} credits · {plan.teamSeats} seats</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.grid2}>
        <article className={styles.panel}>
          <h3>Lead CRM</h3>
          <div className={styles.itemList}>
            {leads.map((lead) => (
              <article key={lead.id} className={styles.item}>
                <div className={styles.itemTop}><strong>{lead.name}</strong><span className={styles.badge}>{lead.stage}</span></div>
                <p>{lead.propertyAddress}</p>
                <div className={styles.itemMeta}><span>{lead.source}</span><span>{lead.owner}</span><strong>${lead.estimatedValue.toLocaleString()}</strong></div>
              </article>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <h3>Support and audit</h3>
          <div className={styles.itemList}>
            {support.map((ticket) => (
              <article key={ticket.id} className={styles.item}>
                <div className={styles.itemTop}><strong>{ticket.subject}</strong><span className={styles.badge}>{ticket.priority}</span></div>
                <p>{ticket.status} · {ticket.owner}</p>
              </article>
            ))}
            {auditEvents.map((event) => (
              <article key={event.id} className={styles.item}>
                <div className={styles.itemTop}><strong>{event.action}</strong><span>{event.actor}</span></div>
                <p>{event.target}</p>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
