import React from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  BadgePercent 
} from 'lucide-react';
import { useFeed, type CategoryFilterType } from '../../context/FeedContext';
import { useAuth } from '../../context/AuthContext';

export const CommunityHeader: React.FC = () => {
  const { 
    activeCategoryFilter, 
    setActiveCategoryFilter, 
    setIsCreatePostOpen, 
    posts 
  } = useFeed();

  const { isAuthenticated, setIsAuthModalOpen } = useAuth();

  const filterTabs: { id: CategoryFilterType; label: string }[] = [
    { id: 'All', label: 'All Rentals & Rooms' },
    { id: 'Roommates Needed', label: '🤝 Roommates Needed' },
    { id: '1 BHK / Studio', label: '🏠 1 BHK & Studios' },
    { id: 'Near Cyber City (<3km)', label: '📍 Cyber City (≤3 km)' },
    { id: 'Under ₹20k', label: '💰 Under ₹20,000' },
    { id: 'Female Roommates', label: '👩 Female Roommates' },
  ];

  const handlePostClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreatePostOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden mb-5">
      {/* Cover Banner */}
      <div className="relative h-32 sm:h-44 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 sm:p-6 flex flex-col justify-end text-white overflow-hidden">
        {/* Subtle decorative glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                AI-Powered Discovery Stream
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-sky-300 border border-slate-700">
                <BadgePercent className="w-3 h-3 text-sky-400" />
                0% Brokerage Direct
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display">
              Delhi/NCR Roommate & Rental Community
            </h1>

            <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
              <span>Verified Direct Rentals & Roommates</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{posts.length} Active Listings</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePostClick}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Room / Flat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1 shrink-0">
          Feed:
        </span>
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategoryFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
