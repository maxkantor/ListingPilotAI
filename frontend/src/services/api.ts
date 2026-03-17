import { clearStoredAuth, getAnonymousId, getStoredTokens, storeTokens } from '../auth/authStorage';
import type {
  ActivityEventRecord,
  AdminActionRecord,
  AdminAnalytics,
  AdminDashboard,
  AdminOverview,
  AnalyticsOverview,
  AuditEvent,
  AuthResult,
  AuthSession,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  ConfirmEmailRequest,
  ContactInquiry,
  ContactReply,
  ContactSubmissionRequest,
  ContactSubmissionResponse,
  CreateUserNoteRequest,
  CurrentUser,
  DashboardSummary,
  DemoExperience,
  DemoRequest,
  ForgotPasswordRequest,
  GeneratedAssetItem,
  GenerateRequest,
  GenerateResponse,
  HistoryItem,
  ListingProject,
  ListingPreviewResponse,
  LoginRequest,
  Lead,
  PackageCatalogItem,
  PerformanceSnapshot,
  PropertyInput,
  PurchaseRecord,
  ReplyContactRequest,
  ResetPasswordRequest,
  SignUpRequest,
  SubscriptionPlan,
  SupportTicket,
  TrackEventRequest,
  UpdateUserRequest,
  UserDetail,
  UserNote,
  UserSummary,
  WorkspaceSettings,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const LISTING_PREVIEW_FALLBACK_BASE_URL = import.meta.env.VITE_LISTING_PREVIEW_FALLBACK_BASE_URL || 'https://api.listingpilot.com';

class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function refreshTokens(): Promise<boolean> {
  const tokens = getStoredTokens();
  if (!tokens?.refreshToken) {
    return false;
  }

  const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });

  if (!response.ok) {
    clearStoredAuth();
    return false;
  }

  const result = await response.json() as AuthResult;
  if (result.tokens) {
    storeTokens(result.tokens);
    return true;
  }

  return false;
}

async function request<T>(path: string, options?: RequestInit, retry = true): Promise<T> {
  const tokens = getStoredTokens();
  const headers = new Headers(options?.headers ?? {});
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (tokens?.accessToken) {
    headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }

  headers.set('X-Anonymous-Id', getAnonymousId());

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && retry && !path.includes('/api/auth/refresh')) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return request<T>(path, options, false);
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    let payload: unknown = text;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }

    throw new ApiError(res.status, `API error ${res.status}: ${text}`, payload);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export { ApiError };

export const apiService = {
  generate(property: PropertyInput, usageScope: 'demo' | 'workspace'): Promise<GenerateResponse> {
    const body: GenerateRequest = {
      property,
      usageContext: {
        scope: usageScope,
        anonymousId: getAnonymousId(),
      },
    };

    return request<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  signUp(payload: SignUpRequest): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginRequest): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  adminLogin(payload: LoginRequest): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  confirmEmail(payload: ConfirmEmailRequest): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/confirm-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  forgotPassword(payload: ForgotPasswordRequest): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  resetPassword(payload: ResetPasswordRequest): Promise<AuthResult> {
    return request<AuthResult>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout(accessToken: string): Promise<void> {
    return request<void>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  },

  getAuthSession(): Promise<AuthSession> {
    return request<AuthSession>('/api/auth/session');
  },

  getPackages(): Promise<PackageCatalogItem[]> {
    return request<PackageCatalogItem[]>('/api/billing/packages');
  },

  createCheckoutSession(payload: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    return request<CheckoutSessionResponse>('/api/billing/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getPurchases(): Promise<PurchaseRecord[]> {
    return request<PurchaseRecord[]>('/api/billing/purchases');
  },

  trackEvent(payload: TrackEventRequest): Promise<void> {
    return request<void>('/api/events/track', {
      method: 'POST',
      body: JSON.stringify({ ...payload, anonymousId: payload.anonymousId ?? getAnonymousId() }),
    });
  },

  getSampleProperty(): Promise<PropertyInput> {
    return request<PropertyInput>('/api/sample-property');
  },

  async getListingPreview(url: string): Promise<ListingPreviewResponse> {
    const params = new URLSearchParams({ url });
    const path = `/api/listing-preview?${params.toString()}`;

    try {
      return await request<ListingPreviewResponse>(path);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404) {
        throw error;
      }

      const fallbackResponse = await fetch(`${LISTING_PREVIEW_FALLBACK_BASE_URL}${path}`, {
        method: 'GET',
        headers: {
          'X-Anonymous-Id': getAnonymousId(),
        },
      });

      if (!fallbackResponse.ok) {
        throw error;
      }

      return fallbackResponse.json() as Promise<ListingPreviewResponse>;
    }
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

  getAdminUserDetail(userId: string): Promise<UserDetail> {
    return request<UserDetail>(`/api/admin/users/${userId}`);
  },

  updateAdminUser(userId: string, payload: UpdateUserRequest): Promise<CurrentUser> {
    return request<CurrentUser>(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  addAdminUserNote(userId: string, payload: CreateUserNoteRequest): Promise<UserNote> {
    return request<UserNote>(`/api/admin/users/${userId}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAdminAnalytics(): Promise<AdminAnalytics> {
    return request<AdminAnalytics>('/api/admin/analytics');
  },

  getAdminDashboard(): Promise<AdminDashboard> {
    return request<AdminDashboard>('/api/admin/dashboard');
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

  getAdminContacts(): Promise<ContactInquiry[]> {
    return request<ContactInquiry[]>('/api/admin/contacts');
  },

  getAdminContactDetail(inquiryId: string): Promise<{ inquiry: ContactInquiry; replies: ContactReply[] }> {
    return request<{ inquiry: ContactInquiry; replies: ContactReply[] }>(`/api/admin/contacts/${inquiryId}`);
  },

  replyToContact(inquiryId: string, payload: ReplyContactRequest): Promise<ContactReply> {
    return request<ContactReply>(`/api/contact/${inquiryId}/reply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
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
