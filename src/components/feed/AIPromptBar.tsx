import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  MapPin, 
  Compass, 
  IndianRupee, 
  Users, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { useFeed } from '../../context/FeedContext';

export const AIPromptBar: React.FC = () => {
  const { 
    promptQuery, 
    executePromptSearch, 
    clearPromptSearch, 
    aiAnalysis 
  } = useFeed();

  const [inputVal, setInputVal] = useState(promptQuery);

  const samplePrompts = [
    'I am looking for a 1 bedroom house to share with room mate within 5 km from my office located in dlf cyber city',
    'Female roommate in DLF Phase 3 near Rapid Metro under 18k',
    'Pet-friendly 1 BHK studio in Hauz Khas under 30k',
    '2 BHK in DLF Phase 1 near MG Road for working bachelors',
    '1 Room in luxury high-rise on Golf Course Road with pool & gym',
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executePromptSearch(inputVal);
  };

  const handleSelectPrompt = (p: string) => {
    setInputVal(p);
    executePromptSearch(p);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-4 sm:p-5 mb-5 space-y-3.5 transition-all">
      {/* Title & AI Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Roommate & Rental Search Agent</h3>
            <p className="text-[11px] text-slate-500">
              Type your exact workplace, radius, roommate preference & budget
            </p>
          </div>
        </div>

        {promptQuery && (
          <button
            onClick={() => {
              setInputVal('');
              clearPromptSearch();
            }}
            className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear AI Prompt</span>
          </button>
        )}
      </div>

      {/* Main AI Input Form */}
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full flex items-center">
          <Sparkles className="absolute left-3.5 w-4 h-4 text-brand-600" />
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="e.g. I am looking for a 1 bedroom house to share with room mate within 5 km from my office in DLF Cyber City..."
            className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 border border-slate-200/80 font-medium transition"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => setInputVal('')}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Ask AI Agent</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-400 mr-1">Suggested Prompts:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSelectPrompt(p)}
            className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 text-slate-600 border border-slate-200/60 font-medium transition text-left"
          >
            {p.length > 55 ? `${p.substring(0, 52)}...` : p}
          </button>
        ))}
      </div>

      {/* AI Analysis Reasoning Card */}
      {aiAnalysis && aiAnalysis.rawQuery && (
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 text-xs animate-fade-in space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{aiAnalysis.aiExplanation}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
              {aiAnalysis.matchedPostsCount} Matched Listings
            </span>
          </div>

          {/* Parsed Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {aiAnalysis.targetLandmark && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-[10px]">
                <MapPin className="w-3 h-3 text-emerald-600" />
                Workplace: {aiAnalysis.targetLandmark.name}
              </span>
            )}

            {aiAnalysis.maxDistanceKm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-[10px]">
                <Compass className="w-3 h-3 text-emerald-600" />
                Max Distance: ≤ {aiAnalysis.maxDistanceKm} km
              </span>
            )}

            {aiAnalysis.isRoommateSearch && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-[10px]">
                <Users className="w-3 h-3 text-emerald-600" />
                Roommate / Shared Flat
              </span>
            )}

            {aiAnalysis.genderPreference && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-[10px]">
                Gender: {aiAnalysis.genderPreference}
              </span>
            )}

            {aiAnalysis.maxBudget && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-bold text-[10px]">
                <IndianRupee className="w-3 h-3 text-emerald-600" />
                Budget: ≤ ₹{aiAnalysis.maxBudget.toLocaleString('en-IN')}/mo
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
