'use client';

import { scrapingSources, sourceMetrics } from '@/data/sources';
import { Badge } from './ui/Badge';

export function SourcesStatus() {
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      hard: 'bg-amber-100 text-amber-800',
      'very-hard': 'bg-red-100 text-red-800',
      'manual-only': 'bg-gray-100 text-gray-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'not-started': 'incomplete',
      'in-progress': 'opportunity',
      working: 'complete',
      blocked: 'incomplete',
      deprecated: 'incomplete',
    };
    return variants[status] || 'incomplete';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Sources de Scraping</h1>
          <p className="mt-2 text-gray-600">V2 Roadmap — 15 sources à intégrer progressivement</p>
        </div>

        {/* Métriques */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{sourceMetrics.total}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-xs text-green-700">Working</p>
            <p className="mt-1 text-2xl font-bold text-green-900">{sourceMetrics.working}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs text-blue-700">In Progress</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">{sourceMetrics.inProgress}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-700">Not Started</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{sourceMetrics.notStarted}</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-xs text-red-700">Blocked</p>
            <p className="mt-1 text-2xl font-bold text-red-900">{sourceMetrics.blocked}</p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs text-purple-700">Est. Listings/mois</p>
            <p className="mt-1 text-2xl font-bold text-purple-900">
              {sourceMetrics.estimatedTotalListingsPerMonth.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Difficulté</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Browser?</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Est./mois</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {scrapingSources.map((source) => (
                <tr key={source.id} className="border-b border-gray-100 transition hover:bg-blue-50">
                  <td className="px-4 py-3">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {source.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{source.sourceType}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{source.geoScope.join(', ')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getDifficultyColor(source.scrapingDifficulty)}`}>
                      {source.scrapingDifficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs">
                    {source.requiresBrowser ? '✓' : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">
                    {source.estimatedListingsPerMonth.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadge(source.status)}>
                      {source.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">📋 Stratégies d'extraction par source</h3>
          <div className="mt-4 space-y-4 text-sm text-blue-800">
            <div>
              <p className="font-medium">🟢 Easy (Cheerio simple)</p>
              <p className="text-xs text-blue-700">Rumah123, Bali Home Immo → HTML propre, pas de JS</p>
            </div>
            <div>
              <p className="font-medium">🔵 Medium (Cheerio + pagination)</p>
              <p className="text-xs text-blue-700">
                Exotiq, Arkadia, Tranio, OLX → HTML complexe, pagination classique
              </p>
            </div>
            <div>
              <p className="font-medium">🟠 Hard (Playwright + JS)</p>
              <p className="text-xs text-blue-700">Ray White, Fazwaz, Airbnb → SPA, contenu dynamique</p>
            </div>
            <div>
              <p className="font-medium">🔴 Manual Only (Formulaire)</p>
              <p className="text-xs text-blue-700">Facebook, Instagram → Bot detection. Import via formulaire collaboratif.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
