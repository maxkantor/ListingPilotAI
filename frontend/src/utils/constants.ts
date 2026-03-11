import type { PropertyInput } from '../types';

export const SAMPLE_PROPERTY: PropertyInput = {
  listingUrl: '',
  streetAddress: '4812 Wieuca Road NE',
  city: 'Atlanta',
  state: 'GA',
  zip: '30342',
  price: '1,275,000',
  beds: '5',
  baths: '4.5',
  squareFeet: '4,200',
  lotSize: '0.42 acres',
  propertyType: 'Single Family',
  yearBuilt: '2019',
  neighborhood: 'Buckhead',
  keyFeatures:
    "Chef's kitchen with quartz countertops, open concept living area, primary suite with spa bath, finished terrace level, 3-car garage, smart home technology throughout",
  interiorFeatures:
    'Hardwood floors throughout main level, 10-ft ceilings, coffered ceilings in dining room, custom built-ins in study, gas fireplace, wine cellar',
  exteriorFeatures:
    'Heated saltwater pool with spa, covered outdoor kitchen, level fenced backyard, professional landscaping, full irrigation system',
  schoolInfo:
    'Sarah Smith Elementary, Sutton Middle School, North Atlanta High School (all highly rated Atlanta Public Schools)',
  agentNotes:
    'Sellers are motivated and flexible on closing date. Home has been meticulously maintained and shows like new. One-year home warranty included.',
  targetBuyerType: 'Luxury move-up buyer, executive family, corporate relocation',
  tone: 'Luxury',
};

export const STATE_ABBREVIATIONS = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

export const PROPERTY_TYPES = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Land',
  'Commercial',
  'Other',
] as const;

export const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional', desc: 'Clean, MLS-ready' },
  { value: 'Luxury', label: 'Luxury', desc: 'Elevated & premium' },
  { value: 'Friendly', label: 'Friendly', desc: 'Warm & approachable' },
  { value: 'High-Energy', label: 'High-Energy', desc: 'Bold & exciting' },
] as const;
