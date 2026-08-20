import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Calculator, 
  Train 
} from 'lucide-react';
import { DELHI_NCR_LOCALITIES, DELHI_METRO_LINES } from '../../data/delhiNcrLocalities';
import { useProperties } from '../../context/PropertyContext';

interface MarketInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketInsightsModal: React.FC<MarketInsightsModalProps> = ({ isOpen, onClose }) => {
  const { setFilters } = useProperties();

  // Circle Rate Calculator state
  const [plotAreaSqMeters, setPlotAreaSqMeters] = useState<number>(150);
  const [selectedCategoryRate, setSelectedCategoryRate] = useState<number>(774000); // Category A
  const [ownerGender, setOwnerGender] = useState<'female' | 'male' | 'joint'>('female');

  if (!isOpen) return null;

  // Government Minimum Valuation & Stamp Duty
  const minimumValuation = plotAreaSqMeters * selectedCategoryRate;
  const stampDutyRate = ownerGender === 'female' ? 0.04 : ownerGender === 'joint' ? 0.05 : 0.06;
  const estimatedStampDuty = minimumValuation * stampDutyRate;

  const handleSelectLocalityFilter = (locName: string) => {
    setFilters(prev => ({ ...prev, searchQuery: locName }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delhi/NCR Real Estate Market Intelligence</h3>
              <p className="text-xs text-slate-400">
                Capital trends, rental yields, circle rates & metro connectivity indices
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-xs">
          
          {/* Micro-Market Price Rates Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">Delhi/NCR Micro-Market Benchmark Rates</h4>
              <span className="text-[11px] text-slate-400">Updated Q3 2024 / Q1 2025</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DELHI_NCR_LOCALITIES.map(loc => (
                <div
                  key={loc.name}
                  onClick={() => handleSelectLocalityFilter(loc.name)}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-500 hover:bg-brand-50/30 cursor-pointer transition flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs group-hover:text-brand-600">
                        {loc.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-200 text-slate-700">
                        {loc.region}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Avg Rent (2 BHK): <strong className="text-slate-800">₹{loc.avgRent2Bhk.toLocaleString('en-IN')}/mo</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{loc.circleRateCategory}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Avg Capital Rate</span>
                    <span className="text-sm font-extrabold text-slate-900 font-display">
                      ₹{loc.avgBuyRateSqFt.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/ sq.ft</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delhi Circle Rate & Stamp Duty Estimator */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Delhi Circle Rate & Stamp Duty Estimator</h4>
                <p className="text-[11px] text-slate-400">Calculate minimum registry value & stamp duty registration charges</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 block mb-1">Circle Rate Category</label>
                <select
                  value={selectedCategoryRate}
                  onChange={e => setSelectedCategoryRate(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
                >
                  <option value={774000}>Category A - Posh (₹7.74L / sq.m - GK, Hauz Khas, Golf Links)</option>
                  <option value={245520}>Category B - Prime (₹2.45L / sq.m - Vasant Kunj, Saket, Green Park)</option>
                  <option value={159840}>Category C - Established (₹1.59L / sq.m - Dwarka, Malviya Nagar)</option>
                  <option value={127680}>Category D - Standard (₹1.27L / sq.m - Janakpuri, Mayur Vihar)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Built-up / Plot Area (sq. meters)</label>
                <input
                  type="number"
                  value={plotAreaSqMeters}
                  onChange={e => setPlotAreaSqMeters(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Buyer Gender (Delhi Subsidy)</label>
                <select
                  value={ownerGender}
                  onChange={e => setOwnerGender(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
                >
                  <option value="female">Female Buyer (4% Stamp Duty)</option>
                  <option value="male">Male Buyer (6% Stamp Duty)</option>
                  <option value="joint">Joint (Male + Female - 5%)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/80 rounded-xl">
                <span className="text-[11px] text-slate-400">Minimum Circle Rate Valuation</span>
                <p className="text-lg font-bold text-white font-display mt-0.5">
                  ₹{(minimumValuation / 10000000).toFixed(2)} Cr ({minimumValuation.toLocaleString('en-IN')})
                </p>
              </div>

              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl">
                <span className="text-[11px] text-emerald-400">Estimated Delhi Stamp Duty ({stampDutyRate * 100}%)</span>
                <p className="text-lg font-bold text-emerald-400 font-display mt-0.5">
                  ₹{estimatedStampDuty.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Delhi Metro Network Guide */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Train className="w-4 h-4 text-brand-600" />
              <span>Delhi Metro & Rapid Metro Transit Corridors</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {DELHI_METRO_LINES.map(line => (
                <div
                  key={line.code}
                  className="p-3 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: line.color }}
                  />
                  <div>
                    <p className="font-bold text-slate-900">{line.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{line.corridor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
