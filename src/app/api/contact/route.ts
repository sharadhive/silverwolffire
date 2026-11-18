import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SITE } from '../../../data/site';

/**
 * ─── Contact & Lead Ingestion API Route ───────────────────────────────────────
 *
 * Implements strict server-side form handling and lead routing:
 *   1. Strict Zod schema validation
 *   2. In-memory IP rate limiting & abuse prevention (max 5 submissions / 15 min)
 *   3. Honeypot anti-bot filtering (silent 200 without dispatch for bot traps)
 *   4. Safe, privacy-preserving logging (zero plain emails/PII in application logs)
 *   5. Destination Acceptance Verification:
 *      - Confirmed acceptance requires HTTP 2xx from configured webhook within 5000ms.
 *      - If webhook is missing, returns HTTP 503 (or dev/test mock) with actionable WhatsApp fallback.
 *      - If webhook errors (4xx/5xx) or times out (AbortError), returns 502/504 with WhatsApp fallback.
 *   6. Strict No-Supabase Ingestion:
 *      - General customer inquiries never enter or persist to Supabase databases.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const contactSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number must be less than 25 characters')
    .optional()
    .or(z.literal('')),
  service: z
    .string()
    .trim()
    .max(100, 'Service selection is invalid')
    .optional()
    .or(z.literal('')),
  message: z
    .string({ required_error: 'Project brief is required' })
    .trim()
    .min(10, 'Please share at least 10 characters about your project')
    .max(2000, 'Message must be less than 2000 characters'),
  honeypot: z.string().optional().or(z.literal('')),
});

// Simple in-memory rate limiter: max 5 requests per 15 minutes per IP
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

/** Obfuscate email for safe logging: e.g. a***@domain.com */
function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return '***';
  return `${user.charAt(0)}***@${domain}`;
}

export async function POST(request: Request) {
  try {
    // 1. Identify Client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions received from your connection. Please wait a few minutes, or reach out directly via WhatsApp.',
          rateLimited: true,
          fallback: {
            type: 'whatsapp',
            number: SITE.whatsapp,
          },
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload received.' },
        { status: 400 }
      );
    }

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstIssue?.message || 'Validation failed. Please check your inputs.',
          field: firstIssue?.path[0],
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3. Honeypot check (hidden bot field)
    if (data.honeypot && data.honeypot.trim().length > 0) {
      // Return 200 silently to confuse spam bots without notifying or dispatching
      return NextResponse.json({
        success: true,
        message: 'Inquiry received successfully.',
        leadId: `lead_bot_${Date.now()}`,
      });
    }

    const leadId = `sw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    // 4. Safe Privacy-Preserving Logging (0 plain emails or briefs)
    console.log(
      `[LEAD_INGESTION] id=${leadId} email=${maskEmail(data.email)} service="${data.service || 'General'}" ip=${clientIp} time=${timestamp}`
    );

    // 5. Test Mock Hooks (allows automated testing of all network/timeout/error conditions)
    const mockDestination = request.headers.get('x-mock-destination');
    if (mockDestination === 'accepted') {
      return NextResponse.json({
        success: true,
        deliveryStatus: 'mock_accepted',
        message: 'Thank you! Your project brief has been received by our senior team.',
        leadId,
      });
    }
    if (mockDestination === 'error') {
      return NextResponse.json(
        {
          success: false,
          deliveryStatus: 'upstream_error',
          error: 'Web dispatch failed to reach the notification service. Please connect with us directly on WhatsApp or Call.',
          fallback: { type: 'whatsapp', number: SITE.whatsapp },
        },
        { status: 502 }
      );
    }
    if (mockDestination === 'timeout') {
      return NextResponse.json(
        {
          success: false,
          deliveryStatus: 'upstream_timeout',
          error: 'Web dispatch timed out connecting to the receiving server. Please connect with us directly on WhatsApp or Call.',
          fallback: { type: 'whatsapp', number: SITE.whatsapp },
        },
        { status: 504 }
      );
    }

    // 6. Destination Acceptance Dispatch
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      try {
        const upstreamRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            timestamp,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            service: data.service || 'General Inquiry',
            message: data.message,
            source: 'https://www.silverwolftechnologies.in',
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!upstreamRes.ok) {
          console.error(`[LEAD_DISPATCH_UPSTREAM_ERROR] id=${leadId} status=${upstreamRes.status}`);
          return NextResponse.json(
            {
              success: false,
              deliveryStatus: 'upstream_error',
              error: 'Our lead delivery service encountered an issue routing your message. Please click below to send your brief directly via WhatsApp or call our team.',
              fallback: { type: 'whatsapp', number: SITE.whatsapp },
            },
            { status: 502 }
          );
        }

        // Upstream accepted!
        return NextResponse.json({
          success: true,
          deliveryStatus: 'delivered',
          message: 'Thank you! Your project brief has been received by our senior team. We will connect within 24 hours.',
          leadId,
        });
      } catch (dispatchErr: any) {
        clearTimeout(timeoutId);
        if (dispatchErr.name === 'AbortError') {
          console.error(`[LEAD_DISPATCH_TIMEOUT] id=${leadId}`);
          return NextResponse.json(
            {
              success: false,
              deliveryStatus: 'upstream_timeout',
              error: 'Web dispatch timed out. Please click below to send your brief directly via WhatsApp or call our team.',
              fallback: { type: 'whatsapp', number: SITE.whatsapp },
            },
            { status: 504 }
          );
        }

        console.error(`[LEAD_DISPATCH_NETWORK_ERROR] id=${leadId}`, dispatchErr);
        return NextResponse.json(
          {
            success: false,
            deliveryStatus: 'network_error',
            error: 'Could not connect to the lead routing server. Please click below to send your brief directly via WhatsApp or call our team.',
            fallback: { type: 'whatsapp', number: SITE.whatsapp },
          },
          { status: 502 }
        );
      }
    }

    // 7. If CONTACT_WEBHOOK_URL is not set:
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[DEV_LEAD_LOGGED] CONTACT_WEBHOOK_URL not set in development. Simulating acceptance for id=${leadId}`);
      return NextResponse.json({
        success: true,
        deliveryStatus: 'dev_mock_accepted',
        message: 'Development mode: Project brief logged to console. (In production, set CONTACT_WEBHOOK_URL).',
        leadId,
      });
    }

    // In production without CONTACT_WEBHOOK_URL: Web dispatch is unconfigured
    return NextResponse.json(
      {
        success: false,
        deliveryStatus: 'unconfigured',
        error: 'Direct web dispatch is undergoing maintenance. Please click below to send your brief directly via WhatsApp or call our team.',
        fallback: {
          type: 'whatsapp',
          number: SITE.whatsapp,
        },
      },
      { status: 503 }
    );
  } catch (err: any) {
    console.error('[LEAD_ENDPOINT_ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected server error occurred while processing your request. Please reach out directly on WhatsApp or call our team.',
        fallback: {
          type: 'whatsapp',
          number: SITE.whatsapp,
        },
      },
      { status: 500 }
    );
  }
}
