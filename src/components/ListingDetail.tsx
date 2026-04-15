'use client';

import { X, ExternalLink, MapPin, Euro, Home, Building2 } from 'lucide-react';
import type { Listing } from '@/types/listing';
import { Badge } from './ui/Badge';

interface ListingDetailProps {
  listing: Listing | null;
  onClose: () => void;
}

export function ListingDetail({ listing, onClose }: ListingDetailProps) {
  if (!listing) return null;

  const isOpportunity = listing.trust_score >= 80 && listing.completeness_score >= 85;
  const isIncomplete = listing.completeness_score < 70;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <img
            src={listing.image_url}
            alt={listing.title}
            className="mb-6 h-64 w-full rounded-lg object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400';
            }}
          />

          {/* Badges */}
          <div className="mb-6 flex flex-wrap gap-2">
            {isOpportunity && <Badge variant="opportunity">⭐ Opportunité</Badge>}
            {isIncomplete && <Badge variant="incomplete">⚠️ Incomplet</Badge>}
            <Badge variant="trust">Confiance: {listing.trust_score}/100</Badge>
            <Badge variant="complete">Complétude: {listing.completeness_score}%</Badge>
          </div>

          {/* Main info */}
          <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-600">Prix</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {listing.price_amount.toLocaleString()} €
              </p>
              <p className="text-xs text-gray-500">{listing.price_bucket}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Localisation</p>
              <p className="mt-1 font-semibold text-gray-900">{listing.location_micro}</p>
              <p className="text-xs text-gray-600">{listing.location_macro}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Type</p>
              <p className="mt-1 font-semibold text-gray-900">{listing.property_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Promoteur</p>
              <p className="mt-1 font-semibold text-gray-900">{listing.developer_name}</p>
            </div>
          </div>

          {/* Details */}
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-gray-900">Caractéristiques</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {listing.bedrooms && (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{listing.bedrooms} chambre(s)</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{listing.bathrooms} salle(s) d'eau</span>
                </div>
              )}
              {listing.size_building_m2 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Construction:</span>
                  <span className="text-sm text-gray-600">{listing.size_building_m2} m²</span>
                </div>
              )}
              {listing.size_land_m2 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Terrain:</span>
                  <span className="text-sm text-gray-600">{listing.size_land_m2} m²</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Meublé:</span>
                <span className="text-sm text-gray-600">{listing.furnished ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </div>

          {/* Financial */}
          {(listing.revenue_claim_annual || listing.occupancy_claim_percent) && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-3 font-semibold text-amber-900">Projections financières déclarées</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {listing.revenue_claim_annual && (
                  <div>
                    <p className="text-xs text-amber-700">Rendement annoncé</p>
                    <p className="mt-1 text-lg font-bold text-amber-900">
                      {listing.revenue_claim_annual.toLocaleString()} €/an
                    </p>
                  </div>
                )}
                {listing.occupancy_claim_percent && (
                  <div>
                    <p className="text-xs text-amber-700">Taux d'occupation déclaré</p>
                    <p className="mt-1 text-lg font-bold text-amber-900">
                      {listing.occupancy_claim_percent}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legal */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-gray-900">Statut légal déclaré</h3>
            <p className="rounded bg-gray-100 px-3 py-2 text-sm text-gray-800">
              {listing.legal_structure_claim}
            </p>
          </div>

          {/* Source info */}
          <div className="mb-6">
            <h3 className="mb-2 font-semibold text-gray-900">Source</h3>
            <p className="mb-2 text-sm text-gray-700">{listing.source_platform}</p>
            <a
              href={listing.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              Voir l'annonce originale
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Notes */}
          {listing.notes && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2 font-semibold text-gray-900">Notes</h3>
              <p className="text-sm text-gray-700">{listing.notes}</p>
            </div>
          )}

          {/* Dates */}
          <div className="mt-6 border-t pt-4 text-xs text-gray-500">
            <p>Publié: {listing.posted_at.toLocaleDateString('fr-FR')}</p>
            <p>Crawlé: {listing.scraped_at.toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
