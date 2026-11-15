# Phase 0: Baseline Technical Audit & Business Truth Report

**Audit Reference Date:** 15 November 2026  
**Auditor:** Principal Technical SEO Engineer & Next.js Systems Architect  
**Subject Property:** Silver Wolf Technologies (`https://www.silverwolftechnologies.in`)  
**Active Working Branch:** `seo-growth-engine-2026`  

---

## 1. Technical Architecture & Environment Inventory

| Layer | Implementation Details | Health / Status |
| :--- | :--- | :--- |
| **Framework & Runtime** | Next.js 14.2.15 (App Router), Node.js, React 18.3.1 | ✅ Modern App Router, Server Components + Client Boundaries |
| **Language & Types** | TypeScript 5.8.3, Strict Typing partially enabled | ⚠️ Leftover `tsconfig.app.json` Vite references (`vitest/globals`) |
| **Styling & UI** | Tailwind CSS 3.4.17, Radix UI primitives, Lucide Icons | ✅ Highly optimized CSS, standard design system |
| **Hosting & CDN** | Vercel Serverless / Edge Network | ✅ HTTP/2, global CDN caching headers in `next.config.js` |
| **Build & Static Generation**| `generateStaticParams` configured for 1,181 pre-rendered static routes | ✅ Build succeeds cleanly with 0 compilation errors |
| **Image Pipeline** | `next/image` with WebP/AVIF formats declared in `next.config.js` | ⚠️ Optional `sharp` missing; recommended for serverless performance |
| **Analytics Integrations** | GA4, Microsoft Clarity, Vercel Analytics declared in `src/app/layout.tsx` | ⚠️ Missing client-side server receipt confirmation on lead submissions |

---

## 2. Configured URL Inventory Breakdown

The website utilizes programmatic routing across three hierarchical levels:

$$\text{Total Configured URLs} = \text{Core (9)} + \text{Services (14)} + \text{City Hubs (308)} + \text{Localities (6,076)} = 6,407$$

### URL Segment Breakdown
1. **Core Static URLs (9):**
   - `/` (Homepage)
   - `/about`
   - `/services` (Service Directory)
   - `/portfolio` (Case Studies & Client Builds)
   - `/locations` (Interactive Regional Directory)
   - `/contact` (Primary Enquiry Route)
   - `/careers` (Open Roles & Training Programs)
   - `/privacy-policy`
   - `/terms`
2. **Primary Service Landing Pages (14):**
   - `/services/website-development`
   - `/services/ecommerce-development`
   - `/services/mobile-app-development`
   - `/services/crm-development`
   - `/services/saas-development`
   - `/services/bug-fixing-maintenance`
   - `/services/seo-services`
   - `/services/digital-marketing`
   - `/services/social-media-marketing`
   - `/services/branding-strategy`
   - `/services/video-editing`
   - `/services/photo-editing`
   - `/services/graphic-design`
   - `/services/ui-ux-design`
3. **Service × City Regional Hubs (308):**
   - 14 Services × 22 Major Cities (16 in India: Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Chandigarh, Noida, Gurgaon, Indore, Surat, Kochi; 6 International: Dubai, London, New York, Toronto, Sydney, Singapore).
4. **Service × City × Locality Pages (6,076):**
   - 14 Services × 434 registered localities across the 22 cities.

---

## 3. Categorized Baseline Findings

### Category A: Verified in Code (Technical & Architectural Deficiencies)

