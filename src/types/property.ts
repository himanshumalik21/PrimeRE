export type DelhiNcrRegion = 
  | 'South Delhi'
  | 'Central Delhi'
  | 'Dwarka'
  | 'West Delhi'
  | 'North Delhi'
  | 'East Delhi'
  | 'Gurugram'
  | 'Noida'
  | 'Greater Noida'
  | 'Ghaziabad'
  | 'Faridabad';

export type ListingType = 'buy' | 'rent' | 'pg';

export type PropertyCategory = 
  | 'Apartment / High-rise'
  | 'Builder Floor'
  | 'Independent House'
  | 'Luxury Villa'
  | 'Penthouse'
  | 'Studio / 1 RK';

export type FurnishingStatus = 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';

export type FacingDirection = 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';

export type MetroLineColor = 
  | 'Yellow' 
  | 'Blue' 
  | 'Magenta' 
  | 'Violet' 
  | 'Pink' 
  | 'Red' 
  | 'Aqua' 
  | 'Rapid Metro';

export interface MetroConnectivity {
  stationName: string;
  line: MetroLineColor;
  distanceMeters: number;
  walkingTimeMins: number;
}

export interface OwnerProfile {
  id: string;
  name: string;
  role: 'Owner' | 'Direct Landlord' | 'Verified Roommate' | 'Working Professional';
  phoneMasked: string;
  phoneFull: string;
  email: string;
  avatar: string;
  responseRate: string;
  responseTime: string;
  isVerified: boolean;
  memberSince: string;
  listingsCount: number;
}

export type RentalCategory = 
  | 'Shared Room with Roommate'
  | 'Private Room (Roommate Needed)'
  | 'Private 1 BHK'
  | 'Private 2 BHK'
  | 'Private 3 BHK'
  | 'Studio / 1 RK';

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLikedByMe: boolean;
  isAuthorReply?: boolean;
}

export interface LandmarkDistanceInfo {
  landmarkName: string;
  distanceKm: number;
  drivingMins: number;
  walkingMins: number;
}

export interface Property {
  id: string;
  title: string;
  listingType: ListingType;
  category: PropertyCategory;
  priceRaw: number;
  priceDisplay: string;
  pricePerSqFt?: number;
  maintenanceMonthly?: number;
  securityDeposit?: number;
  isNegotiable: boolean;
  bhk: number;
  bathrooms: number;
  balconies: number;
  carpetAreaSqFt: number;
  superAreaSqFt: number;
  furnishing: FurnishingStatus;
  floor: number;
  totalFloors: number;
  facing: FacingDirection;
  ageOfPropertyYears: number;
  vastuCompliant: boolean;
  gatedSecurity: boolean;
  powerBackup: boolean;
  parkingSpaces: number;
  evCharging: boolean;
  petFriendly: boolean;
  amenities: string[];
  societyName?: string;
  locality: string;
  region: DelhiNcrRegion;
  addressSnippet: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearestMetro: MetroConnectivity;
  reraId?: string;
  isZeroBrokerage: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  isReadyToMove: boolean;
  images: string[];
  description: string;
  owner: OwnerProfile;
  viewsCount?: number;
  savesCount?: number;
  postedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  listingType: ListingType;
  region: string;
  bhk?: number[];
  bhks: number[];
  priceRange?: [number, number];
  minPrice: number;
  maxPrice: number;
  categories: PropertyCategory[];
  furnishing?: FurnishingStatus[];
  furnishings: FurnishingStatus[];
  onlyZeroBrokerage: boolean;
  onlyVerified: boolean;
  onlyNearMetro: boolean;
  onlyVastuCompliant?: boolean;
  vastuOnly?: boolean;
  onlyReadyToMove?: boolean;
  onlyGatedSecurity?: boolean;
  gatedOnly?: boolean;
  maxMetroDistance?: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'metro-proximity' | 'area-desc' | 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'area_desc' | 'metro_proximity';
}

export interface CommunityRentalPost {
  id: string;
  title: string;
  postText: string;
  author: OwnerProfile;
  createdAt: string;
  images: string[];
  rentalCategory: RentalCategory;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceMonthly?: number;
  isZeroBrokerage: boolean;
  isNegotiable: boolean;
  bhk: number;
  bathrooms: number;
  furnishing: FurnishingStatus;
  floor?: number;
  totalFloors?: number;
  locality: string;
  region: DelhiNcrRegion;
  addressSnippet: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  landmarkDistances: Record<string, LandmarkDistanceInfo>;
  nearestMetro: MetroConnectivity;
  roommatePreferences?: {
    gender: 'Female' | 'Male' | 'Any';
    occupancy: 'Single Room' | 'Shared Room (2 People)' | 'Entire Flat';
    dietary?: 'Vegetarian' | 'Non-Veg Friendly' | 'No Restrictions';
    petFriendly: boolean;
    smoking: boolean;
    workIndustry?: string;
  };
  amenities: string[];
  likesCount: number;
  isLikedByMe: boolean;
  comments: PostComment[];
  viewsCount: number;
  savesCount: number;
}

export interface AIQueryAnalysis {
  rawQuery: string;
  targetLandmark: {
    key: string;
    name: string;
    lat: number;
    lng: number;
  } | null;
  maxDistanceKm: number | null;
  isRoommateSearch: boolean;
  preferredCategory: RentalCategory | null;
  maxBudget: number | null;
  genderPreference: 'Female' | 'Male' | 'Any' | null;
  petFriendlyRequired: boolean;
  metroProximityRequired: boolean;
  detectedKeywords: string[];
  aiExplanation: string;
  matchedPostsCount: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isMe: boolean;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
  offer?: {
    amount: number;
    status: 'pending' | 'accepted' | 'declined';
  };
  visit?: {
    date: string;
    timeSlot: string;
    type: 'Physical Visit' | 'Video Tour';
    status: 'confirmed' | 'pending';
  };
}

export interface ChatThread {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: string;
  propertyImage: string;
  propertyLocality: string;
  participant: OwnerProfile;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageAt: string;
  encryptionFingerprint: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'Working Professional' | 'Direct Landlord' | 'Verified Roommate' | 'Owner';
  profession?: string;
  workplace?: string;
  isPhoneVerified: boolean;
  savedPropertyIds: string[];
  comparedPropertyIds: string[];
  myListingsCount: number;
}
