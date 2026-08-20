import type { CommunityRentalPost, AIQueryAnalysis, LandmarkDistanceInfo } from '../types/property';

export interface LandmarkNode {
  key: string;
  name: string;
  aliases: string[];
  lat: number;
  lng: number;
  region: string;
}

export const DELHI_NCR_LANDMARKS: Record<string, LandmarkNode> = {
  cyberCity: {
    key: 'cyberCity',
    name: 'DLF Cyber City / Cyber Hub',
    aliases: ['dlf cyber city', 'cyber city', 'cybercity', 'cyber hub', 'cyberhub', 'dlf cyber park', 'rapid metro cyber city'],
    lat: 28.4950,
    lng: 77.0895,
    region: 'Gurugram',
  },
  golfCourseRd: {
    key: 'golfCourseRd',
    name: 'Golf Course Road / One Horizon Center',
    aliases: ['golf course road', 'golf course rd', 'one horizon center', 'dlf 5', 'the crest', 'sector 53 54'],
    lat: 28.4600,
    lng: 77.0990,
    region: 'Gurugram',
  },
  cyberPark: {
    key: 'cyberPark',
    name: 'DLF Cyber Park / Udyog Vihar',
    aliases: ['dlf cyber park', 'cyber park', 'udyog vihar', 'ambience mall gurgaon'],
    lat: 28.5020,
    lng: 77.0810,
    region: 'Gurugram',
  },
  golfCourseExt: {
    key: 'golfCourseExt',
    name: 'Golf Course Extension & Sec 56',
    aliases: ['golf course ext', 'golf course extension', 'sector 56', 'sector 57', 'm3m golfestate'],
    lat: 28.4112,
    lng: 77.0782,
    region: 'Gurugram',
  },
  hauzKhas: {
    key: 'hauzKhas',
    name: 'Hauz Khas & Green Park',
    aliases: ['hauz khas', 'hauz khas metro', 'green park', 'south delhi', 'iit delhi', 'deer park'],
    lat: 28.5494,
    lng: 77.2001,
    region: 'South Delhi',
  },
  vasantKunj: {
    key: 'vasantKunj',
    name: 'Vasant Kunj & Aerocity',
    aliases: ['vasant kunj', 'aerocity', 'igi airport', 'ambience mall vasant kunj'],
    lat: 28.5293,
    lng: 77.1539,
    region: 'South Delhi',
  },
  noidaSec62: {
    key: 'noidaSec62',
    name: 'Sector 62 IT Hub & Electronic City',
    aliases: ['sector 62', 'sec 62', 'noida sector 62', 'noida electronic city', 'fortis noida'],
    lat: 28.6258,
    lng: 77.3649,
    region: 'Noida',
  },
  dwarka: {
    key: 'dwarka',
    name: 'Dwarka Sector 10 & 12',
    aliases: ['dwarka', 'dwarka sector 12', 'dwarka sector 10', 'dwarka sector 21'],
    lat: 28.5921,
    lng: 77.0460,
    region: 'Dwarka',
  },
  connaughtPlace: {
    key: 'connaughtPlace',
    name: 'Connaught Place / Central Delhi',
    aliases: ['connaught place', 'cp', 'rajiv chowk', 'barakhamba'],
    lat: 28.6315,
    lng: 77.2167,
    region: 'Central Delhi',
  },
};

// Calculate Haversine Distance in Kilometers
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
};

// Generate Landmark distance breakdown for coordinates
export const getLandmarkDistancesForCoords = (
  lat: number,
  lng: number
): Record<string, LandmarkDistanceInfo> => {
  const result: Record<string, LandmarkDistanceInfo> = {};

  for (const [key, landmark] of Object.entries(DELHI_NCR_LANDMARKS)) {
    const distKm = calculateDistanceKm(lat, lng, landmark.lat, landmark.lng);
    result[key] = {
      landmarkName: landmark.name,
      distanceKm: distKm,
      drivingMins: Math.max(3, Math.round(distKm * 2.8)),
      walkingMins: Math.round(distKm * 13),
    };
  }

  return result;
};

