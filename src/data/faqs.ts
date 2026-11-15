/**
 * ─── Centralized FAQ Data Source ─────────────────────────────────────────────
 *
 * Single source of truth for sitewide and homepage FAQs.
 * Eliminates copy drift between the visible FAQ component (<FAQ />)
 * and structured data / AEO answer layers.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "How much does a website cost in India?",
    answer:
      "Business websites range from ₹15,000 to ₹2,00,000+ depending on features, integrations, and design complexity. Marketing websites typically ship between ₹15,000 and ₹75,000, while complex custom web applications and CRMs range from ₹1,00,000 to ₹5,00,000+. We provide transparent custom quotes after a free consultation.",
    category: "Pricing",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes — we actively serve clients across the USA, UK, Canada, UAE, and Australia through a remote offshore delivery model from India, with timezone-flexible communication, overlapping work hours, and weekly sprint demos.",
    category: "Global Delivery",
  },
  {
    question: "How long does a project take?",
    answer:
      "Most marketing websites launch in 2–4 weeks. Custom web applications, mobile apps, and CRMs typically take 6–12 weeks depending on scope. We share a fixed timeline and milestone roadmap before kickoff.",
    category: "Delivery Timeline",
  },
  {
    question: "Do you offer SEO and marketing as a retainer?",
    answer:
      "Yes — our technical SEO and performance marketing services run as monthly retainers starting from ₹25,000/month, featuring transparent Looker Studio reporting dashboards and dedicated senior strategist oversight.",
    category: "SEO & Growth",
  },
  {
    question: "Will I own the code and assets?",
    answer:
      "100%. All source code, Figma design files, and digital marketing assets transfer to you upon project milestone completion. We provide full repository access with zero vendor lock-in.",
    category: "Code & IP Ownership",
  },
  {
    question: "Which cities in India do you serve?",
    answer:
      "We work with businesses across Mumbai, Pune, Delhi NCR, Bangalore, Hyderabad, Chennai, Ahmedabad, Kolkata, and nationwide through our remote-first senior engineering team based in Maharashtra.",
    category: "Coverage",
  },
];
