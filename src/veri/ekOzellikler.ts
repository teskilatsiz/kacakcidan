import type { OzellikAlani, UrunSecimi } from './ozellikler.ts';

const alan = (ad: string, secenekler: string[]): OzellikAlani => ({ ad, secenekler });
const varYok = (ad: string) => alan(ad, ['Var', 'Yok']);
const renk = alan('Renk', [
  'Siyah',
  'Beyaz',
  'Gri',
  'Mavi',
  'Kırmızı',
  'Yeşil',
  'Sarı',
  'Pembe',
  'Mor',
  'Kahverengi',
  'Bej',
  'Doğal',
  'Çok renkli',
  'Diğer',
]);
const belgeler = [varYok('Kutu'), varYok('Fatura'), alan('Garanti', ['Devam ediyor', 'Süresi doldu', 'Yok'])];
const beden = alan('Beden', ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Standart']);
const ayakkabi = alan(
  'Numara',
  Array.from({ length: 31 }, (_, i) => `${20 + i}`),
);
const malzeme = alan('Malzeme', ['Ahşap', 'Metal', 'Plastik', 'Cam', 'Tekstil', 'Deri', 'Kompozit', 'Diğer']);
const yas = alan('Yaş grubu', [
  '0 - 6 ay',
  '6 - 12 ay',
  '1 - 2 yaş',
  '2 - 3 yaş',
  '3 - 5 yaş',
  '6 - 8 yaş',
  '9 - 12 yaş',
  '13 yaş ve üzeri',
]);
const set = alan('Satış şekli', ['Tek ürün', 'Set']);
const gucKaynagi = alan('Güç kaynağı', ['Priz', 'Şarjlı', 'Pil', 'USB', 'Manuel']);
const kilogram = alan('Taşıma kapasitesi', [
  '9 kg',
  '13 kg',
  '15 kg',
  '18 kg',
  '22 kg',
  '25 kg',
  '36 kg',
  '50 kg',
  '100 kg',
  '120 kg',
  '150 kg',
  'Diğer',
]);

function sporAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'bisiklet':
      if (marka === 'bisiklet-parcasi') {
        if (model === 'bisiklet-kaski')
          return [
            beden,
            alan('Baş çevresi', ['48 - 52 cm', '52 - 56 cm', '55 - 59 cm', '58 - 62 cm', 'Diğer']),
            renk,
          ];
        if (model === 'bisiklet-cantasi')
          return [
            alan('Hacim', ['5 L altı', '5 - 10 L', '11 - 20 L', '21 L ve üzeri']),
            alan('Montaj yeri', ['Sele altı', 'Kadro', 'Gidon', 'Bagaj']),
            varYok('Su geçirmez'),
            renk,
          ];
        if (model === 'bisiklet-trainer')
          return [
            alan('Trainer türü', ['Tekerlek üstü', 'Doğrudan tahrikli', 'Roller']),
            varYok('Akıllı bağlantı'),
            alan('Bağlantı', ['ANT+', 'Bluetooth', 'ANT+ ve Bluetooth', 'Yok']),
            ...belgeler,
          ];
        return [
          alan('Uyumlu bisiklet', ['Dağ', 'Yol', 'Şehir', 'Gravel', 'Çocuk', 'Çoklu kullanım']),
          alan('Parça durumu', ['Sıfır', 'Kullanılmış', 'Yenilenmiş']),
          malzeme,
          renk,
        ];
      }
      return [
        alan('Jant boyu', [
          '12 inç',
          '14 inç',
          '16 inç',
          '18 inç',
          '20 inç',
          '24 inç',
          '26 inç',
          '27,5 inç',
          '28 inç / 700C',
          '29 inç',
        ]),
        alan('Kadro boyu', [
          'XS',
          'S',
          'M',
          'L',
          'XL',
          'XXL',
          '13 inç',
          '15 inç',
          '17 inç',
          '19 inç',
          '21 inç',
          '44 cm',
          '47 cm',
          '50 cm',
          '52 cm',
          '54 cm',
          '56 cm',
          '58 cm',
          'Diğer',
        ]),
        alan('Kadro malzemesi', ['Alüminyum', 'Çelik', 'Karbon fiber', 'Titanyum']),
        alan('Fren', ['V-fren', 'Mekanik disk', 'Hidrolik disk', 'Kaliper', 'Kontra pedal']),
        alan('Vites sayısı', [
          'Vites yok',
          '1',
          '3',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '16',
          '18',
          '20',
          '21',
          '22',
          '24',
          '27',
          '30',
        ]),
        alan('Süspansiyon', ['Yok', 'Ön', 'Ön ve arka']),
        ...(model === 'elektrikli-bisiklet'
          ? [
              alan('Batarya kapasitesi', [
                '250 Wh altı',
                '250 - 399 Wh',
                '400 - 499 Wh',
                '500 - 699 Wh',
                '700 Wh ve üzeri',
              ]),
              alan('Motor konumu', ['Ön göbek', 'Arka göbek', 'Orta motor']),
              alan('Batarya durumu', ['Sağlam', 'Kapasite kaybı var', 'Değişmesi gerekiyor']),
            ]
          : []),
        renk,
        ...belgeler,
      ];
    case 'fitness':
      if (marka === 'aksesuar') return [malzeme, renk, set];
      return [
        alan('Direnç sistemi', ['Manyetik', 'Hava', 'Su', 'Mekanik', 'Motorlu']),
        alan('Azami kullanıcı ağırlığı', [
          '100 kg',
          '110 kg',
          '120 kg',
          '130 kg',
          '150 kg',
          '180 kg',
          '200 kg',
          'Diğer',
        ]),
        ...(model === 'kosu-bandi'
          ? [
              alan('Azami hız', [
                '10 km/sa',
                '12 km/sa',
                '14 km/sa',
                '16 km/sa',
                '18 km/sa',
                '20 km/sa',
                '22 km/sa',
                'Diğer',
              ]),
              varYok('Eğim ayarı'),
            ]
          : []),
        varYok('Katlanabilir'),
        varYok('Ekran'),
        ...belgeler,
      ];
    case 'vucut-gelistirme':
      return [
        alan('Ağırlık', [
          '1 kg',
          '2 kg',
          '2,5 kg',
          '3 kg',
          '4 kg',
          '5 kg',
          '7,5 kg',
          '10 kg',
          '12,5 kg',
          '15 kg',
          '20 kg',
          '25 kg',
          '30 kg',
          '40 kg',
          'Diğer',
        ]),
        alan('Malzeme', ['Döküm', 'Çelik', 'Kauçuk kaplı', 'Plastik kaplı', 'Vinil', 'Diğer']),
        ...(marka === 'istasyon'
          ? [varYok('Ağırlık dahil'), varYok('Ayarlanabilir')]
          : [alan('Satış şekli', ['Tek', 'Çift', 'Set'])]),
        renk,
      ];
    case 'pilates-yoga':
      if (model === 'reformer')
        return [
          alan('Gövde', ['Ahşap', 'Alüminyum', 'Çelik']),
          alan('Yay sayısı', ['4', '5', '6', 'Diğer']),
          varYok('Kule dahil'),
          varYok('Katlanabilir'),
          ...belgeler,
        ];
      return [
        alan('Malzeme', ['PVC', 'TPE', 'NBR', 'Kauçuk', 'Mantar', 'Ahşap', 'Tekstil', 'Diğer']),
        ...(model.endsWith('mati') || model === 'jimnastik-minderi'
          ? [alan('Kalınlık', ['3 mm', '4 mm', '5 mm', '6 mm', '8 mm', '10 mm', '15 mm', 'Diğer'])]
          : []),
        renk,
        set,
      ];
    case 'takim-sporlari':
      if (model === 'krampon' || model === 'basketbol-ayakkabisi')
        return [ayakkabi, alan('Zemin', ['Halı saha', 'Çim', 'Suni çim', 'Salon', 'Dış saha']), renk];
      return [
        alan('Kullanım', ['Antrenman', 'Maç', 'Hobi']),
        alan('Boyut / numara', ['3', '4', '5', '6', '7', 'Çocuk', 'Yetişkin', 'Standart', 'Diğer']),
        malzeme,
        renk,
      ];
    case 'doga-sporlari':
      if (model === 'cadir')
        return [
          alan('Kapasite', [
            '1 kişilik',
            '2 kişilik',
            '3 kişilik',
            '4 kişilik',
            '5 kişilik',
            '6 kişilik',
            '8 kişilik',
            'Diğer',
          ]),
          alan('Mevsim', ['Yaz', '3 mevsim', '4 mevsim']),
          alan('Kurulum', ['Otomatik', 'Pollü', 'Şişme']),
          alan('Su geçirmezlik', [
            '1000 mm altı',
            '1000 - 1999 mm',
            '2000 - 2999 mm',
            '3000 - 4999 mm',
            '5000 mm ve üzeri',
          ]),
          varYok('Taşıma çantası'),
          renk,
        ];
      if (model === 'uyku-tulumu')
        return [
          alan('Konfor sıcaklığı', [
            '+15 °C ve üzeri',
            '+5 ile +14 °C',
            '0 ile +4 °C',
            '-10 ile -1 °C',
            '-10 °C altı',
          ]),
          alan('Dolgu', ['Sentetik', 'Kaz tüyü', 'Ördek tüyü']),
          alan('Boy', ['Çocuk', '170 cm', '180 cm', '190 cm', '200 cm', 'Diğer']),
          renk,
        ];
      if (model === 'trekking-cantasi')
        return [
          alan('Hacim', [
            '10 - 19 L',
            '20 - 29 L',
            '30 - 39 L',
            '40 - 49 L',
            '50 - 59 L',
            '60 - 69 L',
            '70 L ve üzeri',
          ]),
          varYok('Yağmurluk'),
          varYok('Sırt ayarı'),
          renk,
        ];
      if (model === 'outdoor-ayakkabi')
        return [ayakkabi, alan('Bilek', ['Alçak', 'Orta', 'Yüksek']), varYok('Su geçirmez'), renk];
      if (marka === 'balikcilik')
        return [
          alan('Av türü', ['Tatlı su', 'Tuzlu su', 'Tatlı ve tuzlu su']),
          alan('Olta tekniği', ['Spin', 'Surf', 'LRF', 'Jig', 'Sazan', 'Diğer']),
          alan('Boy', ['180 cm', '210 cm', '240 cm', '270 cm', '300 cm', '360 cm', '420 cm', 'Diğer']),
          set,
        ];
      return [malzeme, alan('Kullanım', ['Kamp', 'Yürüyüş', 'Tırmanış', 'Çok amaçlı']), renk];
    case 'raket-sporlari':
      if (model.endsWith('topu'))
        return [
          alan('Zemin', ['Sert kort', 'Toprak kort', 'Çim', 'Çoklu zemin']),
          alan('Adet', ['1', '3', '4', '6', '12', 'Diğer']),
          alan('Ambalaj', ['Açılmamış', 'Açılmış']),
        ];
      if (model === 'masa-tenisi-masasi')
        return [
          alan('Kullanım yeri', ['İç mekân', 'Dış mekân']),
          varYok('Katlanabilir'),
          varYok('File dahil'),
          renk,
        ];
      return [
        alan('Oyuncu seviyesi', ['Başlangıç', 'Orta', 'İleri']),
        alan('Malzeme', ['Alüminyum', 'Grafit', 'Karbon', 'Ahşap', 'Kompozit', 'Diğer']),
        ...(model.includes('raket')
          ? [alan('Sap ölçüsü', ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'Standart', 'Diğer']), varYok('Kılıf')]
          : []),
        renk,
      ];
    case 'su-sporlari':
      if (model === 'can-yelegi')
        return [
          beden,
          alan('Kaldırma kuvveti', ['50 N', '100 N', '150 N', '275 N', 'Belirtilmemiş']),
          alan('Yapı', ['Köpük dolgulu', 'Manuel şişen', 'Otomatik şişen']),
          alan('Kullanıcı', ['Çocuk', 'Yetişkin']),
          renk,
        ];
      if (model === 'dalis-elbisesi')
        return [
          beden,
          alan('Kalınlık', ['1 mm', '2 mm', '3 mm', '5 mm', '7 mm', 'Diğer']),
          alan('Kesim', ['Tam boy', 'Kısa', 'İki parça']),
          renk,
        ];
      if (marka === 'sorf-kurek')
        return [
          alan('Gövde', ['Şişme', 'Sert']),
          alan('Boy', ['2 m altı', '2 - 2,9 m', '3 - 3,9 m', '4 m ve üzeri']),
          kilogram,
          varYok('Kürek dahil'),
          varYok('Pompa dahil'),
          renk,
        ];
      return [alan('Kullanıcı', ['Çocuk', 'Yetişkin']), beden, malzeme, renk];
    case 'kis-sporlari':
      return [
        ...(model.endsWith('botu')
          ? [ayakkabi]
          : model.endsWith('takimi') || model === 'snowboard-tahtasi'
            ? [
                alan('Uzunluk', [
                  '100 cm altı',
                  '100 - 119 cm',
                  '120 - 139 cm',
                  '140 - 149 cm',
                  '150 - 159 cm',
                  '160 - 169 cm',
                  '170 - 179 cm',
                  '180 cm ve üzeri',
                ]),
              ]
            : [beden]),
        alan('Seviye', ['Başlangıç', 'Orta', 'İleri']),
        ...(['kayak-takimi', 'snowboard-tahtasi'].includes(model) ? [varYok('Bağlama dahil')] : []),
        renk,
      ];
    case 'dovus-sporlari':
      return [
        model === 'boks-eldiveni'
          ? alan('Eldiven ağırlığı', ['6 oz', '8 oz', '10 oz', '12 oz', '14 oz', '16 oz', '18 oz'])
          : beden,
        alan('Malzeme', ['Deri', 'Suni deri', 'Pamuk', 'Polyester', 'Diğer']),
        renk,
      ];
    case 'paten-kaykay':
      return [
        model.includes('paten')
          ? ayakkabi
          : alan('Tabla genişliği', [
              '7,5 inç',
              '7,75 inç',
              '8 inç',
              '8,125 inç',
              '8,25 inç',
              '8,5 inç',
              'Diğer',
            ]),
        alan('Seviye', ['Başlangıç', 'Orta', 'İleri']),
        varYok('Koruyucu ekipman dahil'),
        renk,
      ];
    case 'salon-oyunlari':
      return [
        alan('Malzeme', ['Ahşap', 'MDF', 'Metal', 'Plastik', 'Diğer']),
        alan('Kullanım', ['Ev', 'Profesyonel']),
        set,
        renk,
      ];
    case 'taraftar-urunleri':
      return [
        alan('Takım', ['Beşiktaş', 'Fenerbahçe', 'Galatasaray', 'Trabzonspor', 'Millî takım', 'Diğer']),
        ...(marka === 'giyim' ? [beden] : [malzeme]),
        alan('Sezon', [
          '2026 / 2027',
          '2025 / 2026',
          '2024 / 2025',
          '2023 / 2024',
          'Daha eski',
          'Belirtilmemiş',
        ]),
        varYok('Lisanslı ürün'),
        renk,
      ];
    case 'atletizm':
      return [
        model === 'kosu-ayakkabisi' ? ayakkabi : malzeme,
        alan('Kullanım', ['Pist', 'Yol', 'Arazi', 'Salon']),
        renk,
      ];
    default:
      return [];
  }
}

function bebekAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'tasima':
      if (marka === 'oto-koltugu')
        return [
          alan('Boy aralığı', [
            '40 - 75 cm',
            '40 - 83 cm',
            '40 - 87 cm',
            '40 - 105 cm',
            '40 - 125 cm',
            '40 - 150 cm',
            '61 - 105 cm',
            '76 - 105 cm',
            '76 - 150 cm',
            '100 - 150 cm',
            'Diğer',
          ]),
          alan('Onay standardı', ['UN R129 / i-Size', 'ECE R44/04', 'Belirtilmemiş']),
          alan('Bağlantı', ['ISOFIX', 'Araç kemeri', 'ISOFIX veya araç kemeri']),
          alan('Yön', ['Sürüş yönünün tersi', 'Sürüş yönü', 'Çift yönlü']),
          varYok('360° dönüş'),
          alan('Kaza geçmişi', ['Yok', 'Var', 'Bilinmiyor']),
          varYok('Kullanım kılavuzu'),
          renk,
          ...belgeler,
        ];
      if (marka === 'bebek-arabasi')
        return [
          kilogram,
          alan('Katlanma', ['Tek elle', 'İki elle', 'Katlanmaz']),
          varYok('Çift yönlü oturma'),
          varYok('Tam yatış'),
          varYok('Portbebe dahil'),
          varYok('Yağmurluk'),
          renk,
          ...belgeler,
        ];
      return [
        kilogram,
        alan('Taşıma yönü', ['Önde', 'Sırtta', 'Yan', 'Çok yönlü']),
        alan('Malzeme', ['Pamuk', 'Keten', 'Polyester', 'Karışım', 'Diğer']),
        varYok('Yenidoğana uygun'),
        renk,
      ];
    case 'mobilya':
      return [
        alan('Malzeme', ['Masif ahşap', 'MDF', 'Suntalam', 'Metal', 'Plastik', 'Tekstil', 'Diğer']),
        ...(marka === 'uyku'
          ? [
              alan('Yatak ölçüsü', [
                '50 × 90 cm',
                '60 × 120 cm',
                '70 × 110 cm',
                '70 × 130 cm',
                '70 × 140 cm',
                '80 × 180 cm',
                '90 × 190 cm',
                'Diğer',
              ]),
              varYok('Yatak dahil'),
              varYok('Yükseklik ayarı'),
            ]
          : []),
        alan('Montaj', ['Kurulu', 'Demonte']),
        renk,
      ];
    case 'beslenme':
      if (marka === 'oturma')
        return [
          kilogram,
          varYok('Katlanabilir'),
          varYok('Yükseklik ayarı'),
          varYok('Çıkarılabilir tepsi'),
          alan('Emniyet kemeri', ['3 nokta', '5 nokta', 'Yok']),
          renk,
        ];
      if (marka === 'hazirlama')
        return [
          gucKaynagi,
          alan('Kapasite', ['1 biberon', '2 biberon', '4 biberon', '6 biberon', 'Diğer']),
          alan('Sterilizasyon', ['Buhar', 'UV', 'Mikrodalga', 'Uygulanmaz']),
          ...belgeler,
        ];
      return [
        alan('Malzeme', ['Cam', 'Silikon', 'Paslanmaz çelik', 'Plastik', 'Diğer']),
        alan('Hacim', ['120 ml', '150 ml', '180 ml', '240 ml', '260 ml', '300 ml', 'Diğer']),
        alan('Ambalaj', ['Açılmamış', 'Açılmış']),
        set,
      ];
    case 'emzirme':
      if (marka === 'sut-sagma')
        return [
          alan('Pompa', ['Tekli', 'Çiftli']),
          alan('Çalışma', ['Manuel', 'Priz', 'Şarjlı', 'Pilli']),
          varYok('Kademe ayarı'),
          alan('Kişisel temas parçaları', ['Yeni', 'Kullanılmış', 'Dahil değil']),
          ...belgeler,
        ];
      return [alan('Malzeme', ['Pamuk', 'Bambu', 'Polyester', 'Silikon', 'Plastik', 'Diğer']), renk, set];
    case 'banyo':
      return [
        alan('Malzeme', ['Plastik', 'Silikon', 'Pamuk', 'Bambu', 'Diğer']),
        varYok('Katlanabilir'),
        alan('Kullanım dönemi', ['Yenidoğan', '6 ay ve üzeri', '12 ay ve üzeri', 'Çok dönemli']),
        renk,
      ];
    case 'guvenlik':
      if (marka === 'izleme')
        return [
          alan('Bağlantı', ['Wi-Fi', 'DECT', 'Özel radyo frekansı']),
          alan('Görüntü', ['Sesli', '720p', '1080p', '2K', '4K']),
          varYok('Gece görüşü'),
          varYok('Ebeveyn ünitesi'),
          gucKaynagi,
          ...belgeler,
        ];
      return [
        alan('Montaj', ['Sıkıştırmalı', 'Vidalı', 'Yapışkanlı', 'Montaj gerektirmez']),
        alan('Genişlik', [
          '60 - 69 cm',
          '70 - 79 cm',
          '80 - 89 cm',
          '90 - 99 cm',
          '100 cm ve üzeri',
          'Diğer',
        ]),
        malzeme,
        renk,
      ];
    case 'bebek-oyuncaklari':
      return [
        yas,
        malzeme,
        ...(marka === 'hareket' ? [kilogram, gucKaynagi] : [varYok('Sesli'), varYok('Işıklı')]),
        renk,
      ];
    case 'bebek-giyim':
      return [
        model === 'bebek-ayakkabisi'
          ? alan(
              'Numara',
              Array.from({ length: 15 }, (_, i) => `${16 + i}`),
            )
          : alan('Beden', [
              'Yenidoğan',
              '0 - 3 ay',
              '3 - 6 ay',
              '6 - 9 ay',
              '9 - 12 ay',
              '12 - 18 ay',
              '18 - 24 ay',
              '24 - 36 ay',
            ]),
        alan('Kumaş', ['Pamuk', 'Bambu', 'Yün', 'Polyester', 'Karışım', 'Diğer']),
        alan('Mevsim', ['Yaz', 'Kış', 'Mevsimlik', 'Dört mevsim']),
        renk,
        set,
      ];
    case 'ev-tekstili':
      return [
        alan('Malzeme', ['Pamuk', 'Bambu', 'Yün', 'Polyester', 'Karışım']),
        ...(model === 'uyku-tulumu'
          ? [alan('TOG değeri', ['0,2', '0,5', '1,0', '1,5', '2,5', '3,5', 'Belirtilmemiş'])]
          : [
              alan('Ölçü', [
                '60 × 120 cm',
                '70 × 140 cm',
                '90 × 120 cm',
                '100 × 150 cm',
                'Standart',
                'Diğer',
              ]),
            ]),
        renk,
      ];
    case 'saglik-hijyen':
      if (marka === 'bakim') return [malzeme, alan('Ürün durumu', ['Kullanılmamış', 'Kullanılmış']), renk];
      return [
        alan('Çalışma', ['Manuel', 'Pil', 'Şarjlı', 'Priz']),
        alan('Ürün durumu', ['Kullanılmamış', 'Kullanılmış']),
        ...belgeler,
      ];
    case 'bebek-bezi':
      if (marka === 'degistirme')
        return [malzeme, alan('Kapasite', ['Küçük', 'Orta', 'Büyük']), varYok('Su geçirmez'), renk];
      return [
        alan('Beden', ['0', '1', '2', '3', '4', '4+', '5', '5+', '6', '7', '8', 'Standart']),
        alan('Paket adedi', ['1', '2', '3', '4', '5', 'Diğer']),
        alan('Ambalaj', ['Açılmamış', 'Açılmış']),
        renk,
      ];
    case 'ani-kutlama':
      return [malzeme, alan('Kişiselleştirme', ['İsimsiz', 'İsimli']), renk, set];
    default:
      return [];
  }
}

function muzikAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'muzik-aletleri':
      if (marka === 'gitar' || marka === 'telli')
        return [
          alan('Tel sayısı', ['4', '5', '6', '7', '8', '12', 'Diğer']),
          alan('Yön', ['Sağ el', 'Sol el']),
          alan('Gövde', ['Masif', 'Lamine', 'Yarı akustik', 'Hollow body', 'Solid body', 'Diğer']),
          ...(model === 'elektro-gitar' || model === 'bas-gitar'
            ? [alan('Manyetik', ['Single coil', 'Humbucker', 'P90', 'Aktif', 'Karma', 'Diğer'])]
            : []),
          varYok('Kılıf / hardcase'),
          renk,
          ...belgeler,
        ];
      if (marka === 'tuslu')
        return [
          alan('Tuş sayısı', ['25', '32', '37', '49', '61', '73', '76', '88']),
          alan('Tuş mekanizması', ['Ağırlıksız', 'Yarı ağırlıklı', 'Çekiç mekanizmalı', 'Akustik']),
          alan('Polifoni', ['32', '64', '128', '192', '256', 'Sınırsız / akustik', 'Diğer']),
          varYok('Pedal dahil'),
          varYok('Stand dahil'),
          renk,
          ...belgeler,
        ];
      if (marka === 'yayli')
        return [
          alan('Boyut', ['1/8', '1/4', '1/2', '3/4', '4/4']),
          alan('Gövde malzemesi', ['Masif ahşap', 'Lamine ahşap', 'Kompozit']),
          varYok('Yay dahil'),
          varYok('Kılıf dahil'),
          renk,
        ];
      if (marka === 'vurmalilar')
        return [
          alan('Çalışma', ['Akustik', 'Elektronik']),
          alan('Parça sayısı', ['1', '3', '4', '5', '6', '7', 'Diğer']),
          varYok('Ziller dahil'),
          varYok('Tabure dahil'),
          varYok('Pedal dahil'),
          renk,
          ...belgeler,
        ];
      return [
        alan('Akort / ton', ['C', 'D', 'E', 'F', 'G', 'A', 'B♭', 'E♭', 'Diğer']),
        alan('Malzeme', ['Ahşap', 'Pirinç', 'Nikel', 'Gümüş kaplama', 'Plastik', 'Diğer']),
        varYok('Kılıf dahil'),
        renk,
      ];
    case 'enstruman-aksesuari':
      if (model === 'gitar-amfisi')
        return [
          alan('Teknoloji', ['Lambalı', 'Transistörlü', 'Dijital modelleme', 'Hibrit']),
          alan('Güç', ['5 W altı', '5 - 14 W', '15 - 29 W', '30 - 49 W', '50 - 99 W', '100 W ve üzeri']),
          alan('Yapı', ['Combo', 'Kafa amfi', 'Kabin']),
          ...belgeler,
        ];
      if (model === 'efekt-pedali')
        return [
          alan('Efekt', [
            'Overdrive / distortion',
            'Delay',
            'Reverb',
            'Modülasyon',
            'Wah',
            'Looper',
            'Çoklu efekt',
          ]),
          alan('İşlem', ['Analog', 'Dijital']),
          varYok('Adaptör dahil'),
          ...belgeler,
        ];
      return [
        alan('Uyumlu çalgı', ['Gitar', 'Bas gitar', 'Piyano', 'Keman', 'Bateri', 'Üflemeli', 'Evrensel']),
        malzeme,
        renk,
        set,
      ];
    case 'studyo-ekipmanlari':
      if (model === 'kayit-cihazi')
        return [
          alan('Kanal sayısı', ['2', '4', '6', '8', '12', 'Diğer']),
          alan('Kayıt biçimi', ['WAV', 'MP3', 'WAV ve MP3', 'Diğer']),
          alan('Depolama', ['SD', 'microSD', 'Dahilî', 'USB']),
          varYok('Dahilî mikrofon'),
          varYok('XLR girişi'),
          ...belgeler,
        ];
      if (model === 'ses-karti')
        return [
          alan('Bağlantı', ['USB-A', 'USB-C', 'Thunderbolt', 'FireWire', 'PCIe']),
          alan('Giriş sayısı', ['1', '2', '4', '8', '16', 'Diğer']),
          alan('Çıkış sayısı', ['2', '4', '6', '8', '16', 'Diğer']),
          alan('Örnekleme', ['44,1 kHz', '48 kHz', '96 kHz', '192 kHz']),
          varYok('48 V phantom'),
          ...belgeler,
        ];
      if (model === 'studyo-mikrofonu')
        return [
          alan('Mikrofon türü', ['Kondenser', 'Dinamik', 'Ribbon']),
          alan('Bağlantı', ['XLR', 'USB', 'XLR ve USB']),
          alan('Yön karakteristiği', ['Kardioid', 'Süperkardioid', 'Çok yönlü', 'Çift yönlü', 'Seçilebilir']),
          varYok('Shock mount'),
          ...belgeler,
        ];
      if (model === 'midi-klavye' || model === 'midi-kontrolcu')
        return [
          alan('Tuş sayısı', ['Tuş yok', '25', '32', '37', '49', '61', '73', '88']),
          alan('Bağlantı', ['USB', 'MIDI DIN', 'USB ve MIDI DIN', 'Bluetooth']),
          varYok('Pad'),
          ...belgeler,
        ];
      if (model === 'akustik-panel')
        return [
          alan('Malzeme', ['Akustik sünger', 'Taş yünü', 'Ahşap', 'Kumaş kaplı']),
          alan('Kalınlık', ['2 cm', '3 cm', '5 cm', '10 cm', 'Diğer']),
          set,
          renk,
        ];
      return [
        alan('Çalışma', ['Aktif', 'Pasif']),
        alan('Bağlantı', ['XLR', 'TRS', 'RCA', '3,5 mm', 'Bluetooth', 'USB']),
        alan('Satış şekli', ['Tek', 'Çift', 'Set']),
        ...belgeler,
      ];
    case 'dj-ekipmanlari':
      if (model === 'dj-kilif')
        return [
          alan('Uyumluluk', ['DJ kontrolcü', 'Mikser', 'Player', 'Pikap', 'Evrensel']),
          alan('Yapı', ['Yumuşak çanta', 'Sert çanta / flightcase']),
          malzeme,
          renk,
        ];
      if (model === 'dj-kulakligi')
        return [
          alan('Yapı', ['Kapalı kulak üstü', 'Kapalı kulak çevresi']),
          alan('Bağlantı', ['3,5 mm', '6,35 mm', '3,5 mm ve 6,35 mm']),
          varYok('Çıkarılabilir kablo'),
          renk,
          ...belgeler,
        ];
      return [
        alan('Kanal sayısı', ['2', '4', '6', 'Diğer']),
        alan('Çalışma', ['Bağımsız', 'Bilgisayar bağlantılı', 'Analog']),
        alan('Uyumlu yazılım', [
          'rekordbox',
          'Serato DJ',
          'Traktor',
          'VirtualDJ',
          'Yazılım gerektirmez',
          'Diğer',
        ]),
        varYok('Taşıma çantası'),
        ...belgeler,
      ];
    case 'sahne-sistemleri':
      if (model === 'truss')
        return [
          alan('Kesit', ['İkili', 'Üçgen', 'Kare']),
          alan('Uzunluk', ['0,5 m', '1 m', '1,5 m', '2 m', '3 m', 'Diğer']),
          alan('Malzeme', ['Alüminyum', 'Çelik']),
          varYok('Bağlantı parçaları dahil'),
        ];
      if (model === 'sahne-kablosu')
        return [
          alan('Bağlantı', ['XLR', 'TRS', 'TS', 'Speakon', 'DMX', 'PowerCON', 'Diğer']),
          alan('Uzunluk', ['1 m', '3 m', '5 m', '10 m', '15 m', '20 m', '30 m', '50 m', 'Diğer']),
          set,
        ];
      if (model === 'sahne-isigi')
        return [
          alan('Işık türü', ['LED PAR', 'Moving head', 'Bar', 'Strobe', 'Lazer', 'Diğer']),
          alan('Kontrol', ['DMX', 'Otomatik', 'Ses aktif', 'Uzaktan kumanda']),
          alan('Güç', ['50 W altı', '50 - 149 W', '150 - 299 W', '300 W ve üzeri']),
          ...belgeler,
        ];
      if (marka === 'mikrofon')
        return [
          alan('Mikrofon türü', ['Dinamik', 'Kondenser']),
          alan('Bağlantı', ['XLR', '6,35 mm', 'Kablosuz']),
          alan('Alıcı kanal sayısı', ['1', '2', '4', '8', 'Kablolu']),
          varYok('Alıcı dahil'),
          ...belgeler,
        ];
      return [
        alan('Çalışma', ['Aktif', 'Pasif']),
        alan('Güç', ['100 W altı', '100 - 299 W', '300 - 599 W', '600 - 999 W', '1000 W ve üzeri']),
        alan('Bağlantı', ['XLR', 'TRS', 'Speakon', 'RCA', 'Bluetooth', 'DMX', 'Diğer']),
        alan('Satış şekli', ['Tek', 'Çift', 'Set']),
        ...belgeler,
      ];
    case 'albumler':
      return [
        alan('Tür', [
          'Rock',
          'Pop',
          'Caz',
          'Klasik',
          'Elektronik',
          'Hip hop',
          'Türk sanat müziği',
          'Türk halk müziği',
          'Diğer',
        ]),
        alan('Baskı', ['İlk baskı', 'Yeniden baskı', 'Belirtilmemiş']),
        alan('Medya durumu', ['Kapalı ambalaj', 'Çok iyi', 'İyi', 'Çizikli']),
        alan('Kapak durumu', ['Çok iyi', 'İyi', 'Yıpranmış', 'Kapak yok']),
        ...(model === 'plak' ? [alan('Devir', ['33⅓ devir', '45 devir', '78 devir'])] : []),
        set,
      ];
    default:
      return [];
  }
}

function kitapAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (altKategori === 'kitap-elektronigi')
    return marka === 'okuyucu'
      ? [
          alan('Ekran', ['6 inç', '6,8 inç', '7 inç', '7,8 inç', '8 inç', '10,2 inç', '10,3 inç', 'Diğer']),
          alan('Depolama', ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB', 'Diğer']),
          alan('Ekran türü', ['Siyah beyaz E Ink', 'Renkli E Ink', 'LCD']),
          varYok('Aydınlatma'),
          varYok('Suya dayanıklılık'),
          ...belgeler,
        ]
      : [malzeme, renk, varYok('Kutu')];
  if (altKategori === 'film')
    return [
      alan('Dil', ['Türkçe', 'İngilizce', 'Çok dilli', 'Diğer']),
      varYok('Türkçe altyazı'),
      alan('Bölge kodu', ['Bölgesiz', 'DVD Bölge 2', 'Blu-ray B', 'Diğer']),
      alan('Disk durumu', ['Kapalı ambalaj', 'Çok iyi', 'İyi', 'Çizikli']),
      set,
    ];
  return [
    alan('Dil', ['Türkçe', 'İngilizce', 'Almanca', 'Fransızca', 'Arapça', 'Diğer']),
    alan('Cilt', ['Karton kapak', 'Sert kapak', 'Spiral']),
    alan('Sayfa durumu', ['Temiz', 'Altı çizili', 'Not alınmış', 'Yıpranmış']),
    alan('Baskı yılı', [
      '2026',
      '2025',
      '2024',
      '2023',
      '2022',
      '2021',
      '2020',
      '2015 - 2019',
      '2010 - 2014',
      '2010 öncesi',
      'Belirtilmemiş',
    ]),
    ...(altKategori === 'egitim'
      ? [alan('Çözüm durumu', ['Çözülmemiş', 'Kısmen çözülmüş', 'Çözülmüş'])]
      : []),
    ...(altKategori === 'dergi'
      ? [alan('Dergi türü', ['Aylık', 'Haftalık', 'Üç aylık', 'Özel sayı', 'Diğer'])]
      : []),
    ...(model.includes('seti') || marka === 'set'
      ? [alan('Kitap / sayı adedi', ['2', '3', '4', '5', '6', '10', '12', '20', 'Diğer'])]
      : [set]),
  ];
}

function hobiAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'diecast-model':
      if (marka === 'aksesuar')
        return [
          malzeme,
          alan('Uyumlu ölçek', ['1:18', '1:24', '1:43', '1:64', '1:87', 'Evrensel', 'Diğer']),
          alan('Kapasite', ['1 model', '2 - 10 model', '11 - 25 model', '26 model ve üzeri']),
          renk,
        ];
      return [
        alan('Ölçek', ['1:12', '1:18', '1:24', '1:32', '1:43', '1:50', '1:64', '1:72', '1:87', 'Diğer']),
        alan('Malzeme', ['Diecast metal', 'Reçine', 'Plastik', 'Ahşap']),
        alan('Kutu durumu', ['Açılmamış', 'Açılmış', 'Kutusuz']),
        varYok('Eksik parça'),
        renk,
      ];
    case 'rc-araclar':
      if (model === 'rc-kumanda')
        return [
          alan('Kanal sayısı', ['2', '3', '4', '6', '8', '10', '12', '16', 'Diğer']),
          alan('Frekans', ['27 MHz', '40 MHz', '72 MHz', '2,4 GHz', 'Diğer']),
          varYok('Alıcı dahil'),
          ...belgeler,
        ];
      if (model === 'rc-batarya')
        return [
          alan('Kimya', ['LiPo', 'Li-ion', 'LiFe', 'NiMH']),
          alan('Hücre sayısı', ['1S', '2S', '3S', '4S', '6S', '8S', 'Diğer']),
          alan('Kapasite', [
            '500 mAh altı',
            '500 - 999 mAh',
            '1000 - 1999 mAh',
            '2000 - 3999 mAh',
            '4000 - 5999 mAh',
            '6000 mAh ve üzeri',
          ]),
          alan('Bağlantı', ['XT30', 'XT60', 'XT90', 'Deans / T', 'EC3', 'EC5', 'Diğer']),
        ];
      if (model === 'rc-motor')
        return [
          alan('Motor türü', ['Fırçalı', 'Fırçasız']),
          alan('Motor boyutu', ['180', '280', '370', '540', '550', 'Diğer']),
          alan('Uyumlu ölçek', ['1:8', '1:10', '1:12', '1:16', '1:18', 'Diğer']),
          ...belgeler,
        ];
      if (model === 'rc-yedek-parca')
        return [
          alan('Uyumlu araç', ['Otomobil', 'Kamyon', 'Uçak', 'Helikopter', 'Tekne', 'Diğer']),
          alan('Uyumlu ölçek', ['1:8', '1:10', '1:12', '1:16', '1:18', 'Diğer']),
          malzeme,
          set,
        ];
      return [
        alan('Ölçek', ['1:5', '1:8', '1:10', '1:12', '1:14', '1:16', '1:18', '1:24', 'Diğer']),
        alan('Motor', ['Fırçalı elektrik', 'Fırçasız elektrik', 'Nitro', 'Benzin', 'Motorsuz']),
        alan('Hazırlık', ['RTR / kullanıma hazır', 'ARTR / kısmen hazır', 'Kit']),
        alan('Batarya', ['LiPo', 'Li-ion', 'NiMH', 'Dahil değil']),
        varYok('Kumanda dahil'),
        varYok('Şarj cihazı dahil'),
        ...belgeler,
      ];
    case 'oyuncak':
      if (model === 'akulu-araba')
        return [
          yas,
          alan('Akü gerilimi', ['6 V', '12 V', '24 V', '36 V', 'Diğer']),
          kilogram,
          varYok('Ebeveyn kumandası'),
          alan('Batarya durumu', ['Sağlam', 'Kapasite kaybı var', 'Değişmeli']),
          renk,
          ...belgeler,
        ];
      return [
        yas,
        alan('Malzeme', ['Plastik', 'Ahşap', 'Metal', 'Kumaş', 'Peluş', 'Diğer']),
        ...(model === 'lego' || marka === 'yapi-oyuncagi'
          ? [
              alan('Parça sayısı', [
                '100 altı',
                '100 - 249',
                '250 - 499',
                '500 - 999',
                '1000 - 1999',
                '2000 ve üzeri',
              ]),
              varYok('Eksik parça'),
              varYok('Yapım kılavuzu'),
            ]
          : [varYok('Sesli'), varYok('Işıklı')]),
        renk,
        varYok('Kutu'),
      ];
    case 'aksiyon-figuru':
      return [
        alan('Ölçek', ['1:4', '1:6', '1:10', '1:12', '1:18', 'Ölçeksiz', 'Diğer']),
        alan('Malzeme', ['PVC', 'ABS', 'Reçine', 'Metal', 'Diğer']),
        alan('Ambalaj', ['Açılmamış', 'Açılmış', 'Kutusuz']),
        varYok('Eksik aksesuar'),
        varYok('Stand dahil'),
      ];
    case 'koleksiyon-kartlari':
      if (marka === 'kart-aksesuar')
        return [
          alan('Uyumlu kart boyutu', ['Standart / Pokémon', 'Japon / Yu-Gi-Oh!', 'Büyük boy', 'Diğer']),
          alan('Malzeme', ['Polipropilen', 'PVC', 'Karton', 'Diğer']),
          alan('Kapasite', ['1', '9', '18', '100', '180', '360', '480', '720', 'Diğer']),
          set,
        ];
      return [
        alan('Kart türü', ['Tek kart', 'Booster', 'Deste', 'Kutu', 'Aksesuar']),
        alan('Dil', ['Türkçe', 'İngilizce', 'Japonca', 'Diğer']),
        alan('Kart durumu', ['Mint', 'Near mint', 'Light played', 'Played', 'Hasarlı', 'Kapalı ambalaj']),
        alan('Derecelendirme', ['Yok', 'PSA', 'BGS', 'CGC', 'Diğer']),
        set,
      ];
    case 'maket':
      if (marka === 'malzeme') {
        if (model === 'airbrush')
          return [
            alan('Besleme', ['Üstten', 'Alttan', 'Yandan']),
            alan('İğne çapı', ['0,15 mm', '0,2 mm', '0,3 mm', '0,35 mm', '0,4 mm', '0,5 mm', 'Diğer']),
            varYok('Kompresör dahil'),
            ...belgeler,
          ];
        if (model === 'maket-boyasi')
          return [
            alan('Boya türü', ['Akrilik', 'Enamel', 'Lak']),
            alan('Hacim', ['10 ml', '12 ml', '14 ml', '17 ml', '18 ml', '20 ml', '30 ml', 'Diğer']),
            renk,
            alan('Ambalaj', ['Açılmamış', 'Açılmış']),
          ];
        return [malzeme, alan('Kullanım', ['Kesme', 'Zımparalama', 'Montaj', 'Çok amaçlı']), set];
      }
      return [
        alan('Ölçek', ['1:24', '1:35', '1:48', '1:72', '1:100', '1:144', '1:350', '1:700', 'Diğer']),
        alan('Malzeme', ['Plastik', 'Ahşap', 'Metal', 'Reçine', 'Diğer']),
        alan('Montaj', ['Kurulmamış', 'Kısmen kurulmuş', 'Tamamlanmış']),
        varYok('Eksik parça'),
        varYok('Yapım kılavuzu'),
      ];
    case 'puzzle':
      if (marka === 'aksesuar')
        return [
          malzeme,
          alan('Uyumlu puzzle', [
            '500 parça',
            '1000 parça',
            '1500 parça',
            '2000 parça',
            '3000 parça',
            'Diğer',
          ]),
          renk,
        ];
      return [
        alan('Parça sayısı', [
          '50 altı',
          '50',
          '100',
          '200',
          '300',
          '500',
          '1000',
          '1500',
          '2000',
          '3000',
          '5000',
          'Diğer',
        ]),
        alan('Malzeme', ['Karton', 'Ahşap', 'Plastik']),
        varYok('Eksik parça'),
        alan('Durum', ['Açılmamış', 'Birleştirilmiş', 'Parçaları ayrılmış']),
        varYok('Kutu'),
      ];
    case 'kutu-oyunlari':
      return [
        alan('Oyuncu sayısı', ['1', '2', '2 - 4', '2 - 6', '3 - 6', '4 - 8', '8 ve üzeri', 'Diğer']),
        alan('Yaş', ['3+', '5+', '6+', '8+', '10+', '12+', '14+', '16+', '18+']),
        alan('Dil', ['Türkçe', 'İngilizce', 'Dilden bağımsız', 'Diğer']),
        varYok('Eksik parça'),
        varYok('Oyun kılavuzu'),
        varYok('Kutu'),
      ];
    case 'sanat-el-isi':
      return [
        alan('Teknik', [
          'Yağlı boya',
          'Akrilik',
          'Sulu boya',
          'Karakalem',
          'Örgü',
          'Dikiş',
          'Seramik',
          'Diğer',
        ]),
        malzeme,
        alan('Ürün durumu', ['Açılmamış', 'Kısmen kullanılmış', 'Kullanılmış']),
        set,
        renk,
      ];
    default:
      return [];
  }
}

function bahceAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'bahce-ekipmani':
      if (marka === 'makine')
        return [
          alan('Güç kaynağı', ['Priz', 'Akülü', 'Benzinli', 'Manuel']),
          alan('Motor gücü', [
            '500 W altı',
            '500 - 999 W',
            '1000 - 1499 W',
            '1500 - 1999 W',
            '2000 W ve üzeri',
            'Benzinli motor',
          ]),
          alan('Akü gerilimi', [
            '12 V',
            '18 V',
            '20 V',
            '24 V',
            '36 V',
            '40 V',
            '48 V',
            '56 V',
            'Akülü değil',
          ]),
          ...(model === 'cim-bicme'
            ? [
                alan('Kesme genişliği', ['30 cm altı', '30 - 39 cm', '40 - 49 cm', '50 cm ve üzeri']),
                varYok('Çim toplama haznesi'),
              ]
            : []),
          ...belgeler,
        ];
      if (marka === 'sulama')
        return [
          alan('Bağlantı ölçüsü', ['1/2 inç', '3/4 inç', '1 inç', '1¼ inç', '1½ inç', '2 inç', 'Diğer']),
          alan('Uzunluk', ['5 m', '10 m', '15 m', '20 m', '25 m', '50 m', '100 m', 'Diğer']),
          alan('Kullanım', ['Bahçe', 'Tarımsal', 'Çok amaçlı']),
          set,
        ];
      return [malzeme, alan('Sap', ['Ahşap', 'Metal', 'Plastik', 'Sapsız']), renk];
    case 'bahce-yasam':
      return [
        malzeme,
        ...(marka === 'mobilya'
          ? [
              alan('Kapasite', ['1 kişilik', '2 kişilik', '4 kişilik', '6 kişilik', '8 kişilik', 'Diğer']),
              alan('Montaj', ['Kurulu', 'Demonte']),
              varYok('Minder dahil'),
            ]
          : [alan('Yakıt', ['Kömür', 'Gaz', 'Elektrik', 'Yakıt gerektirmez'])]),
        renk,
      ];
    case 'el-aletleri':
      if (marka === 'elektrikli')
        return [
          alan('Güç kaynağı', ['Priz', 'Akülü', 'Pnömatik']),
          alan('Akü gerilimi', [
            '10,8 V',
            '12 V',
            '14,4 V',
            '18 V',
            '20 V',
            '24 V',
            '36 V',
            '40 V',
            'Akülü değil',
          ]),
          alan('Akü kapasitesi', [
            '1,5 Ah',
            '2 Ah',
            '2,5 Ah',
            '3 Ah',
            '4 Ah',
            '5 Ah',
            '6 Ah',
            '8 Ah',
            'Akü yok',
          ]),
          ...(model === 'matkap' || model === 'vidalama'
            ? [
                alan('Mandren', ['6,35 mm altıgen', '10 mm', '13 mm', 'SDS-plus', 'SDS-max']),
                alan('Azami tork', [
                  '20 Nm altı',
                  '20 - 39 Nm',
                  '40 - 59 Nm',
                  '60 - 99 Nm',
                  '100 Nm ve üzeri',
                ]),
                varYok('Darbeli'),
              ]
            : []),
          varYok('Şarj cihazı dahil'),
          varYok('Taşıma çantası'),
          ...belgeler,
        ];
      if (marka === 'olcum')
        return [
          alan('Ölçüm türü', ['Dijital', 'Analog', 'Lazer']),
          alan('Ölçüm mesafesi', ['10 m altı', '10 - 29 m', '30 - 49 m', '50 - 99 m', '100 m ve üzeri']),
          varYok('Kalibrasyon belgesi'),
          ...belgeler,
        ];
      return [
        alan('Malzeme', ['Çelik', 'Krom vanadyum', 'Paslanmaz çelik', 'Alüminyum', 'Diğer']),
        alan('Parça sayısı', ['1', '2 - 5', '6 - 10', '11 - 25', '26 - 50', '51 ve üzeri']),
        varYok('Çanta dahil'),
      ];
    case 'yapi-malzemeleri':
      return [
        alan('Malzeme', ['Ahşap', 'Metal', 'Seramik', 'PVC', 'Cam', 'Bakır', 'Çimento esaslı', 'Diğer']),
        alan('Satış birimi', ['Adet', 'Paket', 'Metre', 'Metrekare', 'Kilogram', 'Litre']),
        alan('Kullanım yeri', ['İç mekân', 'Dış mekân', 'İç ve dış mekân']),
        renk,
        alan('Ürün durumu', ['Kullanılmamış', 'Sökülmüş', 'Artan malzeme']),
      ];
    case 'prefabrik-yapilar':
      return [
        alan('Alan', [
          '10 m² altı',
          '10 - 19 m²',
          '20 - 39 m²',
          '40 - 59 m²',
          '60 - 99 m²',
          '100 m² ve üzeri',
        ]),
        alan('Gövde', ['Çelik', 'Ahşap', 'Sandviç panel', 'Betonarme panel', 'Diğer']),
        alan('Oda sayısı', ['Tek hacim', '1+0', '1+1', '2+1', '3+1', 'Diğer']),
        varYok('Isı yalıtımı'),
        alan('Nakliye', ['Alıcıya ait', 'Satıcıya ait', 'Görüşülür']),
      ];
    case 'is-guvenligi':
      return [
        model === 'is-ayakkabisi' ? ayakkabi : beden,
        alan('Koruma standardı', [
          'EN 397',
          'EN 166',
          'EN 388',
          'EN ISO 20345',
          'EN ISO 20471',
          'Belirtilmemiş',
        ]),
        alan('Malzeme', ['Deri', 'Tekstil', 'Polikarbonat', 'ABS', 'Lateks', 'Nitril', 'Diğer']),
        renk,
      ];
    default:
      return [];
  }
}

function bakimAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  if (
    marka === 'aksesuar' &&
    ['sac-bakimi', 'cilt-bakimi', 'agiz-bakimi', 'saglik-olcum'].includes(altKategori ?? '')
  )
    return [
      alan('Uyumluluk', ['Evrensel', 'Modele özel']),
      malzeme,
      alan('Ambalaj', ['Açılmamış', 'Açılmış']),
      set,
      renk,
    ];
  if (model === 'elektrikli-dis-fircasi' || model === 'agiz-dusu')
    return [
      gucKaynagi,
      alan('Kademe', ['1', '2', '3', '5', '10', 'Diğer']),
      alan('Başlık sayısı', ['Başlık dahil değil', '1', '2', '3', '4', 'Diğer']),
      alan('Kişisel temas parçaları', ['Yeni', 'Kullanılmış', 'Dahil değil']),
      ...belgeler,
    ];
  if (altKategori === 'parfum-kozmetik')
    return [
      alan('Ambalaj', ['Açılmamış', 'Açılmış']),
      alan('Hacim', [
        '10 ml',
        '15 ml',
        '30 ml',
        '50 ml',
        '75 ml',
        '100 ml',
        '125 ml',
        '150 ml',
        '200 ml',
        'Diğer',
      ]),
      ...(marka === 'parfum'
        ? [
            alan('Konsantrasyon', ['EDC', 'EDT', 'EDP', 'Parfüm / extrait', 'Vücut spreyi']),
            alan('Doluluk', ['Tam', '%90 ve üzeri', '%75 - 89', '%50 - 74', '%50 altında']),
          ]
        : [alan('Ürün türü', ['Yüz', 'Göz', 'Dudak', 'Cilt bakımı', 'Set'])]),
      varYok('Fatura'),
    ];
  if (altKategori === 'saglik-olcum')
    return [
      alan('Ölçüm', ['Dijital', 'Analog']),
      alan('Kullanım yeri', ['Üst kol', 'Bilek', 'Alın', 'Kulak', 'Parmak', 'Zemin', 'Diğer']),
      gucKaynagi,
      varYok('Hafıza'),
      ...belgeler,
    ];
  return [
    gucKaynagi,
    ...(altKategori === 'sac-bakimi'
      ? [
          alan('Güç', ['500 W altı', '500 - 999 W', '1000 - 1499 W', '1500 - 1999 W', '2000 W ve üzeri']),
          varYok('Sıcaklık ayarı'),
        ]
      : [alan('Kademe', ['1', '2', '3', '5', '10', 'Diğer']), varYok('Yıkanabilir başlık')]),
    alan('Başlık sayısı', ['1', '2', '3', '4', '5', '6', 'Diğer']),
    renk,
    ...belgeler,
  ];
}

function elektronikAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'elektronik-bilesen':
      return [
        ...(model === 'direnc'
          ? [
              alan('Direnç değeri', [
                '1 Ω',
                '10 Ω',
                '100 Ω',
                '220 Ω',
                '330 Ω',
                '1 kΩ',
                '4,7 kΩ',
                '10 kΩ',
                '100 kΩ',
                '1 MΩ',
                'Karışık set',
                'Diğer',
              ]),
              alan('Tolerans', ['%0,1', '%1', '%5', '%10', 'Belirtilmemiş']),
            ]
          : model === 'kondansator'
            ? [
                alan('Kapasitans', [
                  '100 pF',
                  '1 nF',
                  '10 nF',
                  '100 nF',
                  '1 µF',
                  '10 µF',
                  '100 µF',
                  '1000 µF',
                  'Karışık set',
                  'Diğer',
                ]),
                alan('Gerilim', [
                  '6,3 V',
                  '10 V',
                  '16 V',
                  '25 V',
                  '35 V',
                  '50 V',
                  '63 V',
                  '100 V',
                  '250 V',
                  '400 V',
                  'Diğer',
                ]),
              ]
            : model === 'bobin'
              ? [
                  alan('Endüktans', [
                    '1 µH',
                    '10 µH',
                    '100 µH',
                    '1 mH',
                    '10 mH',
                    '100 mH',
                    'Karışık set',
                    'Diğer',
                  ]),
                ]
              : model === 'transistor'
                ? [
                    alan('Transistör türü', [
                      'NPN',
                      'PNP',
                      'N-kanal MOSFET',
                      'P-kanal MOSFET',
                      'IGBT',
                      'JFET',
                      'Karışık set',
                    ]),
                  ]
                : model === 'diyot'
                  ? [alan('Diyot türü', ['Doğrultucu', 'Schottky', 'Zener', 'LED', 'TVS', 'Karışık set'])]
                  : [
                      alan('İşlev', [
                        'Mikrodenetleyici',
                        'Op-amp',
                        'Mantık',
                        'Güç yönetimi',
                        'Ses',
                        'Haberleşme',
                        'Diğer',
                      ]),
                    ]),
        alan('Montaj', ['SMD', 'Delik içi / THT', 'Panel', 'Diğer']),
        alan('Paket', ['Tek parça', 'Set', 'Makara', 'Kutu']),
        alan('Durum', ['Yeni', 'Sökme', 'Test edilmiş']),
        varYok('Teknik doküman'),
      ];
    case 'gelistirme-karti':
      if (marka === 'robotik')
        return [
          alan('Çalışma gerilimi', ['3,3 V', '5 V', '6 V', '9 V', '12 V', '24 V', 'Diğer']),
          alan('Arayüz', ['Analog', 'Dijital GPIO', 'I²C', 'SPI', 'UART', 'PWM', 'Diğer']),
          alan('Satış şekli', ['Tek modül', 'Set']),
          varYok('Teknik doküman'),
          ...belgeler,
        ];
      return [
        alan('Lojik gerilimi', ['1,8 V', '3,3 V', '5 V', '3,3 V / 5 V', 'Diğer']),
        alan('Bağlantı', ['USB-C', 'Micro USB', 'Mini USB', 'USB-B', 'GPIO', 'Diğer']),
        varYok('Wi-Fi'),
        varYok('Bluetooth'),
        alan('Satış şekli', ['Tek kart', 'Set', 'Modül']),
        ...belgeler,
      ];
    case 'olcu-test':
      return [
        alan('Ölçüm', ['Dijital', 'Analog']),
        ...(model === 'osiloskop'
          ? [
              alan('Bant genişliği', [
                '20 MHz',
                '50 MHz',
                '70 MHz',
                '100 MHz',
                '200 MHz',
                '350 MHz',
                '500 MHz',
                'Diğer',
              ]),
              alan('Kanal sayısı', ['1', '2', '4', '8']),
            ]
          : [alan('Ölçüm türü', ['Gerilim', 'Akım', 'Direnç', 'Sıcaklık', 'Işık', 'Ses', 'Çok işlevli'])]),
        varYok('Kalibrasyon belgesi'),
        varYok('Prob dahil'),
        ...belgeler,
      ];
    case 'lehimleme':
      if (marka === 'malzeme')
        return model === 'mikroskop'
          ? [
              alan('Optik sistem', ['Dijital', 'Stereo optik', 'Tek gözlü']),
              alan('Büyütme', ['10×', '20×', '40×', '100×', '200×', 'Ayarlanabilir', 'Diğer']),
              varYok('Dahilî ekran'),
              varYok('Aydınlatma'),
              ...belgeler,
            ]
          : [
              alan('Malzeme', [
                'Kurşunlu lehim',
                'Kurşunsuz lehim',
                'Çelik',
                'Plastik',
                'Karışık set',
                'Diğer',
              ]),
              alan('Paket', ['Tek parça', 'Set', 'Makara', 'Kutu']),
              varYok('Taşıma çantası'),
            ];
      return [
        alan('Güç', ['30 W', '40 W', '60 W', '80 W', '100 W', '150 W', '500 W', '700 W', 'Diğer']),
        varYok('Sıcaklık ayarı'),
        alan('Gösterge', ['Dijital', 'Analog', 'Yok']),
        varYok('Yedek uç dahil'),
        ...belgeler,
      ];
    case 'guc-enerji':
      if (model === 'solar-panel')
        return [
          alan('Hücre', ['Monokristal', 'Polikristal', 'İnce film']),
          alan('Nominal güç', [
            '50 W altı',
            '50 W',
            '100 W',
            '150 W',
            '200 W',
            '300 W',
            '400 W',
            '450 W',
            '500 W',
            '550 W',
            '600 W',
            'Diğer',
          ]),
          alan('Yapı', ['Sert', 'Esnek', 'Katlanabilir']),
          alan('Nominal gerilim', ['12 V', '24 V', '48 V', 'Diğer']),
          ...belgeler,
        ];
      if (model === 'sarj-kontrol')
        return [
          alan('Teknoloji', ['PWM', 'MPPT']),
          alan('Sistem gerilimi', ['12 V', '24 V', '48 V', 'Otomatik 12/24 V', 'Diğer']),
          alan('Azami akım', ['10 A', '20 A', '30 A', '40 A', '50 A', '60 A', '100 A', 'Diğer']),
          ...belgeler,
        ];
      return [
        alan('Gerilim', ['3,7 V', '5 V', '9 V', '12 V', '24 V', '36 V', '48 V', 'Ayarlanabilir', 'Diğer']),
        ...(marka === 'besleme'
          ? [
              alan('Azami akım', ['1 A', '2 A', '3 A', '5 A', '10 A', '20 A', '30 A', 'Diğer']),
              varYok('Gerilim ayarı'),
            ]
          : [
              alan('Teknoloji', [
                'Lityum iyon',
                'LiFePO4',
                'Kurşun asit',
                'NiMH',
                'Monokristal',
                'Polikristal',
                'Diğer',
              ]),
              alan('Kapasite / güç', [
                '1 - 9 Ah',
                '10 - 49 Ah',
                '50 - 99 Ah',
                '100 Ah ve üzeri',
                '100 W altı',
                '100 - 299 W',
                '300 W ve üzeri',
                'Diğer',
              ]),
            ]),
        ...belgeler,
      ];
    case 'haberlesme':
      if (marka === 'iletisim')
        return [
          alan('Frekans bandı', ['PMR446', 'VHF', 'UHF', 'HF', 'Çok bantlı', 'Diğer']),
          ...(model === 'anten'
            ? [
                alan('Anten tipi', ['El tipi', 'Araç', 'Sabit', 'Yönlü']),
                alan('Konnektör', ['SMA', 'BNC', 'N', 'PL-259', 'Diğer']),
              ]
            : [alan('Güç kaynağı', ['Batarya', '12 V', '24 V', 'Priz']), varYok('Şarj cihazı dahil')]),
          ...belgeler,
        ];
      return [
        alan('Çalışma gerilimi', ['5 V', '12 V', '24 V', '48 V', '230 V', 'Pil', 'Diğer']),
        alan('Bağlantı', ['Ethernet', 'RS-232', 'RS-485', 'CAN', 'USB', 'Kablosuz', 'Diğer']),
        ...(marka === 'iletisim'
          ? [alan('Frekans bandı', ['PMR446', 'VHF', 'UHF', 'HF', 'Çok bantlı', 'Diğer'])]
          : [alan('Giriş / çıkış sayısı', ['4', '8', '12', '16', '24', '32', 'Diğer'])]),
        ...belgeler,
      ];
    default:
      return [];
  }
}

