# Asikh Farms — Project Memory for Claude Code

## Project Overview
A React (CRA) e-commerce / marketing website for **Asikh Farms**, a Bihar-based farm selling premium Jardalu mangoes, Shahi lychee, and seasonal produce.  
Live URL: **https://asikhfarms.in**

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, TailwindCSS 3, react-i18next (EN/HI) |
| State / Forms | React Hook Form, useState/useEffect |
| Payments | Shopify Storefront API (via Express proxy on port 5001) |
| UI libs | MUI v5, Swiper, React Slick |
| Deployment | Netlify (netlify.toml present) |
| SEO / Pre-render | react-helmet-async v3, react-snap (postbuild step) |

## Repository Layout
```
src/
  index.js           — React 18 entry; uses hydrateRoot/createRoot for react-snap compatibility
  App.js             — Routes wrapped in <HelmetProvider>
  pages/
    Home.js          — Hero, ProductSlider, TestimonialSlider
    Products.js      — Static product grid (hardcoded data, no slugs yet)
    About.js         — Feature-flagged (REACT_APP_FEATURE_ABOUT=true)
    Contact.js       — mailto: contact form
    OrderNow.js      — Shopify-backed product order page
    Privacy.js       — Privacy policy & T&C (noindex)
  Components/
    Header.js | Footer.js | ScrollToTop.js | LanguageToggle.js
    ProductSlider.js | TestimonialSlider.js
  locales/en/ hi/    — i18next translation JSON files
  images/ icons/ video/ fonts/
public/
  index.html         — SEO base meta + Open Graph + Twitter Card tags
  android-chrome-512x512.png — OG / social preview image
server.js            — Express proxy for Shopify API (keeps tokens server-side)
netlify.toml         — Netlify config
```

## Feature Flags (env vars)
```
REACT_APP_FEATURE_PRODUCTS=true   # enables /products route
REACT_APP_FEATURE_ABOUT=true      # enables /about route
```
> Feature-flagged routes are still listed in `reactSnap.include` so snapshots are generated when flags are on.

## SEO Pre-rendering Setup (Epic: Discoverability & Performance)

### What was implemented
1. **`react-helmet-async`** (v3) — per-page dynamic `<title>`, `<meta description>`, canonical URL, Open Graph, and Twitter Card tags in every page component.
2. **`react-snap`** (v1.23) — Puppeteer-based static HTML snapshot generator added as `postbuild` npm script.  
   After `npm run build`, react-snap crawls each route in `reactSnap.include` and saves a pre-rendered `index.html` into `build/<route>/`.
3. **`src/index.js` hydration** — Changed from `ReactDOM.createRoot().render()` to the hydrate-or-render pattern:
   ```js
   rootElement.hasChildNodes()
     ? hydrateRoot(rootElement, <App />)
     : createRoot(rootElement).render(<App />)
   ```
   This preserves the pre-rendered HTML on first load instead of discarding it.
4. **`public/index.html`** — Fixed stale Qsofte branding, added full OG + Twitter Card defaults as fallback for crawlers that don't execute JS.

### Routes pre-rendered
`/`, `/products`, `/about`, `/order-now`, `/contact`, `/privacy`

### Acceptance criteria status
| Criterion | Status |
|-----------|--------|
| `curl https://asikhfarms.in` returns meaningful HTML | ✅ After deploy with react-snap build |
| All major routes have a pre-rendered snapshot | ✅ Enumerated in `reactSnap.include` |
| WhatsApp link preview shows correct title/desc/image | ✅ OG tags in each page's `<Helmet>` |
| Google Search Console indexing within 2 weeks | Pending — deploy required |
| Lighthouse mobile score does not decrease | Pending — measure after deploy |

### Deploying with pre-rendering enabled
```bash
npm install          # installs react-snap (needs internet + Chromium download)
npm run build        # CRA build → postbuild triggers react-snap automatically
```
react-snap requires a **headless Chromium** download on first `npm install`. The CI/CD environment must have internet access to `storage.googleapis.com` for the puppeteer binary.  
If the environment is sandboxed, install Chromium separately and point to it via `"puppeteerExecutablePath"` in `reactSnap` config.

## Build Commands
```bash
npm start           # dev server (port 3000)
npm run build       # production build + react-snap pre-render
npm run server      # Express Shopify proxy (port 5001)
npm run dev         # netlify dev (port 8888 with functions)
```

## Environment Variables
```
# Shopify
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_ADMIN_ACCESS_TOKEN
REACT_APP_SHOPIFY_STORE_DOMAIN
REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN

# Vendor portal
VENDOR_PIN / VENDOR_NAME / VENDOR_CONTACT_NAME / VENDOR_EMAIL / VENDOR_PHONE

# Twilio (SMS notifications)
TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER
```

## Known Limitations / Future Work
- Product pages do not have individual slugs (`/products/[slug]`). When individual product routes are added, enumerate them in `reactSnap.include` and add matching `<Helmet>` tags with product-specific OG images.
- `Products.js` has hardcoded product data. When migrated to live Shopify data, SEO tags should use API-returned product titles, descriptions and images.
- `REACT_APP_FEATURE_PRODUCTS` and `REACT_APP_FEATURE_ABOUT` must be `true` at build time for those routes to render content in the snapshot.
- react-snap `inlineCss: true` may increase individual HTML file size; disable if Lighthouse FCP regresses.

## Development Branch
Active SEO pre-rendering work lives on: `claude/add-seo-prerendering-PnULY`
