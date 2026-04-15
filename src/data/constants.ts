import type { LocationMacro, LocationMicro, PropertyType, SourcePlatform } from '@/types/listing';

export const LOCATIONS_MACRO: LocationMacro[] = ['Bali', 'Lombok'];

export const LOCATIONS_MICRO: Record<LocationMacro, LocationMicro[]> = {
  Bali: ['Kuta', 'Seminyak', 'Canggu', 'Sanur', 'Ubud', 'Uluwatu', 'Nusa Dua'],
  Lombok: ['Lombok Utara', 'Kuta Lombok', 'Senggigi'],
};

export const PROPERTY_TYPES: PropertyType[] = [
  'Studio',
  'T1',
  'T2',
  'T3',
  'Villa',
  'Maison',
  'Terrain',
  'Commercial',
];

export const SOURCE_PLATFORMS: SourcePlatform[] = [
  'Properti.com',
  'Rumah123',
  'OLX',
  'Facebook',
  'Instagram',
  'Agence',
  'Autre',
];

export const PRICE_BUCKETS = [
  { label: '< 50 k€', min: 0, max: 50000 },
  { label: '50–80 k€', min: 50000, max: 80000 },
  { label: '80–120 k€', min: 80000, max: 120000 },
  { label: '120 k€+', min: 120000, max: Infinity },
];

export const DEVELOPERS = [
  'PT Maha Investama',
  'PT Bali Properti Sejahtera',
  'PT Lombok Resort Invest',
  'Agence Bali Dreams',
  'PT Canggu Builds',
  'Vendeur privé',
  'PT Ubud Villas',
  'PT Seminyak Premium',
];
