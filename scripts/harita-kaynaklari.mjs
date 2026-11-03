import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const proje = fileURLToPath(new URL('../', import.meta.url));

/** Haritanın kodu uygulama paketine girmez; iframe aynı sunucudaki dosyaları kullanır. */
export async function haritaKaynaklariniHazirla() {
  const paket = path.dirname(require.resolve('leaflet/package.json'));
  const { version } = JSON.parse(await readFile(path.join(paket, 'package.json'), 'utf8'));
  const hedef = path.join(proje, 'public', 'harita-kaynaklari', `leaflet-${version}`);
  await mkdir(hedef, { recursive: true });
  for (const ad of ['leaflet.js', 'leaflet.css']) {
    await cp(path.join(paket, 'dist', ad), path.join(hedef, ad));
  }
  await cp(path.join(paket, 'dist', 'images'), path.join(hedef, 'images'), { recursive: true });
  await cp(path.join(paket, 'LICENSE'), path.join(hedef, 'LICENSE'));

  // Kaynaklar haritaya gömülür; geliştirici araçları 78 ayrı kaynak isteği yapmaz.
  const harita = JSON.parse(await readFile(path.join(paket, 'dist', 'leaflet.js.map'), 'utf8'));
  harita.sourcesContent = await Promise.all(
    harita.sources.map((ad) => readFile(path.resolve(paket, 'dist', ad), 'utf8')),
  );
  await writeFile(path.join(hedef, 'leaflet.js.map'), JSON.stringify(harita));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await haritaKaynaklariniHazirla();
}
