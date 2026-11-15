import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCT_PLATFORMS, SITE } from '@/data/site';
import { ProductDetailPage } from '@/components/products/ProductDetailPage';
import { safeJsonLd } from '@/lib/jsonLd';

const product = PRODUCT_PLATFORMS.find((p) => p.slug === 'hr-management')!;

export const metadata: Metadata = {
  title: 'HR & Attendance Management Platform | Silver Wolf Technologies India',
  description:
    'Custom HR operations, attendance tracking, and leave management portal for growing companies in India. Real-time check-ins, leave approval workflows, and payroll-ready exports without per-employee SaaS fees.',
  alternates: {
    canonical: `${SITE.domain}/products/hr-management`,
  },
  openGraph: {
    title: 'HR & Attendance Management Platform | Silver Wolf Technologies',
    description:
      'Unified workforce operations, attendance logging, leave approvals, and payroll-ready reporting for teams of 15 to 500+ employees.',
    url: `${SITE.domain}/products/hr-management`,
    images: [{ url: '/portfolio-hr.png', width: 1200, height: 630, alt: 'HR Management Platform Architecture' }],
  },
};

const HR_FAQS = [
  {
    question: 'How does the platform handle employee attendance tracking?',
    answer:
      'We support multiple secure check-in options based on your company policy: mobile GPS geofencing (for on-site/field staff), office Wi-Fi / IP restriction, QR code scanning, or hardware biometric machine integration via API.',
  },
  {
    question: 'How are leave approvals and holiday calendars configured?',
    answer:
      'Employees can submit leave requests from their mobile dashboard. Managers receive instant notifications via email/WhatsApp with one-click approve/reject actions. The portal automatically tracks leave balances across Casual, Sick, and Earned leaves.',
  },
  {
    question: 'Can attendance data be exported directly into our payroll software?',
    answer:
      'Yes. HR managers can generate one-click CSV and Excel reports with total working days, approved leaves, unpaid leaves, late arrivals, and overtime hours formatted for seamless import into Tally, Zoho Payroll, RazorpayX, or manual bank transfers.',
  },
  {
    question: 'Is employee document storage secure and compliant with privacy laws?',
    answer:
      'All employee records (Aadhaar, PAN, offer letters, appraisal documents) are encrypted at rest using AES-256 and stored in secure cloud buckets with strict role-based access control, adhering to India’s DPDP Act guidelines.',
  },
];

const HR_COMPARISON = [
  {
    feature: 'Monthly Per-Employee Charge',
    silverWolf: 'Zero per-employee recurring fees (unlimited staff)',
    genericSaaS: '₹80–₹350 per employee every month (scales up exponentially)',
  },
  {
    feature: 'Biometric & Geolocation Sync',
    silverWolf: 'Direct IP, GPS, or Biometric device API integration',
    genericSaaS: 'Often requires premium enterprise tiers or hardware lock-in',
  },
  {
    feature: 'Custom Approval Hierarchies',
    silverWolf: 'Tailored multi-tier manager approval chains',
    genericSaaS: 'Rigid fixed hierarchy without custom exceptions',
  },
  {
    feature: 'Payroll-Ready Export Format',
    silverWolf: 'Custom formatted Excel/CSV matching your accounting rules',
    genericSaaS: 'Generic export requiring manual cleanup every month',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Silver Wolf Custom HR & Attendance Platform',
  operatingSystem: 'Web, Mobile Responsive',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Custom implementation with full code ownership and zero monthly per-employee fees.',
  },
  creator: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.domain,
  },
};

export default function HrManagementPage() {
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <ProductDetailPage
        product={product}
        faqs={HR_FAQS}
        comparison={HR_COMPARISON}
      />
    </>
  );
}
