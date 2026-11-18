import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCT_PLATFORMS, SITE } from '@/data/site';
import { ProductDetailPage } from '@/components/products/ProductDetailPage';
import { safeJsonLd } from '@/lib/jsonLd';

const product = PRODUCT_PLATFORMS.find((p) => p.slug === 'lms')!;

export const metadata: Metadata = {
  title: 'Custom LMS Platform | Learning Management System in India | Silver Wolf Technologies',
  description:
    'Custom Learning Management System (LMS) for educational institutes, coaching centers, and corporate training. Student portals, quizzes, certificates, and live classes without per-student SaaS fees.',
  alternates: {
    canonical: `${SITE.domain}/products/lms`,
  },
  openGraph: {
    title: 'Custom LMS Platform | Silver Wolf Technologies',
    description:
      'Scalable Learning Management System engineered with Next.js, Node.js, and video streaming. Full code ownership and zero monthly per-student charges.',
    url: `${SITE.domain}/products/lms`,
    images: [{ url: '/portfolio-lms.png', width: 1200, height: 630, alt: 'LMS Platform Architecture' }],
  },
};

const LMS_FAQS = [
  {
    question: 'How does this LMS compare to rental platforms like Teachable or Moodle?',
    answer:
      'Unlike rental SaaS tools that charge heavy monthly subscription fees or transaction percentages on every student enrollment, our LMS is 100% custom-built for you. You own the complete source code, host on your cloud (AWS/Vercel), and pay zero per-student fees.',
  },
  {
    question: 'Can we integrate Indian payment gateways like Razorpay, Cashfree, and UPI?',
    answer:
      'Yes. We natively integrate Razorpay, Cashfree, PhonePe, Paytm, and Stripe for seamless UPI auto-pay, credit cards, debit cards, and net banking with instant automated student enrollment upon payment.',
  },
  {
    question: 'How are video lessons protected against piracy and screen recording?',
    answer:
      'We implement encrypted HTTP Live Streaming (HLS), dynamic watermarking displaying the student’s phone number/email on screen, and DRM restrictions to deter unauthorized recording and piracy.',
  },
  {
    question: 'Can the LMS handle live classes via Zoom or Google Meet?',
    answer:
      'Yes. The platform supports automated live session scheduling with Zoom, Google Meet, and Jitsi APIs, including automated attendance logging and recording uploads directly into the student curriculum.',
  },
];

const LMS_COMPARISON = [
  {
    feature: 'Monthly License Fees',
    silverWolf: 'Zero recurring per-user fees (100% owned)',
    genericSaaS: '₹5,000–₹50,000+ per month based on active students',
  },
  {
    feature: 'Source Code Ownership',
    silverWolf: 'Full ownership of Next.js & Node.js codebase',
    genericSaaS: 'Rented platform; zero code ownership',
  },
  {
    feature: 'Custom Payment Gateways',
    silverWolf: 'Direct Indian UPI, NetBanking, Razorpay, Stripe',
    genericSaaS: 'Restricted gateways with 2%–10% platform cuts',
  },
  {
    feature: 'Video Piracy Protection',
    silverWolf: 'Encrypted HLS streaming with dynamic student watermarking',
    genericSaaS: 'Basic embedded video players with easy download leaks',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Silver Wolf Custom LMS Platform',
  operatingSystem: 'Web, iOS, Android',
  applicationCategory: 'EducationalApplication',
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

export default function LmsPage() {
  if (!product) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <ProductDetailPage
        product={product}
        faqs={LMS_FAQS}
        comparison={LMS_COMPARISON}
        crossLink={{
          badge: "Custom SaaS & Web Engineering",
          title: "Need Custom EdTech Engineering or Scalable SaaS Architecture?",
          description: "Beyond standalone LMS deployments, our engineering team builds custom student information portals, high-concurrency exam engines, and multi-tenant ed-tech platforms on Next.js and React.",
          href: "/services/saas-development",
          cta: "Explore SaaS & Web App Development",
        }}
      />
    </>
  );
}
