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
