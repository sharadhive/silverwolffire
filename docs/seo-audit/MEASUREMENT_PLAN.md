# Measurement & Attribution Plan: GA4, GSC, and Lead Conversion Tracking

**Document Version:** 1.0.0  
**Audit Reference Date:** 15 November 2026  
**Auditor:** Principal Growth Strategist & Analytics Architect  
**Subject Property:** Silver Wolf Technologies (`https://www.silverwolftechnologies.in`)  

---

## 1. Analytics & Conversion Tracking Architecture

To evaluate search growth accurately, traffic metrics must be tied to **verified business actions**. All tracking must respect user privacy, eliminate duplicate fire events, and fire conversion events only when a real submission has been accepted by the server.

```
Visitor Enters via Search (Google / Bing / AI Engine)
  ├── Pageview Tracked in GA4 (Dimension: Landing Page, Country, Medium=Organic)
  ├── User Interacts with Content (Scroll Depth 50%, 90%, Service Accordions)
  └── User Reaches Out via Conversion Path:
        ├── Option A: Submits Web Form → POST /api/contact → 200 OK Accepted → Fire 'generate_lead'
        ├── Option B: Clicks WhatsApp Chat → wa.me link clicked → Fire 'contact_click_whatsapp'
        └── Option C: Clicks Phone Number → tel link clicked → Fire 'contact_click_phone'
```

---

## 2. Standardized Custom Event Taxonomy

| Event Name | Trigger Condition | Parameters Collected | GA4 Conversion Flag |
| :--- | :--- | :--- | :--- |
| **`generate_lead`** | Server returns HTTP 200 on `/api/contact` | `form_id` (`hero_form` or `contact_page_form`), `service_interest`, `lead_id` (timestamp-deduplicated) | **YES (Key Primary Conversion)** |
| **`contact_click_whatsapp`** | User clicks on floating or on-page WhatsApp button | `click_location` (`navbar`, `floating_button`, `contact_section`), `page_path` | **YES (Secondary Conversion)** |
| **`contact_click_phone`** | User clicks `tel:+919845953801` link | `click_location`, `page_path` | **YES (Secondary Conversion)** |
| **`contact_click_email`** | User clicks `mailto:info@silverwolftechnologies.in` link | `click_location`, `page_path` | No (Micro-conversion) |
| **`cta_click_primary`** | User clicks "Start Your Project" or "Request Proposal" | `cta_text`, `destination_url`, `page_path` | No (Engagement Event) |

---

## 3. GA4 Custom Report Definitions

The site administrator or analytics specialist should configure the following custom explorations in GA4:

### Report 1: Organic Lead Acquisition & Landing Page Performance
- **Primary Dimensions:** `Landing Page + Query String`, `Session Source / Medium` (filtered by `google / organic` and `bing / organic`), `Country` (India vs Global).
- **Metrics:** `Sessions`, `Engaged Sessions`, `Average Engagement Time`, `Event Count: generate_lead`, `Event Count: contact_click_whatsapp`, `Session Conversion Rate`.
- **Purpose:** Identifies which service pages and city hubs produce actual qualified leads versus pages that only attract bounce traffic.

### Report 2: Geographic Conversion Density (India Metro Analysis)
- **Primary Dimensions:** `City`, `Region` (e.g. Maharashtra, Karnataka, Delhi, Tamil Nadu).
- **Metrics:** `Sessions`, `Conversions (generate_lead)`, `Conversion Rate`.
- **Purpose:** Validates regional search demand to guide the rollout of Tier-1 and Tier-2 city content.

---

## 4. 90-Day Evidence-Led Search & CRO Milestone Plan

