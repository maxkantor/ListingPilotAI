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
}

export interface GenerateResponse {
  id: string;
  output: GeneratedOutput;
  createdAt: string;
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
  allowedFeatures: string[];
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
