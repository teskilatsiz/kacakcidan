import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AnyMap, encodedMap } from '@jridgewell/trace-mapping';

function eskiYoksaymaListesiVar(harita) {
  return (
    Object.hasOwn(harita, 'x_google_ignoreList') ||
    harita.sections?.some(({ map }) => map && eskiYoksaymaListesiVar(map))
  );
}

/** Metro'nun bölümlü haritalarını Lighthouse ve standart kaynak haritası araçları için açar. */
export async function kaynakHaritalariniDuzenle(klasor = 'dist') {
  let degisen = 0;

  async function dosyalariGez(hedef) {
    for (const dosya of await readdir(hedef, { withFileTypes: true })) {
      const yol = path.join(hedef, dosya.name);
      if (dosya.isDirectory()) {
        await dosyalariGez(yol);
      } else if (dosya.isFile() && dosya.name.endsWith('.js.map')) {
        const harita = JSON.parse(await readFile(yol, 'utf8'));
        if (harita.version !== 3 || !Array.isArray(harita.sections)) continue;

        const { sections: _bolumler, ...ustBilgi } = harita;
        // AnyMap satır/sütun başlangıçlarını, kaynak dizinlerini ve bölüm başına
        // yoksayma indekslerini yeniden hesaplar. Üstteki debugId gibi bilgiler korunur.
        const duzHarita = { ...ustBilgi, ...encodedMap(AnyMap(harita)) };
        if (eskiYoksaymaListesiVar(harita)) {
          duzHarita.x_google_ignoreList = [...(duzHarita.ignoreList ?? [])];
        }
        await writeFile(yol, `${JSON.stringify(duzHarita)}\n`);
        degisen += 1;
      }
    }
  }

  await dosyalariGez(klasor);
  return degisen;
}
