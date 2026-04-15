'use client';

import { useState, useMemo } from 'react';
import type { Listing, FilterState, SortOption } from '@/types/listing';

export function useListingFilters(listings: Listing[]) {
  const [filters, setFilters] = useState<FilterState>({
    location_macros: [],
    location_micros: [],
    price_min: 0,
    price_max: 300000,
    property_types: [],
    source_platforms: [],
    developer_names: [],
    search: '',
  });

  const [sort, setSort] = useState<SortOption>({
    field: 'posted_at',
    direction: 'desc',
  });

  const filtered = useMemo(() => {
    let result = [...listings];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.developer_name.toLowerCase().includes(q) ||
          l.location_micro.toLowerCase().includes(q)
      );
    }

    // Location macro
    if (filters.location_macros.length > 0) {
      result = result.filter((l) => filters.location_macros.includes(l.location_macro));
    }

    // Location micro
    if (filters.location_micros.length > 0) {
      result = result.filter((l) => filters.location_micros.includes(l.location_micro));
    }

    // Price
    result = result.filter(
      (l) => l.price_amount >= filters.price_min && l.price_amount <= filters.price_max
    );

    // Property type
    if (filters.property_types.length > 0) {
      result = result.filter((l) => filters.property_types.includes(l.property_type));
    }

    // Source
    if (filters.source_platforms.length > 0) {
      result = result.filter((l) => filters.source_platforms.includes(l.source_platform));
    }

    // Developer
    if (filters.developer_names.length > 0) {
      result = result.filter((l) => filters.developer_names.includes(l.developer_name));
    }

    // Sorting
    result.sort((a, b) => {
      let aVal, bVal;
      if (sort.field === 'price') {
        aVal = a.price_amount;
        bVal = b.price_amount;
      } else if (sort.field === 'posted_at') {
        aVal = a.posted_at.getTime();
        bVal = b.posted_at.getTime();
      } else if (sort.field === 'trust_score') {
        aVal = a.trust_score;
        bVal = b.trust_score;
      } else if (sort.field === 'location_micro') {
        aVal = a.location_micro;
        bVal = b.location_micro;
      } else {
        aVal = a.title;
        bVal = b.title;
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [filters, sort, listings]);

  return {
    filters,
    setFilters,
    sort,
    setSort,
    filtered,
  };
}
