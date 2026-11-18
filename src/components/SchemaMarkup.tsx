'use client';

import { safeJsonLd } from "@/lib/jsonLd";
import { SITE } from "@/data/site";
export { safeJsonLd };

interface SchemaProps {
  type: 'organization' | 'localBusiness' | 'service' | 'breadcrumb' | 'faq' | 'website';
  data?: any;
}

export default function SchemaMarkup({ type, data }: SchemaProps) {
  const schemas: Record<string, object> = {
    organization: {
      "@context": "https://schema.org",
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://www.silverwolftechnologies.in/#organization",
      "name": "Silver Wolf Technologies",
      "alternateName": "Silver Wolf Tech",
      "url": "https://www.silverwolftechnologies.in",
      "logo": "https://www.silverwolftechnologies.in/favicon.png",
      "image": "https://www.silverwolftechnologies.in/og-image.jpg",
      "description": "Full-service digital engineering agency building enterprise web platforms, custom CRMs, mobile applications, and technical SEO campaigns across India and worldwide.",
      "foundingDate": "2015",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Murbad",
        "addressLocality": "Murbad",
        "addressRegion": "Maharashtra",
        "postalCode": "421401",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.2333,
        "longitude": 73.3833
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": SITE.phoneRaw,
        "contactType": "customer service",
        "areaServed": ["IN", "GB", "AE", "US", "CA", "AU", "SG"],
        "availableLanguage": ["English", "Hindi", "Marathi"]
      },
      "sameAs": [
        "https://www.linkedin.com/company/silver-wolf-technologies",
        "https://www.instagram.com/silverwolftechnologies"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Digital Agency Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-commerce Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CRM Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SaaS & Web Apps" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Services" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Digital Marketing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social Media Marketing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Graphic Design" } }
        ]
      }
    },
    localBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://www.silverwolftechnologies.in/#localbusiness",
      "name": "Silver Wolf Technologies",
      "parentOrganization": { "@id": "https://www.silverwolftechnologies.in/#organization" },
      "image": "https://www.silverwolftechnologies.in/og-image.jpg",
      "url": "https://www.silverwolftechnologies.in",
      "telephone": SITE.phoneRaw,
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Murbad",
        "addressLocality": "Murbad",
        "addressRegion": "Maharashtra",
        "postalCode": "421401",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.2333,
        "longitude": 73.3833
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, UPI, Bank Transfer"
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://www.silverwolftechnologies.in/#website",
      "name": "Silver Wolf Technologies",
      "url": "https://www.silverwolftechnologies.in",
      "publisher": { "@id": "https://www.silverwolftechnologies.in/#organization" }
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data?.items || []
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data?.faqs || []
    },
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": data?.serviceType || "Web Development",
      "provider": {
        "@type": "Organization",
        "@id": "https://www.silverwolftechnologies.in/#organization",
        "name": "Silver Wolf Technologies",
        "url": "https://www.silverwolftechnologies.in"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "description": data?.description || "",
      "name": data?.name || ""
    }
  };

  const selectedSchema = schemas[type];
  if (!selectedSchema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(selectedSchema) }}
    />
  );
}