| Finding ID | Component / File | Severity | Technical Impact | Risk Assessment | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | `src/lib/curatedCities.ts:53` | **CRITICAL** | `INDEX_ALL_LOCALITIES = true` overrides selective curation, setting 6,076 locality pages to `index: true` and injecting them into the sitemap. | Direct driver of 777 pages stuck in "Crawled – currently not indexed" and AdSense "Low value content" flags. | Implement granular `indexPolicy.ts`; set uncurated localities to `noindex, follow` and exclude from XML sitemap. |
| **F-02** | `src/lib/sitemapUtils.ts:48` | **HIGH** | `BUILD_DATE = new Date().toISOString()` marks all 6,407 URLs as substantively updated on every code deploy or module start. | Google detects deceptive/identical lastmod churn, discounts the tag, and slows recrawl frequency. | Replace with static versioned date per URL family; omit lastmod where no real revision date exists. |
| **F-03** | `src/components/site/Hero.tsx:105`, `src/components/site/Contact.tsx:38` | **CRITICAL** | Form submissions execute `setTimeout(..., 700)` and display fake success toasts without sending data to any backend API or webhook. | 100% loss of inbound client leads. Potential clients believe their inquiry was sent, while the agency never receives it. | Implement `/api/contact` endpoint with zod validation, rate limiting, and email/webhook dispatch. |
| **F-04** | `src/components/SchemaMarkup.tsx`, `src/app/page.tsx:58` | **HIGH** | `RootLayout` declares `Organization`, `LocalBusiness`, `WebSite` sitewide, while `page.tsx` declares duplicate copies with the same `@id`s. | Conflicting schema entities in Google Rich Results Test; schema validation errors. | Consolidate sitewide schema in `RootLayout`; eliminate duplicate entity injections on homepage. |
| **F-05** | `src/components/LocationSeoBlock.tsx:75-86` | **HIGH** | Emits `SpeakableSpecification` schema across commercial service pages; maintains deprecated `FAQPage` schema. | `Speakable` is restricted by Google to US English topical news publishers. FAQ rich results were deprecated on May 7, 2026. | Remove `Speakable` schema. Retain human-facing FAQs for AEO/GEO without claiming FAQ rich result eligibility. |
| **F-06** | `src/components/site/CareersPage.tsx:410-440` | **HIGH** | Maps 30+ listing-page cards into `@type: "JobPosting"` with fake moving dates (`datePosted: new Date().toISOString()`). | Explicit violation of Google Jobs guidelines (requires individual stable job URLs and real posting dates). Manual action risk. | Remove invalid list-level `JobPosting` structured data. Retain clean job descriptions. |
| **F-07** | `src/components/site/Hero.tsx:146` | **MEDIUM** | Primary H1 is generic: *"Everything Your Business Needs — In One Place."* | Zero keyword relevance for Indian commercial buyers seeking web development, custom CRM, or SEO. | Replace with intent-aligned H1: *"Web Development, Custom CRM & SEO Services in India"*. |
| **F-08** | `src/components/site/Hero.tsx:296, 312` | **MEDIUM** | Bento card for CRM points to "Cloud & Infrastructure" / Kubernetes, while UI/UX card points to `graphic-design`. | High conversion friction and internal link dilution. | Map CRM card to `/services/crm-development` and UI/UX card to `/services/ui-ux-design`. |
| **F-09** | `src/components/site/FAQ.tsx` vs `src/app/page.tsx:49` | **MEDIUM** | Homepage FAQ copy duplicated across two files; `FAQ.tsx` contains microdata while `page.tsx` emits JSON-LD. | Copy drift, maintenance overhead, conflicting markup. | Create shared `src/data/faqs.ts` single source of truth; remove redundant microdata. |
| **F-10** | `src/lib/serviceMetadata.ts:8-17` | **LOW** | Rotates unverified superlatives ("Best", "Top") in title tags via simple hash. | Diminishes buyer trust, conflicts with Google spam guidelines on unsupported superlatives. | Replace with intent-aligned, trust-first titles. |

---

### Category B: Verified Live (Production Behaviors)
- Domain resolves to HTTPS: `https://www.silverwolftechnologies.in`.
- DNS, Vercel routing, and edge rewrite for `/sitemap.xml` pointing to `/api/sitemap-index`.
- Country Code Top-Level Domain (ccTLD) is `.in` — strongly signals geographic intent for India to Google Search algorithms.

---

### Category C: Business Truth & Consistency Review

| Business Fact | Code Value (`src/data/site.ts`) | Status | Verification Note |
| :--- | :--- | :--- | :--- |
| **Legal Name** | Silver Wolf Technologies | ✅ Consistent | Declared across all metadata, schema, and footer |
| **Headquarters** | Murbad, Maharashtra, India (PIN: 421401) | ✅ Consistent | Real geographical coordinates: 19.2333° N, 73.3833° E |
| **Contact Phone** | `+91 98459 53801` (Raw: `+919845953801`) | ✅ Consistent | Configured across tel links and schema |
| **Contact Email** | `info@silverwolftechnologies.in` | ✅ Consistent | Used across all contact touchpoints |
| **Founding Date** | 2015 (10+ Years Experience) | ⚠️ Owner Check | Claimed 10+ years; verified consistent in code |
| **Operating Model** | Remote-First, Worldwide Delivery | ✅ Honest | Accurately describes remote delivery without claiming fake local offices |
| **Stats / ROI Claims**| "3.4× Average ROI", "200+ Shipped Builds" | ⚠️ Owner Check | Needs owner verification or client case study evidence |
| **International Footprint** | 6 International Cities (Dubai, London, NYC, Toronto, Sydney, Singapore) | ⚠️ Refined | Positioned as remote offshore delivery from India; no fake international offices |

---

### Category D: Production-Data Dependent (Marked for Authenticated GSC/GA4 Review)
- Indexed vs. Excluded URL breakdown in Google Search Console.
- Core Web Vitals 75th-percentile field metrics (Chrome User Experience Report / CrUX).
- Actual conversion attribution and lead-to-sale closing rates.
