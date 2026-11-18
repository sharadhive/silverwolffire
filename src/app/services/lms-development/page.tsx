import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/data/site';
import Breadcrumb from '@/components/Breadcrumb';
import { Contact } from '@/components/site/Contact';
import { safeJsonLd } from '@/lib/jsonLd';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Zap,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Video,
  Award,
  CreditCard,
  Users,
  Server,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Custom LMS Development Services India | Silver Wolf Technologies',
  description:
    'Custom LMS development for educational institutes, coaching centers, and corporate L&D teams in India. Tailored course engines, video streaming, and assessments with 3 months free maintenance.',
  alternates: {
    canonical: `${SITE.domain}/services/lms-development`,
  },
  openGraph: {
    title: 'Custom LMS Development Services | Silver Wolf Technologies',
    description:
      'Architecting custom learning management systems with DRM video protection, live lectures, student dashboards, and zero per-student monthly SaaS fees.',
    url: `${SITE.domain}/services/lms-development`,
    images: [{ url: '/portfolio-lms.png', width: 1200, height: 630, alt: 'Custom LMS Architecture' }],
  },
};

const LMS_DEV_CAPABILITIES = [
  {
    icon: Video,
    title: 'DRM Video Streaming & Watermarking',
    desc: 'Encrypted HLS video streaming with dynamic student email and phone number watermarking on screen to prevent piracy and unauthorized recording.',
  },
  {
    icon: Award,
    title: 'Timed Quizzes & Exam Proctoring',
    desc: 'Custom assessment engines supporting timed quizzes, negative marking, randomized question pools, automated scoring, and digital certificate generation.',
  },
  {
    icon: Users,
    title: 'Instructor, Batch & Student Portals',
    desc: 'Multi-role access hierarchies for super admins, branch managers, instructors, and learners with dedicated dashboards, timetable views, and submission queues.',
  },
  {
    icon: CreditCard,
    title: 'Indian UPI & Global Payment Gateways',
    desc: 'Native Razorpay, Cashfree, PhonePe, and Stripe integrations for automated instant student enrollment via UPI, QR, NetBanking, and credit/debit cards.',
  },
  {
    icon: Server,
    title: '100% Code & Database Ownership',
    desc: 'Hosted in your private cloud account (AWS, DigitalOcean, Vercel) on modern Next.js, Node.js, and PostgreSQL architectures with zero recurring per-student software fees.',
  },
  {
    icon: FileCheck,
    title: '3 Months Free Post-Launch Maintenance',
    desc: 'Every custom LMS implementation includes 3 months of comprehensive post-deployment technical support, bug triage, performance tuning, and SLA-backed monitoring.',
  },
];

const LMS_FAQS = [
  {
    q: 'How does custom LMS development differ from off-the-shelf LMS platforms?',
    a: 'Off-the-shelf rental platforms (Teachable, Thinkific, Kajabi) charge recurring monthly subscription fees and transaction cuts per student, while locking your curriculum and learner data into proprietary silos. Custom LMS development delivers a proprietary platform engineered around your specific pedagogy, workflow, and payment gateway with 100% source code ownership and zero monthly per-student licensing.',
  },
  {
    q: 'Can our existing student and course data be migrated to the new custom LMS?',
    a: 'Yes. Our senior engineering team conducts safe database migrations from legacy databases, Moodle, WordPress LMS plugins (LearnDash, Tutor LMS), or raw Excel student rosters into a modern, scalable PostgreSQL/MongoDB database.',
  },
  {
    q: 'How long does a custom LMS development project typically take?',
    a: 'Typical custom LMS implementations range between 4 to 8 weeks depending on custom feature requirements, third-party integrations (Zoom, Razorpay, ERP), and whether the deployment is built upon our battle-tested LMS platform foundation or engineered completely bespoke from scratch.',
  },
  {
    q: 'What is included in the 3 months of free post-launch maintenance?',
    a: 'We provide comprehensive technical stabilization: bug triage, server performance monitoring, security patches, minor layout refinements, and dedicated technical assistance to ensure smooth institutional adoption. Specific inclusions and SLA timelines are confirmed in your proposal.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom LMS Development Services',
  serviceType: 'Educational Software Development',
  url: `${SITE.domain}/services/lms-development`,
  description:
    'Custom LMS development for educational institutes, coaching academies, and corporate training in India. Video protection, assessments, student portals, and zero monthly licensing fees.',
  provider: {
    '@type': 'Organization',
    '@id': `${SITE.domain}/#organization`,
    name: SITE.name,
    url: SITE.domain,
  },
  areaServed: [
    'India',
    'United Kingdom',
    'United Arab Emirates',
    'United States',
    'Canada',
    'Australia',
    'Singapore',
  ].map((name) => ({ '@type': 'Country', name })),
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    description: 'Custom LMS software development quoted per institutional scope with 3 months free maintenance and zero recurring per-student fees.',
    availability: 'https://schema.org/InStock',
  },
};

