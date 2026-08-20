import React from 'react';
import { Heart, Scale, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';
import { PropertyCard } from '../search/PropertyCard';

export const SavedPropertiesView: React.FC = () => {
  const { user } = useAuth();
  const { properties, setActiveNavTab, setIsCompareModalOpen } = useProperties();

  const savedProperties = properties.filter(p => user.savedPropertyIds.includes(p.id));

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Your Saved Properties
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                {savedProperties.length} Saved
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct owner homes you have shortlisted for site visits and negotiations.
            </p>
          </div>
        </div>

        {savedProperties.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Selected</span>
            </button>
            <button
              onClick={() => setActiveNavTab('explore')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>Explore More Homes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No saved properties yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When browsing Delhi/NCR apartments, builder floors, or roommate rooms, tap the heart icon on any listing to bookmark it here for quick review.
            </p>
          </div>
          <button
            onClick={() => setActiveNavTab('explore')}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition inline-flex items-center gap-2 shadow-md"
          >
            <span>Start Exploring Homes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Saved Properties Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
};
