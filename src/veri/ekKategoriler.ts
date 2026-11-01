import type { AltKategori } from './kategoriler.ts';

type Grup = [id: string, ad: string, turler: [string, string][]];
const dal = (id: string, ad: string, gruplar: Grup[]): AltKategori => ({
  id,
  ad,
  markaBasligi: 'Ürün grubu',
  modelBasligi: 'Ürün türü',
  markalar: gruplar.map(([id, ad, turler]) => ({
    id,
    ad,
    modeller: turler.map(([id, ad]) => ({ id, ad })),
  })),
});

/** Ürün türleri marka yerine kullanıldığında seçim alanları da tür adıyla gösterilir. */
export const ekKategoriler = {
  spor: [
    dal('bisiklet', 'Bisiklet', [
      [
        'yetiskin',
        'Yetişkin bisikleti',
        [
          ['dag-bisikleti', 'Dağ bisikleti'],
          ['yol-bisikleti', 'Yol bisikleti'],
          ['sehir-bisikleti', 'Şehir bisikleti'],
          ['gravel', 'Gravel bisiklet'],
          ['katlanir-bisiklet', 'Katlanır bisiklet'],
          ['elektrikli-bisiklet', 'Elektrikli bisiklet'],
        ],
      ],
      [
        'cocuk',
        'Çocuk bisikleti',
        [
          ['denge-bisikleti', 'Denge bisikleti'],
          ['cocuk-bisikleti', 'Pedallı çocuk bisikleti'],
          ['bmx', 'BMX'],
        ],
      ],
      [
        'bisiklet-parcasi',
        'Yedek parça ve aksesuar',
        [
          ['kadro', 'Kadro ve maşa'],
          ['jant-lastik', 'Jant ve lastik'],
          ['vites-fren', 'Vites ve fren'],
          ['bisiklet-kaski', 'Bisiklet kaskı'],
          ['bisiklet-cantasi', 'Çanta ve taşıyıcı'],
          ['bisiklet-trainer', 'Bisiklet trainer'],
        ],
      ],
    ]),
    dal('fitness', 'Fitness ve kondisyon', [
      [
        'kardiyo',
        'Kardiyo ekipmanı',
        [
          ['kosu-bandi', 'Koşu bandı'],
          ['kondisyon-bisikleti', 'Kondisyon bisikleti'],
          ['eliptik-bisiklet', 'Eliptik bisiklet'],
          ['kurek', 'Kürek ergometresi'],
        ],
      ],
      [
        'aksesuar',
        'Antrenman aksesuarları',
        [
          ['atlama-ipi', 'Atlama ipi'],
          ['step-tahtasi', 'Step tahtası'],
          ['nabiz-olcer', 'Nabız ölçer'],
        ],
      ],
    ]),
    dal('vucut-gelistirme', 'Vücut geliştirme', [
      [
        'agirlik',
        'Ağırlıklar',
        [
          ['dambil', 'Dambıl'],
          ['halter', 'Halter ve bar'],
          ['plaka', 'Ağırlık plakası'],
          ['kettlebell', 'Kettlebell'],
        ],
      ],
      [
        'istasyon',
        'İstasyon ve sehpa',
        [
          ['agirlik-sehpasi', 'Ağırlık sehpası'],
          ['guc-istasyonu', 'Güç istasyonu'],
          ['rack', 'Squat rack'],
          ['barfiks', 'Barfiks barı'],
        ],
      ],
    ]),
    dal('pilates-yoga', 'Pilates, yoga ve jimnastik', [
      [
        'pilates',
        'Pilates',
        [
          ['reformer', 'Reformer'],
          ['pilates-topu', 'Pilates topu'],
          ['pilates-cemberi', 'Pilates çemberi'],
          ['direnc-bandi', 'Direnç bandı'],
        ],
      ],
      [
        'yoga',
        'Yoga ve jimnastik',
        [
          ['yoga-mati', 'Yoga matı'],
          ['yoga-blogu', 'Yoga bloğu'],
          ['denge-tahtasi', 'Denge tahtası'],
          ['jimnastik-minderi', 'Jimnastik minderi'],
        ],
      ],
    ]),
    dal('takim-sporlari', 'Takım sporları', [
      [
        'futbol',
        'Futbol',
        [
          ['futbol-topu', 'Futbol topu'],
          ['krampon', 'Krampon'],
          ['kaleci-eldiveni', 'Kaleci eldiveni'],
          ['kale', 'Kale'],
        ],
      ],
      [
        'basketbol',
        'Basketbol',
        [
          ['basketbol-topu', 'Basketbol topu'],
          ['pota', 'Pota'],
          ['basketbol-ayakkabisi', 'Basketbol ayakkabısı'],
        ],
      ],
      [
        'voleybol',
        'Voleybol ve hentbol',
        [
          ['voleybol-topu', 'Voleybol topu'],
          ['voleybol-filesi', 'Voleybol filesi'],
          ['hentbol-topu', 'Hentbol topu'],
        ],
      ],
    ]),
    dal('doga-sporlari', 'Doğa sporları', [
      [
        'kamp',
        'Kamp',
        [
          ['cadir', 'Çadır'],
          ['uyku-tulumu', 'Uyku tulumu'],
          ['kamp-mati', 'Kamp matı'],
          ['kamp-sandalyesi', 'Kamp sandalyesi'],
          ['kamp-mutfagi', 'Kamp mutfağı'],
        ],
      ],
      [
        'yuruyus',
        'Yürüyüş ve tırmanış',
        [
          ['trekking-cantasi', 'Trekking çantası'],
          ['baton', 'Yürüyüş batonu'],
          ['tirmanis-kemeri', 'Tırmanış kemeri'],
          ['outdoor-ayakkabi', 'Outdoor ayakkabı'],
        ],
      ],
      [
        'balikcilik',
        'Balıkçılık',
        [
          ['olta', 'Olta'],
          ['olta-makinesi', 'Olta makinesi'],
          ['balikcilik-aksesuari', 'Balıkçılık aksesuarı'],
        ],
      ],
    ]),
    dal('raket-sporlari', 'Raket sporları', [
      [
        'tenis',
        'Tenis ve padel',
        [
          ['tenis-raketi', 'Tenis raketi'],
          ['padel-raketi', 'Padel raketi'],
          ['tenis-topu', 'Tenis topu'],
        ],
      ],
      [
        'masa-tenisi',
        'Masa tenisi',
        [
          ['masa-tenisi-masasi', 'Masa tenisi masası'],
          ['masa-tenisi-raketi', 'Masa tenisi raketi'],
        ],
      ],
      [
        'badminton',
        'Badminton ve squash',
        [
          ['badminton-raketi', 'Badminton raketi'],
          ['squash-raketi', 'Squash raketi'],
        ],
      ],
    ]),
    dal('su-sporlari', 'Su sporları', [
      [
        'yuzme',
        'Yüzme',
        [
          ['yuzucu-gozlugu', 'Yüzücü gözlüğü'],
          ['palet', 'Palet'],
          ['yuzme-ekipmani', 'Yüzme ekipmanı'],
        ],
      ],
      [
        'dalis',
        'Dalış',
        [
          ['dalis-elbisesi', 'Dalış elbisesi'],
          ['dalis-maskesi', 'Dalış maskesi'],
          ['dalis-ekipmani', 'Dalış ekipmanı'],
        ],
      ],
      [
        'sorf-kurek',
        'Sörf ve kürek',
        [
          ['sup', 'SUP'],
          ['sorf-tahtasi', 'Sörf tahtası'],
          ['kano', 'Kano'],
          ['can-yelegi', 'Can yeleği'],
        ],
      ],
    ]),
    dal('kis-sporlari', 'Kış sporları', [
      [
        'kayak',
        'Kayak',
        [
          ['kayak-takimi', 'Kayak takımı'],
          ['kayak-botu', 'Kayak botu'],
          ['kayak-batonu', 'Kayak batonu'],
        ],
      ],
      [
        'snowboard',
        'Snowboard',
        [
          ['snowboard-tahtasi', 'Snowboard tahtası'],
          ['snowboard-botu', 'Snowboard botu'],
          ['snowboard-baglama', 'Snowboard bağlama'],
        ],
      ],
      [
        'koruma',
        'Kask ve gözlük',
        [
          ['kis-kaski', 'Kış sporları kaskı'],
          ['kayak-gozlugu', 'Kayak gözlüğü'],
        ],
      ],
    ]),
    dal('dovus-sporlari', 'Dövüş sporları', [
      [
        'boks',
        'Boks ve kick boks',
        [
          ['boks-eldiveni', 'Boks eldiveni'],
          ['kum-torbasi', 'Kum torbası'],
          ['boks-lapasi', 'Lapa'],
        ],
      ],
      [
        'savunma',
        'Savunma sporları',
        [
          ['kimono', 'Kimono'],
          ['tekvando-ekipmani', 'Tekvando ekipmanı'],
          ['koruyucu', 'Koruyucu ekipman'],
        ],
      ],
    ]),
    dal('paten-kaykay', 'Paten ve kaykay', [
      [
        'paten',
        'Paten',
        [
          ['inline-paten', 'Inline paten'],
          ['quad-paten', 'Quad paten'],
          ['buz-pateni', 'Buz pateni'],
        ],
      ],
      [
        'kaykay',
        'Kaykay ve scooter',
        [
          ['kaykay', 'Kaykay'],
          ['longboard', 'Longboard'],
          ['stunt-scooter', 'Stunt scooter'],
          ['koruma-seti', 'Koruma seti'],
        ],
      ],
    ]),
    dal('salon-oyunlari', 'Salon oyunları', [
      [
        'masa-oyunu',
        'Masa oyunları',
        [
          ['bilardo', 'Bilardo'],
          ['langirt', 'Langırt'],
          ['dart', 'Dart'],
        ],
      ],
      [
        'aksesuar',
        'Aksesuarlar',
        [
          ['bilardo-istakasi', 'Bilardo ıstakası'],
          ['dart-oku', 'Dart oku'],
        ],
      ],
    ]),
    dal('taraftar-urunleri', 'Taraftar ürünleri', [
      [
        'giyim',
        'Taraftar giyim',
        [
          ['forma', 'Forma'],
          ['taraftar-atkisi', 'Atkı'],
          ['taraftar-montu', 'Mont ve eşofman'],
        ],
      ],
      [
        'aksesuar',
        'Taraftar aksesuarları',
        [
          ['bayrak', 'Bayrak'],
          ['taraftar-objesi', 'Taraftar objesi'],
        ],
      ],
    ]),
    dal('atletizm', 'Atletizm', [
      [
        'kosu',
        'Koşu',
        [
          ['kosu-ayakkabisi', 'Koşu ayakkabısı'],
          ['kosu-ekipmani', 'Koşu ekipmanı'],
        ],
      ],
      [
        'pist',
        'Pist ekipmanları',
        [
          ['engel', 'Atletizm engeli'],
          ['atma-ekipmani', 'Atma ekipmanı'],
        ],
      ],
    ]),
  ],
  'anne-bebek': [
    dal('tasima', 'Taşıma', [
      [
        'bebek-arabasi',
        'Bebek arabası ve puset',
        [
          ['travel-sistem', 'Travel sistem'],
          ['baston-puset', 'Baston puset'],
          ['kabin-boy', 'Kabin boy bebek arabası'],
          ['ikiz-bebek-arabasi', 'İkiz bebek arabası'],
        ],
      ],
      [
        'oto-koltugu',
        'Çocuk oto koltuğu',
        [
          ['bebek-oto-koltugu', 'Bebek oto koltuğu'],
          ['cocuk-oto-koltugu', 'Çocuk oto koltuğu'],
          ['yukseltici', 'Yükseltici'],
          ['isofix-baza', 'ISOFIX baza'],
        ],
      ],
      [
        'kucakta-tasima',
        'Kucakta taşıma',
        [
          ['kanguru', 'Kanguru'],
          ['sling', 'Sling'],
          ['portbebe', 'Portbebe'],
        ],
      ],
    ]),
    dal('mobilya', 'Bebek odası mobilyası', [
      [
        'uyku',
        'Beşik ve yatak',
        [
          ['besik', 'Beşik'],
          ['anne-yani-besik', 'Anne yanı beşik'],
          ['park-yatak', 'Park yatak'],
          ['bebek-karyolasi', 'Bebek karyolası'],
        ],
      ],
      [
        'oda',
        'Oda mobilyası',
        [
          ['bebek-dolabi', 'Bebek dolabı'],
          ['alt-acma-unitesi', 'Alt açma ünitesi'],
          ['sifonyer', 'Şifonyer'],
        ],
      ],
    ]),
    dal('beslenme', 'Beslenme', [
      [
        'oturma',
        'Mama sandalyesi',
        [
          ['mama-sandalyesi', 'Mama sandalyesi'],
          ['yukseltici-sandalye', 'Yükseltici sandalye'],
        ],
      ],
      [
        'hazirlama',
        'Mama hazırlama',
        [
          ['biberon-isitici', 'Biberon ısıtıcı'],
          ['sterilizator', 'Sterilizatör'],
          ['bebek-mutfak-robotu', 'Bebek mutfak robotu'],
        ],
      ],
      [
        'beslenme-gerecleri',
        'Beslenme gereçleri',
        [
          ['biberon', 'Biberon'],
          ['suluk', 'Suluk'],
          ['beslenme-seti', 'Beslenme seti'],
        ],
      ],
    ]),
    dal('emzirme', 'Emzirme', [
      [
        'sut-sagma',
        'Süt sağma',
        [
          ['elektrikli-sut-pompasi', 'Elektrikli süt pompası'],
          ['manuel-sut-pompasi', 'Manuel süt pompası'],
        ],
      ],
      [
        'emzirme-aksesuari',
        'Emzirme aksesuarları',
        [
          ['emzirme-yastigi', 'Emzirme yastığı'],
          ['sut-saklama', 'Süt saklama gereçleri'],
          ['emzirme-ortusu', 'Emzirme örtüsü'],
        ],
      ],
    ]),
    dal('banyo', 'Banyo ürünleri', [
      [
        'banyo',
        'Banyo ekipmanları',
        [
          ['bebek-kuveti', 'Bebek küveti'],
          ['banyo-filesi', 'Banyo filesi'],
          ['banyo-oturagi', 'Banyo oturağı'],
        ],
      ],
      [
        'tekstil',
        'Banyo tekstili',
        [
          ['bebek-havlusu', 'Bebek havlusu'],
          ['bebek-bornozu', 'Bebek bornozu'],
        ],
      ],
    ]),
    dal('guvenlik', 'Güvenlik', [
      [
        'izleme',
        'İzleme ve haberleşme',
        [
          ['bebek-kamerasi', 'Bebek kamerası'],
          ['bebek-telsizi', 'Bebek telsizi'],
        ],
      ],
      [
        'ev-guvenligi',
        'Ev güvenliği',
        [
          ['guvenlik-kapisi', 'Güvenlik kapısı'],
          ['yatak-bariyeri', 'Yatak bariyeri'],
          ['kose-koruyucu', 'Köşe ve priz koruyucu'],
        ],
      ],
    ]),
    dal('bebek-oyuncaklari', 'Bebek oyuncakları', [
      [
        'gelisim',
        'Gelişim oyuncakları',
        [
          ['oyun-halisi', 'Oyun halısı'],
          ['donence', 'Dönence'],
          ['aktivite-masasi', 'Aktivite masası'],
          ['egitici-oyuncak', 'Eğitici oyuncak'],
        ],
      ],
      [
        'hareket',
        'Hareket ve dinlenme',
        [
          ['ana-kucagi', 'Ana kucağı'],
          ['bebek-salincagi', 'Bebek salıncağı'],
          ['ilk-adim-arabasi', 'İlk adım arabası'],
        ],
      ],
    ]),
    dal('bebek-giyim', 'Bebek giyim', [
      [
        'gunluk',
        'Günlük giyim',
        [
          ['bebek-tulumu', 'Tulum'],
          ['bebek-body', 'Body ve zıbın'],
          ['bebek-takimi', 'Alt üst takım'],
        ],
      ],
      [
        'dis-giyim',
        'Dış giyim ve ayakkabı',
        [
          ['bebek-montu', 'Bebek montu'],
          ['bebek-ayakkabisi', 'Bebek ayakkabısı'],
          ['bebek-sapkasi', 'Bebek şapkası'],
        ],
      ],
    ]),
    dal('ev-tekstili', 'Bebek ev tekstili', [
      [
        'uyku',
        'Uyku tekstili',
        [
          ['bebek-nevresimi', 'Nevresim'],
          ['bebek-battaniyesi', 'Battaniye'],
          ['uyku-tulumu', 'Bebek uyku tulumu'],
        ],
      ],
      [
        'oda',
        'Oda tekstili',
        [
          ['bebek-perdesi', 'Perde'],
          ['bebek-halisi', 'Halı'],
          ['alt-acma-ortusu', 'Alt açma örtüsü'],
        ],
      ],
    ]),
    dal('saglik-hijyen', 'Sağlık ve hijyen', [
      [
        'olcum',
        'Ölçüm cihazları',
        [
          ['ates-olcer', 'Ateş ölçer'],
          ['bebek-tartisi', 'Bebek tartısı'],
        ],
      ],
      [
        'bakim',
        'Bakım gereçleri',
        [
          ['burun-aspiratoru', 'Burun aspiratörü'],
          ['tirnak-bakimi', 'Tırnak bakım seti'],
          ['lazimlik', 'Lazımlık'],
        ],
      ],
    ]),
    dal('bebek-bezi', 'Bebek bezi ve değiştirme', [
      [
        'bez',
        'Bebek bezi',
        [
          ['tek-kullanimlik-bez', 'Tek kullanımlık bez'],
          ['yikanabilir-bez', 'Yıkanabilir bez'],
        ],
      ],
      [
        'degistirme',
        'Bez değiştirme',
        [
          ['bez-cantasi', 'Bebek bakım çantası'],
          ['bez-kovasi', 'Bez kovası'],
        ],
      ],
    ]),
    dal('ani-kutlama', 'Anı ve kutlama', [
      [
        'ani',
        'Anı ürünleri',
        [
          ['ani-defteri', 'Anı defteri'],
          ['bebek-albumu', 'Bebek albümü'],
          ['el-ayak-izi', 'El ve ayak izi seti'],
        ],
      ],
      [
        'kutlama',
        'Kutlama ve oda süsü',
        [
          ['kapi-susu', 'Kapı süsü'],
          ['dogum-gunu-seti', 'Doğum günü seti'],
          ['oda-susu', 'Oda süsü'],
        ],
      ],
    ]),
  ],
  muzik: [
    dal('muzik-aletleri', 'Müzik aletleri', [
      [
        'gitar',
        'Gitar',
        [
          ['klasik-gitar', 'Klasik gitar'],
          ['akustik-gitar', 'Akustik gitar'],
          ['elektro-gitar', 'Elektro gitar'],
          ['bas-gitar', 'Bas gitar'],
        ],
      ],
      [
        'tuslu',
        'Tuşlu çalgılar',
        [
          ['dijital-piyano', 'Dijital piyano'],
          ['akustik-piyano', 'Akustik piyano'],
          ['klavye-org', 'Klavye ve org'],
          ['synthesizer', 'Synthesizer'],
        ],
      ],
      [
        'yayli',
        'Yaylı çalgılar',
        [
          ['keman', 'Keman'],
          ['viyola', 'Viyola'],
          ['viyolonsel', 'Viyolonsel'],
          ['kontrbas', 'Kontrbas'],
        ],
      ],
      [
        'vurmalilar',
        'Vurmalı çalgılar',
        [
          ['akustik-bateri', 'Akustik bateri'],
          ['elektronik-bateri', 'Elektronik bateri'],
          ['darbuka', 'Darbuka'],
          ['cajon', 'Cajon'],
        ],
      ],
      [
        'uflemeli',
        'Üflemeli çalgılar',
        [
          ['flut', 'Flüt'],
          ['klarnet', 'Klarnet'],
          ['saksafon', 'Saksafon'],
          ['trompet', 'Trompet'],
          ['ney', 'Ney'],
        ],
      ],
      [
        'telli',
        'Diğer telli çalgılar',
        [
          ['baglama', 'Bağlama'],
          ['ud', 'Ud'],
          ['ukulele', 'Ukulele'],
          ['mandolin', 'Mandolin'],
        ],
      ],
    ]),
    dal('enstruman-aksesuari', 'Enstrüman aksesuarları', [
      [
        'tasima',
        'Kılıf ve stand',
        [
          ['enstruman-kilifi', 'Enstrüman kılıfı'],
          ['enstruman-standi', 'Enstrüman standı'],
        ],
      ],
      [
        'gitar-aksesuari',
        'Gitar aksesuarları',
        [
          ['gitar-teli', 'Gitar teli'],
          ['efekt-pedali', 'Efekt pedalı'],
          ['gitar-amfisi', 'Gitar amfisi'],
          ['akort-cihazi', 'Akort cihazı'],
        ],
      ],
      [
        'diger-aksesuar',
        'Diğer aksesuarlar',
        [
          ['metronom', 'Metronom'],
          ['nota-sehpasi', 'Nota sehpası'],
          ['piyano-pedali', 'Piyano pedalı'],
        ],
      ],
    ]),
    dal('studyo-ekipmanlari', 'Stüdyo ekipmanları', [
      [
        'kayit',
        'Kayıt',
        [
          ['ses-karti', 'Ses kartı'],
          ['studyo-mikrofonu', 'Stüdyo mikrofonu'],
          ['kayit-cihazi', 'Kayıt cihazı'],
        ],
      ],
      [
        'dinleme',
        'Dinleme',
        [
          ['referans-monitoru', 'Referans monitörü'],
          ['studyo-kulakligi', 'Stüdyo kulaklığı'],
        ],
      ],
      [
        'kontrol',
        'Kontrol ve akustik',
        [
          ['midi-klavye', 'MIDI klavye'],
          ['midi-kontrolcu', 'MIDI kontrolcü'],
          ['akustik-panel', 'Akustik panel'],
        ],
      ],
    ]),
    dal('dj-ekipmanlari', 'DJ ekipmanları', [
      [
        'calma',
        'Çalma ve kontrol',
        [
          ['dj-kontrolcu', 'DJ kontrolcü'],
          ['dj-player', 'DJ player'],
          ['dj-pikap', 'DJ pikap'],
        ],
      ],
      [
        'miks',
        'Miks ve aksesuarlar',
        [
          ['dj-mikser', 'DJ mikser'],
          ['dj-kulakligi', 'DJ kulaklığı'],
          ['dj-kilif', 'DJ taşıma çantası'],
        ],
      ],
    ]),
    dal('sahne-sistemleri', 'Sahne sistemleri', [
      [
        'ses',
        'Sahne sesi',
        [
          ['aktif-kabin', 'Aktif hoparlör'],
          ['pasif-kabin', 'Pasif hoparlör'],
          ['mikser', 'Mikser'],
          ['power-amfi', 'Power amfi'],
        ],
      ],
      [
        'mikrofon',
        'Mikrofon',
        [
          ['kablolu-mikrofon', 'Kablolu mikrofon'],
          ['kablosuz-mikrofon', 'Kablosuz mikrofon'],
        ],
      ],
      [
        'isik',
        'Sahne ışığı ve altyapı',
        [
          ['sahne-isigi', 'Sahne ışığı'],
          ['truss', 'Truss'],
          ['sahne-kablosu', 'Sahne kablosu'],
        ],
      ],
    ]),
    dal('albumler', 'Albümler', [
      [
        'fiziksel-album',
        'Fiziksel albümler',
        [
          ['plak', 'Plak'],
          ['cd', 'CD'],
          ['kaset', 'Kaset'],
          ['muzik-dvd', 'Müzik DVD'],
        ],
      ],
      [
        'album-seti',
        'Albüm setleri',
        [
          ['box-set', 'Box set'],
          ['konser-kaydi', 'Konser kaydı'],
        ],
      ],
    ]),
  ],
  kitap: [
    dal('edebiyat', 'Edebiyat', [
      [
        'kurmaca',
        'Kurmaca',
        [
          ['roman', 'Roman'],
          ['oyku', 'Öykü'],
          ['bilim-kurgu', 'Bilim kurgu'],
          ['fantastik', 'Fantastik'],
          ['polisiye', 'Polisiye'],
        ],
      ],
      [
        'diger-edebiyat',
        'Diğer edebiyat',
        [
          ['siir', 'Şiir'],
          ['deneme', 'Deneme'],
          ['tiyatro', 'Tiyatro'],
          ['biyografi', 'Biyografi'],
        ],
      ],
    ]),
    dal('egitim', 'Eğitim ve sınav', [
      [
        'sinav',
        'Sınav hazırlık',
        [
          ['yks', 'YKS'],
          ['lgs', 'LGS'],
          ['kpss', 'KPSS'],
          ['ales-dgs', 'ALES ve DGS'],
          ['yabanci-dil-sinavi', 'Yabancı dil sınavları'],
        ],
      ],
      [
        'ders',
        'Ders ve dil eğitimi',
        [
          ['ilkokul', 'İlkokul'],
          ['ortaokul', 'Ortaokul'],
          ['lise', 'Lise'],
          ['universite', 'Üniversite'],
          ['dil-kitabi', 'Dil kitabı'],
          ['sozluk', 'Sözlük'],
        ],
      ],
    ]),
    dal('kaynak-bilgi', 'Kaynak ve bilgi kitapları', [
      [
        'bilim',
        'Bilim ve teknoloji',
        [
          ['populer-bilim', 'Popüler bilim'],
          ['bilgisayar-yazilim', 'Bilgisayar ve yazılım'],
          ['muhendislik', 'Mühendislik'],
        ],
      ],
      [
        'sosyal',
        'Sosyal bilimler',
        [
          ['tarih', 'Tarih'],
          ['felsefe', 'Felsefe'],
          ['psikoloji', 'Psikoloji'],
          ['ekonomi', 'Ekonomi'],
          ['hukuk', 'Hukuk'],
        ],
      ],
      [
        'yasam',
        'Yaşam ve sanat',
        [
          ['sanat-kitabi', 'Sanat'],
          ['yemek-kitabi', 'Yemek'],
          ['gezi-kitabi', 'Gezi'],
          ['kisisel-gelisim', 'Kişisel gelişim'],
          ['din', 'Din ve inanç'],
        ],
      ],
    ]),
    dal('cocuk-kitaplari', 'Çocuk kitapları', [
      [
        'okul-oncesi',
        'Okul öncesi',
        [
          ['resimli-kitap', 'Resimli kitap'],
          ['etkinlik-kitabi', 'Etkinlik kitabı'],
          ['sesli-kitap', 'Sesli kitap'],
        ],
      ],
      [
        'okuma',
        'Okuma kitapları',
        [
          ['masal', 'Masal'],
          ['cocuk-romani', 'Çocuk romanı'],
          ['cocuk-bilim', 'Çocuklar için bilim'],
        ],
      ],
    ]),
    dal('cizgi-roman', 'Çizgi roman', [
      [
        'cizgi-roman',
        'Çizgi romanlar',
        [
          ['manga', 'Manga'],
          ['super-kahraman', 'Süper kahraman'],
          ['grafik-roman', 'Grafik roman'],
          ['mizah', 'Mizah'],
        ],
      ],
      [
        'set',
        'Set ve seriler',
        [
          ['cizgi-roman-seti', 'Çizgi roman seti'],
          ['manga-seti', 'Manga seti'],
        ],
      ],
    ]),
    dal('dergi', 'Dergi', [
      [
        'guncel',
        'Güncel dergiler',
        [
          ['bilim-dergisi', 'Bilim'],
          ['sanat-dergisi', 'Sanat ve edebiyat'],
          ['hobi-dergisi', 'Hobi'],
          ['spor-dergisi', 'Spor'],
        ],
      ],
      [
        'arsiv',
        'Arşiv',
        [
          ['dergi-seti', 'Dergi seti'],
          ['eski-sayi', 'Eski sayılar'],
        ],
      ],
    ]),
    dal('film', 'Film ve dizi', [
      [
        'film',
        'Film',
        [
          ['dvd-film', 'DVD'],
          ['blu-ray-film', 'Blu-ray'],
          ['4k-film', '4K UHD Blu-ray'],
          ['vhs-film', 'VHS'],
        ],
      ],
      [
        'set',
        'Dizi ve setler',
        [
          ['dizi-seti', 'Dizi seti'],
          ['film-seti', 'Film seti'],
          ['belgesel', 'Belgesel'],
        ],
      ],
    ]),
    dal('yabanci-dilde', 'Yabancı dilde kitaplar', [
      [
        'dil',
        'Dile göre',
        [
          ['ingilizce', 'İngilizce'],
          ['almanca', 'Almanca'],
          ['fransizca', 'Fransızca'],
          ['arapca', 'Arapça'],
          ['diger-dil', 'Diğer diller'],
        ],
      ],
      ['set', 'Setler', [['yabanci-kitap-seti', 'Kitap seti']]],
    ]),
    dal('kitap-elektronigi', 'Kitap elektroniği ve aksesuar', [
      [
        'okuyucu',
        'E-kitap okuyucu',
        [
          ['kindle', 'Amazon Kindle'],
          ['kobo', 'Kobo'],
          ['pocketbook', 'PocketBook'],
          ['diger-okuyucu', 'Diğer okuyucular'],
        ],
      ],
      [
        'aksesuar',
        'Kitap aksesuarları',
        [
          ['kitap-lambasi', 'Kitap lambası'],
          ['okuyucu-kilifi', 'E-kitap okuyucu kılıfı'],
          ['kitap-standi', 'Kitap standı'],
        ],
      ],
    ]),
  ],
  hobi: [
    dal('diecast-model', 'Diecast model', [
      [
        'arac',
        'Model araçlar',
        [
          ['model-otomobil', 'Otomobil'],
          ['model-motosiklet', 'Motosiklet'],
          ['model-is-makinesi', 'İş makinesi'],
          ['model-ucak', 'Uçak'],
          ['model-tren', 'Tren'],
        ],
      ],
      [
        'aksesuar',
        'Model aksesuarları',
        [
          ['diorama', 'Diorama'],
          ['model-vitrini', 'Model vitrini'],
          ['model-parcasi', 'Model parçası'],
        ],
      ],
    ]),
    dal('rc-araclar', 'RC araçlar', [
      [
        'kara',
        'Kara araçları',
        [
          ['rc-otomobil', 'RC otomobil'],
          ['rc-kamyon', 'RC kamyon'],
          ['rc-is-makinesi', 'RC iş makinesi'],
        ],
      ],
      [
        'hava-su',
        'Hava ve su araçları',
        [
          ['rc-ucak', 'RC uçak'],
          ['rc-helikopter', 'RC helikopter'],
          ['rc-tekne', 'RC tekne'],
        ],
      ],
      [
        'rc-aksesuar',
        'RC parça ve aksesuar',
        [
          ['rc-kumanda', 'Kumanda'],
          ['rc-batarya', 'Batarya'],
          ['rc-motor', 'Motor'],
          ['rc-yedek-parca', 'Yedek parça'],
        ],
      ],
    ]),
    dal('oyuncak', 'Oyuncak', [
      [
        'yapi-oyuncagi',
        'Yapı oyuncakları',
        [
          ['lego', 'LEGO'],
          ['manyetik-blok', 'Manyetik blok'],
          ['ahsap-blok', 'Ahşap blok'],
        ],
      ],
      [
        'rol-oyunu',
        'Rol ve hayal oyunları',
        [
          ['oyuncak-bebek', 'Oyuncak bebek'],
          ['oyun-mutfagi', 'Oyun mutfağı'],
          ['oyuncak-seti', 'Oyuncak seti'],
        ],
      ],
      [
        'dis-mekan',
        'Dış mekân oyuncakları',
        [
          ['akulu-araba', 'Akülü araba'],
          ['oyun-evi', 'Oyun evi'],
          ['cocuk-salincagi', 'Çocuk salıncağı'],
        ],
      ],
      [
        'pelus',
        'Peluş',
        [
          ['pelus-oyuncak', 'Peluş oyuncak'],
          ['karakter-pelus', 'Karakter pelüşü'],
        ],
      ],
    ]),
    dal('aksiyon-figuru', 'Aksiyon figürleri', [
      [
        'karakter',
        'Karakter figürleri',
        [
          ['anime-figuru', 'Anime figürü'],
          ['film-figuru', 'Film figürü'],
          ['oyun-figuru', 'Oyun figürü'],
          ['cizgi-roman-figuru', 'Çizgi roman figürü'],
        ],
      ],
      [
        'set',
        'Set ve aksesuar',
        [
          ['figur-seti', 'Figür seti'],
          ['figur-aksesuari', 'Figür aksesuarı'],
        ],
      ],
    ]),
    dal('koleksiyon-kartlari', 'Koleksiyon kartları', [
      [
        'oyun',
        'Oyun kartları',
        [
          ['pokemon', 'Pokémon'],
          ['magic', 'Magic: The Gathering'],
          ['yugioh', 'Yu-Gi-Oh!'],
        ],
      ],
      [
        'spor',
        'Spor ve karakter kartları',
        [
          ['spor-karti', 'Spor kartı'],
          ['karakter-karti', 'Karakter kartı'],
        ],
      ],
      [
        'kart-aksesuar',
        'Kart aksesuarları',
        [
          ['kart-albumu', 'Kart albümü'],
          ['kart-koruyucu', 'Kart koruyucu'],
        ],
      ],
    ]),
    dal('maket', 'Maket', [
      [
        'model',
        'Maketler',
        [
          ['ucak-maketi', 'Uçak maketi'],
          ['gemi-maketi', 'Gemi maketi'],
          ['arac-maketi', 'Araç maketi'],
          ['mimari-maket', 'Mimari maket'],
        ],
      ],
      [
        'malzeme',
        'Maket malzemeleri',
        [
          ['maket-boyasi', 'Maket boyası'],
          ['airbrush', 'Airbrush'],
          ['maket-aleti', 'Maket el aleti'],
        ],
      ],
    ]),
    dal('puzzle', 'Puzzle ve yapboz', [
      [
        'puzzle',
        'Puzzle',
        [
          ['yetiskin-puzzle', 'Yetişkin puzzle'],
          ['cocuk-puzzle', 'Çocuk puzzle'],
          ['3d-puzzle', '3D puzzle'],
        ],
      ],
      [
        'aksesuar',
        'Puzzle aksesuarları',
        [
          ['puzzle-mati', 'Puzzle matı'],
          ['puzzle-cercevesi', 'Puzzle çerçevesi'],
        ],
      ],
    ]),
    dal('kutu-oyunlari', 'Masa ve kutu oyunları', [
      [
        'kutu',
        'Kutu oyunları',
        [
          ['strateji-oyunu', 'Strateji'],
          ['aile-oyunu', 'Aile'],
          ['parti-oyunu', 'Parti'],
          ['rol-yapma', 'Rol yapma'],
        ],
      ],
      [
        'klasik',
        'Klasik oyunlar',
        [
          ['satranc', 'Satranç'],
          ['tavla', 'Tavla'],
          ['okey', 'Okey'],
          ['iskambil', 'İskambil'],
        ],
      ],
    ]),
    dal('sanat-el-isi', 'Sanat ve el işi', [
      [
        'resim',
        'Resim',
        [
          ['boya-seti', 'Boya seti'],
          ['sovale', 'Şövale'],
          ['tuval', 'Tuval'],
        ],
      ],
      [
        'el-isi',
        'El işi',
        [
          ['orgu', 'Örgü malzemeleri'],
          ['dikis', 'Dikiş malzemeleri'],
          ['seramik', 'Seramik malzemeleri'],
        ],
      ],
    ]),
  ],
  bahce: [
    dal('bahce-ekipmani', 'Bahçe ekipmanları', [
      [
        'makine',
        'Bahçe makineleri',
        [
          ['cim-bicme', 'Çim biçme makinesi'],
          ['tirpan', 'Tırpan'],
          ['agac-kesme', 'Motorlu testere'],
          ['yaprak-ufleyici', 'Yaprak üfleyici'],
        ],
      ],
      [
        'sulama',
        'Sulama',
        [
          ['bahce-hortumu', 'Bahçe hortumu'],
          ['sulama-pompasi', 'Sulama pompası'],
          ['damla-sulama', 'Damla sulama sistemi'],
        ],
      ],
      [
        'bahce-aleti',
        'Bahçe el aletleri',
        [
          ['budama-makasi', 'Budama makası'],
          ['kurek', 'Kürek'],
          ['tırmik', 'Tırmık'],
          ['capalama', 'Çapalama aleti'],
        ],
      ],
    ]),
    dal('bahce-yasam', 'Bahçe yaşamı', [
      [
        'mobilya',
        'Bahçe mobilyası',
        [
          ['bahce-takimi', 'Bahçe takımı'],
          ['bahce-salincagi', 'Bahçe salıncağı'],
          ['sezlong', 'Şezlong'],
          ['semsiye', 'Bahçe şemsiyesi'],
        ],
      ],
      [
        'dis-mekan',
        'Dış mekân',
        [
          ['mangal', 'Mangal'],
          ['barbeku', 'Barbekü'],
          ['bahce-havuzu', 'Bahçe havuzu'],
          ['saksi', 'Saksı'],
        ],
      ],
    ]),
    dal('el-aletleri', 'El aletleri', [
      [
        'elektrikli',
        'Elektrikli el aletleri',
        [
          ['matkap', 'Matkap'],
          ['vidalama', 'Vidalama'],
          ['taslama', 'Taşlama'],
          ['testere', 'Elektrikli testere'],
          ['zimpara', 'Zımpara'],
          ['kaynak-makinesi', 'Kaynak makinesi'],
        ],
      ],
      [
        'manuel',
        'Manuel el aletleri',
        [
          ['anahtar-takimi', 'Anahtar takımı'],
          ['tornavida', 'Tornavida'],
          ['pense', 'Pense'],
          ['takim-cantasi', 'Takım çantası'],
        ],
      ],
      [
        'olcum',
        'Ölçüm aletleri',
        [
          ['lazer-metre', 'Lazer metre'],
          ['lazer-terazi', 'Lazer terazi'],
          ['kumpas', 'Kumpas'],
        ],
      ],
    ]),
    dal('yapi-malzemeleri', 'Yapı malzemeleri', [
      [
        'kaplama',
        'Zemin ve duvar',
        [
          ['parke', 'Parke'],
          ['seramik', 'Seramik'],
          ['boya', 'Boya'],
          ['duvar-kagidi', 'Duvar kâğıdı'],
        ],
      ],
      [
        'tesisat',
        'Tesisat ve hırdavat',
        [
          ['musluk', 'Musluk ve batarya'],
          ['lavabo', 'Lavabo'],
          ['boru', 'Boru ve bağlantı'],
          ['kapi-kilit', 'Kapı ve kilit'],
        ],
      ],
      [
        'elektrik',
        'Elektrik malzemeleri',
        [
          ['priz-anahtar', 'Priz ve anahtar'],
          ['kablo', 'Kablo'],
          ['pano-sigorta', 'Pano ve sigorta'],
        ],
      ],
    ]),
    dal('prefabrik-yapilar', 'Prefabrik yapılar', [
      [
        'yapi',
        'Hazır yapılar',
        [
          ['konteyner', 'Konteyner'],
          ['prefabrik-ev', 'Prefabrik ev'],
          ['bahce-kulubesi', 'Bahçe kulübesi'],
        ],
      ],
      [
        'aksesuar',
        'Yapı aksesuarları',
        [
          ['sundurma', 'Sundurma'],
          ['pergola', 'Pergola'],
        ],
      ],
    ]),
    dal('is-guvenligi', 'İş güvenliği ve elbiseleri', [
      [
        'koruma',
        'Koruyucu ekipman',
        [
          ['baret', 'Baret'],
          ['is-gozlugu', 'İş gözlüğü'],
          ['is-eldiveni', 'İş eldiveni'],
          ['kulak-koruyucu', 'Kulak koruyucu'],
        ],
      ],
      [
        'giyim',
        'İş giyimi',
        [
          ['is-ayakkabisi', 'İş ayakkabısı'],
          ['is-tulumu', 'İş tulumu'],
          ['reflektorlu-yelek', 'Reflektörlü yelek'],
        ],
      ],
    ]),
  ],
  'kisisel-bakim': [
    dal('sac-bakimi', 'Saç bakım ve şekillendirme', [
      [
        'sekillendirme',
        'Şekillendiriciler',
        [
          ['sac-kurutma', 'Saç kurutma makinesi'],
          ['sac-duzlestirici', 'Saç düzleştirici'],
          ['sac-masasi', 'Saç maşası'],
          ['sac-sekillendirici', 'Çok amaçlı şekillendirici'],
        ],
      ],
      [
        'aksesuar',
        'Saç aksesuarları',
        [
          ['firca-tarak', 'Fırça ve tarak'],
          ['sac-aksesuari', 'Saç aksesuarı'],
        ],
      ],
    ]),
    dal('tiras-epilasyon', 'Tıraş ve epilasyon', [
      [
        'tiras',
        'Tıraş makineleri',
        [
          ['sakal-tiras', 'Sakal tıraş makinesi'],
          ['sac-kesme', 'Saç kesme makinesi'],
          ['vucut-tiras', 'Vücut tıraş makinesi'],
        ],
      ],
      [
        'epilasyon',
        'Epilasyon cihazları',
        [
          ['epilator', 'Epilatör'],
          ['ipl', 'IPL cihazı'],
        ],
      ],
    ]),
    dal('cilt-bakimi', 'Cilt bakım cihazları', [
      [
        'cihaz',
        'Bakım cihazları',
        [
          ['yuz-temizleme', 'Yüz temizleme cihazı'],
          ['buhar-cihazi', 'Yüz buhar cihazı'],
          ['masaj-cihazi', 'Yüz masaj cihazı'],
        ],
      ],
      [
        'aksesuar',
        'Bakım aksesuarları',
        [
          ['makyaj-aynasi', 'Makyaj aynası'],
          ['bakim-seti', 'Bakım seti'],
        ],
      ],
    ]),
    dal('agiz-bakimi', 'Ağız bakım cihazları', [
      [
        'elektrikli',
        'Elektrikli bakım',
        [
          ['elektrikli-dis-fircasi', 'Elektrikli diş fırçası'],
          ['agiz-dusu', 'Ağız duşu'],
        ],
      ],
      [
        'aksesuar',
        'Yedek başlıklar',
        [
          ['dis-fircasi-basligi', 'Diş fırçası başlığı'],
          ['agiz-dusu-basligi', 'Ağız duşu başlığı'],
        ],
      ],
    ]),
    dal('parfum-kozmetik', 'Parfüm ve kozmetik', [
      [
        'parfum',
        'Parfüm',
        [
          ['kadin-parfum', 'Kadın parfüm'],
          ['erkek-parfum', 'Erkek parfüm'],
          ['uniseks-parfum', 'Uniseks parfüm'],
        ],
      ],
      [
        'kozmetik',
        'Kozmetik',
        [
          ['makyaj', 'Makyaj ürünleri'],
          ['cilt-urunu', 'Cilt bakım ürünleri'],
          ['kozmetik-seti', 'Kozmetik seti'],
        ],
      ],
    ]),
    dal('saglik-olcum', 'Sağlık ölçüm cihazları', [
      [
        'olcum',
        'Ölçüm',
        [
          ['tansiyon-aleti', 'Tansiyon aleti'],
          ['ates-olcer', 'Ateş ölçer'],
          ['tarti', 'Tartı'],
          ['oksimetre', 'Oksimetre'],
        ],
      ],
      [
        'aksesuar',
        'Cihaz aksesuarları',
        [
          ['tansiyon-mansonu', 'Tansiyon manşonu'],
          ['olcum-aksesuari', 'Ölçüm aksesuarı'],
        ],
      ],
    ]),
  ],
  'teknik-elektronik': [
    dal('elektronik-bilesen', 'Elektronik bileşenler', [
      [
        'pasif',
        'Pasif bileşenler',
        [
          ['direnc', 'Direnç'],
          ['kondansator', 'Kondansatör'],
          ['bobin', 'Bobin'],
        ],
      ],
      [
        'aktif',
        'Aktif bileşenler',
        [
          ['transistor', 'Transistör'],
          ['diyot', 'Diyot'],
          ['entegre', 'Entegre devre'],
        ],
      ],
    ]),
    dal('gelistirme-karti', 'Geliştirme kartları ve robotik', [
      [
        'kart',
        'Geliştirme kartları',
        [
          ['arduino', 'Arduino'],
          ['raspberry-pi', 'Raspberry Pi'],
          ['esp32', 'ESP32'],
          ['stm32', 'STM32'],
        ],
      ],
      [
        'robotik',
        'Robotik',
        [
          ['sensor', 'Sensör'],
          ['servo-motor', 'Servo motor'],
          ['robot-seti', 'Robot seti'],
          ['motor-surucu', 'Motor sürücü'],
        ],
      ],
    ]),
    dal('olcu-test', 'Ölçü ve test cihazları', [
      [
        'elektrik',
        'Elektrik ölçümü',
        [
          ['multimetre', 'Multimetre'],
          ['pensampermetre', 'Pensampermetre'],
          ['osiloskop', 'Osiloskop'],
          ['sinyal-jeneratoru', 'Sinyal jeneratörü'],
        ],
      ],
      [
        'cevre',
        'Çevresel ölçüm',
        [
          ['termal-kamera', 'Termal kamera'],
          ['luksmetre', 'Lüksmetre'],
          ['ses-olcer', 'Ses ölçer'],
        ],
      ],
    ]),
    dal('lehimleme', 'Lehimleme ve onarım', [
      [
        'istasyon',
        'İstasyonlar',
        [
          ['havya', 'Havya'],
          ['lehim-istasyonu', 'Lehim istasyonu'],
          ['sicak-hava', 'Sıcak hava istasyonu'],
        ],
      ],
      [
        'malzeme',
        'Onarım malzemeleri',
        [
          ['lehim-teli', 'Lehim teli'],
          ['tamir-seti', 'Elektronik tamir seti'],
          ['mikroskop', 'Onarım mikroskobu'],
        ],
      ],
    ]),
    dal('guc-enerji', 'Güç ve enerji', [
      [
        'besleme',
        'Güç kaynakları',
        [
          ['laboratuvar-guc', 'Laboratuvar güç kaynağı'],
          ['adaptör', 'Adaptör'],
          ['inverter', 'Inverter'],
        ],
      ],
      [
        'depolama',
        'Enerji depolama',
        [
          ['aku', 'Akü'],
          ['pil', 'Pil'],
          ['solar-panel', 'Güneş paneli'],
          ['sarj-kontrol', 'Şarj kontrol cihazı'],
        ],
      ],
    ]),
    dal('haberlesme', 'Haberleşme ve otomasyon', [
      [
        'iletisim',
        'Haberleşme',
        [
          ['telsiz', 'Telsiz'],
          ['anten', 'Anten'],
          ['alici-verici', 'Alıcı ve verici'],
        ],
      ],
      [
        'otomasyon',
        'Otomasyon',
        [
          ['plc', 'PLC'],
          ['hmi', 'HMI panel'],
          ['role', 'Röle'],
          ['surucu', 'Motor sürücü'],
        ],
      ],
    ]),
  ],
  ofis: [
    dal('ofis-mobilyasi', 'Ofis mobilyası', [
      [
        'masa',
        'Masalar',
        [
          ['calisma-masasi', 'Çalışma masası'],
          ['toplanti-masasi', 'Toplantı masası'],
          ['banko', 'Karşılama bankosu'],
        ],
      ],
      [
        'oturma',
        'Oturma',
        [
          ['ofis-koltugu', 'Ofis koltuğu'],
          ['misafir-koltugu', 'Misafir koltuğu'],
          ['bekleme-koltugu', 'Bekleme koltuğu'],
        ],
      ],
      [
        'depolama',
        'Depolama',
        [
          ['dosya-dolabi', 'Dosya dolabı'],
          ['keson', 'Keson'],
          ['raf', 'Ofis rafı'],
        ],
      ],
    ]),
    dal('ofis-makineleri', 'Ofis makineleri', [
      [
        'belge',
        'Belge işleme',
        [
          ['evrak-imha', 'Evrak imha makinesi'],
          ['laminasyon', 'Laminasyon makinesi'],
          ['ciltleme', 'Ciltleme makinesi'],
          ['giyotin', 'Kâğıt giyotini'],
        ],
      ],
      [
        'diger',
        'Diğer makineler',
        [
          ['para-sayma', 'Para sayma makinesi'],
          ['hesap-makinesi', 'Hesap makinesi'],
          ['etiket-yazici', 'Etiket yazıcı'],
        ],
      ],
    ]),
    dal('kirtasiye', 'Kırtasiye', [
      [
        'yazi',
        'Yazı gereçleri',
        [
          ['kalem', 'Kalem'],
          ['kalem-seti', 'Kalem seti'],
          ['marker', 'Marker'],
        ],
      ],
      [
        'kagit',
        'Kâğıt ve defter',
        [
          ['defter', 'Defter'],
          ['fotokopi-kagidi', 'Fotokopi kâğıdı'],
          ['ajanda', 'Ajanda'],
        ],
      ],
      [
        'duzen',
        'Dosyalama ve düzen',
        [
          ['dosya-klasor', 'Dosya ve klasör'],
          ['masa-duzenleyici', 'Masa düzenleyici'],
          ['zimba-delgec', 'Zımba ve delgeç'],
        ],
      ],
    ]),
    dal('sunum', 'Sunum ve eğitim', [
      [
        'tahta',
        'Tahta ve pano',
        [
          ['beyaz-tahta', 'Beyaz tahta'],
          ['mantar-pano', 'Mantar pano'],
          ['flipchart', 'Flipchart'],
        ],
      ],
      [
        'sunum',
        'Sunum gereçleri',
        [
          ['sunum-kumandasi', 'Sunum kumandası'],
          ['projeksiyon-perdesi', 'Projeksiyon perdesi'],
        ],
      ],
    ]),
    dal('sarf-malzemeleri', 'Yazıcı sarf malzemeleri', [
      [
        'baski',
        'Baskı malzemeleri',
        [
          ['toner', 'Toner'],
          ['kartus', 'Kartuş'],
          ['murekkep', 'Mürekkep'],
          ['serit', 'Yazıcı şeridi'],
        ],
      ],
      [
        'etiket',
        'Etiket ve rulo',
        [
          ['etiket-rulosu', 'Etiket rulosu'],
          ['termal-rulo', 'Termal rulo'],
        ],
      ],
    ]),
    dal('magaza-ekipmani', 'Mağaza ekipmanları', [
      [
        'teshir',
        'Teşhir',
        [
          ['manken', 'Vitrin mankeni'],
          ['askilik', 'Mağaza askılığı'],
          ['teshir-rafi', 'Teşhir rafı'],
        ],
      ],
      [
        'satis',
        'Satış ekipmanları',
        [
          ['barkod-okuyucu', 'Barkod okuyucu'],
          ['yazar-kasa', 'Yazar kasa'],
          ['terazi', 'Terazi'],
        ],
      ],
    ]),
  ],
  antika: [
    dal('antika-mobilya', 'Antika mobilya', [
      [
        'oturma',
        'Oturma grubu',
        [
          ['antika-koltuk', 'Koltuk'],
          ['antika-sandalye', 'Sandalye'],
        ],
      ],
      [
        'depolama',
        'Masa ve depolama',
        [
          ['antika-masa', 'Masa'],
          ['antika-dolap', 'Dolap'],
          ['antika-konsol', 'Konsol'],
          ['antika-sandik', 'Sandık'],
        ],
      ],
    ]),
    dal('antika-obje', 'Antika obje', [
      [
        'dekoratif',
        'Dekoratif objeler',
        [
          ['antika-vazo', 'Vazo'],
          ['antika-heykel', 'Heykel'],
          ['antika-samdan', 'Şamdan'],
        ],
      ],
      [
        'gunluk',
        'Günlük eşyalar',
        [
          ['antika-telefon', 'Telefon'],
          ['antika-radyo', 'Radyo'],
          ['antika-daktilo', 'Daktilo'],
        ],
      ],
    ]),
    dal('antika-saat', 'Antika saat', [
      [
        'saat',
        'Saatler',
        [
          ['duvar-saati', 'Duvar saati'],
          ['masa-saati', 'Masa saati'],
          ['cep-saati', 'Cep saati'],
          ['kurmali-saat', 'Kurmalı saat'],
        ],
      ],
      [
        'parca',
        'Saat parçaları',
        [
          ['saat-mekanizmasi', 'Saat mekanizması'],
          ['saat-kasasi', 'Saat kasası'],
        ],
      ],
    ]),
    dal('antika-aydinlatma', 'Antika aydınlatma', [
      [
        'elektrikli',
        'Elektrikli aydınlatma',
        [
          ['antika-avize', 'Avize'],
          ['antika-lamba', 'Lamba'],
          ['antika-aplik', 'Aplik'],
        ],
      ],
      [
        'diger',
        'Diğer aydınlatmalar',
        [
          ['gaz-lambasi', 'Gaz lambası'],
          ['kandil', 'Kandil'],
          ['fener', 'Fener'],
        ],
      ],
    ]),
    dal('antika-sofra', 'Antika sofra ve mutfak', [
      [
        'porselen',
        'Porselen ve cam',
        [
          ['antika-tabak', 'Tabak'],
          ['antika-fincan', 'Fincan'],
          ['antika-cam', 'Cam eşya'],
        ],
      ],
      [
        'metal',
        'Metal eşyalar',
        [
          ['antika-bakir', 'Bakır eşya'],
          ['antika-gumus', 'Gümüş eşya'],
          ['antika-pirinc', 'Pirinç eşya'],
        ],
      ],
    ]),
    dal('antika-tekstil', 'Antika halı ve tekstil', [
      [
        'hali',
        'Halı ve kilim',
        [
          ['antika-hali', 'Halı'],
          ['antika-kilim', 'Kilim'],
        ],
      ],
      [
        'tekstil',
        'Tekstil',
        [
          ['antika-isleme', 'İşleme'],
          ['antika-ortu', 'Örtü'],
          ['antika-kumas', 'Kumaş'],
        ],
      ],
    ]),
    dal('antika-sanat', 'Resim ve sanat eserleri', [
      [
        'resim',
        'Resim',
        [
          ['yagliboya', 'Yağlı boya'],
          ['suluboya', 'Sulu boya'],
          ['gravur', 'Gravür'],
          ['baski', 'Baskı'],
        ],
      ],
      [
        'eser',
        'Diğer eserler',
        [
          ['hat', 'Hat'],
          ['minyatur', 'Minyatür'],
          ['seramik-eser', 'Seramik eser'],
        ],
      ],
    ]),
  ],
};
