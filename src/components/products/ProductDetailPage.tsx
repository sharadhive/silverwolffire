'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Phone, MessageCircle,
  Sparkles, Layers, ChevronRight, HelpCircle, Laptop, Clock, Server,
  MonitorCheck, Sliders, Database, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE, ProductPlatform } from '@/data/site';
import { Contact } from '@/components/site/Contact';
import { trackWhatsAppClick, trackPhoneClick } from '@/lib/whatsapp';

interface ProductDetailProps {
  product: ProductPlatform;
  faqs: { question: string; answer: string }[];
  comparison: {
    feature: string;
    silverWolf: string;
    genericSaaS: string;
  }[];
  crossLink?: {
    badge: string;
    title: string;
    description: string;
    href: string;
    cta: string;
  };
}

export function ProductDetailPage({ product, faqs, comparison, crossLink }: ProductDetailProps) {
  const [activeWalkthroughTab, setActiveWalkthroughTab] = useState<'user' | 'admin' | 'architecture'>('user');

  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hello Silver Wolf Technologies, I would like to discuss implementing your ${product.title}.`
  )}`;

  return (
    <div className="pt-28 pb-20">
      <div className="container space-y-20">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/#products" className="hover:text-primary transition-colors">Platforms</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-bold">{product.title}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{product.tagline} · Proprietary Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              {product.headline}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              {product.short}
            </p>

            {/* Direct Contact Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                onClick={() => trackWhatsAppClick({ ctaLocation: "product_hero_whatsapp", service: product.title })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                <span>Request Demo on WhatsApp</span>
              </a>

              <a
                href={`tel:${SITE.phoneRaw}`}
                onClick={() => trackPhoneClick({ ctaLocation: "product_hero_call" })}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm active:scale-95 transition-all"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Call {SITE.phone}</span>
              </a>

              <Button asChild variant="outline" size="lg" className="rounded-full border-slate-300">
                <Link href="#specifications">View Specifications</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>100% IP Ownership</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Zap className="h-4 w-4 text-primary" />
                <span>Zero Per-Seat Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Server className="h-4 w-4 text-indigo-500" />
                <span>Cloud & On-Prem Ready</span>
              </div>
            </div>
          </div>

          {/* Product Visual Screenshot */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950 group-hover:shadow-primary/20 transition-all duration-500">
              <img
                src={product.image}
                alt={`${product.title} Platform Architecture Screenshot`}
                width={800}
                height={550}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-40" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                <span className="bg-primary/90 px-3 py-1 rounded-full">{product.category} Production Build</span>
                <span className="text-slate-300 font-normal">Next.js + Node.js Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audience & Problem-Solution Breakdown */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Target Audience
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Designed Specifically For:</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.audience}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Operational Impact
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Challenges Solved:</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {product.problemsSolved}
            </p>
          </div>
        </div>

        {/* Feature Specifications Checklist */}
        <div id="specifications" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Engineered Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Platform Features & Architecture
            </h2>
            <p className="text-slate-600 text-sm">
              Every deployment includes modern UI/UX, responsive mobile views, admin controls, and modular APIs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.keyFeatures.map((feature, i) => (
              <div key={feature} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-primary/40 transition-colors">
                <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {i + 1}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{feature}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Illustrative Walkthrough & Architecture Tour */}
        <div className="space-y-8 bg-slate-50/80 rounded-3xl p-6 md:p-10 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center justify-center gap-2">
              <Eye className="h-3.5 w-3.5" />
              <span>Interactive Demonstration & UI Architecture</span>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore the Platform in Action
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Illustrative walkthrough of primary workflows, managerial controls, and deployment architecture.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto p-1 bg-slate-200/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveWalkthroughTab('user')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeWalkthroughTab === 'user' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MonitorCheck className="h-3.5 w-3.5" />
              <span>User Experience</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWalkthroughTab('admin')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeWalkthroughTab === 'admin' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Admin Operations</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWalkthroughTab('architecture')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeWalkthroughTab === 'architecture' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Architecture & Data</span>
            </button>
          </div>

          {/* Active Tab Content Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                {activeWalkthroughTab === 'user' && 'Step 1: End-User & Client Experience'}
                {activeWalkthroughTab === 'admin' && 'Step 2: Operational Governance & Manager Portal'}
                {activeWalkthroughTab === 'architecture' && 'Step 3: Edge Cloud & Data Sovereignty'}
              </span>

              <h3 className="text-xl font-bold text-slate-900">
                {activeWalkthroughTab === 'user' && `Frictionless, Mobile-First ${product.title} Interface`}
                {activeWalkthroughTab === 'admin' && 'Real-Time Governance, Audit Logs & Instant Exports'}
                {activeWalkthroughTab === 'architecture' && 'Enterprise Node.js Backend with Self-Hosted Data Sovereignty'}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {activeWalkthroughTab === 'user' &&
                  `Users access a streamlined, lightweight interface optimized for sub-second responses on smartphone browsers and desktops. Designed with zero cognitive overload, ensuring high adoption rates without requiring end-user training.`}
                {activeWalkthroughTab === 'admin' &&
                  `Managers and leadership enjoy complete visibility with visual status boards, granular role-based permissions (RBAC), automated alerts, and instant 1-click exports to CSV, Excel, or internal reporting formats.`}
                {activeWalkthroughTab === 'architecture' &&
                  `Engineered with Next.js App Router and Node.js with complete database isolation. Deploy on your preferred AWS, GCP, or Vercel infrastructure. Zero vendor lock-in, zero third-party telemetry.`}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Performance Budget</span>
                  <span className="text-xs font-bold text-slate-800">Sub-2s Mobile Page Load</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Codebase Ownership</span>
                  <span className="text-xs font-bold text-slate-800">100% Full IP Transfer</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 group">
                <img
                  src={product.image}
                  alt={`${product.title} Illustrative UI Workflow`}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5 bg-slate-900 text-[10px] font-medium text-slate-300 text-center">
                  Illustrative Platform Workflow & UI Architecture
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison: Silver Wolf Custom Platform vs Generic SaaS */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Strategic Advantage</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Silver Wolf Platform vs. Generic Rental SaaS
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-extrabold">
                    <th className="p-4 sm:p-5">Capability / Factor</th>
                    <th className="p-4 sm:p-5 text-primary bg-primary/5">Silver Wolf Custom Platform</th>
                    <th className="p-4 sm:p-5 text-slate-500">Off-The-Shelf SaaS (Monthly Rental)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparison.map((c) => (
                    <tr key={c.feature} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">{c.feature}</td>
                      <td className="p-4 sm:p-5 font-semibold text-emerald-800 bg-primary/5 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{c.silverWolf}</span>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">{c.genericSaaS}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Product FAQs */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Frequently Asked Questions</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="group p-5 rounded-2xl bg-white border border-slate-200 shadow-xs open:shadow-md transition-all">
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between text-sm sm:text-base list-none">
                  <span>{f.question}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Contextual Service / Cross-Link Callout */}
        {crossLink && (
          <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-wide">
              <span>{crossLink.badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {crossLink.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {crossLink.description}
            </p>
            <div className="pt-2">
              <Button asChild variant="hero" size="lg">
                <Link href={crossLink.href} className="inline-flex items-center gap-2 font-bold">
                  <span>{crossLink.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Embedded Contact Consultation */}
        <Contact compact presetService={product.title} />

      </div>
    </div>
  );
}
