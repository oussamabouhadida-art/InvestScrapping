'use client';

import { ChevronDown } from 'lucide-react';
import type { FilterState, LocationMacro, LocationMicro, PropertyType, SourcePlatform } from '@/types/listing';
import { LOCATIONS_MACRO, LOCATIONS_MICRO, PROPERTY_TYPES, SOURCE_PLATFORMS } from '@/data/constants';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleLocationMacroChange = (loc: LocationMacro) => {
    const updated = filters.location_macros.includes(loc)
      ? filters.location_macros.filter((l) => l !== loc)
      : [...filters.location_macros, loc];
    onFiltersChange({ ...filters, location_macros: updated });
  };

  const handleLocationMicroChange = (loc: LocationMicro) => {
    const updated = filters.location_micros.includes(loc)
      ? filters.location_micros.filter((l) => l !== loc)
      : [...filters.location_micros, loc];
    onFiltersChange({ ...filters, location_micros: updated });
  };

  const handlePropertyTypeChange = (type: PropertyType) => {
    const updated = filters.property_types.includes(type)
      ? filters.property_types.filter((t) => t !== type)
      : [...filters.property_types, type];
    onFiltersChange({ ...filters, property_types: updated });
  };

  const handleSourceChange = (source: SourcePlatform) => {
    const updated = filters.source_platforms.includes(source)
      ? filters.source_platforms.filter((s) => s !== source)
      : [...filters.source_platforms, source];
    onFiltersChange({ ...filters, source_platforms: updated });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      [type === 'min' ? 'price_min' : 'price_max']: value,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid gap-4 md:grid-cols-5">
        {/* Zone Macro */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Zone macro</label>
          <div className="space-y-2">
            {LOCATIONS_MACRO.map((loc) => (
              <label key={loc} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.location_macros.includes(loc)}
                  onChange={() => handleLocationMacroChange(loc)}
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                />
                {loc}
              </label>
            ))}
          </div>
        </div>

        {/* Zone Micro */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Zone micro</label>
          <select
            multiple
            value={filters.location_micros}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) => opt.value as LocationMicro);
              onFiltersChange({ ...filters, location_micros: selected });
            }}
            className="w-full rounded border border-gray-300 bg-white p-2 text-sm"
            size={4}
          >
            {Object.values(LOCATIONS_MICRO)
              .flat()
              .map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
        </div>

        {/* Type de bien */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Type</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {PROPERTY_TYPES.slice(0, 5).map((type) => (
              <label key={type} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.property_types.includes(type)}
                  onChange={() => handlePropertyTypeChange(type)}
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Source</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {SOURCE_PLATFORMS.slice(0, 5).map((source) => (
              <label key={source} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={filters.source_platforms.includes(source)}
                  onChange={() => handleSourceChange(source)}
                  className="mr-2 h-4 w-4 rounded border-gray-300"
                />
                {source}
              </label>
            ))}
          </div>
        </div>

        {/* Prix */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Prix (€)</label>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-600">Min</label>
              <input
                type="number"
                value={filters.price_min}
                onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max</label>
              <input
                type="number"
                value={filters.price_max}
                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
