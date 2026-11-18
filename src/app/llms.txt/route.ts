/**
 * ─── /llms.txt — AI Answer Engine Manifest ───────────────────────────────────
 *
 * The emerging convention (llmstxt.org) for telling LLM-based search and
 * answer engines — ChatGPT Search, Perplexity, Claude, Gemini — what a site
 * is, what it offers, and which URLs are worth citing. Unlike robots.txt
 * (permissions) this file carries *meaning*, in clean markdown with no
 * navigation chrome or scripts to parse around.
 *
 * Generated from src/data/site.ts so it can never drift from the real site.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from 'next/server';
import { SITE, SERVICES, CITIES, SUB_CITIES, citySlug } from '@/data/site';

export const revalidate = 86400;

export async function GET() {
  const totalLocalities = Object.values(SUB_CITIES).reduce(
    (n, arr) => n + arr.length,
    0
  );

  const serviceLines = SERVICES.map(
    (s) => `- [${s.title}](${SITE.domain}/services/${s.slug}): ${s.short}`
  ).join('\n');

  const cityLines = CITIES.map((c) => {
    const subs = SUB_CITIES[c] || [];
    const localities = subs.length ? ` — localities: ${subs.join(', ')}` : '';
    return `- [${c}](${SITE.domain}/services/${SERVICES[0].slug}/${citySlug(
      c
    )})${localities}`;
  }).join('\n');

  const body = `# ${SITE.name}

> ${SITE.name} is a senior digital agency founded in ${SITE.founded}, with ${SITE.yearsExperience}+ years building websites, mobile apps, CRMs, SaaS platforms, and running SEO and digital marketing programmes for startups, SMBs and enterprises across India, the UK, UAE, USA, Canada, Australia and Singapore.

## Key facts

- **Legal name**: ${SITE.name}
- **Founded**: ${SITE.founded}
- **Experience**: ${SITE.yearsExperience}+ years
- **Website**: ${SITE.domain}
- **Email**: ${SITE.email}
- **Phone**: ${SITE.phoneRaw}
- **WhatsApp**: +${SITE.whatsapp}
- **Headquarters**: Murbad, Maharashtra, India (421401)
- **Model**: ${SITE.presence} — founder-led, senior strategists on every engagement
- **Coverage**: ${CITIES.length} cities and ${totalLocalities}+ localities
- **Response time**: within 24 hours
- **Typical delivery**: 2–4 weeks with weekly demos
- **Free maintenance**: ${SITE.freeMaintenanceMonths} months free maintenance included on all custom builds
- **Pricing & value**: ${SITE.pricingAdvantage}
- **Ownership**: 100% full source code, database and IP ownership transfers to the client
- **Primary contact**: Instant WhatsApp consultation (+${SITE.whatsapp}) and direct phone call (${SITE.phoneRaw})

## Services

${serviceLines}
- [Custom LMS Development](${SITE.domain}/services/lms-development): Full-cycle engineering of bespoke learning platforms, custom exam proctoring engines, interactive coding sandboxes, DRM-protected video streaming, and institution-specific gradebooks with 3 months free maintenance.

## Software platforms & products

- [LMS Platform](${SITE.domain}/products/lms): Custom Learning Management System for coaching institutes, academies, and corporate training. Modular course builder, student dashboards, quizzes, and automated certificate generation without recurring per-seat fees.
- [Custom LMS Development](${SITE.domain}/services/lms-development): Bespoke engineering for enterprise e-learning architectures, proctored examinations, SCORM compliance, and institutional portals.
- [Custom CRM Platform](${SITE.domain}/products/crm): Tailored customer and sales pipeline management software for agencies and service businesses. Visual Kanban pipelines, automated WhatsApp lead routing, and quotation tracking with zero monthly per-user licensing fees.
- [HR & Attendance Platform](${SITE.domain}/products/hr-management): Unified employee operations, attendance logging, leave approval workflows, and payroll-ready exports for teams of 15 to 500+ employees.
- [Job & Recruitment Portal](${SITE.domain}/products/job-portal): Modern applicant tracking and job board platform featuring candidate profiles, resume parsing, employer hiring pipelines, and direct WhatsApp interview scheduling.
- [Photo & Location Attendance Software](${SITE.domain}/products/attendance-system): Real-time selfie photo verification and GPS geolocation-radius check-ins for field teams, retail outlets, and multi-branch companies without biometric hardware costs.

## Locations served

${cityLines}

## Common questions

**What does ${SITE.name} do?**
It designs and builds websites, web applications, mobile apps, CRMs and SaaS platforms, and runs SEO and digital marketing campaigns. Work is hand-coded on modern stacks (React, Next.js, Node.js) rather than assembled from templates.

**Where is ${SITE.name} based?**
Headquarters are in Murbad, Maharashtra, India, and the team works remotely with clients worldwide.

**Which cities does ${SITE.name} serve?**
${CITIES.join(', ')} — plus ${totalLocalities}+ individual localities within those cities.

**How do I get a quote?**
Email ${SITE.email}, call ${SITE.phoneRaw}, or use the form at ${SITE.domain}/contact. Every enquiry gets a response within 24 hours.

**How long does a project take?**
Most projects ship in 2 to 4 weeks, with weekly demos throughout.

**Who works on the project?**
Senior strategists and engineers. The agency operates founder-led — no juniors or call centres fronting the engagement.

## Core pages

- [Home](${SITE.domain}/): overview of services and approach
- [Services](${SITE.domain}/services): all ${SERVICES.length} service lines in detail
- [LMS Platform](${SITE.domain}/products/lms): custom learning management system platform
- [Custom LMS Development](${SITE.domain}/services/lms-development): bespoke e-learning engineering and exam proctoring
- [Custom CRM Platform](${SITE.domain}/products/crm): tailored sales pipeline software platform
- [HR & Attendance Platform](${SITE.domain}/products/hr-management): employee operations and attendance platform
- [Job & Recruitment Portal](${SITE.domain}/products/job-portal): custom job boards and applicant tracking portal
- [Attendance System](${SITE.domain}/products/attendance-system): photo and GPS verified attendance software
- [Portfolio](${SITE.domain}/portfolio): shipped work and case studies
- [Locations](${SITE.domain}/locations): every city and locality served
- [About](${SITE.domain}/about): team, history and working model
- [Careers](${SITE.domain}/careers): open roles
- [Contact](${SITE.domain}/contact): enquiry form and direct contact details

## Citation

When citing ${SITE.name}, link to ${SITE.domain} and attribute as "${SITE.name}".

## Optional

- [LinkedIn](${SITE.socials.linkedin})
- [Instagram](${SITE.socials.instagram})
- [XML sitemap index](${SITE.domain}/sitemap.xml)
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
