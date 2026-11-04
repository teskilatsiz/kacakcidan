import type { Ilan } from './ilanlar.ts';
import { kategoriYapisi } from './kategoriler.ts';
import { aramaIcinDuzelt } from './arama.ts';

export type GezintiKaydi = { id: string; tarih: number };
const gecmisSiniri = 20;
const saklamaSuresi = 30 * 24 * 60 * 60 * 1000;
const karsilastirilmayanKategoriler = new Set(['is-ilanlari', 'hizmetler', 'emlak']);

function urunTuru(ilan: Ilan) {
  const { kategori, altKategori, model } = ilan;
  // Bu dallarda marka/model seçimi birden fazla işlevsel ürün türü içerir.
  // Genel bir aksesuar kaydı, ne tür bir parçayı anlattığı bilinmeden karşılaştırılmaz.
  if (
    (kategori === 'fotograf' && altKategori === 'drone' && model === 'drone-aksesuar') ||
    (kategori === 'oyun' && altKategori === 'sanal-gerceklik' && model === 'vr-aksesuar')
  )
    return undefined;
  if (kategori === 'bilgisayar' && altKategori === 'yazici-tarayici') {
    if (model === '3d-yazici') return `${altKategori}:3d-yazici`;
    if (model === 'dokuman-tarayici') return `${altKategori}:tarayici`;
  }
  if (kategori === 'moda' && altKategori === 'canta') {
    if (model === 'cuzdan' || model === 'omuz-cantasi') return `${altKategori}:${model}`;
    if (['padded-pakr', 'little-america', 'sirt-cantasi'].includes(model ?? ''))
      return `${altKategori}:sirt-cantasi`;
  }
  if (kategori === 'bilgisayar' && altKategori === 'oyun-bilgisayari') {
    return `${altKategori}:${model === 'masaustu-oyun' ? 'masaustu' : 'dizustu'}`;
  }
  // Yenilenmiş telefon da aynı teknik alanlarla bir cep telefonudur.
  return kategori === 'telefon' && altKategori === 'yenilenmis-telefon' ? 'cep-telefonu' : altKategori;
}

function ayniUrunTuru(onceki: Ilan, simdiki: Ilan) {
  if (
    karsilastirilmayanKategoriler.has(simdiki.kategori) ||
    onceki.kategori !== simdiki.kategori ||
    !urunTuru(simdiki) ||
    urunTuru(onceki) !== urunTuru(simdiki)
  )
    return false;
  const yapi = kategoriYapisi(simdiki.kategori, simdiki.altKategori);
  // Katalogda marka ve model alanları bazen parça / ürün türünü taşır.
  // İşlemci ile RAM ayrılır; Intel ile AMD işlemciler karşılaştırılabilir.
  return (
    (yapi.markaGirisi || (!!simdiki.marka && onceki.marka === simdiki.marka)) &&
    (yapi.modelGirisi || (!!simdiki.model && onceki.model === simdiki.model))
  );
}

/** Alakasız ürünler ve işlem türleri aynı tabloda karşılaştırılmaz. */
export function karsilastirilabilir(onceki: Ilan, simdiki: Ilan) {
  return (
    onceki.id !== simdiki.id &&
    onceki.yayinDurumu !== 'kaldirildi' &&
    simdiki.yayinDurumu !== 'kaldirildi' &&
    ayniUrunTuru(onceki, simdiki)
  );
}

export type KarsilastirmaSecenekleri = {
  favoriIdleri?: readonly string[];
  yalnizFavoriler?: boolean;
};

