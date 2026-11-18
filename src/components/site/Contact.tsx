"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { SITE } from "@/data/site";
import { buildWhatsAppEnquiryUrl, trackWhatsAppClick, trackPhoneClick } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

type Props = { compact?: boolean; presetService?: string };

export const Contact = ({ compact = false, presetService }: Props) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(presetService ? `I am interested in ${presetService}. ` : "");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formElement = e.currentTarget;
    const fd = new FormData(formElement);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      service: presetService || "General Inquiry",
      message: String(fd.get("message") || ""),
      honeypot: String(fd.get("website_url") || ""),
    };

    if (payload.honeypot) {
      return;
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      const url = buildWhatsAppEnquiryUrl({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        service: payload.service,
        message: payload.message,
        sourceUrl: typeof window !== "undefined" ? window.location.href : SITE.domain,
      });

      trackWhatsAppClick({
        ctaLocation: compact ? "service_contact_form" : "contact_page_form",
        service: payload.service,
      });

      window.open(url, "_blank");
      setSubmitted(true);
      toast.success("WhatsApp opened with your prefilled brief! Tap Send in the chat to connect with our team.");
    } catch {
      toast.error("Unable to open WhatsApp. Please click the Call button to reach us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`${compact ? "py-16" : "py-24 md:py-32"} relative`}>
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2 animate-fade-up space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Get in Touch</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                Let's build something <span className="text-gradient">extraordinary.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Connect with our senior engineering team today for transparent scoping, timeline estimates, and an architectural roadmap.
              </p>
            </div>

            <div className="space-y-3">
              {/* Direct Phone */}
              <a
                href={`tel:${SITE.phoneRaw}`}
                onClick={() => trackPhoneClick({ ctaLocation: compact ? "service_contact_sidebar_phone" : "contact_sidebar_phone" })}
                className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-primary/50 hover:shadow-md transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Direct Call / Consultation</div>
                  <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{SITE.phone}</div>
                </div>
              </a>

              {/* Direct WhatsApp */}
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Silver%20Wolf%20Technologies,%20I%20would%20like%20to%20discuss%20a%20software%20project.`}
                onClick={() => trackWhatsAppClick({ ctaLocation: compact ? "service_contact_sidebar_whatsapp" : "contact_sidebar_whatsapp", service: presetService })}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-emerald-400 hover:shadow-md transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Instant WhatsApp Chat</div>
                  <div className="font-bold text-emerald-700">Chat with Senior Leads Now</div>
                </div>
              </a>

              {/* Email */}
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 glass rounded-2xl p-4 hover:border-primary/50 hover:shadow-md transition-all group">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Direct Email</div>
                  <div className="font-bold text-slate-900 group-hover:text-primary transition-colors break-all">{SITE.email}</div>
                </div>
              </a>

              {/* Address / Headquarters */}
              <div className="flex items-center gap-4 glass rounded-2xl p-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Headquarters</div>
                  <div className="font-medium text-slate-800 text-xs">{SITE.address}</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-3 glass rounded-3xl p-8 md:p-10 space-y-5 animate-fade-up border border-slate-200 shadow-xl bg-white/95">
            {/* Anti-spam honeypot */}
            <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 bg-slate-50 border-slate-200 h-10 text-xs"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Work Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1.5 bg-slate-50 border-slate-200 h-10 text-xs"
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone / WhatsApp Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="mt-1.5 bg-slate-50 border-slate-200 h-10 text-xs"
                maxLength={20}
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-xs font-bold text-slate-700">Project Requirements & Scope *</Label>
              <Textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What platform or service are you looking to build (LMS, CRM, HR Portal, Web App, SEO)?"
                rows={4}
                className="mt-1.5 bg-slate-50 border-slate-200 resize-none text-xs leading-relaxed"
                maxLength={1000}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all active:scale-95"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                <span>{loading ? "Opening..." : "Continue on WhatsApp"}</span>
              </Button>

              <a
                href={`tel:${SITE.phoneRaw}`}
                onClick={() => trackPhoneClick({ ctaLocation: compact ? "service_contact_call" : "contact_form_call" })}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
              >
                <Phone className="h-4.5 w-4.5 text-primary" />
                <span>Call {SITE.phone}</span>
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground text-center pt-1 leading-normal">
              WhatsApp will open with your details prefilled. Tap Send in chat. Attachments can be shared directly.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