// AI Natural Language Parser
export const parseAIQuery = (
  query: string,
  allPosts: CommunityRentalPost[]
): {
  analysis: AIQueryAnalysis;
  filteredPosts: CommunityRentalPost[];
} => {
  const lower = query.toLowerCase().trim();
  const detectedKeywords: string[] = [];

  if (!lower) {
    return {
      analysis: {
        rawQuery: '',
        targetLandmark: null,
        maxDistanceKm: null,
        isRoommateSearch: false,
        preferredCategory: null,
        maxBudget: null,
        genderPreference: null,
        petFriendlyRequired: false,
        metroProximityRequired: false,
        detectedKeywords: [],
        aiExplanation: 'Showing all active verified community rental and roommate listings across Delhi/NCR.',
        matchedPostsCount: allPosts.length,
      },
      filteredPosts: allPosts,
    };
  }

  // 1. Detect Target Landmark / Office
  let detectedLandmark: LandmarkNode | null = null;
  for (const landmark of Object.values(DELHI_NCR_LANDMARKS)) {
    if (landmark.aliases.some(alias => lower.includes(alias))) {
      detectedLandmark = landmark;
      detectedKeywords.push(`Landmark: ${landmark.name}`);
      break;
    }
  }

  // Default to Cyber City if "cyber" or "office in gurgaon" mentioned
  if (!detectedLandmark && (lower.includes('cyber') || lower.includes('gurgaon office') || lower.includes('office'))) {
    detectedLandmark = DELHI_NCR_LANDMARKS.cyberCity;
    detectedKeywords.push(`Workplace: DLF Cyber City (Default)`);
  }

  // 2. Detect Distance Radius (e.g. "within 5 km", "under 3km", "within 10km", "5 km radius")
  let maxDistanceKm: number | null = null;
  const distanceMatch = lower.match(/(?:within|under|less than|around|radius of|max)\s*(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers|kilometer)/i) ||
                        lower.match(/(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers|kilometer)\s*(?:from|away|radius|distance)/i);
  if (distanceMatch) {
    maxDistanceKm = parseFloat(distanceMatch[1]);
    detectedKeywords.push(`Radius: ≤ ${maxDistanceKm} km`);
  } else if (detectedLandmark) {
    maxDistanceKm = 6;
    detectedKeywords.push(`Radius: ≤ 6 km (Default)`);
  }

  // 3. Detect Roommate / Sharing Intent
  const isRoommateSearch = 
    lower.includes('room mate') ||
    lower.includes('roommate') ||
    lower.includes('room-mate') ||
    lower.includes('share') ||
    lower.includes('sharing') ||
    lower.includes('room in') ||
    lower.includes('pre-occupied') ||
    lower.includes('single room') ||
    lower.includes('room mate needed');

  if (isRoommateSearch) {
    detectedKeywords.push('Preference: Roommate / Shared Flat');
  }

  // 4. Detect Preferred Category / BHK
  let preferredCategory: any = null;
  if (lower.includes('1 bhk') || lower.includes('1bhk') || lower.includes('1 bedroom') || lower.includes('1-bedroom') || lower.includes('one bedroom')) {
    preferredCategory = isRoommateSearch ? 'Shared Room with Roommate' : 'Private 1 BHK';
    detectedKeywords.push('Configuration: 1 Bedroom / 1 BHK');
  } else if (lower.includes('2 bhk') || lower.includes('2bhk') || lower.includes('2 bedroom')) {
    preferredCategory = 'Private 2 BHK';
    detectedKeywords.push('Configuration: 2 BHK');
  } else if (lower.includes('3 bhk') || lower.includes('3bhk')) {
    preferredCategory = 'Private 3 BHK';
    detectedKeywords.push('Configuration: 3 BHK');
  } else if (lower.includes('studio') || lower.includes('1rk') || lower.includes('1 rk')) {
    preferredCategory = 'Studio / 1 RK';
    detectedKeywords.push('Configuration: Studio / 1 RK');
  }

  // 5. Detect Budget
  let maxBudget: number | null = null;
  const budgetMatch = lower.match(/(?:under|below|less than|budget of|within|max)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:k|,000)?/i);
  if (budgetMatch) {
    const rawNum = parseInt(budgetMatch[1]);
    maxBudget = rawNum < 100 ? rawNum * 1000 : rawNum;
    detectedKeywords.push(`Budget: ≤ ₹${maxBudget.toLocaleString('en-IN')}/mo`);
  }

  // 6. Detect Gender Preference
  let genderPreference: 'Female' | 'Male' | 'Any' | null = null;
  if (lower.includes('female') || lower.includes('girl') || lower.includes('woman') || lower.includes('women') || lower.includes('lady')) {
    genderPreference = 'Female';
    detectedKeywords.push('Roommate Gender: Female');
  } else if (lower.includes('male') || lower.includes('boy') || lower.includes('guy') || lower.includes('men') || lower.includes('gentleman')) {
    genderPreference = 'Male';
    detectedKeywords.push('Roommate Gender: Male');
  }

  // 7. Detect Amenities & Pet Friendliness
  const petFriendlyRequired = lower.includes('pet') || lower.includes('dog') || lower.includes('cat');
  if (petFriendlyRequired) detectedKeywords.push('Pet Friendly');

  const metroProximityRequired = lower.includes('metro') || lower.includes('near station') || lower.includes('walking distance');
  if (metroProximityRequired) detectedKeywords.push('Near Metro');

  // Filter and Rank Posts
  const filteredPosts = allPosts.filter(post => {
    // Distance filter
    if (detectedLandmark && maxDistanceKm !== null) {
      const dist = calculateDistanceKm(
        post.coordinates.lat,
        post.coordinates.lng,
        detectedLandmark.lat,
        detectedLandmark.lng
      );
      if (dist > maxDistanceKm) return false;
    }

    // Roommate search filter
    if (isRoommateSearch) {
      const isPostRoommate = 
        post.rentalCategory === 'Shared Room with Roommate' ||
        post.rentalCategory === 'Private Room (Roommate Needed)' ||
        post.bhk >= 1;
      if (!isPostRoommate) return false;
    }

    // Budget filter
    if (maxBudget !== null && post.monthlyRent > maxBudget) {
      return false;
    }

    // Gender filter
    if (genderPreference && post.roommatePreferences) {
      if (post.roommatePreferences.gender !== 'Any' && post.roommatePreferences.gender !== genderPreference) {
        return false;
      }
    }

    // Pet friendly filter
    if (petFriendlyRequired && post.roommatePreferences && !post.roommatePreferences.petFriendly) {
      return false;
    }

    // Metro filter
    if (metroProximityRequired && post.nearestMetro.distanceMeters > 1000) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (detectedLandmark) {
      const distA = calculateDistanceKm(a.coordinates.lat, a.coordinates.lng, detectedLandmark.lat, detectedLandmark.lng);
      const distB = calculateDistanceKm(b.coordinates.lat, b.coordinates.lng, detectedLandmark.lat, detectedLandmark.lng);
      return distA - distB;
    }
    return b.likesCount - a.likesCount;
  });

  // Generate Natural Language AI Explanation
  let aiExplanation = '';
  if (detectedLandmark) {
    const distText = maxDistanceKm ? `within ${maxDistanceKm} km` : '';
    const roomText = isRoommateSearch ? 'roommate & shared 1-bedroom / private room' : 'rental';
    aiExplanation = `🎯 AI found ${filteredPosts.length} verified ${roomText} listings ${distText} from ${detectedLandmark.name}. Ranked by proximity and zero brokerage.`;
  } else {
    aiExplanation = `🔍 AI matched ${filteredPosts.length} listings based on your prompt criteria.`;
  }

  const analysis: AIQueryAnalysis = {
    rawQuery: query,
    targetLandmark: detectedLandmark,
    maxDistanceKm,
    isRoommateSearch,
    preferredCategory,
    maxBudget,
    genderPreference,
    petFriendlyRequired,
    metroProximityRequired,
    detectedKeywords,
    aiExplanation,
    matchedPostsCount: filteredPosts.length,
  };

  return { analysis, filteredPosts };
};
