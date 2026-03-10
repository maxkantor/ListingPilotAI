export interface PropertyInput {
  listingUrl?: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  lotSize?: string;
  propertyType: string;
  yearBuilt?: string;
  neighborhood?: string;
  keyFeatures?: string;
  interiorFeatures?: string;
  exteriorFeatures?: string;
  schoolInfo?: string;
  agentNotes?: string;
  targetBuyer?: string;
  tone: string;
}

export interface GeneratedContent {
  mlsDescription: string;
  luxuryDescription: string;
  facebookPost: string;
  instagramCaption: string;
  linkedInPost: string;
  emailBlurb: string;
}

export interface HistoryEntry {
  id: string;
  property: PropertyInput;
  content: GeneratedContent;
  createdAt: string;
}
