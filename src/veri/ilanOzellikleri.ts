import type { OzellikAlani, UrunSecimi } from './ozellikler.ts';

const alan = (ad: string, secenekler: string[]): OzellikAlani => ({ ad, secenekler });
const evetHayir = (ad: string) => alan(ad, ['Evet', 'Hayır']);
const metrekare = (ad: string): OzellikAlani => ({
  ad,
  sayisal: true,
  birim: 'm²',
  enCok: 100000000,
  secenekler: [],
  filtreSecenekleri: [
    { id: 'aralik:0:50', ad: '50 m² ve altı' },
    { id: 'aralik:51:100', ad: '51 - 100 m²' },
    { id: 'aralik:101:150', ad: '101 - 150 m²' },
    { id: 'aralik:151:250', ad: '151 - 250 m²' },
    { id: 'aralik:251:500', ad: '251 - 500 m²' },
    { id: 'aralik:501:', ad: '501 m² ve üzeri' },
  ],
});

function isAlanlari({ altKategori }: UrunSecimi): OzellikAlani[] {
  return [
    alan('Çalışma şekli', ['Tam zamanlı', 'Yarı zamanlı', 'Dönemsel', 'Serbest çalışma', 'Staj']),
    alan('Çalışma yeri', ['İş yerinde', 'Uzaktan', 'Hibrit', 'Sahada', 'Yatılı']),
    alan('Deneyim', [
      'Deneyim aranmıyor',
      '1 yıldan az',
      '1 - 2 yıl',
      '3 - 5 yıl',
      '6 - 10 yıl',
      '10 yıldan fazla',
    ]),
    alan('Eğitim', [
      'Eğitim şartı yok',
      'İlköğretim',
      'Lise',
      'Ön lisans',
      'Lisans',
      'Yüksek lisans',
      'Doktora',
      'Öğrenci',
    ]),
    alan('Ücret dönemi', ['Aylık', 'Saatlik', 'Günlük', 'Haftalık', 'Yıllık', 'Proje bazlı']),
    alan('Açık pozisyon sayısı', ['1', '2', '3', '4', '5', '6 - 10', '11 ve üzeri']),
    alan('Yabancı dil', ['Aranmıyor', 'İngilizce', 'Almanca', 'Fransızca', 'Arapça', 'Rusça', 'Diğer']),
    alan('Yabancı dil seviyesi', ['Aranmıyor', 'Başlangıç', 'Orta', 'İyi', 'İleri', 'Ana dil']),
    alan('Vardiya', ['Gündüz', 'Gece', 'Vardiyalı', 'Esnek saatler']),
    alan('Yan haklar', [
      'Yemek',
      'Yol',
      'Yemek ve yol',
      'Servis ve yemek',
      'Özel sağlık sigortası',
      'Prim',
      'Yemek, yol ve prim',
      'Konaklama',
      'Görüşmede',
    ]),
    ...(['lojistik-tasima', 'satis', 'tamir-bakim', 'tarim-hayvancilik'].includes(altKategori ?? '')
      ? [
          alan('Ehliyet', ['Aranmıyor', 'A', 'A1', 'A2', 'B', 'BE', 'C', 'CE', 'D', 'D1', 'F']),
          alan('Mesleki belge', [
            'Aranmıyor',
            'SRC 1',
            'SRC 2',
            'SRC 3',
            'SRC 4',
            'Psikoteknik',
            'Operatörlük belgesi',
            'MYK belgesi',
          ]),
        ]
      : []),
    ...(altKategori === 'koruma-guvenlik'
      ? [
          alan('Güvenlik kimliği', ['Silahlı', 'Silahsız', 'Aranmıyor']),
          alan('İSG belge sınıfı', ['A sınıfı', 'B sınıfı', 'C sınıfı', 'Aranmıyor']),
        ]
      : []),
    ...(altKategori === 'bilisim-yazilim'
      ? [alan('Kıdem', ['Stajyer', 'Başlangıç', 'Orta seviye', 'Kıdemli', 'Takım lideri', 'Yönetici'])]
      : []),
  ];
}

