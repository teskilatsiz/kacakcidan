import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as htmlAyristir } from 'parse5';
import postcss from 'postcss';

export function cssDuzelt(css) {
  const kok = postcss.parse(css);

  // Expo bileşenlerinden gelen native köşe tercihini web çıktısına taşımıyoruz.
  // Yaygın destekli border-radius, yuvarlak köşeleri sağlamaya devam eder.
  kok.walkDecls('border-curve', (ozellik) => ozellik.remove());

  kok.walkRules((kural) => {
    const ozellikler = kural.nodes.filter((dugum) => dugum.type === 'decl');
    const onekli = ozellikler.filter((ozellik) => /^-(webkit|moz|ms)-appearance$/.test(ozellik.prop));
    if (onekli.length && !ozellikler.some((ozellik) => ozellik.prop === 'appearance')) {
      const kaynak = onekli.findLast((ozellik) => ozellik.prop === '-webkit-appearance') ?? onekli.at(-1);
      kural.insertAfter(onekli.at(-1), kaynak.clone({ prop: 'appearance' }));
    }

    if (kural.nodes.some((dugum) => dugum.type !== 'comment')) return;
    const grup = /^\[stylesheet-group=["']([\d.]+)["']\]$/.exec(kural.selector);
    if (grup) {
      // RNW hydration, stil sırasını bu işaretçilerden okur; silinmemeliler.
      kural.append({ prop: '--rnw-group', value: grup[1], raws: { before: '', between: ':' } });
    } else {
      kural.remove();
    }
  });

  return kok.toString();
}

export function htmlStilleriniDuzelt(html) {
  const belge = htmlAyristir(html, { sourceCodeLocationInfo: true });
  const degisiklikler = [];

  function stilleriBul(dugum) {
    const yer = dugum.sourceCodeLocation;
    if (dugum.tagName === 'style' && yer?.startTag && yer.endTag) {
      const bas = yer.startTag.endOffset;
      const son = yer.endTag.startOffset;
      const css = html.slice(bas, son);
      const duzeltilen = cssDuzelt(css);
      if (duzeltilen !== css) degisiklikler.push({ bas, son, css: duzeltilen });
    }
    for (const cocuk of dugum.childNodes ?? []) stilleriBul(cocuk);
  }

  stilleriBul(belge);
  // Konumlar özgün HTML'e ait. Sondan değiştirerek diğer baytları koruyoruz.
  for (const { bas, son, css } of degisiklikler.sort((a, b) => b.bas - a.bas)) {
    html = html.slice(0, bas) + css + html.slice(son);
  }
  return html;
}

export async function cssCiktisiniDuzenle(klasor = 'dist') {
  for (const dosya of await readdir(klasor, { withFileTypes: true })) {
    const yol = path.join(klasor, dosya.name);
    if (dosya.isDirectory()) {
      await cssCiktisiniDuzenle(yol);
    } else if (/\.(css|html)$/.test(dosya.name)) {
      const once = await readFile(yol, 'utf8');
      const sonra = dosya.name.endsWith('.html') ? htmlStilleriniDuzelt(once) : cssDuzelt(once);
      if (once !== sonra) await writeFile(yol, sonra);
    }
  }
}
