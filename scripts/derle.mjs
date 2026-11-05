import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { aramaDosyalariniYaz } from './arama-dosyalari.mjs';
import { cssCiktisiniDuzenle } from './css-ciktisi.mjs';
import { gorselVaryantlariniYaz } from './gorsel-varyantlari.mjs';
import { webStilleriniSatirIcineAl } from './web-stilleri.mjs';
import { kaynakHaritalariniDuzenle } from './kaynak-haritalari.mjs';
import { ilanPaylasimGorselleriniYaz } from './ilan-paylasim-gorselleri.mjs';
import { guvenlikBasliklariniYaz } from './guvenlik-basliklari.mjs';
import { haritaKaynaklariniHazirla } from './harita-kaynaklari.mjs';

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

const env = {
  ...process.env,
  NODE_ENV: 'production',
  // Web açılışında kullanılmayan kütüphane dışa aktarımları pakete girmez.
  EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH: '1',
  EXPO_UNSTABLE_TREE_SHAKING: '1',
};
if (siteUrl) env.EXPO_PUBLIC_SITE_URL = siteUrl;

const require = createRequire(import.meta.url);
await haritaKaynaklariniHazirla();
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
await aramaDosyalariniYaz();
await guvenlikBasliklariniYaz();
console.log('Web çıktısı hazır: dist (arama motorlarında listelenmez)');
