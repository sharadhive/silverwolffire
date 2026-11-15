import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { SITE } from "@/data/site";

/**
 * Privacy Policy — required before applying to Google AdSense, and expected by
 * visitors and Google's quality reviewers. Reflects what the site actually runs
 * today (GA4, Microsoft Clarity, Vercel Analytics, WhatsApp, Supabase for career
 * applications) plus the AdSense disclosures Google requires.
 *
 * Review this with your own advisor before relying on it — update it whenever
 * you add a new tool that collects data.
 */

const PATH = "/privacy-policy";
const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How Silver Wolf Technologies collects, uses and protects information from website visitors, clients and job applicants, including cookies and analytics.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE.domain}${PATH}` },
  openGraph: {
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Silver Wolf Technologies" }], title: `${TITLE} | ${SITE.name}`, description: DESCRIPTION, url: `${SITE.domain}${PATH}` },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title={TITLE} path={PATH} updated="15 November 2026">
      <p>
        This Privacy Policy explains how {SITE.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses,
        and safeguards personal information when you visit <Link href="/">{SITE.domain.replace("https://", "")}</Link>,
        interact with our platforms, contact us via phone or WhatsApp, or submit project inquiries.
      </p>

      <h2>1. Who We Are &amp; Contact Information</h2>
      <p>
        {SITE.name} is an engineering and digital growth agency headquartered at {SITE.address}.
      </p>
      <ul>
        <li><strong>Official Website:</strong> <Link href="/">{SITE.domain}</Link></li>
        <li><strong>General Email (EMAIL_PLACEHOLDER):</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        <li><strong>Privacy Grievance Officer (PRIVACY_CONTACT_PLACEHOLDER):</strong> <a href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a></li>
        <li><strong>Direct Telephone (PHONE_NUMBER_PLACEHOLDER):</strong> <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a></li>
        <li><strong>WhatsApp Support (WHATSAPP_NUMBER_PLACEHOLDER):</strong> <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer">{SITE.whatsappDisplay}</a></li>
        <li><strong>Registered Address (BUSINESS_ADDRESS_PLACEHOLDER):</strong> {SITE.address}</li>
      </ul>

      <h2>2. Information You Give Us</h2>
      <ul>
        <li>
          <strong>General Enquiries &amp; Consultations:</strong> When you contact us via website form, email, or telephone, we collect your name, email address, optional phone number, and brief description of your project requirements.
        </li>
        <li>
          <strong>WhatsApp &amp; Direct Messaging:</strong> If you choose to contact us via WhatsApp, your phone number, profile name, and chat messages are received through WhatsApp (operated by Meta Platforms, Inc.) under WhatsApp&apos;s Terms of Service and Privacy Policy.
        </li>
        <li>
          <strong>Client Software Projects:</strong> Specifications, business workflows, and technical details shared during discovery, scoping, and development of custom LMS, CRM, HR portals, or web applications.
        </li>
        <li>
          <strong>Careers &amp; Internship Applications:</strong> Candidate contact details, educational background, portfolio, and resume information submitted for review.
        </li>
      </ul>

      <h2>3. Non-Database Handling of Website Inquiries</h2>
      <p>
        To ensure maximum visitor data security and minimize unnecessary data retention:
      </p>
      <ul>
        <li>
          General website inquiries and consultation requests are <strong>not stored in Supabase or persistent public database tables</strong>.
        </li>
        <li>
          Inquiries are handled either directly via direct WhatsApp redirect or dispatched securely to our senior leadership via authenticated email/webhook notification.
        </li>
        <li>
          We do not retain permanent centralized databases of casual website contact form submissions.
        </li>
      </ul>

      <h2>4. Information Collected Automatically &amp; Analytics</h2>
      <p>
        When you navigate our website, certain technical information is collected automatically to ensure system performance, security, and usability:
      </p>
      <ul>
        <li>
          <strong>Google Analytics 4 (GA4):</strong> Aggregated, non-personally identifiable statistics regarding pages visited, session duration, device type, browser, and approximate geographic region (country and city level). Uses first-party cookies such as <code>_ga</code>.
        </li>
        <li>
          <strong>Microsoft Clarity:</strong> Behavioral analytics including aggregated click maps, scroll depth, and anonymized session diagnostics. Microsoft Clarity automatically masks sensitive form inputs and keystrokes by default.
        </li>
        <li>
          <strong>Vercel Web Analytics:</strong> Privacy-friendly, aggregated traffic telemetry that does not track individual user identities across websites.
        </li>
        <li>
          <strong>Standard Server Logs:</strong> Internet Protocol (IP) addresses, browser user-agents, and HTTP request timestamps maintained temporarily by our hosting infrastructure for cybersecurity and rate-limiting.
        </li>
      </ul>

      <h2>5. Cookies &amp; Tracking Technologies</h2>
      <p>
        Cookies are small text files stored in your web browser. We use cookies strictly for:
      </p>
      <ul>
        <li>Remembering user interface preferences and session continuity.</li>
        <li>Measuring aggregated visitor metrics via Google Analytics and Microsoft Clarity.</li>
        <li>Preventing automated spam abuse through rate limiting and security headers.</li>
      </ul>
      <p>
        You have the complete right to block or delete cookies at any time through your browser settings (Chrome, Safari, Firefox, Edge). Doing so will not affect your ability to browse our website or contact us.
      </p>

      <h2>6. How We Use Your Information</h2>
      <ul>
        <li>To evaluate your project requirements and provide transparent proposals, architectural advice, and quotes.</li>
        <li>To communicate directly with you regarding your inquiry via telephone, WhatsApp, or email.</li>
        <li>To build, test, and deliver agreed software engineering and growth services.</li>
        <li>To safeguard our digital infrastructure against denial-of-service (DoS) attacks, brute-force attempts, and spam.</li>
        <li>To comply with statutory accounting, taxation, and legal regulations in India.</li>
      </ul>
      <p><strong>We never sell, rent, trade, or monetize your personal information to any third party.</strong></p>

      <h2>7. Third-Party Service Providers</h2>
      <p>
        We work only with vetted infrastructure partners who operate under rigorous security standards:
      </p>
      <ul>
        <li><strong>Hosting &amp; Edge Network:</strong> Vercel Inc. (Cloud hosting and CDN delivery)</li>
        <li><strong>Analytics:</strong> Google LLC (Google Analytics 4) and Microsoft Corporation (Microsoft Clarity)</li>
        <li><strong>Communication:</strong> Meta Platforms, Inc. (WhatsApp Business communication)</li>
      </ul>

      <h2>8. Data Security &amp; Retention</h2>
      <p>
        We employ industry-standard administrative, physical, and technical safeguards. All data in transit across our website is protected using 256-bit Transport Layer Security (TLS/HTTPS).
      </p>
      <p>
        General inquiry correspondence is retained only as long as necessary to fulfill project evaluation or ongoing business communication. You may request immediate deletion of your contact records at any time.
      </p>

      <h2>9. Your Rights Under India&apos;s DPDP Act &amp; International Standards</h2>
      <p>
        Under India&apos;s <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and applicable global standards (such as GDPR where applicable), you have the right to:
      </p>
      <ul>
        <li>Request confirmation of whether we process your personal data.</li>
        <li>Request access to, correction of, or permanent deletion of your contact details.</li>
        <li>Withdraw consent previously granted for marketing or analytics tracking.</li>
        <li>Nominate a representative or file a grievance with our designated contact.</li>
      </ul>
      <p>
        To exercise any of these rights, email our Privacy Grievance Officer at{" "}
        <a href={`mailto:${SITE.privacyEmail}`}>{SITE.privacyEmail}</a> with the subject line &quot;Data Subject Rights Request&quot;. We respond to all verified requests within a reasonable timeframe.
      </p>

      <h2>10. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically to reflect technological changes, legal requirements, or adjustments to our service offerings. The &quot;Last updated&quot; date at the top of this page indicates the effective revision date.
      </p>

      <h2>11. Privacy Grievance Redressal</h2>
      <p>
        If you have any questions, concerns, or grievances regarding this policy or our data handling practices, please contact:
      </p>
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1.5 my-4">
        <p><strong>Grievance Officer:</strong> {SITE.name} Privacy Team</p>
        <p><strong>Physical Address (BUSINESS_ADDRESS_PLACEHOLDER):</strong> {SITE.address}</p>
        <p><strong>Email (PRIVACY_CONTACT_PLACEHOLDER):</strong> <a href={`mailto:${SITE.privacyEmail}`} className="text-primary font-bold">{SITE.privacyEmail}</a></p>
        <p><strong>Telephone (PHONE_NUMBER_PLACEHOLDER):</strong> <a href={`tel:${SITE.phoneRaw}`} className="text-primary font-bold">{SITE.phone}</a></p>
      </div>
    </LegalPage>
  );
}
