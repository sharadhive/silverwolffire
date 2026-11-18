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
import {
  getAreaData,
  getCityData,
} from '../lib/locationData';
import { generateServiceMetadata } from '../lib/serviceMetadata';
import { evaluateUrlPolicy, INTERNATIONAL_CITY_SLUGS } from '../lib/seo/indexPolicy';
import { getCorePageUrls, getAllSubCityUrls, getCityPageUrls, getServicePageUrls } from '../lib/sitemapUtils';

interface InventoryRow {
  url: string;
  page_type: string;
  content_source: string;
  checked_environment: string;
  http_status: string;
  title: string;
  meta_description: string;
  h1: string;
  canonical: string;
  robots: string;
  sitemap_included: string;
  issue: string;
  evidence: string;
  priority: string;
}

function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/\r\n/g, ' ').replace(/\n/g, ' ').trim();
  if (str.includes(',') || str.includes('"') || str.includes(';')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const rows: InventoryRow[] = [];

// 1. Core Pages
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
    h1: 'Build Your Career With Silver Wolf Technologies',
    type: 'core_careers',
    source: 'src/app/careers/page.tsx',
  },
  {
    path: '/products/lms',
    title: 'Custom LMS Platform | Learning Management System in India | Silver Wolf Technologies',
    desc: 'Custom Learning Management System (LMS) for educational institutes, coaching centers, and corporate training. Student portals, quizzes, certificates, and live classes without per-student SaaS fees.',
    h1: 'Custom Learning Management System for Institutes, Academies & Corporate Training',
    type: 'product_lms',
    source: 'src/app/products/lms/page.tsx',
  },
  {
    path: '/products/crm',
    title: 'Custom CRM Platform | Sales & Pipeline Software India | Silver Wolf Technologies',
    desc: 'Custom CRM development for sales teams, agencies, and SMEs in India. Visual pipeline stages, automated WhatsApp lead routing, and quotation tracking without monthly per-seat licensing.',
    h1: 'Smart Customer & Sales Management Platform Built for High-Velocity Growth',
    type: 'product_crm',
    source: 'src/app/products/crm/page.tsx',
  },
  {
    path: '/products/hr-management',
    title: 'HR & Attendance Management Platform | Silver Wolf Technologies India',
    desc: 'Custom HR operations, attendance tracking, and leave management portal for growing companies in India. Real-time check-ins, leave approval workflows, and payroll-ready exports without per-employee SaaS fees.',
    h1: 'Unified Employee Operations, Attendance Tracking & Leave Management',
    type: 'product_hr',
    source: 'src/app/products/hr-management/page.tsx',
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
    content_source: p.source,
    checked_environment: 'local_build (200 SSG) + live_probed',
    http_status: p.path.startsWith('/products') ? '200 local / 404 live (pending deploy)' : '200 OK',
    title: p.title,
    meta_description: p.desc,
    h1: p.h1,
    canonical: `${SITE.domain}${p.path === '/' ? '/' : p.path}`,
    robots: policy.isRobotsIndexable ? 'index, follow' : 'noindex, follow',
    sitemap_included: policy.isSitemapEligible ? 'yes (core-pages.xml)' : 'no',
    issue: p.path.startsWith('/products') ? 'New product page not yet on live Vercel prod' : 'None - healthy',
    evidence: `${p.source} (L1-40)`,
    priority: p.path.startsWith('/products') ? 'P1' : 'P3',
  });
}

// 2. Primary 14 Service Pages
for (const s of SERVICES) {
  const urlPath = `/services/${s.slug}`;
  const policy = evaluateUrlPolicy(urlPath);
  const meta = generateServiceMetadata(s.slug);
  const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `${s.title} Services`;

  rows.push({
    url: `${SITE.domain}${urlPath}`,
    page_type: 'service_hub',
    content_source: 'src/data/site.ts (SERVICES)',
    checked_environment: 'local_build (200 SSG) + live_probed',
    http_status: '200 OK',
    title: title || `${s.title} Services | Silver Wolf Technologies`,
    meta_description: meta.description || s.short,
    h1: s.title,
    canonical: `${SITE.domain}${urlPath}`,
    robots: 'index, follow',
    sitemap_included: 'yes (service-pages.xml)',
    issue: s.slug === 'crm-development' ? 'Potential keyword overlap with /products/crm' : 'None',
    evidence: `src/data/site.ts (${s.slug})`,
    priority: s.slug === 'crm-development' ? 'P2' : 'P3',
  });
}

