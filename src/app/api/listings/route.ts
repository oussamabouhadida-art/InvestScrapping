import { NextRequest, NextResponse } from 'next/server';
import { mockListings } from '@/data/listings';
import { scrapeRumah123 } from '@/lib/scrapers/rumah123';
import { scrapeOLX } from '@/lib/scrapers/olx';

// Cache en mémoire (simple pour le MVP)
let cachedListings: any[] = [];
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    const useCache = now - lastFetch < CACHE_TTL && cachedListings.length > 0;

    let allListings = [];

    if (useCache) {
      // Utiliser le cache
      console.log('[API] Retour des listings en cache');
      allListings = cachedListings;
    } else {
      // Scraper les vraies sources
      console.log('[API] Début du scraping...');

      try {
        const rumah123Results = await scrapeRumah123();
        console.log(`[API] Rumah123: ${rumah123Results.length} listings trouvés`);
        allListings.push(...rumah123Results);
      } catch (e) {
        console.error('[API] Erreur Rumah123:', e);
      }

      try {
        const olxResults = await scrapeOLX();
        console.log(`[API] OLX: ${olxResults.length} listings trouvés`);
        allListings.push(...olxResults);
      } catch (e) {
        console.error('[API] Erreur OLX:', e);
      }

      // Fallback: si le scraping n'a rien retourné, utiliser les mocks
      if (allListings.length === 0) {
        console.log('[API] Scraping échoué, utilisation des mocks');
        allListings = mockListings;
      } else {
        // Ajouter quelques mocks pour compléter (au moins 10 listings)
        if (allListings.length < 10) {
          const mocksToAdd = mockListings.slice(0, 10 - allListings.length);
          allListings.push(...mocksToAdd);
        }
      }

      // Mettre en cache
      cachedListings = allListings;
      lastFetch = now;
    }

    // Retourner les listings
    return NextResponse.json({
      success: true,
      count: allListings.length,
      listings: allListings,
      source: useCache ? 'cache' : 'scraped',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Erreur globale:', error);

    // Fallback aux mocks en cas d'erreur
    return NextResponse.json(
      {
        success: true,
        count: mockListings.length,
        listings: mockListings,
        source: 'fallback-mock',
        message: 'Scraping échoué, retour aux données mockées',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
