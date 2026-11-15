import { Hero } from "@/components/site/Hero";
import { ProductPlatforms } from "@/components/site/ProductPlatforms";
import { Services } from "@/components/site/Services";
import { WhyUs } from "@/components/site/WhyUs";
import { Portfolio } from "@/components/site/Portfolio";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { HOMEPAGE_FAQS } from "@/data/faqs";
import { safeJsonLd } from "@/lib/jsonLd";
import type { Metadata } from "next";

// Declared in full and applied with `title.absolute` below.
// Intent-anchored to primary capabilities for Indian and global decision-makers.
const HOME_TITLE = 'Web Development, LMS, Custom CRM & SEO Services in India | Silver Wolf Technologies';
const HOME_DESCRIPTION = 'Silver Wolf Technologies engineers high-performance websites, custom LMS platforms, tailored CRM systems, and technical SEO campaigns for businesses in India and worldwide.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.silverwolftechnologies.in/',
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: 'https://www.silverwolftechnologies.in/',
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Silver Wolf Technologies" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

/**
 * Homepage FAQ schema built directly from HOMEPAGE_FAQS.
 * Provides clean semantic context for modern AI answer engines (AEO/GEO).
 */
const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.silverwolftechnologies.in/#faq",
  "mainEntity": HOMEPAGE_FAQS.map((f) => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": { "@type": "Answer", "text": f.answer },
  })),
};

export default function Home() {
  return (
    <>
      {/*
        RootLayout already emits unified Organization, LocalBusiness, and WebSite schemas.
        Emitting only page-specific FAQ schema here eliminates duplicate @id entity conflicts.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homepageFaqSchema) }}
      />
      <Hero />
      <ProductPlatforms />
      <Services />
      <WhyUs />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
