import type {
  AdminOverview,
  AnalyticsOverview,
  DashboardSummary,
  GenerateRequest,
  GenerateResponse,
  HistoryItem,
  Lead,
  PerformanceSnapshot,
  PropertyInput,
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

  saveHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>): Promise<HistoryItem> {
    return request<HistoryItem>('/api/history', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
};
