import { SITE } from '../data/site';

/**
 * WhatsApp Helper Module for Silver Wolf Technologies
 *
 * Centralizes WhatsApp message formatting, URL building, and privacy-first
 * analytics tracking across all enquiry and career submission funnels.
 *
 * Requirements:
 * - Uses sanitized wa.me URLs with international phone digits.
 * - Formats message body with clear structure and clean line breaks (\n).
 * - Excludes empty/undefined fields cleanly.
 * - Enforces zero PII in Google Analytics (gtag) event payloads.
 */

export interface EnquiryData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  city?: string;
  locality?: string;
  message: string;
  sourceUrl?: string;
}

export interface CareerApplicationData {
  name: string;
  email: string;
  phone: string;
  college: string;
  semesterYear: string;
  role: string;
  category?: string;
  duration?: string;
  hiringTypes?: string[];
  stack?: string[];
  portfolio?: string;
  source?: string;
  sourceUrl?: string;
}

/**
 * Sanitizes phone number to digits only for wa.me URL
 */
export function sanitizePhoneDigits(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Builds the official WhatsApp enquiry URL prefilled with structured project details
 */
export function buildWhatsAppEnquiryUrl(
  data: EnquiryData,
  destinationNumber: string = SITE.whatsapp
): string {
  const dest = sanitizePhoneDigits(destinationNumber) || '919845953801';

  const lines: string[] = [
    '🐺 *New Project Enquiry — Silver Wolf Technologies*',
    '',
    `📋 *Service / Platform:* ${data.service?.trim() || 'Custom Software / Web Development'}`,
  ];

  if (data.city?.trim()) {
    const loc = data.locality?.trim() ? ` (${data.locality.trim()})` : '';
    lines.push(`📍 *Location:* ${data.city.trim()}${loc}`);
  }

  lines.push('──────────────────');
  lines.push('👤 *Client Details*');
  lines.push(`*Name:* ${data.name.trim()}`);
  lines.push(`*Email:* ${data.email.trim()}`);

  if (data.phone?.trim()) {
    lines.push(`*Phone:* ${data.phone.trim()}`);
  }

  lines.push('──────────────────');
  lines.push('💬 *Project Scope & Requirements*');
  lines.push(data.message.trim());

  if (data.sourceUrl?.trim()) {
    // Sanitize source URL (remove any internal tokens or query params)
    try {
      const parsed = new URL(data.sourceUrl, SITE.domain);
      lines.push('──────────────────');
      lines.push(`Sent from: ${parsed.origin}${parsed.pathname}`);
    } catch {
      lines.push('──────────────────');
      lines.push(`Sent from: ${data.sourceUrl.trim()}`);
    }
  }

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${dest}?text=${encoded}`;
}

/**
 * Builds the official WhatsApp career application URL
 */
export function buildWhatsAppCareerUrl(
  data: CareerApplicationData,
  destinationNumber: string = SITE.whatsapp
): string {
  const dest = sanitizePhoneDigits(destinationNumber) || '919845953801';

  const lines: string[] = [
    '🐺 *New Career Application — Silver Wolf Technologies*',
    '',
    `📋 *Position:* ${data.role.trim()}`,
  ];

  if (data.category?.trim()) {
    lines.push(`📂 *Category:* ${data.category.trim()}`);
  }
  if (data.duration?.trim()) {
    lines.push(`⏱ *Duration:* ${data.duration.trim()}`);
  }
  if (data.hiringTypes && data.hiringTypes.length > 0) {
    lines.push(`💼 *Hiring Types:* ${data.hiringTypes.join(', ')}`);
  }
  if (data.stack && data.stack.length > 0) {
    lines.push(`🛠 *Tech Stack:* ${data.stack.join(', ')}`);
  }

  lines.push('──────────────────');
  lines.push('👤 *Applicant Details*');
  lines.push(`*Name:* ${data.name.trim()}`);
  lines.push(`*Email:* ${data.email.trim()}`);
  lines.push(`*Phone:* ${data.phone.trim()}`);
  lines.push(`*College:* ${data.college.trim()}`);
  lines.push(`*Semester / Year:* ${data.semesterYear.trim()}`);

  if (data.portfolio?.trim()) {
    lines.push(`*Portfolio / Profile:* ${data.portfolio.trim()}`);
  }
  if (data.source?.trim()) {
    lines.push(`*Heard From:* ${data.source.trim()}`);
  }

  lines.push('──────────────────');
  if (data.sourceUrl?.trim()) {
    try {
      const parsed = new URL(data.sourceUrl, SITE.domain);
      lines.push(`Sent from: ${parsed.origin}${parsed.pathname}`);
    } catch {
      lines.push(`Sent from: ${data.sourceUrl.trim()}`);
    }
  } else {
    lines.push('Sent from: silverwolftechnologies.in/careers');
  }

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${dest}?text=${encoded}`;
}

/**
 * Privacy-compliant Google Analytics 4 event dispatcher for WhatsApp CTA clicks.
 * Strictly guarantees ZERO PII (no names, phone numbers, email addresses, or client notes).
 */
export function trackWhatsAppClick(options: {
  ctaLocation: string;
  service?: string;
  path?: string;
}): void {
  if (typeof window === 'undefined' || !(window as any).gtag) {
    return;
  }

  try {
    const currentPath =
      options.path ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');

    (window as any).gtag('event', 'whatsapp_click', {
      event_category: 'Engagement',
      event_label: options.service || 'General Enquiry',
      cta_location: options.ctaLocation,
      page_path: currentPath,
    });
  } catch {
    // Fail silently without disrupting user navigation
  }
}

/**
 * Privacy-compliant Google Analytics 4 event dispatcher for direct phone calls.
 */
export function trackPhoneClick(options: {
  ctaLocation: string;
  path?: string;
}): void {
  if (typeof window === 'undefined' || !(window as any).gtag) {
    return;
  }

  try {
    const currentPath =
      options.path ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');

    (window as any).gtag('event', 'phone_click', {
      event_category: 'Engagement',
      event_label: 'Direct Call',
      cta_location: options.ctaLocation,
      page_path: currentPath,
    });
  } catch {
    // Fail silently
  }
}
