import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Building2, 
  IndianRupee 
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { DELHI_NCR_LOCALITIES } from '../../data/delhiNcrLocalities';
import type { 
  DelhiNcrRegion, 
  FacingDirection, 
  FurnishingStatus, 
  ListingType, 
  MetroLineColor, 
  PropertyCategory 
} from '../../types/property';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({ isOpen, onClose }) => {
  const { addProperty, setSelectedProperty } = useProperties();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [listingType, setListingType] = useState<ListingType>('buy');
  const [category, setCategory] = useState<PropertyCategory>('Apartment / High-rise');
  const [region, setRegion] = useState<DelhiNcrRegion>('Gurugram');
  const [locality, setLocality] = useState('Golf Course Road (DLF 5)');
  const [societyName, setSocietyName] = useState('');
  const [title, setTitle] = useState('');
  const [addressSnippet, setAddressSnippet] = useState('');
  const [pincode, setPincode] = useState('122002');

  // Specs
  const [bhk, setBhk] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [balconies, setBalconies] = useState<number>(2);
  const [superAreaSqFt, setSuperAreaSqFt] = useState<number>(1850);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1500);
  const [floor, setFloor] = useState<number>(7);
  const [totalFloors, setTotalFloors] = useState<number>(22);
  const [facing, setFacing] = useState<FacingDirection>('North-East');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi Furnished');
  const [ageOfPropertyYears, setAgeOfPropertyYears] = useState<number>(2);

  // Financials
  const [priceInput, setPriceInput] = useState<string>('2.25'); // in Cr or k
  const [priceUnit, setPriceUnit] = useState<'Cr' | 'Lakh' | 'k/month'>('Cr');
  const [maintenanceMonthly, setMaintenanceMonthly] = useState<number>(3500);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [isZeroBrokerage, setIsZeroBrokerage] = useState(true);

  // Amenities & Metro
  const [nearestMetroStation, setNearestMetroStation] = useState('Sector 54 Chowk (Rapid Metro)');
  const [nearestMetroLine, setNearestMetroLine] = useState<MetroLineColor>('Rapid Metro');
  const [metroDistanceMeters, setMetroDistanceMeters] = useState<number>(450);
  const [vastuCompliant, setVastuCompliant] = useState(true);
  const [gatedSecurity, setGatedSecurity] = useState(true);
  const [powerBackup, setPowerBackup] = useState(true);
  const [evCharging, setEvCharging] = useState(true);
  const [description, setDescription] = useState(
    'Direct Owner post. Beautiful sunlit home with spacious rooms, high speed lifts, dedicated reserved parking, and 24/7 security. Freehold property with clear title.'
  );

  // Sample Photos
  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  ];
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    samplePhotoPresets[0],
    samplePhotoPresets[1],
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate raw price in INR
    let priceRaw = 0;
    let priceDisplay = '';
    const numericVal = parseFloat(priceInput) || 0;

    if (listingType === 'buy') {
      if (priceUnit === 'Cr') {
        priceRaw = Math.round(numericVal * 10000000);
        priceDisplay = `₹${numericVal} Cr`;
      } else {
        priceRaw = Math.round(numericVal * 100000);
        priceDisplay = `₹${numericVal} Lakhs`;
      }
    } else {
      priceRaw = Math.round(numericVal * 1000);
      priceDisplay = `₹${numericVal.toLocaleString('en-IN')},000 / mo`;
    }

    const pricePerSqFt = superAreaSqFt > 0 ? Math.round(priceRaw / superAreaSqFt) : undefined;

    // Get locality coordinates
    const matchedLocality = DELHI_NCR_LOCALITIES.find(l => l.name === locality);
    const coordinates = matchedLocality
      ? { lat: matchedLocality.lat + (Math.random() - 0.5) * 0.01, lng: matchedLocality.lng + (Math.random() - 0.5) * 0.01 }
      : { lat: 28.5355, lng: 77.1990 };

    const newProp = addProperty({
      title: title || `${bhk} BHK ${category} in ${locality}`,
      listingType,
      category,
      priceRaw,
      priceDisplay,
      pricePerSqFt,
      maintenanceMonthly,
      securityDeposit: listingType === 'rent' ? securityDeposit || priceRaw * 2 : undefined,
      isNegotiable,
      bhk,
      bathrooms,
      balconies,
      carpetAreaSqFt,
      superAreaSqFt,
      furnishing,
      floor,
      totalFloors,
      facing,
      ageOfPropertyYears,
      vastuCompliant,
      gatedSecurity,
      powerBackup,
      parkingSpaces: 1,
      evCharging,
      petFriendly: true,
      amenities: [
        '24/7 Security & CCTV',
        '100% Power Backup',
        'Reserved Covered Parking',
        'Modern Clubhouse & Gym',
        'Children Play Zone'
      ],
      societyName: societyName || undefined,
      locality,
      region,
      pincode,
      addressSnippet: addressSnippet || `${societyName || 'Sector'}, ${locality}`,
      coordinates,
      nearestMetro: {
        stationName: nearestMetroStation,
        line: nearestMetroLine,
        distanceMeters: metroDistanceMeters,
        walkingTimeMins: Math.round(metroDistanceMeters / 80),
      },
      reraId: listingType === 'buy' ? 'DEL-NCR-VERIFIED-2024' : undefined,
      isZeroBrokerage,
      isVerified: true,
      isFeatured: true,
      isReadyToMove: true,
      images: selectedPhotos.length > 0 ? selectedPhotos : samplePhotoPresets.slice(0, 2),
      description,
      owner: {
        id: user.id,
        name: user.name,
        role: 'Owner',
        phoneMasked: user.phone.replace(/(\+91 \d{4})\d+/, '$1 XXXXX'),
        phoneFull: user.phone,
        email: user.email,
        avatar: user.avatar,
        responseRate: '100%',
        responseTime: 'Instant reply',
        isVerified: true,
        memberSince: 'Today',
        listingsCount: user.myListingsCount + 1,
      },
    });

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
    setSelectedProperty(newProp);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 text-slate-950 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Post Free Property Listing</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  0% BROKERAGE
                </span>
              </div>
              <p className="text-xs text-slate-400">Delhi/NCR Direct Owner Portal • Step {step} of 4</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-brand-500 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">I want to:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['buy', 'rent', 'pg'] as ListingType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setListingType(t);
                        setPriceUnit(t === 'buy' ? 'Cr' : 'k/month');
                        setPriceInput(t === 'buy' ? '2.25' : '45');
                      }}
                      className={`py-2.5 rounded-xl border font-bold capitalize transition ${
                        listingType === t
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t === 'buy' ? 'Sell Property' : t === 'rent' ? 'Rent Out' : 'PG / Hostel'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Property Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                >
                  <option value="Apartment / High-rise">Apartment / High-rise</option>
                  <option value="Builder Floor">Builder Floor</option>
                  <option value="Independent House">Independent House / Kothi</option>
                  <option value="Luxury Villa">Luxury Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Studio / 1 RK">Studio / 1 RK</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Delhi/NCR Sub-City</label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="South Delhi">South Delhi</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Noida">Noida</option>
                    <option value="Dwarka">Dwarka</option>
                    <option value="Central Delhi">Central Delhi</option>
                    <option value="Greater Noida">Greater Noida</option>
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="West Delhi">West Delhi</option>
                    <option value="Faridabad">Faridabad</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Micro Locality / Sector</label>
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    {DELHI_NCR_LOCALITIES.map(loc => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} ({loc.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Society or Project Name (Optional)</label>
                <input
                  type="text"
                  value={societyName}
                  onChange={e => setSocietyName(e.target.value)}
                  placeholder="e.g. DLF The Crest, Mahagun Moderne, DDA Pocket 10"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Address / Landmark</label>
                <input
                  type="text"
                  value={addressSnippet}
                  onChange={e => setAddressSnippet(e.target.value)}
                  placeholder="e.g. Tower 3, High-Zone, DLF Phase 5"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="e.g. 110016"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Headline / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={`e.g. Luxurious ${bhk} BHK Floor in ${locality}`}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Configuration & Specs */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">BHK Configuration</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setBhk(n)}
                      className={`py-2 rounded-xl border font-bold ${
                        bhk === n ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {n} BHK
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Balconies</label>
                  <input
                    type="number"
                    value={balconies}
                    onChange={e => setBalconies(Number(e.target.value))}
                    min="0"
                    max="10"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Super Area (sq.ft)</label>
                  <input
                    type="number"
                    value={superAreaSqFt}
                    onChange={e => setSuperAreaSqFt(Number(e.target.value))}
                    min="100"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={carpetAreaSqFt}
                    onChange={e => setCarpetAreaSqFt(Number(e.target.value))}
                    min="100"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={e => setFurnishing(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Floor / Total</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={floor}
                      onChange={e => setFloor(Number(e.target.value))}
                      placeholder="Floor"
                      className="w-1/2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      value={totalFloors}
                      onChange={e => setTotalFloors(Number(e.target.value))}
                      placeholder="Total"
                      className="w-1/2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facing</label>
                  <select
                    value={facing}
                    onChange={e => setFacing(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="North-East">North-East</option>
                    <option value="North">North</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={ageOfPropertyYears}
                    onChange={e => setAgeOfPropertyYears(Number(e.target.value))}
                    min="0"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financials & Zero Brokerage */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  {listingType === 'buy' ? 'Expected Sale Price' : 'Monthly Rent Expected'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={priceInput}
                      onChange={e => setPriceInput(e.target.value)}
                      placeholder={listingType === 'buy' ? 'e.g. 2.25' : 'e.g. 45'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-base text-slate-900"
                    />
                  </div>

                  {listingType === 'buy' ? (
                    <select
                      value={priceUnit}
                      onChange={e => setPriceUnit(e.target.value as any)}
                      className="p-3 rounded-xl bg-slate-100 border border-slate-200 font-bold"
                    >
                      <option value="Cr">Crores (₹ Cr)</option>
                      <option value="Lakh">Lakhs (₹ L)</option>
                    </select>
                  ) : (
                    <span className="p-3 rounded-xl bg-slate-100 font-bold text-slate-700">
                      Thousand / Month (₹ k/mo)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Maintenance (₹)</label>
                  <input
                    type="number"
                    value={maintenanceMonthly}
                    onChange={e => setMaintenanceMonthly(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>

                {listingType === 'rent' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={e => setSecurityDeposit(Number(e.target.value))}
                      placeholder="e.g. 90000"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                    />
                  </div>
                )}

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={e => setIsNegotiable(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>Price is Negotiable</span>
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950">
                  <input
                    type="checkbox"
                    checked={isZeroBrokerage}
                    onChange={e => setIsZeroBrokerage(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Zero Brokerage Pledge</span>
                </label>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  By checking this box, you confirm that you are the direct owner or verified developer and will not charge any brokerage or commission from interested buyers/tenants.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Metro Connectivity, Photos & Publish */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nearest Metro Station</label>
                  <input
                    type="text"
                    value={nearestMetroStation}
                    onChange={e => setNearestMetroStation(e.target.value)}
                    placeholder="e.g. Hauz Khas / Sector 54"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metro Line</label>
                  <select
                    value={nearestMetroLine}
                    onChange={e => setNearestMetroLine(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Yellow">Yellow Line</option>
                    <option value="Blue">Blue Line</option>
                    <option value="Magenta">Magenta Line</option>
                    <option value="Violet">Violet Line</option>
                    <option value="Rapid Metro">Rapid Metro</option>
                    <option value="Aqua">Aqua Line</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metro Distance (meters)</label>
                  <input
                    type="number"
                    value={metroDistanceMeters}
                    onChange={e => setMetroDistanceMeters(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* Special toggles */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={vastuCompliant}
                    onChange={e => setVastuCompliant(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>100% Vastu Compliant</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={gatedSecurity}
                    onChange={e => setGatedSecurity(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Gated 24/7 Security</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={powerBackup}
                    onChange={e => setPowerBackup(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>100% Power Backup</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={evCharging}
                    onChange={e => setEvCharging(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>EV Charging Bay</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Property Photos</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {samplePhotoPresets.map((photo, i) => {
                    const isSelected = selectedPhotos.includes(photo);
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPhotos(prev => prev.filter(p => p !== photo));
                          } else {
                            setSelectedPhotos(prev => [...prev, photo]);
                          }
                        }}
                        className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                          isSelected ? 'border-brand-500 ring-2 ring-brand-400/50' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={photo} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-brand-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Select high-definition photos for your listing.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold flex items-center gap-1.5 transition shadow-lg shadow-brand-500/25"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Listing FREE</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
