import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Listing } from '@/types/listing';

export async function scrapeRumah123(): Promise<Listing[]> {
  try {
    const listings: Listing[] = [];

    // Recherche pour "studio bali" et "villa lombok"
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

        // Sélecteur pour les cartes de propriété (peut varier)
        $('.ceWdAk, .listing-card, [data-testid="card"]').slice(0, 5).each((idx, el) => {
          try {
            const title = $(el).find('a, h3').text().trim().slice(0, 100);
            const priceText = $(el).find('[data-testid="price"], .price').text().trim();
            const locationText = $(el).find('[data-testid="location"], .location').text().trim();
            const linkEl = $(el).find('a[href*="/properti/"]').attr('href');
            const imageUrl = $(el).find('img').attr('src') || 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400';

            if (!title || !priceText) return;

            // Parser le prix (format: "Rp 5.000.000.000" ou "IDR 5B")
            let priceEur = 50000; // Default fallback
            if (priceText.includes('M') || priceText.includes('Miliar')) {
              const num = parseFloat(priceText.match(/[\d.]+/)?.[0] || '0');
              priceEur = Math.round(num * 1000000 / 16000); // Conversion IDR to EUR (rough)
            }

            const location = locationText.split(',')[0]?.trim() || 'Bali';
            const isBali = title.toLowerCase().includes('bali') || location.includes('Bali');
            const locationMacro = isBali ? 'Bali' : 'Lombok';

            const listing: Listing = {
              id: `rumah123-${idx}-${Date.now()}`,
              title,
              location_macro: locationMacro,
              location_micro: location as any,
              price_amount: priceEur,
              price_currency: 'EUR',
              price_bucket: priceEur < 50000 ? '<50k' : priceEur < 80000 ? '50-80k' : priceEur < 120000 ? '80-120k' : '120k+',
              property_type: title.includes('Studio') ? 'Studio' : title.includes('T3') ? 'T3' : title.includes('T2') ? 'T2' : title.includes('Villa') ? 'Villa' : 'Autre',
              developer_name: 'Rumah123 User',
              source_platform: 'Rumah123',
              source_url: linkEl ? `https://www.rumah123.com${linkEl}` : url,
              image_url: imageUrl,
              posted_at: new Date(),
              scraped_at: new Date(),
              legal_structure_claim: 'Inconnu',
              trust_score: 65,
              completeness_score: 60,
              status: 'active',
            };

            listings.push(listing);
          } catch (e) {
            // Ignore parsing errors for individual listings
          }
        });
      } catch (e) {
        console.error(`Error scraping Rumah123 for "${query}":`, e);
      }
    }

    return listings;
  } catch (error) {
    console.error('Rumah123 scraper error:', error);
    return [];
  }
}
