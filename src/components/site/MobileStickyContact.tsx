'use client';

import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { SITE } from '@/data/site';

/**
 * Mobile Sticky Contact Bar
 * Ensures visitors on mobile devices can reach Silver Wolf Technologies with 1 tap
 * via direct phone call or WhatsApp.
 */
export function MobileStickyContact() {
  const pathname = usePathname();

  // Hide on internal or response screens
  if (pathname && (pathname.startsWith('/careers/responses') || pathname.startsWith('/admin'))) {
    return null;
  }

  const defaultWhatsappMsg = encodeURIComponent(
    'Hello Silver Wolf Technologies, I would like to inquire about your software development / platform services.'
  );

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2 animate-fade-in">
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {/* Direct Call CTA */}
        <a
          href={`tel:${SITE.phoneRaw}`}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          <Phone className="h-4 w-4 text-primary" />
          <span className="truncate">Call Now</span>
        </a>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=${defaultWhatsappMsg}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="truncate">WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
}