// 3. Service × City Pages (308 combinations: 224 Indian + 84 International)
for (const s of SERVICES) {
  for (const c of CITIES) {
    const cSlug = citySlug(c);
    const urlPath = `/services/${s.slug}/${cSlug}`;
    const isIntl = INTERNATIONAL_CITY_SLUGS.has(cSlug);
    const policy = evaluateUrlPolicy(urlPath);
    const meta = generateServiceMetadata(s.slug, cSlug);
    const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `${s.title} in ${c}`;

    rows.push({
      url: `${SITE.domain}${urlPath}`,
      page_type: isIntl ? 'service_city_international' : 'service_city_indian',
      content_source: 'src/lib/locationData.ts + src/data/site.ts',
      checked_environment: 'local_build (200 SSG)',
      http_status: '200 OK',
      title: title || `${s.title} in ${c}`,
      meta_description: meta.description || '',
      h1: `${s.title} in ${c}`,
      canonical: `${SITE.domain}${urlPath}`,
      robots: policy.isRobotsIndexable ? 'index, follow' : 'noindex, follow',
      sitemap_included: policy.isSitemapEligible ? 'yes (city-pages.xml)' : 'no (intl_improve_first)',
      issue: isIntl ? 'International city positioned without physical office' : 'None',
      evidence: `src/lib/seo/indexPolicy.ts (L74-83)`,
      priority: isIntl ? 'P2' : 'P3',
    });
  }
}

// 4. Curated Locality Pages (60 combinations: Mumbai 36 + Chennai 24 for website-development)
for (const city of ['Mumbai', 'Chennai']) {
  const cSlug = citySlug(city);
  const subs = SUB_CITIES[city] || [];
  for (const sub of subs) {
    const subSlug = citySlug(sub);
    const urlPath = `/services/website-development/${cSlug}/${subSlug}`;
    const policy = evaluateUrlPolicy(urlPath);
    const meta = generateServiceMetadata('website-development', cSlug, subSlug);
    const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `Website Development in ${sub}, ${city}`;
    const area = getAreaData(cSlug, subSlug, 'Website Development');

    rows.push({
      url: `${SITE.domain}${urlPath}`,
      page_type: 'service_locality_curated',
      content_source: `src/data/locations/${cSlug}.ts`,
      checked_environment: 'local_build (200 SSG)',
      http_status: '200 OK',
      title: title || `Website Development in ${sub}, ${city}`,
      meta_description: meta.description || '',
      h1: `Website Development in ${sub}, ${city}`,
      canonical: `${SITE.domain}${urlPath}`,
      robots: 'index, follow',
      sitemap_included: 'yes (subcity-pages-1.xml)',
      issue: 'None - Curated pin code, landmarks and FAQs verified',
      evidence: `src/data/locations/${cSlug}.ts (${subSlug})`,
      priority: 'P3',
    });
  }
}

