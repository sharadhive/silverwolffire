'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Sparkles, ArrowRight, Code2, Megaphone,
  Palette, Phone, MessageCircle, Layers, GraduationCap, Users, LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { SERVICES, SITE, PRODUCT_PLATFORMS } from "@/data/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Work" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lms: GraduationCap,
  crm: LayoutDashboard,
  "hr-management": Users,
};

const grouped = {
  Development: { items: SERVICES.filter((s) => s.category === "Development"), icon: Code2 },
  Marketing: { items: SERVICES.filter((s) => s.category === "Marketing"), icon: Megaphone },
  Creative: { items: SERVICES.filter((s) => s.category === "Creative"), icon: Palette },
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname && pathname.startsWith("/careers/responses")) {
    return null;
  }

  const isServicesActive = pathname && pathname.startsWith("/services");
  const isPlatformsActive = pathname && pathname.startsWith("/products");

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2 bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-md" : "py-3.5"}`}>
      <div className={`container transition-all duration-300 ${!scrolled ? "max-w-7xl" : ""}`}>
        <div className={`flex items-center justify-between transition-all duration-300 ${!scrolled ? "bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-sm rounded-full px-5 py-2" : ""}`}>
          
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <img
                src={logo.src}
                alt="Silver Wolf Technologies"
                width={42}
                height={42}
                className="h-9 w-9 md:h-10 md:w-10 drop-shadow-[0_4px_12px_rgba(79,70,229,0.35)] group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white" title="Active Agency Availability" />
            </div>
            <span className="font-extrabold tracking-tight text-xs md:text-sm leading-tight text-slate-900">
              Silver Wolf<br />
              <span className="text-primary text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase">Technologies</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            <Link
              href="/"
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                pathname === "/"
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                  : "text-slate-600 hover:text-primary hover:bg-slate-100/60"
              }`}
            >
              Home
            </Link>

            {/* Platforms / Software Products Dropdown */}
            <div className="relative" onMouseEnter={() => setPlatformsOpen(true)} onMouseLeave={() => setPlatformsOpen(false)}>
              <button
                className={`flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                  isPlatformsActive || platformsOpen
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                    : "text-slate-600 hover:text-primary hover:bg-slate-100/60"
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Platforms</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${platformsOpen ? "rotate-180 text-primary" : ""}`} />
              </button>

              {platformsOpen && (
                <div className="absolute top-full left-0 pt-2.5 w-[380px]">
                  <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-4 border border-slate-200 shadow-2xl shadow-slate-900/10 animate-fade-up space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary px-2 pb-1 border-b border-slate-100">
                      Advanced Software Platforms
                    </div>
                    {PRODUCT_PLATFORMS.map((p) => {
                      const Icon = PLATFORM_ICONS[p.slug] || Layers;
                      return (
                        <Link
                          key={p.slug}
                          href={`/products/${p.slug}`}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors flex items-center gap-2">
                              <span>{p.title}</span>
                              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {p.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                              {p.short}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button
                className={`flex items-center gap-1 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                  isServicesActive || servicesOpen
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                    : "text-slate-600 hover:text-primary hover:bg-slate-100/60"
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${servicesOpen ? "rotate-180 text-primary" : ""}`} />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[680px]">
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 grid grid-cols-3 gap-6 border border-slate-200 shadow-2xl shadow-slate-900/10 animate-fade-up">
                    {(Object.keys(grouped) as Array<keyof typeof grouped>).map((catKey) => {
                      const category = grouped[catKey];
                      const Icon = category.icon;
                      return (
                        <div key={catKey} className="space-y-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full w-fit">
                            <Icon className="h-3 w-3 text-primary" />
                            <span>{catKey}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {category.items.map((s) => {
                              const isActive = pathname === `/services/${s.slug}`;
                              return (
                                <li key={s.slug}>
                                  <Link
                                    href={`/services/${s.slug}`}
                                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg block transition-all ${
                                      isActive
                                        ? "text-primary font-bold bg-primary/10"
                                        : "text-slate-600 hover:text-primary hover:bg-slate-50"
                                    }`}
                                  >
                                    {s.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {links.slice(1).map((l) => {
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-xs"
                      : "text-slate-600 hover:text-primary hover:bg-slate-100/60"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Direct Contact Options */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Phone Call CTA */}
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-primary px-3 py-1.5 rounded-full hover:bg-slate-100/80 transition-colors"
              title="Call Silver Wolf Technologies directly"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{SITE.phone}</span>
            </a>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Silver%20Wolf%20Technologies,%20I%20would%20like%20to%20discuss%20a%20software%20project.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-3 py-1.5 rounded-full shadow-2xs transition-all"
              title="Chat with our engineering leads on WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Consultation Button */}
            <Button asChild variant="hero" size="sm" className="shadow-md shadow-indigo-500/20 rounded-full px-4 py-1.5 h-8 text-xs">
              <Link href="/contact" className="flex items-center gap-1">
                <span>Free Quote</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-200 mt-2 max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-up">
          <div className="container py-5 flex flex-col gap-4">
            
            {/* Direct Contact Buttons on Mobile */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-900 font-bold text-xs border border-slate-200"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>Call Us</span>
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Silver%20Wolf%20Technologies,%20I%20would%20like%20to%20discuss%20a%20project.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-300"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Platform Offerings */}
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary px-2 mb-1">
                Software Platforms
              </div>
              {PRODUCT_PLATFORMS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-primary/5 px-3 py-2 rounded-xl"
                >
                  <span>{p.title}</span>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {p.category}
                  </span>
                </Link>
              ))}
            </div>

            {/* General Links */}
            <div className="border-t border-slate-200 pt-2 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl block transition-colors ${
                    pathname === l.to ? "bg-primary/10 text-primary" : "text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Services List */}
            <div className="border-t border-slate-200 pt-2">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary mb-2 px-2">Services</div>
              <div className="grid grid-cols-1 gap-0.5">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-xs font-medium text-slate-600 hover:text-primary hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>

            <Button asChild variant="hero" onClick={() => setOpen(false)} className="w-full py-3 rounded-full mt-2">
              <Link href="/contact" className="flex items-center justify-center gap-2">
                <span>Request Free Proposal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};