function ofisAlanlari({ altKategori, marka, model = '' }: UrunSecimi): OzellikAlani[] {
  switch (altKategori) {
    case 'ofis-mobilyasi':
      return [
        malzeme,
        ...(marka === 'oturma'
          ? [
              alan('Döşeme', ['File', 'Kumaş', 'Deri', 'Suni deri']),
              varYok('Yükseklik ayarı'),
              varYok('Kolçak'),
              varYok('Bel desteği'),
            ]
          : [alan('Montaj', ['Kurulu', 'Demonte']), varYok('Yükseklik ayarı')]),
        renk,
      ];
    case 'ofis-makineleri':
      return [
        gucKaynagi,
        ...(model === 'evrak-imha'
          ? [
              alan('Kesim', ['Şerit', 'Çapraz', 'Mikro']),
              alan('Tek seferde sayfa', ['5', '6', '8', '10', '12', '15', '20', 'Diğer']),
            ]
          : model === 'laminasyon' || model === 'giyotin'
            ? [alan('Kâğıt boyutu', ['A3', 'A4', 'A5', 'Diğer'])]
            : [alan('Kullanım', ['Masaüstü', 'Taşınabilir', 'Endüstriyel'])]),
        ...belgeler,
      ];
    case 'kirtasiye':
      return [
        alan('Malzeme', ['Kâğıt', 'Karton', 'Plastik', 'Metal', 'Deri', 'Diğer']),
        ...(marka === 'kagit'
          ? [
              alan('Boyut', ['A3', 'A4', 'A5', 'A6', 'B5', 'Diğer']),
              alan('Gramaj', [
                '60 g/m²',
                '70 g/m²',
                '80 g/m²',
                '90 g/m²',
                '120 g/m²',
                '160 g/m²',
                '200 g/m²',
                'Diğer',
              ]),
            ]
          : []),
        alan('Adet', ['1', '2', '5', '10', '12', '24', '50', '100', '500', 'Diğer']),
        renk,
      ];
    case 'sunum':
      if (marka === 'sunum')
        return model === 'sunum-kumandasi'
          ? [
              alan('Bağlantı', ['USB alıcı', 'Bluetooth', 'USB-C alıcı']),
              alan('İşaretçi', ['Kırmızı lazer', 'Yeşil lazer', 'Dijital', 'Yok']),
              gucKaynagi,
              ...belgeler,
            ]
          : [
              alan('Perde boyutu', [
                '100 × 100 cm',
                '150 × 150 cm',
                '180 × 180 cm',
                '200 × 200 cm',
                '240 × 240 cm',
                'Diğer',
              ]),
              alan('Kurulum', ['Tripod', 'Duvar', 'Tavan', 'Taşınabilir']),
              alan('Açılma', ['Manuel', 'Motorlu', 'Sabit']),
              alan('En boy oranı', ['1:1', '4:3', '16:9', '16:10']),
              ...belgeler,
            ];
      return [
        alan('Ölçü', ['45 × 60 cm', '60 × 90 cm', '90 × 120 cm', '100 × 150 cm', '120 × 180 cm', 'Diğer']),
        malzeme,
        varYok('Ayak dahil'),
        varYok('Manyetik yüzey'),
        renk,
      ];
    case 'sarf-malzemeleri':
      return [
        alan('Uyumlu marka', [
          'HP',
          'Canon',
          'Epson',
          'Brother',
          'Samsung',
          'Xerox',
          'Kyocera',
          'Zebra',
          'Diğer',
        ]),
        alan('Üretim', ['Orijinal', 'Muadil', 'Dolum']),
        alan('Renk', ['Siyah', 'Cyan', 'Magenta', 'Sarı', 'Çoklu paket']),
        alan('Ambalaj', ['Açılmamış', 'Açılmış']),
        set,
      ];
    case 'magaza-ekipmani':
      return [
        marka === 'teshir'
          ? malzeme
          : alan('Bağlantı', ['USB', 'Ethernet', 'RS-232', 'Bluetooth', 'Kablosuz', 'Bağlantısız']),
        alan('Kullanım', ['Masaüstü', 'Duvar', 'Ayaklı', 'Taşınabilir']),
        renk,
        ...belgeler,
      ];
    default:
      return [];
  }
}

function antikaAlanlari({ altKategori }: UrunSecimi): OzellikAlani[] {
  const ortak = [
    alan('Dönem', [
      '1800 öncesi',
      '1800 - 1849',
      '1850 - 1899',
      '1900 - 1922',
      '1923 - 1949',
      '1950 - 1979',
      '1980 ve sonrası',
      'Bilinmiyor',
    ]),
    alan('Kondisyon', ['Çok iyi', 'İyi', 'Kullanım izi var', 'Restorasyon görmüş', 'Restorasyon gerekli']),
    varYok('Belge / sertifika'),
  ];
  if (altKategori === 'antika-saat')
    return [
      alan('Mekanizma', ['Kurmalı', 'Otomatik', 'Pilli', 'Mekanik', 'Mekanizma yok']),
      alan('Çalışma durumu', ['Çalışıyor', 'Bakım gerekiyor', 'Çalışmıyor']),
      malzeme,
      ...ortak,
    ];
  if (altKategori === 'antika-sanat')
    return [
      alan('Yüzey', ['Tuval', 'Kâğıt', 'Ahşap', 'Seramik', 'Diğer']),
      varYok('İmzalı'),
      varYok('Çerçeve dahil'),
      ...ortak,
    ];
  if (altKategori === 'antika-tekstil')
    return [
      alan('Malzeme', ['Yün', 'İpek', 'Pamuk', 'Keten', 'Karışım']),
      alan('Dokuma', ['El dokuması', 'Makine dokuması', 'El işlemesi']),
      alan('Ölçü', ['1 m² altı', '1 - 2 m²', '2 - 4 m²', '4 - 6 m²', '6 m² ve üzeri']),
      ...ortak,
    ];
  return [
    alan('Malzeme', [
      'Ahşap',
      'Cam',
      'Porselen',
      'Seramik',
      'Bakır',
      'Pirinç',
      'Gümüş',
      'Bronz',
      'Metal',
      'Diğer',
    ]),
    alan('Menşei', ['Türkiye', 'Avrupa', 'Asya', 'Diğer', 'Bilinmiyor']),
    ...ortak,
  ];
}

/** Yeni katalog dalları ayrı tutulur; her seçimin alanları ilan formunda ve filtrede aynıdır. */
export function ekOzellikAlanlari(secim: UrunSecimi): OzellikAlani[] {
  switch (secim.kategori) {
    case 'spor':
      return sporAlanlari(secim);
    case 'anne-bebek':
      return bebekAlanlari(secim);
    case 'muzik':
      return muzikAlanlari(secim);
    case 'kitap':
      return kitapAlanlari(secim);
    case 'hobi':
      return hobiAlanlari(secim);
    case 'bahce':
      return bahceAlanlari(secim);
    case 'kisisel-bakim':
      return bakimAlanlari(secim);
    case 'teknik-elektronik':
      return elektronikAlanlari(secim);
    case 'ofis':
      return ofisAlanlari(secim);
    case 'antika':
      return antikaAlanlari(secim);
    default:
      return [];
  }
}
