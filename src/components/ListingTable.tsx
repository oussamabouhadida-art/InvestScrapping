'use client';

import { ExternalLink } from 'lucide-react';
import type { Listing, SortOption } from '@/types/listing';
import { Badge } from './ui/Badge';

interface ListingTableProps {
  listings: Listing[];
  onSort: (sort: SortOption) => void;
  currentSort: SortOption;
  onSelectListing: (listing: Listing) => void;
}

export function ListingTable({ listings, onSort, currentSort, onSelectListing }: ListingTableProps) {
  const handleHeaderClick = (field: SortOption['field']) => {
    if (currentSort.field === field) {
      onSort({
        field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      onSort({ field, direction: 'desc' });
    }
  };

  const SortIcon = ({ field }: { field: SortOption['field'] }) => {
    if (currentSort.field !== field) return <span className="text-gray-300">⇅</span>;
    return <span>{currentSort.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  const columnClasses =
    'px-4 py-2 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100';

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className={columnClasses} onClick={() => handleHeaderClick('title')}>
              <div className="flex items-center gap-2">
                Bien <SortIcon field="title" />
              </div>
            </th>
            <th className={columnClasses}>Localisation</th>
            <th className={columnClasses} onClick={() => handleHeaderClick('price')}>
              <div className="flex items-center gap-2">
                Prix <SortIcon field="price" />
              </div>
            </th>
            <th className={columnClasses}>Type</th>
            <th className={columnClasses}>Promoteur</th>
            <th className={columnClasses}>Source</th>
            <th className={columnClasses} onClick={() => handleHeaderClick('trust_score')}>
              <div className="flex items-center gap-2">
                Confiance <SortIcon field="trust_score" />
              </div>
            </th>
            <th className={columnClasses} onClick={() => handleHeaderClick('posted_at')}>
              <div className="flex items-center gap-2">
                Date <SortIcon field="posted_at" />
              </div>
            </th>
            <th className={columnClasses}>Lien</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className="cursor-pointer border-b border-gray-100 transition hover:bg-blue-50"
            >
              <td className="px-4 py-3">
                <p className="line-clamp-2 text-sm font-medium text-gray-900">{listing.title}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium">{listing.location_micro}</p>
                  <p className="text-xs text-gray-500">{listing.location_macro}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-sm font-bold text-gray-900">
                  {listing.price_amount.toLocaleString()} €
                </p>
                <p className="text-xs text-gray-500">{listing.price_bucket}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{listing.property_type}</td>
              <td className="px-4 py-3 text-xs text-gray-600">
                <span className="line-clamp-1">{listing.developer_name}</span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">{listing.source_platform}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-12 rounded bg-gray-200">
                    <div
                      className="h-full rounded bg-blue-500"
                      style={{ width: `${listing.trust_score}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{listing.trust_score}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">
                {listing.posted_at.toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3">
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
