import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCT_PLATFORMS, SITE } from '@/data/site';
import { ProductDetailPage } from '@/components/products/ProductDetailPage';
import { safeJsonLd } from '@/lib/jsonLd';

const product = PRODUCT_PLATFORMS.find((p) => p.slug === 'crm')!;

export const metadata: Metadata = {
  title: 'Custom CRM Platform | Sales & Pipeline Software India | Silver Wolf Technologies',
  description:
    'Custom CRM development for sales teams, agencies, and SMEs in India. Visual pipeline stages, automated WhatsApp lead routing, and quotation tracking without monthly per-seat licensing.',
  alternates: {
    canonical: `${SITE.domain}/products/crm`,
  },
  openGraph: {
    title: 'Custom CRM Platform | Silver Wolf Technologies',
    description:
      'Proprietary sales CRM platform with WhatsApp automation, lead routing, and Kanban pipelines. Tailored to your exact business workflow.',
    url: `${SITE.domain}/products/crm`,
    images: [{ url: '/portfolio-crm.png', width: 1200, height: 630, alt: 'CRM Platform Architecture' }],
  },
};

const CRM_FAQS = [
  {
    question: 'Why choose a custom CRM over HubSpot, Zoho, or Salesforce?',
    answer:
      'Commercial SaaS CRMs become exorbitant as your team scales, charging $50 to $150+ per user every single month, while locking your data in proprietary silos. Our custom CRM is built for your exact sales funnel, includes direct WhatsApp API routing, and charges zero per-user monthly subscription fees.',
  },
  {
    question: 'Can the CRM automatically capture leads from our website and social ads?',
    answer:
      'Yes. We build webhook listeners and direct API integrations that automatically capture inquiries from Google Ads, Meta Ads (Facebook/Instagram), your website forms, landing pages, and inbound WhatsApp messages, immediately assigning them to the right sales reps.',
  },
  {
    question: 'Does the CRM integrate with official WhatsApp Business API?',
    answer:
      'Yes. Sales reps can send automated template messages, follow-up reminders, proposal PDFs, and receive customer replies directly inside the CRM lead timeline.',
  },
  {
    question: 'Can we define custom pipeline stages and role-based access?',
    answer:
      'Absolutely. Every pipeline stage, deal probability, lead source, and team access permission (Admins, Managers, Sales Reps) is configured around your operational workflow.',
  },
];

const CRM_COMPARISON = [
  {
    feature: 'Per-User License Cost',
    silverWolf: 'Zero per-seat recurring fees (unlimited users)',
    genericSaaS: '₹3,000–₹12,000 per user per month',
  },
  {
    feature: 'WhatsApp Direct Routing',
    silverWolf: 'Native WhatsApp Business API integration included',
    genericSaaS: 'Requires expensive third-party plugins (e.g. Zapier/Twilio)',
  },
  {
    feature: 'Custom Sales Workflows',
    silverWolf: 'Engineered exactly to your business logic & quotation rules',
    genericSaaS: 'Rigid generic fields with complex workaround scripting',
  },
  {
    feature: 'Data Sovereignty & Security',
    silverWolf: 'Hosted in your cloud database (Postgres/MongoDB)',
    genericSaaS: 'Data stored in shared multi-tenant international servers',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Silver Wolf Custom CRM Platform',
  operatingSystem: 'Web, Mobile Responsive',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Custom implementation with full code ownership and zero monthly per-seat fees.',
  },
  creator: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.domain,
  },
};

export default function CrmPage() {
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <ProductDetailPage
        product={product}
        faqs={CRM_FAQS}
        comparison={CRM_COMPARISON}
        crossLink={{
          badge: "Bespoke Engineering Services",
          title: "Looking for Custom Enterprise CRM Development?",
          description: "If your business requires custom database architecture, multi-department enterprise workflows, legacy CRM migration (Zoho, Salesforce to custom), or proprietary ERP integrations from scratch, explore our custom engineering services.",
          href: "/services/crm-development",
          cta: "View Custom CRM Development Services",
        }}
      />
    </>
  );
}
