import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Property, FilterState, ListingType } from '../types/property';
import { INITIAL_PROPERTIES } from '../data/seedProperties';

export type NavTab = 'explore' | 'feed' | 'insights' | 'saved';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  addProperty: (property: Omit<Property, 'id' | 'postedAt' | 'viewsCount' | 'savesCount'>) => Property;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
  viewMode: 'split' | 'grid' | 'map';
  setViewMode: (mode: 'split' | 'grid' | 'map') => void;
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isInsightsModalOpen: boolean;
  setIsInsightsModalOpen: (open: boolean) => void;
  activeListingTypeTab: ListingType;
  setActiveListingTypeTab: (tab: ListingType) => void;
  activeNavTab: NavTab;
  setActiveNavTab: (tab: NavTab) => void;
}

const DEFAULT_FILTERS: FilterState = {
  listingType: 'buy',
  searchQuery: '',
  region: 'All Delhi/NCR',
  minPrice: 0,
  maxPrice: 200000000,
  bhks: [],
  categories: [],
  furnishings: [],
  onlyZeroBrokerage: false,
  onlyVerified: false,
  onlyReadyToMove: false,
  onlyNearMetro: false,
  vastuOnly: false,
  gatedOnly: false,
  maxMetroDistance: undefined,
  sortBy: 'relevance',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('ekthikana_properties');
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [activeListingTypeTab, setActiveListingTypeTab] = useState<ListingType>('buy');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('explore');

  useEffect(() => {
    try {
      localStorage.setItem('ekthikana_properties', JSON.stringify(properties));
    } catch (e) {
      console.warn('Could not save properties to localStorage:', e);
    }
  }, [properties]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      listingType: activeListingTypeTab,
    }));
  }, [activeListingTypeTab]);

  const resetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      listingType: activeListingTypeTab,
    });
  };

  const addProperty = (
    newPropData: Omit<Property, 'id' | 'postedAt' | 'viewsCount' | 'savesCount'>
  ): Property => {
    const newProperty: Property = {
      ...newPropData,
      id: `prop-${Date.now()}`,
      postedAt: 'Just now',
      viewsCount: 1,
      savesCount: 0,
    };

    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      if (prop.listingType !== filters.listingType) {
        return false;
      }

      if (filters.region && filters.region !== 'All Delhi/NCR') {
        if (prop.region !== filters.region && prop.locality !== filters.region) {
          return false;
        }
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocality = prop.locality.toLowerCase().includes(query);
        const matchesRegion = prop.region.toLowerCase().includes(query);
        const matchesMetro = prop.nearestMetro.stationName.toLowerCase().includes(query);
        const matchesSociety = prop.societyName ? prop.societyName.toLowerCase().includes(query) : false;

        if (!matchesTitle && !matchesLocality && !matchesRegion && !matchesMetro && !matchesSociety) {
          return false;
        }
      }

      if (filters.minPrice !== undefined && prop.priceRaw < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && prop.priceRaw > filters.maxPrice) {
        return false;
      }

      if (filters.bhks && filters.bhks.length > 0) {
        const hasMatch = filters.bhks.some((b: number) => (b === 4 ? prop.bhk >= 4 : prop.bhk === b));
        if (!hasMatch) return false;
      }

      if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(prop.category)) {
        return false;
      }

      if (filters.furnishings && filters.furnishings.length > 0 && !filters.furnishings.includes(prop.furnishing)) {
        return false;
      }

      if (filters.onlyZeroBrokerage && !prop.isZeroBrokerage) {
        return false;
      }

      if (filters.onlyVerified && !prop.isVerified) {
        return false;
      }

      if (filters.onlyReadyToMove && !prop.isReadyToMove) {
        return false;
      }

      if (filters.vastuOnly && !prop.vastuCompliant) {
        return false;
      }

      if (filters.gatedOnly && !prop.gatedSecurity) {
        return false;
      }

      if (filters.maxMetroDistance && prop.nearestMetro.distanceMeters > filters.maxMetroDistance) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
        case 'price-asc':
          return a.priceRaw - b.priceRaw;
        case 'price_desc':
        case 'price-desc':
          return b.priceRaw - a.priceRaw;
        case 'newest':
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        case 'area_desc':
        case 'area-desc':
          return b.superAreaSqFt - a.superAreaSqFt;
        case 'metro_proximity':
        case 'metro-proximity':
          return a.nearestMetro.distanceMeters - b.nearestMetro.distanceMeters;
        case 'relevance':
        case 'featured':
        default:
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
      }
    });
  }, [properties, filters]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        filters,
        setFilters,
        resetFilters,
        addProperty,
        selectedProperty,
        setSelectedProperty,
        hoveredPropertyId,
        setHoveredPropertyId,
        viewMode,
        setViewMode,
        isPostModalOpen,
        setIsPostModalOpen,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isInsightsModalOpen,
        setIsInsightsModalOpen,
        activeListingTypeTab,
        setActiveListingTypeTab,
        activeNavTab,
        setActiveNavTab,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const useProperties = useProperty;
