import React from 'react';
import { 
  Sparkles, 
  Users, 
  Home, 
  MapPin, 
  IndianRupee, 
  ChevronRight,
  Navigation
} from 'lucide-react';
import { useFeed } from '../../context/FeedContext';

export const LeftSidebar: React.FC = () => {
  const { 
    executePromptSearch, 
    activeCategoryFilter, 
    setActiveCategoryFilter 
  } = useFeed();

  const curatedSearches = [
    { label: '1 Bed to share with roommate ≤5km from Cyber City', prompt: 'I am looking for a 1 bedroom house to share with room mate within 5 km from my office located in dlf cyber city' },
    { label: 'Female roommate in DLF Phase 3 near Rapid Metro', prompt: 'Female roommate in DLF Phase 3 near Rapid Metro under 18k' },
    { label: 'Independent Studio in Sec 24 under 15k', prompt: 'Modern independent 1 RK studio apartment in Sector 24 under 15k' },
    { label: 'Pet-friendly 2 BHK in DLF Phase 1 / MG Road', prompt: 'Pet-friendly 2 BHK in DLF Phase 1 near MG Road for working bachelors' },
    { label: '1 Room in luxury high-rise on Golf Course Rd', prompt: '1 Room in luxury high-rise on Golf Course Road with pool & gym' },
  ];

  const popularLocalities = [
    { name: 'DLF Phase 3 (Cyber City)', prompt: 'DLF Phase 3 room near Cyber City' },
    { name: 'DLF Phase 2 (Cyber Hub)', prompt: 'DLF Phase 2 roommate near Cyber Hub' },
    { name: 'Golf Course Road (DLF 5)', prompt: 'Golf Course Road luxury high rise roommate' },
    { name: 'Hauz Khas & Green Park', prompt: 'Hauz Khas 1 BHK studio near metro' },
    { name: 'Sector 62 (Noida IT Hub)', prompt: 'Sector 62 Noida room near metro' },
  ];

  return (
    <aside className="space-y-4">
      {/* 1. AI Prompt Shortcuts Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">AI Search Prompts</h4>
            <p className="text-[10px] text-slate-400">One-click AI queries</p>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          {curatedSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => executePromptSearch(item.prompt)}
              className="w-full text-left p-2 rounded-xl text-xs text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200 font-medium transition flex items-center justify-between group"
            >
              <span className="line-clamp-1">{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Roommate & Rental Quick Categories */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
          Quick Filters
        </h4>

        <div className="space-y-1">
          <button
            onClick={() => setActiveCategoryFilter('Roommates Needed')}
            className={`w-full text-left p-2 rounded-xl flex items-center justify-between font-semibold transition ${
              activeCategoryFilter === 'Roommates Needed'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-500" />
              Roommates Needed
            </span>
            <span className="text-[10px] opacity-70">Hot</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Near Cyber City (<3km)')}
            className={`w-full text-left p-2 rounded-xl flex items-center justify-between font-semibold transition ${
              activeCategoryFilter === 'Near Cyber City (<3km)'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Cyber City (≤3 km)
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('1 BHK / Studio')}
            className={`w-full text-left p-2 rounded-xl flex items-center justify-between font-semibold transition ${
              activeCategoryFilter === '1 BHK / Studio'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-500" />
              1 BHK & Studio Flats
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Under ₹20k')}
            className={`w-full text-left p-2 rounded-xl flex items-center justify-between font-semibold transition ${
              activeCategoryFilter === 'Under ₹20k'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-purple-500" />
              Under ₹20,000 / mo
            </span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Female Roommates')}
            className={`w-full text-left p-2 rounded-xl flex items-center justify-between font-semibold transition ${
              activeCategoryFilter === 'Female Roommates'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              Female Roommates
            </span>
          </button>
        </div>
      </div>

      {/* 3. Top Micro-Markets Direct Links */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-brand-600" />
          <span>Top Micro-Markets</span>
        </h4>

        <div className="space-y-1.5">
          {popularLocalities.map((loc, i) => (
            <button
              key={i}
              onClick={() => executePromptSearch(loc.prompt)}
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 text-slate-700 hover:text-emerald-900 font-semibold transition flex items-center justify-between"
            >
              <span>{loc.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
