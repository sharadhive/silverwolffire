'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight, Sparkles, Send, ShieldCheck, Zap, Code2, Smartphone,
  Cpu, Cloud, TrendingUp, Palette, CheckCircle2, Terminal, Activity,
  Globe, ChevronRight, Layers, ArrowUpRight, Phone, MessageCircle,
  GraduationCap, Users, LayoutDashboard
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { use3DTilt } from "@/hooks/use3DTilt";
import heroBg from "@/assets/hero-bg.jpg";
import heroIllustration from "@/assets/hero-illustration.jpg";
import logo from "@/assets/logo.png";
import { SITE } from "@/data/site";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  service: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

const BentoShowcaseCard = ({
  icon: Icon,
  title,
  short,
  slug,
  span,
  gradient,
  badge = "Bento Feature",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  short: string;
  slug: string;
  span: string;
  gradient: string;
  badge?: string;
}) => {
  const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt<HTMLAnchorElement>({
    maxTilt: 8,
    scale: 1.02,
    perspective: 1000,
  });

  return (
    <Link
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      href={slug.startsWith("/") ? slug : `/services/${slug}`}
      className={`card-3d group relative rounded-3xl p-7 border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 block overflow-hidden preserve-3d ${span}`}
    >
      <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
      <div className="card-3d-glare" />

      <div className="relative z-10 preserve-3d">
        <div className="flex items-center justify-between mb-6 preserve-3d">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs translate-z-20 text-primary">
            <Icon className="h-6 w-6 group-hover:rotate-6 transition-transform duration-300" />
          </div>
          <span className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full translate-z-10">
            {badge}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-2.5 text-slate-900 group-hover:text-primary transition-colors tracking-tight translate-z-20">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal translate-z-10">
          {short}
        </p>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between translate-z-20">
          <span className="text-xs font-bold text-primary inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Explore Capability <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
          <span className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all" />
        </div>
      </div>
    </Link>
  );
};

