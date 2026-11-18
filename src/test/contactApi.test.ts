import { POST } from '../app/api/contact/route';

async function runTests() {
  console.log('=== RUNNING CONTACT API & LEAD DISPATCH TESTS ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // 1. Validation failure: missing email
  {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        message: 'This is a test message with more than 10 characters',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400, 'Rejects payload with missing email (400)');
    assert(data.success === false, 'Returns success: false for invalid input');
  }

  // 2. Validation failure: message too short (<10 chars)
  {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'short',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400, 'Rejects payload with short message (400)');
    assert(data.field === 'message', 'Identifies message as invalid field');
  }

  // 3. Honeypot check: bot traps return silent 200 without dispatch
  {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'bot@spam.com',
        message: 'Buy cheap pills now online at discount prices',
        honeypot: 'http://spam.ru',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 200, 'Honeypot returns 200 to trick bot');
    assert(data.leadId.startsWith('lead_bot_'), 'Honeypot marks lead as bot ignored');
  }

  // 4. Mock destination accepted: verified 200
  {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mock-destination': 'accepted',
      },
      body: JSON.stringify({
        name: 'Genuine Client',
        email: 'client@corp.in',
        phone: '+91 98765 43210',
        service: 'LMS Platform',
        message: 'We require a custom LMS for 500 coaching students.',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 200, 'Accepted destination returns 200');
    assert(data.success === true, 'Success flag is true on acceptance');
    assert(data.deliveryStatus === 'mock_accepted', 'Delivery status is mock_accepted');
    assert(data.leadId.startsWith('sw_'), 'Generates legitimate sw_ lead ID');
  }

  // 5. Mock destination error: returns 502 with fallback
  {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mock-destination': 'error',
      },
      body: JSON.stringify({
        name: 'Genuine Client',
        email: 'client@corp.in',
        message: 'We require a custom LMS for 500 coaching students.',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 502, 'Destination error returns 502');
    assert(data.success === false, 'Returns success: false on destination failure');
    assert(data.fallback?.type === 'whatsapp', 'Provides WhatsApp fallback on failure');
  }

  // 6. Mock destination timeout: returns 504 with fallback
  {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.20',
        'x-mock-destination': 'timeout',
      },
      body: JSON.stringify({
        name: 'Genuine Client',
        email: 'client@corp.in',
        message: 'We require a custom LMS for 500 coaching students.',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 504, 'Destination timeout returns 504');
    assert(data.fallback?.type === 'whatsapp', 'Provides WhatsApp fallback on timeout');
  }

  // 7. Rate limiting: submitting repeatedly triggers 429
  {
    const testIp = '198.51.100.42'; // Unique IP for rate limit test
    let rateLimited = false;
    for (let i = 0; i < 7; i++) {
      const req = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIp,
          'x-mock-destination': 'accepted',
        },
        body: JSON.stringify({
          name: `Client ${i}`,
          email: `client${i}@corp.in`,
          message: 'Repeated submission stress test for rate limiter.',
        }),
      });
      const res = await POST(req);
      if (res.status === 429) {
        rateLimited = true;
        const data = await res.json();
        assert(data.rateLimited === true, 'Response carries rateLimited: true');
        assert(data.fallback?.type === 'whatsapp', 'Rate limit response carries WhatsApp fallback');
        break;
      }
    }
    assert(rateLimited, 'Rejects excessive submissions with 429 Too Many Requests');
  }

  // 8. Unconfigured production webhook: returns 503 with WhatsApp fallback
  {
    const oldEnv = process.env.NODE_ENV;
    const oldUrl = process.env.CONTACT_WEBHOOK_URL;
    delete process.env.CONTACT_WEBHOOK_URL;
    (process.env as any).NODE_ENV = 'production';

    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '203.0.113.19',
      },
      body: JSON.stringify({
        name: 'Client In Prod',
        email: 'prod@client.com',
        message: 'Testing behavior when webhook URL is unconfigured in production.',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 503, 'Unconfigured webhook in production returns 503');
    assert(data.deliveryStatus === 'unconfigured', 'deliveryStatus is unconfigured');
    assert(data.fallback?.type === 'whatsapp', 'Offers WhatsApp fallback when webhook missing');

    (process.env as any).NODE_ENV = oldEnv;
    if (oldUrl) process.env.CONTACT_WEBHOOK_URL = oldUrl;
  }

  console.log(`\n======================================================`);
  console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
