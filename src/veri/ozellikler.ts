import type { Kategori } from './ilanlar.ts';
import { ekOzellikAlanlari } from './ekOzellikler.ts';
import { kategoriAgaci } from './kategoriler.ts';
import { ilanOzellikAlanlari } from './ilanOzellikleri.ts';

export type OzellikAlani = {
  ad: string;
  secenekler: string[];
  filtreSecenekleri?: { id: string; ad: string }[];
  sayisal?: boolean;
  birim?: string;
  enCok?: number;
};
export type UrunSecimi = { kategori: Kategori; altKategori?: string; marka?: string; model?: string };
const alan = (ad: string, secenekler: string[]): OzellikAlani => ({ ad, secenekler });
const sayisalAlan = (
  ad: string,
  enCok: number,
  birim: string,
  araliklar: [number, number | null, string][],
): OzellikAlani => ({
  ad,
  secenekler: [],
  sayisal: true,
  enCok,
  birim,
  filtreSecenekleri: araliklar.map(([enAz, enCokAralik, etiket]) => ({
    id: `aralik:${enAz}:${enCokAralik ?? ''}`,
    ad: etiket,
  })),
});
const kmAraliklari: [number, number | null, string][] = [
  [0, 10000, '0 - 10.000 km'],
  [10001, 50000, '10.001 - 50.000 km'],
  [50001, 100000, '50.001 - 100.000 km'],
  [100001, 200000, '100.001 - 200.000 km'],
  [200001, null, '200.001 km ve üzeri'],
];
const kutu = alan('Kutu', ['Var', 'Yok']);
const fatura = alan('Fatura', ['Var', 'Yok']);
const garanti = alan('Garanti', ['Devam ediyor', 'Süresi doldu', 'Yok']);
const renkler = [
  'Siyah',
  'Beyaz',
  'Gri',
  'Gümüş',
  'Mavi',
  'Yeşil',
  'Kırmızı',
  'Sarı',
  'Pembe',
  'Mor',
  'Kahverengi',
  'Bej',
  'Diğer',
];
const telefonKapasiteleri: Record<string, string[]> = {
  'iphone-16': ['128 GB', '256 GB', '512 GB'],
  'iphone-16-plus': ['128 GB', '256 GB', '512 GB'],
  'iphone-16-pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
  'iphone-16-pro-max': ['256 GB', '512 GB', '1 TB'],
  'iphone-se-3': ['64 GB', '128 GB', '256 GB'],
  'iphone-15': ['128 GB', '256 GB', '512 GB'],
  'iphone-15-pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
  'iphone-15-pro-max': ['256 GB', '512 GB', '1 TB'],
  'iphone-14': ['128 GB', '256 GB', '512 GB'],
  'iphone-14-pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
  'iphone-14-pro-max': ['128 GB', '256 GB', '512 GB', '1 TB'],
  'iphone-13': ['128 GB', '256 GB', '512 GB'],
  'iphone-13-pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
  'iphone-12': ['64 GB', '128 GB', '256 GB'],
  'iphone-11': ['64 GB', '128 GB', '256 GB'],
  'galaxy-s23-ultra': ['256 GB', '512 GB', '1 TB'],
  'galaxy-s23': ['128 GB', '256 GB'],
  'galaxy-s24': ['128 GB', '256 GB', '512 GB'],
  'galaxy-s22': ['128 GB', '256 GB'],
  'galaxy-a54': ['128 GB', '256 GB'],
  '13t-pro': ['256 GB', '512 GB', '1 TB'],
  '13t': ['256 GB'],
  'redmi-note-13': ['128 GB', '256 GB'],
  'redmi-note-12': ['64 GB', '128 GB', '256 GB'],
  'pixel-7': ['128 GB', '256 GB'],
  'pixel-8': ['128 GB', '256 GB'],
  'pixel-7-pro': ['128 GB', '256 GB', '512 GB'],
  'phone-1': ['128 GB', '256 GB'],
  'phone-2': ['128 GB', '256 GB', '512 GB'],
  'phone-2a': ['128 GB', '256 GB'],
  'galaxy-s24-ultra': ['256 GB', '512 GB', '1 TB'],
  'galaxy-s24-plus': ['256 GB', '512 GB'],
  'galaxy-z-fold-5': ['256 GB', '512 GB', '1 TB'],
  'galaxy-z-flip-5': ['256 GB', '512 GB'],
  'galaxy-a55': ['128 GB', '256 GB'],
  'galaxy-a34': ['128 GB', '256 GB'],
  'p30-pro': ['128 GB', '256 GB', '512 GB'],
  'p40-pro': ['256 GB'],
  'nova-11': ['128 GB', '256 GB', '512 GB'],
  'reno-10': ['128 GB', '256 GB'],
  'reno-11-f': ['256 GB'],
  a78: ['128 GB', '256 GB'],
  'realme-11-pro': ['128 GB', '256 GB', '512 GB'],
  'realme-c55': ['64 GB', '128 GB', '256 GB'],
  'honor-90': ['256 GB', '512 GB'],
  'magic-6-pro': ['256 GB', '512 GB', '1 TB'],
  'nokia-g22': ['64 GB', '128 GB'],
  'gm-24-pro': ['256 GB'],
  'gm-23': ['128 GB'],
  'camon-20': ['256 GB'],
  'spark-20': ['128 GB', '256 GB'],
  v29: ['128 GB', '256 GB', '512 GB'],
  y36: ['128 GB', '256 GB', '512 GB'],
};
const telefonRenkleri: Record<string, string[]> = {
  'iphone-16': ['Siyah', 'Beyaz', 'Pembe', 'Deniz mavisi', 'Laciverttaş'],
  'iphone-16-plus': ['Siyah', 'Beyaz', 'Pembe', 'Deniz mavisi', 'Laciverttaş'],
  'iphone-16-pro': ['Siyah titanyum', 'Beyaz titanyum', 'Doğal titanyum', 'Çöl titanyum'],
  'iphone-16-pro-max': ['Siyah titanyum', 'Beyaz titanyum', 'Doğal titanyum', 'Çöl titanyum'],
  'iphone-se-3': ['Gece yarısı', 'Yıldız ışığı', 'Kırmızı'],
  'iphone-15': ['Siyah', 'Mavi', 'Yeşil', 'Sarı', 'Pembe'],
  'iphone-15-pro': ['Doğal titanyum', 'Mavi titanyum', 'Beyaz titanyum', 'Siyah titanyum'],
  'iphone-15-pro-max': ['Doğal titanyum', 'Mavi titanyum', 'Beyaz titanyum', 'Siyah titanyum'],
  'iphone-14': ['Gece yarısı', 'Yıldız ışığı', 'Kırmızı', 'Mavi', 'Mor', 'Sarı'],
  'iphone-14-pro': ['Uzay siyahı', 'Gümüş', 'Altın', 'Derin mor'],
  'iphone-14-pro-max': ['Uzay siyahı', 'Gümüş', 'Altın', 'Derin mor'],
  'iphone-13': ['Gece yarısı', 'Yıldız ışığı', 'Mavi', 'Pembe', 'Yeşil', 'Kırmızı'],
  'iphone-13-pro': ['Grafit', 'Altın', 'Gümüş', 'Sierra mavisi', 'Köknar yeşili'],
  'iphone-12': ['Siyah', 'Beyaz', 'Kırmızı', 'Yeşil', 'Mavi', 'Mor'],
  'iphone-11': ['Mor', 'Yeşil', 'Sarı', 'Siyah', 'Beyaz', 'Kırmızı'],
  'galaxy-s23-ultra': [
    'Siyah',
    'Krem',
    'Yeşil',
    'Lavanta',
    'Grafit',
    'Gök mavisi',
    'Limon yeşili',
    'Kırmızı',
  ],
  'galaxy-s23': ['Siyah', 'Krem', 'Yeşil', 'Lavanta', 'Grafit', 'Limon yeşili'],
  'galaxy-s24': ['Siyah', 'Gri', 'Mor', 'Sarı', 'Yeşil', 'Mavi', 'Turuncu'],
  'galaxy-s22': ['Siyah', 'Beyaz', 'Yeşil', 'Pembe altın', 'Mor', 'Grafit', 'Krem', 'Gök mavisi'],
  'galaxy-a54': ['Grafit', 'Beyaz', 'Mor', 'Limon yeşili'],
  '13t-pro': ['Siyah', 'Mavi', 'Yeşil'],
  '13t': ['Siyah', 'Mavi', 'Yeşil'],
  'redmi-note-13': ['Siyah', 'Yeşil', 'Mavi', 'Turuncu'],
  'redmi-note-12': ['Gri', 'Siyah', 'Yeşil', 'Mavi', 'Altın'],
  'pixel-7': ['Siyah', 'Beyaz', 'Limon yeşili'],
  'pixel-8': ['Siyah', 'Ela', 'Pembe', 'Nane yeşili'],
  'pixel-7-pro': ['Siyah', 'Beyaz', 'Ela'],
  'phone-1': ['Siyah', 'Beyaz'],
  'phone-2': ['Beyaz', 'Koyu gri'],
  'phone-2a': ['Siyah', 'Beyaz', 'Süt beyazı', 'Mavi', 'Özel seri'],
  'galaxy-s24-ultra': [
    'Titanyum gri',
    'Titanyum siyah',
    'Titanyum mor',
    'Titanyum sarı',
    'Titanyum mavi',
    'Titanyum yeşil',
    'Titanyum turuncu',
  ],
  'galaxy-s24-plus': ['Siyah', 'Gri', 'Mor', 'Sarı', 'Yeşil', 'Mavi', 'Turuncu'],
  'galaxy-z-fold-5': ['Buz mavisi', 'Krem', 'Siyah', 'Gri', 'Mavi'],
  'galaxy-z-flip-5': ['Nane yeşili', 'Grafit', 'Krem', 'Lavanta', 'Gri', 'Mavi', 'Yeşil', 'Sarı'],
  'galaxy-a55': ['Lacivert', 'Buz mavisi', 'Lila', 'Limon sarısı'],
  'galaxy-a34': ['Gümüş', 'Grafit', 'Mor', 'Limon yeşili'],
  'p30-pro': ['Siyah', 'Sedef beyazı', 'Aurora', 'Kristal', 'Turuncu', 'Mavi', 'Lavanta'],
  'p40-pro': ['Gümüş', 'Siyah', 'Beyaz', 'Mavi', 'Altın'],
  'nova-11': ['Yeşil', 'Siyah', 'Beyaz', 'Altın'],
  'reno-10': ['Gümüş', 'Mavi', 'Gri'],
  'reno-11-f': ['Yeşil', 'Mavi', 'Mor'],
  a78: ['Siyah', 'Mavi', 'Yeşil'],
  'realme-11-pro': ['Siyah', 'Bej', 'Yeşil'],
  'realme-c55': ['Siyah', 'Altın', 'Yeşil'],
  'honor-90': ['Yeşil', 'Gümüş', 'Siyah', 'Mavi'],
  'magic-6-pro': ['Siyah', 'Yeşil', 'Mor', 'Mavi', 'Beyaz'],
  'nokia-3310': ['Siyah', 'Lacivert', 'Gri', 'Kırmızı', 'Sarı'],
  'nokia-105': ['Siyah', 'Mavi', 'Kırmızı', 'Pembe'],
  'nokia-g22': ['Gri', 'Mavi', 'Şeftali'],
  'gm-24-pro': ['Gri', 'Beyaz'],
  'gm-23': ['Siyah', 'Mavi', 'Beyaz'],
  'camon-20': ['Siyah', 'Mavi', 'Beyaz'],
  'spark-20': ['Siyah', 'Beyaz', 'Mavi', 'Altın'],
  v29: ['Siyah', 'Mavi', 'Pembe', 'Kırmızı'],
  y36: ['Siyah', 'Altın', 'Yeşil'],
};
const macbookDonanimi: Record<
  string,
  { islemci: string[]; bellek: string[]; depolama: string[]; ekran: string[]; renk: string[] }
