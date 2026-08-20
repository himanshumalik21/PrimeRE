import React from 'react';
import { useProperties } from '../../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { MapView } from './MapView';
import { Building2, RotateCcw } from 'lucide-react';

export const PropertyExplorer: React.FC = () => {
  const { filteredProperties, filters, resetFilters, viewMode } = useProperties();

  return (
    <section id="search-results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              {filters.region === 'All Delhi/NCR' ? 'Verified Homes in Delhi/NCR' : `Homes in ${filters.region}`}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
              {filteredProperties.length} Available
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero brokerage listings, direct verified owners & RERA registered projects
          </p>
        </div>

        {/* Active filter badges indicator */}
        {filters.searchQuery && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
            <span>Query: "{filters.searchQuery}"</span>
            <button
              onClick={() => resetFilters()}
              className="text-slate-400 hover:text-slate-700 font-bold"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* No Results State */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No matching properties found</h3>
          <p className="text-xs text-slate-500 mb-6">
            We couldn't find any homes matching your exact filter criteria in {filters.region}. Try widening your budget, BHK, or locality search.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 mx-auto shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Dynamic Views */
        <div>
          {/* 1. Split View (Default Zillow / Redfin UX) */}
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Scrollable Property Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Right: Sticky Interactive Map */}
              <div className="lg:col-span-5 sticky top-36 h-[calc(100vh-160px)] min-h-[500px] hidden lg:block">
                <MapView />
              </div>
            </div>
          )}

          {/* 2. Grid Cards Only */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* 3. Map Only View */}
          {viewMode === 'map' && (
            <div className="h-[calc(100vh-200px)] min-h-[580px] w-full">
              <MapView />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
