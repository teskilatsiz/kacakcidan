import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { format, resolveConfig } from 'prettier';
import { ilanlar } from '../src/veri/ilanlar.ts';

const kok = fileURLToPath(new URL('../', import.meta.url));
const publicDizini = path.join(kok, 'public');
const hedefDizin = path.join(publicDizini, 'gorseller/kart');
const manifestYolu = path.join(kok, 'src/veri/gorselVaryantlari.ts');
const genislikler = [240, 360, 480, 720];

async function degistiyseYaz(dosya, icerik) {
  try {
    const onceki = await readFile(dosya);
    if (onceki.equals(Buffer.from(icerik))) return;
  } catch (hata) {
    if (hata.code !== 'ENOENT') throw hata;
  }
  await writeFile(dosya, icerik);
}

/** Özgün dosyalar galeri için korunur; kartlar ayrı boyutlardan yüklenir. */
export async function gorselVaryantlariniYaz() {
  const kaynaklar = new Set(['/gorseller/kapak.webp', '/gorseller/kategorilerde-kesfet.webp']);
  for (const ilan of ilanlar) {
    for (const kaynak of [ilan.gorsel, ...(ilan.fotografler ?? []), ilan.videoPoster]) {
      if (kaynak?.startsWith('/gorseller/')) kaynaklar.add(kaynak);
    }
  }

  await mkdir(hedefDizin, { recursive: true });
  const gorseller = {};
  const uretilenDosyalar = new Set();
  let kaynakBoyutu = 0;
  let kucukBoyut = 0;
  let buyukBoyut = 0;

  for (const kaynak of [...kaynaklar].sort()) {
    const dosya = path.join(publicDizini, kaynak.slice(1));
    const icerik = await readFile(dosya);
    const metadata = await sharp(icerik).metadata();
    if (!metadata.width || !metadata.height) throw new Error(`Görsel boyutu okunamadı: ${kaynak}`);

    const boyut = {
      width: metadata.width,
      height: metadata.height,
    };
    const varyantlar = [];
    const boyutlar = [...new Set(genislikler.map((genislik) => Math.min(genislik, boyut.width)))];
    const ad = path.basename(kaynak, path.extname(kaynak));

    for (const genislik of boyutlar) {
      const { data, info } = await sharp(icerik)
        .rotate()
        .resize({ width: genislik, withoutEnlargement: true })
        .webp({ quality: 75, effort: 6, smartSubsample: true })
        .toBuffer({ resolveWithObject: true });
      const ozet = createHash('sha256').update(data).digest('hex').slice(0, 12);
      const dosyaAdi = `${ad}-${ozet}-${info.width}.webp`;
      await degistiyseYaz(path.join(hedefDizin, dosyaAdi), data);
      uretilenDosyalar.add(dosyaAdi);
      varyantlar.push({
        uri: `/gorseller/kart/${dosyaAdi}`,
        width: info.width,
        height: info.height,
      });
      if (genislik === boyutlar[0]) kucukBoyut += info.size;
      if (genislik === boyutlar.at(-1)) buyukBoyut += info.size;
    }

    kaynakBoyutu += icerik.length;
    gorseller[kaynak] = { ...boyut, variants: varyantlar };
  }

  const manifest = `// Bu dosya scripts/gorsel-varyantlari.mjs ile üretilir.
export interface GorselVaryanti {
  readonly uri: string;
  readonly width: number;
  readonly height: number;
}

export interface GorselBoyutlari {
  readonly width: number;
  readonly height: number;
  readonly variants: readonly GorselVaryanti[];
}

export const gorselVaryantlari: Readonly<Record<string, GorselBoyutlari>> = ${JSON.stringify(gorseller, null, 2)};
`;
  const bicim = await resolveConfig(manifestYolu);
  await degistiyseYaz(manifestYolu, await format(manifest, { ...bicim, filepath: manifestYolu }));

  // Kaynağı değişen dosyaların önceki içerik özetli kopyaları tutulmaz.
  for (const dosya of await readdir(hedefDizin)) {
    if (/^[a-z0-9-]+-[a-f0-9]{12}-\d+\.webp$/.test(dosya) && !uretilenDosyalar.has(dosya)) {
      await rm(path.join(hedefDizin, dosya));
    }
  }

  const kib = (boyut) => `${(boyut / 1024).toFixed(1)} KiB`;
  console.log(
    `Görseller hazır: ${kaynaklar.size} kaynak, ${uretilenDosyalar.size} varyant. ` +
      `Özgün: ${kib(kaynakBoyutu)}, 240 px: ${kib(kucukBoyut)}, en büyük varyant: ${kib(buyukBoyut)}.`,
  );
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await gorselVaryantlariniYaz();
}
