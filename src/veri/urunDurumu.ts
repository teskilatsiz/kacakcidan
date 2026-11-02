import type { Ilan } from './ilanlar.ts';
import type { OzellikAlani, UrunSecimi } from './ozellikler.ts';

export type DurumKaniti = { alan: string; deger: string; gorsel: string };

const alan = (ad: string, secenekler: string[]): OzellikAlani => ({ ad, secenekler });
const bilmiyorum = 'Bilinmiyor';
const saglikSecenekleri = [
  ...Array.from({ length: 101 }, (_, sira) => `%${100 - sira}`),
  '%50 altında',
  bilmiyorum,
];
const saglik = (ad: string): OzellikAlani => ({
  ad,
  secenekler: saglikSecenekleri,
  filtreSecenekleri: [
    { id: 'aralik:95:100', ad: 'En az %95' },
    { id: 'aralik:90:100', ad: 'En az %90' },
    { id: 'aralik:85:100', ad: 'En az %85' },
    { id: 'aralik:80:100', ad: 'En az %80' },
    { id: 'aralik:0:79', ad: '%80 altında' },
    { id: bilmiyorum, ad: bilmiyorum },
  ],
});
const ekran = alan('Ekran durumu', [
  'Çiziksiz',
  'İnce çizikler var',
  'Derin çizikler var',
  'Çatlak / kırık',
  'Görüntü / dokunmatik sorunu var',
  'Değişmiş',
  bilmiyorum,
]);
const ekranDegisimi = alan('Ekran değişimi', [
  'Değişmedi',
  'Yetkili serviste değişti',
  'Özel serviste değişti',
  bilmiyorum,
]);
const onarim = alan('Onarım geçmişi', [
  'Onarım görmedi',
  'Yetkili serviste onarıldı',
  'Özel serviste onarıldı',
  bilmiyorum,
]);
const parca = alan('Değişen parça', [
  'Yok',
  'Yetkili serviste değişmiş',
  'Özel serviste değişmiş',
  bilmiyorum,
]);
const calisma = alan('Çalışma durumu', ['Tüm işlevler çalışıyor', 'Bazı işlevlerde sorun var', bilmiyorum]);
const kozmetik = alan('Kozmetik durum', ['Çok iyi', 'İyi', 'Kullanım izi var', 'Belirgin hasar var']);
const sivi = alan('Sıvı teması', ['Olmadı', 'Oldu', bilmiyorum]);

