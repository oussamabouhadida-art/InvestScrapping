# Veille Immobilière — Dashboard Bali & Lombok

MVP de dashboard d'agrégation et comparaison d'offres immobilières en Indonésie (Bali & Lombok).

## 📋 Fonctionnalités V1

- ✅ Page unique avec 18 offres mockées (réalistes)
- ✅ Filtres avancés (zone, prix, type de bien, source)
- ✅ 4 KPIs en haut (nombre d'offres, prix médian, nouvelles, incomplètes)
- ✅ 2 vues : grille (cartes visuelles) + tableau (comparaison)
- ✅ Recherche texte temps réel
- ✅ Tri par prix, date, confiance, localisation
- ✅ Fiche détail (drawer) avec infos complètes
- ✅ Badges d'opportunité, d'incomplétude, de confiance
- ✅ Design responsive (mobile + desktop)
- ✅ Code prêt à déployer sur Vercel

## 🏗️ Stack

- **Frontend** : Next.js 15 + TypeScript + Tailwind CSS 3.4
- **Data** : Données mockées en TypeScript (src/data/listings.ts)
- **Composants** : Réutilisables, modulaires, sans dépendances externes lourdes
- **Icons** : lucide-react

## 🚀 Lancement local

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation & lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de dev
npm run dev

# Ouvrir http://localhost:3333 dans le navigateur
```

Le serveur redémarrera automatiquement à chaque modification de fichier.

## 📁 Architecture du projet

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Page d'accueil (unique)
│   └── globals.css         # Styles globaux + Tailwind
├── components/
│   ├── Dashboard.tsx       # Orchestrateur principal
│   ├── FilterPanel.tsx     # Panneau filtres
│   ├── SearchBar.tsx       # Recherche texte
│   ├── ListingCard.tsx     # Carte offre (vue grille)
│   ├── ListingTable.tsx    # Table comparatif
│   ├── ListingDetail.tsx   # Drawer détail
│   ├── KPIBox.tsx          # Box KPI unique
│   └── ui/
│       └── Badge.tsx       # Tags badge
├── data/
│   ├── listings.ts         # 18 offres mockées
│   └── constants.ts        # Zones, types, sources
├── types/
│   └── listing.ts          # TypeScript interfaces
├── lib/
│   └── cn.ts               # Utilitaire Tailwind
└── hooks/
    └── useListingFilters.ts # Logic filtrage + tri
```

## 🔄 Workflow de développement

### Ajouter une nouvelle offre

Éditer `src/data/listings.ts` et ajouter un objet à `mockListings`:

```typescript
{
  id: 'XXX',
  title: 'Votre titre',
  location_macro: 'Bali',
  location_micro: 'Votre zone',
  price_amount: 50000,
  price_currency: 'EUR',
  price_bucket: '50-80k',
  // ... autres champs
}
```

### Modifier les constantes (zones, types, sources)

Éditer `src/data/constants.ts` pour ajouter/retirer des valeurs dans les listes.

### Ajouter un nouveau filtre

1. Ajouter le champ dans `FilterState` (src/types/listing.ts)
2. Ajouter la logique dans `useListingFilters.ts`
3. Ajouter le contrôle dans `FilterPanel.tsx`

## 🌐 Déploiement sur Vercel

### Approche rapide (CLI)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter (une seule fois)
vercel login

# 3. Déployer (depuis la racine du projet)
vercel --prod
```

### Approche GitHub

1. Pusher ce repo sur GitHub
2. Connecter le repo dans https://vercel.com
3. Vercel détecte automatiquement Next.js et déploie
4. À chaque push, redéploiement automatique

## 🔮 Roadmap futur V2+

### Scraping & Ingestion
- [ ] Importer offres depuis Properti.com
- [ ] Importer depuis Rumah123
- [ ] Scraper Facebook/Instagram publics
- [ ] Crawler OLX
- [ ] Agréger & dédupliquer les offres

### Base de données
- [ ] Connecter Supabase PostgreSQL
- [ ] Historique des offres (prix, statut)
- [ ] Alertes quand prix baisse
- [ ] Export CSV des résultats filtrés

### Fonctionnalités
- [ ] Favoris / Shortlist (localStorage ou DB)
- [ ] Scoring auto des offres (complétude, confiance)
- [ ] Comparaison side-by-side de 2-3 offres
- [ ] Rendement annualisé calculé automatiquement
- [ ] Cartes (Leaflet) pour visualiser par zone
- [ ] Historique de prix / tendances
- [ ] Notes privées par offre

### Auth & Partage
- [ ] Authentification (Clerk / Auth0)
- [ ] Partager une selection d'offres
- [ ] Tableurs partagés (lien collaboratif)
- [ ] Notifications email des nouvelles offres

### UX
- [ ] Dark mode persistant
- [ ] Thème customisable
- [ ] Internationalization (français/english)
- [ ] Mobile app (React Native)

## 📊 Schéma de données (Listing)

| Champ | Type | Exemple |
|-------|------|---------|
| `id` | string | '1' |
| `title` | string | 'Studio Canggu vue mer' |
| `location_macro` | 'Bali' \| 'Lombok' | 'Bali' |
| `location_micro` | string | 'Canggu' |
| `price_amount` | number | 42000 |
| `price_currency` | 'EUR' \| 'USD' \| 'IDR' | 'EUR' |
| `price_bucket` | '<50k' \| '50-80k' \| '80-120k' \| '120k+' | '<50k' |
| `property_type` | string | 'Studio', 'T2', 'Villa' |
| `bedrooms` | number? | 1 |
| `bathrooms` | number? | 1 |
| `size_building_m2` | number? | 45 |
| `size_land_m2` | number? | 120 |
| `furnished` | boolean? | true |
| `developer_name` | string | 'PT Canggu Builds' |
| `source_platform` | string | 'Properti.com', 'OLX', 'Facebook' |
| `source_url` | string | 'https://properti.com/...' |
| `image_url` | string | 'https://...' |
| `posted_at` | Date | new Date('2026-04-10') |
| `scraped_at` | Date | new Date('2026-04-15') |
| `legal_structure_claim` | string | 'SHM', 'HGB', 'HM', 'Girik' |
| `revenue_claim_annual` | number? | 6500 |
| `occupancy_claim_percent` | number? | 85 |
| `trust_score` | number (0-100) | 78 |
| `completeness_score` | number (0-100) | 92 |
| `notes` | string? | 'Piscine commune, bon rendu' |
| `status` | 'active' \| 'sold' \| 'draft' | 'active' |

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev        # Lancer le serveur (port 3333)

# Production
npm run build      # Builder pour prod
npm run start      # Lancer le serveur prod (build avant!)

# Qualité
npm run type-check # Vérifier les types TypeScript
```

## 📄 Licence

Privé — Usage personnel uniquement.

---

**Questions ?** Retrouvez la structure du projet en détail dans [ARCHITECTURE.md](./ARCHITECTURE.md) (TODO).
