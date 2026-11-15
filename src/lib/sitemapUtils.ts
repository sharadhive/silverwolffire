/**
 * ─── Sitemap Utility Module ──────────────────────────────────────────────────
 *
 * Centralized sitemap generation logic for a scalable XML sitemap system.
 * Generates Google-compliant XML sitemaps containing only canonical, 200 OK,
 * index-eligible URLs. Eliminates fake lastmod churn and doorway page bloat.
 *
 * Architecture:
 *   /sitemap.xml                    → Sitemap Index (points to child sitemaps)
 *   /sitemaps/core-pages.xml        → Core static pages (9 URLs)
 *   /sitemaps/service-pages.xml     → Primary service pages (14 URLs)
 *   /sitemaps/city-pages.xml        → Indian Metro Service × City hubs (224 URLs)
 *   /sitemaps/subcity-pages-1.xml   → Curated locality pages (60 URLs)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SERVICES, CITIES, SUB_CITIES, SITE, citySlug } from '../data/site';
import { isLocalityIndexable } from './curatedCities';
import { INTERNATIONAL_CITY_SLUGS } from './seo/indexPolicy';

// ─── Configuration ───────────────────────────────────────────────────────────
/** Max URLs per sitemap file. Google allows 50,000; 1,500 isolates errors cleanly. */
export const CHUNK_SIZE = 1500;

// ─── Types ───────────────────────────────────────────────────────────────────
export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BASE_URL = SITE.domain;

/**
 * Stable, substantive modification dates.
 * A deployment is NOT evidence of content modification. Google Search Central
 * specifically instructs publishers to provide authentic content revision dates
 * and not update lastmod on unchanged pages on every site build.
 */
export const STABLE_CORE_LASTMOD = '2026-11-15T00:00:00.000Z';
export const STABLE_SERVICE_LASTMOD = '2026-11-15T00:00:00.000Z';
export const STABLE_CITY_LASTMOD = '2026-11-15T00:00:00.000Z';
export const STABLE_SUBCITY_LASTMOD = '2026-11-15T00:00:00.000Z';

export function currentDate(): string {
  return STABLE_CORE_LASTMOD;
}

/** XML-escape special characters in URLs */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;');
}

// ─── URL Generators ──────────────────────────────────────────────────────────

/** Core static pages — homepage, about, services index, portfolio, locations, contact, careers, privacy, terms */
export function getCorePageUrls(): SitemapUrl[] {
  return [
    { loc: `${BASE_URL}/`,               lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/about`,          lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/services`,       lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/portfolio`,      lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/locations`,      lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/contact`,        lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/careers`,        lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/privacy-policy`, lastmod: STABLE_CORE_LASTMOD },
    { loc: `${BASE_URL}/terms`,          lastmod: STABLE_CORE_LASTMOD },
  ];
}

/** Individual service detail pages — /services/website-development, etc. (14 URLs) */
export function getServicePageUrls(): SitemapUrl[] {
  return SERVICES.map((service) => ({
    loc: `${BASE_URL}/services/${service.slug}`,
    lastmod: STABLE_SERVICE_LASTMOD,
  }));
}

/** Service × Indian City pages — 14 Services × 16 Indian Cities = 224 URLs */
export function getCityPageUrls(): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  for (const service of SERVICES) {
    for (const city of CITIES) {
      const slug = citySlug(city);
      // International cities without curated physical proof are set to improve_first and omitted from sitemap
      if (INTERNATIONAL_CITY_SLUGS.has(slug)) continue;
      urls.push({
        loc: `${BASE_URL}/services/${service.slug}/${slug}`,
        lastmod: STABLE_CITY_LASTMOD,
      });
    }
  }

  return urls;
}

/**
 * Curated Service × City × SubCity URLs (only index-eligible curated localities).
 * Mumbai (36) + Chennai (24) for Website Development = 60 URLs.
 * Template fallback localities are kept out of sitemap to prevent doorway penalties.
 */
export function getAllSubCityUrls(): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  for (const service of SERVICES) {
    for (const city of CITIES) {
      const cSlug = citySlug(city);
      if (!isLocalityIndexable(cSlug, service.slug)) continue;
      const subs = SUB_CITIES[city] || [];
      for (const sub of subs) {
        urls.push({
          loc: `${BASE_URL}/services/${service.slug}/${cSlug}/${citySlug(sub)}`,
          lastmod: STABLE_SUBCITY_LASTMOD,
        });
      }
    }
  }

  return urls;
}

/** Get a specific chunk of subcity URLs (1-indexed) */
export function getSubCityChunk(chunkNumber: number): SitemapUrl[] | null {
  const allUrls = getAllSubCityUrls();
  const totalChunks = getSubCityChunkCount();

  if (chunkNumber < 1 || chunkNumber > totalChunks) {
    return null; // Invalid chunk → 404
  }

  const start = (chunkNumber - 1) * CHUNK_SIZE;
  const end = start + CHUNK_SIZE;
  return allUrls.slice(start, end);
}

/**
 * Calculate how many subcity chunks are needed.
 */
export function getSubCityChunkCount(): number {
  const total = getAllSubCityUrls().length;
  return Math.max(1, Math.ceil(total / CHUNK_SIZE));
}

// ─── XML Generators ──────────────────────────────────────────────────────────

/** Generate a standard <urlset> XML document from an array of URLs */
export function generateUrlsetXml(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

/** Generate the <sitemapindex> XML document listing all child sitemaps */
export function generateSitemapIndexXml(): string {
  const now = STABLE_CORE_LASTMOD;
  const totalSubChunks = getSubCityChunkCount();

  const sitemaps: string[] = [
    `${BASE_URL}/sitemaps/core-pages.xml`,
    `${BASE_URL}/sitemaps/service-pages.xml`,
    `${BASE_URL}/sitemaps/city-pages.xml`,
  ];

  for (let i = 1; i <= totalSubChunks; i++) {
    sitemaps.push(`${BASE_URL}/sitemaps/subcity-pages-${i}.xml`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (url) => `  <sitemap>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export function getSitemapStats() {
  const coreCount = getCorePageUrls().length;
  const serviceCount = getServicePageUrls().length;
  const cityCount = getCityPageUrls().length;
  const subCityTotal = getAllSubCityUrls().length;
  const subCityChunks = getSubCityChunkCount();

  return {
    corePages: coreCount,
    servicePages: serviceCount,
    cityPages: cityCount,
    subCityPages: subCityTotal,
    subCityChunks,
    totalUrls: coreCount + serviceCount + cityCount + subCityTotal,
    totalSitemapFiles: 3 + subCityChunks,
  };
}