function emlakAlanlari({ altKategori, marka }: UrunSecimi): OzellikAlani[] {
  const tapu = alan('Tapu durumu', [
    'Kat mülkiyetli',
    'Kat irtifaklı',
    'Müstakil tapulu',
    'Hisseli tapulu',
    'Arsa tapulu',
    'Kooperatif hisseli',
    'Diğer',
  ]);
  if (altKategori === 'arsa')
    return [
      metrekare('Alan'),
      alan('İmar durumu', [
        'Konut',
        'Ticaret',
        'Ticaret + konut',
        'Sanayi',
        'Tarla',
        'Bağ ve bahçe',
        'Turizm',
        'İmarsız',
        'Diğer',
      ]),
      alan('Emsal', [
        '0,15',
        '0,20',
        '0,25',
        '0,30',
        '0,40',
        '0,50',
        '0,60',
        '0,75',
        '1,00',
        '1,20',
        '1,50',
        '2,00',
        '2,50',
        'Belirtilmemiş',
      ]),
      alan('Gabari', [
        '6,50 m',
        '9,50 m',
        '12,50 m',
        '15,50 m',
        '18,50 m',
        '21,50 m',
        'Serbest',
        'Belirtilmemiş',
      ]),
      tapu,
      evetHayir('Yola cephe'),
      evetHayir('Elektrik'),
      evetHayir('Su'),
      evetHayir('Krediye uygun'),
    ];
  const bina = [
    metrekare('Brüt alan'),
    ...(altKategori === 'konut' || altKategori === 'konut-projesi' || altKategori === 'devre-mulk'
      ? [
          metrekare('Net alan'),
          alan('Oda sayısı', [
            'Stüdyo',
            '1+0',
            '1+1',
            '2+0',
            '2+1',
            '2+2',
            '3+1',
            '3+2',
            '4+1',
            '4+2',
            '5+1',
            '5+2',
            '6+1',
            '7+1',
            '8+1 ve üzeri',
          ]),
        ]
      : []),
    alan('Bina yaşı', [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5 - 10',
      '11 - 15',
      '16 - 20',
      '21 - 25',
      '26 - 30',
      '31 ve üzeri',
    ]),
    alan('Kat sayısı', [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11 - 15',
      '16 - 20',
      '21 ve üzeri',
    ]),
    alan('Isıtma', [
      'Yok',
      'Soba',
      'Doğal gaz sobası',
      'Kombi (doğal gaz)',
      'Kombi (elektrik)',
      'Merkezi',
      'Merkezi (pay ölçer)',
      'Yerden ısıtma',
      'Klima',
      'Isı pompası',
      'Jeotermal',
    ]),
    tapu,
    alan('Kullanım durumu', ['Boş', 'Kiracılı', 'Mülk sahibi oturuyor', 'İnşaat halinde']),
    evetHayir('Asansör'),
    alan('Otopark', ['Yok', 'Açık otopark', 'Kapalı otopark', 'Açık ve kapalı otopark']),
  ];
  if (altKategori === 'turistik-tesis')
    return [
      ...bina,
      alan('Oda kapasitesi', ['1 - 10', '11 - 20', '21 - 50', '51 - 100', '101 - 200', '201 ve üzeri']),
      alan('Yıldız sayısı', ['Yıldızsız', '1', '2', '3', '4', '5', 'Butik otel']),
      evetHayir('İşletme ruhsatı'),
      evetHayir('Havuz'),
      evetHayir('Restoran'),
    ];
  if (altKategori === 'bina')
    return [
      ...bina,
      alan('Daire sayısı', ['1', '2', '3', '4', '5 - 10', '11 - 20', '21 ve üzeri']),
      evetHayir('Krediye uygun'),
    ];
  if (altKategori === 'isyeri')
    return [
      ...bina,
      alan('Bölüm sayısı', ['1', '2', '3', '4', '5', '6 - 10', '11 ve üzeri']),
      evetHayir('Eşyalı'),
      evetHayir('Giriş kat'),
      evetHayir('Yükleme alanı'),
    ];
  return [
    ...bina,
    alan('Bulunduğu kat', [
      'Bodrum',
      'Kot 1',
      'Kot 2',
      'Zemin',
      'Bahçe katı',
      'Giriş',
      'Yüksek giriş',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11 - 15',
      '16 - 20',
      '21 ve üzeri',
      'Çatı katı',
      'Müstakil',
    ]),
    alan('Banyo sayısı', ['Yok', '1', '2', '3', '4', '5 ve üzeri']),
    evetHayir('Balkon'),
    evetHayir('Eşyalı'),
    evetHayir('Site içerisinde'),
    ...(marka === 'satilik' || marka === 'devren-satilik' ? [evetHayir('Krediye uygun')] : []),
    ...(altKategori === 'devre-mulk'
      ? [
          alan('Dönem', ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış', 'Esnek']),
          alan('Kullanım süresi', ['1 hafta', '2 hafta', '3 hafta', '1 ay', 'Diğer']),
        ]
      : []),
  ];
}

function hizmetAlanlari({ altKategori }: UrunSecimi): OzellikAlani[] {
  const ortak = [
    alan('Hizmet yeri', [
      'Müşterinin adresinde',
      'İş yerinde',
      'Uzaktan',
      'Müşterinin adresinde veya iş yerinde',
    ]),
    alan('Ücretlendirme', [
      'İş başına',
      'Saatlik',
      'Günlük',
      'Aylık',
      'm² başına',
      'Kişi başına',
      'Teklif usulü',
    ]),
    alan('Deneyim', ['1 yıldan az', '1 - 2 yıl', '3 - 5 yıl', '6 - 10 yıl', '10 yıldan fazla']),
    alan('Hizmet zamanı', ['Hafta içi', 'Hafta sonu', 'Her gün', '7/24', 'Randevuyla']),
    alan('Hizmet bölgesi', ['İlçe genelinde', 'İl genelinde', 'Çevre iller', 'Türkiye']),
  ];
  if (altKategori === 'ozel-ders')
    return [
      ...ortak,
      alan('Ders biçimi', ['Bire bir', 'Grup', 'Bire bir veya grup']),
      alan('Ders süresi', ['30 dakika', '45 dakika', '50 dakika', '60 dakika', '90 dakika', '120 dakika']),
      alan('Eğitmen eğitimi', [
        'Lise',
        'Ön lisans',
        'Lisans',
        'Yüksek lisans',
        'Doktora',
        'Üniversite öğrencisi',
      ]),
      evetHayir('Deneme dersi'),
    ];
  if (altKategori === 'nakliye')
    return [
      ...ortak,
      alan('Taşıma mesafesi', ['İlçe içi', 'Şehir içi', 'Şehirler arası', 'Uluslararası']),
      evetHayir('Paketleme dahil'),
      evetHayir('Asansörlü taşıma'),
      evetHayir('Sigortalı taşıma'),
      evetHayir('Montaj ve söküm'),
    ];
  if (altKategori === 'teknik-servis' || altKategori === 'arac-servis')
    return [
      ...ortak,
      alan('Servis türü', ['Özel servis', 'Yetkili servis', 'Bağımsız usta']),
      evetHayir('Yerinde servis'),
      evetHayir('İşçilik garantisi'),
      evetHayir('Yedek parça temini'),
    ];
  if (altKategori === 'tadilat-dekorasyon')
    return [
      ...ortak,
      alan('Kapsam', ['İşçilik', 'Malzeme ve işçilik', 'Keşif sonrası']),
      evetHayir('Ücretsiz keşif'),
      evetHayir('İşçilik garantisi'),
      evetHayir('Malzeme temini'),
    ];
  if (altKategori === 'temizlik')
    return [
      ...ortak,
      alan('Ekip', ['1 kişi', '2 kişi', '3 - 5 kişi', '6 kişi ve üzeri']),
      evetHayir('Malzeme dahil'),
      evetHayir('Ekipman dahil'),
    ];
  if (altKategori === 'dugun-etkinlik')
    return [
      ...ortak,
      alan('Etkinlik mekanı', ['İç mekan', 'Açık hava', 'İç ve dış mekan']),
      alan('Kapasite', [
        '1 - 20 kişi',
        '21 - 50 kişi',
        '51 - 100 kişi',
        '101 - 250 kişi',
        '251 - 500 kişi',
        '501 kişi ve üzeri',
      ]),
      evetHayir('Ekipman dahil'),
    ];
  return [
    ...ortak,
    evetHayir('Görüşme dahil'),
    alan('Teslim', ['Dijital', 'Fiziksel', 'Dijital ve fiziksel']),
  ];
}

export function ilanOzellikAlanlari(secim: UrunSecimi): OzellikAlani[] {
  if (secim.kategori === 'is-ilanlari') return isAlanlari(secim);
  if (secim.kategori === 'emlak') return emlakAlanlari(secim);
  if (secim.kategori === 'hizmetler') return hizmetAlanlari(secim);
  return [];
}
