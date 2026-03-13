import React from 'react';
import { apiService } from '../services/api';
import type { AdminDashboard, ContactInquiry, ContactReply, UserDetail, UserSummary } from '../types';
import styles from './AdminPage.module.css';

export const AdminPage: React.FC = () => {
  const [dashboard, setDashboard] = React.useState<AdminDashboard | null>(null);
  const [users, setUsers] = React.useState<UserSummary[]>([]);
  const [contacts, setContacts] = React.useState<ContactInquiry[]>([]);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [selectedInquiryId, setSelectedInquiryId] = React.useState<string | null>(null);
  const [userDetail, setUserDetail] = React.useState<UserDetail | null>(null);
  const [contactDetail, setContactDetail] = React.useState<{ inquiry: ContactInquiry; replies: ContactReply[] } | null>(null);
  const [userFilter, setUserFilter] = React.useState('');
  const [noteBody, setNoteBody] = React.useState('');
  const [replyDraft, setReplyDraft] = React.useState({ subject: '', messageBody: '' });
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [dashboardData, usersData, contactsData] = await Promise.all([
          apiService.getAdminDashboard(),
          apiService.getAdminUsers(),
          apiService.getAdminContacts(),
        ]);

        setDashboard(dashboardData);
        setUsers(usersData);
        setContacts(contactsData);
        setSelectedUserId((current) => current ?? usersData[0]?.id ?? null);
        setSelectedInquiryId((current) => current ?? contactsData[0]?.id ?? null);
      } catch {
        setStatus('Admin data is temporarily unavailable.');
      }
    };

    void load();
  }, []);

  React.useEffect(() => {
    if (!selectedUserId) {
      setUserDetail(null);
      return;
    }

    void apiService.getAdminUserDetail(selectedUserId).then(setUserDetail).catch(() => {
      setStatus('Unable to load the selected user detail.');
    });
  }, [selectedUserId]);

  React.useEffect(() => {
    if (!selectedInquiryId) {
      setContactDetail(null);
      return;
    }

    void apiService.getAdminContactDetail(selectedInquiryId).then(setContactDetail).catch(() => {
      setStatus('Unable to load the selected inquiry.');
    });
  }, [selectedInquiryId]);

  const filteredUsers = users.filter((user) => [user.name, user.email, user.plan, user.status, user.teamName].join(' ').toLowerCase().includes(userFilter.toLowerCase()));

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUserId || !noteBody.trim()) {
      return;
    }

    try {
      await apiService.addAdminUserNote(selectedUserId, { body: noteBody.trim() });
      setUserDetail(await apiService.getAdminUserDetail(selectedUserId));
      setNoteBody('');
      setStatus('Note added to user timeline.');
    } catch {
      setStatus('Unable to save that note.');
    }
  };

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedInquiryId || !replyDraft.subject.trim() || !replyDraft.messageBody.trim()) {
      return;
    }

    try {
      await apiService.replyToContact(selectedInquiryId, {
        subject: replyDraft.subject.trim(),
        messageBody: replyDraft.messageBody.trim(),
      });
      setContactDetail(await apiService.getAdminContactDetail(selectedInquiryId));
      setReplyDraft({ subject: '', messageBody: '' });
      setStatus('Reply sent and logged.');
    } catch {
      setStatus('Unable to send the CRM reply.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <article className={styles.heroCard}>
            <span className={styles.eyebrow}>Admin CRM</span>
            <h1 className={styles.title}>Manage users, monetization signals, and contact replies from one console.</h1>
            <p className={styles.subtitle}>Review conversion health, investigate user activity, add internal notes, and answer inbound inquiries with audited replies.</p>
            <div className={styles.heroBadgeRow}>
              <span>Protected admin access</span>
              <span>Activity timeline</span>
              <span>SES-backed contact replies</span>
              <span>Purchase history visibility</span>
            </div>
          </article>

          <article className={styles.alertCard}>
            <h2>Current status</h2>
            <ul className={styles.alertList}>
              <li>{dashboard ? `${dashboard.contactInquiriesOpen} open contact inquiries` : 'Loading inquiry queue…'}</li>
              <li>{dashboard ? `${dashboard.demoLimitReachedCount} demo limits reached` : 'Loading demo conversion metrics…'}</li>
              <li>{dashboard ? `${dashboard.totalPurchases} tracked purchases` : 'Loading purchase metrics…'}</li>
              <li>{status ?? 'Admin systems connected.'}</li>
            </ul>
          </article>
        </section>

        <section className={styles.metricGrid}>
          <article className={styles.metric}><span className={styles.metricLabel}>Total users</span><strong className={styles.metricValue}>{dashboard?.totalUsers ?? '—'}</strong></article>
          <article className={styles.metric}><span className={styles.metricLabel}>Paid users</span><strong className={styles.metricValue}>{dashboard?.paidUsers ?? '—'}</strong></article>
          <article className={styles.metric}><span className={styles.metricLabel}>Conversion rate</span><strong className={styles.metricValue}>{dashboard ? `${dashboard.conversionRate}%` : '—'}</strong></article>
          <article className={styles.metric}><span className={styles.metricLabel}>Revenue</span><strong className={styles.metricValue}>{dashboard?.revenuePlaceholder ?? '—'}</strong></article>
        </section>

        <section className={styles.panelGrid}>
          <article className={styles.table}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>User management</h2>
                <p className={styles.muted}>Search and inspect user records, credits, purchases, and internal notes.</p>
              </div>
              <input className={styles.searchInput} placeholder="Search users" value={userFilter} onChange={(event) => setUserFilter(event.target.value)} />
            </div>
            <div className={styles.tableHead}><strong>User</strong><strong>Plan</strong><strong>Status</strong><strong>Usage</strong><strong>Last active</strong></div>
            {filteredUsers.map((user) => (
              <button key={user.id} type="button" className={styles.tableRow} onClick={() => setSelectedUserId(user.id)}>
                <span className={styles.leadName}>{user.name} · {user.email}</span>
                <span className={styles.badge}>{user.plan}</span>
                <span>{user.status}</span>
                <span>{user.monthlyUsage} credits</span>
                <span>{user.lastActiveAt}</span>
              </button>
            ))}
          </article>

          <article className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>User detail</h2>
                <p className={styles.muted}>{userDetail?.user.email ?? 'Select a user to inspect activity and billing history.'}</p>
              </div>
              {userDetail ? <span className={styles.badge}>{userDetail.user.planCode}</span> : null}
            </div>
            {userDetail ? (
              <>
                <div className={styles.pipelineGridWide}>
                  <div className={styles.metric}><span className={styles.metricLabel}>Credits</span><strong className={styles.metricValue}>{userDetail.user.creditBalance}</strong></div>
                  <div className={styles.metric}><span className={styles.metricLabel}>Starter credits</span><strong className={styles.metricValue}>{userDetail.user.incentiveCreditBalance}</strong></div>
                  <div className={styles.metric}><span className={styles.metricLabel}>Outputs</span><strong className={styles.metricValue}>{userDetail.user.outputGeneratedCount}</strong></div>
                </div>

                <div className={styles.auditList}>
                  {userDetail.purchases.slice(0, 4).map((purchase) => (
                    <article key={purchase.id} className={styles.auditRecord}>
                      <strong>{purchase.packageCode}</strong>
                      <p>{purchase.status} · ${purchase.amountUsd}</p>
                      <span>{purchase.createdAt}</span>
                    </article>
                  ))}
                  {userDetail.activityTimeline.slice(0, 4).map((event) => (
                    <article key={event.id} className={styles.auditRecord}>
                      <strong>{event.eventType}</strong>
                      <p>{event.path || event.source}</p>
                      <span>{event.occurredAt}</span>
                    </article>
                  ))}
                </div>

                <form className={styles.panel} onSubmit={handleAddNote}>
                  <div className={styles.sectionHeader}>
                    <h2>Internal note</h2>
                    <span className={styles.badge}>{userDetail.notes.length} notes</span>
                  </div>
                  <textarea className={styles.searchInput} placeholder="Add account context, renewal signal, or follow-up detail" value={noteBody} onChange={(event) => setNoteBody(event.target.value)} rows={4} />
                  <div className={styles.planList}>
                    {userDetail.notes.slice(0, 3).map((note) => (
                      <div key={note.id} className={styles.planRow}>
                        <strong>{note.adminEmail}</strong>
                        <span>{note.createdAt}</span>
                        <p>{note.body}</p>
                      </div>
                    ))}
                  </div>
                  <button type="submit" className={styles.badge}>Save note</button>
                </form>
              </>
            ) : null}
          </article>
        </section>

        <section className={styles.crmGrid}>
          <article className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Contact inbox</h2>
                <p className={styles.muted}>Review new inquiries and open the full CRM thread.</p>
              </div>
              <span className={styles.badge}>{contacts.filter((contact) => contact.unread).length} unread</span>
            </div>
            <div className={styles.supportList}>
              {contacts.map((contact) => (
                <button key={contact.id} type="button" className={styles.supportRecord} onClick={() => setSelectedInquiryId(contact.id)}>
                  <div className={styles.leadTopLine}><strong>{contact.name}</strong><span className={styles.badge}>{contact.status}</span></div>
                  <p>{contact.subject || contact.team || contact.email}</p>
                  <span>{contact.updatedAt}</span>
                </button>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Reply composer</h2>
                <p className={styles.muted}>{contactDetail?.inquiry.email ?? 'Select an inquiry to reply.'}</p>
              </div>
              {contactDetail ? <span className={styles.badge}>{contactDetail.replies.length} replies</span> : null}
            </div>
            {contactDetail ? (
              <>
                <ul className={styles.alertList}>
                  <li>{contactDetail.inquiry.message}</li>
                </ul>
                <div className={styles.auditList}>
                  {contactDetail.replies.slice(0, 3).map((reply) => (
                    <article key={reply.id} className={styles.auditRecord}>
                      <strong>{reply.subject}</strong>
                      <p>{reply.messageBody}</p>
                      <span>{reply.sentAt}</span>
                    </article>
                  ))}
                </div>
                <form className={styles.panel} onSubmit={handleReply}>
                  <input className={styles.searchInput} placeholder="Reply subject" value={replyDraft.subject} onChange={(event) => setReplyDraft((current) => ({ ...current, subject: event.target.value }))} />
                  <textarea className={styles.searchInput} placeholder="Write your reply" value={replyDraft.messageBody} onChange={(event) => setReplyDraft((current) => ({ ...current, messageBody: event.target.value }))} rows={6} />
                  <button type="submit" className={styles.badge}>Send reply</button>
                </form>
              </>
            ) : null}
          </article>
        </section>
      </div>
    </div>
  );
};
