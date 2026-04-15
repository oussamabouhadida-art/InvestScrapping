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

        // OLX listing items
        $('.evT2M, .listing-item, article').slice(0, 5).each((idx, el) => {
          try {
            const title = $(el).find('h3, a, .title').text().trim().slice(0, 100);
            const priceText = $(el).find('.price, [data-testid="price"]').text().trim();
            const locationText = $(el).find('.location, .place').text().trim();
            const linkEl = $(el).find('a[href*="/p/"]').attr('href');
            const imageUrl = $(el).find('img').attr('src') || 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=500&h=400';

            if (!title || !priceText) return;

            // Parse price
            let priceEur = 45000;
            if (priceText.includes('Rp') || priceText.includes('IDR')) {
              const num = parseFloat(priceText.match(/[\d.]+/)?.[0] || '0');
              priceEur = Math.round(num * 1000000 / 16000);
            }

            const location = locationText.split(',')[0]?.trim() || 'Bali';
            const isBali = title.toLowerCase().includes('bali') || location.includes('Bali');
            const locationMacro = isBali ? 'Bali' : 'Lombok';

            const listing: Listing = {
              id: `olx-${idx}-${Date.now()}`,
              title,
              location_macro: locationMacro,
              location_micro: location as any,
              price_amount: priceEur,
              price_currency: 'EUR',
              price_bucket: priceEur < 50000 ? '<50k' : priceEur < 80000 ? '50-80k' : priceEur < 120000 ? '80-120k' : '120k+',
              property_type: 'Autre',
              developer_name: 'OLX User (Privé)',
              source_platform: 'OLX',
              source_url: linkEl ? (linkEl.startsWith('http') ? linkEl : `https://www.olx.co.id${linkEl}`) : url,
              image_url: imageUrl,
              posted_at: new Date(),
              scraped_at: new Date(),
              legal_structure_claim: 'Inconnu',
              trust_score: 60,
              completeness_score: 50,
              status: 'active',
            };

            listings.push(listing);
          } catch (e) {
            // Ignore individual parsing errors
          }
        });
      } catch (e) {
        console.error(`Error scraping OLX for "${query}":`, e);
      }
    }

    return listings;
  } catch (error) {
    console.error('OLX scraper error:', error);
    return [];
  }
}
