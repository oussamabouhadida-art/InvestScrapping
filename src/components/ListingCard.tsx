'use client';

import { MapPin, Building2, Heart } from 'lucide-react';
import type { Listing } from '@/types/listing';
import { Badge } from './ui/Badge';

interface ListingCardProps {
  listing: Listing;
  onSelect: () => void;
}

export function ListingCard({ listing, onSelect }: ListingCardProps) {
  const isOpportunity = listing.trust_score >= 80 && listing.completeness_score >= 85;
  const isIncomplete = listing.completeness_score < 70;

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={listing.image_url}
          alt={listing.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400';
          }}
        />
        <div className="absolute right-2 top-2 flex flex-wrap gap-1">
          {isOpportunity && <Badge variant="opportunity">⭐ Opportunité</Badge>}
          {isIncomplete && <Badge variant="incomplete">⚠️ Incomplet</Badge>}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">{listing.title}</h3>

        {/* Location */}
        <div className="mb-3 flex items-start gap-1 text-xs text-gray-600">
          <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <div>
            <p className="font-medium">{listing.location_micro}</p>
            <p className="text-gray-500">{listing.location_macro}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3 border-t pt-3">
          <p className="text-lg font-bold text-gray-900">
            {listing.price_amount.toLocaleString()} €
          </p>
          <p className="text-xs text-gray-500">{listing.price_bucket}</p>
        </div>

        {/* Details */}
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
          <Building2 className="h-3 w-3" />
          <span>{listing.property_type}</span>
          {listing.bedrooms && <span>• {listing.bedrooms} ch</span>}
        </div>

        {/* Developer */}
        <p className="mb-3 truncate text-xs text-gray-500">{listing.developer_name}</p>

        {/* Trust & Completeness */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-8 rounded bg-gray-200"
              title={`Confiance: ${listing.trust_score}/100`}
            >
              <div
                className="h-full rounded bg-blue-500"
                style={{ width: `${listing.trust_score}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{listing.trust_score}%</span>
          </div>
          <span className="text-xs font-medium text-gray-700">{listing.source_platform}</span>
        </div>
      </div>
    </div>
  );
}
