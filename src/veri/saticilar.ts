import type { Ilan } from './ilanlar';

export type SaticiProfili = {
  id: string;
  ad: string;
  konum: string;
  hakkinda: string;
  fotograf?: string;
  puan?: number;
  degerlendirmeSayisi?: number;
  uyelikYili?: number;
  telefon?: string;
};

const portreEslesmeleri: Record<string, number> = {
  Mert: 1,
  Berk: 3,
  Deniz: 5,
  Ayşe: 2,
  Ömer: 7,
  Can: 1,
  Duru: 4,
  Ece: 6,
  Ali: 3,
  Burak: 5,
  Emre: 7,
  Eren: 1,
  Selin: 8,
  Zeynep: 2,
  Ada: 4,
  Aslı: 6,
  Baran: 3,
  Ceren: 8,
  Derya: 2,
  Efe: 5,
  Hakan: 7,
  İpek: 4,
  Kerem: 1,
  Onur: 3,
  Pelin: 6,
  Seda: 8,
  Tolga: 5,
  Uğur: 7,
};

function adOzeti(ad: string) {
  return Array.from(ad).reduce((ozet, harf) => (ozet * 31 + harf.charCodeAt(0)) >>> 0, 7);
}

export function saticiKimligi(ad: string) {
  return `satici-${adOzeti(ad).toString(36)}`;
}

export function katalogSaticilari(ilanlar: Ilan[]): SaticiProfili[] {
  const adlar = [...new Set(ilanlar.map((ilan) => ilan.satici))];
  return adlar.map((ad) => {
    const ozet = adOzeti(ad);
    const ilan = ilanlar.find((kayit) => kayit.satici === ad)!;
    return {
      id: saticiKimligi(ad),
      ad,
      konum: ilan.konum,
      hakkinda: '',
      fotograf: `/gorseller/profiller/satici-${String(portreEslesmeleri[ad.split(' ')[0] ?? ''] ?? (ozet % 8) + 1).padStart(2, '0')}.webp`,
      puan: Number((4.5 + (ozet % 6) / 10).toFixed(1)),
      degerlendirmeSayisi: 4 + (ozet % 24),
      uyelikYili: 2020 + (ozet % 6),
    };
  });
}

export const saticiYolu = (id: string) =>
  id.startsWith('uye-')
    ? { pathname: '/satici/[id]' as const, params: { id: 'yerel', hesap: id } }
    : { pathname: '/satici/[id]' as const, params: { id } };
