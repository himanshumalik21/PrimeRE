import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Property } from '../../types/property';
import { useProperties } from '../../context/PropertyContext';
import { useChat } from '../../context/ChatContext';
import { 
  MapPin, 
  MessageSquare, 
  Eye
} from 'lucide-react';

// Create custom price pin icon
const createPriceIcon = (property: Property, isHovered: boolean, isSelected: boolean) => {
  const isBuy = property.listingType === 'buy';
  const displayShortPrice = isBuy
    ? property.priceRaw >= 10000000
      ? `₹${(property.priceRaw / 10000000).toFixed(2)} Cr`
      : `₹${(property.priceRaw / 100000).toFixed(0)}L`
    : `₹${(property.priceRaw / 1000).toFixed(0)}k/mo`;

  const bgClass = isSelected
    ? 'bg-slate-950 text-white ring-2 ring-emerald-400 shadow-xl scale-110 z-50'
    : isHovered
    ? 'bg-emerald-600 text-white ring-2 ring-white shadow-xl scale-110 z-40'
    : 'bg-white text-slate-900 border border-slate-200/90 shadow-md hover:bg-slate-900 hover:text-white';

  const html = `
    <div class="custom-price-pin ${isHovered || isSelected ? 'active-pin' : ''}">
      <div class="px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 transition-all ${bgClass} whitespace-nowrap">
        ${property.isZeroBrokerage ? '<span class="w-2 h-2 rounded-full bg-emerald-500"></span>' : ''}
        <span>${displayShortPrice}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [80, 32],
    iconAnchor: [40, 16],
  });
};

// Map Recenter Component
const MapController: React.FC<{ 
  properties: Property[]; 
  hoveredPropertyId: string | null;
  selectedProperty: Property | null;
}> = ({ properties, hoveredPropertyId, selectedProperty }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProperty) {
      map.flyTo([selectedProperty.coordinates.lat, selectedProperty.coordinates.lng], 14, {
        duration: 1.2,
      });
    }
  }, [selectedProperty, map]);

  useEffect(() => {
    if (hoveredPropertyId) {
      const prop = properties.find(p => p.id === hoveredPropertyId);
      if (prop) {
        map.panTo([prop.coordinates.lat, prop.coordinates.lng], { animate: true });
      }
    }
  }, [hoveredPropertyId, properties, map]);

  return null;
};

export const MapView: React.FC = () => {
  const { filteredProperties, hoveredPropertyId, setHoveredPropertyId, selectedProperty, setSelectedProperty } = useProperties();
  const { openChatForProperty } = useChat();

  const [activePopupProperty, setActivePopupProperty] = useState<Property | null>(null);

  // Delhi/NCR Center coordinates (between South Delhi and Gurugram/Noida)
  const defaultCenter: [number, number] = [28.5355, 77.1990];
  const defaultZoom = 11;

  const markers = useMemo(() => {
    return filteredProperties.map(property => {
      const isHovered = hoveredPropertyId === property.id;
      const isSelected = selectedProperty?.id === property.id;
      const icon = createPriceIcon(property, isHovered, isSelected);

      return (
        <Marker
          key={property.id}
          position={[property.coordinates.lat, property.coordinates.lng]}
          icon={icon}
          eventHandlers={{
            click: () => {
              setActivePopupProperty(property);
              setHoveredPropertyId(property.id);
            },
            mouseover: () => {
              setHoveredPropertyId(property.id);
            },
            mouseout: () => {
              setHoveredPropertyId(null);
            },
          }}
        />
      );
    });
  }, [filteredProperties, hoveredPropertyId, selectedProperty, setHoveredPropertyId]);

  return (
    <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-card bg-slate-100 min-h-[450px]">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController
          properties={filteredProperties}
          hoveredPropertyId={hoveredPropertyId}
          selectedProperty={selectedProperty}
        />

        {markers}
      </MapContainer>

      {/* Floating Map Overlay: Market Area Chips */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-600" />
          <span>Delhi/NCR Live Map ({filteredProperties.length} Homes)</span>
        </div>
      </div>

      {/* Floating Selected Property Quick Card */}
      {activePopupProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 animate-slide-up">
          <div className="flex gap-3">
            <img
              src={activePopupProperty.images[0]}
              alt={activePopupProperty.title}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900 font-display">
                  {activePopupProperty.priceDisplay}
                </span>
                {activePopupProperty.isZeroBrokerage && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    0% Brokerage
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {activePopupProperty.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {activePopupProperty.locality}, {activePopupProperty.region}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 font-medium">
                <span>{activePopupProperty.bhk} BHK</span>
                <span>•</span>
                <span>{activePopupProperty.superAreaSqFt} sq.ft</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setSelectedProperty(activePopupProperty)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Details</span>
            </button>

            <button
              onClick={() =>
                openChatForProperty(
                  activePopupProperty,
                  `Hi ${activePopupProperty.owner.name}, I noticed your property on the map. Is it available for viewing?`
                )
              }
              className="py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition border border-emerald-200 flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActivePopupProperty(null)}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
