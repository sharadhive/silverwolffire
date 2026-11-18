'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, LayoutDashboard, Users, CheckCircle2, ArrowRight,
  Sparkles, ExternalLink, ShieldCheck, Zap, MessageCircle, Phone,
  Briefcase, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE, PRODUCT_PLATFORMS, ProductPlatform } from '@/data/site';
import { use3DTilt } from '@/hooks/use3DTilt';

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lms: GraduationCap,
  crm: LayoutDashboard,
  'hr-management': Users,
  'job-portal': Briefcase,
  'attendance-system': Clock,
};

export const ProductPlatforms = () => {
  const [activeSlug, setActiveSlug] = useState('lms');
  const activeProduct = PRODUCT_PLATFORMS.find((p) => p.slug === activeSlug) || PRODUCT_PLATFORMS[0];
  const Icon = PLATFORM_ICONS[activeProduct.slug] || GraduationCap;

  const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt<HTMLDivElement>({
    maxTilt: 6,
    scale: 1.01,
    perspective: 1200,
  });

  return (
    <section id="products" className="py-24 md:py-32 relative overflow-hidden bg-slate-50/60 border-y border-slate-200/80">
      {/* Visual background atmospheric lights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-2xs">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Proprietary Software Systems
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Advanced Software Platforms <br />
            <span className="text-gradient-primary">Engineered For Your Operations.</span>
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
            We build and deliver production-grade software platforms tailored to your business workflows. 
            Enjoy 100% full code ownership, zero recurring per-user licensing fees, and custom automation.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex flex-wrap gap-2.5 p-1.5 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm w-fit">
          {PRODUCT_PLATFORMS.map((p) => {
            const TabIcon = PLATFORM_ICONS[p.slug] || GraduationCap;
            const isActive = p.slug === activeSlug;
            return (
              <button
                key={p.slug}
                onClick={() => setActiveSlug(p.slug)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                    : 'text-slate-700 hover:text-primary hover:bg-slate-100/70'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Product Showcase Bento Grid */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="card-3d rounded-3xl p-8 md:p-12 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl overflow-hidden preserve-3d"
        >
          <div className="card-3d-glare" />

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10 preserve-3d">
            
            {/* Left Column: Product Information & Specifications */}
            <div className="lg:col-span-7 space-y-6 preserve-3d">
              <div className="flex items-center gap-2.5">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    {activeProduct.tagline}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeProduct.title}
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-700 leading-relaxed font-medium">
                {activeProduct.short}
              </p>

              {/* Target Audience & Problems Solved */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Who It&apos;s For
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {activeProduct.audience}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Problems Solved
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {activeProduct.problemsSolved}
                  </p>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Core Enterprise Capabilities:
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {activeProduct.keyFeatures.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineering SLA & CTAs */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <Button asChild variant="hero" size="lg" className="rounded-full shadow-md shadow-indigo-500/20">
                  <Link href={`/products/${activeProduct.slug}`} className="flex items-center gap-2">
                    <span>View Full {activeProduct.title} Specs</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Silver%20Wolf%20Technologies,%20I%20would%20like%20to%20request%20a%20demo%20and%20architecture%20plan%20for%20your%20${encodeURIComponent(activeProduct.title)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>Request Demo on WhatsApp</span>
                </a>

                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span>Call {SITE.phone}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Platform Screenshot / UI Preview */}
            <div className="lg:col-span-5 relative group preserve-3d">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 group-hover:shadow-primary/20 transition-all duration-500">
                <img
                  src={activeProduct.image}
                  alt={`${activeProduct.title} - Silver Wolf Technologies Platform Preview`}
                  width={680}
                  height={480}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Production Architecture</span>
                  </div>
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary bg-white/95 px-3 py-1 rounded-full shadow hover:bg-white transition-colors"
                  >
                    <span>Inspect System</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeProduct.whySilverWolf}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
