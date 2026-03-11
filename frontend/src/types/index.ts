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
