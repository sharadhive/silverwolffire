import { SERVICES, CITIES, SUB_CITIES, SITE, citySlug } from '../data/site';
import { generateServiceMetadata } from '../lib/serviceMetadata';
import { evaluateUrlPolicy } from '../lib/seo/indexPolicy';
import { getAreaData } from '../lib/locationData';
import { safeJsonLd } from '../lib/jsonLd';

async function runCrawlChecks() {
  console.log('=== RUNNING COMPREHENSIVE CRAWLABILITY & RENDER CHECKS ===\n');
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

  // 1. Verify all 14 Service Pages Metadata & Distinctness
  console.log('Checking all 14 Service Pages:');
  const seenTitles = new Set<string>();
  const seenDescriptions = new Set<string>();

  for (const service of SERVICES) {
    const meta = generateServiceMetadata(service.slug);
    const title = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.absolute || '';
    const desc = String(meta.description || '');

    assert(title.length > 0 && title.length <= 70, `${service.slug} title length is valid (${title.length} chars: "${title}")`);
    assert(desc.length > 0 && desc.length <= 165, `${service.slug} description length is valid (${desc.length} chars)`);
    assert(!seenTitles.has(title), `${service.slug} title is unique: "${title}"`);
    assert(!seenDescriptions.has(desc), `${service.slug} description is unique`);
    assert(meta.alternates?.canonical === `https://www.silverwolftechnologies.in/services/${service.slug}`, `${service.slug} canonical matches exactly`);
    assert(!/Best|Top-Rated/.test(title), `${service.slug} title avoids unverified superlatives`);

    seenTitles.add(title);
    seenDescriptions.add(desc);
  }

  // 2. Verify Product Platforms (/products/lms, /products/crm, /products/hr-management)
  console.log('\nChecking Product Platform URLs:');
  const productSlugs = ['lms', 'crm', 'hr-management'];
  for (const slug of productSlugs) {
    const policy = evaluateUrlPolicy(`/products/${slug}`);
    assert(policy.decision === 'INDEX', `/products/${slug} has INDEX policy`);
    assert(policy.isSitemapEligible === true, `/products/${slug} is in XML sitemap`);
    assert(policy.canonicalPath === `/products/${slug}`, `/products/${slug} canonical is accurate`);
  }

  // 3. Verify Representative City Pages (Mumbai, Delhi, Bangalore)
  console.log('\nChecking Representative City Pages:');
  for (const city of ['mumbai', 'delhi', 'bangalore']) {
    const meta = generateServiceMetadata('website-development', city);
    const title = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.absolute || '';
    assert(!/Best|Top-Rated/.test(title), `${city} title avoids unverified superlatives: "${title}"`);
    assert(meta.alternates?.canonical === `https://www.silverwolftechnologies.in/services/website-development/${city}`, `${city} canonical is accurate`);
  }

  // 4. Verify Creative Services Do Not Mention 'Website' in Fallback Locality Intros
  console.log('\nChecking Fallback Locality Content Generation:');
  const creativeArea = getAreaData('delhi', 'saket', 'Video Editing');
  assert(creativeArea.intro.length > 50, 'Generated intro for Video Editing');
  assert(!/WordPress|slow, outdated website|React components/i.test(creativeArea.intro), 'Video Editing fallback intro does not mention WordPress or slow website');
  assert(!/Best|Top-Rated/.test(creativeArea.metaTitle || ''), 'Fallback metaTitle avoids unverified superlatives');

  const webArea = getAreaData('delhi', 'saket', 'Website Development');
  assert(webArea.intro.length > 50, 'Generated intro for Website Development');

  // 5. Verify Curated Locality (Andheri, Mumbai for Website Development)
  console.log('\nChecking Curated Locality (Andheri, Mumbai):');
  const curatedArea = getAreaData('mumbai', 'andheri', 'Website Development');
  assert(curatedArea.pinCode === '400053', 'Andheri carries accurate pin code (400053)');
  assert(curatedArea.landmarks.length > 0, 'Andheri carries authentic landmarks');
  assert(curatedArea.intro.includes('SEEPZ') || curatedArea.intro.includes('MIDC') || curatedArea.intro.includes('Lokhandwala'), 'Andheri carries authentic local commercial zones');

  // 6. Verify JSON-LD Schema Sanitization
  console.log('\nChecking JSON-LD Schema Sanitization:');
  const sampleXssPayload = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Silver Wolf </script><script>alert("xss")</script>',
  };
  const serialized = safeJsonLd(sampleXssPayload);
  assert(!serialized.includes('<'), 'safeJsonLd eliminates all raw < brackets');
  assert(serialized.includes('\\u003c'), 'safeJsonLd uses Unicode escape for < brackets');

  console.log(`\n======================================================`);
  console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runCrawlChecks().catch((e) => {
  console.error(e);
  process.exit(1);
});
