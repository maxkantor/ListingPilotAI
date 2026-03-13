export type PropertyType =
  | 'Single Family'
  | 'Condo'
  | 'Townhouse'
  | 'Multi-Family'
  | 'Land'
  | 'Commercial'
  | 'Other';

export type ToneType = 'Professional' | 'Luxury' | 'Friendly' | 'High-Energy';

export interface PropertyInput {
  listingUrl?: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  beds: string;
  baths: string;
  squareFeet: string;
  lotSize?: string;
  propertyType: PropertyType;
  yearBuilt?: string;
  neighborhood?: string;
  keyFeatures: string;
  interiorFeatures?: string;
  exteriorFeatures?: string;
  schoolInfo?: string;
  agentNotes?: string;
  targetBuyerType?: string;
  tone: ToneType;
}

export interface GeneratedOutput {
  mlsDescription: string;
  luxuryDescription: string;
  facebookPost: string;
  instagramCaption: string;
  linkedInPost: string;
  emailBlurb: string;
}

export interface GenerationResult {
  id: string;
  property: PropertyInput;
  output: GeneratedOutput;
  createdAt: string;
}

export interface GenerateRequest {
  property: PropertyInput;
  usageContext?: UsageContext;
}

export interface GenerateResult {
  id: string;
  output: GeneratedOutput;
  createdAt: string;
}

export interface UsageContext {
  scope: 'demo' | 'workspace';
  anonymousId?: string;
}

export interface UsageSummary {
  scope: string;
  creditBalance: number;
  incentiveCreditBalance: number;
  remainingDemoActions: number;
  remainingFreeOutputs: number;
  generatedOutputs: number;
  requiresSignup: boolean;
  requiresPurchase: boolean;
  lockReason: string;
}

export interface UsageGateResult {
  allowed: boolean;
  lockResults: boolean;
  reason: string;
  conversionAction: string;
  summary: UsageSummary;
}

export interface GenerateResponse {
  result: GenerateResult | null;
  usage: UsageSummary;
}

export interface HistoryItem {
  id: string;
  streetAddress: string;
  city: string;
  state: string;
  price: string;
  createdAt: string;
  output: GeneratedOutput;
}

export interface ChannelPerformance {
  channel: string;
  label: string;
  conversionRate: string;
  engagementLift: string;
  status: string;
}

export interface DashboardSummary {
  activeListings: number;
  outputsGenerated: number;
  avgTurnaround: string;
  pipelineValue: string;
  conversionLift: string;
  priorityActions: string[];
  topChannels: ChannelPerformance[];
}

export interface PerformanceSnapshot {
  week: string;
  outputs: number;
  qualifiedLeads: number;
  toursBooked: number;
}

export interface Lead {
  id: string;
  name: string;
  stage: string;
  source: string;
  propertyAddress: string;
  intentScore: string;
  owner: string;
  lastActivity: string;
  estimatedValue: number;
}

export interface LeadStageSummary {
  stage: string;
  count: number;
  value: string;
}

export interface AdminOverview {
  activeAgents: number;
  trialAccounts: number;
  monthlyRecurringRevenue: string;
  churnRisk: string;
  openSupportTickets: number;
  pipeline: LeadStageSummary[];
  alerts: string[];
}

export interface AnalyticsOverview {
  organicTrafficGrowth: string;
  demoConversionRate: string;
  trialActivationRate: string;
  topLandingPage: string;
  seoPriorities: string[];
}

export interface AuthSession {
  authEnabled: boolean;
  identityMode: string;
  cognitoRegion: string;
  userPoolId: string;
  clientId?: string;
  isAuthenticated?: boolean;
  currentUserId?: string;
  currentUserEmail?: string;
  currentUserName?: string;
  groups?: string[];
  allowedFeatures: string[];
  currentUser?: CurrentUser | null;
  usagePolicy?: UsagePolicy;
  packages?: PackageCatalogItem[];
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin' | string;
  accountState: string;
  emailVerified: boolean;
  planCode: string;
  creditBalance: number;
  incentiveCreditBalance: number;
  demoActionsUsed: number;
  outputGeneratedCount: number;
  conversionFunnelStage: string;
}

export interface UsagePolicy {
  anonymousDemoOutputLimit: number;
  anonymousWorkflowSessions: number;
  signedUpStarterCredits: number;
  freeWorkspaceOutputLimit: number;
  lockResultsWhenAnonymousLimitReached: boolean;
}

