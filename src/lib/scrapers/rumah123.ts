import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Listing } from '@/types/listing';

export async function scrapeRumah123(): Promise<Listing[]> {
  try {
    const listings: Listing[] = [];
    const searchQueries = ['studio bali', 'villa lombok', 't2 bali'];

    for (const query of searchQueries) {
      try {
        const url = `https://www.rumah123.com/properti/dijual/?searchText=${encodeURIComponent(query)}`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 10000,
        });

        const $ = cheerio.load(response.data);

        // Essayer plusieurs sélecteurs car la structure peut varier
        const selectors = ['.ceWdAk', '.listing-card', '[data-testid="card"]', 'article'];

        for (const selector of selectors) {
          if (listings.length >= 15) break; // Limiter à 15 listings par requête

          $(selector).slice(0, 10).each((idx, el) => {
            try {
              const $el = $(el);
              const titleText = $el.find('h3, a, .title').first().text().trim().slice(0, 100);
              const priceText = $el.find('[data-testid="price"], .price').text().trim();
              const locationText = $el.find('[data-testid="location"], .location').text().trim();

              if (!titleText || !priceText) return;

              // Chercher le lien de manière robuste
              let linkEl = $el.find('a[href*="/properti/"]').first().attr('href');
              if (!linkEl) {
                linkEl = $el.find('a[href*="/jual/"]').first().attr('href');
              }
              if (!linkEl) {
                linkEl = $el.find('a[href^="/"]').first().attr('href');
              }

              // Construire l'URL source
              let sourceUrl = url;
              if (linkEl) {
                sourceUrl = linkEl.startsWith('http') ? linkEl : `https://www.rumah123.com${linkEl}`;
              }

              // Parser le prix (IDR à EUR)
              let priceEur = 50000;
              if (priceText.includes('M') || priceText.includes('Miliar')) {
                const num = parseFloat(priceText.match(/[\d.]+/)?.[0] || '0');
                priceEur = Math.round((num * 1000000) / 16000);
              }

              const location = locationText.split(',')[0]?.trim() || 'Bali';
              const locationMacro = titleText.toLowerCase().includes('lombok') || location.includes('Lombok') ? 'Lombok' : 'Bali';

              const listing: Listing = {
                id: `rumah123-${Date.now()}-${Math.random()}`,
                title: titleText,
                location_macro: locationMacro,
                location_micro: location as any,
                price_amount: priceEur,
                price_currency: 'EUR',
                price_bucket:
                  priceEur < 50000 ? '<50k' : priceEur < 80000 ? '50-80k' : priceEur < 120000 ? '80-120k' : '120k+',
                property_type: titleText.includes('Studio')
                  ? 'Studio'
                  : titleText.includes('T3')
                    ? 'T3'
                    : titleText.includes('T2')
                      ? 'T2'
                      : titleText.includes('Villa')
                        ? 'Villa'
                        : 'T1',
                developer_name: 'Rumah123 User',
                source_platform: 'Rumah123',
                source_url: sourceUrl,
                image_url: $el.find('img').first().attr('src') || 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400',
                posted_at: new Date(),
                scraped_at: new Date(),
                legal_structure_claim: 'Inconnu',
                trust_score: linkEl ? 75 : 60,
                completeness_score: linkEl ? 80 : 55,
                status: 'active',
              };

              listings.push(listing);
            } catch (e) {
              // Ignore individual listing errors
            }
          });
        }
      } catch (e) {
        console.error(`[Rumah123] Query "${query}" error:`, e instanceof Error ? e.message : e);
      }
    }

    return listings;
  } catch (error) {
    console.error('[Rumah123] Global error:', error);
    return [];
  }
}
