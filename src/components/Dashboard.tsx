'use client';

import { useState } from 'react';
import { Grid3X3, List, Loader } from 'lucide-react';
import { useListingFilters } from '@/hooks/useListingFilters';
import { useListings } from '@/hooks/useListings';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';
import { KPIBox } from './KPIBox';
import { ListingCard } from './ListingCard';
import { ListingTable } from './ListingTable';
import { ListingDetail } from './ListingDetail';

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const { listings, loading } = useListings();
  const { filters, setFilters, sort, setSort, filtered } = useListingFilters(listings);

  // KPIs
  const totalCount = filtered.length;
  const medianPrice =
    filtered.length > 0
      ? filtered
          .map((l) => l.price_amount)
          .sort((a, b) => a - b)[Math.floor(filtered.length / 2)]
      : 0;
  const newCount = filtered.filter(
    (l) => new Date().getTime() - l.posted_at.getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;
  const incompleteCount = filtered.filter((l) => l.completeness_score < 70).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Veille Immobilière</h1>
          <p className="mt-2 text-gray-600">Bali & Lombok — Suivi des offres d'investissement</p>
          {loading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-amber-700">
              <Loader className="h-4 w-4 animate-spin" />
              Chargement des offres...
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPIBox label="Offres" value={totalCount} color="blue" />
          <KPIBox label="Prix médian" value={`${medianPrice.toLocaleString()} €`} color="green" />
          <KPIBox label="Nouvelles (7j)" value={newCount} color="purple" />
          <KPIBox label="Incomplètes" value={incompleteCount} color="amber" />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters({ ...filters, search })}
            placeholder="Chercher par titre, promoteur, zone..."
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* View toggle */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Cartes
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <List className="h-4 w-4" />
            Tableau
          </button>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-gray-600">
          Affichage de <span className="font-semibold">{filtered.length}</span> offre(s)
        </p>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={() => setSelectedListing(listing)}
              />
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <ListingTable
            listings={filtered}
            onSort={setSort}
            currentSort={sort}
            onSelectListing={setSelectedListing}
          />
        )}

        {/* No results */}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">Aucune offre ne correspond à vos critères.</p>
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      <ListingDetail listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </div>
  );
}