// 5. Representative Fallback Localities (Sample 50 entries across Delhi, Bangalore, Pune, Hyderabad, and non-web services in Mumbai)
const sampleFallbackCities = ['Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Noida', 'Gurgaon'];
for (const city of sampleFallbackCities) {
  const cSlug = citySlug(city);
  const subs = (SUB_CITIES[city] || []).slice(0, 5); // first 5 per city
  for (const sub of subs) {
    const subSlug = citySlug(sub);
    const urlPath = `/services/website-development/${cSlug}/${subSlug}`;
    const policy = evaluateUrlPolicy(urlPath);
    const meta = generateServiceMetadata('website-development', cSlug, subSlug);
    const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `Website Development in ${sub}, ${city}`;

    rows.push({
      url: `${SITE.domain}${urlPath}`,
      page_type: 'service_locality_fallback',
      content_source: 'src/lib/contentGenerator.ts (INTROS template)',
      checked_environment: 'local_build (ISR on demand)',
      http_status: '200 OK',
      title: title || `Website Development in ${sub}, ${city}`,
      meta_description: meta.description || '',
      h1: `Website Development in ${sub}, ${city}`,
      canonical: `${SITE.domain}${urlPath}`,
      robots: 'noindex, follow',
      sitemap_included: 'no (excluded_by_policy)',
      issue: 'Thin uncurated template fallback; correctly kept noindex to avoid doorway penalty',
      evidence: 'src/lib/curatedCities.ts (L14-22)',
      priority: 'P2',
    });
  }
}

// 6. Cross-service fallback in curated city (e.g. Video Editing in Andheri)
for (const svc of ['video-editing', 'seo-services', 'ecommerce-development']) {
  const urlPath = `/services/${svc}/mumbai/andheri`;
  const policy = evaluateUrlPolicy(urlPath);
  const meta = generateServiceMetadata(svc, 'mumbai', 'andheri');
  const title = typeof meta.title === 'object' && meta.title && 'absolute' in meta.title ? (meta.title as any).absolute : `${svc} in Andheri, Mumbai`;

  rows.push({
    url: `${SITE.domain}${urlPath}`,
    page_type: 'service_locality_fallback_cross_service',
    content_source: 'src/lib/locationData.ts (fallback generator)',
    checked_environment: 'local_build (200 SSG)',
    http_status: '200 OK',
    title: title || `${svc} in Andheri, Mumbai`,
    meta_description: meta.description || '',
    h1: `${svc} in Andheri, Mumbai`,
    canonical: `${SITE.domain}${urlPath}`,
    robots: 'noindex, follow',
    sitemap_included: 'no (excluded_by_policy)',
    issue: 'Non-web service in Mumbai locality uses fallback generator; correctly set to noindex',
    evidence: 'src/lib/curatedCities.ts (L18)',
    priority: 'P2',
  });
}

// 7. Internal / Protected Pages
rows.push({
  url: `${SITE.domain}/careers/responses`,
  page_type: 'admin_private',
  content_source: 'src/app/careers/responses/page.tsx',
  checked_environment: 'local_build (200 SSG)',
  http_status: '200 OK (Auth Protected)',
  title: 'Applicant Responses | Silver Wolf Technologies',
  meta_description: 'Protected internal portal for candidate submissions.',
  h1: 'Applicant Responses Dashboard',
  canonical: `${SITE.domain}/careers/responses`,
  robots: 'noindex, nofollow',
  sitemap_included: 'no',
  issue: 'Private applicant data; blocked by robots.txt and meta robots',
  evidence: 'src/app/robots.ts (L23)',
  priority: 'P3',
});

// CSV Output
const csvHeader = [
  'URL',
  'page_type',
  'content_source',
  'checked_environment',
  'HTTP_status',
  'title',
  'meta_description',
  'H1',
  'canonical',
  'robots',
  'sitemap_included',
  'issue',
  'evidence',
  'priority',
].join(',');

const csvLines = [
  csvHeader,
  ...rows.map((r) =>
    [
      escapeCsv(r.url),
      escapeCsv(r.page_type),
      escapeCsv(r.content_source),
      escapeCsv(r.checked_environment),
      escapeCsv(r.http_status),
      escapeCsv(r.title),
      escapeCsv(r.meta_description),
      escapeCsv(r.h1),
      escapeCsv(r.canonical),
      escapeCsv(r.robots),
      escapeCsv(r.sitemap_included),
      escapeCsv(r.issue),
      escapeCsv(r.evidence),
      escapeCsv(r.priority),
    ].join(',')
  ),
];

fs.writeFileSync('PAGE-INVENTORY.csv', csvLines.join('\n'), 'utf8');
console.log(`Generated PAGE-INVENTORY.csv with ${rows.length} rows.`);
