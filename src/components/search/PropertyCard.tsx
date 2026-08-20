import React, { useState } from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  Train, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  BedDouble, 
  Bath, 
  Maximize2,
  Sparkles
} from 'lucide-react';
import type { Property } from '../../types/property';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { setSelectedProperty, hoveredPropertyId, setHoveredPropertyId } = useProperties();
  const { isPropertySaved, toggleSaveProperty, isPropertyCompared, toggleCompareProperty } = useAuth();
  const { openChatForProperty } = useChat();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isSaved = isPropertySaved(property.id);
  const isCompared = isPropertyCompared(property.id);
  const isHovered = hoveredPropertyId === property.id;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleCardClick = () => {
    setSelectedProperty(property);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openChatForProperty(property, `Hi ${property.owner.name}, I am interested in your ${property.title} in ${property.locality}. Is it available for a visit?`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHoveredPropertyId(property.id)}
      onMouseLeave={() => setHoveredPropertyId(null)}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
        isHovered
          ? 'border-brand-500 shadow-card-hover -translate-y-1'
          : 'border-slate-200/80 shadow-subtle hover:shadow-card hover:border-slate-300'
      }`}
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        <img
          src={property.images[activeImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Badges on top-left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.isZeroBrokerage && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3" />
              0% Brokerage
            </span>
          )}

          {property.isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-sky-400 backdrop-blur-md border border-sky-400/30">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              Verified Owner
            </span>
          )}
        </div>

        {/* Action icons on top-right (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompareProperty(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isCompared
                ? 'bg-accent-500 text-white shadow-md'
                : 'bg-black/40 hover:bg-black/70 text-white'
            }`}
            title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProperty(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 hover:bg-black/70 text-white'
            }`}
            title={isSaved ? 'Remove from Shortlist' : 'Save Property'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Carousel arrows */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {property.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Category Pill on bottom-right */}
        <div className="absolute bottom-2.5 right-3 text-[11px] font-semibold text-white/90 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-md">
          {property.category}
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & ₹/sq.ft */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display tracking-tight">
                {property.priceDisplay}
              </span>
              {property.isNegotiable && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  Negotiable
                </span>
              )}
            </div>

            {property.pricePerSqFt && (
              <span className="text-xs text-slate-500 font-medium">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition mb-1">
            {property.title}
          </h3>

          {/* Locality & Sub-City */}
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.societyName ? `${property.societyName}, ` : ''}{property.locality}, {property.region}</span>
          </p>

          {/* Key Specs Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2.5 border-y border-slate-100 text-xs font-semibold text-slate-700 mb-3">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-brand-600" />
              <span>{property.bhk} BHK</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span>{property.superAreaSqFt} sq.ft</span>
            </div>
          </div>

          {/* Metro Connectivity Badge */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Train className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate">
                {property.nearestMetro.stationName}
              </p>
              <p className="text-[10px] text-slate-500">
                {property.nearestMetro.distanceMeters}m walk ({property.nearestMetro.walkingTimeMins} mins) • {property.nearestMetro.line} Line
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Owner contact & Chat CTA */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2">
            <img
              src={property.owner.avatar}
              alt={property.owner.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-800">{property.owner.name}</span>
              <span className="text-[9px] text-emerald-600 font-medium">{property.owner.role} • {property.owner.responseTime}</span>
            </div>
          </div>

          <button
            onClick={handleChatClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200/60 shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
