import { kategoriler, type Ilan, type Kategori } from './ilanlar.ts';
import { ekKategoriler } from './ekKategoriler.ts';

export type KategoriSecenegi = { id: string; ad: string };
type Marka = KategoriSecenegi & { modeller: KategoriSecenegi[] };
export type AltKategori = KategoriSecenegi & {
  markalar: Marka[];
  markaBasligi?: string;
  modelBasligi?: string;
};
export type KategoriAgaci = Record<Kategori, AltKategori[]>;
const secenek = (id: string, ad: string): KategoriSecenegi => ({ id, ad });
const marka = (id: string, ad: string, modeller: KategoriSecenegi[] = []): Marka => ({ id, ad, modeller });
const dal = (
  id: string,
  ad: string,
  markalar: Marka[],
  basliklar: Pick<AltKategori, 'markaBasligi' | 'modelBasligi'> = {},
): AltKategori => ({ id, ad, markalar, ...basliklar });
const urunler = (...degerler: [string, string][]) => degerler.map(([id, ad]) => secenek(id, ad));
const kategoriBasliklari: Record<
  Kategori,
  { altKategoriBasligi: string; markaBasligi: string; modelBasligi: string }
> = {
  telefon: { altKategoriBasligi: 'Alt kategoriler', markaBasligi: 'Markalar', modelBasligi: 'Modeller' },
  bilgisayar: {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Markalar',
    modelBasligi: 'Seri / model',
  },
  oyun: { altKategoriBasligi: 'Alt kategoriler', markaBasligi: 'Markalar', modelBasligi: 'Seri / model' },
  ev: { altKategoriBasligi: 'Ürün grupları', markaBasligi: 'Marka / seri', modelBasligi: 'Ürün' },
  moda: { altKategoriBasligi: 'Ürün grupları', markaBasligi: 'Markalar', modelBasligi: 'Model / tür' },
  fotograf: {
    altKategoriBasligi: 'Ekipman türleri',
    markaBasligi: 'Markalar',
    modelBasligi: 'Seri / model',
  },
  otomotiv: { altKategoriBasligi: 'Araç türleri', markaBasligi: 'Markalar', modelBasligi: 'Modeller' },
  koleksiyon: {
    altKategoriBasligi: 'Koleksiyon türleri',
    markaBasligi: 'Marka / dönem',
    modelBasligi: 'Seri / parça',
  },
  spor: { altKategoriBasligi: 'Spor dalları', markaBasligi: 'Ürün grupları', modelBasligi: 'Ürün türleri' },
  'anne-bebek': {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  muzik: {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  kitap: { altKategoriBasligi: 'Alt kategoriler', markaBasligi: 'Türler', modelBasligi: 'Alt türler' },
  hobi: {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  bahce: {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  'kisisel-bakim': {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  'teknik-elektronik': {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  ofis: {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
  antika: {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Ürün grupları',
    modelBasligi: 'Ürün türleri',
  },
};

export const kategoriAgaci: KategoriAgaci = {
  ...ekKategoriler,
  telefon: [
    {
      id: 'cep-telefonu',
      ad: 'Cep telefonu',
      markalar: [
        {
          id: 'apple',
          ad: 'Apple',
          modeller: [
            secenek('iphone-15-pro', 'iPhone 15 Pro'),
            secenek('iphone-15', 'iPhone 15'),
            secenek('iphone-15-pro-max', 'iPhone 15 Pro Max'),
            secenek('iphone-14', 'iPhone 14'),
            secenek('iphone-14-pro', 'iPhone 14 Pro'),
            secenek('iphone-14-pro-max', 'iPhone 14 Pro Max'),
            secenek('iphone-13', 'iPhone 13'),
            secenek('iphone-13-pro', 'iPhone 13 Pro'),
            secenek('iphone-12', 'iPhone 12'),
            secenek('iphone-11', 'iPhone 11'),
          ],
        },
        {
          id: 'samsung',
          ad: 'Samsung',
          modeller: [
            secenek('galaxy-s23-ultra', 'Galaxy S23 Ultra'),
            secenek('galaxy-s23', 'Galaxy S23'),
            secenek('galaxy-s24', 'Galaxy S24'),
            secenek('galaxy-s22', 'Galaxy S22'),
            secenek('galaxy-a54', 'Galaxy A54'),
          ],
        },
        {
          id: 'xiaomi',
          ad: 'Xiaomi',
          modeller: [
            secenek('13t-pro', '13T Pro'),
            secenek('13t', '13T'),
            secenek('redmi-note-13', 'Redmi Note 13'),
            secenek('redmi-note-12', 'Redmi Note 12'),
          ],
        },
        {
          id: 'google',
          ad: 'Google',
          modeller: [
            secenek('pixel-7', 'Pixel 7'),
            secenek('pixel-8', 'Pixel 8'),
            secenek('pixel-7-pro', 'Pixel 7 Pro'),
          ],
        },
        {
          id: 'nothing',
          ad: 'Nothing',
          modeller: [
            secenek('phone-2', 'Phone (2)'),
            secenek('phone-1', 'Phone (1)'),
            secenek('phone-2a', 'Phone (2a)'),
          ],
        },
      ],
    },
  ],
  bilgisayar: [
    {
      id: 'dizustu',
      ad: 'Dizüstü bilgisayar',
      markalar: [
        {
          id: 'lenovo',
          ad: 'Lenovo',
          modeller: [secenek('thinkpad', 'ThinkPad'), secenek('ideapad', 'IdeaPad')],
        },
        {
          id: 'asus',
          ad: 'ASUS',
          modeller: [secenek('vivobook', 'VivoBook'), secenek('zenbook', 'ZenBook')],
        },
        {
          id: 'hp',
          ad: 'HP',
          modeller: [secenek('pavilion', 'Pavilion'), secenek('elitebook', 'EliteBook')],
        },
        {
          id: 'apple',
          ad: 'Apple',
          modeller: [
            secenek('macbook-air-m2', 'MacBook Air M2'),
            secenek('macbook-air-m1', 'MacBook Air M1'),
            secenek('macbook-pro-m2', 'MacBook Pro M2'),
          ],
        },
      ],
    },
  ],
  oyun: [
    {
      id: 'oyun-konsolu',
      ad: 'Oyun konsolu',
      markalar: [
        {
          id: 'sony',
          ad: 'Sony',
          modeller: [secenek('playstation-5', 'PlayStation 5'), secenek('playstation-4', 'PlayStation 4')],
        },
        {
          id: 'microsoft',
          ad: 'Microsoft',
          modeller: [secenek('xbox-series-s', 'Xbox Series S'), secenek('xbox-series-x', 'Xbox Series X')],
        },
        {
          id: 'nintendo',
          ad: 'Nintendo',
          modeller: [secenek('switch', 'Switch'), secenek('switch-oled', 'Switch OLED')],
        },
      ],
    },
  ],
  moda: [
    {
      id: 'spor-ayakkabi',
      ad: 'Spor ayakkabı',
      markalar: [
        {
          id: 'nike',
          ad: 'Nike',
          modeller: [
            secenek('air-jordan-4', 'Air Jordan 4'),
            secenek('air-force-1', 'Air Force 1'),
            secenek('dunk-low', 'Dunk Low'),
          ],
        },
        {
          id: 'adidas',
          ad: 'adidas',
          modeller: [
            secenek('samba', 'Samba'),
            secenek('gazelle', 'Gazelle'),
            secenek('stan-smith', 'Stan Smith'),
          ],
        },
        { id: 'new-balance', ad: 'New Balance', modeller: [secenek('530', '530'), secenek('574', '574')] },
      ],
    },
  ],
  fotograf: [
    {
      id: 'dijital-fotograf-makinesi',
      ad: 'Dijital fotoğraf makinesi',
      markalar: [
        { id: 'fujifilm', ad: 'Fujifilm', modeller: [secenek('x100v', 'X100V'), secenek('x-t4', 'X-T4')] },
        {
          id: 'canon',
          ad: 'Canon',
          modeller: [secenek('eos-r50', 'EOS R50'), secenek('eos-250d', 'EOS 250D')],
        },
        { id: 'sony', ad: 'Sony', modeller: [secenek('a6400', 'a6400'), secenek('a7-iii', 'a7 III')] },
      ],
    },
  ],
  otomotiv: [
    {
      id: 'motosiklet',
      ad: 'Motosiklet',
      markalar: [
        {
          id: 'kawasaki',
          ad: 'Kawasaki',
          modeller: [secenek('ninja-250', 'Ninja 250'), secenek('z250', 'Z250')],
        },
        {
          id: 'honda',
          ad: 'Honda',
          modeller: [secenek('cbr-250r', 'CBR 250R'), secenek('pcx-125', 'PCX 125')],
        },
        {
          id: 'yamaha',
          ad: 'Yamaha',
          modeller: [secenek('mt-25', 'MT-25'), secenek('nmax-125', 'NMAX 125')],
        },
      ],
    },
  ],
  ev: [
    {
      id: 'aydinlatma',
      ad: 'Aydınlatma',
      markalar: [{ id: 'markasiz', ad: 'Markasız', modeller: [secenek('masa-lambasi', 'Masa lambası')] }],
    },
  ],
  koleksiyon: [
    {
      id: 'kol-saati',
      ad: 'Kol saati',
      markalar: [{ id: 'markasiz', ad: 'Markasız', modeller: [secenek('otomatik-saat', 'Otomatik saat')] }],
    },
  ],
};

// Var olan alt kategori kimlikleri korunur; katalog seçenekleri ilan sayısından bağımsızdır.
kategoriAgaci.bilgisayar.push({
  id: 'tablet',
  ad: 'Tablet',
  markalar: [
    {
      id: 'apple',
      ad: 'Apple',
      modeller: [
        secenek('ipad-9', 'iPad (9. nesil)'),
        secenek('ipad-10', 'iPad (10. nesil)'),
        secenek('ipad-air', 'iPad Air'),
      ],
    },
    {
      id: 'samsung',
      ad: 'Samsung',
      modeller: [secenek('galaxy-tab-s9', 'Galaxy Tab S9'), secenek('galaxy-tab-a9', 'Galaxy Tab A9')],
    },
  ],
});
kategoriAgaci.ev.push({
  id: 'mobilya',
  ad: 'Mobilya',
  markalar: [
    {
      id: 'ikea',
      ad: 'IKEA',
      modeller: [secenek('malm', 'MALM'), secenek('billy', 'BILLY'), secenek('kallax', 'KALLAX')],
    },
    {
      id: 'markasiz',
      ad: 'Markasız',
      modeller: urunler(
        ['koltuk', 'Koltuk'],
        ['yatak', 'Yatak'],
        ['dolap', 'Dolap'],
        ['masa', 'Masa'],
        ['sandalye', 'Sandalye'],
      ),
    },
  ],
});
kategoriAgaci.moda.push({
  id: 'giyim',
  ad: 'Giyim',
  markalar: [
    {
      id: 'zara',
      ad: 'Zara',
      modeller: urunler(
        ['tisort', 'Tişört'],
        ['gomlek', 'Gömlek'],
        ['pantolon', 'Pantolon'],
        ['elbise', 'Elbise'],
      ),
    },
    {
      id: 'mango',
      ad: 'Mango',
      modeller: urunler(
        ['tisort', 'Tişört'],
        ['gomlek', 'Gömlek'],
        ['pantolon', 'Pantolon'],
        ['elbise', 'Elbise'],
      ),
    },
    {
      id: 'hm',
      ad: 'H&M',
      modeller: urunler(
        ['tisort', 'Tişört'],
        ['gomlek', 'Gömlek'],
        ['pantolon', 'Pantolon'],
        ['elbise', 'Elbise'],
      ),
    },
    {
      id: 'markasiz',
      ad: 'Markasız',
      modeller: urunler(
        ['tisort', 'Tişört'],
        ['gomlek', 'Gömlek'],
        ['pantolon', 'Pantolon'],
        ['elbise', 'Elbise'],
      ),
    },
  ],
  modelBasligi: 'Ürün türü',
});
kategoriAgaci.koleksiyon.push({
  id: 'plak',
  ad: 'Plak',
  markalar: [
    {
      id: 'diger',
      ad: 'Diğer',
      modeller: urunler(['lp', 'LP'], ['ep', 'EP'], ['tekli', '45’lik'], ['tas-plak', 'Taş plak']),
    },
  ],
  modelBasligi: 'Plak formatı',
});

// Kategori gezintisi ilan sayısından bağımsız tutulur; yeni bir dal ilan beklemeden bulunabilir.
kategoriAgaci.telefon.push(
  dal('yenilenmis-telefon', 'Yenilenmiş telefon', [
    marka(
      'apple',
      'Apple',
      urunler(['iphone-13', 'iPhone 13'], ['iphone-14', 'iPhone 14'], ['iphone-15', 'iPhone 15']),
    ),
    marka(
      'samsung',
      'Samsung',
      urunler(['galaxy-s22', 'Galaxy S22'], ['galaxy-s23', 'Galaxy S23'], ['galaxy-a54', 'Galaxy A54']),
    ),
  ]),
  dal('giyilebilir-teknoloji', 'Giyilebilir teknoloji', [
    marka('apple', 'Apple', urunler(['watch-series-9', 'Watch Series 9'], ['watch-se', 'Watch SE'])),
    marka(
      'samsung',
      'Samsung',
      urunler(['galaxy-watch-6', 'Galaxy Watch6'], ['galaxy-fit-3', 'Galaxy Fit3']),
    ),
    marka('garmin', 'Garmin', urunler(['venu-3', 'Venu 3'], ['forerunner-265', 'Forerunner 265'])),
  ]),
  dal(
    'aksesuar',
    'Aksesuar',
    [
      marka(
        'kilif',
        'Kılıf',
        urunler(['telefon-kilifi', 'Telefon kılıfı'], ['tablet-kilifi', 'Tablet kılıfı']),
      ),
      marka(
        'ekran-koruyucu',
        'Ekran koruyucu',
        urunler(['temperli-cam', 'Temperli cam'], ['hidrojel', 'Hidrojel film']),
      ),
      marka(
        'sarj',
        'Şarj ve bağlantı',
        urunler(
          ['sarj-adaptoru', 'Şarj adaptörü'],
          ['sarj-kablosu', 'Şarj kablosu'],
          ['powerbank', 'Powerbank'],
        ),
      ),
      marka(
        'ses',
        'Kulaklık ve ses',
        urunler(['bluetooth-kulaklik', 'Bluetooth kulaklık'], ['kablolu-kulaklik', 'Kablolu kulaklık']),
      ),
      marka(
        'diger',
        'Diğer aksesuarlar',
        urunler(['telefon-tutucu', 'Telefon tutucu'], ['kamera-lensi', 'Telefon lensi']),
      ),
    ],
    { markaBasligi: 'Aksesuar türü', modelBasligi: 'Ürün' },
  ),
  dal(
    'yedek-parca',
    'Yedek parça',
    [
      marka(
        'ekran',
        'Ekran',
        urunler(['orijinal-ekran', 'Orijinal ekran'], ['muadil-ekran', 'Muadil ekran']),
      ),
      marka('batarya', 'Batarya', urunler(['telefon-bataryasi', 'Telefon bataryası'])),
      marka(
        'diger',
        'Diğer parçalar',
        urunler(['kamera-modulu', 'Kamera modülü'], ['sarj-soketi', 'Şarj soketi']),
      ),
    ],
    { markaBasligi: 'Parça türü', modelBasligi: 'Ürün' },
  ),
);

kategoriAgaci.bilgisayar.push(
  dal('masaustu', 'Masaüstü bilgisayar', [
    marka(
      'toplama',
      'Toplama bilgisayar',
      urunler(['oyun-bilgisayari', 'Oyun bilgisayarı'], ['is-istasyonu', 'İş istasyonu']),
    ),
    marka(
      'apple',
      'Apple',
      urunler(['mac-mini', 'Mac mini'], ['imac', 'iMac'], ['mac-studio', 'Mac Studio']),
    ),
    marka('lenovo', 'Lenovo', urunler(['thinkcentre', 'ThinkCentre'])),
    marka('hp', 'HP', urunler(['prodesk', 'ProDesk'], ['omen-desktop', 'OMEN'])),
  ]),
  dal('monitor', 'Monitör', [
    marka('lg', 'LG', urunler(['ultragear', 'UltraGear'], ['ultrafine', 'UltraFine'])),
    marka('samsung', 'Samsung', urunler(['odyssey', 'Odyssey'], ['viewfinity', 'ViewFinity'])),
    marka('asus', 'ASUS', urunler(['rog-monitor', 'ROG'], ['tuf-monitor', 'TUF Gaming'])),
    marka('dell', 'Dell', urunler(['ultrasharp', 'UltraSharp'], ['alienware-monitor', 'Alienware'])),
  ]),
  dal(
    'bilgisayar-parcalari',
    'Bilgisayar parçaları',
    [
      marka('islemci', 'İşlemci', urunler(['intel-core', 'Intel Core'], ['amd-ryzen', 'AMD Ryzen'])),
      marka(
        'ekran-karti',
        'Ekran kartı',
        urunler(['nvidia-geforce', 'NVIDIA GeForce'], ['amd-radeon', 'AMD Radeon']),
      ),
      marka('ram', 'Bellek (RAM)', urunler(['ddr4', 'DDR4'], ['ddr5', 'DDR5'])),
      marka('depolama', 'Depolama', urunler(['ssd', 'SSD'], ['hdd', 'Sabit disk'])),
      marka(
        'anakart',
        'Anakart',
        urunler(['intel-anakart', 'Intel platformu'], ['amd-anakart', 'AMD platformu']),
      ),
      marka(
        'diger',
        'Diğer parçalar',
        urunler(['guc-kaynagi', 'Güç kaynağı'], ['sogutma', 'Soğutma'], ['kasa', 'Bilgisayar kasası']),
      ),
    ],
    { markaBasligi: 'Parça türü', modelBasligi: 'Platform / seri' },
  ),
  dal(
    'cevre-birimleri',
    'Çevre birimleri',
    [
      marka(
        'klavye',
        'Klavye',
        urunler(['mekanik-klavye', 'Mekanik klavye'], ['kablosuz-klavye', 'Kablosuz klavye']),
      ),
      marka('fare', 'Fare', urunler(['oyun-faresi', 'Oyun faresi'], ['ofis-faresi', 'Ofis faresi'])),
      marka(
        'kulaklik',
        'Kulaklık',
        urunler(['oyun-kulakligi', 'Oyun kulaklığı'], ['mikrofonlu-kulaklik', 'Mikrofonlu kulaklık']),
      ),
      marka(
        'yazici',
        'Yazıcı ve tarayıcı',
        urunler(['lazer-yazici', 'Lazer yazıcı'], ['tankli-yazici', 'Tanklı yazıcı']),
      ),
    ],
    { markaBasligi: 'Ürün türü', modelBasligi: 'Tür' },
  ),
  dal(
    'ag-ekipmanlari',
    'Ağ ekipmanları',
    [
      marka('modem', 'Modem', urunler(['adsl-modem', 'ADSL modem'], ['vdsl-modem', 'VDSL modem'])),
      marka('router', 'Router', urunler(['wifi-6-router', 'Wi-Fi 6 router'], ['mesh-router', 'Mesh sistem'])),
      marka('diger', 'Diğer ağ ekipmanları', urunler(['switch', 'Switch'], ['access-point', 'Access point'])),
    ],
    { markaBasligi: 'Ürün türü', modelBasligi: 'Tür' },
  ),
  dal(
    'sunucu',
    'Sunucu ve depolama',
    [
      marka('sunucu', 'Sunucu', urunler(['rack-sunucu', 'Rack sunucu'], ['tower-sunucu', 'Tower sunucu'])),
      marka('nas', 'NAS ve yedekleme', urunler(['nas', 'NAS'], ['harici-depolama', 'Harici depolama'])),
    ],
    { markaBasligi: 'Ürün türü', modelBasligi: 'Tür' },
  ),
);

kategoriAgaci.oyun.push(
  dal('oyun-bilgisayari', 'Oyun bilgisayarı', [
    marka('asus', 'ASUS', urunler(['rog-laptop', 'ROG'], ['tuf-gaming', 'TUF Gaming'])),
    marka('lenovo', 'Lenovo', urunler(['legion', 'Legion'], ['loq', 'LOQ'])),
    marka('msi', 'MSI', urunler(['katana', 'Katana'], ['raider', 'Raider'])),
    marka('toplama', 'Toplama sistem', urunler(['masaustu-oyun', 'Masaüstü'], ['dizustu-oyun', 'Dizüstü'])),
  ]),
  dal(
    'oyun-ekipmanlari',
    'Oyun ekipmanları',
    [
      marka(
        'kol',
        'Kontrolcü',
        urunler(['dualsense', 'DualSense'], ['xbox-controller', 'Xbox kontrolcüsü'], ['joy-con', 'Joy-Con']),
      ),
      marka('kulaklik', 'Kulaklık', urunler(['oyun-kulakligi', 'Oyun kulaklığı'])),
      marka(
        'klavye-fare',
        'Klavye ve fare',
        urunler(['mekanik-klavye', 'Mekanik klavye'], ['oyun-faresi', 'Oyun faresi']),
      ),
      marka(
        'diger',
        'Diğer ekipmanlar',
        urunler(['direksiyon-seti', 'Direksiyon seti'], ['oyun-koltugu', 'Oyun koltuğu']),
      ),
    ],
    { markaBasligi: 'Ekipman türü', modelBasligi: 'Ürün' },
  ),
  dal(
    'bilgisayar-oyunu',
    'Bilgisayar oyunları',
    [
      marka('steam', 'Steam', urunler(['pc-oyun-kodu', 'Oyun kodu'], ['pc-oyun-disk', 'Fiziksel oyun'])),
      marka('diger', 'Diğer platformlar', urunler(['pc-oyun', 'Bilgisayar oyunu'])),
    ],
    { markaBasligi: 'Platform', modelBasligi: 'Oyun türü' },
  ),
  dal(
    'konsol-oyunu',
    'Konsol oyunları',
    [
      marka('playstation', 'PlayStation', urunler(['ps5-oyun', 'PS5 oyunu'], ['ps4-oyun', 'PS4 oyunu'])),
      marka(
        'xbox',
        'Xbox',
        urunler(['xbox-series-oyun', 'Xbox Series oyunu'], ['xbox-one-oyun', 'Xbox One oyunu']),
      ),
      marka('nintendo', 'Nintendo', urunler(['switch-oyun', 'Switch oyunu'])),
    ],
    { markaBasligi: 'Platform', modelBasligi: 'Oyun türü' },
  ),
  dal('sanal-gerceklik', 'Sanal gerçeklik', [
    marka('meta', 'Meta', urunler(['quest-2', 'Quest 2'], ['quest-3', 'Quest 3'])),
    marka('sony', 'Sony', urunler(['ps-vr2', 'PlayStation VR2'])),
    marka('diger', 'Diğer', urunler(['vr-gozluk', 'VR başlığı'], ['vr-aksesuar', 'VR aksesuarı'])),
  ]),
);

kategoriAgaci.ev.push(
  dal(
    'dekorasyon',
    'Ev dekorasyonu',
    [
      marka(
        'duvar',
        'Duvar dekoru',
        urunler(['tablo', 'Tablo'], ['ayna', 'Ayna'], ['duvar-saati', 'Duvar saati']),
      ),
      marka(
        'aksesuar',
        'Dekoratif aksesuar',
        urunler(['vazo', 'Vazo'], ['heykel', 'Heykel'], ['mumluk', 'Mumluk']),
      ),
      marka('markasiz', 'Diğer', urunler(['dekoratif-urun', 'Dekoratif ürün'])),
    ],
    { markaBasligi: 'Ürün grubu', modelBasligi: 'Ürün türü' },
  ),
  dal(
    'ev-tekstili',
    'Ev tekstili',
    [
      marka(
        'yatak-odasi',
        'Yatak odası',
        urunler(['nevresim', 'Nevresim takımı'], ['yorgan', 'Yorgan'], ['yastik', 'Yastık']),
      ),
      marka('salon', 'Salon ve perde', urunler(['perde', 'Perde'], ['hali', 'Halı'], ['kirlent', 'Kırlent'])),
      marka('banyo', 'Banyo', urunler(['havlu', 'Havlu'], ['banyo-paspasi', 'Banyo paspası'])),
    ],
    { markaBasligi: 'Kullanım alanı', modelBasligi: 'Ürün türü' },
  ),
  dal(
    'mutfak',
    'Mutfak',
    [
      marka(
        'sofra',
        'Sofra ve servis',
        urunler(
          ['yemek-takimi', 'Yemek takımı'],
          ['catal-kasik', 'Çatal bıçak takımı'],
          ['bardak', 'Bardak'],
        ),
      ),
      marka(
        'kucuk-ev-aleti',
        'Küçük ev aleti',
        urunler(
          ['kahve-makinesi', 'Kahve makinesi'],
          ['blender', 'Blender'],
          ['tost-makinesi', 'Tost makinesi'],
        ),
      ),
      marka(
        'markasiz',
        'Diğer mutfak ürünleri',
        urunler(['tencere', 'Tencere'], ['mutfak-gereci', 'Mutfak gereci']),
      ),
    ],
    { markaBasligi: 'Ürün grubu', modelBasligi: 'Ürün türü' },
  ),
  dal(
    'beyaz-esya',
    'Beyaz eşya',
    [
      marka('buzdolabi', 'Buzdolabı', urunler(['buzdolabi', 'Buzdolabı'])),
      marka(
        'camasir',
        'Çamaşır ve kurutma',
        urunler(['camasir-makinesi', 'Çamaşır makinesi'], ['kurutma-makinesi', 'Kurutma makinesi']),
      ),
      marka('bulasik', 'Bulaşık makinesi', urunler(['bulasik-makinesi', 'Bulaşık makinesi'])),
      marka(
        'markasiz',
        'Diğer beyaz eşya',
        urunler(['firin', 'Fırın'], ['ocak', 'Ocak'], ['klima', 'Klima']),
      ),
    ],
    { markaBasligi: 'Ürün türü', modelBasligi: 'Tür' },
  ),
  dal(
    'bahce',
    'Bahçe ve yapı',
    [
      marka(
        'bahce',
        'Bahçe',
        urunler(
          ['bahce-mobilyasi', 'Bahçe mobilyası'],
          ['bahce-aleti', 'Bahçe aleti'],
          ['sulama', 'Sulama ekipmanı'],
        ),
      ),
      marka(
        'el-aleti',
        'El aletleri',
        urunler(['matkap', 'Matkap'], ['taslama', 'Taşlama'], ['testere', 'Testere']),
      ),
      marka('markasiz', 'Yapı malzemesi', urunler(['boya', 'Boya'], ['tesisat', 'Tesisat malzemesi'])),
    ],
    { markaBasligi: 'Ürün grubu', modelBasligi: 'Ürün türü' },
  ),
);

kategoriAgaci.moda.push(
  dal(
    'ayakkabi',
    'Ayakkabı',
    [
      marka(
        'nike',
        'Nike',
        urunler(['nike-air-max', 'Air Max'], ['nike-dunk', 'Dunk'], ['nike-air-force', 'Air Force 1']),
      ),
      marka(
        'adidas',
        'adidas',
        urunler(['adidas-samba', 'Samba'], ['adidas-gazelle', 'Gazelle'], ['adidas-campus', 'Campus']),
      ),
      marka('new-balance', 'New Balance', urunler(['new-balance-530', '530'], ['new-balance-574', '574'])),
      marka(
        'markasiz',
        'Diğer markalar',
        urunler(['gunluk-ayakkabi', 'Günlük ayakkabı'], ['bot', 'Bot'], ['sandalet', 'Sandalet']),
      ),
    ],
    { modelBasligi: 'Model' },
  ),
  dal(
    'canta',
    'Çanta',
    [
      marka('eastpak', 'Eastpak', urunler(['padded-pakr', 'Padded Pak’r'])),
      marka('herschel', 'Herschel', urunler(['little-america', 'Little America'])),
      marka(
        'markasiz',
        'Diğer markalar',
        urunler(['sirt-cantasi', 'Sırt çantası'], ['omuz-cantasi', 'Omuz çantası'], ['cuzdan', 'Cüzdan']),
      ),
    ],
    { modelBasligi: 'Model / tür' },
  ),
  dal('dis-giyim', 'Dış giyim', [
    marka('north-face', 'The North Face', urunler(['nuptse', 'Nuptse'], ['denali', 'Denali'])),
    marka('columbia', 'Columbia', urunler(['powder-lite', 'Powder Lite'])),
    marka('markasiz', 'Diğer markalar', urunler(['mont', 'Mont'], ['kaban', 'Kaban'], ['ceket', 'Ceket'])),
  ]),
  dal('spor-giyim', 'Spor giyim', [
    marka('nike', 'Nike', urunler(['nike-dri-fit', 'Dri-FIT'])),
    marka('adidas', 'adidas', urunler(['adidas-essentials', 'Essentials'])),
    marka(
      'markasiz',
      'Diğer markalar',
      urunler(['esofman', 'Eşofman'], ['forma', 'Forma'], ['tayt', 'Tayt']),
    ),
  ]),
  dal(
    'aksesuar',
    'Moda aksesuarı',
    [
      marka('gunes-gozlugu', 'Güneş gözlüğü', urunler(['gozluk', 'Güneş gözlüğü'])),
      marka('takilar', 'Takı', urunler(['kolye', 'Kolye'], ['bileklik', 'Bileklik'], ['yuzuk', 'Yüzük'])),
      marka(
        'markasiz',
        'Diğer aksesuarlar',
        urunler(['kemer', 'Kemer'], ['sapka', 'Şapka'], ['saat', 'Saat']),
      ),
    ],
    { markaBasligi: 'Aksesuar türü', modelBasligi: 'Ürün' },
  ),
);

kategoriAgaci.fotograf.push(
  dal('analog-fotograf-makinesi', 'Analog fotoğraf makinesi', [
    marka('canon', 'Canon', urunler(['ae-1', 'AE-1'], ['a-1', 'A-1'])),
    marka('nikon', 'Nikon', urunler(['fm2', 'FM2'], ['f3', 'F3'])),
    marka('fujifilm', 'Fujifilm', urunler(['instax-mini-12', 'Instax Mini 12'])),
  ]),
  dal(
    'kamera-lensi',
    'Fotoğraf makinesi lensi',
    [
      marka('canon', 'Canon', urunler(['rf-lens', 'RF serisi'], ['ef-lens', 'EF serisi'])),
      marka('sony', 'Sony', urunler(['fe-lens', 'FE serisi'], ['e-lens', 'E serisi'])),
      marka('nikon', 'Nikon', urunler(['z-lens', 'Z serisi'], ['f-lens', 'F serisi'])),
      marka('tamron', 'Tamron', urunler(['tamron-rf', 'RF serisi'])),
    ],
    { modelBasligi: 'Lens serisi' },
  ),
  dal('video-kamera', 'Video kamera', [
    marka('sony', 'Sony', urunler(['handycam', 'Handycam'], ['fx30', 'FX30'])),
    marka('canon', 'Canon', urunler(['xa-serisi', 'XA serisi'], ['cinema-eos', 'Cinema EOS'])),
    marka('dji', 'DJI', urunler(['osmo-pocket', 'Osmo Pocket'])),
  ]),
  dal(
    'kamera-aksesuari',
    'Fotoğraf ekipmanı',
    [
      marka('tripod', 'Tripod ve başlık', urunler(['tripod', 'Tripod'], ['monopod', 'Monopod'])),
      marka(
        'isik',
        'Flaş ve ışık',
        urunler(['tepe-flasi', 'Tepe flaşı'], ['led-isik', 'LED ışık'], ['softbox', 'Softbox']),
      ),
      marka(
        'ses',
        'Ses ekipmanı',
        urunler(['yaka-mikrofonu', 'Yaka mikrofonu'], ['shotgun-mikrofon', 'Shotgun mikrofon']),
      ),
      marka(
        'diger',
        'Diğer aksesuarlar',
        urunler(
          ['hafiza-karti', 'Hafıza kartı'],
          ['kamera-cantasi', 'Kamera çantası'],
          ['yedek-pil', 'Yedek pil'],
        ),
      ),
    ],
    { markaBasligi: 'Ekipman türü', modelBasligi: 'Ürün' },
  ),
  dal('drone', 'Drone', [
    marka('dji', 'DJI', urunler(['mini-3', 'Mini 3'], ['mini-4-pro', 'Mini 4 Pro'], ['air-3', 'Air 3'])),
    marka('autel', 'Autel', urunler(['evo-lite', 'EVO Lite'])),
    marka('diger', 'Diğer', urunler(['drone-aksesuar', 'Drone aksesuarı'])),
  ]),
  dal(
    'optik-cihazlar',
    'Teleskop ve dürbün',
    [
      marka(
        'teleskop',
        'Teleskop',
        urunler(['mercekli-teleskop', 'Mercekli teleskop'], ['ayna-teleskop', 'Aynalı teleskop']),
      ),
      marka(
        'durbin',
        'Dürbün',
        urunler(['kompakt-durbin', 'Kompakt dürbün'], ['dogal-yasam-durbunu', 'Doğa gözlem dürbünü']),
      ),
      marka('markasiz', 'Diğer optik cihazlar', urunler(['mikroskop', 'Mikroskop'])),
    ],
    { markaBasligi: 'Cihaz türü', modelBasligi: 'Tür' },
  ),
);

kategoriAgaci.otomotiv.push(
  dal('otomobil', 'Otomobil', [
    marka('renault', 'Renault', urunler(['clio', 'Clio'], ['megane', 'Megane'], ['fluence', 'Fluence'])),
    marka('fiat', 'Fiat', urunler(['egea', 'Egea'], ['panda', 'Panda'])),
    marka('toyota', 'Toyota', urunler(['corolla', 'Corolla'], ['yaris', 'Yaris'])),
    marka('volkswagen', 'Volkswagen', urunler(['golf', 'Golf'], ['polo', 'Polo'], ['passat', 'Passat'])),
    marka('bmw', 'BMW', urunler(['3-serisi', '3 Serisi'], ['5-serisi', '5 Serisi'])),
  ]),
  dal('suv-pickup', 'SUV ve pick-up', [
    marka('dacia', 'Dacia', urunler(['duster', 'Duster'])),
    marka('toyota', 'Toyota', urunler(['rav4', 'RAV4'], ['hilux', 'Hilux'])),
    marka('volkswagen', 'Volkswagen', urunler(['tiguan', 'Tiguan'], ['amarok', 'Amarok'])),
    marka('bmw', 'BMW', urunler(['x1', 'X1'], ['x3', 'X3'])),
  ]),
  dal('elektrikli-arac', 'Elektrikli araç', [
    marka('tesla', 'Tesla', urunler(['model-3', 'Model 3'], ['model-y', 'Model Y'])),
    marka('togg', 'Togg', urunler(['t10x', 'T10X'])),
    marka('renault', 'Renault', urunler(['zoe', 'Zoe'], ['megane-e-tech', 'Megane E-Tech'])),
  ]),
  dal('ticari-arac', 'Ticari araç', [
    marka('fiat', 'Fiat', urunler(['doblo', 'Doblo'], ['ducato', 'Ducato'])),
    marka('ford', 'Ford', urunler(['transit', 'Transit'], ['courier', 'Courier'])),
    marka('volkswagen', 'Volkswagen', urunler(['caddy', 'Caddy'], ['transporter', 'Transporter'])),
  ]),
  dal(
    'deniz-araci',
    'Deniz aracı',
    [
      marka('bot', 'Tekne ve bot', urunler(['sisme-bot', 'Şişme bot'], ['fiber-tekne', 'Fiber tekne'])),
      marka(
        'motor',
        'Deniz motoru',
        urunler(['dis-motor', 'Dıştan takma motor'], ['icten-takma', 'İçten takma motor']),
      ),
    ],
    { markaBasligi: 'Araç türü', modelBasligi: 'Tür' },
  ),
  dal(
    'karavan',
    'Karavan',
    [
      marka(
        'karavan',
        'Karavan tipi',
        urunler(['cekme-karavan', 'Çekme karavan'], ['motokaravan', 'Motokaravan']),
      ),
    ],
    { markaBasligi: 'Araç türü', modelBasligi: 'Tür' },
  ),
  dal('atv', 'ATV ve arazi aracı', [
    marka('cfmoto', 'CFMOTO', urunler(['cf-450', 'CFORCE 450'], ['cf-520', 'CFORCE 520'])),
    marka('can-am', 'Can-Am', urunler(['outlander', 'Outlander'])),
    marka('diger', 'Diğer', urunler(['utv', 'UTV'], ['atv', 'ATV'])),
  ]),
);

kategoriAgaci.koleksiyon.push(
  dal(
    'madeni-para',
    'Madeni para ve banknot',
    [
      marka(
        'cumhuriyet',
        'Cumhuriyet dönemi',
        urunler(['cumhuriyet-altini', 'Cumhuriyet altını'], ['hatira-parasi', 'Hatıra parası']),
      ),
      marka(
        'osmanli',
        'Osmanlı dönemi',
        urunler(['osmanli-parasi', 'Osmanlı parası'], ['banknot', 'Banknot']),
      ),
      marka('diger', 'Diğer', urunler(['yabanci-para', 'Yabancı para'])),
    ],
    { markaBasligi: 'Dönem / tür', modelBasligi: 'Parça türü' },
  ),
  dal(
    'pul',
    'Pul',
    [
      marka('turkiye', 'Türkiye', urunler(['posta-pulu', 'Posta pulu'], ['blok-pul', 'Blok pul'])),
      marka('dunya', 'Dünya pulları', urunler(['yabanci-pul', 'Yabancı pul'])),
    ],
    { markaBasligi: 'Koleksiyon', modelBasligi: 'Pul türü' },
  ),
  dal(
    'kart',
    'Kart koleksiyonu',
    [
      marka(
        'spor',
        'Spor kartları',
        urunler(['futbol-karti', 'Futbol kartı'], ['basketbol-karti', 'Basketbol kartı']),
      ),
      marka(
        'oyun',
        'Oyun kartları',
        urunler(['pokemon-karti', 'Pokémon kartı'], ['tcg-karti', 'Diğer TCG kartları']),
      ),
    ],
    { markaBasligi: 'Koleksiyon türü', modelBasligi: 'Kart türü' },
  ),
  dal('oyuncak', 'Oyuncak ve figür', [
    marka(
      'lego',
      'LEGO',
      urunler(['lego-city', 'City'], ['lego-technic', 'Technic'], ['lego-star-wars', 'Star Wars']),
    ),
    marka('hot-wheels', 'Hot Wheels', urunler(['hot-wheels-araba', 'Model araba'])),
    marka(
      'markasiz',
      'Diğer oyuncaklar',
      urunler(['aksiyon-figuru', 'Aksiyon figürü'], ['koleksiyon-oyuncagi', 'Koleksiyon oyuncağı']),
    ),
  ]),
  dal(
    'kitap-cizgi-roman',
    'Çizgi roman ve özel baskı',
    [
      marka(
        'cizgi-roman',
        'Çizgi roman',
        urunler(['manga', 'Manga'], ['yerli-cizgi-roman', 'Yerli çizgi roman']),
      ),
      marka('kitap', 'Kitap', urunler(['ilk-baski', 'İlk baskı'], ['imzali-kitap', 'İmzalı kitap'])),
    ],
    { markaBasligi: 'Koleksiyon türü', modelBasligi: 'Eser türü' },
  ),
  dal(
    'antika',
    'Antika ve sanat',
    [
      marka(
        'mobilya',
        'Antika mobilya',
        urunler(['antika-sandalye', 'Sandalye'], ['antika-konsol', 'Konsol']),
      ),
      marka('sanat', 'Sanat eseri', urunler(['tablo', 'Tablo'], ['baski', 'Baskı'])),
      marka(
        'markasiz',
        'Diğer koleksiyon parçaları',
        urunler(['obje', 'Dekoratif obje'], ['el-yazmasi', 'El yazması']),
      ),
    ],
    { markaBasligi: 'Koleksiyon türü', modelBasligi: 'Parça türü' },
  ),
);

function kataloguGenislet(kategori: Kategori, ...dallar: AltKategori[]) {
  for (const yeni of dallar) {
    const mevcut = kategoriAgaci[kategori].find((aday) => aday.id === yeni.id);
    if (!mevcut) {
      kategoriAgaci[kategori].push(yeni);
      continue;
    }
    for (const yeniMarka of yeni.markalar) {
      const mevcutMarka = mevcut.markalar.find((aday) => aday.id === yeniMarka.id);
      if (!mevcutMarka) mevcut.markalar.push(yeniMarka);
      else {
        for (const model of yeniMarka.modeller) {
          if (!mevcutMarka.modeller.some((aday) => aday.id === model.id)) mevcutMarka.modeller.push(model);
        }
      }
    }
  }
}

const turDali = (id: string, ad: string, turler: [string, string, [string, string][]][]) =>
  dal(
    id,
    ad,
    turler.map(([tur, etiket, urun]) => marka(tur, etiket, urunler(...urun))),
    {
      markaBasligi: 'Ürün grubu',
      modelBasligi: 'Ürün türü',
    },
  );

kataloguGenislet(
  'telefon',
  dal('cep-telefonu', 'Cep telefonu', [
    marka(
      'apple',
      'Apple',
      urunler(
        ['iphone-16', 'iPhone 16'],
        ['iphone-16-plus', 'iPhone 16 Plus'],
        ['iphone-16-pro', 'iPhone 16 Pro'],
        ['iphone-16-pro-max', 'iPhone 16 Pro Max'],
        ['iphone-se-3', 'iPhone SE (3. nesil)'],
      ),
    ),
    marka(
      'samsung',
      'Samsung',
      urunler(
        ['galaxy-s24-ultra', 'Galaxy S24 Ultra'],
        ['galaxy-s24-plus', 'Galaxy S24+'],
        ['galaxy-z-fold-5', 'Galaxy Z Fold5'],
        ['galaxy-z-flip-5', 'Galaxy Z Flip5'],
        ['galaxy-a55', 'Galaxy A55'],
        ['galaxy-a34', 'Galaxy A34'],
      ),
    ),
    marka(
      'huawei',
      'Huawei',
      urunler(['p30-pro', 'P30 Pro'], ['p40-pro', 'P40 Pro'], ['nova-11', 'nova 11']),
    ),
    marka('oppo', 'OPPO', urunler(['reno-10', 'Reno10'], ['reno-11-f', 'Reno11 F'], ['a78', 'A78'])),
    marka('realme', 'realme', urunler(['realme-11-pro', '11 Pro'], ['realme-c55', 'C55'])),
    marka('honor', 'HONOR', urunler(['honor-90', '90'], ['magic-6-pro', 'Magic6 Pro'])),
    marka('nokia', 'Nokia', urunler(['nokia-3310', '3310'], ['nokia-105', '105'], ['nokia-g22', 'G22'])),
    marka('general-mobile', 'General Mobile', urunler(['gm-24-pro', 'GM 24 Pro'], ['gm-23', 'GM 23'])),
    marka('tecno', 'TECNO', urunler(['camon-20', 'CAMON 20'], ['spark-20', 'SPARK 20'])),
    marka('vivo', 'vivo', urunler(['v29', 'V29'], ['y36', 'Y36'])),
    marka(
      'diger',
      'Diğer markalar',
      urunler(['android-telefon', 'Android telefon'], ['tuslu-telefon', 'Tuşlu telefon']),
    ),
  ]),
  turDali('numara', 'Telefon numarası', [
    [
      'turkcell',
      'Turkcell',
      [
        ['faturali', 'Faturalı hat'],
        ['faturasiz', 'Faturasız hat'],
      ],
    ],
    [
      'vodafone',
      'Vodafone',
      [
        ['faturali', 'Faturalı hat'],
        ['faturasiz', 'Faturasız hat'],
      ],
    ],
    [
      'turk-telekom',
      'Türk Telekom',
      [
        ['faturali', 'Faturalı hat'],
        ['faturasiz', 'Faturasız hat'],
      ],
    ],
  ]),
);

kataloguGenislet(
  'bilgisayar',
  dal('dizustu', 'Dizüstü bilgisayar', [
    marka('dell', 'Dell', urunler(['latitude', 'Latitude'], ['inspiron', 'Inspiron'], ['xps', 'XPS'])),
    marka('acer', 'Acer', urunler(['aspire', 'Aspire'], ['swift', 'Swift'], ['nitro', 'Nitro'])),
    marka('msi', 'MSI', urunler(['modern', 'Modern'], ['prestige', 'Prestige'], ['katana', 'Katana'])),
    marka('huawei', 'Huawei', urunler(['matebook-d', 'MateBook D'], ['matebook-x-pro', 'MateBook X Pro'])),
    marka('monster', 'Monster', urunler(['abra', 'Abra'], ['tulpar', 'Tulpar'], ['huma', 'Huma'])),
    marka('lenovo', 'Lenovo', urunler(['yoga', 'Yoga'], ['legion', 'Legion'], ['thinkbook', 'ThinkBook'])),
    marka('hp', 'HP', urunler(['victus', 'Victus'], ['omen', 'OMEN'], ['probook', 'ProBook'])),
    marka(
      'apple',
      'Apple',
      urunler(['macbook-air-m3', 'MacBook Air M3'], ['macbook-pro-m3', 'MacBook Pro M3']),
    ),
  ]),
  turDali('bilgisayar-aksesuari', 'Bilgisayar aksesuarları', [
    [
      'canta',
      'Çanta ve kılıf',
      [
        ['bilgisayar-cantasi', 'Bilgisayar çantası'],
        ['laptop-kilifi', 'Dizüstü kılıfı'],
      ],
    ],
    [
      'baglanti',
      'Kablo ve dönüştürücü',
      [
        ['usb-hub', 'USB hub'],
        ['dock', 'Dock istasyonu'],
        ['goruntu-kablosu', 'Görüntü kablosu'],
        ['donusturucu', 'Dönüştürücü'],
      ],
    ],
    [
      'guc',
      'Adaptör ve batarya',
      [
        ['laptop-adaptoru', 'Dizüstü adaptörü'],
        ['laptop-bataryasi', 'Dizüstü bataryası'],
      ],
    ],
    [
      'stand',
      'Stand ve destek',
      [
        ['laptop-standi', 'Dizüstü standı'],
        ['sogutucu-stand', 'Soğutucu stand'],
        ['mousepad', 'Mousepad'],
      ],
    ],
  ]),
  dal('yazici-tarayici', 'Yazıcı ve tarayıcı', [
    marka(
      'hp',
      'HP',
      urunler(['laserjet', 'LaserJet'], ['deskjet', 'DeskJet'], ['smart-tank', 'Smart Tank']),
    ),
    marka('epson', 'Epson', urunler(['ecotank', 'EcoTank'], ['workforce', 'WorkForce'])),
    marka('canon', 'Canon', urunler(['pixma', 'PIXMA'], ['maxify', 'MAXIFY'], ['imageclass', 'i-SENSYS'])),
    marka('brother', 'Brother', urunler(['hl-serisi', 'HL serisi'], ['dcp-serisi', 'DCP serisi'])),
    marka('diger', 'Diğer', urunler(['dokuman-tarayici', 'Doküman tarayıcı'], ['3d-yazici', '3D yazıcı'])),
  ]),
  turDali('guc-koruma', 'UPS ve güç koruma', [
    [
      'ups',
      'Kesintisiz güç kaynağı',
      [
        ['line-interactive', 'Line-interactive UPS'],
        ['online-ups', 'Online UPS'],
      ],
    ],
    [
      'priz',
      'Güç koruma',
      [
        ['akim-korumali-priz', 'Akım korumalı priz'],
        ['pdu', 'PDU'],
      ],
    ],
  ]),
  turDali('yazilim', 'Lisanslı yazılım', [
    [
      'isletim-sistemi',
      'İşletim sistemi',
      [
        ['windows-lisans', 'Windows lisansı'],
        ['sunucu-lisansi', 'Sunucu lisansı'],
      ],
    ],
    [
      'uygulama',
      'Uygulama yazılımı',
      [
        ['ofis-yazilimi', 'Ofis yazılımı'],
        ['tasarim-yazilimi', 'Tasarım yazılımı'],
        ['guvenlik-yazilimi', 'Güvenlik yazılımı'],
      ],
    ],
  ]),
);

kataloguGenislet(
  'oyun',
  dal('oyun-konsolu', 'Oyun konsolu', [
    marka(
      'sony',
      'Sony',
      urunler(
        ['playstation-5-slim', 'PlayStation 5 Slim'],
        ['playstation-5-pro', 'PlayStation 5 Pro'],
        ['playstation-4-pro', 'PlayStation 4 Pro'],
      ),
    ),
    marka('microsoft', 'Microsoft', urunler(['xbox-one-s', 'Xbox One S'], ['xbox-one-x', 'Xbox One X'])),
    marka('nintendo', 'Nintendo', urunler(['switch-lite', 'Switch Lite'], ['wii', 'Wii'])),
  ]),
  dal('tasinabilir-konsol', 'Taşınabilir oyun konsolu', [
    marka('valve', 'Valve', urunler(['steam-deck', 'Steam Deck'], ['steam-deck-oled', 'Steam Deck OLED'])),
    marka('asus', 'ASUS', urunler(['rog-ally', 'ROG Ally'], ['rog-ally-x', 'ROG Ally X'])),
    marka('lenovo', 'Lenovo', urunler(['legion-go', 'Legion Go'])),
    marka(
      'sony',
      'Sony',
      urunler(['psp', 'PSP'], ['ps-vita', 'PS Vita'], ['playstation-portal', 'PlayStation Portal']),
    ),
    marka('nintendo', 'Nintendo', urunler(['3ds', 'Nintendo 3DS'], ['ds-lite', 'DS Lite'])),
  ]),
  dal('retro-konsol', 'Retro oyun konsolu', [
    marka(
      'sony',
      'Sony',
      urunler(
        ['playstation-1', 'PlayStation'],
        ['playstation-2', 'PlayStation 2'],
        ['playstation-3', 'PlayStation 3'],
      ),
    ),
    marka(
      'nintendo',
      'Nintendo',
      urunler(['nes', 'NES'], ['snes', 'SNES'], ['nintendo-64', 'Nintendo 64'], ['gamecube', 'GameCube']),
    ),
    marka('sega', 'SEGA', urunler(['mega-drive', 'Mega Drive'], ['dreamcast', 'Dreamcast'])),
  ]),
  turDali('konsol-yedek-parca', 'Konsol yedek parçası', [
    [
      'govde',
      'Gövde ve mekanik parçalar',
      [
        ['konsol-kasasi', 'Konsol kasası'],
        ['optik-surucu', 'Optik sürücü'],
      ],
    ],
    [
      'elektronik',
      'Elektronik parçalar',
      [
        ['konsol-anakarti', 'Anakart'],
        ['konsol-guc-kaynagi', 'Güç kaynağı'],
        ['analog-modul', 'Analog modül'],
        ['konsol-fani', 'Soğutma fanı'],
      ],
    ],
  ]),
);

kataloguGenislet(
  'ev',
  turDali('televizyon', 'Televizyon ve görüntü', [
    [
      'televizyon',
      'Televizyon',
      [
        ['led-tv', 'LED / LCD televizyon'],
        ['oled-tv', 'OLED televizyon'],
        ['qled-tv', 'QLED televizyon'],
      ],
    ],
    [
      'projeksiyon',
      'Projeksiyon',
      [
        ['projeksiyon-cihazi', 'Projeksiyon cihazı'],
        ['projeksiyon-perdesi', 'Projeksiyon perdesi'],
      ],
    ],
    [
      'medya',
      'Uydu ve medya',
      [
        ['uydu-alicisi', 'Uydu alıcısı'],
        ['medya-oynatici', 'Medya oynatıcı'],
        ['tv-aksesuari', 'TV aksesuarı'],
      ],
    ],
  ]),
  turDali('ses-sistemleri', 'Ses ve müzik sistemleri', [
    [
      'hoparlor',
      'Hoparlör ve ses sistemi',
      [
        ['bluetooth-hoparlor', 'Bluetooth hoparlör'],
        ['soundbar', 'Soundbar'],
        ['ev-sinema', 'Ev sinema sistemi'],
        ['hifi-hoparlor', 'Hi-Fi hoparlör'],
      ],
    ],
    [
      'muzik',
      'Müzik ekipmanı',
      [
        ['pikap', 'Pikap'],
        ['amfi', 'Amfi'],
        ['cd-calar', 'CD çalar'],
        ['kasetcalar', 'Kasetçalar'],
      ],
    ],
    [
      'kulaklik',
      'Kulaklık',
      [
        ['kulak-ustu', 'Kulak üstü kulaklık'],
        ['kulak-ici', 'Kulak içi kulaklık'],
      ],
    ],
  ]),
  turDali('kucuk-ev-aletleri', 'Küçük ev aletleri', [
    [
      'supurge',
      'Süpürge ve temizlik',
      [
        ['robot-supurge', 'Robot süpürge'],
        ['dikey-supurge', 'Dikey süpürge'],
        ['elektrik-supurgesi', 'Elektrik süpürgesi'],
        ['buharli-temizleyici', 'Buharlı temizleyici'],
      ],
    ],
    [
      'pisirme',
      'Mutfak aletleri',
      [
        ['airfryer', 'Airfryer'],
        ['kahve-makinesi', 'Kahve makinesi'],
        ['cay-makinesi', 'Çay makinesi'],
        ['mutfak-robotu', 'Mutfak robotu'],
        ['tost-makinesi', 'Tost makinesi'],
      ],
    ],
    [
      'utu',
      'Ütü ve dikiş',
      [
        ['buharli-utu', 'Buharlı ütü'],
        ['kazanli-utu', 'Kazanlı ütü'],
        ['dikis-makinesi', 'Dikiş makinesi'],
      ],
    ],
  ]),
  turDali('isitma-sogutma', 'Isıtma ve soğutma', [
    [
      'klima',
      'Klima',
      [
        ['split-klima', 'Split klima'],
        ['mobil-klima', 'Mobil klima'],
      ],
    ],
    [
      'isitici',
      'Isıtıcı',
      [
        ['elektrikli-isitici', 'Elektrikli ısıtıcı'],
        ['soba', 'Soba'],
        ['kombi', 'Kombi'],
      ],
    ],
    [
      'havalandirma',
      'Hava ve havalandırma',
      [
        ['vantilator', 'Vantilatör'],
        ['hava-temizleyici', 'Hava temizleyici'],
        ['nem-alici', 'Nem alıcı'],
        ['hava-nemlendirici', 'Hava nemlendirici'],
      ],
    ],
  ]),
  turDali('akilli-ev-guvenlik', 'Akıllı ev ve güvenlik', [
    [
      'kamera',
      'Güvenlik kamerası',
      [
        ['ip-kamera', 'IP kamera'],
        ['cctv', 'CCTV sistemi'],
        ['goruntulu-diafon', 'Görüntülü diafon'],
      ],
    ],
    [
      'otomasyon',
      'Akıllı ev',
      [
        ['akilli-priz', 'Akıllı priz'],
        ['akilli-aydinlatma', 'Akıllı aydınlatma'],
        ['akilli-asistan', 'Akıllı ev asistanı'],
        ['akilli-termostat', 'Akıllı termostat'],
      ],
    ],
    [
      'alarm',
      'Alarm ve kilit',
      [
        ['alarm-seti', 'Alarm seti'],
        ['akilli-kilit', 'Akıllı kilit'],
        ['sensor', 'Sensör'],
      ],
    ],
  ]),
  turDali('el-isi-sanat', 'El işi ve sanat', [
    [
      'el-isi',
      'El işi',
      [
        ['orgu', 'Örgü'],
        ['dantel', 'Dantel'],
        ['kanavice', 'Kanaviçe'],
        ['makrome', 'Makrome'],
      ],
    ],
    [
      'sanat',
      'Resim ve seramik',
      [
        ['el-yapimi-tablo', 'El yapımı tablo'],
        ['el-yapimi-seramik', 'El yapımı seramik'],
        ['sanat-malzemesi', 'Sanat malzemesi'],
      ],
    ],
  ]),
  turDali('temizlik-malzemeleri', 'Temizlik ve düzenleme', [
    [
      'temizlik',
      'Temizlik gereçleri',
      [
        ['paspas-seti', 'Paspas seti'],
        ['temizlik-arabasi', 'Temizlik arabası'],
        ['cop-kovasi', 'Çöp kovası'],
      ],
    ],
    [
      'duzenleme',
      'Ev düzenleme',
      [
        ['saklama-kutusu', 'Saklama kutusu'],
        ['duzenleyici', 'Düzenleyici'],
        ['camasir-kurutmaligi', 'Çamaşır kurutmalığı'],
      ],
    ],
  ]),
  turDali('ofis-kirtasiye', 'Ofis ve kırtasiye', [
    [
      'ofis',
      'Ofis ekipmanı',
      [
        ['evrak-imha', 'Evrak imha makinesi'],
        ['laminasyon', 'Laminasyon makinesi'],
        ['hesap-makinesi', 'Hesap makinesi'],
      ],
    ],
    [
      'kirtasiye',
      'Kırtasiye',
      [
        ['defter', 'Defter'],
        ['kalem-seti', 'Kalem seti'],
        ['dosyalama', 'Dosyalama'],
        ['cizim-malzemesi', 'Çizim malzemesi'],
      ],
    ],
  ]),
);

kataloguGenislet(
  'moda',
  turDali('cocuk-giyim', 'Çocuk giyim', [
    [
      'kiz',
      'Kız çocuk',
      [
        ['elbise', 'Elbise'],
        ['takim', 'Takım'],
        ['ust-giyim', 'Üst giyim'],
        ['alt-giyim', 'Alt giyim'],
      ],
    ],
    [
      'erkek',
      'Erkek çocuk',
      [
        ['takim', 'Takım'],
        ['ust-giyim', 'Üst giyim'],
        ['alt-giyim', 'Alt giyim'],
      ],
    ],
    [
      'bebek',
      'Bebek giyim',
      [
        ['zibin', 'Zıbın'],
        ['tulum', 'Tulum'],
        ['bebek-takimi', 'Bebek takımı'],
      ],
    ],
  ]),
  turDali('evlilik-dugun', 'Evlilik ve düğün', [
    [
      'gelinlik',
      'Gelinlik',
      [
        ['a-kesim', 'A kesim'],
        ['prenses', 'Prenses'],
        ['balik', 'Balık'],
        ['sade', 'Sade gelinlik'],
      ],
    ],
    [
      'damatlik',
      'Damatlık',
      [
        ['smokin', 'Smokin'],
        ['takim-elbise', 'Takım elbise'],
      ],
    ],
    [
      'abiye',
      'Abiye ve nişanlık',
      [
        ['abiye', 'Abiye'],
        ['nisanlik', 'Nişanlık'],
        ['bindalli', 'Bindallı'],
      ],
    ],
    [
      'aksesuar',
      'Düğün aksesuarı',
      [
        ['duvak', 'Duvak'],
        ['gelin-taci', 'Gelin tacı'],
        ['gelin-ayakkabisi', 'Gelin ayakkabısı'],
      ],
    ],
  ]),
  turDali('valiz-bavul', 'Valiz ve bavul', [
    [
      'valiz',
      'Valiz',
      [
        ['kabin-boy', 'Kabin boy'],
        ['orta-boy', 'Orta boy'],
        ['buyuk-boy', 'Büyük boy'],
        ['valiz-seti', 'Valiz seti'],
      ],
    ],
    [
      'seyahat',
      'Seyahat çantası',
      [
        ['spor-seyahat', 'Spor / seyahat çantası'],
        ['makyaj-cantasi', 'Makyaj çantası'],
        ['giysi-kilifi', 'Giysi kılıfı'],
      ],
    ],
  ]),
  turDali('kostum', 'Kostüm', [
    [
      'yetiskin',
      'Yetişkin kostümü',
      [
        ['parti-kostumu', 'Parti kostümü'],
        ['sahne-kostumu', 'Sahne kostümü'],
      ],
    ],
    [
      'cocuk',
      'Çocuk kostümü',
      [
        ['cocuk-kostumu', 'Çocuk kostümü'],
        ['gosteri-kiyafeti', 'Gösteri kıyafeti'],
      ],
    ],
  ]),
  turDali('taki-mucevher', 'Takı ve mücevher', [
    [
      'altin',
      'Altın takı',
      [
        ['altin-yuzuk', 'Yüzük'],
        ['altin-kolye', 'Kolye'],
        ['altin-kupe', 'Küpe'],
        ['altin-bileklik', 'Bileklik'],
      ],
    ],
    [
      'gumus',
      'Gümüş takı',
      [
        ['gumus-yuzuk', 'Yüzük'],
        ['gumus-kolye', 'Kolye'],
        ['gumus-kupe', 'Küpe'],
      ],
    ],
    [
      'pirlanta',
      'Pırlanta ve değerli taş',
      [
        ['tektas', 'Tektaş'],
        ['bestas', 'Beştaş'],
        ['degerli-tas', 'Değerli taşlı takı'],
      ],
    ],
    [
      'bijuteri',
      'Bijuteri',
      [
        ['bijuteri-kolye', 'Kolye'],
        ['bijuteri-bileklik', 'Bileklik'],
        ['bijuteri-kupe', 'Küpe'],
      ],
    ],
  ]),
);

kataloguGenislet(
  'fotograf',
  dal('dijital-fotograf-makinesi', 'Dijital fotoğraf makinesi', [
    marka('nikon', 'Nikon', urunler(['z50', 'Z 50'], ['z6-ii', 'Z 6II'], ['d750', 'D750'])),
    marka('panasonic', 'Panasonic', urunler(['lumix-gh5', 'LUMIX GH5'], ['lumix-s5', 'LUMIX S5'])),
    marka('olympus', 'Olympus / OM System', urunler(['om-d-e-m10', 'OM-D E-M10'], ['om-1', 'OM-1'])),
    marka('fujifilm', 'Fujifilm', urunler(['x100vi', 'X100VI'], ['x-s20', 'X-S20'], ['x-t5', 'X-T5'])),
    marka('sony', 'Sony', urunler(['a7-iv', 'a7 IV'], ['zv-e10', 'ZV-E10'])),
  ]),
  turDali('lens-aksesuari', 'Lens filtresi ve aksesuarı', [
    [
      'filtre',
      'Filtre',
      [
        ['uv-filtre', 'UV filtre'],
        ['nd-filtre', 'ND filtre'],
        ['polarize-filtre', 'Polarize filtre'],
      ],
    ],
    [
      'adaptor',
      'Adaptör ve dönüştürücü',
      [
        ['lens-adaptoru', 'Lens adaptörü'],
        ['teleconverter', 'Telekonvertör'],
      ],
    ],
    [
      'koruma',
      'Lens koruma',
      [
        ['parasoley', 'Parasoley'],
        ['lens-kapagi', 'Lens kapağı'],
        ['lens-temizlik', 'Lens temizleme seti'],
      ],
    ],
  ]),
  turDali('kamera-yedek-parca', 'Fotoğraf ve kamera yedek parçası', [
    [
      'elektronik',
      'Elektronik parça',
      [
        ['kamera-ekrani', 'Ekran'],
        ['deklansor', 'Deklanşör'],
        ['kamera-anakarti', 'Anakart'],
      ],
    ],
    [
      'govde',
      'Gövde ve mekanik parça',
      [
        ['govde-parcasi', 'Gövde parçası'],
        ['pil-kapagi', 'Pil kapağı'],
        ['bayonet', 'Bayonet'],
      ],
    ],
  ]),
  turDali('studyo', 'Stüdyo ekipmanı', [
    [
      'isik',
      'Işık ve şekillendirici',
      [
        ['paraflas', 'Paraflaş'],
        ['surekli-isik', 'Sürekli ışık'],
        ['softbox', 'Softbox'],
        ['reflektor', 'Reflektör'],
      ],
    ],
    [
      'fon',
      'Fon ve destek',
      [
        ['fon-perdesi', 'Fon perdesi'],
        ['fon-standi', 'Fon standı'],
        ['isik-ayagi', 'Işık ayağı'],
        ['cekim-cadiri', 'Çekim çadırı'],
      ],
    ],
  ]),
  dal('aksiyon-kamerasi', 'Aksiyon ve 360° kamera', [
    marka(
      'gopro',
      'GoPro',
      urunler(['hero-11', 'HERO11 Black'], ['hero-12', 'HERO12 Black'], ['max', 'MAX']),
    ),
    marka('dji', 'DJI', urunler(['osmo-action-4', 'Osmo Action 4'], ['osmo-action-3', 'Osmo Action 3'])),
    marka('insta360', 'Insta360', urunler(['insta360-x3', 'X3'], ['insta360-x4', 'X4'], ['go-3', 'GO 3'])),
  ]),
);

kataloguGenislet(
  'otomotiv',
  dal('otomobil', 'Otomobil', [
    marka(
      'mercedes',
      'Mercedes-Benz',
      urunler(['a-serisi', 'A Serisi'], ['c-serisi', 'C Serisi'], ['e-serisi', 'E Serisi']),
    ),
    marka('audi', 'Audi', urunler(['a3', 'A3'], ['a4', 'A4'], ['a6', 'A6'])),
    marka('ford', 'Ford', urunler(['fiesta', 'Fiesta'], ['focus', 'Focus'], ['mondeo', 'Mondeo'])),
    marka('opel', 'Opel', urunler(['corsa', 'Corsa'], ['astra', 'Astra'], ['insignia', 'Insignia'])),
    marka('hyundai', 'Hyundai', urunler(['i10', 'i10'], ['i20', 'i20'], ['elantra', 'Elantra'])),
    marka('honda', 'Honda', urunler(['civic', 'Civic'], ['jazz', 'Jazz'], ['city', 'City'])),
    marka('peugeot', 'Peugeot', urunler(['208', '208'], ['308', '308'], ['508', '508'])),
    marka('skoda', 'Škoda', urunler(['fabia', 'Fabia'], ['octavia', 'Octavia'], ['superb', 'Superb'])),
  ]),
  dal('minivan-panelvan', 'Minivan ve panelvan', [
    marka('fiat', 'Fiat', urunler(['doblo', 'Doblo'], ['fiorino', 'Fiorino'], ['scudo', 'Scudo'])),
    marka(
      'ford',
      'Ford',
      urunler(['tourneo-courier', 'Tourneo Courier'], ['transit-connect', 'Transit Connect']),
    ),
    marka('citroen', 'Citroën', urunler(['berlingo', 'Berlingo'], ['jumpy', 'Jumpy'])),
    marka('peugeot', 'Peugeot', urunler(['partner', 'Partner'], ['rifter', 'Rifter'], ['expert', 'Expert'])),
  ]),
  turDali('yedek-parca', 'Otomotiv yedek parçası', [
    [
      'motor',
      'Motor ve mekanik',
      [
        ['motor-parcasi', 'Motor parçası'],
        ['sanziman', 'Şanzıman'],
        ['fren', 'Fren sistemi'],
        ['suspansiyon', 'Süspansiyon'],
      ],
    ],
    [
      'kaporta',
      'Kaporta ve aydınlatma',
      [
        ['tampon', 'Tampon'],
        ['far', 'Far'],
        ['dikiz-aynasi', 'Dikiz aynası'],
        ['kaporta-parcasi', 'Kaporta parçası'],
      ],
    ],
    [
      'elektrik',
      'Elektrik ve elektronik',
      [
        ['aku', 'Akü'],
        ['sensor', 'Sensör'],
        ['beyin', 'Kontrol ünitesi'],
      ],
    ],
  ]),
  turDali('lastik-jant', 'Lastik ve jant', [
    [
      'lastik',
      'Lastik',
      [
        ['yaz-lastigi', 'Yaz lastiği'],
        ['kis-lastigi', 'Kış lastiği'],
        ['dort-mevsim', 'Dört mevsim lastik'],
        ['motosiklet-lastigi', 'Motosiklet lastiği'],
      ],
    ],
    [
      'jant',
      'Jant',
      [
        ['aluminyum-jant', 'Alüminyum jant'],
        ['celik-jant', 'Çelik jant'],
        ['jant-lastik-takim', 'Jant ve lastik takımı'],
      ],
    ],
  ]),
  turDali('oto-aksesuar', 'Oto aksesuar ve donanım', [
    [
      'ic-aksesuar',
      'İç aksesuar',
      [
        ['paspas', 'Paspas'],
        ['koltuk-kilifi', 'Koltuk kılıfı'],
        ['telefon-tutucu', 'Telefon tutucu'],
      ],
    ],
    [
      'multimedya',
      'Ses ve görüntü',
      [
        ['oto-teyp', 'Oto teyp'],
        ['oto-hoparlor', 'Hoparlör'],
        ['arac-kamerasi', 'Araç kamerası'],
        ['multimedya-ekran', 'Multimedya ekran'],
      ],
    ],
    [
      'dis-aksesuar',
      'Dış aksesuar',
      [
        ['tavan-bagaji', 'Tavan bagajı'],
        ['port-bagaj', 'Port bagaj'],
        ['bisiklet-tasiyici', 'Bisiklet taşıyıcı'],
      ],
    ],
  ]),
  turDali('motosiklet-ekipmani', 'Motosiklet ekipmanı', [
    [
      'koruma',
      'Sürücü ekipmanı',
      [
        ['kask', 'Kask'],
        ['motosiklet-montu', 'Mont'],
        ['motosiklet-eldiveni', 'Eldiven'],
        ['motosiklet-botu', 'Bot'],
        ['motosiklet-pantolonu', 'Pantolon'],
      ],
    ],
    [
      'aksesuar',
      'Motosiklet aksesuarı',
      [
        ['motosiklet-cantasi', 'Çanta'],
        ['interkom', 'İnterkom'],
        ['motosiklet-kilidi', 'Kilit'],
      ],
    ],
  ]),
  turDali('romork', 'Römork ve taşıma', [
    [
      'romork',
      'Römork',
      [
        ['yuk-romorku', 'Yük römorku'],
        ['tekne-romorku', 'Tekne römorku'],
        ['motosiklet-romorku', 'Motosiklet römorku'],
      ],
    ],
    [
      'tasima',
      'Taşıma ekipmanı',
      [
        ['ceki-demiri', 'Çeki demiri'],
        ['romork-aksesuari', 'Römork aksesuarı'],
      ],
    ],
  ]),
);

kataloguGenislet(
  'koleksiyon',
  turDali('koleksiyon-objesi', 'Koleksiyon objeleri', [
    [
      'kucuk-obje',
      'Küçük objeler',
      [
        ['anahtarlik', 'Anahtarlık'],
        ['rozet', 'Rozet'],
        ['cakmak', 'Çakmak'],
        ['kumbara', 'Kumbara'],
      ],
    ],
    [
      'nostalji',
      'Nostaljik eşyalar',
      [
        ['eski-telefon', 'Eski telefon'],
        ['radyo', 'Radyo'],
        ['daktilo', 'Daktilo'],
        ['tabela', 'Tabela'],
      ],
    ],
  ]),
  turDali('yazili-basili-urun', 'Yazılı ve basılı ürünler', [
    [
      'yayin',
      'Gazete ve dergi',
      [
        ['eski-gazete', 'Eski gazete'],
        ['eski-dergi', 'Eski dergi'],
        ['takvim', 'Takvim'],
      ],
    ],
    [
      'belge',
      'Belge ve evrak',
      [
        ['efemera', 'Efemera'],
        ['hisse-tahvil', 'Hisse senedi ve tahvil'],
        ['eski-harita', 'Eski harita'],
      ],
    ],
  ]),
  turDali('imzali-urun', 'İmzalı ürün ve fotoğraflar', [
    [
      'spor',
      'Spor',
      [
        ['imzali-forma', 'İmzalı forma'],
        ['imzali-top', 'İmzalı top'],
        ['sporcu-fotografi', 'İmzalı sporcu fotoğrafı'],
      ],
    ],
    [
      'sanat',
      'Sanat ve müzik',
      [
        ['imzali-fotograf', 'İmzalı fotoğraf'],
        ['imzali-album', 'İmzalı albüm'],
        ['imzali-poster', 'İmzalı poster'],
      ],
    ],
  ]),
  turDali('kartpostal-poster', 'Kartpostal ve poster', [
    [
      'kartpostal',
      'Kartpostal',
      [
        ['sehir-kartpostali', 'Şehir kartpostalı'],
        ['tematik-kartpostal', 'Tematik kartpostal'],
      ],
    ],
    [
      'poster',
      'Poster ve afiş',
      [
        ['film-afisi', 'Film afişi'],
        ['muzik-posteri', 'Müzik posteri'],
        ['reklam-afisi', 'Reklam afişi'],
      ],
    ],
  ]),
  dal('kalem', 'Koleksiyon kalemi', [
    marka(
      'parker',
      'Parker',
      urunler(['parker-dolmakalem', 'Dolmakalem'], ['parker-tukenmez', 'Tükenmez kalem']),
    ),
    marka('pelikan', 'Pelikan', urunler(['pelikan-dolmakalem', 'Dolmakalem'])),
    marka('lamy', 'LAMY', urunler(['lamy-safari', 'Safari'], ['lamy-al-star', 'AL-star'])),
    marka('diger', 'Diğer', urunler(['dolmakalem', 'Dolmakalem'], ['mekanik-kalem', 'Mekanik kalem'])),
  ]),
);

export function kategoriYapisi(kategori: Kategori, altKategori?: string) {
  const altKategoriler = kategoriAgaci[kategori] ?? [];
  const dallar = altKategori ? altKategoriler.filter((a) => a.id === altKategori) : altKategoriler;
  const markaHaritasi = new Map<string, Marka>();
  for (const marka of dallar.flatMap((dal) => dal.markalar)) {
    const onceki = markaHaritasi.get(marka.id);
    markaHaritasi.set(marka.id, {
      ...marka,
      modeller: [
        ...new Map(
          [...(onceki?.modeller ?? []), ...marka.modeller].map((model) => [model.id, model]),
        ).values(),
      ],
    });
  }
  const markalar = [...markaHaritasi.values()];
  const basliklar = kategoriBasliklari[kategori] ?? {
    altKategoriBasligi: 'Alt kategoriler',
    markaBasligi: 'Markalar',
    modelBasligi: 'Modeller',
  };
  const seciliDal = dallar.length === 1 ? dallar[0] : undefined;
  const markaBasligi = seciliDal?.markaBasligi ?? basliklar.markaBasligi;
  const modelBasligi = seciliDal?.modelBasligi ?? basliklar.modelBasligi;
  return {
    altKategoriler: altKategoriler.map(({ id, ad }) => ({ id, ad })),
    markalar: markalar.map(({ id, ad }) => ({ id, ad })),
    modeller: Object.fromEntries(markalar.map((m) => [m.id, m.modeller])),
    ...basliklar,
    markaBasligi,
    modelBasligi,
    markaGirisi: markaBasligi.toLocaleLowerCase('tr-TR').includes('marka'),
    modelGirisi: /model|seri/i.test(modelBasligi),
  };
}

export type KesifSecimi = { kategori: string; altKategori: string; marka: string; model: string };
export const bosSecim: KesifSecimi = { kategori: '', altKategori: '', marka: '', model: '' };

/** Marka veya model bağlantılarında önce katalogdaki, sonra ilandaki tekil ebeveyn bulunur. */
export function kesifSeciminiTamamla(liste: Ilan[], secim: KesifSecimi): KesifSecimi {
  const dallar = kategoriAgaci[secim.kategori as Kategori] ?? [];
  if (!dallar.length) return { ...bosSecim };
  if (secim.altKategori && !dallar.some((dal) => dal.id === secim.altKategori))
    return { ...bosSecim, kategori: secim.kategori };
  if (!secim.marka && !secim.model) return secim;
  const eslesenDallar = dallar.filter((dal) => {
    if (secim.altKategori && dal.id !== secim.altKategori) return false;
    return dal.markalar.some(
      (marka) =>
        (!secim.marka || marka.id === secim.marka) &&
        (!secim.model || marka.modeller.some((model) => model.id === secim.model)),
    );
  });
  const kapsam = liste.filter(
    (ilan) =>
      ilan.kategori === secim.kategori &&
      (!secim.altKategori || ilan.altKategori === secim.altKategori) &&
      (!secim.marka || ilan.marka === secim.marka) &&
      (!secim.model || ilan.model === secim.model),
  );
  const tek = (alan: 'altKategori' | 'marka') => {
    const degerler = [
      ...new Set(kapsam.map((ilan) => ilan[alan]).filter((deger): deger is string => !!deger)),
    ];
    return degerler.length === 1 ? (degerler[0] ?? '') : '';
  };
  const markaAdaylari = [
    ...new Set(
      eslesenDallar
        .flatMap((dal) => dal.markalar)
        .filter((marka) => !secim.model || marka.modeller.some((model) => model.id === secim.model))
        .map((marka) => marka.id),
    ),
  ];
  if (!eslesenDallar.length && !kapsam.length) return { ...secim, marka: '', model: '' };
  return {
    ...secim,
    altKategori:
      secim.altKategori || (eslesenDallar.length === 1 ? (eslesenDallar[0]?.id ?? '') : tek('altKategori')),
    marka:
      secim.marka || (secim.model ? (markaAdaylari.length === 1 ? markaAdaylari[0]! : tek('marka')) : ''),
  };
}

/** Üst dal değişince artık o dala ait olmayan alt seçimler taşınmaz. */
export function kesifSeciminiDegistir(
  secim: KesifSecimi,
  alan: keyof KesifSecimi,
  deger: string,
): KesifSecimi {
  if (alan === 'kategori') return { ...bosSecim, kategori: deger };
  if (alan === 'altKategori') return { ...secim, altKategori: deger, marka: '', model: '' };
  if (alan === 'marka') return { ...secim, marka: deger, model: '' };
  return { ...secim, model: deger };
}

export function kesifSecenekleri(liste: Ilan[], secim: KesifSecimi) {
  const yapi = kategoriYapisi(secim.kategori as Kategori, secim.altKategori);
  const kapsam = liste.filter((i) => i.kategori === secim.kategori);
  const adlandir = (deger: string, secenekler: KategoriSecenegi[]) =>
    secenekler.find((s) => s.id === deger)?.ad ?? deger;
  const say = (alan: 'altKategori' | 'marka' | 'model', ilanlar: Ilan[], secenekler: KategoriSecenegi[]) =>
    [
      ...new Map([
        ...secenekler.map((secenek) => [secenek.id, secenek] as const),
        ...ilanlar
          .filter((ilan) => ilan[alan] && !secenekler.some((secenek) => secenek.id === ilan[alan]))
          .map((ilan) => [ilan[alan]!, { id: ilan[alan]!, ad: ilan[alan]! }] as const),
      ]).values(),
    ].map(({ id }) => ({
      id,
      ad: adlandir(id, secenekler),
      sayi: ilanlar.filter((ilan) => ilan[alan] === id).length,
    }));
  const altKapsam = kapsam.filter((i) => !secim.altKategori || i.altKategori === secim.altKategori);
  return {
    altKategoriler: say('altKategori', kapsam, yapi.altKategoriler),
    markalar: say('marka', altKapsam, yapi.markalar),
    modeller: secim.marka
      ? say(
          'model',
          altKapsam.filter((i) => i.marka === secim.marka),
          yapi.modeller[secim.marka] ?? [],
        )
      : [],
  };
}

export type KesifDali = KategoriSecenegi & { alan: keyof KesifSecimi; sayi: number };

/** Üst zincir ve o zincirin hemen altındaki liste aynı seçimden hesaplanır. */
export function kategoriGezintisi(liste: Ilan[], secim: KesifSecimi) {
  const etkin = kesifSeciminiTamamla(liste, secim);
  const yapi = kategoriYapisi(etkin.kategori as Kategori, etkin.altKategori);
  const dallar = kesifSecenekleri(liste, etkin);
  const tanimlar: { alan: keyof KesifSecimi; secenekler: KategoriSecenegi[] }[] = [
    { alan: 'kategori', secenekler: kategoriler },
    { alan: 'altKategori', secenekler: yapi.altKategoriler },
    { alan: 'marka', secenekler: yapi.markalar },
    { alan: 'model', secenekler: yapi.modeller[etkin.marka] ?? [] },
  ];
  const yol: KesifDali[] = [];
  let kapsam = liste;
  for (const { alan, secenekler } of tanimlar) {
    const id = etkin[alan];
    if (!id) continue;
    kapsam = kapsam.filter((ilan) => ilan[alan] === id);
    yol.push({
      alan,
      id,
      ad: secenekler.find((secenek) => secenek.id === id)?.ad ?? id,
      sayi: kapsam.length,
    });
  }
  const alan: keyof KesifSecimi | null = !etkin.kategori
    ? 'kategori'
    : !etkin.altKategori
      ? 'altKategori'
      : !etkin.marka
        ? 'marka'
        : !etkin.model
          ? 'model'
          : null;
  const secenekler =
    alan === 'kategori'
      ? kategoriler.map((kategori) => ({
          ...kategori,
          sayi: liste.filter((ilan) => ilan.kategori === kategori.id).length,
        }))
      : alan === 'altKategori'
        ? dallar.altKategoriler
        : alan === 'marka'
          ? dallar.markalar
          : alan === 'model'
            ? dallar.modeller
            : [];
  return {
    secim: etkin,
    yol,
    alan,
    baslik: alan
      ? {
          kategori: 'Kategoriler',
          altKategori: yapi.altKategoriBasligi,
          marka: yapi.markaBasligi,
          model: yapi.modelBasligi,
        }[alan]
      : '',
    secenekler,
  };
}
