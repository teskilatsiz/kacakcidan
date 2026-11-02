import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { aramaDosyalariniYaz } from './arama-dosyalari.mjs';
import { cssCiktisiniDuzenle } from './css-ciktisi.mjs';
import { gorselVaryantlariniYaz } from './gorsel-varyantlari.mjs';
import { webStilleriniSatirIcineAl } from './web-stilleri.mjs';
import { kaynakHaritalariniDuzenle } from './kaynak-haritalari.mjs';
import { ilanPaylasimGorselleriniYaz } from './ilan-paylasim-gorselleri.mjs';

// Node, kabuktaki değişkenleri korur. Önce daha özel .env dosyaları okunur.
for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const adayAdres =
  process.env.EXPO_PUBLIC_SITE_URL ||
  (process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL) ||
  process.env.URL ||
  'https://kacakcidan.netlify.app';

let siteUrl;
if (adayAdres) {
  const url = new URL(adayAdres);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('EXPO_PUBLIC_SITE_URL http veya https ile başlamalı.');
  }
  siteUrl = url.origin;
}

const onizleme = Boolean(process.env.CONTEXT && process.env.CONTEXT !== 'production');
const yerelAdres = siteUrl && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(new URL(siteUrl).hostname);
const noindex = !siteUrl || onizleme || Boolean(yerelAdres);

const env = {
  ...process.env,
  NODE_ENV: 'production',
  EXPO_PUBLIC_NOINDEX: String(noindex),
};
if (siteUrl) env.EXPO_PUBLIC_SITE_URL = siteUrl;

const require = createRequire(import.meta.url);
await gorselVaryantlariniYaz();
await ilanPaylasimGorselleriniYaz();
const result = spawnSync(
  process.execPath,
  [require.resolve('expo/bin/cli'), 'export', '--platform', 'web', '--source-maps'],
  { env, stdio: 'inherit' },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await cssCiktisiniDuzenle();
await webStilleriniSatirIcineAl();
await kaynakHaritalariniDuzenle();
await aramaDosyalariniYaz({ siteUrl, noindex });
console.log(
  siteUrl
    ? `Web çıktısı hazır: dist (${noindex ? 'arama motorlarına kapalı önizleme' : siteUrl})`
    : 'Web çıktısı hazır: dist (yayın adresi ayarlanmadığından indeksleme kapalı)',
);
