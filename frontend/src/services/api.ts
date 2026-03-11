import type {
  AdminOverview,
  AdminAnalytics,
  AnalyticsOverview,
  AuditEvent,
  AuthSession,
  ContactSubmissionRequest,
  ContactSubmissionResponse,
  DashboardSummary,
  DemoExperience,
  DemoRequest,
  GeneratedAssetItem,
  GenerateRequest,
  GenerateResponse,
  HistoryItem,
  ListingProject,
  Lead,
  PerformanceSnapshot,
  PropertyInput,
  SubscriptionPlan,
  SupportTicket,
  UserSummary,
  WorkspaceSettings,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const apiService = {
  generate(property: PropertyInput): Promise<GenerateResponse> {
    const body: GenerateRequest = { property };
    return request<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getSampleProperty(): Promise<PropertyInput> {
    return request<PropertyInput>('/api/sample-property');
  },

  getHistory(): Promise<HistoryItem[]> {
    return request<HistoryItem[]>('/api/history');
  },

  getDashboardSummary(): Promise<DashboardSummary> {
    return request<DashboardSummary>('/api/dashboard/summary');
  },

  getPerformanceSnapshots(): Promise<PerformanceSnapshot[]> {
    return request<PerformanceSnapshot[]>('/api/dashboard/performance');
  },

  getLeads(): Promise<Lead[]> {
    return request<Lead[]>('/api/crm/leads');
  },

  getAdminOverview(): Promise<AdminOverview> {
    return request<AdminOverview>('/api/admin/overview');
  },

  getAnalyticsOverview(): Promise<AnalyticsOverview> {
    return request<AnalyticsOverview>('/api/analytics/overview');
  },

  getAuthSession(): Promise<AuthSession> {
    return request<AuthSession>('/api/auth/session');
  },

  getListings(): Promise<ListingProject[]> {
    return request<ListingProject[]>('/api/listings');
  },

  getListingAssets(listingId: string): Promise<GeneratedAssetItem[]> {
    return request<GeneratedAssetItem[]>(`/api/listings/${listingId}/assets`);
  },

  getSettings(): Promise<WorkspaceSettings> {
    return request<WorkspaceSettings>('/api/settings');
  },

  updateSettings(settings: WorkspaceSettings): Promise<WorkspaceSettings> {
    return request<WorkspaceSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  getAdminUsers(): Promise<UserSummary[]> {
    return request<UserSummary[]>('/api/admin/users');
  },

  getAdminAnalytics(): Promise<AdminAnalytics> {
    return request<AdminAnalytics>('/api/admin/analytics');
  },

  getAdminLeads(): Promise<Lead[]> {
    return request<Lead[]>('/api/admin/leads');
  },

  getAdminSupport(): Promise<SupportTicket[]> {
    return request<SupportTicket[]>('/api/admin/support');
  },

  getAdminPlans(): Promise<SubscriptionPlan[]> {
    return request<SubscriptionPlan[]>('/api/admin/plans');
  },

  getAdminAudit(): Promise<AuditEvent[]> {
    return request<AuditEvent[]>('/api/admin/audit');
  },

  submitContact(requestBody: ContactSubmissionRequest): Promise<ContactSubmissionResponse> {
    return request<ContactSubmissionResponse>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  getDemoExperience(): Promise<DemoExperience> {
    return request<DemoExperience>('/api/demo');
  },

  submitDemoRequest(requestBody: DemoRequest): Promise<ContactSubmissionResponse> {
    return request<ContactSubmissionResponse>('/api/demo', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  saveHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): Promise<HistoryItem> {
    return request<HistoryItem>('/api/history', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
};
