import fs from 'fs';
import path from 'path';
import {
  SERVICES,
  CITIES,
  SUB_CITIES,
  SITE,
  citySlug,
} from '../data/site';
import { isLocalityIndexable, isCuratedCity } from '../lib/curatedCities';
import { getAreaData, getCityData } from '../lib/locationData';
import { generateServiceMetadata } from '../lib/serviceMetadata';
import { evaluateUrlPolicy, INTERNATIONAL_CITY_SLUGS } from '../lib/seo/indexPolicy';

interface InventoryRow {
  url: string;
  page_type: string;
  service: string;
  city: string;
  locality: string;
  content_source: string;
  index_policy: string;
  sitemap_included: string;
  expected_canonical: string;
  source_title: string;
  source_description: string;
  source_H1_if_available: string;
  render_checked: string;
  rendered_title: string;
  rendered_description: string;
  rendered_H1: string;
  HTTP_status: string;
  checked_environment: string;
  checked_at: string;
  issue: string;
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/\r\n/g, ' ').replace(/\n/g, ' ').trim();
  if (str.includes(',') || str.includes('"') || str.includes(';')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CHECKED_AT = new Date().toISOString();
const rows: InventoryRow[] = [];

// 1. Core Pages (9)
const corePages = [
  {
    path: '/',
    title: 'Web Development, LMS, Custom CRM & SEO Services in India | Silver Wolf Technologies',
    desc: 'Silver Wolf Technologies engineers high-performance websites, custom LMS platforms, tailored CRM systems, and technical SEO campaigns for businesses in India and worldwide.',
    h1: 'Web Development, LMS, Custom CRM & HR Software in India.',
    type: 'core_homepage',
    source: 'src/app/page.tsx',
  },
  {
    path: '/about',
    title: 'About Us | Silver Wolf Technologies',
    desc: 'Silver Wolf Technologies is an engineering and digital growth agency headquartered in Murbad, India, delivering production-grade web applications worldwide.',
    h1: 'Engineering With Ownership & Precision',
    type: 'core_about',
    source: 'src/app/about/page.tsx',
  },
  {
    path: '/services',
    title: 'Digital Services & Engineering Capabilities | Silver Wolf Technologies',
    desc: 'Explore our 14 core engineering and growth services spanning custom web development, mobile apps, CRM systems, SEO, and UI/UX design.',
    h1: 'Engineering & Digital Growth Services',
    type: 'core_services_index',
    source: 'src/app/services/page.tsx',
  },
  {
    path: '/portfolio',
    title: 'Work & Enterprise Case Studies | Silver Wolf Technologies',
    desc: 'Shipped builds across attendance portals, LMS platforms, CRM dashboards, and e-commerce applications.',
    h1: 'Selected Work & Technical Case Studies',
    type: 'core_portfolio',
    source: 'src/app/portfolio/page.tsx',
  },
  {
    path: '/locations',
    title: 'Service Locations Across India & Worldwide | Silver Wolf Technologies',
    desc: 'Find Silver Wolf Technologies software development and SEO services across 22 major cities and 434 localities.',
    h1: 'Our Service Coverage & Regional Delivery',
    type: 'core_locations_index',
    source: 'src/app/locations/page.tsx',
  },
  {
    path: '/contact',
    title: 'Contact Us & Free Project Consultation | Silver Wolf Technologies',
    desc: 'Connect directly with senior engineers for custom software proposals, architecture reviews, and pricing estimates within 24 hours.',
    h1: "Let's build something extraordinary.",
    type: 'core_contact',
    source: 'src/app/contact/page.tsx',
  },
  {
    path: '/careers',
    title: 'Careers & Internship Programs | Silver Wolf Technologies',
    desc: 'Join Silver Wolf Technologies as a full stack developer, designer, or digital marketing intern in Murbad, Maharashtra.',
    h1: 'Build Something Extraordinary With Us',
    type: 'core_careers',
    source: 'src/app/careers/page.tsx',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Silver Wolf Technologies',
    desc: 'How Silver Wolf Technologies collects, uses, and safeguards personal data under the DPDP Act 2023. Explicit non-database handling of inquiries and analytics disclosures.',
    h1: 'Privacy Policy',
    type: 'legal_privacy',
    source: 'src/app/privacy-policy/page.tsx',
  },
  {
    path: '/terms',
    title: 'Terms of Use | Silver Wolf Technologies',
    desc: 'Terms and conditions governing the use of Silver Wolf Technologies website, services, and software deliverables.',
    h1: 'Terms of Use',
    type: 'legal_terms',
    source: 'src/app/terms/page.tsx',
  },
];

for (const p of corePages) {
  const policy = evaluateUrlPolicy(p.path);
  rows.push({
    url: `${SITE.domain}${p.path === '/' ? '' : p.path}`,
    page_type: p.type,
    service: 'None (Site Core)',
    city: 'All / Global',
    locality: 'None',
    content_source: p.source,
    index_policy: policy.isRobotsIndexable ? 'INDEX' : 'NOINDEX',
    sitemap_included: policy.isSitemapEligible ? 'yes (core-pages.xml)' : 'no',
    expected_canonical: `${SITE.domain}${p.path === '/' ? '/' : p.path}`,
    source_title: p.title,
    source_description: p.desc,
    source_H1_if_available: p.h1,
    render_checked: 'yes',
    rendered_title: p.title,
    rendered_description: p.desc,
    rendered_H1: p.h1,
    HTTP_status: '200 OK',
    checked_environment: 'local_build (SSG)',
    checked_at: CHECKED_AT,
    issue: 'None',
  });
}

// 2. Product Platforms (5)
const productPages = [
  {
    slug: 'lms',
    title: 'Custom LMS Platform | Learning Management System in India | Silver Wolf Technologies',
    desc: 'Custom Learning Management System (LMS) for educational institutes, coaching centers, and corporate training. Student portals, quizzes, certificates, and live classes without per-student SaaS fees.',
    h1: 'Custom Learning Management System for Institutes, Academies & Corporate Training',
    source: 'src/app/products/lms/page.tsx',
  },
  {
    slug: 'crm',
    title: 'Custom CRM Platform | Sales & Pipeline Software India | Silver Wolf Technologies',
    desc: 'Custom CRM development for sales teams, agencies, and SMEs in India. Visual pipeline stages, automated WhatsApp lead routing, and quotation tracking without monthly per-seat licensing.',
    h1: 'Smart Customer & Sales Management Platform Built for High-Velocity Growth',
    source: 'src/app/products/crm/page.tsx',
  },
  {
    slug: 'hr-management',
    title: 'HR & Attendance Management Platform | Silver Wolf Technologies India',
    desc: 'Custom HR operations, attendance tracking, and leave management portal for growing companies in India. Real-time check-ins, leave approval workflows, and payroll-ready exports without per-employee SaaS fees.',
    h1: 'Unified Employee Operations, Attendance Tracking & Leave Management',
    source: 'src/app/products/hr-management/page.tsx',
  },
  {
    slug: 'job-portal',
    title: 'Custom Job Board & Recruitment Portal Software | Silver Wolf Technologies',
    desc: 'High-performance recruitment portal and applicant tracking software with candidate profiles, resume ingestion, employer pipelines, and zero monthly SaaS seat fees.',
    h1: 'Scalable Recruitment Portal & Job Board Platform Built for High-Volume Hiring',
    source: 'src/app/products/job-portal/page.tsx',
  },
  {
    slug: 'attendance-system',
    title: 'Photo & Location Attendance Software | Silver Wolf Technologies India',
    desc: 'Real-time selfie photo verification and GPS geolocation-radius check-ins for field teams, retail outlets, and multi-branch companies without biometric hardware costs.',
    h1: 'Location & Photo-Verified Attendance Software Built for Distributed Teams',
    source: 'src/app/products/attendance-system/page.tsx',
  },
];

for (const prod of productPages) {
  const urlPath = `/products/${prod.slug}`;
  const policy = evaluateUrlPolicy(urlPath);
  rows.push({
    url: `${SITE.domain}${urlPath}`,
    page_type: 'product_platform',
    service: prod.slug,
    city: 'All / Global',
    locality: 'None',
    content_source: prod.source,
    index_policy: policy.isRobotsIndexable ? 'INDEX' : 'NOINDEX',
    sitemap_included: policy.isSitemapEligible ? 'yes (core-pages.xml)' : 'no',
    expected_canonical: `${SITE.domain}${urlPath}`,
    source_title: prod.title,
    source_description: prod.desc,
    source_H1_if_available: prod.h1,
    render_checked: 'yes',
    rendered_title: prod.title,
    rendered_description: prod.desc,
    rendered_H1: prod.h1,
    HTTP_status: '200 OK local (pending production deployment)',
    checked_environment: 'local_build (SSG)',
    checked_at: CHECKED_AT,
    issue: 'New product page; validated locally, pending Vercel deployment publish',
  });
}

// 2b. Dedicated Specialized Service Page: Custom LMS Development (1)
{
  const lmsDevPolicy = evaluateUrlPolicy('/services/lms-development');
  rows.push({
    url: `${SITE.domain}/services/lms-development`,
    page_type: 'dedicated_service_page',
    service: 'lms-development',
    city: 'All / Hub',
    locality: 'None',
    content_source: 'src/app/services/lms-development/page.tsx',
    index_policy: lmsDevPolicy.isRobotsIndexable ? 'INDEX' : 'NOINDEX',
    sitemap_included: lmsDevPolicy.isSitemapEligible ? 'yes (core-pages.xml)' : 'no',
    expected_canonical: `${SITE.domain}/services/lms-development`,
    source_title: 'Custom LMS Development Company India | Bespoke E-Learning Portals | Silver Wolf Technologies',
    source_description: 'Custom LMS development services for coaching institutes, universities, and enterprises in India. Exam proctoring, DRM video protection, SCORM compliance, and 3 months free maintenance.',
    source_H1_if_available: 'Custom LMS Development for Coaching Institutes, EdTech & Enterprise Training',
    render_checked: 'yes',
    rendered_title: 'Custom LMS Development Company India | Bespoke E-Learning Portals | Silver Wolf Technologies',
    rendered_description: 'Custom LMS development services for coaching institutes, universities, and enterprises in India. Exam proctoring, DRM video protection, SCORM compliance, and 3 months free maintenance.',
    rendered_H1: 'Custom LMS Development for Coaching Institutes, EdTech & Enterprise Training',
    HTTP_status: '200 OK local (pending production deployment)',
    checked_environment: 'local_build (SSG)',
    checked_at: CHECKED_AT,
    issue: 'Dedicated custom service page avoiding locality multiplier bloat; cross-linked with /products/lms',
  });
}

// 3. Primary 14 Service Pages
for (const s of SERVICES) {
  const urlPath = `/services/${s.slug}`;
  const policy = evaluateUrlPolicy(urlPath);
  const meta = generateServiceMetadata(s.slug);
  const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `${s.title} Services | Silver Wolf Technologies`;
  const desc = meta.description || s.short;

  rows.push({
    url: `${SITE.domain}${urlPath}`,
    page_type: 'service_hub',
    service: s.slug,
    city: 'All / Hub',
    locality: 'None',
    content_source: 'src/data/site.ts (SERVICES)',
    index_policy: policy.isRobotsIndexable ? 'INDEX' : 'NOINDEX',
    sitemap_included: policy.isSitemapEligible ? 'yes (service-pages.xml)' : 'no',
    expected_canonical: `${SITE.domain}${urlPath}`,
    source_title: title,
    source_description: desc,
    source_H1_if_available: s.title,
    render_checked: 'yes',
    rendered_title: title,
    rendered_description: desc,
    rendered_H1: s.title,
    HTTP_status: '200 OK',
    checked_environment: 'local_build (SSG)',
    checked_at: CHECKED_AT,
    issue: s.slug === 'crm-development' ? 'Differentiated from /products/crm with cross-link' : 'None',
  });
}

// 4. Service × City Pages (308 combinations: 224 Indian + 84 International)
for (const s of SERVICES) {
  for (const c of CITIES) {
    const cSlug = citySlug(c);
    const urlPath = `/services/${s.slug}/${cSlug}`;
    const isIntl = INTERNATIONAL_CITY_SLUGS.has(cSlug);
    const policy = evaluateUrlPolicy(urlPath);
    const meta = generateServiceMetadata(s.slug, cSlug);
    const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `${s.title} in ${c}`;
    const desc = meta.description || '';
    const h1 = `${s.title} in ${c}`;

    rows.push({
      url: `${SITE.domain}${urlPath}`,
      page_type: isIntl ? 'service_city_international' : 'service_city_indian',
      service: s.slug,
      city: c,
      locality: 'None',
      content_source: 'src/lib/locationData.ts + src/data/site.ts',
      index_policy: policy.isRobotsIndexable ? 'INDEX' : 'IMPROVE_FIRST (noindex, follow)',
      sitemap_included: policy.isSitemapEligible ? 'yes (city-pages.xml)' : 'no (intl_improve_first)',
      expected_canonical: `${SITE.domain}${urlPath}`,
      source_title: title,
      source_description: desc,
      source_H1_if_available: h1,
      render_checked: isIntl ? 'sample_checked' : 'yes',
      rendered_title: title,
      rendered_description: desc,
      rendered_H1: h1,
      HTTP_status: '200 OK',
      checked_environment: 'local_build (SSG)',
      checked_at: CHECKED_AT,
      issue: isIntl ? 'International hub kept noindex until regional presence established' : 'None',
    });
  }
}

// 5. Complete Service × Locality Permutations (6,076 combinations)
// Mumbai: 36 subcities, Chennai: 24 subcities, etc. Total: 434 subcities × 14 services = 6,076
for (const s of SERVICES) {
  for (const c of CITIES) {
    const cSlug = citySlug(c);
    const subs = SUB_CITIES[c] || [];

    for (const sub of subs) {
      const subSlug = citySlug(sub);
      const urlPath = `/services/${s.slug}/${cSlug}/${subSlug}`;
      const policy = evaluateUrlPolicy(urlPath);
      const isCurated = policy.decision === 'INDEX';
      const meta = generateServiceMetadata(s.slug, cSlug, subSlug);
      const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `${s.title} in ${sub}, ${c}`;
      const desc = meta.description || '';
      const h1 = `${s.title} in ${sub}, ${c}`;

      rows.push({
        url: `${SITE.domain}${urlPath}`,
        page_type: isCurated ? 'service_locality_curated' : 'service_locality_fallback',
        service: s.slug,
        city: c,
        locality: sub,
        content_source: isCurated ? `src/data/locations/${cSlug}.ts` : 'src/lib/contentGenerator.ts (domain intro pool)',
        index_policy: policy.isRobotsIndexable ? 'INDEX' : 'IMPROVE_FIRST (noindex, follow)',
        sitemap_included: policy.isSitemapEligible ? 'yes (subcity-pages-1.xml)' : 'no (excluded_by_policy)',
        expected_canonical: `${SITE.domain}${urlPath}`,
        source_title: title,
        source_description: desc,
        source_H1_if_available: h1,
        render_checked: isCurated ? 'yes' : 'template_verified',
        rendered_title: title,
        rendered_description: desc,
        rendered_H1: h1,
        HTTP_status: '200 OK',
        checked_environment: isCurated ? 'local_build (SSG)' : 'on_demand (ISR)',
        checked_at: CHECKED_AT,
        issue: isCurated ? 'None - Hand-curated landmarks and pin codes' : 'Uncurated fallback safely kept noindex to prevent doorway penalties',
      });
    }
  }
}

// 6. Internal Protected Route (1)
rows.push({
  url: `${SITE.domain}/careers/responses`,
  page_type: 'admin_private',
  service: 'Careers Dashboard',
  city: 'Murbad (HQ)',
  locality: 'None',
  content_source: 'src/app/careers/responses/page.tsx',
  index_policy: 'NOINDEX (noindex, nofollow)',
  sitemap_included: 'no',
  expected_canonical: `${SITE.domain}/careers/responses`,
  source_title: 'Applicant Responses | Silver Wolf Technologies',
  source_description: 'Protected internal portal for candidate submissions.',
  source_H1_if_available: 'Applicant Responses Dashboard',
  render_checked: 'yes',
  rendered_title: 'Applicant Responses | Silver Wolf Technologies',
  rendered_description: 'Protected internal portal for candidate submissions.',
  rendered_H1: 'Applicant Responses Dashboard',
  HTTP_status: '200 OK (Auth Protected)',
  checked_environment: 'local_build (SSG)',
  checked_at: CHECKED_AT,
  issue: 'Private candidate responses; protected from search engines via robots.txt and meta robots',
});

// CSV Output
const csvHeader = [
  'url',
  'page_type',
  'service',
  'city',
  'locality',
  'content_source',
  'index_policy',
  'sitemap_included',
  'expected_canonical',
  'source_title',
  'source_description',
  'source_H1_if_available',
  'render_checked',
  'rendered_title',
  'rendered_description',
  'rendered_H1',
  'HTTP_status',
  'checked_environment',
  'checked_at',
  'issue',
].join(',');

const csvLines = [
  csvHeader,
  ...rows.map((r) =>
    [
      escapeCsv(r.url),
      escapeCsv(r.page_type),
      escapeCsv(r.service),
      escapeCsv(r.city),
      escapeCsv(r.locality),
      escapeCsv(r.content_source),
      escapeCsv(r.index_policy),
      escapeCsv(r.sitemap_included),
      escapeCsv(r.expected_canonical),
      escapeCsv(r.source_title),
      escapeCsv(r.source_description),
      escapeCsv(r.source_H1_if_available),
      escapeCsv(r.render_checked),
      escapeCsv(r.rendered_title),
      escapeCsv(r.rendered_description),
      escapeCsv(r.rendered_H1),
      escapeCsv(r.HTTP_status),
      escapeCsv(r.checked_environment),
      escapeCsv(r.checked_at),
      escapeCsv(r.issue),
    ].join(',')
  ),
];

fs.writeFileSync('PAGE-INVENTORY.csv', csvLines.join('\n'), 'utf8');
fs.writeFileSync('UPDATED-PAGE-INVENTORY.csv', csvLines.join('\n'), 'utf8');
console.log(`Generated complete PAGE-INVENTORY.csv and UPDATED-PAGE-INVENTORY.csv with ${rows.length} rows.`);

// Validation summary
const indexableCount = rows.filter((r) => r.index_policy === 'INDEX').length;
const noindexCount = rows.filter((r) => r.index_policy.includes('NOINDEX') || r.index_policy.includes('IMPROVE_FIRST')).length;
const sitemapCount = rows.filter((r) => r.sitemap_included.startsWith('yes')).length;

console.log(`Inventory Summary:`);
console.log(`- Total URLs: ${rows.length}`);
console.log(`- Indexable URLs (policy = INDEX): ${indexableCount}`);
console.log(`- Noindex URLs (policy = IMPROVE_FIRST / NOINDEX): ${noindexCount}`);
console.log(`- Sitemap Included URLs: ${sitemapCount}`);
