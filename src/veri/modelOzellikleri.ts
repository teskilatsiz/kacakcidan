import type { UrunSecimi } from './ozellikler.ts';

type ModelBilgisi = {
  readonly kaynak: string;
  readonly degerler: Readonly<Record<string, string>>;
};

const apple = (belge: string, degerler: ModelBilgisi['degerler']): ModelBilgisi => ({
  kaynak: `https://support.apple.com/tr-tr/${belge}`,
  degerler,
});
const telefon = (
  belge: string,
  ekran: string,
  islemci: string,
  cozunurluk: string,
  kamera = '12',
  onKamera = '12',
): ModelBilgisi =>
  apple(belge, {
    Ekran: `${ekran} inç`,
    Kamera: `${kamera} MP`,
    'Ön kamera': `${onKamera} MP`,
    'İşletim sistemi': 'iOS',
    İşlemci: `Apple ${islemci}`,
    'Ekran çözünürlüğü': cozunurluk,
  });

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
  'iphone-14-pro': telefon('111849', '6,1', 'A16 Bionic', '2556 × 1179', '48'),
  'iphone-14-pro-max': telefon('111846', '6,7', 'A16 Bionic', '2796 × 1290', '48'),
  'iphone-15': telefon('111831', '6,1', 'A16 Bionic', '2556 × 1179', '48'),
  'iphone-15-pro': telefon('111829', '6,1', 'A17 Pro', '2556 × 1179', '48'),
  'iphone-15-pro-max': telefon('111828', '6,7', 'A17 Pro', '2796 × 1290', '48'),
  'iphone-16': telefon('121029', '6,1', 'A18', '2556 × 1179', '48'),
  'iphone-16-plus': telefon('121030', '6,7', 'A18', '2796 × 1290', '48'),
  'iphone-16-pro': telefon('121031', '6,3', 'A18 Pro', '2622 × 1206', '48'),
  'iphone-16-pro-max': telefon('121032', '6,9', 'A18 Pro', '2868 × 1320', '48'),
  'iphone-se-3': telefon('111866', '4,7', 'A15 Bionic', '1334 × 750', '12', '7'),
};

const androidTelefonlar: Readonly<Record<string, ModelBilgisi>> = {
  'samsung/galaxy-s23-ultra': {
    kaynak: 'https://www.samsungmobilepress.com/media-assets/galaxy-s23-ultra?tab=specs',
    degerler: {
      Ekran: '6,8 inç',
      Kamera: '200 MP',
      'Ön kamera': '12 MP',
      'İşletim sistemi': 'Android',
      İşlemci: 'Qualcomm Snapdragon 8 Gen 2 for Galaxy',
      'Ekran çözünürlüğü': '3088 × 1440',
    },
  },
  'xiaomi/13t-pro': {
    kaynak: 'https://www.mi.com/uk/product/xiaomi-13t-pro-leica/specs/',
    degerler: {
      Ekran: '6,67 inç',
      Kamera: '50 MP',
      'Ön kamera': '20 MP',
      'İşletim sistemi': 'Android',
      İşlemci: 'MediaTek Dimensity 9200+',
      'Ekran çözünürlüğü': '2712 × 1220',
    },
  },
  'google/pixel-7': {
    kaynak: 'https://support.google.com/pixelphone/answer/7158570?hl=en-AU',
    degerler: {
      Ekran: '6,3 inç',
      Kamera: '50 MP',
      'Ön kamera': '10,8 MP',
      'İşletim sistemi': 'Android',
      İşlemci: 'Google Tensor G2',
      'Ekran çözünürlüğü': '2400 × 1080',
    },
  },
  'nothing/phone-2': {
    kaynak: 'https://checkout-eu.nothing.tech/pages/phone-2',
    degerler: {
      Ekran: '6,7 inç',
      Kamera: '50 MP',
      'Ön kamera': '32 MP',
      'İşletim sistemi': 'Android',
      İşlemci: 'Qualcomm Snapdragon 8+ Gen 1',
      'Ekran çözünürlüğü': '2412 × 1080',
    },
  },
};

const bilgisayarlar: Readonly<Record<string, ModelBilgisi>> = {
  'macbook-air-m1': apple('111883', { İşlemci: 'Apple M1', Ekran: '13,3 inç' }),
  // Air M2 ve M3 kaydı 13 ve 15 inç modelleri kapsar; ekran satıcı tarafından seçilir.
  'macbook-air-m2': apple('111867', { İşlemci: 'Apple M2' }),
  'macbook-pro-m2': apple('111869', { İşlemci: 'Apple M2', Ekran: '13,3 inç' }),
  'macbook-air-m3': apple('118551', { İşlemci: 'Apple M3' }),
};

