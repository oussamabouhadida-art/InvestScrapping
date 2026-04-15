/**
 * Liste exhaustive des sources de scraping à tester pour la V2
 * Classée par difficulté et stratégie d'extraction
 */

export type SourceType = 'real-estate-portal' | 'agency-site' | 'marketplace' | 'social-media' | 'manual-import';
export type ScrapingDifficulty = 'easy' | 'medium' | 'hard' | 'very-hard' | 'manual-only';
export type ContentType = 'html-simple' | 'html-complex' | 'spa-dynamic' | 'api-public' | 'requires-auth';

export interface ScrapingSource {
  id: string;
  name: string;
  url: string;
  sourceType: SourceType;
  geoScope: string[];
  likelyContentType: ContentType;
  scrapingDifficulty: ScrapingDifficulty;
  requiresBrowser: boolean;
  estimatedListingsPerMonth: number;
  notes: string;
  extractionStrategy: string;
  cssSelectors?: Record<string, string>;
  apiEndpoint?: string;
  status: 'not-started' | 'in-progress' | 'working' | 'blocked' | 'deprecated' | 'manual-only';
}

export const scrapingSources: ScrapingSource[] = [
  // ========== PORTAILS INDONÉSIENS (PRIORITÉ HAUTE) ==========
  {
    id: 'rumah123-main',
    name: 'Rumah123 - Accueil',
    url: 'https://www.rumah123.com',
    sourceType: 'real-estate-portal',
    geoScope: ['Bali', 'Lombok', 'Indonesia'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 500,
    notes: 'Principal portail immobilier indonésien. SEO-friendly, listings en HTML. Pagination simple.',
    extractionStrategy: 'Cheerio avec user-agent. Parser les cartes listing et extraire URLs détail. Followup sur pages détail pour infos complètes.',
    cssSelectors: {
      listing: '.ceWdAk, .listing-item',
      title: 'h3, a.title',
      price: '[data-testid="price"], .price',
      location: '[data-testid="location"], .location',
      image: 'img',
      link: 'a[href*="/properti/"]',
    },
    status: 'working',
  },
  {
    id: 'rumah123-lombok-tengah',
    name: 'Rumah123 - Lombok Tengah',
    url: 'https://www.rumah123.com/jual/lombok-tengah/rumah/',
    sourceType: 'real-estate-portal',
    geoScope: ['Lombok Tengah'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 50,
    notes: 'Recherche pré-filtrée Lombok. Pagination dynamique possible.',
    extractionStrategy: 'Cheerio avec pagination. Boucle sur /page/2, /page/3, etc.',
    status: 'not-started',
  },
  {
    id: 'rumah123-lombok-barat',
    name: 'Rumah123 - Lombok Barat',
    url: 'https://www.rumah123.com/jual/lombok-barat/residensial/',
    sourceType: 'real-estate-portal',
    geoScope: ['Lombok Barat'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 40,
    notes: 'Résidentiel uniquement. Filtre géographique Lombok Barat.',
    extractionStrategy: 'Cheerio. Même approche que Lombok Tengah.',
    status: 'not-started',
  },
  {
    id: 'rumah123-badung-lombok-residential',
    name: 'Rumah123 - Badung (Lombok) Residential',
    url: 'https://www.rumah123.com/en/sale/badung/lombok/all-residential/',
    sourceType: 'real-estate-portal',
    geoScope: ['Badung', 'Lombok'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 100,
    notes: 'Version anglaise. Résidentiel. Badung est zone touristique premium.',
    extractionStrategy: 'Cheerio. Chercher variantes de sélecteurs CSS (version EN).',
    status: 'not-started',
  },
  {
    id: 'rumah123-badung-lombok-land',
    name: 'Rumah123 - Badung (Lombok) Terrains',
    url: 'https://www.rumah123.com/jual/badung/lombok/tanah/',
    sourceType: 'real-estate-portal',
    geoScope: ['Badung', 'Lombok'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 50,
    notes: 'Terrains à bâtir. Marché d\'investissement important à Badung.',
    extractionStrategy: 'Cheerio. Filtre "tanah" (terrain).',
    status: 'not-started',
  },

  // ========== AGENCES SPÉCIALISÉES BALI (PRIORITÉ HAUTE) ==========
  {
    id: 'bali-home-immo',
    name: 'Bali Home Immo',
    url: 'https://bali-home-immo.com',
    sourceType: 'agency-site',
    geoScope: ['Bali'],
    likelyContentType: 'html-simple',
    scrapingDifficulty: 'easy',
    requiresBrowser: false,
    estimatedListingsPerMonth: 30,
    notes: 'Agence française spécialisée Bali. Site statique, HTML propre. Portfolio petit mais premium.',
    extractionStrategy: 'Cheerio. Chercher page "listings" ou "properties". Probabilité: /properties/, /portfolios/, /for-sale/.',
    status: 'not-started',
  },
  {
    id: 'raywhite-kuta',
    name: 'Ray White - Kuta',
    url: 'https://raywhitekuta.com',
    sourceType: 'agency-site',
    geoScope: ['Kuta', 'Bali'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 100,
    notes: 'Agence premium Bali. Moderne, SPA. Listings en JS client. Nécessite Playwright ou Puppeteer.',
    extractionStrategy: 'Playwright avec navigation. Attendre dom.ready. Parser les cartes listing dynamiques.',
    apiEndpoint: 'Possible API JSON si on regarde les requêtes Network',
    status: 'not-started',
  },
  {
    id: 'raywhite-kuta-for-sale',
    name: 'Ray White - Kuta (For Sale)',
    url: 'https://raywhitekuta.com/for-sale/',
    sourceType: 'agency-site',
    geoScope: ['Kuta', 'Bali'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 50,
    notes: 'Sous-catégorie "Vente". Même infra que raywhitekuta.com',
    extractionStrategy: 'Playwright. Possibilité API derrière les requêtes XHR.',
    status: 'not-started',
  },
  {
    id: 'exotiq-property-bali',
    name: 'Exotiq Property - Bali',
    url: 'https://www.exotiqproperty.com/property-for-sale/bali',
    sourceType: 'agency-site',
    geoScope: ['Bali'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 80,
    notes: 'Agence spécialisée villas/propriétés premium. Listings en grille HTML. Pagination probable.',
    extractionStrategy: 'Cheerio. Pagination /page/2, /page/3. Pagination possible en params ?page=2.',
    status: 'not-started',
  },

  // ========== MARKETPLACES INTERNATIONALES (PRIORITÉ MOYENNE) ==========
  {
    id: 'fazwaz-id-main',
    name: 'Fazwaz.id - Accueil',
    url: 'https://www.fazwaz.id',
    sourceType: 'marketplace',
    geoScope: ['Indonesia', 'Bali', 'Lombok'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 300,
    notes: 'Marketplace international, listings Bali/Lombok. SPA moderne. Load infini ou pagination dyn.',
    extractionStrategy: 'Playwright. Scroll/pagination. Vérifier si pagination classique ou infinite scroll.',
    status: 'not-started',
  },
  {
    id: 'fazwaz-id-rent',
    name: 'Fazwaz.id - Location Propriétés',
    url: 'https://www.fazwaz.id/property-for-rent/indonesia',
    sourceType: 'marketplace',
    geoScope: ['Indonesia'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 200,
    notes: 'Sous-catégorie location. Intéressant pour comprendre rendements.',
    extractionStrategy: 'Playwright. Pagination dynamique.',
    status: 'not-started',
  },
  {
    id: 'arkadia-lombok',
    name: 'Arkadia.com - Lombok (Vente)',
    url: 'https://fr.arkadia.com/vente/lombok-g3996/',
    sourceType: 'marketplace',
    geoScope: ['Lombok'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 30,
    notes: 'Portail français pour ventes Lombok. Listings en HTML. Pagination possible.',
    extractionStrategy: 'Cheerio. Parser structure Arkadia (sélecteurs CSS uniques).',
    status: 'not-started',
  },
  {
    id: 'tranio-lombok',
    name: 'Tranio.fr - Lombok',
    url: 'https://tranio.fr/indonesia/nusa_tenggara_barat/lombok/',
    sourceType: 'marketplace',
    geoScope: ['Lombok'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 20,
    notes: 'Plateforme d\'investissement. Contenu curé (moins d\'annonces mais qualité). SEO-friendly.',
    extractionStrategy: 'Cheerio. Structure probablement propre et sémantique.',
    status: 'not-started',
  },
  {
    id: 'expat-com-indonesia',
    name: 'Expat.com - Immobilier Indonésie',
    url: 'https://www.expat.com/fr/immobilier/asie/indonesie/',
    sourceType: 'marketplace',
    geoScope: ['Indonesia', 'Bali', 'Lombok'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'medium',
    requiresBrowser: false,
    estimatedListingsPerMonth: 50,
    notes: 'Communauté expats. Contenu mixte (pro + particuliers). Qualité variable.',
    extractionStrategy: 'Cheerio. Chercher /page/2, offset, ou search params pour pagination.',
    status: 'not-started',
  },
  {
    id: 'airbnb-lombok',
    name: 'Airbnb - Lombok (Stays)',
    url: 'https://www.airbnb.co.id/pulau-lombok-indonesia/stays',
    sourceType: 'marketplace',
    geoScope: ['Lombok'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'very-hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 1000,
    notes: 'Airbnb Indonesia. SPA très avancée, rate-limiting agressif. Données utiles pour rendements locatifs.',
    extractionStrategy: 'Pas de scraping direct (risque de ban). Alternative: API non-officielle (dathousing) ou import manuel des listings intéressants.',
    status: 'blocked',
  },

  // ========== SOURCES MANUELLES / FUTURES (PRIORITÉ BASSE) ==========
  {
    id: 'facebook-pages',
    name: 'Facebook - Pages Immobilières (Manuel)',
    url: 'https://www.facebook.com',
    sourceType: 'social-media',
    geoScope: ['Bali', 'Lombok'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'very-hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 200,
    notes: 'Bot detection agressif. Recommandé: import manuel ou webhook collaboratif (promoteurs postent chez nous).',
    extractionStrategy: 'MANUEL: Intégration formulaire où les promoteurs/agences postent leurs offres Facebook directement.',
    status: 'manual-only',
  },
  {
    id: 'instagram-hashtags',
    name: 'Instagram - Hashtags Immobilier (Manuel)',
    url: 'https://www.instagram.com',
    sourceType: 'social-media',
    geoScope: ['Bali', 'Lombok'],
    likelyContentType: 'spa-dynamic',
    scrapingDifficulty: 'very-hard',
    requiresBrowser: true,
    estimatedListingsPerMonth: 300,
    notes: 'Meta API très restrictive. Scraping ban assuré. Recommandé: formulaire de soumission.',
    extractionStrategy: 'MANUEL: Bouton "Ajouter offre Instagram" → utilisateur copie lien/description.',
    status: 'manual-only',
  },
  {
    id: 'olx-indonesia',
    name: 'OLX Indonesia - Classifieds',
    url: 'https://www.olx.co.id',
    sourceType: 'marketplace',
    geoScope: ['Indonesia', 'Bali', 'Lombok'],
    likelyContentType: 'html-complex',
    scrapingDifficulty: 'hard',
    requiresBrowser: false,
    estimatedListingsPerMonth: 1000,
    notes: 'Classifieds locales. Beaucoup de bruit (particuliers). Qualité basse. Rate-limiting modéré.',
    extractionStrategy: 'Chercher API backend ou Cheerio avec pagination. Filtres geo/prix intégrés: ?q=properti+bali',
    status: 'in-progress',
  },
];

/**
 * Configuration groupée par stratégie d'extraction
 */
export const sourcesByStrategy = {
  cheerio_simple: scrapingSources.filter(
    (s) => s.scrapingDifficulty === 'easy' && !s.requiresBrowser
  ),
  cheerio_complex: scrapingSources.filter(
    (s) => ['medium', 'hard'].includes(s.scrapingDifficulty) && !s.requiresBrowser
  ),
  playwright_required: scrapingSources.filter((s) => s.requiresBrowser),
  manual_only: scrapingSources.filter((s) => s.status === 'manual-only'),
  currently_working: scrapingSources.filter((s) => s.status === 'working'),
  blocked: scrapingSources.filter((s) => s.status === 'blocked'),
};

/**
 * Priorités d'implémentation recommandées
 */
export const implementationPriority = [
  'rumah123-main',              // V2.0 - Fondation
  'bali-home-immo',             // V2.0 - Agence de confiance
  'exotiq-property-bali',       // V2.0 - Premium villas
  'tranio-lombok',              // V2.1 - Investisseurs pros
  'fazwaz-id-main',             // V2.2 - Marketplace (Playwright)
  'raywhite-kuta',              // V2.2 - Agence premium (Playwright)
  'arkadia-lombok',             // V2.3 - Couverture internationale
  'expat-com-indonesia',        // V2.3 - Contenu communauté
  'olx-indonesia',              // V2.4 - Couverture masse (bruyant)
  'fazwaz-id-rent',             // V3.0 - Rendements locatifs
  'airbnb-lombok',              // Futur - Import manuel via CSV
  'facebook-pages',             // Futur - Formulaire collaboratif
  'instagram-hashtags',         // Futur - Formulaire collaboratif
];

/**
 * Métadonnées pour UI "Sources Management"
 */
export const sourceMetrics = {
  total: scrapingSources.length,
  working: scrapingSources.filter((s) => s.status === 'working').length,
  inProgress: scrapingSources.filter((s) => s.status === 'in-progress').length,
  notStarted: scrapingSources.filter((s) => s.status === 'not-started').length,
  blocked: scrapingSources.filter((s) => s.status === 'blocked').length,
  manualOnly: scrapingSources.filter((s) => s.status === 'manual-only').length,
  estimatedTotalListingsPerMonth: scrapingSources.reduce(
    (sum, s) => sum + s.estimatedListingsPerMonth,
    0
  ),
};
