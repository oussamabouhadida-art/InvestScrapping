export type LocationMacro = 'Bali' | 'Lombok';

export type LocationMicro =
  | 'Kuta'
  | 'Seminyak'
  | 'Canggu'
  | 'Sanur'
  | 'Ubud'
  | 'Uluwatu'
  | 'Lombok Utara'
  | 'Kuta Lombok'
  | 'Senggigi'
  | 'Nusa Dua';

export type PriceBucket = '<50k' | '50-80k' | '80-120k' | '120k+';

export type PropertyType =
  | 'Studio'
  | 'T1'
  | 'T2'
  | 'T3'
  | 'Villa'
  | 'Maison'
  | 'Terrain'
  | 'Commercial';

export type SourcePlatform =
  | 'Properti.com'
  | 'Rumah123'
  | 'OLX'
  | 'Facebook'
  | 'Instagram'
  | 'Agence'
  | 'Autre';

export type LegalStructure =
  | 'SHM'
  | 'HGB'
  | 'HM'
  | 'Girik'
  | 'Inconnu';

export interface Listing {
  id: string;
  title: string;

  location_macro: LocationMacro;
  location_micro: LocationMicro;

  price_amount: number;
  price_currency: 'EUR' | 'USD' | 'IDR';
  price_bucket: PriceBucket;

  property_type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  size_building_m2?: number;
  size_land_m2?: number;
  furnished?: boolean;

  developer_name: string;
  source_platform: SourcePlatform;
  source_url: string;

  image_url: string;

  posted_at: Date;
  scraped_at: Date;

  legal_structure_claim: LegalStructure;
  revenue_claim_annual?: number;
  occupancy_claim_percent?: number;

  trust_score: number;
  completeness_score: number;
  notes?: string;

  status: 'active' | 'sold' | 'draft';
}

export interface FilterState {
  location_macros: LocationMacro[];
  location_micros: LocationMicro[];
  price_min: number;
  price_max: number;
  property_types: PropertyType[];
  source_platforms: SourcePlatform[];
  developer_names: string[];
  search: string;
}

export interface SortOption {
  field: 'price' | 'posted_at' | 'trust_score' | 'location_micro' | 'title';
  direction: 'asc' | 'desc';
}