/** Elle seçimde de ürün türü korunur; iki alana aynı ilan eklenemez. */
export function karsilastirmaAdaylari(
  ilanlar: Ilan[],
  baglam: Ilan,
  digerId?: string,
  arama = '',
  { favoriIdleri = [], yalnizFavoriler = false }: KarsilastirmaSecenekleri = {},
) {
  if (!urunTuru(baglam) || karsilastirilmayanKategoriler.has(baglam.kategori)) return [];
  const favoriler = new Set(favoriIdleri);
  const kelimeler = aramaIcinDuzelt(arama).split(' ').filter(Boolean);
  const fiyatUzakligi = (ilan: Ilan) => {
    const fark = fiyatFarki(baglam, ilan);
    return fark === undefined ? Number.MAX_VALUE : Math.abs(fark);
  };
  const ayniMarka = (ilan: Ilan) => Boolean(baglam.marka && ilan.marka === baglam.marka);
  const ayniModel = (ilan: Ilan) => Boolean(ayniMarka(ilan) && baglam.model && ilan.model === baglam.model);
  return [...new Map([baglam, ...ilanlar].map((ilan) => [ilan.id, ilan])).values()]
    .filter((ilan) => {
      if (
        ilan.id === digerId ||
        ilan.yayinDurumu === 'kaldirildi' ||
        (yalnizFavoriler && !favoriler.has(ilan.id)) ||
        (ilan.id !== baglam.id && !karsilastirilabilir(ilan, baglam))
      )
        return false;
      const { marka, model } = kategoriBilgisi(ilan);
      const metin = aramaIcinDuzelt(
        [
          ilan.baslik,
          ilan.konum,
          ilan.numara,
          ilan.marka,
          ilan.model,
          marka,
          model,
          ...Object.entries(ilan.ozellikler ?? {}).flat(),
        ].join(' '),
      );
      return kelimeler.every((kelime) => metin.includes(kelime));
    })
    .sort(
      (a, b) =>
        Number(favoriler.has(b.id)) - Number(favoriler.has(a.id)) ||
        Number(ayniModel(b)) - Number(ayniModel(a)) ||
        Number(ayniMarka(b)) - Number(ayniMarka(a)) ||
        fiyatUzakligi(a) - fiyatUzakligi(b) ||
        a.id.localeCompare(b.id, 'tr'),
    );
}

function kategoriBilgisi(ilan: Ilan) {
  const yapi = kategoriYapisi(ilan.kategori, ilan.altKategori);
  const markaId = ilan.marka ?? '';
  const modeller = Object.hasOwn(yapi.modeller, markaId) ? yapi.modeller[markaId] : undefined;
  return {
    yapi,
    marka: yapi.markalar.find(({ id }) => id === ilan.marka)?.ad ?? ilan.marka,
    model: modeller?.find(({ id }) => id === ilan.model)?.ad ?? ilan.model,
  };
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
  const ilk = kategoriBilgisi(onceki);
  const ikinci = kategoriBilgisi(simdiki);
  const tekilBasliklar: Record<string, string> = {
    Markalar: 'Marka',
    Modeller: 'Model',
    'Ürün grupları': 'Ürün grubu',
    'Ürün türleri': 'Ürün türü',
    'Araç türleri': 'Araç türü',
    Türler: 'Tür',
    'Alt türler': 'Alt tür',
  };
  const markaBasligi = tekilBasliklar[ikinci.yapi.markaBasligi] ?? ikinci.yapi.markaBasligi;
  const modelBasligi = tekilBasliklar[ikinci.yapi.modelBasligi] ?? ikinci.yapi.modelBasligi;
  const anaAlanlar = [
    ...(ilk.marka || ikinci.marka ? [markaBasligi] : []),
    ...(ilk.model || ikinci.model ? [modelBasligi] : []),
    'Durum',
    'Konum',
    'Takas',
  ];
  const alanlar = [
    ...new Set([
      ...anaAlanlar,
      ...Object.keys(onceki.ozellikler ?? {}),
      ...Object.keys(simdiki.ozellikler ?? {}),
    ]),
  ];
  const deger = (ilan: Ilan, ad: string) =>
    ad === markaBasligi
      ? (ilan === onceki ? ilk.marka : ikinci.marka) || 'Belirtilmemiş'
      : ad === modelBasligi
        ? (ilan === onceki ? ilk.model : ikinci.model) || 'Belirtilmemiş'
        : ad === 'Durum'
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
