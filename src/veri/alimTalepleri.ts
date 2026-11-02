import { kategoriler, type Ilan, type Kategori } from './ilanlar.ts';
import { kategoriYapisi } from './kategoriler.ts';
import { iller, ilceSecenekleri, konumuAyir, konumuBirlestir, konumEslesir } from './konumlar.ts';
import { urunKategorisiMi } from './anaKategoriler.ts';

export type AlimTalebiGirdisi = {
  baslik: string;
  kategori: Kategori | '';
  altKategori: string;
  marka: string;
  model: string;
  butce: string;
  il: string;
  ilce: string;
  aciklama: string;
};

export type AlimTalebiYaniti = {
  id: string;
  hesapId: string;
  ad: string;
  ilanId: string;
  mesaj: string;
  tarih: string;
};

export type AlimTalebi = {
  id: string;
  hesapId: string;
  ad: string;
  baslik: string;
  kategori: Kategori;
  altKategori: string;
  marka: string;
  model: string;
  butce: number;
  konum: string;
  aciklama: string;
  tarih: string;
  durum: 'acik' | 'kapali';
  yanitlar: AlimTalebiYaniti[];
};

export const bosAlimTalebi: AlimTalebiGirdisi = {
  baslik: '',
  kategori: '',
  altKategori: '',
  marka: '',
  model: '',
  butce: '',
  il: '',
  ilce: '',
  aciklama: '',
};

export const alimKategorileri = kategoriler.filter((kategori) => urunKategorisiMi(kategori.id));

export function butceyiOku(deger: string): number {
  const metin = deger.trim();
  if (!/^\d+(?:[,.]\d{1,2})?$/.test(metin)) return NaN;
  return Number(metin.replace(',', '.'));
}

export function alimTalebiHatalari(girdi: AlimTalebiGirdisi): Record<string, string> {
  const hatalar: Record<string, string> = {};
  if (girdi.baslik.trim().length < 10 || girdi.baslik.trim().length > 100)
    hatalar.baslik = 'Aradığın ürünü 10–100 karakter arasında belirt.';
  if (!alimKategorileri.some((kategori) => kategori.id === girdi.kategori))
    hatalar.kategori = 'Bir ürün kategorisi seç.';
  else {
    const yapi = kategoriYapisi(girdi.kategori as Kategori, girdi.altKategori);
    if (!yapi.altKategoriler.some((alt) => alt.id === girdi.altKategori))
      hatalar.altKategori = 'Aradığın ürünün alt kategorisini seç.';
    if (girdi.marka && !yapi.markalar.some((marka) => marka.id === girdi.marka))
      hatalar.marka = 'Bu alt kategoriden bir seçenek seç.';
    if (girdi.model && !yapi.modeller[girdi.marka]?.some((model) => model.id === girdi.model))
      hatalar.model = 'Seçtiğin markaya uygun bir model seç.';
  }
  const butce = butceyiOku(girdi.butce);
  if (!Number.isFinite(butce) || butce < 0 || butce > 1_000_000_000)
    hatalar.butce = 'Bütçeni 0–1.000.000.000 TL arasında yaz. Örn. 15000 veya 15000,50.';
  if (girdi.il && !iller.some((il) => il.id === girdi.il)) hatalar.il = 'Listeden bir il seç.';
  if (girdi.ilce && !ilceSecenekleri(girdi.il).some((ilce) => ilce.id === girdi.ilce))
    hatalar.ilce = 'Seçtiğin ile bağlı bir ilçe seç.';
  if (girdi.aciklama.trim().length < 20 || girdi.aciklama.trim().length > 1500)
    hatalar.aciklama = 'Üründe aradığın özellikleri 20–1.500 karakter arasında yaz.';
  return hatalar;
}

export function talebeUygunIlanMi(talep: AlimTalebi, ilan: Ilan): boolean {
  return (
    talep.durum === 'acik' &&
    ilan.yayinDurumu !== 'kaldirildi' &&
    ilan.kategori === talep.kategori &&
    ilan.altKategori === talep.altKategori &&
    (!talep.marka || ilan.marka === talep.marka) &&
    (!talep.model || ilan.model === talep.model) &&
    konumEslesir(ilan.konum, talep.konum) &&
    !ilan.fiyatGorusulur &&
    Number.isFinite(ilan.fiyat) &&
    ilan.fiyat >= 0 &&
    ilan.fiyat <= talep.butce
  );
}

export function alimTalebiOlustur(
  girdi: AlimTalebiGirdisi,
  hesap: { id: string; ad: string } | null,
  kimlik: string,
  tarih: string,
): AlimTalebi {
  if (!hesap) throw new Error('Alım talebi oluşturmak için giriş yap.');
  const hatalar = alimTalebiHatalari(girdi);
  if (Object.keys(hatalar).length) throw new Error(Object.values(hatalar)[0]);
  return {
    id: kimlik,
    hesapId: hesap.id,
    ad: hesap.ad,
    baslik: girdi.baslik.trim(),
    kategori: girdi.kategori as Kategori,
    altKategori: girdi.altKategori,
    marka: girdi.marka,
    model: girdi.model,
    butce: butceyiOku(girdi.butce),
    konum: girdi.il ? konumuBirlestir(girdi.il, girdi.ilce) : '',
    aciklama: girdi.aciklama.trim(),
    tarih,
    durum: 'acik',
    yanitlar: [],
  };
}

