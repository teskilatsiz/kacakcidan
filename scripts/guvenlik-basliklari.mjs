import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

const ozet = (metin) => `sha256-${createHash('sha256').update(metin).digest('base64')}`;

/** Statik betiklerin özetleri her derlemede gerçek HTML ve JavaScript'ten hesaplanır. */
export async function guvenlikBasliklariniYaz(klasor = 'dist') {
  const sayfalar = [];
  async function gez(hedef) {
    for (const dosya of await readdir(hedef, { withFileTypes: true })) {
      const yol = path.join(hedef, dosya.name);
      if (dosya.isDirectory()) await gez(yol);
      else if (dosya.name.endsWith('.html') && dosya.name !== 'harita.html') {
        let html = await readFile(yol, 'utf8');
        const izinler = new Set();
        const belge = parse(html, { sourceCodeLocationInfo: true });
        const betikler = [];
        function bul(dugum) {
          if (
            dugum.tagName === 'script' ||
            (dugum.tagName === 'link' &&
              dugum.attrs.some(({ name, value }) => name === 'as' && value === 'script'))
          )
            betikler.push(dugum);
          for (const cocuk of dugum.childNodes ?? []) bul(cocuk);
        }
        bul(belge);
        const degisiklikler = [];
        for (const betik of betikler) {
          const attr = Object.fromEntries(betik.attrs.map(({ name, value }) => [name, value]));
          const kaynak = attr.src ?? attr.href;
          if (kaynak) {
            const dosyaYolu = kaynak.split('?')[0];
            if (!/^\/_expo\/static\/js\/web\/[\w+\[\].-]+-[a-f0-9]{32}\.js$/.test(dosyaYolu)) {
              throw new Error(`Beklenmeyen betik adresi: ${kaynak}`);
            }
            const icerik = await readFile(path.join(klasor, dosyaYolu.slice(1)));
            const hash = ozet(icerik);
            izinler.add(hash);
            if (attr.integrity && attr.integrity !== hash) throw new Error(`Betik özeti değişti: ${kaynak}`);
            if (!attr.integrity) {
              const yer = betik.sourceCodeLocation.startTag;
              degisiklikler.push({
                baslangic: yer.endOffset - 1,
                metin: ` integrity="${hash}" crossorigin="anonymous"`,
              });
            }
            // Expo runtime dosyasının adresi bazı derlemelerde sabit kalırken
            // içeriği değişebilir. Eski HTML veya tarayıcı önbelleği yeni SRI ile
            // çakışmasın diye yalnız runtime URL'sini içerik özetiyle sürümle.
            if (dosyaYolu.startsWith('/_expo/static/js/web/__expo-metro-runtime-')) {
              const surumluKaynak = `${dosyaYolu}?v=${createHash('sha256').update(icerik).digest('hex')}`;
              if (kaynak !== surumluKaynak) {
                const ad = attr.src ? 'src' : 'href';
                const yer = betik.sourceCodeLocation.attrs[ad];
                degisiklikler.push({
                  baslangic: yer.startOffset,
                  bitis: yer.endOffset,
                  metin: `${ad}="${surumluKaynak}"`,
                });
              }
            }
          } else if (attr.type !== 'application/ld+json') {
            const metin = betik.childNodes.map((cocuk) => cocuk.value ?? '').join('');
            if (metin) izinler.add(ozet(metin));
          }
        }
        for (const degisiklik of degisiklikler.sort((a, b) => b.baslangic - a.baslangic)) {
          html =
            html.slice(0, degisiklik.baslangic) +
            degisiklik.metin +
            html.slice(degisiklik.bitis ?? degisiklik.baslangic);
        }
        await writeFile(yol, html);
        sayfalar.push({ yol: `/${path.relative(klasor, yol).split(path.sep).join('/')}`, izinler });
      }
    }
  }
  await gez(klasor);
  const csp = (izinler) =>
    [
      "default-src 'self'",
      `script-src 'self' 'strict-dynamic' ${[...izinler]
        .sort()
        .map((hash) => `'${hash}'`)
        .join(' ')}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "media-src 'self' blob:",
      "connect-src 'self'",
      "frame-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "require-trusted-types-for 'script'",
      'trusted-types default',
    ].join('; ');
  // Harita bağımsız belgedir. Leaflet DOM üretir; ana uygulamanın Trusted Types
  // istisnası genişletilmeden kendine ait dar kaynak listesiyle çalışır.
  const haritaCsp = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://tile.openstreetmap.org",
    "connect-src 'self' https://tile.openstreetmap.org",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'self'",
  ].join('; ');
  const kurallar = ['/*\n  X-Robots-Tag: noindex, nofollow'];
  for (const sayfa of sayfalar) {
    const adresler = new Set([sayfa.yol, sayfa.yol === '/index.html' ? '/' : sayfa.yol.slice(0, -5)]);
    for (const adres of adresler) {
      kurallar.push(`${adres}\n  Content-Security-Policy: ${csp(sayfa.izinler)}\n  X-Frame-Options: DENY`);
    }
  }
  for (const adres of ['/harita.html', '/harita']) {
    kurallar.push(`${adres}\n  Content-Security-Policy: ${haritaCsp}\n  X-Frame-Options: SAMEORIGIN`);
  }
  await writeFile(path.join(klasor, '_headers'), `${kurallar.join('\n')}\n`);
}
