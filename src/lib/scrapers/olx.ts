import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Listing } from '@/types/listing';

export async function scrapeOLX(): Promise<Listing[]> {
  try {
    const listings: Listing[] = [];

    // OLX searches
    const searchQueries = ['rumah bali', 'villa lombok', 'properti bali'];

    for (const query of searchQueries) {
      try {
        const url = `https://www.olx.co.id/search?q=${encodeURIComponent(query)}&c=1020`;

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 10000,
        });

        const $ = cheerio.load(response.data);

        // Try multiple selectors for OLX listing items
        const selectors = ['.evT2M', '.c2B0M', '.listing-item', 'article', '[data-testid="listing"]'];

        for (const selector of selectors) {
          if (listings.length >= 15) break; // Limit to 15 listings per query

          $(selector).slice(0, 10).each((idx, el) => {
            try {
              const $el = $(el);
              const title = $el.find('h3, a, .title').text().trim().slice(0, 100);
              const priceText = $el.find('.price, [data-testid="price"]').text().trim();
              const locationText = $el.find('.location, .place').text().trim();
              const imageUrl = $el.find('img').attr('src') || 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400';

              if (!title || !priceText) return;

              // Robust link extraction with fallback chain
              let linkEl = $el.find('a[href*="/p/"]').first().attr('href');
              if (!linkEl) {
                linkEl = $el.find('a[href*="/ads/"]').first().attr('href');
              }
              if (!linkEl) {
                linkEl = $el.find('a[href^="/"]').first().attr('href');
              }

              // Construct source URL
              let sourceUrl = url;
              if (linkEl) {
                sourceUrl = linkEl.startsWith('http') ? linkEl : `https://www.olx.co.id${linkEl}`;
              }

              // Parse price (IDR to EUR)
              let priceEur = 45000;
              if (priceText.includes('Rp') || priceText.includes('IDR')) {
                const num = parseFloat(priceText.match(/[\d.]+/)?.[0] || '0');
                priceEur = Math.round((num * 1000000) / 16000);
              }

              const location = locationText.split(',')[0]?.trim() || 'Bali';
              const isBali = title.toLowerCase().includes('bali') || location.includes('Bali');
              const locationMacro = isBali ? 'Bali' : 'Lombok';

              const listing: Listing = {
                id: `olx-${Date.now()}-${Math.random()}`,
                title,
                location_macro: locationMacro,
                location_micro: location as any,
                price_amount: priceEur,
                price_currency: 'EUR',
                price_bucket: priceEur < 50000 ? '<50k' : priceEur < 80000 ? '50-80k' : priceEur < 120000 ? '80-120k' : '120k+',
                property_type: title.includes('Studio')
                  ? 'Studio'
                  : title.includes('T3')
                    ? 'T3'
                    : title.includes('T2')
                      ? 'T2'
                      : title.includes('Villa')
                        ? 'Villa'
                        : 'T1',
                developer_name: 'OLX User (Privé)',
                source_platform: 'OLX',
                source_url: sourceUrl,
                image_url: imageUrl,
                posted_at: new Date(),
                scraped_at: new Date(),
                legal_structure_claim: 'Inconnu',
                trust_score: linkEl ? 70 : 55,
                completeness_score: linkEl ? 70 : 50,
                status: 'active',
              };

              listings.push(listing);
            } catch (e) {
              // Ignore individual listing errors
            }
          });
        }
      } catch (e) {
        console.error(`[OLX] Query "${query}" error:`, e instanceof Error ? e.message : e);
      }
    }

    return listings;
  } catch (error) {
    console.error('[OLX] Global error:', error);
    return [];
  }
}
