import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { format, resolveConfig } from 'prettier';
import sharp from 'sharp';
import { ilanlar } from '../src/veri/ilanlar.ts';

const kok = fileURLToPath(new URL('../', import.meta.url));
const publicDizini = path.join(kok, 'public');
const hedefDizin = path.join(publicDizini, 'paylasim');
const manifestYolu = path.join(kok, 'src/veri/ilanPaylasimGorselleri.ts');
const genislik = 1200;
const yukseklik = 630;

async function degistiyseYaz(dosya, icerik) {
  try {
    const onceki = await readFile(dosya);
    if (onceki.equals(Buffer.from(icerik))) return;
  } catch (hata) {
    if (hata.code !== 'ENOENT') throw hata;
  }
  await writeFile(dosya, icerik);
}

async function paylasimGorseli(icerik) {
  // Kapak fotoğrafının tamamı korunur; geniş kartın boşlukları aynı fotoğrafla doldurulur.
  const { data: fotograf, info } = await sharp(icerik)
    .rotate()
    .resize({ width: genislik, height: yukseklik, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });

  const arkaPlan = await sharp(icerik)
    .rotate()
    .resize({ width: genislik, height: yukseklik, fit: 'cover' })
    .blur(28)
    .modulate({ saturation: 0.6 })
    .flatten({ background: '#f2f0ec' })
    .png()
    .toBuffer();

  return sharp(arkaPlan)
    .composite([
      {
        input: fotograf,
        left: Math.round((genislik - info.width) / 2),
        top: Math.round((yukseklik - info.height) / 2),
      },
    ])
    .flatten({ background: '#f2f0ec' })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' })
    .toBuffer();
}

/** Paylaşılan ilan bağlantıları için seçili kapaktan önizleme üretir. */
export async function ilanPaylasimGorselleriniYaz() {
  const kaynaklar = [...new Set(ilanlar.map((ilan) => ilan.gorsel))]
    .filter((kaynak) => kaynak.startsWith('/gorseller/'))
    .sort();
  const gorseller = {};
  const uretilenDosyalar = new Set();
  const islenenKaynaklar = new Map();
  let toplamBoyut = 0;

  await mkdir(hedefDizin, { recursive: true });

  for (const kaynak of kaynaklar) {
    const dosya = path.resolve(publicDizini, kaynak.slice(1));
    const goreliYol = path.relative(publicDizini, dosya);
    if (goreliYol.startsWith('..') || path.isAbsolute(goreliYol)) {
      throw new Error(`Görsel public dizininin dışında: ${kaynak}`);
    }

    const icerik = await readFile(dosya);
    const kaynakOzeti = createHash('sha256').update(icerik).digest('hex');
    let sonuc = islenenKaynaklar.get(kaynakOzeti);

    if (!sonuc) {
      const onizleme = await paylasimGorseli(icerik);
      const ozet = createHash('sha256').update(onizleme).digest('hex').slice(0, 16);
      const dosyaAdi = `ilan-${ozet}.jpg`;
      await degistiyseYaz(path.join(hedefDizin, dosyaAdi), onizleme);
      uretilenDosyalar.add(dosyaAdi);
      toplamBoyut += onizleme.length;
      sonuc = {
        uri: `/paylasim/${dosyaAdi}`,
        width: genislik,
        height: yukseklik,
        type: 'image/jpeg',
      };
      islenenKaynaklar.set(kaynakOzeti, sonuc);
    }

    gorseller[kaynak] = sonuc;
  }

  const manifest = `// Bu dosya scripts/ilan-paylasim-gorselleri.mjs ile üretilir.
export interface IlanPaylasimGorseli {
  readonly uri: string;
  readonly width: number;
  readonly height: number;
  readonly type: 'image/jpeg';
}

export const ilanPaylasimGorselleri: Readonly<Record<string, IlanPaylasimGorseli>> = ${JSON.stringify(gorseller, null, 2)};
`;
  const bicim = await resolveConfig(manifestYolu);
  await degistiyseYaz(manifestYolu, await format(manifest, { ...bicim, filepath: manifestYolu }));

  // Yalnızca bu scriptin oluşturduğu, artık kullanılmayan dosyalar kaldırılır.
  for (const dosya of await readdir(hedefDizin)) {
    if (/^ilan-[a-f0-9]{16}\.jpg$/.test(dosya) && !uretilenDosyalar.has(dosya)) {
      await rm(path.join(hedefDizin, dosya));
    }
  }

  console.log(
    `İlan paylaşım görselleri hazır: ${kaynaklar.length} kapak, ${uretilenDosyalar.size} görsel, ` +
      `${(toplamBoyut / 1024).toFixed(1)} KiB.`,
  );
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await ilanPaylasimGorselleriniYaz();
}
