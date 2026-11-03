import { konumuAyir } from './konumlar.ts';
import { ilceKoordinatlari } from './ilceKoordinatlari.ts';

const ilceMerkezleri = new Map(
  ilceKoordinatlari.map(([il, eskiAd, enlem, boylam]) => {
    const ad =
      eskiAd === il
        ? 'Merkez'
        : il === 'Ankara' && eskiAd === 'Kazan'
          ? 'Kahramankazan'
          : il === 'Kırıkkale' && eskiAd === 'Bahşili'
            ? 'Bahşılı'
            : eskiAd;
    return [`${il}/${ad}`, { enlem, boylam }];
  }),
);

/** İlçe merkezini çevreleyen alan; satıcının evini veya kesin adresini işaretlemez. */
export function konumHaritasi(konum: string) {
  const { il, ilce } = konumuAyir(konum);
  if (!il) return;
  const merkez = ilceMerkezleri.get(`${il}/${ilce}`);
  const ilNoktalari = ilceKoordinatlari.filter(([ad]) => ad === il);
  if (!ilNoktalari.length) return;
  const sinirlar = (
    merkez
      ? [merkez.boylam - 0.045, merkez.enlem - 0.025, merkez.boylam + 0.045, merkez.enlem + 0.025]
      : [
          Math.min(...ilNoktalari.map(([, , , b]) => b)) - 0.03,
          Math.min(...ilNoktalari.map(([, , e]) => e)) - 0.03,
          Math.max(...ilNoktalari.map(([, , , b]) => b)) + 0.03,
          Math.max(...ilNoktalari.map(([, , e]) => e)) + 0.03,
        ]
  ) as [number, number, number, number];
  const enlem = merkez?.enlem ?? (sinirlar[1] + sinirlar[3]) / 2;
  const boylam = merkez?.boylam ?? (sinirlar[0] + sinirlar[2]) / 2;
  const yaricap = merkez
    ? 1800
    : Math.max(
        3000,
        Math.hypot(
          (sinirlar[2] - sinirlar[0]) * Math.cos((enlem * Math.PI) / 180),
          sinirlar[3] - sinirlar[1],
        ) * 42000,
      );
  return {
    adres: [il, ilce].filter(Boolean).join(' / '),
    ilce: Boolean(merkez),
    enlem,
    boylam,
    yaricap,
    sinirlar,
  };
}

export type HaritaKonumu = NonNullable<ReturnType<typeof konumHaritasi>>;