/** Üretici ölçümü mevcutsa yazılır; seçilmemiş bir değer sağlam ürün anlamına gelmez. */
export function urunDurumAlanlari(secim: UrunSecimi): OzellikAlani[] {
  if (
    secim.kategori === 'telefon' &&
    ['cep-telefonu', 'yenilenmis-telefon'].includes(secim.altKategori ?? '')
  )
    return [
      saglik('Pil sağlığı'),
      ekran,
      ekranDegisimi,
      alan('Batarya değişimi', [
        'Değişmedi',
        'Yetkili serviste değişti',
        'Özel serviste değişti',
        bilmiyorum,
      ]),
      onarim,
      parca,
      sivi,
      alan('Kamera durumu', ['Sorunsuz', 'Odaklama sorunu var', 'Lens hasarlı', 'Çalışmıyor', bilmiyorum]),
      alan('Mikrofon ve hoparlör', [
        'Sorunsuz',
        'Mikrofonda sorun var',
        'Hoparlörde sorun var',
        'İkisinde de sorun var',
        bilmiyorum,
      ]),
      calisma,
      kozmetik,
    ];
  if (secim.kategori === 'bilgisayar') {
    if (['dizustu', 'masaustu', 'oyun-bilgisayari', 'tablet', 'monitor'].includes(secim.altKategori ?? '')) {
      const tasinabilir = ['dizustu', 'tablet'].includes(secim.altKategori ?? '');
      return [
        ...(tasinabilir
          ? [
              saglik('Batarya sağlığı'),
              alan('Batarya durumu', [
                'Normal',
                'Servis öneriliyor',
                'Şarj tutmuyor',
                'Batarya yok',
                bilmiyorum,
              ]),
              alan('Batarya döngüsü', [
                '0 - 100',
                '101 - 300',
                '301 - 500',
                '501 - 1000',
                '1001 ve üzeri',
                bilmiyorum,
              ]),
            ]
          : []),
        ...(secim.altKategori !== 'monitor'
          ? [
              alan('SSD durumu', ['Normal', 'Uyarı veriyor', 'SSD yok', bilmiyorum]),
              alan('Donanım değişimi', [
                'Yok',
                'RAM yükseltildi',
                'Depolama değişti',
                'Birden fazla parça değişti',
                bilmiyorum,
              ]),
            ]
          : []),
        ...(secim.altKategori !== 'masaustu' ? [ekran, ekranDegisimi] : []),
        onarim,
        sivi,
        calisma,
        kozmetik,
      ];
    }
    return [];
  }
  if (secim.kategori === 'ev' && secim.altKategori === 'mobilya')
    return [
      ...['Genişlik', 'Derinlik', 'Yükseklik'].map((ad): OzellikAlani => ({
        ad,
        sayisal: true,
        birim: 'cm',
        enAz: 1,
        enCok: 1000,
        secenekler: [],
        filtreSecenekleri: [
          { id: 'aralik:1:50', ad: '50 cm ve altı' },
          { id: 'aralik:51:100', ad: '51 - 100 cm' },
          { id: 'aralik:101:150', ad: '101 - 150 cm' },
          { id: 'aralik:151:200', ad: '151 - 200 cm' },
          { id: 'aralik:201:1000', ad: '200 cm üzeri' },
        ],
      })),
      alan('Kullanım süresi', [
        'Kullanılmadı',
        '1 yıldan az',
        '1 - 3 yıl',
        '3 - 5 yıl',
        '5 yıldan fazla',
        bilmiyorum,
      ]),
      alan('Kusur durumu', [
        'Bilinen kusuru yok',
        'Çizik / aşınma var',
        'Leke var',
        'Kırık / eksik parça var',
        'Birden fazla kusur var',
        bilmiyorum,
      ]),
      alan('Tamir durumu', ['Tamir görmedi', 'Tamir gördü', 'Tamir gerekiyor', bilmiyorum]),
      kozmetik,
    ];
  return [];
}

export function satisAlanlari(): OzellikAlani[] {
  return [
    alan('Satıcı türü', ['Bireysel', 'Mağaza']),
    alan('Teslimat', ['Elden teslim', 'Kargo', 'Elden teslim veya kargo']),
  ];
}

/** Kanıt yalnızca ilanın kendi fotoğraflarından seçilebilir ve ilgili beyanla eşleşir. */
export function durumKanitlariniTemizle(
  kanitlar: unknown,
  alanlar: readonly OzellikAlani[],
  ozellikler: Record<string, string>,
  fotograflar: readonly string[],
): DurumKaniti[] {
  if (!Array.isArray(kanitlar)) return [];
  const izinliAlanlar = new Set(alanlar.map((alan) => alan.ad));
  const gorseller = new Set(fotograflar);
  const sonuc = new Map<string, DurumKaniti>();
  for (const kanit of kanitlar.slice(0, 40)) {
    if (
      !kanit ||
      typeof kanit !== 'object' ||
      typeof kanit.alan !== 'string' ||
      typeof kanit.deger !== 'string' ||
      typeof kanit.gorsel !== 'string' ||
      !izinliAlanlar.has(kanit.alan) ||
      !kanit.deger ||
      kanit.deger !== ozellikler[kanit.alan] ||
      !gorseller.has(kanit.gorsel)
    )
      continue;
    sonuc.set(kanit.alan, { alan: kanit.alan, deger: kanit.deger, gorsel: kanit.gorsel });
  }
  return [...sonuc.values()];
}

export function durumRaporu(
  ilan: Pick<
    Ilan,
    | 'kategori'
    | 'altKategori'
    | 'marka'
    | 'model'
    | 'ozellikler'
    | 'gorsel'
    | 'fotografler'
    | 'durumKanitlari'
  >,
) {
  const alanlar = urunDurumAlanlari(ilan);
  const kanitlar = durumKanitlariniTemizle(ilan.durumKanitlari, alanlar, ilan.ozellikler ?? {}, [
    ilan.gorsel,
    ...(ilan.fotografler ?? []),
  ]);
  return alanlar.map((alan) => ({
    ad: alan.ad,
    deger: ilan.ozellikler?.[alan.ad],
    birim: alan.birim,
    kanit: kanitlar.find((kanit) => kanit.alan === alan.ad),
  }));
}
