'use client';

import { Shield, Zap, Globe, HeartHandshake, FileCheck, DollarSign, LucideIcon } from "lucide-react";
import { use3DTilt } from "@/hooks/use3DTilt";

const reasons = [
  { icon: Zap, title: "Lightning Delivery", desc: "Sprint-based execution with weekly demos. Turnkey platforms deploy in days; custom builds ship in 2–6 weeks." },
  { icon: FileCheck, title: "3 Months Free Support", desc: "Every custom build includes 90 days of free post-launch maintenance, bug triage, and performance tuning." },
  { icon: Shield, title: "100% Code & IP Ownership", desc: "Clean, documented codebases hosted in your cloud with zero recurring monthly per-seat licensing fees." },
  { icon: Globe, title: "India + Global Delivery", desc: "HQ in Murbad, India with seamless collaboration across IST, GMT, EST, and AEST timezones." },
];

const Feature3DCard = ({ icon: Icon, title, desc, className = "" }: { icon: LucideIcon; title: string; desc: string; className?: string }) => {
  const { cardRef, handleMouseMove, handleMouseLeave } = use3DTilt<HTMLDivElement>({
    maxTilt: 10,
    scale: 1.025,
    perspective: 1000,
  });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-3d group relative glass rounded-3xl p-6 border border-slate-200/80 bg-white/90 hover:border-primary/50 transition-all duration-300 overflow-hidden preserve-3d ${className}`}
    >
      <div className="card-3d-glare" />
      <div className="relative z-10 preserve-3d">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-300 translate-z-20">
          <Icon className="h-5 w-5 text-primary group-hover:rotate-6 transition-transform" />
        </div>
        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors tracking-tight translate-z-20">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal translate-z-10">
          {desc}
        </p>
      </div>
    </div>
  );
};

export const WhyUs = () => (
  <section id="why" className="py-24 md:py-32 relative overflow-hidden">
    <div className="container relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why Silver Wolf</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            We move <span className="text-gradient">like a pack.</span> You scale like a leader.
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            We're not a freelancer marketplace. We're a tight, senior team obsessed with shipping
            measurable outcomes — traffic, leads, revenue.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="glass rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-gradient-primary">3 Mo.</span>
                <span className="text-xs font-bold text-slate-800">Free Maintenance</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Post-launch bug triage, performance tuning, and minor tweaks included in every custom proposal.
              </p>
            </div>
            <div className="glass rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-emerald-600">~50%</span>
                <span className="text-xs font-bold text-slate-800">Cost Advantage</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-value engineering without bloated agency overhead or perpetual per-seat SaaS license fees.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 card-3d-wrapper">
          {reasons.map(({ icon, title, desc }, i) => (
            <Feature3DCard
              key={title}
              icon={icon}
              title={title}
              desc={desc}
              className={i % 2 === 1 ? "sm:translate-y-8" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