export default function LmsDevelopmentServicePage() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hello Silver Wolf Technologies, I would like to discuss custom LMS development for my educational institute / training business.'
  )}`;

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'LMS Development', href: '/services/lms-development' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="pt-32 pb-20">
        <div className="container space-y-16">
          <Breadcrumb items={breadcrumbs} />

          {/* Hero Section */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Bespoke EdTech & E-Learning Engineering</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Custom LMS Development Services in India
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                Architecting proprietary learning management systems, high-concurrency exam portals, interactive student dashboards, and DRM-protected video streaming engines for institutes, coaching chains, and enterprise L&amp;D.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>Discuss LMS Scope on WhatsApp</span>
                </a>

                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm active:scale-95 transition-all"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>Call {SITE.phone}</span>
                </a>

                <Button asChild variant="outline" size="lg" className="rounded-full border-slate-300">
                  <Link href="/products/lms">View LMS Platform</Link>
                </Button>
              </div>

              {/* Value Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>3 Months Free Support</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Zap className="h-4 w-4 text-primary shrink-0" />
                  <span>100% Code Ownership</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Server className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>Zero Per-Student Fees</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950">
                <img
                  src="/portfolio-lms.png"
                  alt="Custom LMS Platform Architecture Screenshot"
                  width={800}
                  height={550}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-50" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                  <span className="bg-primary/90 px-3 py-1 rounded-full">Next.js + Node.js Engine</span>
                  <span className="text-slate-300 font-normal">HLS DRM + UPI Integrated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Guide: Platform Foundation vs Bespoke Development */}
          <div className="glass rounded-3xl p-8 sm:p-10 border border-slate-200/90 bg-gradient-to-br from-slate-50/80 via-white to-indigo-50/30 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Strategic Guidance</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Turnkey LMS Platform vs. Bespoke LMS Development
              </h2>
              <p className="text-slate-600 text-sm">
                We provide both proven ready-to-deploy platforms and ground-up bespoke engineering to match your exact institutional timeline and operational scope.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              {/* Option A: Ready Platform */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    <span>Fast Turnaround · Ready Foundation</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Silver Wolf LMS Platform</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Deploy our field-proven LMS codebase within 5 to 7 days. Configured with your brand identity, course hierarchy, Razorpay/UPI gateway, and student dashboards without reinventing the wheel.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Best for academies, coaching centers, and course creators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Ready live-class, quiz &amp; digital certificate engines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Lowest deployment cost with zero monthly subscriptions</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/products/lms" className="flex items-center justify-center gap-1.5">
                      <span>Explore Turnkey LMS Platform</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Option B: Custom Engineering */}
              <div className="p-6 rounded-2xl bg-white border-2 border-primary/30 shadow-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <span>100% Tailored · Deep Integration</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Bespoke Custom LMS Development</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Engineered from architectural wireframes to match unique institutional evaluation rules, multi-campus university hierarchies, legacy ERP database connectors, or custom offline-sync mobile video players.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Best for multi-branch institutes, universities &amp; enterprise L&amp;D</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Custom exam proctoring algorithms and evaluation workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Tailored SIS/ERP sync and custom reporting pipelines</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Request Custom Architecture Quote</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Technical Depth</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Architectural Capabilities Included in Custom LMS Builds
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LMS_DEV_CAPABILITIES.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-primary/40 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{cap.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Process */}
          <div className="glass rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Structured Execution</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Our 6-Step LMS Engineering Delivery Model
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-900">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-primary">STAGE 01</span>
                <h4 className="font-bold text-sm">Curriculum &amp; Role Scoping</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Map student journey, instructor workflows, batch hierarchy, and institutional assessment criteria.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-primary">STAGE 02</span>
                <h4 className="font-bold text-sm">Interactive UI/UX Wireframing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Design distraction-free learner portals, fast course navigation, and intuitive instructor grading queues.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-primary">STAGE 03</span>
                <h4 className="font-bold text-sm">Engine Architecture &amp; Database</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Engineer scalable Next.js App Router frontends with Node.js/PostgreSQL databases optimized for fast queries.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-primary">STAGE 04</span>
                <h4 className="font-bold text-sm">Video, DRM &amp; Payment Sync</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Connect encrypted HLS streaming pipelines, dynamic video watermarks, and Razorpay/Stripe auto-enrollment.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-primary">STAGE 05</span>
                <h4 className="font-bold text-sm">Concurrency &amp; Security Audits</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Load test live exams under high concurrent student traffic and audit role-based authorization barriers.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-primary">STAGE 06</span>
                <h4 className="font-bold text-sm">Launch + 3 Months Free Maintenance</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Deploy to your cloud account with complete source code handover and 90 days of dedicated technical support.</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Institutional Answers</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions About LMS Development
              </h2>
            </div>

            <div className="space-y-3">
              {LMS_FAQS.map((faq, i) => (
                <details key={i} className="group p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs open:shadow-md transition-all">
                  <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between text-sm sm:text-base list-none">
                    <span>{faq.q}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Bottom Contact Form */}
          <Contact presetService="Custom LMS Development" />
        </div>
      </div>
    </>
  );
}