> = {
  'macbook-air-m1': {
    islemci: ['Apple M1'],
    bellek: ['8 GB', '16 GB'],
    depolama: ['128 GB SSD', '256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'],
    ekran: ['13,3 inç'],
    renk: ['Gümüş', 'Uzay grisi', 'Altın'],
  },
  'macbook-air-m2': {
    islemci: ['Apple M2'],
    bellek: ['8 GB', '16 GB', '24 GB'],
    depolama: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'],
    ekran: ['13,6 inç', '15,3 inç'],
    renk: ['Gümüş', 'Yıldız ışığı', 'Uzay grisi', 'Gece yarısı'],
  },
  'macbook-pro-m2': {
    islemci: ['Apple M2'],
    bellek: ['8 GB', '16 GB', '24 GB'],
    depolama: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'],
    ekran: ['13,3 inç'],
    renk: ['Gümüş', 'Uzay grisi'],
  },
  'macbook-air-m3': {
    islemci: ['Apple M3'],
    bellek: ['8 GB', '16 GB', '24 GB'],
    depolama: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'],
    ekran: ['13,6 inç', '15,3 inç'],
    renk: ['Gümüş', 'Yıldız ışığı', 'Uzay grisi', 'Gece yarısı'],
  },
  'macbook-pro-m3': {
    islemci: ['Apple M3', 'Apple M3 Pro', 'Apple M3 Max'],
    bellek: ['8 GB', '16 GB', '18 GB', '24 GB', '32 GB', '36 GB', '48 GB', '64 GB', '96 GB', '128 GB'],
    depolama: ['512 GB SSD', '1 TB SSD', '2 TB SSD', '4 TB SSD', '8 TB SSD'],
    ekran: ['14,2 inç', '16,2 inç'],
    renk: ['Gümüş', 'Uzay grisi', 'Uzay siyahı'],
  },
};
const tabletKapasiteleri: Record<string, string[]> = {
  'ipad-9': ['64 GB', '256 GB'],
  'ipad-10': ['64 GB', '256 GB'],
  'ipad-air': ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'],
  'galaxy-tab-s9': ['128 GB', '256 GB'],
  'galaxy-tab-a9': ['64 GB', '128 GB'],
};
const tabletRenkleri: Record<string, string[]> = {
  'ipad-9': ['Gümüş', 'Uzay grisi'],
  'ipad-10': ['Gümüş', 'Mavi', 'Pembe', 'Sarı'],
  'ipad-air': ['Gümüş', 'Uzay grisi', 'Altın', 'Pembe altın', 'Yeşil', 'Mavi', 'Mor', 'Yıldız ışığı'],
  'galaxy-tab-s9': ['Grafit', 'Bej'],
  'galaxy-tab-a9': ['Grafit', 'Gümüş', 'Lacivert'],
};

const elektronikBelgeleri = [kutu, fatura, garanti];
const renk = alan('Renk', renkler);
const varYok = (ad: string) => alan(ad, ['Var', 'Yok']);
const modelYili = alan(
  'Model yılı',
  Array.from({ length: 67 }, (_, i) => `${2026 - i}`),
);
const kilometre = sayisalAlan('Kilometre', 2000000, 'km', kmAraliklari);
const aracKaydi = [
  alan('Kimden', ['Sahibinden', 'Galeriden', 'Yetkili bayiden']),
  alan('Ağır hasar kayıtlı', ['Hayır', 'Evet', 'Bilinmiyor']),
  alan('Boya durumu', ['Boyasız', 'Lokal boyalı', 'Boyalı', 'Belirtilmemiş']),
  alan('Değişen parça', ['Yok', 'Var', 'Bilinmiyor']),
  alan('Plaka durumu', ['Türkiye plakalı', 'Yabancı plakalı', 'Mavi plakalı', 'Plakasız']),
];
const motorGucu = sayisalAlan('Motor gücü', 2000, 'bg', [
  [1, 75, '75 bg ve altı'],
  [76, 100, '76 - 100 bg'],
  [101, 125, '101 - 125 bg'],
  [126, 150, '126 - 150 bg'],
  [151, 200, '151 - 200 bg'],
  [201, 300, '201 - 300 bg'],
  [301, null, '301 bg ve üzeri'],
]);
const islemciler = [
  'Intel Core i3',
  'Intel Core i5',
  'Intel Core i7',
  'Intel Core i9',
  'Intel Core Ultra 5',
  'Intel Core Ultra 7',
  'Intel Core Ultra 9',
  'AMD Ryzen 3',
  'AMD Ryzen 5',
  'AMD Ryzen 7',
  'AMD Ryzen 9',
  'Apple M1',
  'Apple M2',
  'Apple M3',
  'Apple M4',
  'Diğer',
];
const bellekler = ['4 GB', '8 GB', '12 GB', '16 GB', '24 GB', '32 GB', '48 GB', '64 GB', '96 GB', '128 GB'];
const suruculer = [
  '128 GB SSD',
  '256 GB SSD',
  '512 GB SSD',
  '1 TB SSD',
  '2 TB SSD',
  '4 TB SSD',
  '500 GB HDD',
  '1 TB HDD',
  '2 TB HDD',
  'Diğer',
];
const soketler = [
  'Intel LGA 1151',
  'Intel LGA 1200',
  'Intel LGA 1700',
  'Intel LGA 1851',
  'AMD AM4',
  'AMD AM5',
  'Diğer',
];
const montajlar = [
  'Canon RF',
  'Canon EF',
  'Canon EF-M',
  'Sony E',
  'Nikon Z',
  'Nikon F',
  'Fujifilm X',
  'Micro Four Thirds',
  'L-Mount',
  'Pentax K',
  'Diğer',
];
const kiyafetBedenleri = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
  'Standart',
  '32',
  '34',
  '36',
  '38',
  '40',
  '42',
  '44',
  '46',
  '48',
  '50',
  '52',
  '54',
  '56',
];
const kumaslar = ['Pamuk', 'Yün', 'Denim', 'Deri', 'Süet', 'Polyester', 'Keten', 'İpek', 'Viskon', 'Diğer'];
const cocukBedenleri = [
  '0 - 3 ay',
  '3 - 6 ay',
  '6 - 9 ay',
  '9 - 12 ay',
  '12 - 18 ay',
  '18 - 24 ay',
  '2 - 3 yaş',
  '3 - 4 yaş',
  '4 - 5 yaş',
  '5 - 6 yaş',
  '6 - 7 yaş',
  '7 - 8 yaş',
  '8 - 9 yaş',
  '9 - 10 yaş',
  '10 - 11 yaş',
  '11 - 12 yaş',
  '12 - 13 yaş',
  '13 - 14 yaş',
  '14 - 15 yaş',
  '15 - 16 yaş',
];
const kullanimSaati = sayisalAlan('Kullanım saati', 100000, 'saat', [
  [0, 100, '0 - 100 saat'],
  [101, 500, '101 - 500 saat'],
  [501, 2000, '501 - 2.000 saat'],
  [2001, null, '2.001 saat ve üzeri'],
]);

function telefonAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'numara')
    return [
      alan('Hat türü', ['Faturalı', 'Faturasız']),
      alan('Numara türü', ['Standart', 'Ardışık rakamlı', 'Tekrarlı rakamlı']),
      alan('Devir', ['Devre uygun']),
    ];
  if (altKategori === 'yedek-parca')
    return [
      alan('Parça durumu', ['Orijinal', 'Servis çıkması', 'Muadil']),
      alan('Uyumlu cihaz', ['iPhone', 'Samsung Galaxy', 'Xiaomi', 'Huawei', 'OPPO', 'Diğer']),
      renk,
      garanti,
    ];
  if (altKategori === 'giyilebilir-teknoloji')
    return [
      alan('Cihaz türü', ['Akıllı saat', 'Akıllı bileklik', 'Spor saati']),
      alan('Bağlantı', ['Bluetooth', 'Bluetooth + Wi-Fi', 'Bluetooth + Cellular']),
      alan('Kasa boyutu', [
        '38 mm',
        '40 mm',
        '41 mm',
        '42 mm',
        '43 mm',
        '44 mm',
        '45 mm',
        '46 mm',
        '47 mm',
        '49 mm',
        '51 mm',
        'Diğer',
      ]),
      alan('Kordon', ['Silikon', 'Metal', 'Deri', 'Naylon', 'Diğer']),
      varYok('GPS'),
      renk,
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'aksesuar') {
    const ortak = [
      alan('Uyumlu cihaz', ['iPhone', 'Android telefon', 'iPad', 'Android tablet', 'Evrensel']),
      renk,
      kutu,
      garanti,
    ];
    if (marka === 'sarj')
      return [
        alan('Bağlantı', ['USB-C', 'USB-A', 'Lightning', 'Micro USB', 'Kablosuz şarj']),
        alan('Şarj gücü', [
          '5 W',
          '10 W',
          '15 W',
          '18 W',
          '20 W',
          '25 W',
          '30 W',
          '45 W',
          '65 W',
          '100 W',
          'Diğer',
        ]),
        ...(model === 'powerbank'
          ? [
              alan('Pil kapasitesi', [
                '5.000 mAh',
                '10.000 mAh',
                '20.000 mAh',
                '25.000 mAh',
                '30.000 mAh',
                'Diğer',
              ]),
            ]
          : []),
        ...ortak,
      ];
    if (marka === 'ses')
      return [
        alan('Kulaklık tipi', ['Kulak içi', 'Kulak üstü', 'Açık kulak']),
        alan('Bağlantı', ['Bluetooth', 'USB-C', 'Lightning', '3,5 mm']),
        varYok('Aktif gürültü engelleme'),
        varYok('Mikrofon'),
        ...ortak,
      ];
    if (marka === 'ekran-koruyucu')
      return [
        alan('Koruyucu türü', ['Temperli cam', 'Hidrojel film', 'Gizlilik camı', 'Mat film']),
        ...ortak,
      ];
    return [
      alan('Malzeme', ['Silikon', 'Deri', 'TPU', 'Polikarbonat', 'Metal', 'Tekstil', 'Diğer']),
      varYok('MagSafe uyumu'),
      ...ortak,
    ];
  }
  if (model === 'nokia-3310' || model === 'nokia-105' || model === 'tuslu-telefon')
    return [
      alan('Telefon tipi', ['Tuşlu', 'Kapaklı']),
      alan('SIM', ['Tek SIM', 'Çift SIM']),
      alan('Şebeke', ['2G', '3G', '4G']),
      alan('Renk', telefonRenkleri[model] ?? renkler),
      ...elektronikBelgeleri,
    ];
  const alanlar = [
    alan(
      'Depolama',
      telefonKapasiteleri[model] ?? ['16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'],
    ),
    alan('Renk', telefonRenkleri[model] ?? renkler),
    alan('SIM', ['Fiziksel SIM', 'Fiziksel SIM + eSIM', 'Çift fiziksel SIM', 'eSIM']),
    alan('Kayıt durumu', ['Türkiye kayıtlı', 'Yurt dışı kayıtlı', 'Kayıtsız', 'Bilinmiyor']),
    alan('Ekran durumu', ['Çiziksiz', 'İnce çizikler var', 'Çatlak / kırık', 'Değişmiş']),
    alan('Değişen parça', ['Yok', 'Yetkili serviste değişmiş', 'Özel serviste değişmiş', 'Bilinmiyor']),
    ...elektronikBelgeleri,
  ];
  if (marka === 'apple')
    alanlar.splice(
      2,
      0,
      alan('Pil sağlığı', [
        ...Array.from({ length: 51 }, (_, i) => `%${100 - i}`),
        '%50 altında',
        'Bilinmiyor',
      ]),
    );
  if (altKategori === 'yenilenmis-telefon')
    alanlar.push(
      alan('Yenileme belgesi', ['Var', 'Yok']),
      alan('Kozmetik durum', ['Çok iyi', 'İyi', 'Kullanım izi var']),
    );
  return alanlar;
}

