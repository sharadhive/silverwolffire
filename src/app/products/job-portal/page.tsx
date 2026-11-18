import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCT_PLATFORMS, SITE } from '@/data/site';
import { ProductDetailPage } from '@/components/products/ProductDetailPage';
import { safeJsonLd } from '@/lib/jsonLd';

const product = PRODUCT_PLATFORMS.find((p) => p.slug === 'job-portal')!;

export const metadata: Metadata = {
  title: 'Job Board & Recruitment Portal Software India | Silver Wolf Technologies',
  description:
    'Custom job board software, applicant tracking systems (ATS), and recruitment platforms. Candidate portals, resume parsing, job listing feeds, and employer dashboards without recurring subscription fees.',
  alternates: {
    canonical: `${SITE.domain}/products/job-portal`,
  },
  openGraph: {
    title: 'Custom Job Board & Recruitment Portal Software | Silver Wolf Technologies',
    description:
      'High-performance recruitment platforms with resume ingestion, employer hiring pipelines, and automated candidate tracking. 100% code ownership with zero monthly per-job fees.',
    url: `${SITE.domain}/products/job-portal`,
    images: [{ url: '/portfolio-crm.png', width: 1200, height: 630, alt: 'Job Portal Platform Architecture' }],
  },
};

const JOB_PORTAL_FAQS = [
  {
    question: 'How does this recruitment portal software compare to rental platforms like JobBoard.io or SmartJobBoard?',
    answer:
      'Rental platforms charge recurring monthly fees ($100 to $500+/mo) and take transaction cuts on employer job packages while keeping your candidate database trapped on their proprietary servers. Our custom job board platform gives you 100% code and database ownership, custom monetization workflows, and zero monthly platform charges.',
  },
  {
    question: 'Can employers create sub-accounts and manage their own hiring pipelines?',
    answer:
      'Yes. Employers get dedicated self-service dashboards where they can post jobs, purchase credit packages via Indian UPI or international cards, review candidate applications, move candidates across visual Kanban hiring stages, and record internal interview notes.',
  },
  {
    question: 'Does the platform support automated candidate alerts via WhatsApp and email?',
    answer:
      'Yes. The system can trigger automated WhatsApp and email notifications when matching jobs are posted, when an application is reviewed or shortlisted, and when interview slots are requested.',
  },
  {
    question: 'Can we build custom pre-screening questions and filter candidates by score?',
    answer:
      'Absolutely. Employers can configure mandatory screening questions (e.g. notice period, relevant tech stack experience, CTC expectations) and automatically filter or tag incoming applications based on criteria.',
  },
];

const JOB_PORTAL_COMPARISON = [
  {
    feature: 'Monthly Platform & Listing Fees',
    silverWolf: 'Zero monthly fees (unlimited postings & candidates)',
    genericSaaS: '₹8,000–₹40,000 per month + per-post fees',
  },
  {
    feature: 'Candidate Database Ownership',
    silverWolf: '100% owned & stored in your private cloud database',
    genericSaaS: 'Data stored in shared multi-tenant SaaS silos',
  },
  {
    feature: 'Custom Monetization & UPI',
    silverWolf: 'Native Razorpay/Stripe with custom pricing tiers',
    genericSaaS: 'Limited international gateways with platform cuts',
  },
  {
    feature: 'WhatsApp Hiring Notifications',
    silverWolf: 'Direct WhatsApp Business API trigger support',
    genericSaaS: 'Requires expensive third-party automation tools',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Silver Wolf Custom Job Board & Recruitment Portal Software',
  operatingSystem: 'Web, Mobile Responsive',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    description: 'Custom enterprise implementation with full code ownership, 3 months free maintenance, and zero recurring platform fees.',
    availability: 'https://schema.org/InStock',
  },
  creator: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.domain,
  },
};

export default function JobPortalPage() {
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <ProductDetailPage
        product={product}
        faqs={JOB_PORTAL_FAQS}
        comparison={JOB_PORTAL_COMPARISON}
        crossLink={{
          badge: "Workforce & HR Systems",
          title: "Looking to Connect Hiring with Employee Onboarding & Attendance?",
          description: "Our HR & Attendance platform seamlessly connects candidate recruitment pipelines with automated employee onboarding, digital document vaults, and biometric/photo attendance.",
          href: "/products/hr-management",
          cta: "Explore Unified HR & Attendance Platform",
        }}
      />
    </>
  );
}
