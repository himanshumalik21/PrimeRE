import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Database,
  ShieldCheck
} from 'lucide-react';
import { useFeed } from '../../context/FeedContext';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';

export const Footer: React.FC = () => {
  const { executePromptSearch, setIsCreatePostOpen } = useFeed();
  const { isAuthenticated, setIsAuthModalOpen } = useAuth();
  const { setFilters, setActiveNavTab, setIsPostModalOpen } = useProperties();

  const handleLocalityClick = (localityName: string) => {
    setFilters(prev => ({ ...prev, searchQuery: localityName }));
    setActiveNavTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedLocalityClick = (localityName: string) => {
    executePromptSearch(`Rooms in ${localityName}`);
    setActiveNavTab('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = () => {
    if (!isAuthenticated) setIsAuthModalOpen(true);
    else setIsPostModalOpen(true);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-white font-display">ekThikana</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    NCR
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Verified Rentals & Roommates</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              ekThikana is Delhi/NCR’s independent residential roommate & rental discovery platform. Zero brokerage, authenticated phone signups, and open-source database architecture.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-800 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                0% Brokerage Direct
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-sky-400 border border-slate-800 text-[11px] font-semibold">
                <Database className="w-3 h-3 text-sky-400" />
                Open-Source IndexedDB
              </span>
            </div>
          </div>

          {/* Quick Micro-Markets */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Gurugram Hotspots
            </h4>
            <ul className="space-y-2">
              {[
                'DLF Phase 3 (U Block)',
                'DLF Phase 2 (Cyber Hub)',
                'Sector 24 (Cyber Park)',
                'DLF Phase 1 / MG Road',
                'Golf Course Road (DLF 5)',
                'Sector 56 / Golf Course Ext',
              ].map(loc => (
                <li key={loc}>
                  <button
                    onClick={() => handleLocalityClick(loc)}
                    className="hover:text-emerald-400 transition flex items-center gap-1 text-left"
                  >
                    <span>{loc}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* South Delhi & Noida */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Delhi & Noida Hubs
            </h4>
            <ul className="space-y-2">
              {[
                'Hauz Khas & Green Park',
                'Greater Kailash 1 & 2',
                'Vasant Kunj & Aerocity',
                'Sector 62 (Noida IT Corridor)',
                'Dwarka Sector 12',
              ].map(loc => (
                <li key={loc}>
                  <button
                    onClick={() => handleLocalityClick(loc)}
                    className="hover:text-emerald-400 transition flex items-center gap-1 text-left"
                  >
                    <span>{loc}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Post */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Community Access
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handlePostClick}
                  className="hover:text-emerald-400 transition text-left text-emerald-400 font-semibold"
                >
                  Post Room / Requirement (FREE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hover:text-emerald-400 transition text-left"
                >
                  Phone OTP Sign In / Sign Up
                </button>
              </li>
              <li>
                <span className="text-slate-500">DLF Cyber City Radar</span>
              </li>
              <li>
                <span className="text-slate-500">Zero Brokerage Guarantee</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ekThikana. All rights reserved. 100% Owned & Created for Delhi/NCR.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">Zero Brokerage Pledge</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
