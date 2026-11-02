import { readdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as htmlAyristir } from 'parse5';
import postcss from 'postcss';

const stilButcesi = 32 * 1024;
const cssOnEki = '/_expo/static/css/';

function yerelCssYolu(href, klasor) {
  if (!href?.startsWith(cssOnEki) || !href.endsWith('.css') || /[%?#\\\0]/.test(href)) {
    return null;
  }
  if (href.split('/').some((parca) => parca === '.' || parca === '..')) return null;
  return path.join(klasor, href.slice(1));
}

function klasorIcinde(yol, klasor) {
  const goreli = path.relative(klasor, yol);
  return goreli !== '' && goreli !== '..' && !goreli.startsWith(`..${path.sep}`) && !path.isAbsolute(goreli);
}

function satirIcineUygun(css) {
  // Kaçış dizileri URL veya @import adını gizleyebilir. Böyle dosyaları olduğu gibi bırakıyoruz.
  if (css.includes('\\')) return false;
  try {
    const kok = postcss.parse(css);
    let uygun = true;
    kok.walkAtRules((kural) => {
      if (/^(import|namespace)$/i.test(kural.name)) uygun = false;
    });
    // CSS dosyasına göre çözülen adresler, HTML içine taşınınca farklı bir kaynağa dönüşebilir.
    // image-set içindeki düz dizgiler de göreli adres içerebilir.
    if (/(?:-webkit-)?image-set\s*\(/i.test(css)) return false;
    for (const eslesme of css.matchAll(/url\s*\(\s*([^)]*)\)/gi)) {
      const deger = eslesme[1].trim().replace(/^(['"])([\s\S]*)\1$/, '$2');
      if (!/^(?:\/|[a-z][a-z\d+.-]*:)/i.test(deger)) uygun = false;
    }
    return uygun;
  } catch {
    return false;
  }
}

function stilMetni(css) {
  // HTML raw-text ayrıştırıcısı CSS dizgilerindeki </style> ifadesinde de etiketi kapatır.
  return css.replace(/<\/style/gi, (eslesme) => `\\3c ${eslesme.slice(1)}`);
}

function stilNitelikleri(dugum, html) {
  const korunacak = [];
  for (const nitelik of dugum.attrs) {
    if (nitelik.name === 'href' || nitelik.name === 'rel') continue;
    if (
      !/^(?:media|type|nonce|id|data-[\w-]+)$/.test(nitelik.name) ||
      (nitelik.name === 'type' && nitelik.value.toLowerCase() !== 'text/css')
    ) {
      return null;
    }
    const yer = dugum.sourceCodeLocation.attrs[nitelik.name];
    korunacak.push(html.slice(yer.startOffset, yer.endOffset));
  }
  return korunacak.length ? ` ${korunacak.join(' ')}` : '';
}

async function htmlStilleriniAl(html, klasor, cssOku) {
  const belge = htmlAyristir(html, { sourceCodeLocationInfo: true });
  const stiller = [];
  const onYuklemeler = [];

  function baglantilariBul(dugum) {
    if (dugum.tagName === 'link' && dugum.sourceCodeLocation) {
      const nitelikler = Object.fromEntries(dugum.attrs.map(({ name, value }) => [name, value]));
      const yol = yerelCssYolu(nitelikler.href, klasor);
      if (yol && nitelikler.rel?.trim().toLowerCase() === 'stylesheet') {
        const niteliklerMetni = stilNitelikleri(dugum, html);
        if (niteliklerMetni !== null) {
          stiller.push({ dugum, yol, href: nitelikler.href, niteliklerMetni });
        }
      } else if (
        yol &&
        nitelikler.rel?.trim().toLowerCase() === 'preload' &&
        nitelikler.as?.toLowerCase() === 'style' &&
        dugum.attrs.every(({ name }) => ['rel', 'href', 'as'].includes(name))
      ) {
        onYuklemeler.push({ dugum, href: nitelikler.href });
      }
    }
    for (const cocuk of dugum.childNodes ?? []) baglantilariBul(cocuk);
  }

  baglantilariBul(belge);
  const adaylar = [];
  let toplam = 0;
  for (const stil of stiller) {
    const css = await cssOku(stil.yol);
    if (css === null) continue;
    const metin = stilMetni(css);
    toplam += Buffer.byteLength(metin);
    if (toplam > stilButcesi) return html;
    adaylar.push({ ...stil, metin });
  }
  if (!adaylar.length) return html;

  const satirIcineAlinanlar = new Set(adaylar.map(({ href }) => href));
  const degisiklikler = adaylar.map(({ dugum, metin, niteliklerMetni }) => ({
    ...dugum.sourceCodeLocation,
    metin: `<style${niteliklerMetni}>${metin}</style>`,
  }));
  for (const { dugum, href } of onYuklemeler) {
    if (satirIcineAlinanlar.has(href)) {
      degisiklikler.push({ ...dugum.sourceCodeLocation, metin: '' });
    }
  }
  // Stil önceliğini korumak için her bağlantı kendi yerinde değiştirilir.
  for (const { startOffset, endOffset, metin } of degisiklikler.sort(
    (a, b) => b.startOffset - a.startOffset,
  )) {
    html = html.slice(0, startOffset) + metin + html.slice(endOffset);
  }
  return html;
}

export async function webStilleriniSatirIcineAl(klasor = 'dist') {
  const kok = await realpath(klasor);
  const cssKoku = path.join(kok, '_expo', 'static', 'css');
  const cssOnbellegi = new Map();

  function cssOku(yol) {
    if (!cssOnbellegi.has(yol)) {
      cssOnbellegi.set(
        yol,
        (async () => {
          try {
            const gercekYol = await realpath(yol);
            if (!klasorIcinde(gercekYol, cssKoku)) return null;
            const css = await readFile(gercekYol, 'utf8');
            return satirIcineUygun(css) ? css : null;
          } catch (hata) {
            if (['ENOENT', 'ENOTDIR'].includes(hata.code)) return null;
            throw hata;
          }
        })(),
      );
    }
    return cssOnbellegi.get(yol);
  }

  async function htmlDosyalariniGez(hedef) {
    for (const dosya of await readdir(hedef, { withFileTypes: true })) {
      const yol = path.join(hedef, dosya.name);
      if (dosya.isDirectory()) {
        await htmlDosyalariniGez(yol);
      } else if (dosya.isFile() && dosya.name.endsWith('.html')) {
        const once = await readFile(yol, 'utf8');
        const sonra = await htmlStilleriniAl(once, kok, cssOku);
        if (once !== sonra) await writeFile(yol, sonra);
      }
    }
  }

  await htmlDosyalariniGez(kok);
}
