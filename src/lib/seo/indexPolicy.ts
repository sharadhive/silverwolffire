/**
 * ─── Granular Per-URL Index Policy Engine ────────────────────────────────────
 *
 * Implements a testable, rule-based indexing and crawl policy for all URLs.
 * Replaces blunt global toggles (such as INDEX_ALL_LOCALITIES = true) with
 * deliberate search-quality gates adhering to Google's Search Essentials,
 * Scaled Content Abuse policies, and Helpful Content Guidelines.
 *
 * Decisions:
 *   • INDEX          → Fully indexable (robots: index, follow; included in sitemap).
 *   • IMPROVE_FIRST  → Served to visitors (HTTP 200) with robots: noindex, follow;
 *                      kept out of sitemap until curated evidence is added.
 *   • CONSOLIDATE    → Redirect (301/308) to canonical parent or equivalent page.
 *   • NOINDEX        → Permanent noindex (e.g. administrative/response screens).
 *   • GONE           → HTTP 404 / 410 for nonexistent or removed assets.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SERVICES, CITIES, citySlug } from "../../data/site";
import { isCuratedCity } from "../curatedCities";

export type IndexDecision =
  | "INDEX"
  | "IMPROVE_FIRST"
  | "CONSOLIDATE"
  | "NOINDEX"
  | "GONE";

export interface UrlPolicyResult {
  decision: IndexDecision;
  isRobotsIndexable: boolean;
  isSitemapEligible: boolean;
  reason: string;
  canonicalPath: string;
}

/** Six international cities registered in data/site.ts */
export const INTERNATIONAL_CITY_SLUGS: ReadonlySet<string> = new Set([
  "dubai",
  "london",
  "new-york",
  "toronto",
  "sydney",
  "singapore",
]);

/** Indian metro cities with verified high commercial search demand */
export const TIER1_INDIAN_CITY_SLUGS: ReadonlySet<string> = new Set([
  "mumbai",
  "delhi",
  "bangalore",
  "hyderabad",
  "pune",
  "chennai",
  "noida",
  "gurgaon",
]);

/**
 * Evaluates the index policy for a specific service-city-locality combination.
 */
export function getLocalityPolicy(
  serviceSlugParam: string,
  citySlugParam: string,
  subCitySlugParam?: string
): UrlPolicyResult {
  const normService = serviceSlugParam.toLowerCase();
  const normCity = citySlugParam.toLowerCase();
  const normSubCity = subCitySlugParam ? subCitySlugParam.toLowerCase() : undefined;

  const basePath = `/services/${normService}/${normCity}${normSubCity ? `/${normSubCity}` : ""}`;

  // 1. Check if city is international
  if (INTERNATIONAL_CITY_SLUGS.has(normCity)) {
    return {
      decision: "IMPROVE_FIRST",
      isRobotsIndexable: false,
      isSitemapEligible: false,
      reason:
        "International locality/city page without verified local client case studies or physical presence. Remote delivery positioned via primary hub.",
      canonicalPath: basePath,
    };
  }

  // 2. City-level pages (no subcity)
  if (!normSubCity) {
    return {
      decision: "INDEX",
      isRobotsIndexable: true,
      isSitemapEligible: true,
      reason: "High-intent regional Indian city service hub with tailored service copy and localized FAQs.",
      canonicalPath: basePath,
    };
  }

  // 3. Locality-level pages (with subcity)
  // Mumbai and Chennai have curated data specifically authored for Website Development
  const isCurated = isCuratedCity(normCity);
  const isWebDevService = normService === "website-development";

  if (isCurated && isWebDevService) {
    return {
      decision: "INDEX",
      isRobotsIndexable: true,
      isSitemapEligible: true,
      reason:
        "Curated locality with hand-written commercial copy, verified pin codes, local landmarks, and dedicated Q&A for website development.",
      canonicalPath: basePath,
    };
  }

  // 4. Locality pages using template fallback copy
  return {
    decision: "IMPROVE_FIRST",
    isRobotsIndexable: false,
    isSitemapEligible: false,
    reason:
      "Template-generated locality fallback. Accessible to users (200 OK) with link equity preserved (noindex, follow), excluded from sitemap to protect crawl budget.",
    canonicalPath: basePath,
  };
}

/**
 * Universal policy evaluator for any given site pathname.
 */
export function evaluateUrlPolicy(pathname: string): UrlPolicyResult {
  const clean = pathname.replace(/\/+$/, "") || "/";

  // Core pages
  if (
    clean === "/" ||
    clean === "/about" ||
    clean === "/services" ||
    clean === "/portfolio" ||
    clean === "/locations" ||
    clean === "/contact" ||
    clean === "/privacy-policy" ||
    clean === "/terms"
  ) {
    return {
      decision: "INDEX",
      isRobotsIndexable: true,
      isSitemapEligible: true,
      reason: "Core navigational and business credibility page.",
      canonicalPath: clean === "/" ? "/" : clean,
    };
  }

  // Proprietary Platform Product pages (LMS, CRM, HR Management, Job Portal, Attendance System)
  if (
    clean === "/products/lms" ||
    clean === "/products/crm" ||
    clean === "/products/hr-management" ||
    clean === "/products/job-portal" ||
    clean === "/products/attendance-system"
  ) {
    return {
      decision: "INDEX",
      isRobotsIndexable: true,
      isSitemapEligible: true,
      reason: "Dedicated advanced software platform product page with high commercial intent.",
      canonicalPath: clean,
    };
  }

  // Careers listing page
  if (clean === "/careers") {
    return {
      decision: "INDEX",
      isRobotsIndexable: true,
      isSitemapEligible: true,
      reason: "Public careers and training program overview page.",
      canonicalPath: "/careers",
    };
  }

  // Internal private/admin routes
  if (
    clean.startsWith("/admin") ||
    clean.startsWith("/private") ||
    clean.startsWith("/careers/responses") ||
    clean.startsWith("/api/")
  ) {
    return {
      decision: "NOINDEX",
      isRobotsIndexable: false,
      isSitemapEligible: false,
      reason: "Private, administrative, or API endpoint; blocked from search crawl.",
      canonicalPath: clean,
    };
  }

  // Services routing
  const parts = clean.split("/").filter(Boolean); // e.g. ['services', 'website-development', 'mumbai', 'andheri']
  if (parts[0] === "services") {
    if (parts.length === 2) {
      // /services/[slug]
      return {
        decision: "INDEX",
        isRobotsIndexable: true,
        isSitemapEligible: true,
        reason: "Authoritative primary commercial service page.",
        canonicalPath: clean,
      };
    }
    if (parts.length === 3) {
      // /services/[slug]/[city]
      return getLocalityPolicy(parts[1], parts[2]);
    }
    if (parts.length === 4) {
      // /services/[slug]/[city]/[subcity]
      return getLocalityPolicy(parts[1], parts[2], parts[3]);
    }
  }

  return {
    decision: "GONE",
    isRobotsIndexable: false,
    isSitemapEligible: false,
    reason: "Unrecognized route; return HTTP 404.",
    canonicalPath: clean,
  };
}
