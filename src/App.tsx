import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { ChatProvider } from './context/ChatContext';
import { FeedProvider, useFeed } from './context/FeedContext';

import { Navbar } from './components/layout/Navbar';
import { HeroSearch } from './components/home/HeroSearch';
import { FilterBar } from './components/search/FilterBar';
import { PropertyExplorer } from './components/search/PropertyExplorer';
import { CommunityHeader } from './components/feed/CommunityHeader';
import { AIPromptBar } from './components/feed/AIPromptBar';
import { CreatePostComposer } from './components/feed/CreatePostComposer';
import { CommunityPostCard } from './components/feed/CommunityPostCard';
import { LeftSidebar } from './components/feed/LeftSidebar';
import { RightSidebar } from './components/feed/RightSidebar';
import { MarketIntelligenceView } from './components/tools/MarketIntelligenceView';
import { SavedPropertiesView } from './components/saved/SavedPropertiesView';

import { PropertyDetailModal } from './components/property/PropertyDetailModal';
import { PostPropertyModal } from './components/post/PostPropertyModal';
import { CompareModal } from './components/compare/CompareModal';
import { MarketInsightsModal } from './components/tools/MarketInsightsModal';
import { AuthModal } from './components/auth/AuthModal';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { Footer } from './components/layout/Footer';
import { Users, Scale, X, ArrowRight } from 'lucide-react';

const CommunityFeedStream: React.FC = () => {
  const { filteredPosts, clearPromptSearch, aiAnalysis } = useFeed();

  return (
    <div className="space-y-5">
      {/* 1. Community Header */}
      <CommunityHeader />

      {/* 2. AI Natural Language Prompt Bar */}
      <AIPromptBar />

      {/* 3. Post Composer */}
      <CreatePostComposer />

      {/* 4. Verified Community Posts Stream */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching listings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {aiAnalysis?.rawQuery
              ? `No community listings matched your specific criteria for "${aiAnalysis.rawQuery}". Try adjusting your radius or searching another landmark.`
              : 'No listings currently match this filter.'}
          </p>
          <button
            onClick={clearPromptSearch}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Reset Filters & View All Listings
          </button>
        </div>
      )}
    </div>
  );
};

const AppMainContent: React.FC = () => {
  const { 
    activeNavTab, 
    selectedProperty, 
    setSelectedProperty,
    isPostModalOpen,
    setIsPostModalOpen,
    isCompareModalOpen,
    setIsCompareModalOpen,
    isInsightsModalOpen,
    setIsInsightsModalOpen
  } = useProperties();

  const { user, clearComparedProperties } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Dynamic Views */}
      <div className="flex-1">
        
        {/* 1. Explore Homes & Properties View */}
        {activeNavTab === 'explore' && (
          <div>
            <HeroSearch />
            <FilterBar />
            <PropertyExplorer />
          </div>
        )}

        {/* 2. AI Roommates & Community Feed View */}
        {activeNavTab === 'feed' && (
          <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Sidebar (Desktop 3 Cols) */}
              <div className="hidden lg:block lg:col-span-3 sticky top-22">
                <LeftSidebar />
              </div>

              {/* Center Main Discovery Feed (6 Cols) */}
              <div className="col-span-1 lg:col-span-6">
                <CommunityFeedStream />
              </div>

              {/* Right Sidebar (Desktop 3 Cols) */}
              <div className="hidden lg:block lg:col-span-3 sticky top-22">
                <RightSidebar />
              </div>

            </div>
          </main>
        )}

        {/* 3. Market Intelligence & Circle Rates View */}
        {activeNavTab === 'insights' && (
          <MarketIntelligenceView />
        )}

        {/* 4. Saved Homes View */}
        {activeNavTab === 'saved' && (
          <SavedPropertiesView />
        )}

      </div>

      {/* Floating Bottom Comparison Pill */}
      {user.comparedPropertyIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-3 animate-slide-up backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent-400" />
            <span className="text-xs font-bold">
              {user.comparedPropertyIds.length} {user.comparedPropertyIds.length === 1 ? 'Home' : 'Homes'} Selected
            </span>
          </div>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-1 rounded-full bg-gradient-to-r from-accent-500 to-sky-400 hover:from-accent-600 hover:to-sky-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-xs"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={clearComparedProperties}
            className="text-slate-400 hover:text-white transition p-1"
            title="Clear comparison"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* All Integrated Root Modals */}
      <PropertyDetailModal 
        property={selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
      />

      <PostPropertyModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />

      <CompareModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
      />

      <MarketInsightsModal 
        isOpen={isInsightsModalOpen} 
        onClose={() => setIsInsightsModalOpen(false)} 
      />

      <AuthModal />
      <ChatDrawer />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PropertyProvider>
        <ChatProvider>
          <FeedProvider>
            <AppMainContent />
          </FeedProvider>
        </ChatProvider>
      </PropertyProvider>
    </AuthProvider>
  );
};

export default App;

