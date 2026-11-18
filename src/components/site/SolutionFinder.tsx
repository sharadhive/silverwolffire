'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Layers,
  Code2,
  GraduationCap,
  Users2,
  Clock,
  Briefcase,
  Search,
  Palette,
  Globe,
} from 'lucide-react';
import { SITE } from '@/data/site';
import { trackWhatsAppClick } from '@/lib/whatsapp';

interface SolutionOption {
  id: string;
  category: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  bullets: string[];
  href: string;
  ctaText: string;
  whatsappBrief: string;
}

const SOLUTIONS: Record<string, { turnkey?: SolutionOption; bespoke?: SolutionOption }> = {
  lms: {
    turnkey: {
      id: 'turnkey-lms',
      category: 'Software Platform',
      title: 'Turnkey LMS Platform',
      badge: 'Zero Monthly Per-Student Fees',
      tagline: 'Ready-to-Deploy E-Learning & Coaching Portal',
      description: 'Deploy your own branded LMS in 1–2 weeks. Modular course builder, student video dashboard, quiz engine, Razorpay/Stripe billing, and automated PDF certificates.',
      bullets: [
        'Full source code & database ownership (Next.js / Node.js)',
        'Zero per-student or per-course monthly subscription fees',
        'Direct Indian UPI, NetBanking & international card checkout',
      ],
      href: '/products/lms',
      ctaText: 'Explore LMS Platform',
      whatsappBrief: 'Hi Silver Wolf Technologies, I am interested in your Turnkey LMS Platform. I would like to schedule a demo and see course workflows.',
    },
    bespoke: {
      id: 'custom-lms-dev',
      category: 'Custom Engineering',
      title: 'Custom LMS Development',
      badge: '3 Months Free Maintenance Included',
      tagline: 'Bespoke E-Learning Architectures & Exam Engines',
      description: 'Ground-up engineering for coaching chains, universities, and certification bodies requiring custom exam proctoring, DRM video protection, SCORM/xAPI compliance, and specialized grading logic.',
      bullets: [
        'Proprietary exam proctoring & timed testing algorithms',
        'Dynamic watermarked DRM video streaming against piracy',
        'Tailored institutional gradebooks & enterprise SSO integrations',
      ],
      href: '/services/lms-development',
      ctaText: 'View Custom LMS Development',
      whatsappBrief: 'Hi Silver Wolf Technologies, we need bespoke LMS development for our institution. Can we schedule an architecture review?',
    },
  },
  crm: {
    turnkey: {
      id: 'turnkey-crm',
      category: 'Software Platform',
      title: 'Custom CRM Platform',
      badge: 'Zero Monthly Per-Seat Fees',
      tagline: 'Visual Sales Pipelines & WhatsApp Lead Routing',
      description: 'A streamlined CRM platform for agencies and SMBs. Visual Kanban pipelines, automated WhatsApp lead ingestion, deal stage tracking, quotation generator, and agent activity logs.',
      bullets: [
        'Visual drag-and-drop deal pipeline management',
        'Instant WhatsApp lead redirect and sales notifications',
        'Zero recurring per-user monthly SaaS fees',
      ],
      href: '/products/crm',
      ctaText: 'Explore CRM Platform',
      whatsappBrief: 'Hi Silver Wolf Technologies, I would like to review a demo of your CRM Platform and discuss customization options.',
    },
    bespoke: {
      id: 'custom-crm-dev',
      category: 'Custom Engineering',
      title: 'Bespoke CRM Engineering',
      badge: '3 Months Free Maintenance Included',
      tagline: 'Enterprise Workflows, Multi-Branch Pipelines & ERP Sync',
      description: 'Tailored CRM development engineered around your exact company SOPs, multi-level quotation approval matrices, legacy ERP sync (SAP, Tally), and custom database architectures.',
      bullets: [
        'Custom database schema designed for your business logic',
        'Multi-tiered manager approval matrices & quotation PDFs',
        'Dedicated API bridges for Tally, SAP, and legacy software',
      ],
      href: '/services/crm-development',
      ctaText: 'View CRM Development Services',
      whatsappBrief: 'Hi Silver Wolf Technologies, we need tailored CRM engineering for our enterprise workflows. Let us discuss requirements.',
    },
  },
  attendance: {
    turnkey: {
      id: 'turnkey-attendance',
      category: 'Software Platform',
      title: 'Photo & Location Attendance Software',
      badge: 'Zero Biometric Hardware Overhead',
      tagline: 'Selfie Verification & GPS Geofenced Check-ins',
      description: 'Track distributed workforce check-ins in real time with selfie photo verification, GPS radius matching, multi-branch shift rosters, and instant payroll-ready CSV exports.',
      bullets: [
        'Real-time selfie photo capture with anti-spoofing checks',
        'GPS geolocation radius matching across operational branches',
        'Instant month-end payroll CSV & Excel export',
      ],
      href: '/products/attendance-system',
      ctaText: 'Explore Attendance Software',
      whatsappBrief: 'Hi Silver Wolf Technologies, we want to implement your Photo & Location Attendance Software for our team. Please share demo details.',
    },
    bespoke: {
      id: 'bespoke-hr-ops',
      category: 'Custom Engineering',
      title: 'HR & Operations Management Platform',
      badge: 'Unified Employee Operations',
      tagline: 'Leave Approval Workflows, Policy Portals & Attendance',
      description: 'A complete workforce operations system combining employee directories, leave requests with tiered approvals, policy documentation, and automated payroll calculations.',
      bullets: [
        'Tiered manager leave approvals & holiday calendar sync',
        'Custom salary component calculators & compliance reports',
        'Works seamlessly on any smartphone browser with zero app store install friction',
      ],
      href: '/products/hr-management',
      ctaText: 'Explore HR Management Platform',
      whatsappBrief: 'Hi Silver Wolf Technologies, I would like to explore your HR Management Platform for our organization.',
    },
  },
  web: {
    bespoke: {
      id: 'custom-web-dev',
      category: 'Custom Engineering',
      title: 'Custom Website & Web Application Development',
      badge: '3 Months Free Maintenance Included',
      tagline: 'High-Performance Next.js Engineering Built for Scale',
      description: 'Hand-crafted, responsive websites and full-stack web applications engineered with Next.js, React, Node.js, and Tailwind CSS. Built to pass Core Web Vitals with 90+ Lighthouse performance scores.',
      bullets: [
        'Sub-2-second load times on real 4G mobile devices',
        'Structured schema.org JSON-LD markup baked in from day one',
        '100% full source code and intellectual property ownership',
      ],
      href: '/services/website-development',
      ctaText: 'Explore Website Development',
      whatsappBrief: 'Hi Silver Wolf Technologies, I need a proposal and quote for a custom high-performance website build.',
    },
  },
  jobs: {
    turnkey: {
      id: 'turnkey-job-portal',
      category: 'Software Platform',
      title: 'Job & Recruitment Portal Software',
      badge: 'Zero Per-Listing SaaS Charges',
      tagline: 'Talent Acquisition & Job Board Platforms',
      description: 'High-performance recruitment portal with candidate profiles, resume file ingestion, employer hiring pipelines, visual Kanban applicant review, and automated alert triggers.',
      bullets: [
        'Candidate profile builder & resume parsing intake',
        'Employer job posting & credit subscription workflows',
        'Visual Kanban hiring pipeline & WhatsApp candidate alerts',
      ],
      href: '/products/job-portal',
      ctaText: 'Explore Job Portal Software',
      whatsappBrief: 'Hi Silver Wolf Technologies, I want to launch a custom Job & Recruitment Portal. Can we discuss features and rollout?',
    },
  },
  growth: {
    bespoke: {
      id: 'custom-seo-marketing',
      category: 'Search & Growth',
      title: 'Technical SEO & Digital Growth Programs',
      badge: 'Measurable Search & AI Visibility',
      tagline: 'Technical Optimization for Google, Perplexity & ChatGPT',
      description: 'Evidence-led search engine optimization, AI Answer Engine discovery (AEO/GEO), and high-intent PPC campaigns designed to turn qualified buyer searches into profitable inquiries.',
      bullets: [
        'Comprehensive technical SEO architecture & structured data schemas',
        'AI engine citation optimization across ChatGPT, Perplexity & Gemini',
        'Conversion-rate optimized landing pages & transparent ROI reporting',
      ],
      href: '/services/seo-services',
      ctaText: 'Explore SEO & Growth Services',
      whatsappBrief: 'Hi Silver Wolf Technologies, we want to improve our search rankings and AI visibility. Let us schedule an SEO consultation.',
    },
  },
};

