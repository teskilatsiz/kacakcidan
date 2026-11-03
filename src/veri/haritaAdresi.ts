import type { HaritaKonumu } from './konumHaritasi';

/** Koordinatlar fragment'te kalır; sunucuya veya harita sağlayıcısına açık adres gönderilmez. */
export function haritaAdresi(konum: HaritaKonumu, koyu: boolean) {
  const secenekler = new URLSearchParams({
    tema: koyu ? 'koyu' : 'acik',
    konum: JSON.stringify({
      merkez: [konum.enlem, konum.boylam],
      sinirlar: [
        [konum.sinirlar[1], konum.sinirlar[0]],
        [konum.sinirlar[3], konum.sinirlar[2]],
      ],
      yaricap: konum.yaricap,
      etiket: `${konum.adres}, yaklaşık ${konum.ilce ? 'ilçe' : 'il'} çevresi`,
    }),
  });
  return `/harita.html#${secenekler}`;
}
