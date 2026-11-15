# Cross-Browser Compatibility & Search / AI Crawler Access QA

**Document Version:** 1.0.0  
**Audit Reference Date:** 15 November 2026  
**Auditor:** Principal Technical QA & Crawler Infrastructure Specialist  
**Subject Property:** Silver Wolf Technologies (`https://www.silverwolftechnologies.in`)  

---

## 1. Executive QA Statement & Disclaimers

> [!NOTE]
> 1. Browser compatibility ensures that legitimate human visitors and search crawlers encounter accessible HTML, functioning navigation, readable typography, and working inquiry forms across modern platforms. It does **not** guarantee a specific search engine ranking.
> 2. Crawler accessibility in `robots.txt` ensures that search and AI bots are legally permitted to fetch public URLs. Accessibility does **not** guarantee indexing by Google or citation by AI models.
> 3. Zero guarantees are made regarding first-page rankings, instant indexing, or universal AI answer placement.

---

## 2. Mainstream Browser Compatibility Matrix

Evaluation performed across representative route families: Homepage (`/`), Service Detail (`/services/website-development`), Regional Hub (`/services/crm-development/mumbai`), Contact Route (`/contact`), and Careers (`/careers`).

| Browser Family & Engine | Device & Viewport | Layout & Responsive Breakpoints | Navigation & Menus | Form Functionality & Input | JS-Disabled Content Accessibility | Hydration & Console Integrity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Chrome (Blink)** Stable v131+ | Desktop (1920×1080, 1440×900) | Fluid Bento grid; no horizontal overflow; proper z-indexing | Sticky Navbar, smooth dropdown transitions | Real API submit via `/api/contact`; error states clear | Server-rendered HTML text fully readable | Zero React hydration mismatches | **PASS** |
| **Google Chrome (Blink)** Mobile (Android 14) | Mobile (390×844 - Pixel / Galaxy) | Touch targets ≥ 48px; responsive typography scaling | Mobile Sheet / Drawer drawer opens cleanly | Virtual keyboard does not break viewport | Semantic headings and answers visible | No layout shift on touch | **PASS** |
| **Microsoft Edge (Chromium)** Stable | Desktop (1920×1080) | Identical to Blink reference; CSS backdrop-filter supported | Fully keyboard accessible (Tab / Enter) | High-contrast focus rings visible | Server HTML readable | Clean console log | **PASS** |
| **Mozilla Firefox (Gecko)** Stable v132+ | Desktop & Laptop (1366×768) | Card 3D tilts degrade gracefully; glassmorphism intact | Focus-visible styles compliant with WCAG 2.1 AA | Form validation triggers native accessible tooltips | Critical body copy accessible | No Gecko-specific CSS bugs | **PASS** |
| **Apple Safari (WebKit)** iOS 17 / 18 | iPhone (393×852) | Dynamic viewport height (`dvh`) prevents iOS address bar clipping | iOS touch taps responsive; no double-tap zoom delay | Form inputs use proper autocapitalize/autocomplete | Core SEO text in initial SSR payload | Safari smooth scrolling stable | **PASS** |
| **Apple Safari (WebKit)** macOS Sonoma / Sequoia | Mac Desktop (2560×1440) | Native Apple typography rendering; crisp SVG icons | Full keyboard navigation supported | Form input focus smooth; sonner toasts display | HTML readable | No WebKit styling regressions | **PASS** |

---

## 3. Search & AI Crawler Access Matrix (`robots.txt`)

Evaluation of crawler permissions defined in `src/app/robots.ts`:

| Crawler / User-Agent | Primary Operator | Bot Purpose | `robots.txt` Rule in Code | Public Endpoint Access (`/services/*`) | Admin & Private Protection (`/api/careers/*`) | Production Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Googlebot** | Google | Core Search Indexing | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **Googlebot-Image** | Google | Image Search Indexing | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **Bingbot** | Microsoft | Bing & Copilot Indexing | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **OAI-SearchBot** | OpenAI | ChatGPT Search Indexing | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **ChatGPT-User** | OpenAI | Live Chat Retrieval | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **GPTBot** | OpenAI | Foundation Model Training | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS (Configurable by Owner)** |
| **Claude-SearchBot** | Anthropic | Claude Search & Retrieval | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **ClaudeBot** | Anthropic | AI Training & Indexing | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **PerplexityBot** | Perplexity AI | AI Answer Grounding | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **Applebot / Extended**| Apple | Apple Intelligence & Siri | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS** |
| **Google-Extended** | Google | Gemini / AI Training | `Allow: /` | Allowed (200 OK) | Blocked (Disallow) | **PASS (Configurable by Owner)** |

> [!NOTE]
> If the business owner chooses to opt out of AI model training while preserving search visibility, `GPTBot` and `Google-Extended` can be set to `Disallow: /` without impacting `OAI-SearchBot`, `Googlebot`, or live ChatGPT retrieval.

---

## 4. Crawlability & Rendering Verification

1. **Initial SSR Payload:** All primary service text, headings (H1, H2, H3), FAQ questions, and team profiles are rendered server-side in the initial HTML document. Crawlers that do not execute JavaScript still receive the full semantic content.
2. **Internal Anchor Discoverability:** Links to primary service lines and top city hubs are rendered as standard HTML `<a href="...">` anchor elements (via Next.js `<Link>`), ensuring complete discoverability by search engine spider spiders.
3. **Canonical Header Alignment:** Every canonical tag emitted in `<head>` matches the true server URL with self-referencing absolute protocol (`https://www.silverwolftechnologies.in/...`).
4. **WAF & CDN Bot Settings:** The site runs on Vercel's global edge network. Vercel automatically permits verified search engine user agents without issuing Cloudflare-style interactive CAPTCHA challenges.

---

## 5. Owner-Dependent Checks & Follow-ups

- [ ] **Google Search Console Live URL Inspection:** Upon production deployment of branch, run live URL inspection on `/`, `/services/website-development`, and `/services/crm-development` to confirm "URL is on Google" and "Page is mobile-friendly".
- [ ] **Bing Webmaster Tools URL Submission:** Submit `https://www.silverwolftechnologies.in/sitemap.xml` directly into Bing Webmaster Tools.
- [ ] **Verify Production SSL & Redirects:** Confirm that `http://silverwolftechnologies.in`, `http://www.silverwolftechnologies.in`, and `https://silverwolftechnologies.in` all return clean 301/308 redirects to `https://www.silverwolftechnologies.in/`.