export const Hero = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState("LMS System");
  const [formMessage, setFormMessage] = useState("");

  const handleWhatsAppRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello Silver Wolf Technologies,\nName: ${formName || "Visitor"}\nEmail: ${formEmail || "Not provided"}\nService: ${formService}\nMessage: ${formMessage || "Interested in learning more."}`
    );
    window.open(`https://wa.me/${SITE.whatsapp}?text=${text}`, "_blank");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || submitted) return;

    const formElement = e.currentTarget;
    const fd = new FormData(formElement);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: String(fd.get("service") || "LMS System"),
      message: String(fd.get("message") || ""),
      honeypot: String(fd.get("hero_url") || ""),
    };

    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(
          data.error || "Web dispatch is currently unavailable. Please click 'WhatsApp Brief' below to send your message directly."
        );
        setLoading(false);
        // Form inputs preserved on failure so user does not lose their typed brief
        return;
      }

      setSubmitted(true);
      toast.success(data.message || "Proposal submitted! Our senior team will connect within 24 hours.");
      formElement.reset();
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormMessage("");

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "Engagement",
          event_label: payload.service,
          lead_id: data.leadId,
        });
      }
    } catch {
      toast.error("Network error connecting to lead server. Please click 'WhatsApp Brief' to send your message directly.");
    } finally {
      setLoading(false);
    }
  };

  const { cardRef: heroRightRef, handleMouseMove: handleRightMove, handleMouseLeave: handleRightLeave } = use3DTilt<HTMLDivElement>({
    maxTilt: 8,
    scale: 1.015,
    perspective: 1200,
  });

  return (
    <section id="home" className="relative pt-32 pb-24 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 -z-10">
        <img src={heroBg.src} alt="" width={1920} height={1080} className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
      </div>
      <div className="absolute top-16 left-8 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-8 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg -z-10" />

      <div className="container relative z-10 space-y-16">
        
        {/* ===== HERO MAIN BENTO GRID ===== */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT BENTO CARD (Span 7) */}
          <div className="lg:col-span-7 rounded-3xl p-8 md:p-12 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-2xs">
                <img src={logo.src} alt="Silver Wolf Logo" className="h-4 w-4 drop-shadow-xs" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                  Silver Wolf Technologies · India HQ
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
                Web Development, <br />
                LMS, Custom CRM & <br />
                <span className="text-gradient-primary">HR Software in India.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                We engineer scalable learning management systems (LMS), custom CRM platforms, attendance portals, and high-performance Next.js web applications for ambitious businesses across India and worldwide.
              </p>

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild variant="hero" size="xl" className="shadow-lg shadow-indigo-500/25 rounded-full px-7">
                  <Link href="/contact" className="flex items-center justify-center gap-2">
                    <span>Start Your Project</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Direct WhatsApp Action */}
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Silver%20Wolf%20Technologies,%20I'd%20like%20to%20discuss%20a%20software%20project.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Phone Call Action */}
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 active:scale-95 transition-all"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{SITE.phone}</span>
                </a>
              </div>
            </div>

            {/* Stats row inside Bento Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 relative z-10">
              {[
                ["90+", "Lighthouse Speed"],
                ["100%", "Code Ownership"],
                ["Zero", "Recurring Seat Fees"],
                ["24h", "Direct SLA Response"],
              ].map(([n, l]) => (
                <div key={l} className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sora text-gradient-primary">{n}</div>
                  <div className="text-xs font-semibold text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT BENTO CARD (Span 5) — Live Architecture Showcase & Fast Form */}
          <div
            ref={heroRightRef}
            onMouseMove={handleRightMove}
            onMouseLeave={handleRightLeave}
            className="lg:col-span-5 card-3d rounded-3xl p-6 md:p-7 bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl flex flex-col justify-between relative overflow-hidden preserve-3d"
          >
            <div className="card-3d-glare" />

            <div className="relative z-10 space-y-4 preserve-3d">
              {/* Product Visual Header */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner group">
                <img
                  src={heroIllustration.src}
                  alt="Silver Wolf Technologies Platform Architecture (LMS, CRM, SaaS)"
                  width={600}
                  height={320}
                  className="w-full h-36 md:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-3.5">
                  <div className="text-white">
                    <span className="text-[10px] font-extrabold tracking-widest uppercase bg-primary px-2 py-0.5 rounded-full text-white inline-block mb-1">
                      Platform Architecture
                    </span>
                    <h4 className="text-xs md:text-sm font-bold leading-tight">
                      Custom LMS, CRM & Enterprise Software Systems
                    </h4>
                  </div>
                </div>
              </div>

              {/* Fast Form */}
              <form onSubmit={onSubmit} className="space-y-3 translate-z-20">
                <input type="text" name="hero_url" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <Label htmlFor="hero-name" className="text-xs font-semibold text-slate-700">Full Name</Label>
                    <Input
                      id="hero-name"
                      name="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your Name"
                      className="mt-1 bg-slate-50 border-slate-200 h-8.5 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-phone" className="text-xs font-semibold text-slate-700">Phone / WhatsApp</Label>
                    <Input
                      id="hero-phone"
                      name="phone"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="mt-1 bg-slate-50 border-slate-200 h-8.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <Label htmlFor="hero-email" className="text-xs font-semibold text-slate-700">Email Address</Label>
                    <Input
                      id="hero-email"
                      name="email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="mt-1 bg-slate-50 border-slate-200 h-8.5 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-service" className="text-xs font-semibold text-slate-700">Platform Goal</Label>
                    <select
                      id="hero-service"
                      name="service"
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="mt-1 w-full h-8.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-900 focus:bg-white"
                    >
                      <option value="LMS System">LMS Platform</option>
                      <option value="CRM Platform">Custom CRM</option>
                      <option value="HR Management Platform">HR & Attendance Portal</option>
                      <option value="Website Development">Web Development</option>
                      <option value="SEO Services">Technical SEO & Growth</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hero-message" className="text-xs font-semibold text-slate-700">Project Requirements</Label>
                  <Textarea
                    id="hero-message"
                    name="message"
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Describe your platform requirements, timeline, or scope..."
                    rows={2}
                    className="mt-1 bg-slate-50 border-slate-200 resize-none text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button type="submit" variant="hero" size="sm" disabled={loading} className="w-full py-2 text-xs shadow-md shadow-indigo-500/20">
                    {loading ? "Transmitting..." : <>Send Proposal <Send className="h-3 w-3 ml-1" /></>}
                  </Button>
                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Brief</span>
                  </button>
                </div>
              </form>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 translate-z-10">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Non-Disclosure Protected</span>
                <span>Response &lt; 24h</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===== BELOW HERO 6 BENTO CARDS SHOWCASE ===== */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Core Software Verticals</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Advanced <span className="text-gradient-primary">Software & Platforms</span>
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Engineered with full code ownership, zero recurring per-seat licensing fees, and production scalability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-6 card-3d-wrapper">
            <BentoShowcaseCard
              icon={GraduationCap}
              title="LMS Platform"
              short="Custom Learning Management System with quizzes, student portals, certificates, and live class support."
              slug="/products/lms"
              span="lg:col-span-4"
              gradient="from-indigo-500 via-primary to-purple-500"
              badge="Platform Offering"
            />
            <BentoShowcaseCard
              icon={LayoutDashboard}
              title="Custom CRM Platform"
              short="Bespoke sales pipelines, automated WhatsApp lead routing, and customer history without per-seat fees."
              slug="/products/crm"
              span="lg:col-span-4"
              gradient="from-blue-500 via-cyan-500 to-indigo-500"
              badge="Platform Offering"
            />
            <BentoShowcaseCard
              icon={Users}
              title="HR & Attendance Portal"
              short="Unified employee records, real-time geolocation attendance, leave workflows, and payroll-ready exports."
              slug="/products/hr-management"
              span="lg:col-span-4"
              gradient="from-emerald-500 via-teal-500 to-indigo-500"
              badge="Platform Offering"
            />
            <BentoShowcaseCard
              icon={Code2}
              title="Web Development"
              short="High-performance web apps built with Next.js, React, and serverless edge computing."
              slug="website-development"
              span="lg:col-span-4"
              gradient="from-purple-500 via-pink-500 to-indigo-500"
              badge="Core Service"
            />
            <BentoShowcaseCard
              icon={TrendingUp}
              title="Digital Marketing & SEO"
              short="Data-driven search dominance, multi-channel performance ads, and organic funnel acceleration."
              slug="seo-services"
              span="lg:col-span-4"
              gradient="from-indigo-500 via-purple-500 to-emerald-500"
              badge="Core Service"
            />
            <BentoShowcaseCard
              icon={Smartphone}
              title="Mobile Apps & SaaS"
              short="Cross-platform iOS & Android mobile applications and cloud-native SaaS systems engineered to scale."
              slug="mobile-app-development"
              span="lg:col-span-4"
              gradient="from-purple-500 via-indigo-500 to-blue-500"
              badge="Core Service"
            />
          </div>
        </div>

      </div>
    </section>
  );
};



