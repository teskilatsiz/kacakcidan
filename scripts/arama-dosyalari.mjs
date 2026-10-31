import { readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const xml = (value) =>
  value.replace(
    /[<>&'\"]/g,
    (karakter) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[karakter],
  );

async function htmlYollari(klasor, kok = klasor) {
  const sonuc = [];
  for (const dosya of await readdir(klasor, { withFileTypes: true })) {
    if (dosya.name.startsWith('.') || dosya.name.startsWith('_')) continue;
    const tamYol = path.join(klasor, dosya.name);
    if (dosya.isDirectory()) {
      sonuc.push(...(await htmlYollari(tamYol, kok)));
    } else if (dosya.name.endsWith('.html')) {
      const adres =
        `/${path.relative(kok, tamYol).split(path.sep).join('/')}`
          .replace(/\/index\.html$/, '/')
          .replace(/\.html$/, '')
          .replace(/\/$/, '') || '/';
      sonuc.push(adres);
    }
  }
  return sonuc;
}

export async function aramaDosyalariniYaz({ siteUrl, noindex, klasor = 'dist' }) {
  if (noindex || !siteUrl) {
    await writeFile(path.join(klasor, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
    await rm(path.join(klasor, 'sitemap.xml'), { force: true });
    return;
  }

  const sayfalar = (await htmlYollari(klasor))
    .filter(
      (adres) =>
        ['/', '/kesfet', '/nasil-calisir'].includes(adres) ||
        (adres.startsWith('/ilan/') && adres !== '/ilan/yerel' && !/[\[\]]/.test(adres)),
    )
    .sort();
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sayfalar.map((adres) => `  <url><loc>${xml(new URL(adres, siteUrl).href)}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  await writeFile(path.join(klasor, 'sitemap.xml'), sitemap);
  await writeFile(
    path.join(klasor, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
}