const konsollar: Readonly<Record<string, ModelBilgisi>> = {
  'sony/playstation-5': {
    kaynak:
      'https://blog.playstation.com/2020/03/18/unveiling-new-details-of-playstation-5-hardware-technical-specs/',
    degerler: { İşlemci: '8 çekirdekli AMD Zen 2', Bellek: '16 GB GDDR6' },
  },
  'sony/playstation-5-slim': {
    kaynak:
      'https://www.playstation.com/content/dam/global_pdc/en-gb/corporate/support/manuals/ps5-docs/2100ab/CFI-21XX_PS5_Instruction_Manual_Web%24en-gb.pdf',
    degerler: { İşlemci: '8 çekirdekli AMD Zen 2', Bellek: '16 GB GDDR6' },
  },
  'microsoft/xbox-series-x': {
    kaynak: 'https://www.xbox.com/en-us/consoles/xbox-series-x',
    degerler: { İşlemci: '8 çekirdekli AMD Zen 2', Bellek: '16 GB GDDR6' },
  },
  'microsoft/xbox-series-s': {
    kaynak: 'https://www.xbox.com/en-us/consoles/xbox-series-s',
    degerler: { İşlemci: '8 çekirdekli AMD Zen 2', Bellek: '10 GB GDDR6' },
  },
  'nintendo/switch': {
    kaynak: 'https://www.nintendo.com/us/gaming-systems/switch/tech-specs/',
    degerler: { Ekran: '6,2 inç LCD', 'Ekran çözünürlüğü': '1280 × 720' },
  },
  'nintendo/switch-oled': {
    kaynak: 'https://www.nintendo.com/us/gaming-systems/switch/tech-specs/',
    degerler: { Ekran: '7 inç OLED', 'Ekran çözünürlüğü': '1280 × 720' },
  },
  'nintendo/switch-lite': {
    kaynak: 'https://www.nintendo.com/us/gaming-systems/switch/tech-specs/',
    degerler: { Ekran: '5,5 inç LCD', 'Ekran çözünürlüğü': '1280 × 720' },
  },
};

const kameralar: Readonly<Record<string, ModelBilgisi>> = {
  'fujifilm/x100v': {
    kaynak: 'https://fujifilm-dsc.com/en/manual/x100v/technical_notes/spec/index.html',
    degerler: { Sensör: 'APS-C', Çözünürlük: '26,1 MP', Lens: 'Sabit 23 mm f/2' },
  },
};

export function modelOzellikleri(secim: UrunSecimi): ModelBilgisi | undefined {
  if (!secim.marka || !secim.model) return;
  if (
    secim.kategori === 'telefon' &&
    ['cep-telefonu', 'yenilenmis-telefon'].includes(secim.altKategori ?? '')
  ) {
    if (secim.marka === 'apple')
      return Object.hasOwn(telefonlar, secim.model) ? telefonlar[secim.model] : undefined;
    const kimlik = `${secim.marka}/${secim.model}`;
    return Object.hasOwn(androidTelefonlar, kimlik) ? androidTelefonlar[kimlik] : undefined;
  }
  if (secim.marka === 'apple' && secim.kategori === 'bilgisayar' && secim.altKategori === 'dizustu')
    return Object.hasOwn(bilgisayarlar, secim.model) ? bilgisayarlar[secim.model] : undefined;
  const kimlik = `${secim.marka}/${secim.model}`;
  if (secim.kategori === 'oyun' && secim.altKategori === 'oyun-konsolu')
    return Object.hasOwn(konsollar, kimlik) ? konsollar[kimlik] : undefined;
  if (secim.kategori === 'fotograf' && secim.altKategori === 'dijital-fotograf-makinesi')
    return Object.hasOwn(kameralar, kimlik) ? kameralar[kimlik] : undefined;
}

/** Form dışında gelen veya eski kayıtta kalmış çelişkili sabit değerleri de düzeltir. */
export function modelOzellikleriniUygula(secim: UrunSecimi, degerler: Record<string, string>) {
  const sabit = modelOzellikleri(secim);
  return sabit ? { ...degerler, ...sabit.degerler } : degerler;
}
