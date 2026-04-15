'use client';

import { useState, useEffect } from 'react';
import type { Listing } from '@/types/listing';
import { mockListings } from '@/data/listings';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/listings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setListings(data.listings || mockListings);
      } catch (err) {
        console.error('Erreur lors du chargement des listings:', err);
        setError('Erreur lors du chargement des listings');
        // Fallback aux mocks
        setListings(mockListings);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return { listings, loading, error };
}