function bilgisayarParcasiAlanlari(marka = '', model = ''): OzellikAlani[] {
  if (marka === 'islemci')
    return [
      alan('İşlemci ailesi', [
        'Intel Core i3',
        'Intel Core i5',
        'Intel Core i7',
        'Intel Core i9',
        'Intel Core Ultra',
        'AMD Ryzen 3',
        'AMD Ryzen 5',
        'AMD Ryzen 7',
        'AMD Ryzen 9',
        'Diğer',
      ]),
      alan('Soket', soketler),
      alan('Çekirdek sayısı', ['2', '4', '6', '8', '10', '12', '14', '16', '20', '24', '32', 'Diğer']),
      varYok('Dahilî grafik'),
      varYok('Soğutucu'),
      ...elektronikBelgeleri,
    ];
  if (marka === 'ekran-karti')
    return [
      alan('Grafik işlemci', [
        'NVIDIA GeForce GTX',
        'NVIDIA GeForce RTX',
        'AMD Radeon RX',
        'Intel Arc',
        'Diğer',
      ]),
      alan('Video belleği', [
        '2 GB',
        '4 GB',
        '6 GB',
        '8 GB',
        '10 GB',
        '12 GB',
        '16 GB',
        '20 GB',
        '24 GB',
        '32 GB',
        'Diğer',
      ]),
      alan('Bellek türü', ['GDDR5', 'GDDR6', 'GDDR6X', 'GDDR7', 'Diğer']),
      alan('Soğutma', ['Tek fan', 'Çift fan', 'Üç fan', 'Sıvı soğutma', 'Pasif']),
      ...elektronikBelgeleri,
    ];
  if (marka === 'ram')
    return [
      alan(
        'Bellek türü',
        model === 'ddr4' ? ['DDR4'] : model === 'ddr5' ? ['DDR5'] : ['DDR3', 'DDR4', 'DDR5'],
      ),
      alan('Kapasite', bellekler),
      alan('Modül tipi', ['DIMM', 'SO-DIMM']),
      alan('Modül sayısı', ['1', '2', '4', '8']),
      alan('Bellek hızı', [
        '1600 MHz',
        '2400 MHz',
        '2666 MHz',
        '3000 MHz',
        '3200 MHz',
        '3600 MHz',
        '4800 MHz',
        '5200 MHz',
        '5600 MHz',
        '6000 MHz',
        '6400 MHz',
        '7200 MHz',
        'Diğer',
      ]),
      ...elektronikBelgeleri,
    ];
  if (marka === 'depolama')
    return [
      alan('Kapasite', [
        '120 GB',
        '128 GB',
        '240 GB',
        '256 GB',
        '480 GB',
        '500 GB',
        '512 GB',
        '1 TB',
        '2 TB',
        '4 TB',
        '8 TB',
        '12 TB',
        'Diğer',
      ]),
      alan('Bağlantı', ['SATA', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0', 'NVMe PCIe 5.0', 'SAS', 'USB']),
      alan('Biçim', ['2,5 inç', '3,5 inç', 'M.2 2230', 'M.2 2242', 'M.2 2280']),
      ...elektronikBelgeleri,
    ];
  if (marka === 'anakart')
    return [
      alan('Soket', soketler),
      alan('Bellek türü', ['DDR3', 'DDR4', 'DDR5']),
      alan('Form faktörü', ['ATX', 'Micro ATX', 'Mini ITX', 'E-ATX']),
      varYok('Wi-Fi'),
      ...elektronikBelgeleri,
    ];
  if (model === 'guc-kaynagi')
    return [
      alan('Güç', [
        '350 W',
        '450 W',
        '500 W',
        '550 W',
        '600 W',
        '650 W',
        '750 W',
        '850 W',
        '1000 W',
        '1200 W',
        'Diğer',
      ]),
      alan('Verimlilik', [
        '80 PLUS',
        '80 PLUS Bronze',
        '80 PLUS Silver',
        '80 PLUS Gold',
        '80 PLUS Platinum',
        '80 PLUS Titanium',
        'Belirtilmemiş',
      ]),
      alan('Kablo yapısı', ['Modüler', 'Yarı modüler', 'Sabit']),
      ...elektronikBelgeleri,
    ];
  if (model === 'sogutma')
    return [
      alan('Soğutma türü', ['Hava soğutma', 'Sıvı soğutma', 'Kasa fanı']),
      alan('Fan boyutu', ['80 mm', '92 mm', '120 mm', '140 mm', '200 mm', 'Diğer']),
      alan('Soket uyumu', soketler),
      ...elektronikBelgeleri,
    ];
  if (model === 'kasa')
    return [
      alan('Kasa boyutu', ['Mini tower', 'Mid tower', 'Full tower', 'Mini ITX']),
      alan('Anakart uyumu', ['Mini ITX', 'Micro ATX', 'ATX', 'E-ATX']),
      alan('Yan panel', ['Cam', 'Akrilik', 'Metal', 'Mesh']),
      renk,
      kutu,
      garanti,
    ];
  return [
    alan('Parça türü', [
      'İşlemci',
      'Ekran kartı',
      'Anakart',
      'Bellek (RAM)',
      'SSD',
      'Sabit disk',
      'Güç kaynağı',
      'Soğutma',
      'Kasa',
    ]),
    ...elektronikBelgeleri,
  ];
}

function cevreBirimiAlanlari(marka = '', model = ''): OzellikAlani[] {
  const baglanti = alan('Bağlantı', [
    'USB',
    'USB-C',
    'Bluetooth',
    '2,4 GHz kablosuz',
    '3,5 mm',
    'Kablosuz ve kablolu',
  ]);
  if (marka === 'klavye')
    return [
      alan('Tuş yapısı', ['Mekanik', 'Membran', 'Makas', 'Optik']),
      alan('Tuş dizilimi', ['Türkçe Q', 'Türkçe F', 'İngilizce Q', 'Diğer']),
      alan('Boyut', ['Tam boy', 'TKL', '%75', '%65', '%60', 'Sayısal tuş takımı']),
      baglanti,
      renk,
      ...elektronikBelgeleri,
    ];
  if (marka === 'fare')
    return [
      alan('Sensör', ['Optik', 'Lazer']),
      alan('DPI', ['800', '1600', '3200', '6400', '12000', '16000', '20000', '26000', 'Diğer']),
      alan('El tercihi', ['Sağ', 'Sol', 'İki el']),
      baglanti,
      renk,
      ...elektronikBelgeleri,
    ];
  if (marka === 'kulaklik')
    return [
      alan('Kulaklık tipi', ['Kulak içi', 'Kulak üstü', 'Açık kulak']),
      varYok('Mikrofon'),
      varYok('Aktif gürültü engelleme'),
      baglanti,
      renk,
      ...elektronikBelgeleri,
    ];
  if (marka === 'yazici') return yaziciAlanlari(model);
  return [baglanti, alan('Kullanım', ['Oyuncu', 'Ofis', 'Tasarım', 'Ev']), renk, ...elektronikBelgeleri];
}

function yaziciAlanlari(model = ''): OzellikAlani[] {
  if (model === '3d-yazici')
    return [
      alan('Baskı teknolojisi', ['FDM / FFF', 'SLA / MSLA', 'SLS', 'Diğer']),
      alan('Baskı hacmi', [
        '180 × 180 × 180 mm',
        '220 × 220 × 250 mm',
        '256 × 256 × 256 mm',
        '300 × 300 × 300 mm',
        'Diğer',
      ]),
      alan('Malzeme', ['PLA', 'PETG', 'ABS / ASA', 'Reçine', 'Çoklu malzeme']),
      varYok('Otomatik tabla kalibrasyonu'),
      ...elektronikBelgeleri,
    ];
  if (model === 'dokuman-tarayici')
    return [
      alan('Tarayıcı türü', ['Düz yataklı', 'Yaprak beslemeli', 'Taşınabilir']),
      alan('Belge boyutu', ['A4', 'A3', 'Diğer']),
      varYok('Çift taraflı tarama'),
      alan('Bağlantı', ['USB', 'Ethernet', 'Wi-Fi']),
      ...elektronikBelgeleri,
    ];
  return [
    alan('Baskı teknolojisi', ['Lazer', 'Mürekkep püskürtmeli', 'Tanklı', 'Termal', 'Nokta vuruşlu']),
    alan('Baskı', ['Siyah beyaz', 'Renkli']),
    alan('İşlev', ['Yalnızca yazıcı', 'Yazıcı + tarayıcı', 'Yazıcı + tarayıcı + faks']),
    alan('Kâğıt boyutu', ['A4', 'A3', 'Etiket', 'Diğer']),
    alan('Bağlantı', ['USB', 'Wi-Fi', 'Ethernet', 'USB + Wi-Fi + Ethernet']),
    varYok('Otomatik çift taraflı baskı'),
    ...elektronikBelgeleri,
  ];
}

function bilgisayarAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'oyun-bilgisayari')
    return [
      alan(
        'İşlemci',
        islemciler.filter((ad) => !ad.startsWith('Apple')),
      ),
      alan('Bellek', bellekler),
      alan('Ekran kartı', [
        'NVIDIA GeForce RTX',
        'NVIDIA GeForce GTX',
        'AMD Radeon RX',
        'Intel Arc',
        'Diğer',
      ]),
      alan('Ekran', ['14 inç', '15,6 inç', '16 inç', '17,3 inç', '18 inç', 'Masaüstü']),
      alan('Depolama', suruculer),
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'bilgisayar-parcalari') return bilgisayarParcasiAlanlari(marka, model);
  if (altKategori === 'cevre-birimleri') return cevreBirimiAlanlari(marka, model);
  if (altKategori === 'yazici-tarayici') return yaziciAlanlari(model);
  if (altKategori === 'bilgisayar-aksesuari') {
    if (marka === 'canta')
      return [
        alan('Uyumlu ekran', [
          '11 inç',
          '12 inç',
          '13 inç',
          '14 inç',
          '15,6 inç',
          '16 inç',
          '17,3 inç',
          'Diğer',
        ]),
        alan('Malzeme', ['Polyester', 'Naylon', 'Neopren', 'Deri', 'Diğer']),
        renk,
      ];
    if (marka === 'stand')
      return [
        alan('Malzeme', ['Alüminyum', 'Plastik', 'Ahşap', 'Çelik', 'Diğer']),
        varYok('Yükseklik ayarı'),
        renk,
      ];
    return [
      alan('Bağlantı', ['USB-A', 'USB-C', 'Thunderbolt', 'HDMI', 'DisplayPort', 'MagSafe', 'Diğer']),
      alan('Güç', ['30 W', '45 W', '65 W', '90 W', '100 W', '140 W', 'Diğer']),
      renk,
      ...elektronikBelgeleri,
    ];
  }
  if (altKategori === 'guc-koruma')
    return [
      alan('Kapasite', ['600 VA', '650 VA', '800 VA', '1000 VA', '1500 VA', '2000 VA', '3000 VA', 'Diğer']),
      alan('Çıkış sayısı', ['1', '2', '3', '4', '6', '8', 'Diğer']),
      varYok('Akü dahil'),
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'yazilim')
    return [
      alan('Lisans türü', ['Perakende', 'OEM', 'Abonelik', 'Toplu lisans']),
      alan('Kullanıcı sayısı', ['1', '2', '5', '10', 'Diğer']),
      alan('Platform', ['Windows', 'macOS', 'Linux', 'Çoklu platform']),
      alan('Lisans durumu', ['Etkinleştirilmemiş', 'Devredilebilir']),
      fatura,
    ];
  if (altKategori === 'ag-ekipmanlari')
    return [
      alan('Kablosuz standardı', ['Wi-Fi 4', 'Wi-Fi 5', 'Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7', 'Wi-Fi yok']),
      alan('Port sayısı', ['1', '2', '4', '5', '8', '16', '24', '48', 'Diğer']),
      alan('Ethernet hızı', ['100 Mbps', '1 Gbps', '2,5 Gbps', '10 Gbps']),
      alan('Bağlantı', ['ADSL', 'VDSL', 'Fiber WAN', 'Ethernet', '4G / 5G']),
      varYok('PoE'),
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'sunucu')
    return [
      alan('İşlemci', ['Intel Xeon', 'AMD EPYC', 'Intel Core', 'AMD Ryzen', 'ARM', 'Diğer']),
      alan('Bellek', ['8 GB', '16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB']),
      alan('Disk yuvası', ['1', '2', '4', '6', '8', '12', '16', 'Diğer']),
      alan('Form faktörü', ['1U', '2U', '4U', 'Tower', 'Masaüstü NAS']),
      alan('Disk dahil', ['Evet', 'Hayır']),
      garanti,
    ];
  if (altKategori === 'tablet')
    return [
      alan(
        'Depolama',
        tabletKapasiteleri[model] ?? [
          '16 GB',
          '32 GB',
          '64 GB',
          '128 GB',
          '256 GB',
          '512 GB',
          '1 TB',
          '2 TB',
        ],
      ),
      alan('Bağlantı', ['Wi-Fi', 'Wi-Fi + Cellular']),
      alan('Renk', tabletRenkleri[model] ?? renkler),
      varYok('Kalem'),
      varYok('Klavye'),
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'monitor')
    return [
      alan('Ekran boyutu', [
        '19 inç',
        '21,5 inç',
        '23,8 inç',
        '24 inç',
        '27 inç',
        '31,5 inç',
        '32 inç',
        '34 inç',
        '38 inç',
        '49 inç',
        'Diğer',
      ]),
      alan('Çözünürlük', ['HD', 'Full HD', 'QHD', '4K UHD', '5K', 'Ultrawide']),
      alan('Panel', ['IPS', 'VA', 'TN', 'OLED']),
      alan('Arka aydınlatma', ['LED', 'Mini LED', 'OLED']),
      alan('Yenileme hızı', [
        '60 Hz',
        '75 Hz',
        '100 Hz',
        '120 Hz',
        '144 Hz',
        '165 Hz',
        '180 Hz',
        '240 Hz',
        '360 Hz',
        '480 Hz',
      ]),
      alan('Görüntü girişi', ['HDMI', 'DisplayPort', 'USB-C', 'Thunderbolt', 'DVI', 'VGA']),
      varYok('VESA montajı'),
      ...elektronikBelgeleri,
    ];
  const macbook = macbookDonanimi[model];
  const temel = [
    alan('İşlemci', macbook?.islemci ?? islemciler),
    alan('Bellek', macbook?.bellek ?? bellekler),
    alan('Depolama', macbook?.depolama ?? suruculer),
  ];
  if (altKategori === 'masaustu')
    return [
      ...temel,
      alan('Ekran kartı', ['Dahili grafik', 'NVIDIA GeForce', 'AMD Radeon', 'Intel Arc', 'Diğer']),
      alan('Kasa boyutu', ['Mini tower', 'Mid tower', 'Full tower', 'Mini PC', 'All-in-one']),
      alan('İşletim sistemi', ['Windows', 'macOS', 'Linux', 'İşletim sistemi yok']),
      ...elektronikBelgeleri,
    ];
  return [
    ...temel,
    alan(
      'Ekran',
      macbook?.ekran ?? [
        '11 inç',
        '12 inç',
        '13 inç',
        '13,3 inç',
        '13,6 inç',
        '14 inç',
        '15,6 inç',
        '16 inç',
        '17,3 inç',
        '18 inç',
      ],
    ),
    alan(
      'Ekran kartı',
      marka === 'apple'
        ? ['Dahili grafik']
        : ['Dahili grafik', 'NVIDIA GeForce', 'AMD Radeon', 'Intel Arc', 'Diğer'],
    ),
    alan(
      'İşletim sistemi',
      marka === 'apple'
        ? ['macOS', 'Linux', 'İşletim sistemi yok']
        : ['Windows', 'Linux', 'İşletim sistemi yok'],
    ),
    alan('Renk', macbook?.renk ?? renkler),
    ...elektronikBelgeleri,
  ];
}

function oyunAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'bilgisayar-oyunu' || altKategori === 'konsol-oyunu')
    return [
      alan(
        'Platform',
        altKategori === 'bilgisayar-oyunu'
          ? ['PC', 'Mac', 'Linux']
          : [
              'PlayStation 5',
              'PlayStation 4',
              'PlayStation 3',
              'Xbox Series X|S',
              'Xbox One',
              'Nintendo Switch',
              'Nintendo 3DS',
              'Diğer',
            ],
      ),
      alan('Tür', [
        'Aksiyon',
        'Macera',
        'Spor',
        'Yarış',
        'Rol yapma',
        'Strateji',
        'Simülasyon',
        'Bulmaca',
        'Dövüş',
        'Diğer',
      ]),
      alan('Format', ['Dijital kod', 'Disk', 'Kartuş']),
      alan('Dil', ['Türkçe', 'İngilizce', 'Çok dilli', 'Diğer']),
      alan('Yaş sınıfı', ['PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18', 'Belirtilmemiş']),
      kutu,
    ];
  if (altKategori === 'oyun-ekipmanlari') {
    if (marka === 'klavye-fare')
      return cevreBirimiAlanlari(model === 'oyun-faresi' ? 'fare' : 'klavye', model);
    const ortak = [
      alan('Uyumlu platform', ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Çoklu platform']),
      ...elektronikBelgeleri,
    ];
    if (model === 'oyun-koltugu')
      return [
        alan('Döşeme', ['Kumaş', 'Suni deri', 'Deri', 'File']),
        alan('Taşıma kapasitesi', ['100 kg', '120 kg', '130 kg', '150 kg', '180 kg', 'Diğer']),
        varYok('Kolçak ayarı'),
        renk,
        fatura,
        garanti,
      ];
    if (model === 'direksiyon-seti')
      return [
        alan('Tahrik sistemi', ['Dişli', 'Kayış', 'Direct drive']),
        varYok('Force feedback'),
        alan('Pedal sayısı', ['2', '3', 'Pedal yok']),
        varYok('Vites kolu'),
        ...ortak,
      ];
    if (marka === 'kulaklik')
      return [
        alan('Kulaklık tipi', ['Kulak içi', 'Kulak üstü']),
        varYok('Mikrofon'),
        alan('Bağlantı', ['USB', '3,5 mm', 'Bluetooth', '2,4 GHz kablosuz']),
        ...ortak,
      ];
    return [
      alan('Bağlantı', ['USB', 'Bluetooth', '2,4 GHz kablosuz', 'Kablolu ve kablosuz']),
      alan('Kol türü', ['Standart', 'Pro kontrolcü', 'Joystick', 'Arcade stick']),
      renk,
      ...ortak,
    ];
  }
  if (altKategori === 'konsol-yedek-parca')
    return [
      alan('Uyumlu platform', [
        'PlayStation 5',
        'PlayStation 4',
        'Xbox Series X|S',
        'Xbox One',
        'Nintendo Switch',
        'Diğer',
      ]),
      alan('Parça durumu', ['Orijinal', 'Servis çıkması', 'Muadil']),
      garanti,
    ];
  if (altKategori === 'sanal-gerceklik')
    return [
      alan('Kullanım', ['Bağımsız', 'PC bağlantılı', 'Konsol bağlantılı']),
      alan('Ekran çözünürlüğü', ['1832 × 1920', '2064 × 2208', '2000 × 2040', 'Diğer']),
      alan('Dahilî depolama', ['64 GB', '128 GB', '256 GB', '512 GB', 'Depolama yok']),
      alan('Kontrolcü sayısı', ['0', '1', '2']),
      ...elektronikBelgeleri,
    ];
  if (model === 'playstation-portal')
    return [alan('Kullanım', ['PS5 uzaktan oynatma']), renk, ...elektronikBelgeleri];
  const kapasiteler: Record<string, string[]> = {
    'playstation-5': ['825 GB', '1 TB'],
    'playstation-5-slim': ['1 TB'],
    'playstation-5-pro': ['2 TB'],
    'playstation-4': ['500 GB', '1 TB'],
    'playstation-4-pro': ['1 TB', '2 TB'],
    'xbox-series-s': ['512 GB', '1 TB'],
    'xbox-series-x': ['1 TB', '2 TB'],
    'xbox-one-s': ['500 GB', '1 TB', '2 TB'],
    'xbox-one-x': ['1 TB'],
    switch: ['32 GB'],
    'switch-oled': ['64 GB'],
    'switch-lite': ['32 GB'],
    'steam-deck': ['64 GB', '256 GB', '512 GB'],
    'steam-deck-oled': ['512 GB', '1 TB'],
    'rog-ally': ['512 GB'],
    'rog-ally-x': ['1 TB'],
    'legion-go': ['256 GB', '512 GB', '1 TB'],
  };
  const retro = altKategori === 'retro-konsol';
  return [
    ...(!retro
      ? [
          alan(
            'Depolama',
            kapasiteler[model] ?? [
              '32 GB',
              '64 GB',
              '128 GB',
              '256 GB',
              '500 GB',
              '512 GB',
              '825 GB',
              '1 TB',
              '2 TB',
              'Hafıza kartı',
            ],
          ),
        ]
      : []),
    alan(
      'Sürüm',
      model.startsWith('playstation-5')
        ? ['Diskli', 'Dijital', 'Harici disk sürücülü']
        : ['Standart', 'Özel seri'],
    ),
    alan('Kol sayısı', ['Kol yok', '1', '2', '3', '4', 'Dahili kontrolcü']),
    renk,
    ...elektronikBelgeleri,
  ];
}

function modaAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'spor-ayakkabi' || altKategori === 'ayakkabi' || model === 'gelin-ayakkabisi')
    return [
      alan(
        'Numara',
        Array.from({ length: 60 }, (_, i) => `${20 + i / 2}`.replace('.', ',')),
      ),
      alan('Cinsiyet', ['Kadın', 'Erkek', 'Unisex', 'Çocuk']),
      alan('Kalıp', ['Dar', 'Standart', 'Geniş']),
      renk,
      alan('Malzeme', ['Deri', 'Süet', 'Tekstil', 'Kanvas', 'Sentetik', 'Diğer']),
      kutu,
      fatura,
    ];
  if (altKategori === 'canta')
    return [
      alan('Çanta türü', [
        'Sırt çantası',
        'Omuz çantası',
        'El çantası',
        'Çapraz çanta',
        'Bel çantası',
        'Cüzdan',
        'Diğer',
      ]),
      alan('Malzeme', ['Deri', 'Suni deri', 'Kanvas', 'Polyester', 'Naylon', 'Diğer']),
      alan('Kapanış', ['Fermuar', 'Çıtçıt', 'Mıknatıs', 'Büzgü', 'Açık']),
      renk,
      varYok('Askı'),
      fatura,
    ];
  if (altKategori === 'valiz-bavul')
    return [
      alan('Boy', ['Kabin boy', 'Orta boy', 'Büyük boy', 'Set', 'Diğer']),
      alan('Gövde', ['Sert kabuk', 'Kumaş', 'Deri', 'Diğer']),
      alan('Tekerlek', ['2 teker', '4 teker', '8 teker', 'Tekerleksiz']),
      varYok('TSA kilidi'),
      renk,
      fatura,
    ];
  if (altKategori === 'taki-mucevher')
    return [
      alan('Maden', ['Altın', 'Gümüş', 'Platin', 'Çelik', 'Bijuteri', 'Diğer']),
      alan('Saflık', ['8 ayar', '14 ayar', '18 ayar', '22 ayar', '24 ayar', '925 gümüş', 'Diğer']),
      alan('Taş', ['Taşsız', 'Pırlanta', 'Zirkon', 'Safir', 'Yakut', 'Zümrüt', 'İnci', 'Diğer']),
      alan('Sertifika', ['Var', 'Yok']),
      kutu,
      fatura,
    ];
  if (altKategori === 'aksesuar') {
    if (marka === 'gunes-gozlugu')
      return [
        alan('Çerçeve', ['Metal', 'Asetat', 'Plastik', 'Titanyum', 'Diğer']),
        alan('Cam', ['Standart', 'Polarize', 'Fotokromik']),
        alan('Ekartman', ['48 mm', '50 mm', '52 mm', '54 mm', '56 mm', '58 mm', '60 mm', 'Diğer']),
        renk,
        kutu,
        fatura,
      ];
    if (marka === 'takilar')
      return [alan('Malzeme', ['Altın', 'Gümüş', 'Çelik', 'Bijuteri', 'Diğer']), renk, kutu, fatura];
    return [
      alan('Malzeme', ['Deri', 'Suni deri', 'Metal', 'Pamuk', 'Yün', 'Tekstil', 'Diğer']),
      alan('Ölçü', ['XS', 'S', 'M', 'L', 'XL', 'Standart', 'Diğer']),
      renk,
    ];
  }
  if (altKategori === 'evlilik-dugun' && marka === 'aksesuar')
    return [alan('Malzeme', ['Tül', 'Dantel', 'Saten', 'Metal', 'Diğer']), renk, kutu];
  const alanlar = [
    alan('Beden', altKategori === 'cocuk-giyim' ? cocukBedenleri : kiyafetBedenleri),
    ...(altKategori !== 'cocuk-giyim' ? [alan('Cinsiyet', ['Kadın', 'Erkek', 'Unisex', 'Çocuk'])] : []),
    alan('Malzeme', kumaslar),
    alan('Mevsim', ['Yaz', 'Kış', 'Mevsimlik']),
    renk,
  ];
  if (altKategori === 'evlilik-dugun')
    alanlar.push(
      alan('Tadilat', ['Yapılmadı', 'Yapıldı']),
      alan('Kullanım', ['Kullanılmadı', 'Bir kez kullanıldı', 'Birden fazla kullanıldı']),
    );
  if (altKategori === 'dis-giyim')
    alanlar.push(
      varYok('Kapüşon'),
      alan('Dolgu', ['Dolgusuz', 'Kaz tüyü', 'Elyaf', 'Diğer']),
      alan('Suya dayanıklılık', ['Yok', 'Su itici', 'Su geçirmez']),
    );
  return alanlar;
}

function fotografAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'analog-fotograf-makinesi')
    return [
      alan(
        'Film formatı',
        model.startsWith('instax')
          ? ['Instax Mini']
          : ['35 mm', '120 film', 'Instax Mini', 'Instax Square', 'Instax Wide', 'Polaroid', 'Diğer'],
      ),
      alan('Makine türü', ['SLR', 'Rangefinder', 'Kompakt', 'Instant', 'Orta format']),
      alan('Pozometre', ['Çalışıyor', 'Çalışmıyor', 'Yok']),
      alan('Lens', ['Gövde', 'Sabit lens', 'Lens dahil']),
      alan('İlerletme', ['Manuel', 'Motorlu']),
      alan('Renk', ['Siyah', 'Gümüş', 'Beyaz', 'Diğer']),
      kutu,
    ];
  if (altKategori === 'kamera-lensi')
    return [
      alan('Bağlantı', montajlar),
      alan('Odak uzaklığı', ['Geniş açı', '24 - 70 mm', '70 - 200 mm', 'Telefoto', 'Makro', 'Sabit odak']),
      alan('Diyafram', [
        'f/0.95 - f/1.2',
        'f/1.4 - f/1.8',
        'f/2 - f/2.8',
        'f/3.5 - f/5.6',
        'f/6.3 ve üzeri',
        'Diğer',
      ]),
      varYok('Sabitleme'),
      alan('Netleme', ['Otomatik ve manuel', 'Manuel']),
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'lens-aksesuari')
    return [
      alan('Filtre çapı', [
        '37 mm',
        '40,5 mm',
        '43 mm',
        '46 mm',
        '49 mm',
        '52 mm',
        '55 mm',
        '58 mm',
        '62 mm',
        '67 mm',
        '72 mm',
        '77 mm',
        '82 mm',
        '95 mm',
        'Diğer',
      ]),
      ...(marka === 'adaptor' ? [alan('Uyumlu bayonet', montajlar)] : []),
      alan('Malzeme', ['Cam', 'Metal', 'Plastik', 'Diğer']),
      kutu,
    ];
  if (altKategori === 'kamera-yedek-parca')
    return [
      alan('Uyumlu marka', [
        'Canon',
        'Sony',
        'Nikon',
        'Fujifilm',
        'Panasonic',
        'Olympus / OM System',
        'Diğer',
      ]),
      alan('Parça durumu', ['Orijinal', 'Servis çıkması', 'Muadil']),
    ];
  if (altKategori === 'drone')
    return model === 'drone-aksesuar'
      ? [
          alan('Aksesuar türü', ['Batarya', 'Pervane', 'Kumanda', 'Taşıma çantası', 'Şarj ünitesi', 'Diğer']),
          alan('Uyumlu marka', ['DJI', 'Autel', 'Diğer']),
          ...elektronikBelgeleri,
        ]
      : [
          alan('Video çözünürlüğü', ['Full HD', '2.7K', '4K', '5.1K', '6K', '8K']),
          alan('Ağırlık', ['250 g altı', '250 - 499 g', '500 - 999 g', '1 kg ve üzeri']),
          alan('Batarya sayısı', ['1', '2', '3', '4', 'Batarya yok']),
          alan('Kumanda', ['Ekransız kumanda', 'Ekranlı kumanda', 'Kumanda yok']),
          varYok('Engel algılama'),
          varYok('GPS'),
          ...elektronikBelgeleri,
        ];
  if (altKategori === 'optik-cihazlar') {
    if (marka === 'teleskop')
      return [
        alan('Optik sistem', ['Mercekli', 'Aynalı', 'Katadioptrik']),
        alan('Açıklık', [
          '50 mm',
          '60 mm',
          '70 mm',
          '80 mm',
          '90 mm',
          '100 mm',
          '114 mm',
          '130 mm',
          '150 mm',
          '200 mm',
          'Diğer',
        ]),
        alan('Kundak', ['Alt-azimut', 'Ekvatoryal', 'Dobson', 'Motorlu / GoTo']),
        varYok('Tripod'),
        kutu,
        garanti,
      ];
    if (marka === 'durbin')
      return [
        alan('Büyütme', ['7×', '8×', '10×', '12×', '15×', '20×', 'Zoom', 'Diğer']),
        alan('Objektif çapı', ['20 mm', '25 mm', '32 mm', '42 mm', '50 mm', '60 mm', '70 mm', 'Diğer']),
        varYok('Suya dayanıklılık'),
        kutu,
        garanti,
      ];
    return [
      alan('Mikroskop türü', ['Biyolojik', 'Stereo', 'Dijital']),
      alan('Büyütme', ['40× - 400×', '40× - 1000×', '20× - 40×', 'Diğer']),
      alan('Aydınlatma', ['LED', 'Halojen', 'Ayna']),
      kutu,
      garanti,
    ];
  }
  if (altKategori === 'studyo')
    return [
      alan('Güç kaynağı', ['Priz', 'Batarya', 'USB', 'Gerektirmez']),
      ...(marka === 'isik'
        ? [
            alan('Işık türü', ['LED', 'Flaş', 'Işık şekillendirici']),
            alan('Renk sıcaklığı', ['3200 K', '5600 K', 'Ayarlanabilir', 'RGB']),
          ]
        : [alan('Malzeme', ['Kumaş', 'Kâğıt', 'Vinil', 'Metal', 'Diğer'])]),
      kutu,
      garanti,
    ];
  if (altKategori === 'kamera-aksesuari') {
    if (marka === 'tripod')
      return [
        alan('Malzeme', ['Alüminyum', 'Karbon fiber', 'Plastik']),
        alan('Taşıma kapasitesi', ['2 kg', '3 kg', '5 kg', '8 kg', '10 kg', '15 kg', 'Diğer']),
        alan('Başlık', ['Küresel', 'Video', 'Üç yönlü', 'Başlık yok']),
        varYok('Başlık dahil'),
        kutu,
      ];
    if (marka === 'isik')
      return [
        alan('Işık türü', ['LED', 'Flaş', 'Işık şekillendirici']),
        alan('Renk sıcaklığı', ['3200 K', '5600 K', 'Ayarlanabilir', 'RGB']),
        alan('Güç kaynağı', ['Priz', 'Batarya', 'USB']),
        ...elektronikBelgeleri,
      ];
    if (marka === 'ses')
      return [
        alan('Mikrofon türü', ['Yaka', 'Shotgun', 'El', 'Stereo']),
        alan('Bağlantı', ['3,5 mm', 'USB-C', 'Lightning', 'XLR', 'Kablosuz']),
        ...elektronikBelgeleri,
      ];
    if (model === 'hafiza-karti')
      return [
        alan('Kart türü', ['SD', 'microSD', 'CFexpress Type A', 'CFexpress Type B', 'CompactFlash']),
        alan('Kapasite', ['16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB']),
        alan('Video hız sınıfı', ['V10', 'V30', 'V60', 'V90', 'Belirtilmemiş']),
        ...elektronikBelgeleri,
      ];
    return [
      alan('Uyumlu marka', ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Panasonic', 'Evrensel', 'Diğer']),
      renk,
      kutu,
      garanti,
    ];
  }
  if (altKategori === 'video-kamera' || altKategori === 'aksiyon-kamerasi')
    return [
      alan('Kayıt çözünürlüğü', ['Full HD', '4K', '5.3K', '5.7K', '6K', '8K']),
      alan('Kayıt ortamı', ['SD kart', 'microSD', 'CFexpress', 'Dahilî bellek', 'MiniDV', 'SSD']),
      alan(
        'Kamera türü',
        altKategori === 'aksiyon-kamerasi'
          ? ['Aksiyon kamerası', '360° kamera']
          : ['El kamerası', 'Sinema kamerası', 'Gimbal kamera'],
      ),
      varYok('Sabitleme'),
      varYok('Harici mikrofon girişi'),
      ...elektronikBelgeleri,
    ];
  return [
    sayisalAlan('Deklanşör sayısı', 10000000, 'çekim', [
      [0, 10000, '0 - 10.000'],
      [10001, 50000, '10.001 - 50.000'],
      [50001, 100000, '50.001 - 100.000'],
      [100001, null, '100.001 ve üzeri'],
    ]),
    alan(
      'Sensör',
      model === 'eos-r50' || model === 'x100v' || model === 'x100vi'
        ? ['APS-C']
        : ['Full frame', 'APS-C', 'Micro Four Thirds', '1 inç', 'Orta format', 'Diğer'],
    ),
    alan('Çözünürlük', ['12 MP altı', '12 - 19 MP', '20 - 29 MP', '30 - 44 MP', '45 MP ve üzeri']),
    alan('Makine türü', ['Aynasız', 'DSLR', 'Kompakt', 'Bridge']),
    alan(
      'Lens',
      model === 'x100v' || model === 'x100vi'
        ? ['Sabit 23 mm f/2']
        : ['Gövde', 'Kit lens', 'Sabit lens', 'Lens dahil değil'],
    ),
    ...(!['x100v', 'x100vi'].includes(model) ? [alan('Lens bağlantısı', montajlar)] : []),
    alan('Renk', ['Siyah', 'Gümüş', 'Beyaz', 'Diğer']),
    ...elektronikBelgeleri,
  ];
}

function otomotivAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'yedek-parca')
    return [
      alan('Uyumlu araç', [
        'Otomobil',
        'SUV / pick-up',
        'Minivan / panelvan',
        'Motosiklet',
        'Ticari araç',
        'Diğer',
      ]),
      alan('Parça durumu', ['Orijinal', 'Servis çıkması', 'Muadil', 'Revizyonlu']),
      alan('Yakıt uyumu', ['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik', 'Yakıt bağımsız']),
      garanti,
    ];
  if (altKategori === 'lastik-jant')
    return [
      alan('Jant çapı', [
        '10 inç',
        '12 inç',
        '13 inç',
        '14 inç',
        '15 inç',
        '16 inç',
        '17 inç',
        '18 inç',
        '19 inç',
        '20 inç',
        '21 inç',
        '22 inç',
        'Diğer',
      ]),
      ...(marka === 'lastik' || model === 'jant-lastik-takim'
        ? [
            alan('Taban genişliği', [
              '145',
              '155',
              '165',
              '175',
              '185',
              '195',
              '205',
              '215',
              '225',
              '235',
              '245',
              '255',
              '265',
              '275',
              'Diğer',
            ]),
            alan('Kesit oranı', ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', 'Diğer']),
            alan(
              'Üretim yılı',
              Array.from({ length: 11 }, (_, i) => `${2026 - i}`),
            ),
            alan('Diş durumu', ['Yeni', 'Çok iyi', 'İyi', 'Aşınmış']),
          ]
        : [
            alan('Bijon sayısı', ['3', '4', '5', '6', '8']),
            alan('Bijon aralığı', ['4×100', '4×108', '5×100', '5×108', '5×112', '5×114,3', '5×120', 'Diğer']),
          ]),
      alan('Adet', ['1', '2', '3', '4', '5', 'Diğer']),
    ];
  if (altKategori === 'motosiklet-ekipmani') {
    if (marka === 'koruma')
      return [
        alan(
          'Beden',
          model === 'motosiklet-botu'
            ? Array.from({ length: 14 }, (_, i) => `${36 + i}`)
            : ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        ),
        alan('Malzeme', ['Tekstil', 'Deri', 'Polikarbonat', 'Fiberglas', 'Karbon fiber', 'Diğer']),
        ...(model === 'kask'
          ? [alan('Kask tipi', ['Kapalı', 'Açılır çeneli', 'Açık', 'Cross', 'Enduro'])]
          : [alan('Mevsim', ['Yaz', 'Kış', 'Dört mevsim'])]),
        renk,
        kutu,
        fatura,
      ];
    return [
      alan('Uyumluluk', ['Evrensel', 'Modele özel']),
      ...(model === 'interkom'
        ? [alan('Bağlantı', ['Bluetooth', 'Mesh', 'Bluetooth + Mesh'])]
        : [alan('Malzeme', ['Sert plastik', 'Metal', 'Tekstil', 'Deri', 'Diğer'])]),
      renk,
      kutu,
      garanti,
    ];
  }
  if (altKategori === 'oto-aksesuar')
    return [
      alan('Uyumluluk', ['Evrensel', 'Modele özel']),
      ...(marka === 'multimedya'
        ? [
            alan('Bağlantı', ['Bluetooth', 'USB', 'AUX', 'Wi-Fi', 'Kablolu']),
            varYok('Apple CarPlay'),
            varYok('Android Auto'),
          ]
        : [alan('Malzeme', ['Kauçuk', 'Plastik', 'Tekstil', 'Alüminyum', 'Çelik', 'Diğer'])]),
      renk,
      kutu,
      garanti,
    ];
  if (altKategori === 'romork')
    return [
      modelYili,
      alan('Taşıma kapasitesi', [
        '250 kg',
        '500 kg',
        '750 kg',
        '1.000 kg',
        '1.500 kg',
        '2.000 kg',
        '3.500 kg',
        'Diğer',
      ]),
      alan('Dingil', ['Tek dingil', 'Çift dingil', 'Diğer']),
      alan('Fren', ['Frenli', 'Frensiz']),
      alan('Belge', ['Ruhsatlı', 'Uygunluk belgeli', 'Belirtilmemiş']),
    ];
  if (altKategori === 'motosiklet' || altKategori === 'atv')
    return [
      modelYili,
      kilometre,
      alan('Vites', ['Manuel', 'Otomatik', 'Yarı otomatik']),
      alan('Yakıt', ['Benzin', 'Elektrik']),
      alan('Motor hacmi', [
        '50 cc',
        '100 cc',
        '125 cc',
        '150 cc',
        '200 cc',
        '250 cc',
        '300 cc',
        '400 cc',
        '450 cc',
        '500 cc',
        '600 cc',
        '650 cc',
        '750 cc',
        '900 cc',
        '1000 cc',
        'Diğer',
      ]),
      varYok('ABS'),
      alan('Soğutma', ['Hava soğutmalı', 'Sıvı soğutmalı']),
      renk,
      ...aracKaydi.filter((alan) => alan.ad !== 'Boya durumu'),
    ];
  if (altKategori === 'deniz-araci')
    return [
      modelYili,
      kullanimSaati,
      alan('Gövde malzemesi', ['Fiber', 'Ahşap', 'Alüminyum', 'Şişme', 'Çelik', 'Diğer']),
      alan('Boy', ['3 m altı', '3 - 4,9 m', '5 - 6,9 m', '7 - 9,9 m', '10 - 14,9 m', '15 m ve üzeri']),
      alan('Motor', ['Motorsuz', 'Dıştan takma', 'İçten takma', 'Yelkenli']),
      alan('Yakıt', ['Benzin', 'Dizel', 'Elektrik', 'Motorsuz']),
      alan('Kapasite', ['1 - 2 kişi', '3 - 4 kişi', '5 - 6 kişi', '7 kişi ve üzeri']),
    ];
  if (altKategori === 'karavan')
    return [
      modelYili,
      ...(model === 'motokaravan' ? [kilometre, alan('Yakıt', ['Dizel', 'Benzin', 'Elektrik'])] : []),
      alan('Yatak kapasitesi', ['1', '2', '3', '4', '5', '6', 'Diğer']),
      alan('Tuvalet', ['Kasetli', 'Sabit', 'Portatif', 'Yok']),
      varYok('Duş'),
      varYok('Güneş paneli'),
      alan('Azami yüklü ağırlık', ['750 kg ve altı', '751 - 1.500 kg', '1.501 - 3.500 kg', '3.500 kg üzeri']),
    ];
  if (altKategori === 'elektrikli-arac')
    return [
      modelYili,
      kilometre,
      alan('Menzil', ['0 - 250 km', '251 - 400 km', '401 - 550 km', '551 km ve üzeri']),
      alan('Batarya kapasitesi', [
        '40 kWh altı',
        '40 - 59 kWh',
        '60 - 79 kWh',
        '80 - 99 kWh',
        '100 kWh ve üzeri',
      ]),
      alan('Şarj girişi', ['CCS2', 'Type 2', 'CHAdeMO', 'Diğer']),
      alan('Çekiş', ['Önden çekiş', 'Arkadan itiş', 'Dört tekerlekten çekiş']),
      motorGucu,
      renk,
      ...aracKaydi,
    ];
  return [
    modelYili,
    kilometre,
    alan('Vites', ['Manuel', 'Otomatik', 'Yarı otomatik']),
    alan('Yakıt', ['Benzin', 'Dizel', 'Benzin + LPG', 'Hibrit', 'Plug-in hibrit', 'Elektrik']),
    alan(
      'Kasa tipi',
      altKategori === 'minivan-panelvan' || altKategori === 'ticari-arac'
        ? ['Minivan', 'Panelvan', 'Camlı van', 'Kamyonet', 'Kamyon', 'Minibüs', 'Diğer']
        : ['Sedan', 'Hatchback', 'Station wagon', 'SUV', 'Coupe', 'Cabrio', 'Pick-up', 'Diğer'],
    ),
    alan('Motor hacmi', ['0 - 1.3 L', '1.4 - 1.6 L', '1.7 - 2.0 L', '2.1 L ve üzeri']),
    alan('Çekiş', ['Önden çekiş', 'Arkadan itiş', '4×4']),
    alan('Hasar kaydı', ['Yok', 'Var', 'Bilinmiyor']),
    motorGucu,
    renk,
    ...aracKaydi,
  ];
}

