import type { Ilan } from './ilanlar.ts';

export const kargoBoyutlari = [
  { id: 'kucuk', ad: 'Küçük paket', sinir: '0–2 kg / desi', ucret: 69, enCok: 2 },
  { id: 'orta', ad: 'Orta paket', sinir: '2,01–7 kg / desi', ucret: 99, enCok: 7 },
  { id: 'buyuk', ad: 'Büyük paket', sinir: '7,01–10 kg / desi', ucret: 139, enCok: 10 },
  { id: 'ekstra-buyuk', ad: 'Ekstra büyük paket', sinir: '10,01–30 kg / desi', ucret: 199, enCok: 30 },
] as const;

export type KargoBoyutu = (typeof kargoBoyutlari)[number]['id'];
export type GuvenliAlisverisAyari = { etkin: boolean; kargoBoyutu: KargoBoyutu };
export const hizmetBedeliOrani = 0.05;
const paraBicimi = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
export const alisverisParasi = (tutar: number) => `${paraBicimi.format(tutar)} TL`;

export function kargoBoyutuGecerli(deger: unknown): deger is KargoBoyutu {
  return kargoBoyutlari.some((boyut) => boyut.id === deger);
}

export function guvenliAlisveriseUygun(ilan: Pick<Ilan, 'kategori'>) {
  return !['otomotiv', 'emlak', 'is-ilanlari', 'hizmetler'].includes(ilan.kategori);
}

export function guvenliAlisverisAyariniTemizle(
  ilan: Pick<Ilan, 'kategori' | 'guvenliAlisveris'>,
): GuvenliAlisverisAyari | undefined {
  const ayar = ilan.guvenliAlisveris;
  if (!guvenliAlisveriseUygun(ilan) || !ayar || ayar.etkin !== true || !kargoBoyutuGecerli(ayar.kargoBoyutu))
    return undefined;
  return { etkin: true, kargoBoyutu: ayar.kargoBoyutu };
}

/** Para işlemleri kuruş üzerinden yapılır; toplam, gösterilen kalemlerin toplamıdır. */
export function alisverisOzeti(fiyat: number, boyut: KargoBoyutu) {
  const kargo = kargoBoyutlari.find((secenek) => secenek.id === boyut);
  if (!kargo || !Number.isFinite(fiyat) || fiyat < 1 || fiyat > 999999999) return undefined;
  const urunKurusu = Math.round(fiyat * 100);
  const komisyonKurusu = Math.round(urunKurusu * hizmetBedeliOrani);
  const kargoKurusu = kargo.ucret * 100;
  return {
    urunBedeli: urunKurusu / 100,
    kargoBedeli: kargoKurusu / 100,
    hizmetBedeli: komisyonKurusu / 100,
    toplam: (urunKurusu + komisyonKurusu + kargoKurusu) / 100,
    saticiKazanci: urunKurusu / 100,
    kargo,
  };
}

export function paketBoyutunuHesapla(en: number, boy: number, yukseklik: number, agirlik: number) {
  if (![en, boy, yukseklik, agirlik].every((deger) => Number.isFinite(deger) && deger > 0)) return undefined;
  const desi = (en * boy * yukseklik) / 3000;
  const olcu = Math.max(desi, agirlik);
  return {
    desi: Math.ceil(desi * 100) / 100,
    boyut: kargoBoyutlari.find((secenek) => olcu <= secenek.enCok)?.id,
  };
}
