import type { DelhiNcrRegion, MetroLineColor } from '../types/property';

export interface LocalityInfo {
  name: string;
  region: DelhiNcrRegion;
  avgBuyRateSqFt: number; // in INR
  avgRent2Bhk: number; // in INR
  circleRateCategory?: string; // e.g. "Category A (₹7.74 Lakh/sq.m)"
  nearestMetroLines: MetroLineColor[];
  popularSocieties: string[];
  highlights: string[];
  lat: number;
  lng: number;
}

export const DELHI_NCR_LOCALITIES: LocalityInfo[] = [
  // South Delhi
  {
    name: 'Greater Kailash 1 & 2',
    region: 'South Delhi',
    avgBuyRateSqFt: 26500,
    avgRent2Bhk: 58000,
    circleRateCategory: 'Category A (₹7,74,000 / sq.m)',
    nearestMetroLines: ['Magenta', 'Violet'],
    popularSocieties: ['M Block Luxury Floors', 'GK Enclave', 'DLF Kings Court'],
    highlights: ['Posh neighbourhood', 'M-Block Market', 'Top private hospitals nearby'],
    lat: 28.5432,
    lng: 77.2428,
  },
  {
    name: 'Hauz Khas Enclave',
    region: 'South Delhi',
    avgBuyRateSqFt: 29000,
    avgRent2Bhk: 65000,
    circleRateCategory: 'Category A (₹7,74,000 / sq.m)',
    nearestMetroLines: ['Yellow', 'Magenta'],
    popularSocieties: ['Hauz Khas Enclave Villas', 'Aurobindo Marg Floors', 'Mayfair Gardens'],
    highlights: ['Direct Metro Interchange (Yellow/Magenta)', 'Hauz Khas Lake & Deer Park', 'Heritage cafe scene'],
    lat: 28.5494,
    lng: 77.2001,
  },
  {
    name: 'Vasant Kunj',
    region: 'South Delhi',
    avgBuyRateSqFt: 18500,
    avgRent2Bhk: 42000,
    circleRateCategory: 'Category B (₹2,45,520 / sq.m)',
    nearestMetroLines: ['Magenta', 'Aqua'],
    popularSocieties: ['DDA Sector B Pocket 10', 'DDA Sector C Pocket 9', 'Saraswati Narmada Apts'],
    highlights: ['Adjacent to IGI Airport (T3)', 'Promenade & Ambience Mall', 'Spacious green parks'],
    lat: 28.5293,
    lng: 77.1539,
  },
  {
    name: 'Saket & Sainik Farm',
    region: 'South Delhi',
    avgBuyRateSqFt: 17200,
    avgRent2Bhk: 38000,
    circleRateCategory: 'Category B (₹2,45,520 / sq.m)',
    nearestMetroLines: ['Yellow'],
    popularSocieties: ['DDA Golf View Apts', 'Saket J Block', 'Paryavaran Complex'],
    highlights: ['Select CityWalk Mall', 'Max Super Speciality Hospital', 'Yellow Line Metro'],
    lat: 28.5245,
    lng: 77.2066,
  },

  // Gurugram (Gurgaon)
  {
    name: 'Golf Course Road (DLF 5)',
    region: 'Gurugram',
    avgBuyRateSqFt: 32000,
    avgRent2Bhk: 85000,
    circleRateCategory: 'Collector Rate: ₹1,65,000 / sq.yd',
    nearestMetroLines: ['Rapid Metro'],
    popularSocieties: ['The Aralias', 'The Magnolias', 'The Camellias', 'DLF The Crest'],
    highlights: ['Billionaires Row of NCR', 'Rapid Metro 16 Lane Expressway', 'Horizon Center F&B Hub'],
    lat: 28.4595,
    lng: 77.0988,
  },
  {
    name: 'DLF Phase 1-4 & Cyber City',
    region: 'Gurugram',
    avgBuyRateSqFt: 21500,
    avgRent2Bhk: 52000,
    circleRateCategory: 'Collector Rate: ₹1,15,000 / sq.yd',
    nearestMetroLines: ['Yellow', 'Rapid Metro'],
    popularSocieties: ['DLF Phase 2 Floors', 'Silver Oaks', 'Beverly Park', 'DLF Regency Park'],
    highlights: ['5 mins from DLF CyberHub', 'MG Road Metro Station', 'High rental yield for tech workers'],
    lat: 28.4817,
    lng: 77.0863,
  },
  {
    name: 'Golf Course Extension & Sec 57-65',
    region: 'Gurugram',
    avgBuyRateSqFt: 15500,
    avgRent2Bhk: 45000,
    circleRateCategory: 'Collector Rate: ₹90,000 / sq.yd',
    nearestMetroLines: ['Rapid Metro'],
    popularSocieties: ['M3M Golfestate', 'Emaar Palm Drive', 'Pioneer Araya', 'Ireo Grand Arch'],
    highlights: ['Wide 60m sector roads', 'World City School cluster', 'Upcoming Metro corridor'],
    lat: 28.4112,
    lng: 77.0782,
  },
  {
    name: 'Dwarka Expressway (Sec 102-113)',
    region: 'Gurugram',
    avgBuyRateSqFt: 13200,
    avgRent2Bhk: 34000,
    circleRateCategory: 'Collector Rate: ₹75,000 / sq.yd',
    nearestMetroLines: ['Blue'],
    popularSocieties: ['Sobha City', 'Tata La Vida', 'Hero Homes', 'Godrej Meridien'],
    highlights: ['Direct signal-free 8-lane corridor to IGI Airport & Delhi', 'Rapid capital appreciation'],
    lat: 28.4892,
    lng: 76.9928,
  },

  // Noida & Greater Noida
  {
    name: 'Sector 62 & IT Corridor',
    region: 'Noida',
    avgBuyRateSqFt: 9800,
    avgRent2Bhk: 28000,
    circleRateCategory: 'Circle Rate: ₹65,000 / sq.m',
    nearestMetroLines: ['Blue'],
    popularSocieties: ['Designers Park', 'Sharada Apartment', 'Gail Vihar', 'Vinayak Apartment'],
    highlights: ['Blue Line Metro terminal', 'Fortis Hospital Noida', 'Massive IT park cluster'],
    lat: 28.6258,
    lng: 77.3649,
  },
  {
    name: 'Sector 74-78 (Heart of Central Noida)',
    region: 'Noida',
    avgBuyRateSqFt: 10500,
    avgRent2Bhk: 32000,
    circleRateCategory: 'Circle Rate: ₹72,000 / sq.m',
    nearestMetroLines: ['Aqua', 'Blue'],
    popularSocieties: ['Mahagun Moderne', 'Supertech Capetown', 'Apex Golf Avenue', 'Antriksh Golf City'],
    highlights: ['Sector 76 Metro Station', 'Fully developed sector markets', 'Top CBSE schools'],
    lat: 28.5726,
    lng: 77.3879,
  },
  {
    name: 'Noida Expressway (Sector 128-150)',
    region: 'Noida',
    avgBuyRateSqFt: 12500,
    avgRent2Bhk: 36000,
    circleRateCategory: 'Circle Rate: ₹85,000 / sq.m',
    nearestMetroLines: ['Aqua'],
    popularSocieties: ['Jaypee Greens Pavilion Court', 'ATS Greens Hamlet', 'Tata Eureka Park', 'Godrej Palm Retreat'],
    highlights: ['Greenest sector in NCR (80% green)', 'Shaheed Bhagat Singh Park', 'Quick connectivity to Jewar Airport'],
    lat: 28.5118,
    lng: 77.4121,
  },

  // Dwarka & West Delhi
  {
    name: 'Dwarka Sector 6, 10 & 12',
    region: 'Dwarka',
    avgBuyRateSqFt: 13800,
    avgRent2Bhk: 30000,
    circleRateCategory: 'Category C (₹1,59,840 / sq.m)',
    nearestMetroLines: ['Blue', 'Magenta'],
    popularSocieties: ['DDA SFS Flats', 'Nav Sanjivan CGHS', 'Shri Radhika CGHS', 'Sector 10 DDA'],
    highlights: ['Asia largest planned sub-city', 'Wide grid roads & DDA sports complexes', 'Blue Line express access'],
    lat: 28.5921,
    lng: 77.0460,
  },

  // Ghaziabad
  {
    name: 'Indirapuram (Ahinsa Khand & Vaibhav Khand)',
    region: 'Ghaziabad',
    avgBuyRateSqFt: 8200,
    avgRent2Bhk: 24000,
    circleRateCategory: 'Circle Rate: ₹58,000 / sq.m',
    nearestMetroLines: ['Blue', 'Red'],
    popularSocieties: ['ATS Advantage', 'Shipra Sun City', 'Gaur Green City', 'Express Garden'],
    highlights: ['10 mins to East Delhi / Anand Vihar RRTS', 'Shipra Mall & Swarna Jayanti Park', 'Established gated townships'],
    lat: 28.6415,
    lng: 77.3712,
  },
];

export const DELHI_METRO_LINES = [
  { name: 'Yellow Line', code: 'Yellow', color: '#eab308', corridor: 'Samaypur Badli ↔ Millennium City Centre Gurugram' },
  { name: 'Blue Line', code: 'Blue', color: '#2563eb', corridor: 'Dwarka Sector 21 ↔ Noida Electronic City / Vaishali' },
  { name: 'Magenta Line', code: 'Magenta', color: '#c026d3', corridor: 'Janakpuri West ↔ Botanical Garden Noida (via IGI Airport)' },
  { name: 'Violet Line', code: 'Violet', color: '#7c3aed', corridor: 'Kashmere Gate ↔ Raja Nahar Singh Ballabhgarh (Faridabad)' },
  { name: 'Rapid Metro', code: 'Rapid Metro', color: '#ea580c', corridor: 'Sector 55-56 Gurugram ↔ Cyber City Loop' },
  { name: 'Aqua Line', code: 'Aqua', color: '#06b6d4', corridor: 'Noida Sector 51 ↔ Depot Greater Noida' },
] as const;
