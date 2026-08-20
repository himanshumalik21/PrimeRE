import React, { useState } from 'react';
import { 
  Image, 
  MapPin, 
  Users, 
  IndianRupee, 
  Sparkles, 
  X, 
  Check 
} from 'lucide-react';
import { useFeed } from '../../context/FeedContext';
import { useAuth } from '../../context/AuthContext';
import type { RentalCategory, DelhiNcrRegion } from '../../types/property';

export const CreatePostComposer: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen, createPost } = useFeed();
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();

  // Form State
  const [postText, setPostText] = useState('');
  const [rentalCategory, setRentalCategory] = useState<RentalCategory>('Shared Room with Roommate');
  const [monthlyRent, setMonthlyRent] = useState<number>(16000);
  const [locality, setLocality] = useState('DLF Phase 3 (U Block)');
  const [genderPreference, setGenderPreference] = useState<'Female' | 'Male' | 'Any'>('Any');
  const [isZeroBrokerage, setIsZeroBrokerage] = useState(true);

  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502005229762-ee1b2b93e083?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  ];
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    samplePhotoPresets[0],
    samplePhotoPresets[1],
  ]);

  const handleOpenComposer = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsCreatePostOpen(true);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;

    createPost({
      postText,
      rentalCategory,
      monthlyRent,
      securityDeposit: monthlyRent,
      locality,
      region: 'Gurugram' as DelhiNcrRegion,
      images: selectedPhotos,
      roommatePreferences: {
        gender: genderPreference,
        occupancy: rentalCategory === 'Shared Room with Roommate' ? 'Shared Room (2 People)' : 'Single Room',
        dietary: 'No Restrictions',
        petFriendly: true,
        smoking: false,
        workIndustry: 'Corporate / Tech',
      },
      isZeroBrokerage,
    });

    setPostText('');
    setIsCreatePostOpen(false);
  };

  return (
    <>
      {/* Inline Composer Trigger */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 mb-5 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
          />
          <button
            onClick={handleOpenComposer}
            className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 text-xs sm:text-sm text-slate-500 font-medium transition"
          >
            {isAuthenticated
              ? `Post a room, flat, or roommate requirement in Delhi/NCR, ${user.name.split(' ')[0]}...`
              : 'Sign in to post a rental room, flat, or roommate requirement in Delhi/NCR...'}
          </button>
        </div>

        {/* Quick Attachment Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
          <button
            onClick={handleOpenComposer}
            className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
          >
            <Image className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Add Photos</span>
          </button>

          <button
            onClick={handleOpenComposer}
            className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
          >
            <Users className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Roommate Needed</span>
          </button>

          <button
            onClick={handleOpenComposer}
            className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Cyber City / Locality</span>
          </button>

          <button
            onClick={handleOpenComposer}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-xs"
          >
            Post
          </button>
        </div>
      </div>

      {/* Full Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Post Room or Rental Requirement</h3>
                  <p className="text-[10px] text-slate-400">Delhi/NCR Direct Community Feed • 0% Brokerage</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handlePostSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* Author Preview */}
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">{user.role} • Verified Phone</p>
                </div>
              </div>

              {/* Main Post Textarea */}
              <div>
                <textarea
                  rows={4}
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  placeholder="Describe your flat/room: e.g. 1 Master bedroom with attached washroom in 3 BHK in DLF Phase 3 near Cyber City. Looking for a working roommate, cook and maid already set up..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {/* Rental Category & Roommate Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rental Type</label>
                  <select
                    value={rentalCategory}
                    onChange={e => setRentalCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Shared Room with Roommate">Shared Room with Roommate</option>
                    <option value="Private Room (Roommate Needed)">Private Room (Roommate Needed)</option>
                    <option value="Private 1 BHK">Private 1 BHK</option>
                    <option value="Private 2 BHK">Private 2 BHK</option>
                    <option value="Private 3 BHK">Private 3 BHK</option>
                    <option value="Studio / 1 RK">Studio / 1 RK</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Roommate Gender Preference</label>
                  <select
                    value={genderPreference}
                    onChange={e => setGenderPreference(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Any">Any Gender (Working Professional)</option>
                    <option value="Female">Female Roommate Only</option>
                    <option value="Male">Male Roommate Only</option>
                  </select>
                </div>
              </div>

              {/* Rent & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Rent (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={e => setMonthlyRent(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Locality / Sector</label>
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="DLF Phase 3 (U Block)">DLF Phase 3 (Near Cyber City)</option>
                    <option value="DLF Phase 2 (P Block)">DLF Phase 2 (Near Sikanderpur)</option>
                    <option value="DLF Phase 1">DLF Phase 1 (Near MG Road)</option>
                    <option value="Golf Course Road (DLF 5)">Golf Course Road (DLF 5)</option>
                    <option value="Sector 24 (Near Cyber Park)">Sector 24 (Cyber Park)</option>
                    <option value="Sector 56 / Golf Course Ext">Sector 56 (Golf Course Ext)</option>
                    <option value="Hauz Khas Enclave">Hauz Khas (South Delhi)</option>
                    <option value="Sector 62 & IT Corridor">Sector 62 (Noida)</option>
                    <option value="Dwarka Sector 12">Dwarka Sector 12</option>
                  </select>
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Property Photos</label>
                <div className="grid grid-cols-4 gap-2">
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
                        <img src={photo} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-brand-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zero Brokerage Pledge */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950">
                  <input
                    type="checkbox"
                    checked={isZeroBrokerage}
                    onChange={e => setIsZeroBrokerage(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Zero Brokerage Confirmation</span>
                </label>
                <span className="text-[10px] text-emerald-800 font-semibold">100% Direct</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                Publish Listing FREE
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
