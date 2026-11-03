import type { Ilan } from './ilanlar.ts';
import { kategoriYapisi } from './kategoriler.ts';
import { aramaIcinDuzelt } from './arama.ts';

export type GezintiKaydi = { id: string; tarih: number };
const gecmisSiniri = 20;
const saklamaSuresi = 30 * 24 * 60 * 60 * 1000;

/** Alakasız ürünler ve işlem türleri aynı tabloda karşılaştırılmaz. */
export function karsilastirilabilir(onceki: Ilan, simdiki: Ilan) {
  const yapi = kategoriYapisi(simdiki.kategori, simdiki.altKategori);
  return (
    onceki.id !== simdiki.id &&
    onceki.yayinDurumu !== 'kaldirildi' &&
    simdiki.yayinDurumu !== 'kaldirildi' &&
    !['is-ilanlari', 'hizmetler', 'emlak'].includes(simdiki.kategori) &&
    onceki.kategori === simdiki.kategori &&
    !!simdiki.altKategori &&
    onceki.altKategori === simdiki.altKategori &&
    (yapi.markaGirisi || (!!simdiki.marka && onceki.marka === simdiki.marka)) &&
    (yapi.modelGirisi || (!!simdiki.model && onceki.model === simdiki.model))
  );
}

/** Elle seçimde de ürün türü korunur; iki alana aynı ilan eklenemez. */
export function karsilastirmaAdaylari(ilanlar: Ilan[], baglam: Ilan, digerId?: string, arama = '') {
  if (!baglam.altKategori || ['is-ilanlari', 'hizmetler', 'emlak'].includes(baglam.kategori)) return [];
  const kelimeler = aramaIcinDuzelt(arama).split(' ').filter(Boolean);
  return [...new Map([baglam, ...ilanlar].map((ilan) => [ilan.id, ilan])).values()].filter((ilan) => {
    if (
      ilan.id === digerId ||
      ilan.yayinDurumu === 'kaldirildi' ||
      (ilan.id !== baglam.id && !karsilastirilabilir(ilan, baglam))
    )
      return false;
    const metin = aramaIcinDuzelt(`${ilan.baslik} ${ilan.konum} ${ilan.numara ?? ''}`);
    return kelimeler.every((kelime) => metin.includes(kelime));
  });
}

export function gezintiKaydiniOku(ham: string | null, simdi = Date.now()): GezintiKaydi[] {
  try {
    const kayit: unknown = JSON.parse(ham ?? 'null');
    if (!Array.isArray(kayit)) return [];
    const gorulen = new Set<string>();
    return kayit
      .filter((oge): oge is GezintiKaydi => {
        if (
          !oge ||
          typeof oge !== 'object' ||
          typeof oge.id !== 'string' ||
          !oge.id ||
          oge.id.length > 160 ||
          typeof oge.tarih !== 'number' ||
          !Number.isFinite(oge.tarih) ||
          oge.tarih > simdi ||
          oge.tarih < simdi - saklamaSuresi ||
          gorulen.has(oge.id)
        )
          return false;
        gorulen.add(oge.id);
        return true;
      })
      .sort((a, b) => b.tarih - a.tarih)
      .slice(0, gecmisSiniri);
  } catch {
    return [];
  }
}

export function gezintiyeEkle(kayitlar: GezintiKaydi[], id: string, tarih = Date.now()) {
  return [{ id, tarih }, ...kayitlar.filter((kayit) => kayit.id !== id)].slice(0, gecmisSiniri);
}

export function oncekiIlaniBul(kayitlar: GezintiKaydi[], ilan: Ilan, ilanlar: Ilan[]) {
  const katalog = new Map(ilanlar.map((kayit) => [kayit.id, kayit]));
  for (const kayit of kayitlar) {
    const onceki = katalog.get(kayit.id);
    if (onceki && karsilastirilabilir(onceki, ilan)) return onceki;
  }
  return undefined;
}

export type KarsilastirmaSatiri = { ad: string; onceki: string; simdiki: string; farkli: boolean };
export function karsilastirmaSatirlari(onceki: Ilan, simdiki: Ilan): KarsilastirmaSatiri[] {
  const anaAlanlar = ['Durum', 'Konum', 'Takas'];
  const alanlar = [
    ...new Set([
      ...anaAlanlar,
      ...Object.keys(onceki.ozellikler ?? {}),
      ...Object.keys(simdiki.ozellikler ?? {}),
    ]),
  ];
  const deger = (ilan: Ilan, ad: string) =>
    ad === 'Durum'
      ? ilan.durum
      : ad === 'Konum'
        ? ilan.konum
        : ad === 'Takas'
          ? ilan.takas
            ? 'Evet'
            : 'Hayır'
          : ilan.ozellikler?.[ad] || 'Belirtilmemiş';
  return alanlar.map((ad) => ({
    ad,
    onceki: deger(onceki, ad),
    simdiki: deger(simdiki, ad),
    farkli: deger(onceki, ad) !== deger(simdiki, ad),
  }));
}

export function fiyatFarki(onceki: Ilan, simdiki: Ilan) {
  if (
    onceki.fiyatGorusulur ||
    simdiki.fiyatGorusulur ||
    !Number.isFinite(onceki.fiyat) ||
    !Number.isFinite(simdiki.fiyat) ||
    onceki.fiyat <= 0 ||
    simdiki.fiyat <= 0
  )
    return undefined;
  return simdiki.fiyat - onceki.fiyat;
}
