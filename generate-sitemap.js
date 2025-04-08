import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = 'https://fayna.team';

const pages = [
  '/',
  '/matches',
  '/team',
  '/stats',
  '/about',
  // додай тут нові сторінки за потреби
];

const urls = pages.map((page) => {
  return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

const outputPath = join(__dirname, 'public', 'sitemap.xml');
await writeFile(outputPath, sitemap);

console.log('✅ sitemap.xml generated');