export interface PackageCatalogItem {
  id: string;
  code: string;
  name: string;
  description: string;
  billingMode: string;
  credits: number;
  accessLevel: string;
  includesAdminCapabilities: boolean;
  includesTeamCapabilities: boolean;
  priceUsd: number;
  isFeatured: boolean;
  features: string[];
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  tokenType: string;
}

export interface AuthResult {
  success: boolean;
  requiresEmailVerification: boolean;
  message: string;
  redirectTo: string;
  tokens?: AuthTokens;
  user?: CurrentUser | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  intendedDestination?: string;
}

export interface SignUpRequest extends LoginRequest {
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ConfirmEmailRequest {
  email: string;
  code: string;
}

export interface CheckoutSessionRequest {
  packageCode: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  checkoutUrl: string;
  purchaseId: string;
}

export interface PurchaseRecord {
  id: string;
  packageCode: string;
  status: string;
  amountUsd: number;
  creditsGranted: number;
  receiptUrl: string;
  createdAt: string;
  completedAt: string;
}

export interface TrackEventRequest {
  eventType: string;
  path: string;
  source: string;
  anonymousId?: string;
  metadata?: Record<string, string>;
}

export interface ListingProject {
  id: string;
  title: string;
  streetAddress: string;
  city: string;
  state: string;
  price: string;
  status: string;
  tone: string;
  updatedAt: string;
  tags: string[];
  channels: string[];
}

export interface GeneratedAssetItem {
  id: string;
  listingId: string;
  assetType: string;
  title: string;
  content: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface WorkspaceSettings {
  defaultTone: string;
  teamPreset: string;
  brandVoice: string;
  autoSaveEnabled: boolean;
  requireReview: boolean;
  complianceMode: boolean;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  teamName: string;
  lastActiveAt: string;
  generationCount: number;
  monthlyUsage: number;
}

export interface ActivityEventRecord {
  id: string;
  eventType: string;
  userEmail: string;
  anonymousId: string;
  path: string;
  source: string;
  occurredAt: string;
  metadata: Record<string, string>;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  paidUsers: number;
  totalGenerations: number;
  totalLeads: number;
  funnelSummary: string;
  mrrPlaceholder: string;
}

export interface SupportTicket {
  id: string;
  type: string;
  subject: string;
  status: string;
  priority: string;
  owner: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  monthlyGenerationLimit: number;
  teamSeats: number;
  isFeatured: boolean;
  ctaLabel: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface ContactSubmissionRequest {
  name: string;
  email: string;
  team: string;
  role: string;
  message: string;
}

export interface ContactSubmissionResponse {
  id: string;
  status: string;
  message: string;
}

export interface ContactInquiry {
  id: string;
  userId: string;
  name: string;
  email: string;
  team: string;
  role: string;
  subject: string;
  message: string;
  status: string;
  unread: boolean;
  createdAt: string;
  updatedAt: string;
  lastReplyPreview: string;
}

export interface ContactReply {
  id: string;
  inquiryId: string;
  adminUserId: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  messageBody: string;
  deliveryStatus: string;
  sentAt: string;
}

export interface ReplyContactRequest {
  subject: string;
  messageBody: string;
}

export interface UserNote {
  id: string;
  body: string;
  adminEmail: string;
  createdAt: string;
}

export interface AdminActionRecord {
  id: string;
  adminEmail: string;
  actionType: string;
  targetUserId: string;
  targetType: string;
  oldValueJson: string;
  newValueJson: string;
  notes: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  planCode: string;
  role: string;
  accountState: string;
  creditDelta: number;
  incentiveCreditDelta: number;
  notes: string;
}

export interface CreateUserNoteRequest {
  body: string;
}

export interface UserDetail {
  user: CurrentUser;
  activityTimeline: ActivityEventRecord[];
  purchases: PurchaseRecord[];
  notes: UserNote[];
  adminActions: AdminActionRecord[];
  contactHistory: ContactInquiry[];
}

export interface AdminDashboard {
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  conversionRate: number;
  demoToSignupRate: number;
  signupToPaidRate: number;
  activeUsers: number;
  revenuePlaceholder: string;
  contactInquiriesOpen: number;
  totalPurchases: number;
  demoLimitReachedCount: number;
}

export interface DemoRequest {
  name: string;
  email: string;
  team: string;
  interest: string;
}

export interface DemoExperience {
  listingName: string;
  address: string;
  price: string;
  beds: string;
  baths: string;
  heroImageUrl: string;
  assets: GeneratedAssetItem[];
}
