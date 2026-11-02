import type { UrunSecimi } from './ozellikler.ts';

type ModelBilgisi = {
  readonly kaynak: string;
  readonly degerler: Readonly<Record<string, string>>;
};

const apple = (belge: string, degerler: ModelBilgisi['degerler']): ModelBilgisi => ({
  kaynak: `https://support.apple.com/tr-tr/${belge}`,
  degerler,
});
const telefon = (belge: string, ekran: string, islemci: string, cozunurluk: string): ModelBilgisi =>
  apple(belge, { Ekran: `${ekran} inç`, İşlemci: `Apple ${islemci}`, 'Ekran çözünürlüğü': cozunurluk });

// Yalnızca modelin bütün donanım seçeneklerinde aynı kalan üretici bilgileri.
// Bölgeye göre değişen SIM, renk, kapasite, pil/onarım durumu buraya yazılmaz.
const telefonlar: Readonly<Record<string, ModelBilgisi>> = {
  'iphone-11': telefon('111865', '6,1', 'A13 Bionic', '1792 × 828'),
  'iphone-12': telefon('111876', '6,1', 'A14 Bionic', '2532 × 1170'),
  'iphone-12-pro': telefon('111875', '6,1', 'A14 Bionic', '2532 × 1170'),
  'iphone-12-pro-max': telefon('111874', '6,7', 'A14 Bionic', '2778 × 1284'),
  'iphone-13': telefon('111872', '6,1', 'A15 Bionic', '2532 × 1170'),
  'iphone-13-pro': telefon('111871', '6,1', 'A15 Bionic', '2532 × 1170'),
  'iphone-14': telefon('111850', '6,1', 'A15 Bionic', '2532 × 1170'),
  'iphone-14-pro': telefon('111849', '6,1', 'A16 Bionic', '2556 × 1179'),
  'iphone-14-pro-max': telefon('111846', '6,7', 'A16 Bionic', '2796 × 1290'),
  'iphone-15': telefon('111831', '6,1', 'A16 Bionic', '2556 × 1179'),
  'iphone-15-pro': telefon('111829', '6,1', 'A17 Pro', '2556 × 1179'),
  'iphone-15-pro-max': telefon('111828', '6,7', 'A17 Pro', '2796 × 1290'),
  'iphone-16': telefon('121029', '6,1', 'A18', '2556 × 1179'),
  'iphone-16-plus': telefon('121030', '6,7', 'A18', '2796 × 1290'),
  'iphone-16-pro': telefon('121031', '6,3', 'A18 Pro', '2622 × 1206'),
  'iphone-16-pro-max': telefon('121032', '6,9', 'A18 Pro', '2868 × 1320'),
  'iphone-se-3': telefon('111866', '4,7', 'A15 Bionic', '1334 × 750'),
};

const bilgisayarlar: Readonly<Record<string, ModelBilgisi>> = {
  'macbook-air-m1': apple('111883', { İşlemci: 'Apple M1', Ekran: '13,3 inç' }),
  // Air M2 ve M3 kaydı 13 ve 15 inç modelleri kapsar; ekran satıcı tarafından seçilir.
  'macbook-air-m2': apple('111867', { İşlemci: 'Apple M2' }),
  'macbook-pro-m2': apple('111869', { İşlemci: 'Apple M2', Ekran: '13,3 inç' }),
  'macbook-air-m3': apple('118551', { İşlemci: 'Apple M3' }),
};

export function modelOzellikleri(secim: UrunSecimi): ModelBilgisi | undefined {
  if (secim.marka !== 'apple' || !secim.model) return;
  if (
    secim.kategori === 'telefon' &&
    ['cep-telefonu', 'yenilenmis-telefon'].includes(secim.altKategori ?? '')
  )
    return Object.hasOwn(telefonlar, secim.model) ? telefonlar[secim.model] : undefined;
  if (secim.kategori === 'bilgisayar' && secim.altKategori === 'dizustu')
    return Object.hasOwn(bilgisayarlar, secim.model) ? bilgisayarlar[secim.model] : undefined;
}

/** Form dışında gelen veya eski kayıtta kalmış çelişkili sabit değerleri de düzeltir. */
export function modelOzellikleriniUygula(secim: UrunSecimi, degerler: Record<string, string>) {
  const sabit = modelOzellikleri(secim);
  return sabit ? { ...degerler, ...sabit.degerler } : degerler;
}
