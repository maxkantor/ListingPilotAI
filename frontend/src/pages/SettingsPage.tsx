import React from 'react';
import { apiService } from '../services/api';
import type { AuthSession, SubscriptionPlan, WorkspaceSettings } from '../types';
import styles from './AppPages.module.css';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = React.useState<WorkspaceSettings | null>(null);
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>([]);
  const [session, setSession] = React.useState<AuthSession | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [settingsData, plansData, sessionData] = await Promise.all([
          apiService.getSettings(),
          apiService.getAdminPlans(),
          apiService.getAuthSession(),
        ]);
        setSettings(settingsData);
        setPlans(plansData);
        setSession(sessionData);
      } catch {
        // resilient
      }
    };

    load();
  }, []);

  const toggleSetting = async (key: 'autoSaveEnabled' | 'requireReview' | 'complianceMode') => {
    if (!settings) return;
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    try {
      const saved = await apiService.updateSettings(next);
      setSettings(saved);
    } catch {
      setSettings(settings);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div><h2>Settings</h2><p>Manage defaults, compliance controls, auth mode, and billing profile.</p></div>
      </section>

      <section className={styles.grid3}>
        <article className={styles.surface}>
          <h3>Workspace defaults</h3>
          <div className={styles.stack}>
            <button type="button" className={styles.toggle} onClick={() => toggleSetting('autoSaveEnabled')}><span>Auto-save drafts</span><strong>{settings?.autoSaveEnabled ? 'On' : 'Off'}</strong></button>
            <button type="button" className={styles.toggle} onClick={() => toggleSetting('requireReview')}><span>Require review</span><strong>{settings?.requireReview ? 'On' : 'Off'}</strong></button>
            <button type="button" className={styles.toggle} onClick={() => toggleSetting('complianceMode')}><span>Compliance mode</span><strong>{settings?.complianceMode ? 'On' : 'Off'}</strong></button>
          </div>
        </article>

        <article className={styles.surface}>
          <h3>Auth session</h3>
          <div className={styles.itemList}>
            <div className={styles.item}><div className={styles.itemTop}><strong>{session?.identityMode ?? 'preview'}</strong><span className={styles.badge}>{session?.authEnabled ? 'Enabled' : 'Preview'}</span></div><p>{session?.cognitoRegion ?? 'No region configured'}</p></div>
            <div className={styles.item}><strong>Allowed features</strong><p>{session?.allowedFeatures.join(' · ') ?? 'Generation · History · Billing'}</p></div>
          </div>
        </article>

        <article className={styles.surface}>
          <h3>Plans</h3>
          <div className={styles.itemList}>
            {plans.map((plan) => (
              <div className={styles.item} key={plan.id}>
                <div className={styles.itemTop}><strong>{plan.name}</strong><span className={styles.badge}>${plan.monthlyPrice}/mo</span></div>
                <p>{plan.monthlyGenerationLimit} credits · {plan.teamSeats} seats</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
