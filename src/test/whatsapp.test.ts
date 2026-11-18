import assert from 'assert';
import {
  buildWhatsAppEnquiryUrl,
  buildWhatsAppCareerUrl,
  sanitizePhoneDigits,
  trackWhatsAppClick,
  trackPhoneClick,
} from '../lib/whatsapp';
import { SITE } from '../data/site';

console.log('=== RUNNING WHATSAPP SUBMISSION & TELEMETRY TESTS ===\n');

let passed = 0;
let failed = 0;

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

// 1. Phone digit sanitization
it('sanitizePhoneDigits strips spaces, pluses, and hyphens', () => {
  assert.strictEqual(sanitizePhoneDigits('+91 98459 53801'), '919845953801');
  assert.strictEqual(sanitizePhoneDigits('+91-93739-22206'), '919373922206');
});

// 2. buildWhatsAppEnquiryUrl
it('buildWhatsAppEnquiryUrl formats correctly with all fields', () => {
  const url = buildWhatsAppEnquiryUrl({
    name: 'Rohan Sharma',
    email: 'rohan@enterprise.in',
    phone: '+91 98765 43210',
    service: 'LMS Platform',
    city: 'Mumbai',
    locality: 'Andheri',
    message: 'Need custom course delivery with 5,000 active students and UPI gateway.',
    sourceUrl: 'https://www.silverwolftechnologies.in/products/lms',
  });

  assert.ok(url.startsWith('https://wa.me/919845953801?text='));
  const decoded = decodeURIComponent(url.replace('https://wa.me/919845953801?text=', ''));

  assert.ok(decoded.includes('*Name:* Rohan Sharma'));
  assert.ok(decoded.includes('*Email:* rohan@enterprise.in'));
  assert.ok(decoded.includes('*Phone:* +91 98765 43210'));
  assert.ok(decoded.includes('*Service / Platform:* LMS Platform'));
  assert.ok(decoded.includes('📍 *Location:* Mumbai (Andheri)'));
  assert.ok(decoded.includes('5,000 active students and UPI gateway'));
  assert.ok(decoded.includes('Sent from: https://www.silverwolftechnologies.in/products/lms'));
  assert.ok(!decoded.includes('undefined'));
});

it('buildWhatsAppEnquiryUrl handles optional fields gracefully without undefined or null', () => {
  const url = buildWhatsAppEnquiryUrl({
    name: 'Neha Gupta',
    email: 'neha@startup.co',
    message: 'Looking for SEO services and website speed audit.',
  });

  const decoded = decodeURIComponent(url.replace('https://wa.me/919845953801?text=', ''));
  assert.ok(decoded.includes('*Name:* Neha Gupta'));
  assert.ok(decoded.includes('*Email:* neha@startup.co'));
  assert.ok(!decoded.includes('*Phone:*'));
  assert.ok(!decoded.includes('📍 *Location:*'));
  assert.ok(!decoded.includes('undefined'));
  assert.ok(!decoded.includes('null'));
});

it('buildWhatsAppEnquiryUrl supports custom destination (e.g. team member)', () => {
  const url = buildWhatsAppEnquiryUrl(
    {
      name: 'Aditi Varma',
      email: 'aditi@creative.in',
      message: 'Video editing portfolio query',
    },
    SITE.teamMemberWhatsapp
  );

  assert.ok(url.startsWith('https://wa.me/919373922206?text='));
});

// 3. buildWhatsAppCareerUrl
it('buildWhatsAppCareerUrl formats complete application text', () => {
  const url = buildWhatsAppCareerUrl({
    name: 'Vikram Mehta',
    email: 'vikram.m@college.edu',
    phone: '+91 98200 12345',
    college: 'IIT Bombay',
    semesterYear: '6th Semester / 3rd Year',
    role: 'Full Stack Web Development',
    category: 'Development',
    duration: '16 weeks',
    hiringTypes: ['Internship', 'Full-Time'],
    stack: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    portfolio: 'https://github.com/vikram-dev',
    source: 'LinkedIn',
    sourceUrl: 'https://www.silverwolftechnologies.in/careers',
  });

  assert.ok(url.startsWith('https://wa.me/919845953801?text='));
  const decoded = decodeURIComponent(url.replace('https://wa.me/919845953801?text=', ''));

  assert.ok(decoded.includes('*Position:* Full Stack Web Development'));
  assert.ok(decoded.includes('*Applicant Details*'));
  assert.ok(decoded.includes('*Name:* Vikram Mehta'));
  assert.ok(decoded.includes('*Email:* vikram.m@college.edu'));
  assert.ok(decoded.includes('*Phone:* +91 98200 12345'));
  assert.ok(decoded.includes('*College:* IIT Bombay'));
  assert.ok(decoded.includes('*Semester / Year:* 6th Semester / 3rd Year'));
  assert.ok(decoded.includes('*Portfolio / Profile:* https://github.com/vikram-dev'));
  assert.ok(decoded.includes('*Heard From:* LinkedIn'));
  assert.ok(!decoded.includes('undefined'));
});

// 4. Analytics Telemetry & Zero PII verification
it('trackWhatsAppClick does not throw when window or gtag is absent (SSR safe)', () => {
  assert.doesNotThrow(() => {
    trackWhatsAppClick({
      ctaLocation: 'hero_form',
      service: 'LMS Platform',
    });
  });
});

it('trackPhoneClick does not throw when window or gtag is absent (SSR safe)', () => {
  assert.doesNotThrow(() => {
    trackPhoneClick({
      ctaLocation: 'hero_call',
    });
  });
});

it('trackWhatsAppClick dispatches clean payload with ZERO PII', () => {
  let capturedEvent: string | null = null;
  let capturedPayload: any = null;

  (global as any).window = {
    location: { pathname: '/contact' },
    gtag: (type: string, eventName: string, payload: any) => {
      capturedEvent = eventName;
      capturedPayload = payload;
    },
  };

  trackWhatsAppClick({
    ctaLocation: 'contact_page_form',
    service: 'Custom CRM',
    path: '/contact',
  });

  assert.strictEqual(capturedEvent, 'whatsapp_click');
  assert.strictEqual(capturedPayload.event_category, 'Engagement');
  assert.strictEqual(capturedPayload.event_label, 'Custom CRM');
  assert.strictEqual(capturedPayload.cta_location, 'contact_page_form');
  assert.strictEqual(capturedPayload.page_path, '/contact');

  // Strict Zero PII Verification
  assert.strictEqual(capturedPayload.name, undefined);
  assert.strictEqual(capturedPayload.email, undefined);
  assert.strictEqual(capturedPayload.phone, undefined);
  assert.strictEqual(capturedPayload.message, undefined);
  assert.strictEqual(capturedPayload.lead_id, undefined);

  delete (global as any).window;
});

console.log(`\n======================================================`);
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
