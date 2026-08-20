import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  CommunityRentalPost, 
  AIQueryAnalysis, 
  PostComment 
} from '../types/property';
import { INITIAL_COMMUNITY_POSTS } from '../data/communityPosts';
import { parseAIQuery } from '../services/aiQueryEngine';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';

export type CategoryFilterType = 
  | 'All'
  | 'Roommates Needed'
  | '1 BHK / Studio'
  | 'Under ₹20k'
  | 'Female Roommates'
  | 'Near Cyber City (<3km)';

interface FeedContextType {
  posts: CommunityRentalPost[];
  filteredPosts: CommunityRentalPost[];
  aiAnalysis: AIQueryAnalysis | null;
  promptQuery: string;
  setPromptQuery: (q: string) => void;
  executePromptSearch: (q: string) => void;
  clearPromptSearch: () => void;
  activeCategoryFilter: CategoryFilterType;
  setActiveCategoryFilter: (cat: CategoryFilterType) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  createPost: (postData: Partial<CommunityRentalPost>) => CommunityRentalPost;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  selectedPostDetail: CommunityRentalPost | null;
  setSelectedPostDetail: (post: CommunityRentalPost | null) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<CommunityRentalPost[]>(() => {
    const saved = localStorage.getItem('ekthikana_community_feed_posts');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  const [promptQuery, setPromptQuery] = useState<string>('I am looking for a 1 bedroom house to share with room mate within 5 km from my office located in dlf cyber city');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryFilterType>('All');
  
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<CommunityRentalPost | null>(null);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('ekthikana_community_feed_posts', JSON.stringify(posts));
  }, [posts]);

  // Execute AI NLP query on posts
  const { analysis: aiAnalysis, filteredPosts: aiFilteredPosts } = useMemo(() => {
    return parseAIQuery(promptQuery, posts);
  }, [promptQuery, posts]);

  // Apply secondary category pill filtering
  const filteredPosts = useMemo(() => {
    let result = aiFilteredPosts;

    if (activeCategoryFilter === 'Roommates Needed') {
      result = result.filter(
        p => p.rentalCategory === 'Shared Room with Roommate' || p.rentalCategory === 'Private Room (Roommate Needed)'
      );
    } else if (activeCategoryFilter === '1 BHK / Studio') {
      result = result.filter(
        p => p.rentalCategory === 'Private 1 BHK' || p.rentalCategory === 'Studio / 1 RK'
      );
    } else if (activeCategoryFilter === 'Under ₹20k') {
      result = result.filter(
        p => p.monthlyRent <= 20000
      );
    } else if (activeCategoryFilter === 'Female Roommates') {
      result = result.filter(
        p => p.roommatePreferences && p.roommatePreferences.gender === 'Female'
      );
    } else if (activeCategoryFilter === 'Near Cyber City (<3km)') {
      result = result.filter(
        p => p.landmarkDistances.cyberCity && p.landmarkDistances.cyberCity.distanceKm <= 3.0
      );
    }

    return result;
  }, [aiFilteredPosts, activeCategoryFilter]);

  const executePromptSearch = (q: string) => {
    setPromptQuery(q);
    setActiveCategoryFilter('All');
  };

