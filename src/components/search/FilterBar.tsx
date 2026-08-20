import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  MapPin, 
  Train, 
  ShieldCheck, 
  Sparkles, 
  Grid, 
  Columns, 
  Map, 
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import type { DelhiNcrRegion, FurnishingStatus, PropertyCategory } from '../../types/property';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, viewMode, setViewMode } = useProperties();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const ncrRegions: (DelhiNcrRegion | 'All Delhi/NCR')[] = [
    'All Delhi/NCR',
    'South Delhi',
    'Gurugram',
    'Noida',
    'Dwarka',
    'Central Delhi',
    'Greater Noida',
    'Ghaziabad',
    'West Delhi',
    'Faridabad'
  ];

  const bhkOptions = [
    { label: '1 BHK', value: 1 },
    { label: '2 BHK', value: 2 },
    { label: '3 BHK', value: 3 },
    { label: '4+ BHK', value: 4 },
  ];

  const categoryOptions: PropertyCategory[] = [
    'Apartment / High-rise',
    'Builder Floor',
    'Independent House',
    'Luxury Villa',
    'Penthouse',
    'Studio / 1 RK',
  ];

  const furnishingOptions: FurnishingStatus[] = [
    'Fully Furnished',
    'Semi Furnished',
    'Unfurnished',
  ];

  const toggleBhk = (bhk: number) => {
    setFilters(prev => {
      const exists = prev.bhks.includes(bhk);
      return {
        ...prev,
        bhks: exists ? prev.bhks.filter(b => b !== bhk) : [...prev.bhks, bhk],
      };
    });
  };

  const toggleCategory = (cat: PropertyCategory) => {
    setFilters(prev => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat],
      };
    });
  };

  const toggleFurnishing = (fur: FurnishingStatus) => {
    setFilters(prev => {
      const exists = prev.furnishings.includes(fur);
      return {
        ...prev,
        furnishings: exists ? prev.furnishings.filter(f => f !== fur) : [...prev.furnishings, fur],
      };
    });
  };

  // Count active non-default filters
  const activeFiltersCount = 
    (filters.region !== 'All Delhi/NCR' ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    filters.bhks.length +
    filters.categories.length +
    filters.furnishings.length +
    (filters.onlyZeroBrokerage ? 1 : 0) +
    (filters.onlyVerified ? 1 : 0) +
    (filters.onlyReadyToMove ? 1 : 0) +
    (filters.vastuOnly ? 1 : 0) +
    (filters.maxMetroDistance ? 1 : 0);

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-18 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Quick Filters Strip */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            
            {/* Region Selector */}
            <div className="relative">
              <select
                value={filters.region}
                onChange={e => setFilters(prev => ({ ...prev, region: e.target.value as any }))}
                className="appearance-none pl-8 pr-7 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-xs font-bold text-slate-800 border border-slate-200/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {ncrRegions.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-600 pointer-events-none" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* BHK Pills */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
              {bhkOptions.map(bhk => {
                const isSelected = filters.bhks.includes(bhk.value);
                return (
                  <button
                    key={bhk.value}
                    onClick={() => toggleBhk(bhk.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {bhk.label}
                  </button>
                );
              })}
            </div>

            {/* Zero Brokerage Quick Toggle */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, onlyZeroBrokerage: !prev.onlyZeroBrokerage }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                filters.onlyZeroBrokerage
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${filters.onlyZeroBrokerage ? 'text-white' : 'text-emerald-600'}`} />
              <span>0% Brokerage</span>
            </button>

            {/* Verified Only Quick Toggle */}
            <button
              onClick={() => setFilters(prev => ({ ...prev, onlyVerified: !prev.onlyVerified }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border hidden sm:flex ${
                filters.onlyVerified
                  ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${filters.onlyVerified ? 'text-white' : 'text-sky-600'}`} />
              <span>Verified Owner</span>
            </button>

            {/* Near Metro (<800m) Toggle */}
            <button
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  maxMetroDistance: prev.maxMetroDistance ? undefined : 800,
                }))
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border hidden md:flex ${
                filters.maxMetroDistance
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Train className={`w-3.5 h-3.5 ${filters.maxMetroDistance ? 'text-white' : 'text-amber-600'}`} />
              <span>Near Metro (&lt;800m)</span>
            </button>

            {/* More Filters Toggle Button */}
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                isAdvancedOpen || activeFiltersCount > 0
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 bg-brand-500 text-white rounded-full text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Reset Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1 font-medium"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Right: Sort & View Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-xs font-bold text-slate-800 border border-slate-200/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="relevance">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="metro_proximity">Closest to Metro</option>
                <option value="area_desc">Largest Area</option>
                <option value="newest">Most Active</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle (Split / Grid / Map) */}
            <div className="hidden sm:flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Split View (Map + Cards)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Cards Only"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Map Only"
              >
                <Map className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {isAdvancedOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-xs">
            {/* Category / Property Type */}
            <div>
              <p className="font-bold text-slate-700 mb-2">Property Type</p>
              <div className="flex flex-wrap gap-1.5">
                {categoryOptions.map(cat => {
                  const isSelected = filters.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Furnishing Status */}
            <div>
              <p className="font-bold text-slate-700 mb-2">Furnishing Status</p>
              <div className="flex flex-wrap gap-1.5">
                {furnishingOptions.map(fur => {
                  const isSelected = filters.furnishings.includes(fur);
                  return (
                    <button
                      key={fur}
                      onClick={() => toggleFurnishing(fur)}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {fur}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <p className="font-bold text-slate-700 mb-2">Special Requirements</p>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.vastuOnly}
                    onChange={e => setFilters(prev => ({ ...prev, vastuOnly: e.target.checked }))}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>100% Vastu Compliant</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.gatedOnly}
                    onChange={e => setFilters(prev => ({ ...prev, gatedOnly: e.target.checked }))}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Gated Society / 24x7 Security</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={filters.onlyReadyToMove}
                    onChange={e => setFilters(prev => ({ ...prev, onlyReadyToMove: e.target.checked }))}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Ready to Move In</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