export function alimTalebiKapat(talep: AlimTalebi, hesapId: string | undefined): AlimTalebi {
  if (!hesapId || talep.hesapId !== hesapId) throw new Error('Yalnızca kendi alım talebini kapatabilirsin.');
  return { ...talep, durum: 'kapali' };
}

export function alimTalebiniYanitla(
  talep: AlimTalebi,
  hesap: { id: string; ad: string } | null,
  ilan: Ilan | undefined,
  mesaj: string,
  kimlik: string,
  tarih: string,
): AlimTalebi {
  if (!hesap) throw new Error('Talebe yanıt vermek için giriş yap.');
  if (talep.hesapId === hesap.id) throw new Error('Kendi alım talebine yanıt veremezsin.');
  if (!ilan || ilan.saticiId !== hesap.id) throw new Error('Yayındaki kendi ilanlarından birini seç.');
  if (!talebeUygunIlanMi(talep, ilan))
    throw new Error('Bu ilan talebin ürün türü, model veya bütçe koşullarına uymuyor.');
  if (mesaj.trim().length < 10 || mesaj.trim().length > 600)
    throw new Error('Yanıtını 10–600 karakter arasında yaz.');
  if (talep.yanitlar.some((yanit) => yanit.ilanId === ilan.id && yanit.hesapId === hesap.id))
    throw new Error('Bu ilanla talebe zaten yanıt verdin.');
  if (talep.yanitlar.length >= 100) throw new Error('Bu talep için yanıt sınırına ulaşıldı.');
  return {
    ...talep,
    yanitlar: [
      ...talep.yanitlar,
      {
        id: kimlik,
        hesapId: hesap.id,
        ad: hesap.ad,
        ilanId: ilan.id,
        mesaj: mesaj.trim(),
        tarih,
      },
    ],
  };
}

function nesneMi(deger: unknown): deger is Record<string, unknown> {
  return typeof deger === 'object' && deger !== null && !Array.isArray(deger);
}

/** Bozuk veya eski bir kaydı yetkilendirme verisi olarak kullanma. */
export function alimTalepleriniOku(metin: string | null): AlimTalebi[] {
  if (!metin) return [];
  const kayit: unknown = JSON.parse(metin);
  if (!nesneMi(kayit) || kayit.surum !== 1 || !Array.isArray(kayit.talepler))
    throw new Error('Alım talepleri kaydı okunamadı.');
  if (kayit.talepler.length > 500) throw new Error('Alım talepleri kayıt sınırını aşıyor.');
  const kimlikler = new Set<string>();
  return kayit.talepler.map((talep): AlimTalebi => {
    if (
      !nesneMi(talep) ||
      typeof talep.id !== 'string' ||
      !talep.id ||
      kimlikler.has(talep.id) ||
      typeof talep.hesapId !== 'string' ||
      !talep.hesapId ||
      typeof talep.ad !== 'string' ||
      typeof talep.tarih !== 'string' ||
      !Number.isFinite(Date.parse(talep.tarih)) ||
      !['acik', 'kapali'].includes(String(talep.durum)) ||
      !Array.isArray(talep.yanitlar) ||
      talep.yanitlar.length > 100 ||
      typeof talep.butce !== 'number' ||
      typeof talep.konum !== 'string'
    )
      throw new Error('Alım talepleri kaydı geçerli değil.');
    const alanlar = ['baslik', 'kategori', 'altKategori', 'marka', 'model', 'aciklama'];
    if (alanlar.some((alan) => typeof talep[alan] !== 'string'))
      throw new Error('Alım talebinin alanları eksik.');
    const konum = konumuAyir(talep.konum);
    if (talep.konum && !konum.il) throw new Error('Alım talebinin konumu geçerli değil.');
    const hatalar = alimTalebiHatalari({
      ...talep,
      ...konum,
      butce: String(talep.butce),
    } as AlimTalebiGirdisi);
    if (Object.keys(hatalar).length) throw new Error('Alım talebinin bilgileri geçerli değil.');
    const yanitKimlikleri = new Set<string>();
    for (const yanit of talep.yanitlar) {
      if (
        !nesneMi(yanit) ||
        ['id', 'hesapId', 'ad', 'ilanId', 'mesaj', 'tarih'].some(
          (alan) => typeof yanit[alan] !== 'string' || !yanit[alan],
        ) ||
        yanit.hesapId === talep.hesapId ||
        !Number.isFinite(Date.parse(String(yanit.tarih))) ||
        String(yanit.mesaj).length < 10 ||
        String(yanit.mesaj).length > 600 ||
        yanitKimlikleri.has(String(yanit.id))
      )
        throw new Error('Alım talebi yanıtı geçerli değil.');
      yanitKimlikleri.add(String(yanit.id));
    }
    kimlikler.add(talep.id);
    return talep as unknown as AlimTalebi;
  });
}