  const clearPromptSearch = () => {
    setPromptQuery('');
    setActiveCategoryFilter('All');
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByMe;
          return {
            ...p,
            isLikedByMe: isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
      isLikedByMe: false,
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    // Contextual simulated reply from author after 1.8s
    setTimeout(() => {
      simulateAuthorCommentReply(postId, text);
    }, 1800);
  };

  const simulateAuthorCommentReply = (postId: string, userComment: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    let replyText = `Thanks for your interest! The room is in great condition. Send me a direct message to coordinate a walkthrough!`;
    const lower = userComment.toLowerCase();

    if (lower.includes('available') || lower.includes('vacant')) {
      replyText = `Yes! It is available for immediate move-in or from next week.`;
    } else if (lower.includes('bills') || lower.includes('cook') || lower.includes('maid') || lower.includes('maintenance')) {
      replyText = `Cook and daily maid are shared equally (~₹2,000/mo). Fiber WiFi is active!`;
    } else if (lower.includes('washroom') || lower.includes('bathroom')) {
      replyText = `Yes, this room has an attached private washroom with 24/7 geyser.`;
    } else if (lower.includes('visit') || lower.includes('see') || lower.includes('walkthrough')) {
      replyText = `You are welcome to visit this evening between 6 PM to 9 PM. Send me a message for exact tower address!`;
    }

    const authorReply: PostComment = {
      id: `reply-${Date.now()}`,
      authorId: post.author.id,
      authorName: `${post.author.name} (Author)`,
      authorAvatar: post.author.avatar,
      text: replyText,
      timestamp: 'Just now',
      likesCount: 2,
      isLikedByMe: false,
      isAuthorReply: true,
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, authorReply],
          };
        }
        return p;
      })
    );
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id === commentId) {
                const isLiked = !c.isLikedByMe;
                return {
                  ...c,
                  isLikedByMe: isLiked,
                  likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
                };
              }
              return c;
            }),
          };
        }
        return p;
      })
    );
  };

  const createPost = (postData: Partial<CommunityRentalPost>): CommunityRentalPost => {
    const defaultCoords = postData.coordinates || { lat: 28.4985, lng: 77.0940 };
    const newPost: CommunityRentalPost = {
      id: `post-${Date.now()}`,
      title: postData.title || `${postData.rentalCategory || '1 Room'} in ${postData.locality || 'DLF Phase 3'}`,
      postText: postData.postText || 'New rental listing posted on ekThikana feed.',
      author: {
        id: user.id,
        name: user.name,
        role: user.role || 'Working Professional',
        phoneMasked: user.phone ? user.phone.replace(/(\+91 \d{4})\d+/, '$1 XXXXX') : '+91 9810X XXXXX',
        phoneFull: user.phone || '+91 98101 44520',
        email: user.email || 'user@delhincr.in',
        avatar: user.avatar,
        responseRate: '100%',
        responseTime: 'Instant reply',
        isVerified: true,
        memberSince: 'Today',
        listingsCount: user.myListingsCount + 1,
      },
      createdAt: 'Just now',
      images: postData.images && postData.images.length > 0
        ? postData.images
        : [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?auto=format&fit=crop&w=1200&q=80',
          ],
      rentalCategory: postData.rentalCategory || 'Shared Room with Roommate',
      monthlyRent: postData.monthlyRent || 16000,
      securityDeposit: postData.securityDeposit || postData.monthlyRent || 16000,
      maintenanceMonthly: postData.maintenanceMonthly || 1200,
      isZeroBrokerage: true,
      isNegotiable: true,
      bhk: postData.bhk || 1,
      bathrooms: postData.bathrooms || 1,
      furnishing: postData.furnishing || 'Fully Furnished',
      locality: postData.locality || 'DLF Phase 3 (U Block)',
      region: postData.region || 'Gurugram',
      addressSnippet: postData.addressSnippet || `${postData.locality || 'DLF Phase 3'}, Gurugram`,
      pincode: postData.pincode || '122002',
      coordinates: defaultCoords,
      landmarkDistances: (postData.landmarkDistances as any) || {
        cyberCity: { landmarkName: 'DLF Cyber City', distanceKm: 1.4, drivingMins: 4, walkingMins: 16 },
        golfCourseRd: { landmarkName: 'Golf Course Road', distanceKm: 4.8, drivingMins: 12, walkingMins: 55 },
        hauzKhas: { landmarkName: 'Hauz Khas', distanceKm: 14.2, drivingMins: 30, walkingMins: 170 },
        noidaSec62: { landmarkName: 'Noida Sector 62', distanceKm: 29.5, drivingMins: 55, walkingMins: 340 },
      },
      nearestMetro: postData.nearestMetro || {
        stationName: 'Moulsari Avenue Rapid Metro',
        line: 'Rapid Metro',
        distanceMeters: 400,
        walkingTimeMins: 5,
      },
      roommatePreferences: postData.roommatePreferences || {
        gender: 'Any',
        occupancy: 'Single Room',
        dietary: 'No Restrictions',
        petFriendly: true,
        smoking: false,
        workIndustry: 'Corporate / Tech',
      },
      amenities: postData.amenities || [
        'High-Speed 300 Mbps WiFi',
        'Attached Private Washroom',
        '100% Power Backup',
        'Zero Brokerage',
      ],
      likesCount: 1,
      isLikedByMe: false,
      comments: [],
      viewsCount: 1,
      savesCount: 0,
    };

    setPosts(prev => [newPost, ...prev]);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    return newPost;
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        filteredPosts,
        aiAnalysis,
        promptQuery,
        setPromptQuery,
        executePromptSearch,
        clearPromptSearch,
        activeCategoryFilter,
        setActiveCategoryFilter,
        toggleLikePost,
        addComment,
        toggleLikeComment,
        createPost,
        isCreatePostOpen,
        setIsCreatePostOpen,
        selectedPostDetail,
        setSelectedPostDetail,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
