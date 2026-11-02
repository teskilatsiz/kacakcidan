import { ilanlar } from './ilanlar.ts';
import { bosSecim, kesifSeciminiTamamla, type KesifSecimi } from './kategoriler.ts';

const alanlar = ['kategori', 'altKategori', 'marka', 'model'] as const;
export type KategoriSayfasi = { yol: string[]; secim: KesifSecimi; ilanSayisi: number };

function seciminYolu(secim: KesifSecimi) {
  const yol: string[] = [];
  for (const alan of alanlar) {
    if (!secim[alan]) break;
    yol.push(secim[alan]);
  }
  return yol;
}

/** Şehir ve filtre kombinasyonları yerine yalnız yayındaki ilanların kategori zincirleri üretilir. */
export function kategoriSayfalariniOlustur(): KategoriSayfasi[] {
  const dallar = new Map<string, KategoriSayfasi>();
  for (const ilan of ilanlar) {
    if (ilan.yayinDurumu === 'kaldirildi') continue;
    const secim = { ...bosSecim };
    for (const alan of alanlar) {
      const deger = ilan[alan];
      if (!deger) break;
      secim[alan] = deger;
      const yol = seciminYolu(secim);
      const anahtar = yol.join('/');
      const dal = dallar.get(anahtar);
      if (dal) dal.ilanSayisi += 1;
      else dallar.set(anahtar, { yol, secim: { ...secim }, ilanSayisi: 1 });
    }
  }
  // Tek ilanı olan alt dallar arama ekranından açılır; aynı sonuçlu yüzlerce sayfa oluşturulmaz.
  return [...dallar.values()]
    .filter(({ yol, ilanSayisi }) => yol.length === 1 || ilanSayisi >= 2)
    .sort((a, b) => a.yol.join('/').localeCompare(b.yol.join('/'), 'en'));
}

export const kategoriSayfalari = kategoriSayfalariniOlustur();
const sayfaHaritasi = new Map(kategoriSayfalari.map((sayfa) => [sayfa.yol.join('/'), sayfa]));

export function kategoriYolundanSayfa(yol?: string | string[]) {
  const parcalar = typeof yol === 'string' ? yol.split('/') : yol;
  if (!parcalar?.length || parcalar.length > alanlar.length) return undefined;
  return sayfaHaritasi.get(parcalar.join('/'));
}

/** Kalıcı kategori adresinin zinciri sorgu parametreleriyle başka bir kategoriye çevrilmez. */
export function kategoriSeciminiOku(
  parametreler: Record<string, string | string[] | undefined>,
  hazir = true,
): KesifSecimi {
  const kalici = kategoriYolundanSayfa(parametreler.yol);
  if (kalici) return { ...kalici.secim };
  const secim = { ...bosSecim };
  if (hazir)
    for (const alan of alanlar) if (typeof parametreler[alan] === 'string') secim[alan] = parametreler[alan];
  return secim;
}

/** Kalıcı sayfası olmayan boş veya tek sonuçlu seçimler arama ekranında çalışmaya devam eder. */
export function kategoriAdresi(
  secim: Partial<KesifSecimi> = {},
  parametreler: Record<string, string | undefined> = {},
) {
  const tamamlanan = kesifSeciminiTamamla(ilanlar, { ...bosSecim, ...secim });
  const sayfa = sayfaHaritasi.get(seciminYolu(tamamlanan).join('/'));
  const kalici = sayfa && alanlar.every((alan) => sayfa.secim[alan] === tamamlanan[alan]);
  const sorgu = new URLSearchParams();
  if (!kalici) for (const alan of alanlar) if (tamamlanan[alan]) sorgu.set(alan, tamamlanan[alan]);
  for (const ad of ['q', 'firsat', 'takas', 'ozellikler', 'filtre', 'siralama'])
    if (parametreler[ad]) sorgu.set(ad, parametreler[ad]);
  const yol = kalici ? `/kategori/${sayfa.yol.join('/')}` : '/kesfet';
  return `${yol}${sorgu.size ? `?${sorgu}` : ''}`;
}
