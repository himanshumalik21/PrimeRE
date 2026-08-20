import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Train, 
  BadgePercent, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { DELHI_NCR_LOCALITIES } from '../../data/delhiNcrLocalities';
import type { ListingType } from '../../types/property';

export const HeroSearch: React.FC = () => {
  const { filters, setFilters, setActiveListingTypeTab, setIsInsightsModalOpen } = useProperties();
  const [queryInput, setQueryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularHotspots = [
    { label: 'Golf Course Rd, Gurgaon', query: 'Golf Course Road' },
    { label: 'Hauz Khas, South Delhi', query: 'Hauz Khas' },
    { label: 'DLF Cyber City', query: 'DLF Cyber City' },
    { label: 'Central Noida (Sec 74-78)', query: 'Sector 74-78' },
    { label: 'GK 1 & 2', query: 'Greater Kailash' },
    { label: 'Dwarka Sector 12', query: 'Dwarka' },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery: queryInput }));
    setShowSuggestions(false);

    // Scroll smoothly to results
    const resultsElement = document.getElementById('search-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHotspot = (q: string) => {
    setQueryInput(q);
    setFilters(prev => ({ ...prev, searchQuery: q }));
    setShowSuggestions(false);
    const resultsElement = document.getElementById('search-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredLocalities = queryInput.trim()
    ? DELHI_NCR_LOCALITIES.filter(
        loc =>
          loc.name.toLowerCase().includes(queryInput.toLowerCase()) ||
          loc.region.toLowerCase().includes(queryInput.toLowerCase()) ||
          loc.popularSocieties.some(s => s.toLowerCase().includes(queryInput.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white text-slate-900 pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-300/25 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-teal-100/40 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-emerald-200/80 text-xs text-emerald-800 font-bold mb-4 shadow-subtle backdrop-blur-md animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Delhi/NCR’s Most Transparent Real Estate Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-700">0% Brokerage Direct</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-display mb-3 sm:mb-4">
          Find Your Next Address in <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
            Delhi, Gurugram & Noida
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-normal mb-8 sm:mb-9 leading-relaxed">
          Direct verified owner listings, luxury high-rises, builder floors & gated societies. 
          Zero brokerage, exact Metro walking distances, and encrypted in-app negotiations.
        </p>

        {/* Search Box Container */}
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-xl p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-card hover:shadow-card-hover border border-slate-200/90 text-slate-900 transition-all">
          {/* Listing Type Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5 px-2">
            <div className="flex items-center gap-1.5">
              {(['buy', 'rent', 'pg'] as ListingType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveListingTypeTab(tab)}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all capitalize ${
                    filters.listingType === tab
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'buy' ? 'Buy Property' : tab === 'rent' ? 'Rent Flat' : 'PG / Co-living'}
                </button>
              ))}
            </div>

            {/* Quick Market Intelligence CTA */}
            <button
              onClick={() => setIsInsightsModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-xl transition border border-emerald-200/60"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Circle Rates & Market Rates</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={queryInput}
                onChange={e => {
                  setQueryInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by Locality, Society, Metro Station, or Sub-city..."
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 border border-transparent focus:border-brand-500 font-medium transition"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Homes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredLocalities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-left animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Matching Delhi/NCR Localities
                </div>
                {filteredLocalities.map(loc => (
                  <div
                    key={loc.name}
                    onClick={() => handleSelectHotspot(loc.name)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{loc.name}</p>
                        <p className="text-[11px] text-slate-500">{loc.region} • Avg: ₹{loc.avgBuyRateSqFt.toLocaleString('en-IN')}/sq.ft</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      View Properties
                    </span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Quick Hotspot Pills */}
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Hotspots:
          </span>
          {popularHotspots.map(spot => (
            <button
              key={spot.label}
              onClick={() => handleSelectHotspot(spot.query)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-subtle transition font-medium"
            >
              {spot.label}
            </button>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-subtle backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <BadgePercent className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">0% Brokerage</p>
            <p className="text-[11px] text-slate-500">Save lakhs on buyer & tenant commissions.</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-subtle backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">100% Verified Owners</p>
            <p className="text-[11px] text-slate-500">RERA verified & ownership title checked.</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-subtle backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <Train className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Metro Proximity Score</p>
            <p className="text-[11px] text-slate-500">Exact walking meters to Yellow, Blue & Magenta lines.</p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-subtle backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">Encrypted Direct Chat</p>
            <p className="text-[11px] text-slate-500">Connect securely without spam calls.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