export const SolutionFinder: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string>('lms');
  const [deliveryModel, setDeliveryModel] = useState<'turnkey' | 'bespoke'>('turnkey');

  const goalOptions = [
    { id: 'lms', label: 'E-Learning & Course Portal (LMS)', icon: GraduationCap },
    { id: 'crm', label: 'Sales CRM & Lead Pipeline', icon: Users2 },
    { id: 'attendance', label: 'Staff Attendance & HR Ops', icon: Clock },
    { id: 'web', label: 'Custom Website or Web App', icon: Globe },
    { id: 'jobs', label: 'Recruitment & Job Board Portal', icon: Briefcase },
    { id: 'growth', label: 'Google Rankings & SEO Growth', icon: Search },
  ];

  // Resolve matching solution (fallback to bespoke if turnkey not available for web/growth)
  const currentSolutions = SOLUTIONS[selectedGoal] || SOLUTIONS.lms;
  const recommendedSolution: SolutionOption =
    deliveryModel === 'turnkey' && currentSolutions.turnkey
      ? currentSolutions.turnkey
      : currentSolutions.bespoke || currentSolutions.turnkey!;

  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    recommendedSolution.whatsappBrief
  )}`;

  return (
    <section className="py-20 relative overflow-hidden bg-slate-50/80 border-y border-slate-200/80">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Solution Guide</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Find the <span className="text-gradient-primary">Right Solution</span> for Your Business
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Select your primary business objective and preferred delivery model to see the ideal solution, clear deliverables, and commercial terms.
          </p>
        </div>

        {/* Step 1: Goal Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 text-center">
            Step 1: What is your primary objective?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {goalOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = selectedGoal === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedGoal(opt.id)}
                  className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-white border-primary text-primary shadow-md shadow-primary/10 ring-2 ring-primary/20'
                      : 'bg-white/70 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold leading-snug">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Delivery Preference */}
        <div className="max-w-xl mx-auto mb-10">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 text-center">
            Step 2: Choose your delivery preference
          </label>
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-300/60">
            <button
              type="button"
              onClick={() => setDeliveryModel('turnkey')}
              disabled={!currentSolutions.turnkey}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                deliveryModel === 'turnkey' && currentSolutions.turnkey
                  ? 'bg-white text-primary shadow-sm'
                  : currentSolutions.turnkey
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Turnkey Platform</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryModel('bespoke')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                deliveryModel === 'bespoke' || !currentSolutions.turnkey
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Bespoke Custom Build</span>
            </button>
          </div>
        </div>

        {/* Recommended Solution Output Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">
                {recommendedSolution.category}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {recommendedSolution.badge}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {recommendedSolution.title}
            </h3>
            <p className="text-sm font-semibold text-primary mb-3">
              {recommendedSolution.tagline}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {recommendedSolution.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                Key Architectural Deliverables:
              </h4>
              <ul className="space-y-2">
                {recommendedSolution.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <Button asChild variant="hero" size="lg" className="w-full sm:w-auto shadow-md">
                <Link href={recommendedSolution.href} className="flex items-center justify-center gap-2">
                  <span>{recommendedSolution.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      ctaLocation: 'solution_finder_whatsapp',
                      path: recommendedSolution.href,
                    })
                  }
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>Discuss on WhatsApp</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
