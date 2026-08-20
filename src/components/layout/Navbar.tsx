import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  MessageSquare, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  Compass,
  Heart,
  Scale,
  TrendingUp,
  Home,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useFeed } from '../../context/FeedContext';
import { useProperties } from '../../context/PropertyContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();
  const { totalUnreadCount, setIsChatOpen } = useChat();
  const { setIsCreatePostOpen } = useFeed();
  const { 
    activeNavTab, 
    setActiveNavTab, 
    setIsPostModalOpen, 
    setIsCompareModalOpen,
    setIsInsightsModalOpen
  } = useProperties();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);

  const handleOpenPostProperty = () => {
    setIsPostMenuOpen(false);
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsPostModalOpen(true);
    }
  };

  const handleOpenPostRoommate = () => {
    setIsPostMenuOpen(false);
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreatePostOpen(true);
      setActiveNavTab('feed');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand & Community Identity */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveNavTab('explore')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/25 group-hover:scale-105 transition">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                    ekThikana
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    NCR
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold -mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-brand-600" />
                  Verified Homes & AI Roommates
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold text-slate-700">
              <button
                onClick={() => setActiveNavTab('explore')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                  activeNavTab === 'explore'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Home className={`w-3.5 h-3.5 ${activeNavTab === 'explore' ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>Explore Homes</span>
              </button>

              <button
                onClick={() => setActiveNavTab('feed')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                  activeNavTab === 'feed'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 ${activeNavTab === 'feed' ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>AI Roommates & Feed</span>
              </button>

              <button
                onClick={() => setActiveNavTab('insights')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                  activeNavTab === 'insights'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <TrendingUp className={`w-3.5 h-3.5 ${activeNavTab === 'insights' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Market Intelligence</span>
              </button>

              <button
                onClick={() => setActiveNavTab('saved')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                  activeNavTab === 'saved'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeNavTab === 'saved' ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                <span>Saved</span>
                {user.savedPropertyIds.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                    {user.savedPropertyIds.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Compare Drawer CTA */}
            {user.comparedPropertyIds.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="relative p-2.5 rounded-xl bg-accent-50 hover:bg-accent-100 text-accent-700 transition border border-accent-200 text-xs font-bold flex items-center gap-1.5"
                title="Compare Properties"
              >
                <Scale className="w-4 h-4 text-accent-600" />
                <span className="hidden sm:inline">Compare</span>
                <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-accent-600 text-white rounded-full">
                  {user.comparedPropertyIds.length}
                </span>
              </button>
            )}

            {/* In-App Encrypted Chat CTA */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Encrypted Messenger"
            >
              <MessageSquare className="w-4 h-4" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-extrabold bg-brand-600 text-white rounded-full ring-2 ring-white">
                  {totalUnreadCount}
                </span>
              )}
            </button>

            {/* Post Listing Split Dropdown CTA */}
            <div className="relative">
              <button
                onClick={() => setIsPostMenuOpen(!isPostMenuOpen)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Listing FREE</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
              </button>

              {/* Post Menu Dropdown */}
              {isPostMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-fade-in space-y-1">
                  <button
                    onClick={handleOpenPostProperty}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-emerald-900">Post Free Property</p>
                      <p className="text-[10px] text-slate-500">Sell or Rent 1-5 BHK Flat / Villa</p>
                    </div>
                  </button>

                  <button
                    onClick={handleOpenPostRoommate}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-emerald-900">Post Roommate / Room</p>
                      <p className="text-[10px] text-slate-500">Share room or flat near workplace</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative pl-1 sm:pl-2 border-l border-slate-200">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                </button>

                {/* Profile Popup Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 z-50 text-xs animate-fade-in">
                    <div className="p-2.5 bg-slate-50 rounded-xl space-y-0.5">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-slate-500">{user.phone}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.workplace || 'Delhi/NCR'}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Account
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveNavTab('saved');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-2 transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Saved Properties ({user.savedPropertyIds.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / OTP</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-100 text-xs font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveNavTab('explore')}
            className={`px-3 py-1 rounded-xl transition ${
              activeNavTab === 'explore' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Explore Homes
          </button>

          <button
            onClick={() => setActiveNavTab('feed')}
            className={`px-3 py-1 rounded-xl transition ${
              activeNavTab === 'feed' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            AI Roommates
          </button>

          <button
            onClick={() => setActiveNavTab('insights')}
            className={`px-3 py-1 rounded-xl transition ${
              activeNavTab === 'insights' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Market Rates
          </button>

          <button
            onClick={() => setActiveNavTab('saved')}
            className={`px-3 py-1 rounded-xl transition flex items-center gap-1 ${
              activeNavTab === 'saved' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            <span>Saved</span>
            {user.savedPropertyIds.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px]">
                {user.savedPropertyIds.length}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

