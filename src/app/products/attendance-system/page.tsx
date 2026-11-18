import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCT_PLATFORMS, SITE } from '@/data/site';
import { ProductDetailPage } from '@/components/products/ProductDetailPage';
import { safeJsonLd } from '@/lib/jsonLd';

const product = PRODUCT_PLATFORMS.find((p) => p.slug === 'attendance-system')!;

export const metadata: Metadata = {
  title: 'Location & Photo-Based Attendance Software India | Silver Wolf Technologies',
  description:
    'Real-time employee attendance tracking with selfie photo verification and GPS geolocation tagging. Anti-spoofing controls, shift scheduling, leave workflows, and payroll-ready exports without biometric hardware.',
  alternates: {
    canonical: `${SITE.domain}/products/attendance-system`,
  },
  openGraph: {
    title: 'Location & Photo-Based Attendance Software | Silver Wolf Technologies',
    description:
      'Field-proven attendance system with selfie photo check-ins, GPS radius matching, and payroll exports. No hardware dependency; works on any smartphone browser.',
    url: `${SITE.domain}/products/attendance-system`,
    images: [{ url: '/portfolio-hr.png', width: 1200, height: 630, alt: 'Attendance System Architecture' }],
  },
};

const ATTENDANCE_FAQS = [
  {
    question: 'How does photo and location-based check-in prevent buddy punching and fraud?',
    answer:
      'When an employee punches in, the system captures a real-time front-camera selfie with an embedded timestamp while simultaneously verifying their GPS coordinates against the assigned branch or job-site geofence radius. Check-ins from outside authorized coordinates or without camera verification are flagged for manager review.',
  },
  {
    question: 'Does this software require employees to download a heavy mobile app?',
    answer:
      'No. The attendance portal is engineered as a lightweight Progressive Web App (PWA) and responsive mobile web application that runs directly in any modern smartphone browser (Chrome, Safari, Edge) without requiring mandatory app store downloads or device-specific licenses.',
  },
  {
    question: 'Can the system handle multi-shift rosters and rotational working hours?',
    answer:
      'Yes. Administrators can configure morning, evening, night, and flexible shifts, assign individual or department-level rosters, and automatically calculate early departures, late marks, and eligible overtime hours.',
  },
  {
    question: 'How are attendance logs exported for month-end payroll reconciliation?',
    answer:
      'HR managers can download complete attendance summaries, total working hours, approved leaves, and overtime calculations in pre-formatted Excel or CSV files ready for import into Tally, Zoho Payroll, Keka, or proprietary ERPs.',
  },
];

const ATTENDANCE_COMPARISON = [
  {
    feature: 'Hardware & Reader Dependency',
    silverWolf: 'Zero hardware costs (works on any mobile smartphone)',
    genericSaaS: 'Requires expensive biometric scanners (₹15,000–₹50,000 per office)',
  },
  {
    feature: 'Monthly Per-Employee Licensing',
    silverWolf: 'Zero per-employee monthly fees (unlimited users)',
    genericSaaS: '₹50–₹200 per employee per month forever',
  },
  {
    feature: 'Selfie Photo & GPS Geofencing',
    silverWolf: 'Real-time selfie capture + GPS radius verification included',
    genericSaaS: 'Often locked behind expensive top-tier enterprise plans',
  },
  {
    feature: 'Maintenance & Code Ownership',
    silverWolf: 'Full source code ownership + 3 months free maintenance',
    genericSaaS: 'Rented cloud service with periodic vendor price hikes',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Silver Wolf Photo & Location Attendance Software',
  operatingSystem: 'Web, Mobile Responsive, iOS, Android',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    description: 'Custom implementation with full code ownership, 3 months free maintenance, and zero recurring monthly per-employee fees.',
    availability: 'https://schema.org/InStock',
  },
  creator: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.domain,
  },
};

export default function AttendanceSystemPage() {
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <ProductDetailPage
        product={product}
        faqs={ATTENDANCE_FAQS}
        comparison={ATTENDANCE_COMPARISON}
        crossLink={{
          badge: "Full HR Suite",
          title: "Looking for Complete HR Operations & Employee Management?",
          description: "Our comprehensive HR Management Platform unifies photo attendance tracking with leave approval chains, employee document vaults, digital onboarding checklists, and company announcements.",
          href: "/products/hr-management",
          cta: "View Unified HR Management Platform",
        }}
      />
    </>
  );
}
