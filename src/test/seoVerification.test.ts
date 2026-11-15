/**
 * ─── Automated Verification Test Suite ───────────────────────────────────────
 *
 * Validates:
 *   1. Granular URL index policy engine (indexPolicy.ts)
 *   2. XML Sitemap generator & URL count compliance (sitemapUtils.ts)
 *   3. Substantive stable lastmod dates (no dynamic startup churn)
 *   4. Safe JSON-LD serialization
 *   5. Centralized FAQ integrity (faqs.ts)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { evaluateUrlPolicy, getLocalityPolicy } from '../lib/seo/indexPolicy';
import {
  getCorePageUrls,
  getServicePageUrls,
  getCityPageUrls,
  getAllSubCityUrls,
  getSitemapStats,
  generateUrlsetXml,
  generateSitemapIndexXml,
  STABLE_CORE_LASTMOD,
} from '../lib/sitemapUtils';
import { safeJsonLd } from '../lib/jsonLd';
import { HOMEPAGE_FAQS } from '../data/faqs';

let failures = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failures++;
  }
}

console.log('=== RUNNING SEO & ARCHITECTURE VERIFICATION TESTS ===\n');

// ─── 1. Index Policy Tests ───────────────────────────────────────────────────
console.log('Test Suite 1: Index Policy Evaluation');

const homePolicy = evaluateUrlPolicy('/');
assert(homePolicy.decision === 'INDEX', 'Homepage is INDEX');
assert(homePolicy.isSitemapEligible === true, 'Homepage is in sitemap');

const servicePolicy = evaluateUrlPolicy('/services/website-development');
assert(servicePolicy.decision === 'INDEX', 'Primary service page is INDEX');

const mumbaiWebDevCity = evaluateUrlPolicy('/services/website-development/mumbai');
assert(mumbaiWebDevCity.decision === 'INDEX', 'Indian metro city is INDEX');

const andheriWebDev = evaluateUrlPolicy('/services/website-development/mumbai/andheri');
assert(andheriWebDev.decision === 'INDEX', 'Curated Mumbai web development locality is INDEX');

const andheriSEO = evaluateUrlPolicy('/services/seo-services/mumbai/andheri');
assert(
  andheriSEO.decision === 'IMPROVE_FIRST' && andheriSEO.isRobotsIndexable === false,
  'Uncurated service in Mumbai locality is IMPROVE_FIRST (noindex, follow)'
);

const delhiSaket = evaluateUrlPolicy('/services/website-development/delhi/saket');
assert(
  delhiSaket.decision === 'IMPROVE_FIRST' && delhiSaket.isSitemapEligible === false,
  'Fallback locality in Delhi is IMPROVE_FIRST (excluded from sitemap)'
);

const londonShoreditch = evaluateUrlPolicy('/services/website-development/london/shoreditch');
assert(
  londonShoreditch.decision === 'IMPROVE_FIRST' && londonShoreditch.isRobotsIndexable === false,
  'International locality is IMPROVE_FIRST'
);

const adminRoute = evaluateUrlPolicy('/admin/dashboard');
assert(adminRoute.decision === 'NOINDEX', 'Admin route is NOINDEX');

// ─── 2. XML Sitemap & Lastmod Stability Tests ────────────────────────────────
console.log('\nTest Suite 2: XML Sitemap & Lastmod Stability');

const stats = getSitemapStats();
assert(stats.corePages === 9, `Core pages count is 9 (got ${stats.corePages})`);
assert(stats.servicePages === 14, `Service pages count is 14 (got ${stats.servicePages})`);
assert(stats.cityPages === 224, `Indian City pages count is 224 (got ${stats.cityPages})`);
assert(stats.subCityPages === 60, `Curated locality pages count is 60 (got ${stats.subCityPages})`);
assert(stats.totalUrls === 307, `Total sitemap indexable URLs is exactly 307 (got ${stats.totalUrls})`);
assert(stats.subCityChunks === 1, `Subcity chunks count is 1 (got ${stats.subCityChunks})`);

const coreUrls = getCorePageUrls();
const allMatchCoreLastmod = coreUrls.every((u) => u.lastmod === STABLE_CORE_LASTMOD);
assert(allMatchCoreLastmod, 'Core URLs use stable substantive lastmod date');

const sampleXml = generateUrlsetXml(coreUrls.slice(0, 3));
assert(sampleXml.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'Valid XML header generated');
assert(!sampleXml.includes('<priority>'), 'Outdated priority tag removed from sitemap');
assert(!sampleXml.includes('<changefreq>'), 'Outdated changefreq tag removed from sitemap');

const indexXml = generateSitemapIndexXml();
assert(indexXml.includes('/sitemaps/core-pages.xml'), 'Sitemap index includes core-pages.xml');
assert(indexXml.includes('/sitemaps/subcity-pages-1.xml'), 'Sitemap index includes subcity-pages-1.xml');
assert(!indexXml.includes('/sitemaps/subcity-pages-2.xml'), 'Sitemap index does not advertise empty chunk 2');

// ─── 3. Safe JSON-LD Serialization Tests ────────────────────────────────────
console.log('\nTest Suite 3: Safe JSON-LD Serialization');

const dangerousPayload = { test: '</script><script>alert("xss")</script>' };
const serialized = safeJsonLd(dangerousPayload);
assert(!serialized.includes('</script>'), 'safeJsonLd escapes </script> breakout sequence');
assert(serialized.includes('\\u003c/script>'), 'safeJsonLd uses Unicode escape for <');

// ─── 4. FAQ Single Source of Truth Tests ────────────────────────────────────
console.log('\nTest Suite 4: Centralized FAQ Data Integrity');

assert(HOMEPAGE_FAQS.length === 6, `Homepage FAQ has 6 vetted questions (got ${HOMEPAGE_FAQS.length})`);
const hasPricingFaq = HOMEPAGE_FAQS.some((f) => f.question.includes('cost'));
assert(hasPricingFaq, 'FAQ includes pricing question');
const hasInternationalFaq = HOMEPAGE_FAQS.some((f) => f.question.includes('international'));
assert(hasInternationalFaq, 'FAQ includes honest international delivery question');

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log('\n======================================================');
if (failures === 0) {
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY (0 FAILURES)');
  process.exit(0);
} else {
  console.error(`💥 ${failures} TEST(S) FAILED`);
  process.exit(1);
}
