import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Train, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  BadgePercent
} from 'lucide-react';
import { DELHI_NCR_LOCALITIES, DELHI_METRO_LINES } from '../../data/delhiNcrLocalities';
import { useProperties } from '../../context/PropertyContext';

export const MarketIntelligenceView: React.FC = () => {
  const { setFilters, setActiveNavTab } = useProperties();

  // Circle Rate Calculator state
  const [plotAreaSqMeters, setPlotAreaSqMeters] = useState<number>(150);
  const [selectedCategoryRate, setSelectedCategoryRate] = useState<number>(774000); // Category A
  const [ownerGender, setOwnerGender] = useState<'female' | 'male' | 'joint'>('female');

  // Government Minimum Valuation & Stamp Duty
  const minimumValuation = plotAreaSqMeters * selectedCategoryRate;
  const stampDutyRate = ownerGender === 'female' ? 0.04 : ownerGender === 'joint' ? 0.05 : 0.06;
  const estimatedStampDuty = minimumValuation * stampDutyRate;

  const handleSelectLocalityFilter = (locName: string) => {
    setFilters(prev => ({ ...prev, searchQuery: locName }));
    setActiveNavTab('explore');
    const resultsElement = document.getElementById('search-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Q3 2024 / Q1 2025 Benchmarks</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Delhi/NCR Real Estate Market Intelligence
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Verified micro-market capital rates, average rental yields, official Delhi Government circle rates, and metro connectivity corridor indices across South Delhi, Gurugram, Noida, and Dwarka.
          </p>
        </div>
      </div>

      {/* 1. Circle Rate & Stamp Duty Estimator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Delhi Government Circle Rate & Stamp Duty Estimator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate minimum government registry valuation and applicable stamp duty based on sub-city category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Circle Rate Category</label>
            <select
              value={selectedCategoryRate}
              onChange={e => setSelectedCategoryRate(Number(e.target.value))}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
            >
              <option value={774000}>Category A - Posh (₹7.74L / sq.m - GK, Hauz Khas, Golf Links)</option>
              <option value={245520}>Category B - Prime (₹2.45L / sq.m - Vasant Kunj, Saket, Green Park)</option>
              <option value={159840}>Category C - Established (₹1.59L / sq.m - Dwarka, Malviya Nagar)</option>
              <option value={127680}>Category D - Standard (₹1.27L / sq.m - Janakpuri, Mayur Vihar)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Plot / Carpet Area (in sq. meters)</label>
            <input
              type="number"
              value={plotAreaSqMeters}
              onChange={e => setPlotAreaSqMeters(Number(e.target.value))}
              min="10"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              ~{Math.round(plotAreaSqMeters * 10.764)} sq.ft equivalent
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Owner Registration Category</label>
            <select
              value={ownerGender}
              onChange={e => setOwnerGender(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
            >
              <option value="female">Female Buyer (4% Stamp Duty Subsidy)</option>
              <option value="male">Male Buyer (6% Stamp Duty)</option>
              <option value="joint">Joint Ownership (5% Stamp Duty)</option>
            </select>
          </div>
        </div>

        {/* Calculation Result Display */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-400">Minimum Circle Rate Registry Valuation</span>
            <p className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
              ₹{(minimumValuation / 10000000).toFixed(2)} Cr ({minimumValuation.toLocaleString('en-IN')})
            </p>
          </div>

          <div>
            <span className="text-xs text-emerald-400">
              Estimated Stamp Duty Registration Charges ({stampDutyRate * 100}%)
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-display mt-0.5">
              ₹{estimatedStampDuty.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Micro-Market Rate Guide */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Delhi/NCR Micro-Market Benchmarks</h3>
            <p className="text-xs text-slate-500">Click any micro-market to view active zero-brokerage listings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DELHI_NCR_LOCALITIES.map(loc => (
            <div
              key={loc.name}
              onClick={() => handleSelectLocalityFilter(loc.name)}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-500 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition">
                    {loc.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {loc.region}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  Avg Rent (2 BHK): <strong className="text-slate-900">₹{loc.avgRent2Bhk.toLocaleString('en-IN')}/mo</strong>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{loc.circleRateCategory}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg Capital Rate</span>
                  <span className="text-sm font-extrabold text-slate-900 font-display">
                    ₹{loc.avgBuyRateSqFt.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500"> / sq.ft</span>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1 group-hover:bg-emerald-100 transition">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Metro Transit Network Corridors */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Train className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Delhi Metro & Rapid Metro Transit Network</h3>
            <p className="text-xs text-slate-500">Key transit lines connecting residential sub-cities with corporate business parks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {DELHI_METRO_LINES.map(line => (
            <div
              key={line.code}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
            >
              <span
                className="w-4 h-4 rounded-full shrink-0 mt-0.5 shadow-2xs"
                style={{ backgroundColor: line.color }}
              />
              <div>
                <p className="font-bold text-slate-900">{line.name}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{line.corridor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
