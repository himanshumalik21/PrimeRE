import React, { useState, useMemo } from 'react';
import { 
  X, 
  Heart, 
  Scale, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Train, 
  MapPin, 
  Compass, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  IndianRupee, 
  Calculator
} from 'lucide-react';
import type { Property } from '../../types/property';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { isPropertySaved, toggleSaveProperty, isPropertyCompared, toggleCompareProperty } = useAuth();
  const { openChatForProperty, sendOffer, scheduleVisit } = useChat();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // EMI Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(8.5);

  // Quick Action Modals / Triggers
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('This Saturday');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitType, setVisitType] = useState<'Physical Visit' | 'Video Tour'>('Physical Visit');

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(property ? property.priceRaw * 0.95 : 0);

  if (!property) return null;

  const isSaved = isPropertySaved(property.id);
  const isCompared = isPropertyCompared(property.id);

  // EMI Calculation: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emiCalculation = useMemo(() => {
    const principal = property.priceRaw * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRatePercent / 12 / 100;
    const totalMonths = loanTenureYears * 12;

    if (monthlyRate === 0) {
      return {
        monthlyEmi: Math.round(principal / totalMonths),
        totalInterest: 0,
        totalPayment: principal,
        principal,
      };
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principal: Math.round(principal),
    };
  }, [property.priceRaw, downPaymentPercent, loanTenureYears, interestRatePercent]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleStartChat = () => {
    openChatForProperty(
      property,
      `Hello ${property.owner.name}, I am very interested in your listing '${property.title}'. Is it available for an in-person walkthrough?`
    );
    onClose();
  };

  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    openChatForProperty(property);
    scheduleVisit(visitDate, visitTime, visitType);
    setIsVisitModalOpen(false);
    onClose();
  };

  const handleConfirmOffer = (e: React.FormEvent) => {
    e.preventDefault();
    openChatForProperty(property);
    sendOffer(offerAmount);
    setIsOfferModalOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Floating Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
              ID: {property.id}
            </span>
            {property.isZeroBrokerage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
                Zero Brokerage
              </span>
            )}
            {property.reraId && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-sky-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                RERA Verified: {property.reraId}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompareProperty(property.id)}
              className={`p-2 rounded-xl transition border text-xs font-semibold flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Compare"
            >
              <Scale className="w-4 h-4" />
              <span className="hidden md:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              onClick={() => toggleSaveProperty(property.id)}
              className={`p-2 rounded-xl transition border text-xs font-semibold flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Save"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden md:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition text-xs font-semibold flex items-center gap-1.5"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
              {copiedUrl && <span className="text-emerald-600 text-xs">Copied!</span>}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 sm:pb-10 space-y-6 flex-1">
          
          {/* Photos Grid / Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden bg-slate-100 p-1.5">
            <div className="md:col-span-3 aspect-[16/10] relative rounded-xl overflow-hidden">
              <img
                src={property.images[activePhotoIdx] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-all"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                Photo {activePhotoIdx + 1} of {property.images.length}
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-1 gap-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition ${
                    activePhotoIdx === idx ? 'border-brand-500 ring-2 ring-brand-400/50' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Primary Price Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left: Info & Specs */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                    {property.priceDisplay}
                  </span>
                  {property.pricePerSqFt && (
                    <span className="text-sm font-semibold text-slate-500">
                      (₹{property.pricePerSqFt.toLocaleString('en-IN')} per sq.ft)
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {property.title}
                </h1>

                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{property.addressSnippet}, {property.locality}, {property.region} - {property.pincode}</span>
                </p>
              </div>

              {/* Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="p-2">
                  <span className="text-slate-400 block text-[11px]">Configuration</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{property.bhk} BHK</p>
                </div>
                <div className="p-2">
                  <span className="text-slate-400 block text-[11px]">Super Built-up Area</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{property.superAreaSqFt} sq.ft</p>
                </div>
                <div className="p-2">
                  <span className="text-slate-400 block text-[11px]">Carpet Area</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{property.carpetAreaSqFt} sq.ft</p>
                </div>
                <div className="p-2">
                  <span className="text-slate-400 block text-[11px]">Bathrooms & Balconies</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{property.bathrooms} Baths, {property.balconies} Balconies</p>
                </div>

                <div className="p-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Floor Level</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">Floor {property.floor} of {property.totalFloors}</p>
                </div>
                <div className="p-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Furnishing</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{property.furnishing}</p>
                </div>
                <div className="p-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Facing Direction</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{property.facing}</p>
                </div>
                <div className="p-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[11px]">Maintenance Fee</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {property.maintenanceMonthly ? `₹${property.maintenanceMonthly.toLocaleString('en-IN')}/mo` : 'Included'}
                  </p>
                </div>
              </div>

              {/* Delhi Metro & Locality Connectivity Score */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">Delhi Metro Connectivity Score</h3>
                    <p className="text-[11px] text-emerald-700">Verified walking proximity & daily commute index</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500">Nearest Metro Station</span>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <span>{property.nearestMetro.stationName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white">
                        {property.nearestMetro.line} Line
                      </span>
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500">Walking Proximity</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {property.nearestMetro.distanceMeters} meters (~{property.nearestMetro.walkingTimeMins} mins walk)
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">About This Property</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {property.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Society & Property Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {property.amenities.map(amenity => (
                    <div
                      key={amenity}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2 text-slate-800 font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                  {property.vastuCompliant && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-900 font-semibold">
                      <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% Vastu Compliant</span>
                    </div>
                  )}
                  {property.evCharging && (
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2 text-sky-900 font-semibold">
                      <Zap className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>EV Charging Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* EMI & Indian Home Loan Calculator (For Buy listings) */}
              {property.listingType === 'buy' && (
                <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Calculator className="w-4 h-4 font-bold" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Indian Home Loan & EMI Estimator</h3>
                        <p className="text-[11px] text-slate-400">Calculate customized monthly outflow</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">Estimated EMI</span>
                      <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-display">
                        ₹{emiCalculation.monthlyEmi.toLocaleString('en-IN')}
                        <span className="text-xs text-slate-400 font-normal"> / mo</span>
                      </p>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Down Payment</span>
                        <span className="font-bold text-white">{downPaymentPercent}% (₹{((property.priceRaw * downPaymentPercent) / 100000).toFixed(1)}L)</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={downPaymentPercent}
                        onChange={e => setDownPaymentPercent(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Loan Tenure</span>
                        <span className="font-bold text-white">{loanTenureYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={loanTenureYears}
                        onChange={e => setLoanTenureYears(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Interest Rate</span>
                        <span className="font-bold text-white">{interestRatePercent}% p.a.</span>
                      </div>
                      <input
                        type="range"
                        min="7.5"
                        max="12.0"
                        step="0.1"
                        value={interestRatePercent}
                        onChange={e => setInterestRatePercent(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Bank Rate Comparisons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>Top Lender Rates:</span>
                    <span className="text-slate-300">SBI Home Loan: <strong>8.50%</strong></span>
                    <span className="text-slate-300">HDFC Bank: <strong>8.70%</strong></span>
                    <span className="text-slate-300">ICICI Bank: <strong>8.75%</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Owner Card & Direct Action Box */}
            <div className="space-y-4">
              {/* Owner Profile Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={property.owner.avatar}
                    alt={property.owner.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{property.owner.name}</h4>
                      {property.owner.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      )}
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold">{property.owner.role} • 0% Brokerage</p>
                    <p className="text-[11px] text-slate-400">Member since {property.owner.memberSince}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Response Rate</span>
                    <span className="font-bold text-slate-800">{property.owner.responseRate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Response Time</span>
                    <span className="font-bold text-slate-800">{property.owner.responseTime}</span>
                  </div>
                </div>

                {/* Primary CTA: Start Encrypted Chat */}
                <button
                  onClick={handleStartChat}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Encrypted Chat</span>
                </button>

                {/* Secondary CTA: Schedule Visit */}
                <button
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Site Visit / Walkthrough</span>
                </button>

                {/* Tertiary CTA: Direct Offer */}
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>Make Direct Price Offer</span>
                </button>

                {/* Security Trust Note */}
                <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero Spam Guarantee. Encrypted Internal Chat.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Schedule Visit Mini Modal */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Schedule Visit with {property.owner.name}</h3>
              <button onClick={() => setIsVisitModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmVisit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Visit Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Physical Visit', 'Video Tour'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVisitType(t)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition ${
                        visitType === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Day</label>
                <select
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold"
                >
                  <option value="This Saturday (10 AM - 1 PM)">This Saturday (10 AM - 1 PM)</option>
                  <option value="This Sunday (11 AM - 3 PM)">This Sunday (11 AM - 3 PM)</option>
                  <option value="Tomorrow Evening (5 PM - 7 PM)">Tomorrow Evening (5 PM - 7 PM)</option>
                  <option value="Flexible Weekday Morning">Flexible Weekday Morning</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Time Slot</label>
                <input
                  type="text"
                  value={visitTime}
                  onChange={e => setVisitTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition shadow-md"
              >
                Confirm & Send to Landlord
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Make Direct Offer Mini Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Make an Offer on {property.title}</h3>
              <button onClick={() => setIsOfferModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOffer} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                <p className="text-[11px] text-slate-500">Asking Price:</p>
                <p className="text-base font-bold text-slate-900">{property.priceDisplay}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Direct Offer Amount (in INR ₹)</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={e => setOfferAmount(Number(e.target.value))}
                  step="50000"
                  className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-sm text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Formatted: {offerAmount >= 10000000 ? `₹${(offerAmount / 10000000).toFixed(2)} Cr` : `₹${(offerAmount / 100000).toFixed(2)} Lakhs`}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-md"
              >
                Submit Encrypted Offer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