```
Phase 1: Days 0–14 (Safety, Index Cleanup & Lead Pipeline)
├── Deploy indexPolicy.ts to prune 6,000+ low-value doorway URLs from index/sitemap
├── Launch real /api/contact pipeline with validation, spam honeypot & rate limiting
├── Unify JSON-LD graph into single root schema (Organization, WebSite)
├── Remove invalid Speakable and deprecated FAQ rich result promises
└── Verify build, static params, and sitemap XML validation

Phase 2: Days 15–30 (Priority Service Pages & CTR Baseline)
├── Roll out enhanced content on top 4 priority service pages (Web Dev, CRM, SEO, E-Commerce)
├── Deploy intent-aligned title/meta descriptions across priority pages
├── Submit cleaned sitemap index to Google Search Console and Bing Webmaster Tools
└── Establish baseline tracking across 20-40 tracked Indian search queries

Phase 3: Days 31–60 (Case Study Proofs & Regional Hub Refinement)
├── Integrate owner-verified case study metrics into Plagzap, DreamDestination, and Placemate
├── Roll out curated content for Tier-1 Indian tech cities (Pune, Bangalore, Delhi NCR)
├── Conduct first 28-day CTR and position review against pre-change baseline
└── Analyze server-side lead logs and conversion rates in GA4

Phase 4: Days 61–90 (AI Search Refinement & Expansion)
├── Evaluate Search Console Generative AI visibility and Bing AI performance reports
├── Refine titles and meta descriptions based on real impression/CTR data
├── Expand into vetted offshore outsourcing terms (US/UK/UAE remote delivery)
└── Conduct comprehensive quarterly commercial performance review
```

---

## 5. Five Measurable Post-Launch Hypotheses

| Hypothesis # | Strategic Premise | Pre-Change Baseline | Expected Post-Launch Outcome (60–90 Days) | Validation Metric & Tool |
| :--- | :--- | :--- | :--- | :--- |
| **H-1: Index Health & Crawl Efficiency** | Removing 6,000+ low-value doorway URLs from the sitemap will eliminate crawl waste and allow Googlebot to index high-priority service pages faster. | 777 pages stuck in "Crawled – currently not indexed"; AdSense "Low value content" warning. | >90% of submitted canonical service and city URLs achieve indexed status; crawl error rate declines to <2%. | Google Search Console → Indexing → Pages |
| **H-2: Organic Inbound Lead Delivery** | Replacing broken `setTimeout` client form mocks with a validated `/api/contact` backend endpoint will capture 100% of legitimate project inquiries that were previously lost. | 0 inbound form submissions received by agency; 100% submission failure rate. | All valid client submissions successfully received in agency inbox within 30 seconds; zero false-positive 200s. | `/api/contact` Server Logs & Monitored Agency Inbox |
| **H-3: Homepage CTR & Intent Match** | Replacing the generic H1 and meta title (*"Everything Your Business Needs"*) with intent-focused phrasing (*"Web Development, Custom CRM & SEO Services in India"*) will increase organic CTR. | Baseline nonbranded CTR on homepage estimated at <2.0% for commercial terms. | Nonbranded search CTR increases by +15% to +35% relative to baseline across positions 3–10. | Google Search Console → Performance → Pages: `/` |
| **H-4: CRM Niche Outranking** | Publishing a comprehensive "Custom CRM vs Zoho/Salesforce for Indian SMBs" comparison guide on `/services/crm-development` will capture consideration searches currently neglected by large agencies. | Near-zero organic visibility for proprietary CRM keywords in India. | Page achieves Top 15 organic ranking for long-tail CRM queries (e.g. *"custom crm development company india"*) and drives qualified enterprise inquiries. | Neutral SERP Tracking & GSC Performance API |
| **H-5: AEO & AI Overview Retrieval** | Providing concise, factual 40–80 word answer blocks near visible H2s with stable entity graphs will increase retrieval in Google AI Overviews and ChatGPT Search. | Zero verified citations in Google AI Overviews or ChatGPT Search. | Silver Wolf Technologies cited as a reference source for neutral Indian tech procurement queries (e.g. website development cost factors). | GSC Generative AI Reports & Bing AI Performance |
