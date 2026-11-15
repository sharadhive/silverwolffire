# Standard Operating Procedure: Search & AI Visibility Tracking Protocol

**Document Reference:** SOP-SEO-2026-01  
**Audit Reference Date:** 15 November 2026  
**Auditor:** Principal Technical SEO Engineer & Competitive Intelligence Analyst  
**Subject Property:** Silver Wolf Technologies (`https://www.silverwolftechnologies.in`)  

---

## 1. Objectives & Principles

To evaluate search performance objectively, measurements must be grounded in verified, reproducible queries across fixed devices and geographies. We measure **commercial outcomes (qualified leads, signed engagements)** alongside search signals (impressions, positions, CTR, AI citations), never treating vanity rankings as the end goal.

### Core Tracking Principles
1. **No Forbidden Bulk Scraping:** Follow search engine terms of service. Rely on authenticated Google Search Console (GSC) Performance APIs, Bing Webmaster Tools (BWT) APIs, and transparent third-party rank-tracking APIs that use clean, unpersonalized browser sessions.
2. **Neutral Testing Environment:** Manual verification searches must use clean, incognito browser sessions with location simulation set strictly to the target country/city (e.g. Chrome DevTools Sensors: Mumbai `19.0760, 72.8777`, Delhi `28.6139, 77.2090`), signed out of all Google accounts, without personalized search history.
3. **Fixed Tracked Query Set:** Avoid shifting the query pool mid-stream. Track the designated 20–40 core queries continuously to compute authentic visibility trends.

---

## 2. Tracking Cadence & Review Schedule

| Interval | Action Item | Primary Data Source | Output / Deliverable |
| :--- | :--- | :--- | :--- |
| **Weekly** | Rank Position & AI Feature Check | Neutral Rank Tracker / BWT API | Record organic positions, map pack presence, AI Overviews, and competitor movements across the 20 priority keywords. |
| **Bi-Weekly (14 Days)** | Lead & Form Integrity Verification | `/api/contact` logs / Monitored Inbox | Verify that test submissions successfully reach the agency inbox; ensure no silent submission failures or false-positive 200s. |
| **Monthly (28 Days)** | GSC Search Performance Analysis | Google Search Console API / GUI | Compute 28-day vs previous 28-day matched period: Nonbranded Impressions, Nonbranded Clicks, Average CTR conditioned on Position, Excluded vs Indexed page ratio. |
| **Quarterly (90 Days)** | Competitive Win/Lose Audit & Roadmap Update | Full SERP Re-audit & GA4 CRM Data | Score our target URLs against competitors on information gain, Core Web Vitals, and lead-to-client conversion rate. |

---

## 3. Metrics Matrix & Measurement Definitions

```
Commercial Success Funnel:
Raw Organic Impressions (GSC)
  └── Qualified Nonbranded Clicks (GSC)
        └── On-Page Engagement & Low Bounce (GA4)
              └── Form Inquiry Submitted & Accepted (/api/contact)
                    └── Qualified B2B Sales Opportunity (CRM)
                          └── Signed Agency Project Contract
```

### 1. Search Engine Visibility Metrics
- **Average Position (GSC):** Query-level and page-level average rank across India.
- **Position-Conditioned CTR:** Actual click-through rate compared against expected CTR for that position bracket (e.g. Pos 1: 25–30%, Pos 2: 14–16%, Pos 3: 9–11%, Pos 4–10: 2–6%). Low CTR at high positions indicates poor title/snippet intent match.
- **Indexed Canonical Ratio:** $\frac{\text{Indexed Valid Canonical URLs}}{\text{Total Submitted Sitemaps URLs}}$. Target: >90% (healthy indexing without doorway bloat).

### 2. AI Answer Engine Metrics (AEO/GEO)
- **Google AI Overview Grounding:** Record whether Silver Wolf Technologies is cited as a source card for targeted informational questions (e.g., *"website development cost in india"*, *"custom crm vs zoho"*).
- **Bing AI / Copilot Citations:** Tracked via Bing Webmaster Tools *AI Performance* report (launched Feb 2026).
- **ChatGPT Search / Perplexity Retrieval:** Monthly manual test with neutral prompts evaluating whether Silver Wolf is cited in answer synthesis.

### 3. Conversion & Business Truth Metrics
- **Accepted Contact Submissions:** Real inquiries successfully delivered to the agency inbox.
- **WhatsApp Direct Initiations:** Clicks on `wa.me` button tracked as distinct `contact_click_whatsapp` event in GA4.
- **Direct Phone Calls:** Clicks on `tel:+919845953801` tracked as `contact_click_phone` in GA4.

---

## 4. Competitive Win / Lose Classification Protocol

For every tracked keyword cluster, assign each page to one of four review categories every 28 days:

| Classification | Condition | Strategy / Action |
| :--- | :--- | :--- |
| **PROTECT (Win)** | Our URL ranks above primary competitors (Top 3) with healthy CTR. | Do NOT alter page title or core URL structure. Monitor competitor updates and refresh supporting proof/dates periodically. |
| **IMPROVE (Opportunity)** | Our URL ranks in positions 4–20 (striking distance) with steady impressions but lagging CTR or conversions. | Upgrade content information gain: add concise 60-word summary, interactive comparison tables, or verified case study screenshots. Test title meta variant. |
| **DIAGNOSE (Underperforming)** | Page is indexed but receives <10 impressions/mo or is excluded under "Crawled – currently not indexed". | Review for thin content, duplicate signals, or canonical confusion. Audit page rendering and internal link depth. |
| **AWAIT PROOF (Pending)** | Commercial page exists but lacks proprietary case study outcomes, testimonials, or pricing bands. | Queue item in `CONTENT_EVIDENCE_QUEUE.md` for owner validation before promoting into aggressive ranking campaigns. |

---

## 5. Sample Logging Sheet Template

When performing manual verification rounds, record observations in `docs/seo-audit/COMPETITOR_SERP_BASELINE.csv` following this standardized syntax:

```csv
Date,Engine,Keyword,Query Intent,Country,City,Device,Organic SERP Position,Competitor Name,Competitor URL,Feature Type,Observed Source,Confidence,Our URL,Our Position
2026-11-15,Google,custom crm development company india,Transactional,India,National,Desktop,1,Cynoteck,https://cynoteck.com/custom-crm-development-services/,Organic Result,Direct Neutral Web Search,HIGH,/services/crm-development,UNKNOWN (Needs Owner GSC Access)
```