function beyazEsyaAlanlari(model: string): OzellikAlani[] {
  const ortak = [
    alan('Enerji sınıfı', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Eski sınıflandırma']),
    alan('Kurulum', ['Solo', 'Ankastre']),
    renk,
    fatura,
    garanti,
  ];
  if (model === 'buzdolabi')
    return [
      alan('Net hacim', [
        '200 L altı',
        '200 - 299 L',
        '300 - 399 L',
        '400 - 499 L',
        '500 - 599 L',
        '600 L ve üzeri',
      ]),
      alan('Soğutma sistemi', ['No frost', 'Low frost', 'Statik']),
      alan('Dondurucu konumu', ['Üstte', 'Altta', 'Yanda', 'Dondurucusuz']),
      ...ortak,
    ];
  if (model === 'camasir-makinesi' || model === 'kurutma-makinesi')
    return [
      alan('Kapasite', ['5 kg', '6 kg', '7 kg', '8 kg', '9 kg', '10 kg', '11 kg', '12 kg', 'Diğer']),
      ...(model === 'camasir-makinesi'
        ? [alan('Devir', ['800 dev/dk', '1000 dev/dk', '1200 dev/dk', '1400 dev/dk', '1600 dev/dk'])]
        : [alan('Kurutma teknolojisi', ['Isı pompalı', 'Yoğuşturmalı', 'Bacalı'])]),
      ...ortak,
    ];
  if (model === 'bulasik-makinesi')
    return [
      alan('Kapasite', [
        '6 kişilik',
        '9 kişilik',
        '10 kişilik',
        '12 kişilik',
        '13 kişilik',
        '14 kişilik',
        '15 kişilik',
        '16 kişilik',
      ]),
      alan('Program sayısı', ['3', '4', '5', '6', '7', '8', '9', '10', 'Diğer']),
      ...ortak,
    ];
  if (model === 'ocak')
    return [
      alan('Yakıt', ['Doğal gaz', 'LPG', 'Elektrik', 'İndüksiyon', 'Karma']),
      alan('Göz sayısı', ['1', '2', '3', '4', '5', '6']),
      alan('Yüzey', ['Cam', 'Emaye', 'Paslanmaz çelik', 'Cam seramik']),
      renk,
      fatura,
      garanti,
    ];
  if (model === 'firin')
    return [
      alan('Hacim', ['30 L altı', '30 - 49 L', '50 - 69 L', '70 L ve üzeri']),
      varYok('Fan'),
      varYok('Buhar desteği'),
      ...ortak,
    ];
  return ortak;
}

function evAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'beyaz-esya' && model !== 'klima') return beyazEsyaAlanlari(model);
  if (altKategori === 'isitma-sogutma' || model === 'klima')
    return [
      alan('Enerji kaynağı', ['Elektrik', 'Doğal gaz', 'LPG', 'Katı yakıt']),
      ...(marka === 'klima' || model === 'klima'
        ? [
            alan('Kapasite', [
              '9.000 BTU',
              '12.000 BTU',
              '18.000 BTU',
              '24.000 BTU',
              '30.000 BTU',
              '48.000 BTU',
              'Diğer',
            ]),
            varYok('Inverter'),
          ]
        : [
            alan('Kullanım alanı', [
              '20 m² altı',
              '20 - 39 m²',
              '40 - 59 m²',
              '60 - 99 m²',
              '100 m² ve üzeri',
            ]),
          ]),
      alan('Enerji sınıfı', ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'Belirtilmemiş']),
      renk,
      fatura,
      garanti,
    ];
  if (altKategori === 'televizyon') {
    if (marka === 'televizyon')
      return [
        alan('Ekran boyutu', [
          '24 inç',
          '32 inç',
          '40 inç',
          '43 inç',
          '48 inç',
          '50 inç',
          '55 inç',
          '58 inç',
          '65 inç',
          '75 inç',
          '77 inç',
          '83 inç',
          '85 inç',
          'Diğer',
        ]),
        alan('Çözünürlük', ['HD', 'Full HD', '4K UHD', '8K']),
        alan('Panel', ['LED / LCD', 'QLED', 'OLED', 'Mini LED', 'Plazma']),
        alan('Yenileme hızı', ['50 Hz', '60 Hz', '100 Hz', '120 Hz', '144 Hz']),
        varYok('Smart TV'),
        ...elektronikBelgeleri,
      ];
    if (model === 'projeksiyon-cihazi')
      return [
        alan('Çözünürlük', ['HD', 'Full HD', '4K UHD']),
        alan('Işık kaynağı', ['Lamba', 'LED', 'Lazer']),
        alan('Parlaklık', [
          '1000 ANSI lümen altı',
          '1000 - 1999 ANSI lümen',
          '2000 - 2999 ANSI lümen',
          '3000 ANSI lümen ve üzeri',
        ]),
        alan('Görüntü girişi', ['HDMI', 'USB-C', 'VGA', 'Kablosuz']),
        ...elektronikBelgeleri,
      ];
    return [alan('Uyumluluk', ['Evrensel', 'Modele özel']), renk, ...elektronikBelgeleri];
  }
  if (altKategori === 'ses-sistemleri')
    return [
      alan('Bağlantı', ['Bluetooth', 'Wi-Fi', 'HDMI ARC / eARC', 'Optik', 'RCA', '3,5 mm', 'USB', 'Kablolu']),
      ...(marka === 'kulaklik'
        ? [varYok('Aktif gürültü engelleme'), varYok('Mikrofon')]
        : [
            alan('Ses düzeni', ['Mono', 'Stereo', '2.1', '3.1', '5.1', '7.1', 'Diğer']),
            alan('Güç kaynağı', ['Priz', 'Batarya', 'USB']),
          ]),
      renk,
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'kucuk-ev-aletleri' || (altKategori === 'mutfak' && marka === 'kucuk-ev-aleti')) {
    const ortak = [renk, ...elektronikBelgeleri];
    if (marka === 'supurge')
      return [
        alan('Güç kaynağı', ['Priz', 'Şarjlı']),
        alan('Toz haznesi', ['Torbalı', 'Torbasız']),
        varYok('Islak temizlik'),
        ...(model === 'robot-supurge'
          ? [
              alan('Navigasyon', ['Lazer / LiDAR', 'Kamera', 'Jiroskop', 'Rastgele']),
              varYok('Otomatik boşaltma istasyonu'),
            ]
          : []),
        ...ortak,
      ];
    if (model === 'kahve-makinesi')
      return [
        alan('Kahve türü', ['Türk kahvesi', 'Filtre kahve', 'Espresso', 'Kapsül']),
        alan('Çalışma', ['Manuel', 'Yarı otomatik', 'Tam otomatik']),
        varYok('Öğütücü'),
        varYok('Süt köpürtücü'),
        ...ortak,
      ];
    if (model === 'airfryer')
      return [
        alan('Hazne hacmi', ['2 L altı', '2 - 3,9 L', '4 - 5,9 L', '6 - 7,9 L', '8 L ve üzeri']),
        alan('Hazne sayısı', ['1', '2']),
        varYok('Dijital ekran'),
        ...ortak,
      ];
    return [
      alan('Güç', ['500 W altı', '500 - 999 W', '1000 - 1499 W', '1500 - 1999 W', '2000 W ve üzeri']),
      varYok('Ayarlanabilir hız / sıcaklık'),
      ...ortak,
    ];
  }
  if (altKategori === 'akilli-ev-guvenlik')
    return [
      alan('Bağlantı', ['Wi-Fi', 'Ethernet', 'Zigbee', 'Z-Wave', 'Bluetooth', 'Matter / Thread', 'Kablolu']),
      alan('Güç kaynağı', ['Priz', 'Pil', 'Şarjlı', 'PoE']),
      ...(marka === 'kamera'
        ? [
            alan('Çözünürlük', ['720p', '1080p', '2K', '4K']),
            varYok('Gece görüşü'),
            alan('Kullanım yeri', ['İç mekân', 'Dış mekân', 'İç ve dış mekân']),
          ]
        : [
            alan('Ekosistem', [
              'Apple Home',
              'Google Home',
              'Amazon Alexa',
              'Tuya / Smart Life',
              'Bağımsız',
              'Diğer',
            ]),
          ]),
      ...elektronikBelgeleri,
    ];
  if (altKategori === 'aydinlatma')
    return [
      alan('Duy tipi', ['E14', 'E27', 'GU10', 'G9', 'Dahilî LED', 'Diğer']),
      alan('Işık rengi', ['Sıcak beyaz', 'Doğal beyaz', 'Soğuk beyaz', 'Ayarlanabilir', 'RGB']),
      alan('Malzeme', ['Ahşap', 'Metal', 'Cam', 'Plastik', 'Kumaş', 'Seramik', 'Diğer']),
      alan('Montaj', ['Kurulu', 'Demonte', 'Gerekmiyor']),
      renk,
      kutu,
    ];
  if (altKategori === 'mobilya')
    return [
      alan('Kullanım alanı', [
        'Salon',
        'Yatak odası',
        'Mutfak',
        'Çalışma odası',
        'Çocuk odası',
        'Antre',
        'Bahçe',
      ]),
      alan('Malzeme', [
        'Masif ahşap',
        'Ahşap kaplama',
        'MDF',
        'Suntalam',
        'Metal',
        'Cam',
        'Kumaş',
        'Deri',
        'Diğer',
      ]),
      alan('Montaj', ['Kurulu', 'Demonte', 'Kurulum gerekmiyor']),
      ...(['koltuk', 'yatak'].includes(model)
        ? [alan('Kapasite', ['Tek kişilik', 'İki kişilik', '3 kişilik', '4 kişilik', 'Diğer'])]
        : []),
      renk,
    ];
  if (altKategori === 'ev-tekstili')
    return [
      alan('Malzeme', ['Pamuk', 'Keten', 'Yün', 'Polyester', 'Bambu', 'Viskon', 'Diğer']),
      alan(
        'Ölçü',
        model === 'hali'
          ? ['80 × 150 cm', '120 × 180 cm', '160 × 230 cm', '200 × 290 cm', '200 × 300 cm', 'Özel ölçü']
          : ['Tek kişilik', 'Çift kişilik', 'King size', 'Standart', 'Özel ölçü'],
      ),
      renk,
    ];
  if (altKategori === 'mutfak')
    return [
      alan('Malzeme', [
        'Paslanmaz çelik',
        'Döküm',
        'Seramik',
        'Porselen',
        'Cam',
        'Plastik',
        'Bakır',
        'Diğer',
      ]),
      alan('Adet', ['1', '2', '4', '6', '12', '18', '24', 'Diğer']),
      varYok('Bulaşık makinesine uygun'),
      renk,
      kutu,
    ];
  if (altKategori === 'bahce')
    return [
      alan('Güç kaynağı', ['Elektrikli', 'Akülü', 'Benzinli', 'Manuel', 'Gerektirmez']),
      ...(marka === 'el-aleti'
        ? [
            alan('Akü gerilimi', ['10,8 V', '12 V', '18 V', '20 V', '24 V', '36 V', 'Aküsüz']),
            varYok('Akü dahil'),
          ]
        : [alan('Malzeme', ['Ahşap', 'Metal', 'Plastik', 'Kompozit', 'Diğer'])]),
      renk,
      kutu,
      garanti,
    ];
  if (altKategori === 'temizlik-malzemeleri')
    return [
      alan('Malzeme', ['Plastik', 'Metal', 'Ahşap', 'Tekstil', 'Diğer']),
      alan('Kullanım yeri', ['Mutfak', 'Banyo', 'Çamaşır alanı', 'Genel kullanım']),
      renk,
    ];
  if (altKategori === 'ofis-kirtasiye')
    return marka === 'ofis'
      ? [alan('Güç kaynağı', ['Priz', 'Pil', 'Güneş enerjisi', 'Manuel']), renk, ...elektronikBelgeleri]
      : [
          alan('Malzeme', ['Kâğıt', 'Karton', 'Plastik', 'Metal', 'Diğer']),
          alan('Adet', ['1', '5', '10', '12', '24', '50', '100', 'Diğer']),
          renk,
        ];
  if (altKategori === 'el-isi-sanat')
    return [
      alan('Malzeme', ['Pamuk', 'Yün', 'Ahşap', 'Seramik', 'Cam', 'Tuval', 'Kâğıt', 'Diğer']),
      alan('Yapım', ['El yapımı', 'Makine yapımı']),
      renk,
    ];
  return [
    alan('Malzeme', ['Ahşap', 'Metal', 'Cam', 'Seramik', 'Taş', 'Kumaş', 'Plastik', 'Diğer']),
    alan('Stil', ['Modern', 'Klasik', 'İskandinav', 'Rustik', 'Vintage', 'Diğer']),
    renk,
  ];
}

