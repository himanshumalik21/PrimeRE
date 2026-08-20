import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  MapPin, 
  Train, 
  ShieldCheck, 
  Users, 
  BadgePercent,
  Eye
} from 'lucide-react';
import type { CommunityRentalPost, Property } from '../../types/property';
import { useFeed } from '../../context/FeedContext';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';

interface CommunityPostCardProps {
  post: CommunityRentalPost;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post }) => {
  const { toggleLikePost, addComment, toggleLikeComment } = useFeed();
  const { openChatForProperty } = useChat();
  const { isAuthenticated, setIsAuthModalOpen } = useAuth();
  const { setSelectedProperty } = useProperties();

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const cyberCityDistance = post.landmarkDistances?.cyberCity;

  const postAsProperty: Property = {
    id: post.id,
    title: post.title,
    listingType: 'rent',
    category: post.rentalCategory === '1 BHK / Studio' ? 'Studio / 1 RK' : 'Apartment / High-rise',
    priceRaw: post.monthlyRent,
    priceDisplay: `₹${post.monthlyRent.toLocaleString('en-IN')} / mo`,
    isNegotiable: post.isNegotiable,
    bhk: post.bhk,
    bathrooms: post.bathrooms,
    balconies: 1,
    carpetAreaSqFt: 450,
    superAreaSqFt: 600,
    furnishing: post.furnishing,
    floor: post.floor || 2,
    totalFloors: post.totalFloors || 4,
    facing: 'North-East',
    ageOfPropertyYears: 2,
    vastuCompliant: true,
    gatedSecurity: true,
    powerBackup: true,
    parkingSpaces: 1,
    evCharging: false,
    petFriendly: post.roommatePreferences?.petFriendly ?? true,
    amenities: post.amenities,
    locality: post.locality,
    region: post.region,
    pincode: post.pincode,
    addressSnippet: post.addressSnippet,
    coordinates: post.coordinates,
    nearestMetro: post.nearestMetro,
    isZeroBrokerage: post.isZeroBrokerage,
    isVerified: true,
    isFeatured: false,
    isReadyToMove: true,
    images: post.images,
    description: post.postText,
    owner: post.author,
    viewsCount: post.viewsCount,
    savesCount: post.savesCount,
    postedAt: post.createdAt,
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleLikePost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!newCommentText.trim()) return;
    addComment(post.id, newCommentText);
    setNewCommentText('');
    setIsCommentsOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleMessageAuthor = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    openChatForProperty(
      postAsProperty,
      `Hi ${post.author.name}, I saw your post on ekThikana for '${post.title}'. Is this room/flat still available for a visit?`
    );
  };

  const handleViewDetail = () => {
    setSelectedProperty(postAsProperty);
  };

  return (
    <article className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle hover:shadow-card transition-all overflow-hidden mb-5 flex flex-col animate-fade-in">
      
      {/* 1. Author Header Strip */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-500/20"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">{post.author.name}</h3>
              {post.author.isVerified && (
                <ShieldCheck className="w-4 h-4 text-sky-600" />
              )}
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                {post.author.role}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <span>{post.createdAt}</span>
              <span>•</span>
              <span className="text-slate-500 font-medium truncate max-w-[200px]">{post.locality}</span>
            </div>
          </div>
        </div>

        {/* Cyber City Distance Badge */}
        {cyberCityDistance && (
          <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-right shrink-0">
            <p className="text-[10px] font-bold text-emerald-900 flex items-center gap-1 justify-end">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{cyberCityDistance.distanceKm} km to Cyber City</span>
            </p>
            <p className="text-[9px] text-emerald-700 font-medium">
              ~{cyberCityDistance.drivingMins} mins drive / {cyberCityDistance.walkingMins}m walk
            </p>
          </div>
        )}
      </div>

      {/* 2. Post Caption / Text Body */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
          {post.postText}
        </p>
      </div>

      {/* 3. Key Specifications Pill Bar */}
      <div className="px-4 sm:px-5 pb-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        {/* Rent Pill */}
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 text-white font-extrabold text-xs">
          ₹{post.monthlyRent.toLocaleString('en-IN')} / mo
        </span>

        {/* Category Pill */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px]">
          <Users className="w-3 h-3 text-emerald-600" />
          {post.rentalCategory}
        </span>

        {/* Roommate Gender Pill */}
        {post.roommatePreferences?.gender && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 text-[11px]">
            Prefers: {post.roommatePreferences.gender} Roommate
          </span>
        )}

        {/* Metro Pill */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
          <Train className="w-3 h-3 text-amber-600" />
          {post.nearestMetro.stationName} ({post.nearestMetro.distanceMeters}m)
        </span>

        {/* Zero Brokerage */}
        {post.isZeroBrokerage && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
            <BadgePercent className="w-3 h-3 text-amber-600" />
            0% Brokerage
          </span>
        )}
      </div>

      {/* 4. Responsive Photo Collage Grid */}
      {post.images && post.images.length > 0 && (
        <div className="bg-slate-100 overflow-hidden cursor-pointer" onClick={handleViewDetail}>
          {post.images.length === 1 && (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full aspect-[16/10] object-cover hover:opacity-95 transition"
            />
          )}

          {post.images.length === 2 && (
            <div className="grid grid-cols-2 gap-0.5">
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Photo ${i + 1}`}
                  className="w-full aspect-[4/3] object-cover hover:opacity-95 transition"
                />
              ))}
            </div>
          )}

          {post.images.length === 3 && (
            <div className="grid grid-cols-3 gap-0.5">
              <img
                src={post.images[0]}
                alt="Photo 1"
                className="w-full h-full aspect-[4/3] object-cover col-span-2 row-span-2"
              />
              <div className="flex flex-col gap-0.5">
                <img src={post.images[1]} alt="Photo 2" className="w-full aspect-[4/3] object-cover" />
                <img src={post.images[2]} alt="Photo 3" className="w-full aspect-[4/3] object-cover" />
              </div>
            </div>
          )}

          {post.images.length >= 4 && (
            <div className="grid grid-cols-2 gap-0.5">
              {post.images.slice(0, 4).map((img, i) => (
                <div key={i} className="relative aspect-[16/10] overflow-hidden">
                  <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  {i === 3 && post.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-base">
                      +{post.images.length - 3} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Engagement Metrics & Social Actions */}
      <div className="p-3 sm:px-5 bg-white border-t border-slate-100 flex items-center justify-between text-xs gap-1">
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition ${
            post.isLikedByMe
              ? 'bg-rose-50 text-rose-600'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-current text-rose-500' : ''}`} />
          <span>{post.likesCount}</span>
        </button>

        {/* Comment Toggle Button */}
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
        >
          <MessageSquare className="w-4 h-4 text-sky-600" />
          <span>{post.comments.length}</span>
        </button>

        {/* View Details Button */}
        <button
          onClick={handleViewDetail}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
          title="View Full Walkthrough & Details"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Details</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
        </button>

        {/* Message / Direct Chat CTA */}
        <button
          onClick={handleMessageAuthor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 text-white font-bold text-xs shadow-xs transition hover:scale-[1.02]"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Message</span>
        </button>
      </div>

      {/* 6. Nested Comments Section */}
      {isCommentsOpen && (
        <div className="bg-slate-50/80 border-t border-slate-100 p-4 space-y-3 animate-fade-in text-xs">
          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-2.5">
              {post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`p-2.5 rounded-2xl ${
                        c.isAuthorReply
                          ? 'bg-emerald-100/70 border border-emerald-200'
                          : 'bg-white border border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-[11px]">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-700 text-xs mt-0.5">{c.text}</p>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-1 text-[10px] text-slate-500">
                      <button
                        onClick={() => {
                          if (!isAuthenticated) setIsAuthModalOpen(true);
                          else toggleLikeComment(post.id, c.id);
                        }}
                        className={`font-bold hover:underline ${c.isLikedByMe ? 'text-rose-600' : ''}`}
                      >
                        Like ({c.likesCount})
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => {
                          if (!isAuthenticated) setIsAuthModalOpen(true);
                          else setNewCommentText(`@${c.authorName} `);
                        }}
                        className="font-bold hover:underline"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 text-center py-1">
              No comments yet. Be the first to ask the author a question!
            </p>
          )}

          {/* Add Comment Input Bar */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              placeholder="Write a comment or ask a question..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

    </article>
  );
};
