import {
  generateSitemapIndexXml,
  getCorePageUrls,
  getServicePageUrls,
  getCityPageUrls,
  getAllSubCityUrls,
  getSitemapStats,
} from '../lib/sitemapUtils';
import { evaluateUrlPolicy } from '../lib/seo/indexPolicy';
import { SERVICES, CITIES, SUB_CITIES, citySlug } from '../data/site';

console.log('=== SITEMAP STATS ===');
console.log(getSitemapStats());

console.log('\n=== CORE PAGES ===');
getCorePageUrls().forEach((u) => console.log('CORE:', u.loc, u.lastmod));

console.log('\n=== SAMPLE CITY PAGES ===');
getCityPageUrls().slice(0, 5).forEach((u) => console.log('CITY:', u.loc));

console.log('\n=== SAMPLE SUBCITY PAGES ===');
getAllSubCityUrls().slice(0, 5).forEach((u) => console.log('SUBCITY:', u.loc));

console.log('\n=== TOTAL SUBCITIES IN DATA ===');
let totalSubCities = 0;
for (const c of CITIES) {
  const subs = SUB_CITIES[c] || [];
  totalSubCities += subs.length;
}
console.log('Total Cities:', CITIES.length);
console.log('Total Subcities registered:', totalSubCities);
console.log('Service × Locality theoretical permutations:', SERVICES.length * totalSubCities);
console.log('Service × City theoretical permutations:', SERVICES.length * CITIES.length);