function koleksiyonAlanlari({ altKategori, model = '' }: UrunSecimi): OzellikAlani[] {
  const durum = alan('Durum', ['Açılmamış', 'Çok iyi', 'İyi', 'Yıpranmış', 'Restorasyon görmüş']);
  const donem = alan('Dönem', [
    '1900 öncesi',
    '1900 - 1922',
    '1923 - 1950',
    '1951 - 1980',
    '1981 - 2000',
    '2001 ve sonrası',
    'Bilinmiyor',
  ]);
  if (altKategori === 'kol-saati')
    return [
      alan('Mekanizma', ['Otomatik', 'Kurmalı', 'Quartz', 'Dijital', 'Solar', 'Kinetik']),
      alan('Kasa malzemesi', ['Paslanmaz çelik', 'Titanyum', 'Altın', 'Plastik', 'Seramik', 'Diğer']),
      alan('Kasa çapı', ['28 mm altı', '28 - 35 mm', '36 - 39 mm', '40 - 42 mm', '43 mm ve üzeri']),
      alan('Su geçirmezlik', ['Yok', '3 ATM', '5 ATM', '10 ATM', '20 ATM ve üzeri']),
      alan('Kordon', ['Çelik', 'Deri', 'Silikon', 'Naylon', 'Diğer']),
      alan('Kadran', renkler),
      kutu,
      fatura,
    ];
  if (altKategori === 'plak')
    return [
      alan('Format', ['LP', 'EP', '45’lik', 'Taş plak']),
      alan('Devir', ['33⅓', '45', '78']),
      alan('Tür', [
        'Rock',
        'Pop',
        'Caz',
        'Klasik',
        'Türkçe pop',
        'Türk sanat müziği',
        'Türk halk müziği',
        'Elektronik',
        'Diğer',
      ]),
      alan('Plak durumu', ['Açılmamış', 'Çok iyi', 'İyi', 'Kullanım izi var']),
      alan('Kapak durumu', ['Çok iyi', 'İyi', 'Yıpranmış', 'Kapak yok']),
    ];
  if (altKategori === 'madeni-para')
    return [
      alan('Parça türü', ['Madeni para', 'Hatıra parası', 'Banknot', 'Madalya', 'Yabancı para']),
      alan('Dönem', ['Osmanlı', 'Cumhuriyet', 'Modern dönem', 'Diğer']),
      alan('Malzeme', ['Altın', 'Gümüş', 'Bakır', 'Nikel', 'Bronz', 'Kâğıt', 'Diğer']),
      alan('Durum', ['Dolaşıma girmemiş', 'Çok iyi', 'İyi', 'Yıpranmış']),
      varYok('Sertifika'),
    ];
  if (altKategori === 'pul')
    return [
      alan('Pul türü', ['Tek pul', 'Seri', 'Blok', 'İlk gün zarfı']),
      alan('Menşei', ['Türkiye', 'Osmanlı', 'Avrupa', 'Asya', 'Amerika', 'Afrika', 'Diğer']),
      alan('Damga', ['Damgasız', 'Damgalı']),
      alan('Yıl aralığı', ['1923 öncesi', '1923 - 1950', '1951 - 1980', '1981 ve sonrası']),
      durum,
    ];
  if (altKategori === 'kart')
    return [
      alan('Kart türü', ['Futbol', 'Basketbol', 'Pokémon', 'Diğer TCG']),
      alan('Dil', ['Türkçe', 'İngilizce', 'Japonca', 'Diğer']),
      alan('Durum', ['Kılıflı', 'Çok iyi', 'İyi', 'Kullanım izi var']),
      varYok('Derecelendirme sertifikası'),
    ];
  if (altKategori === 'oyuncak')
    return [
      alan(
        'Ölçek',
        model.startsWith('lego')
          ? ['Ölçek belirtilmemiş']
          : ['1:18', '1:24', '1:32', '1:43', '1:64', '1:72', '1:87', 'Ölçek belirtilmemiş'],
      ),
      alan('Durum', ['Açılmamış', 'Kurulmuş', 'Eksiksiz', 'Eksik parça var', 'Hasarlı']),
      kutu,
      alan('Malzeme', ['Metal', 'Plastik', 'Reçine', 'Ahşap', 'Diğer']),
    ];
  if (altKategori === 'kitap-cizgi-roman')
    return [
      alan('Dil', ['Türkçe', 'İngilizce', 'Japonca', 'Diğer']),
      alan('Baskı', ['İlk baskı', 'Özel baskı', 'Standart baskı']),
      alan('Cilt', ['Ciltli', 'Karton kapak', 'Deri cilt']),
      alan('Satış', ['Tek eser', 'Seri / set']),
      durum,
    ];
  if (altKategori === 'imzali-urun')
    return [
      alan('İmza', ['Islak imza', 'Baskı imza']),
      varYok('Orijinallik belgesi'),
      varYok('Çerçeve'),
      durum,
    ];
  if (altKategori === 'kartpostal-poster')
    return [
      donem,
      alan('Baskı', ['Orijinal dönem baskısı', 'Yeniden basım']),
      alan('Durum', ['Kullanılmamış', 'Yazılı / gönderilmiş', 'İyi', 'Yıpranmış']),
      varYok('Çerçeve'),
    ];
  if (altKategori === 'yazili-basili-urun')
    return [
      donem,
      alan('Dil', ['Türkçe', 'Osmanlıca', 'İngilizce', 'Fransızca', 'Almanca', 'Diğer']),
      alan('Satış', ['Tek parça', 'Set / lot']),
      durum,
    ];
  if (altKategori === 'kalem')
    return [
      alan('Kalem türü', ['Dolmakalem', 'Tükenmez', 'Roller', 'Mekanik kalem']),
      alan('Gövde malzemesi', ['Reçine', 'Metal', 'Ahşap', 'Plastik', 'Diğer']),
      alan('Uç', ['EF', 'F', 'M', 'B', 'Kaligrafi', '0,5 mm', '0,7 mm', 'Diğer']),
      alan('Dolum', ['Kartuş', 'Piston', 'Konvertör', 'Yedek uç / refill', 'Diğer']),
      renk,
      kutu,
    ];
  return [
    donem,
    alan('Malzeme', ['Ahşap', 'Metal', 'Cam', 'Seramik', 'Kâğıt', 'Taş', 'Tekstil', 'Diğer']),
    durum,
    varYok('Belge / sertifika'),
  ];
}

/** İlan formu ve arama aynı tanımları kullanır; alt ürün seçildikçe yalnızca ilgili alanlar döner. */
export function ozellikAlanlari(secim: UrunSecimi): OzellikAlani[] {
  if (!secim.altKategori || !kategoriAgaci[secim.kategori]?.some((dal) => dal.id === secim.altKategori))
    return [];
  switch (secim.kategori) {
    case 'telefon':
      return telefonAlanlari(secim);
    case 'bilgisayar':
      return bilgisayarAlanlari(secim);
    case 'oyun':
      return oyunAlanlari(secim);
    case 'moda':
      return modaAlanlari(secim);
    case 'fotograf':
      return fotografAlanlari(secim);
    case 'otomotiv':
      return otomotivAlanlari(secim);
    case 'ev':
      return evAlanlari(secim);
    case 'koleksiyon':
      return koleksiyonAlanlari(secim);
    case 'is-ilanlari':
    case 'emlak':
    case 'hizmetler':
      return ilanOzellikAlanlari(secim);
    default:
      return ekOzellikAlanlari(secim);
  }
}

/** Tür seçilmeden yalnızca o dalın bütün ürünlerinde anlamlı olan filtreler gösterilir. */
export function ozellikFiltreAlanlari(secim: UrunSecimi): OzellikAlani[] {
  if (secim.model) return ozellikAlanlari(secim);
  const dal = kategoriAgaci[secim.kategori]?.find((dal) => dal.id === secim.altKategori);
  if (!dal) return [];
  const gruplar = dal.markalar.filter((marka) => !secim.marka || marka.id === secim.marka);
  const tanimlar = gruplar.flatMap((marka) =>
    marka.modeller.length
      ? marka.modeller.map((model) => ozellikAlanlari({ ...secim, marka: marka.id, model: model.id }))
      : [ozellikAlanlari({ ...secim, marka: marka.id })],
  );
  if (!tanimlar.length) return ozellikAlanlari(secim);
  return (tanimlar[0] ?? [])
    .filter((alan) => tanimlar.every((tanim) => tanim.some((aday) => aday.ad === alan.ad)))
    .map((alan) => {
      const ayniAlanlar = tanimlar.flatMap((tanim) => tanim.filter((aday) => aday.ad === alan.ad));
      return {
        ...alan,
        secenekler: [...new Set(ayniAlanlar.flatMap((aday) => aday.secenekler))],
        ...(alan.filtreSecenekleri
          ? {
              filtreSecenekleri: [
                ...new Map(
                  ayniAlanlar
                    .flatMap((aday) => aday.filtreSecenekleri ?? [])
                    .map((secenek) => [secenek.id, secenek]),
                ).values(),
              ],
            }
          : {}),
      };
    });
}

/** Kategori veya model değiştiğinde artık geçerli olmayan teknik bilgiler silinir. */
export function ozellikleriTemizle(alanlar: readonly OzellikAlani[], degerler: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(degerler).filter(([ad, deger]) => {
      const tanim = alanlar.find((a) => a.ad === ad);
      if (!tanim || !deger) return false;
      if (tanim.sayisal)
        return /^\d+$/.test(deger) && Number(deger) <= (tanim.enCok ?? Number.MAX_SAFE_INTEGER);
      return tanim.secenekler.includes(deger);
    }),
  );
}
