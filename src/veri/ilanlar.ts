import { aramaIcinDuzelt } from './arama.ts';
import { konumEslesir } from './konumlar.ts';
import { kategoriler, type Kategori } from './anaKategoriler.ts';
import { ekIlanlar } from './ekIlanlar.ts';
import type { IlanKaldirmaNedeni } from './ilanYonetimi.ts';
import type { DurumKaniti } from './urunDurumu.ts';

export { kategoriler, type Kategori } from './anaKategoriler.ts';

export interface Ilan {
  id: string;
  numara?: string;
  saticiId?: string;
  telefon?: string;
  telefonGoster?: boolean;
  yayinDurumu?: 'yayinda' | 'kaldirildi';
  kaldirmaNedeni?: IlanKaldirmaNedeni;
  baslik: string;
  fiyat: number;
  fiyatGorusulur?: boolean;
  kategori: Kategori;
  gorsel: string;
  konum: string;
  zaman: string;
  satici: string;
  durum: 'İkinci el' | 'Yeni gibi' | 'Sıfır';
  aciklama: string;
  oneCikan?: boolean;
  takas?: boolean;
  benim?: boolean;
  altKategori?: string;
  marka?: string;
  model?: string;
  fotografler?: string[];
  video?: string;
  videoPoster?: string;
  ozellikler?: Record<string, string>;
  durumKanitlari?: DurumKaniti[];
}

const gorsel = (ad: string) => `/gorseller/${ad}.webp`;

const vitrinIlanlari: Ilan[] = [
  {
    id: 'iphone-15-pro',
    baslik: 'iPhone 15 Pro 256 GB',
    fiyat: 32000,
    kategori: 'telefon',
    gorsel: gorsel('iphone-15-pro'),
    konum: 'İstanbul, Şişli',
    zaman: '2 saat önce',
    satici: 'Mert K.',
    durum: 'İkinci el',
    oneCikan: true,
    benim: true,
    aciklama:
      'Kendi kullandığım telefonumu model yükselttiğim için satıyorum. Pil sağlığı %89. Ekranında çizik yok, tüm işlevleri çalışıyor. Kutusu ve şarj kablosu mevcut. Şişli veya Kadıköy’de görüp deneyebilirsiniz.',
  },
  {
    id: 'playstation-5',
    baslik: 'PlayStation 5 • Diskli',
    fiyat: 12750,
    kategori: 'oyun',
    gorsel: gorsel('playstation-5'),
    konum: 'İstanbul, Kadıköy',
    zaman: '3 saat önce',
    satici: 'Berk A.',
    durum: 'Yeni gibi',
    benim: true,
    takas: true,
    aciklama:
      'Az kullandığım diskli PS5. Bir DualSense kol, HDMI ve güç kablosuyla verilecek. Kutu ve faturası duruyor. Kol drift yapmıyor. Elden teslim ederken birlikte deneyebiliriz.',
  },
  {
    id: 'air-jordan',
    baslik: 'Nike Air Jordan 4 • 42 numara',
    fiyat: 6500,
    kategori: 'moda',
    gorsel: gorsel('air-jordan'),
    konum: 'İstanbul, Beşiktaş',
    zaman: 'Bugün',
    satici: 'Deniz S.',
    durum: 'Yeni gibi',
    benim: true,
    aciklama:
      '42 numara, birkaç kez giyildi. Taban ve iç astarı temiz. Orijinal kutusuyla teslim edeceğim. Güncel fotoğrafları ilanda görebilirsiniz.',
  },
  {
    id: 'fujifilm-x100v',
    baslik: 'Fujifilm X100V • Gümüş',
    fiyat: 28000,
    kategori: 'fotograf',
    gorsel: gorsel('fujifilm'),
    konum: 'İstanbul, Beyoğlu',
    zaman: 'Dün',
    satici: 'Ayşe Y.',
    durum: 'İkinci el',
    oneCikan: true,
    takas: true,
    aciklama:
      'Sokak fotoğrafçılığı için kullandığım makinem. Lens ve vizör temiz, sensörde sorun yok. Orijinal pil, askı ve kutusuyla birlikte. Deklanşör sayısı 8.400. Beyoğlu’nda deneyebilirsiniz.',
  },
  {
    id: 'otomatik-saat',
    baslik: 'Otomatik kol saati',
    fiyat: 18500,
    kategori: 'koleksiyon',
    gorsel: gorsel('saat'),
    konum: 'İstanbul, Bakırköy',
    zaman: 'Dün',
    satici: 'Ömer E.',
    durum: 'İkinci el',
    aciklama:
      'Yeşil kadranlı otomatik saat. Bilezikte kullanıma bağlı ince izler var. Düzenli çalışıyor, ekstra baklaları yanında. Görerek almanızı tercih ederim.',
  },
  {
    id: 'kawasaki-ninja',
    baslik: 'Kawasaki Ninja 250',
    fiyat: 98000,
    kategori: 'otomotiv',
    gorsel: gorsel('kawasaki'),
    konum: 'İstanbul, Pendik',
    zaman: 'Dün',
    satici: 'Can D.',
    durum: 'İkinci el',
    benim: true,
    aciklama:
      'Bakımlarını zamanında yaptırdığım motosikletim. Kapalı garajda duruyor. 24.000 km’de. Son bakım bilgilerini ve belgelerini görüşmede paylaşabilirim. Ekspertize açık.',
  },
  {
    id: 'macbook-air',
    baslik: 'MacBook Air M2 • 16/256 GB',
    fiyat: 28500,
    kategori: 'bilgisayar',
    gorsel: gorsel('macbook-air'),
    konum: 'İstanbul, Üsküdar',
    zaman: 'Dün',
    satici: 'Emre B.',
    durum: 'Yeni gibi',
    takas: true,
    aciklama:
      '13 inç gümüş MacBook Air. 16 GB bellek, 256 GB SSD. İş için kullandığım bilgisayarımı yenilediğim için satıyorum. Pil döngüsü 142. Orijinal adaptörü ve kutusu yanında. Türkçe klavye, tüm tuşları çalışıyor.',
  },
  {
    id: 'sari-masa-lambasi',
    baslik: 'Vintage metal masa lambası',
    fiyat: 1850,
    kategori: 'ev',
    gorsel: gorsel('masa-lambasi'),
    konum: 'İzmir, Bornova',
    zaman: 'Dün',
    satici: 'Duru E.',
    durum: 'İkinci el',
    aciklama:
      'Yıllardır çalışma masamda duran sarı metal lambam. Başlığında küçük kullanım izleri var, bence karakteri de oradan geliyor. Anahtarı ve kablosu sorunsuz. Ampulüyle beraber vereceğim. Bornova’da elden teslim edebilirim.',
  },
  {
    id: 'iphone-14-pro',
    baslik: 'iPhone 14 Pro Max 128 GB',
    fiyat: 29900,
    kategori: 'telefon',
    gorsel: gorsel('iphone-14-pro-max'),
    konum: 'Ankara, Çankaya',
    zaman: 'Dün',
    satici: 'Zeynep T.',
    durum: 'İkinci el',
    takas: true,
    aciklama:
      'Kılıf ve ekran koruyucuyla kullanıldı. Pil sağlığı %87. Kutu mevcut. Ankara’da elden teslim edebilirim, kontrol ederek alabilirsiniz.',
  },
  {
    id: 'samsung-s23',
    baslik: 'Samsung Galaxy S23 Ultra',
    fiyat: 24500,
    kategori: 'telefon',
    gorsel: gorsel('samsung-s23-ultra'),
    konum: 'İstanbul, Kadıköy',
    zaman: '2 gün önce',
    satici: 'Eren B.',
    durum: 'Yeni gibi',
    aciklama:
      '256 GB, siyah. S Pen dahil tüm fonksiyonları sorunsuz. Kozmetik olarak temiz. Kutu ve faturası bulunuyor. Kadıköy’de elden teslim.',
  },
  {
    id: 'xiaomi-13t',
    baslik: 'Xiaomi 13T Pro 256 GB',
    fiyat: 18900,
    kategori: 'telefon',
    gorsel: gorsel('xiaomi-13t-pro'),
    konum: 'İzmir, Karşıyaka',
    zaman: '2 gün önce',
    satici: 'Ece A.',
    durum: 'İkinci el',
    aciklama:
      'Mavi renk 13T Pro. Şarj adaptörü, kablosu ve kutusu yanında. Kasa kenarında küçük kullanım izi var, fotoğrafta görünüyor.',
  },
  {
    id: 'google-pixel',
    baslik: 'Google Pixel 7 128 GB',
    fiyat: 11250,
    kategori: 'telefon',
    gorsel: gorsel('pixel-7'),
    konum: 'İstanbul, Bakırköy',
    zaman: '3 gün önce',
    satici: 'Ali U.',
    durum: 'İkinci el',
    takas: true,
    aciklama:
      'Siyah Pixel 7, temiz ve çalışır durumda. Ekranda kırık ya da çatlak bulunmuyor. Kutusu mevcut, telefonla birlikte iki kılıf vereceğim.',
  },
  {
    id: 'nothing-phone',
    baslik: 'Nothing Phone (2) 256 GB',
    fiyat: 16500,
    kategori: 'telefon',
    gorsel: gorsel('nothing-phone-2'),
    konum: 'Ankara, Yenimahalle',
    zaman: '3 gün önce',
    satici: 'Selin Ç.',
    durum: 'Yeni gibi',
    aciklama:
      'Şeffaf arka tasarımlı Nothing Phone 2. Glyph ışıkları ve tüm işlevleri çalışıyor. Az kullanıldı. Kutusu ve orijinal kablosuyla verilecektir.',
  },
  {
    id: 'iphone-13',
    baslik: 'iPhone 13 128 GB • Mavi',
    fiyat: 17500,
    kategori: 'telefon',
    gorsel: gorsel('iphone-13'),
    konum: 'İstanbul, Pendik',
    zaman: '4 gün önce',
    satici: 'Burak İ.',
    durum: 'İkinci el',
    aciklama:
      'Mavi iPhone 13, 128 GB. Pil sağlığı %85. Kasa üzerinde günlük kullanımdan ufak izler var. Ekran temiz. Kutusuyla birlikte teslim.',
  },
];

const ayrintilar: Record<string, Partial<Ilan>> = {
  'iphone-15-pro': {
    video: '/videolar/iphone-15-pro.mp4',
    videoPoster: '/gorseller/iphone-15-pro-video.webp',
    altKategori: 'cep-telefonu',
    marka: 'apple',
    model: 'iphone-15-pro',
    fotografler: [gorsel('iphone-15-pro'), gorsel('iphone-15-pro-arka'), gorsel('iphone-15-pro-ekran')],
    ozellikler: { Depolama: '256 GB', Renk: 'Doğal titanyum', 'Pil sağlığı': '%89', Kutu: 'Var' },
  },
  'iphone-14-pro': {
    altKategori: 'cep-telefonu',
    marka: 'apple',
    model: 'iphone-14-pro-max',
    ozellikler: { Depolama: '128 GB', 'Pil sağlığı': '%87', Kutu: 'Var' },
  },
  'iphone-13': {
    altKategori: 'cep-telefonu',
    marka: 'apple',
    model: 'iphone-13',
    ozellikler: { Depolama: '128 GB', 'Pil sağlığı': '%85', Renk: 'Mavi' },
  },
  'samsung-s23': {
    altKategori: 'cep-telefonu',
    marka: 'samsung',
    model: 'galaxy-s23-ultra',
    ozellikler: { Depolama: '256 GB', Renk: 'Siyah', Kutu: 'Var' },
  },
  'xiaomi-13t': {
    altKategori: 'cep-telefonu',
    marka: 'xiaomi',
    model: '13t-pro',
    ozellikler: { Depolama: '256 GB', Renk: 'Mavi' },
  },
  'google-pixel': {
    altKategori: 'cep-telefonu',
    marka: 'google',
    model: 'pixel-7',
    ozellikler: { Depolama: '128 GB', Renk: 'Siyah' },
  },
  'nothing-phone': {
    altKategori: 'cep-telefonu',
    marka: 'nothing',
    model: 'phone-2',
    ozellikler: { Depolama: '256 GB', Kutu: 'Var' },
  },
  'macbook-air': {
    fotografler: [gorsel('macbook-air'), gorsel('macbook-air-kapak')],
    altKategori: 'dizustu',
    marka: 'apple',
    model: 'macbook-air-m2',
    ozellikler: {
      Ekran: '13 inç',
      Bellek: '16 GB',
      Depolama: '256 GB SSD',
      'Pil döngüsü': '142',
      Klavye: 'Türkçe',
    },
  },
  'playstation-5': {
    fotografler: [gorsel('playstation-5'), gorsel('playstation-5-detay')],
    altKategori: 'oyun-konsolu',
    marka: 'sony',
    model: 'playstation-5',
    ozellikler: { Sürüm: 'Diskli', 'Kol sayısı': '1', Kutu: 'Var' },
  },
  'air-jordan': {
    altKategori: 'spor-ayakkabi',
    marka: 'nike',
    model: 'air-jordan-4',
    ozellikler: { Numara: '42', Kutu: 'Var' },
  },
  'fujifilm-x100v': {
    altKategori: 'dijital-fotograf-makinesi',
    marka: 'fujifilm',
    model: 'x100v',
    ozellikler: { Renk: 'Gümüş', 'Deklanşör sayısı': '8.400', Kutu: 'Var' },
  },
  'kawasaki-ninja': {
    altKategori: 'motosiklet',
    marka: 'kawasaki',
    model: 'ninja-250',
    ozellikler: { Kilometre: '24.000 km' },
  },
  'sari-masa-lambasi': {
    altKategori: 'aydinlatma',
    marka: 'markasiz',
    model: 'masa-lambasi',
    ozellikler: { Malzeme: 'Metal', Renk: 'Sarı' },
  },
  'otomatik-saat': {
    altKategori: 'kol-saati',
    marka: 'markasiz',
    model: 'otomatik-saat',
    ozellikler: { Mekanizma: 'Otomatik', Kadran: 'Yeşil' },
  },
};
export const ilanlar: Ilan[] = [
  ...vitrinIlanlari.map((ilan) => ({ ...ilan, ...ayrintilar[ilan.id] })),
  ...ekIlanlar,
];

export const para = (deger: number) =>
  `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(deger)} TL`;

export function ilanBedeli(
  ilan: Pick<Ilan, 'fiyat' | 'fiyatGorusulur' | 'kategori' | 'marka' | 'ozellikler'>,
): string {
  if (ilan.fiyatGorusulur) {
    if (ilan.kategori === 'is-ilanlari') return 'Ücret görüşmede';
    if (ilan.kategori === 'hizmetler') return 'Teklif al';
    return 'Fiyat görüşülür';
  }
  const tutar = para(ilan.fiyat);
  if (ilan.kategori === 'is-ilanlari') {
    const donem = ilan.ozellikler?.['Ücret dönemi'] ?? 'Aylık';
    const donemler: Record<string, string> = {
      Saatlik: 'saat',
      Günlük: 'gün',
      Haftalık: 'hafta',
      Aylık: 'ay',
      Yıllık: 'yıl',
    };
    const ek = donemler[donem];
    return ek ? `${tutar} / ${ek}` : tutar;
  }
  return ilan.kategori === 'emlak' && ilan.marka === 'kiralik' ? `${tutar} / ay` : tutar;
}

export type Siralama = 'yeni' | 'artan' | 'azalan';

/** Teknik filtrelerde sayısal aralık kimlikleri de ilanların yazılmış değerleriyle eşleştirilir. */
export function ozellikFiltreEslesir(deger: string | undefined, secim: string): boolean {
  if (!deger) return false;
  const aralik = /^aralik:(\d+):(\d*)$/.exec(secim);
  if (!aralik) return deger === secim;
  // "Bilinmiyor", "%50 altında" veya "1 - 3 yıl" kesin bir ölçüm değildir.
  // Eşik sorgularına yalnızca tek bir sayısal ölçümü dahil et.
  const olcum = /^%?\s*(\d+(?:\.\d{3})*)\s*(?:%|km|cm|m²|saat)?$/i.exec(deger.trim());
  if (!olcum) return false;
  const sayi = Number(olcum[1]!.replace(/\./g, ''));
  const enAz = Number(aralik[1]);
  const enCok = aralik[2] ? Number(aralik[2]) : Number.POSITIVE_INFINITY;
  return Number.isFinite(sayi) && sayi >= enAz && sayi <= enCok;
}
export function ilanlariFiltrele(
  liste: Ilan[],
  filtre: {
    arama?: string;
    kategori?: string;
    altKategori?: string;
    marka?: string;
    model?: string;
    ozellikler?: Record<string, string>;
    konum?: string;
    enAz?: string;
    enCok?: string;
    durum?: string;
    takas?: boolean;
    siralama?: Siralama;
  },
) {
  const sorgu = aramaIcinDuzelt(filtre.arama ?? '');
  const sozcukler = sorgu.split(' ').filter(Boolean);
  const sonuc = liste.filter(
    (ilan) =>
      (!sorgu ||
        sozcukler.every((sozcuk) =>
          aramaIcinDuzelt(
            [
              ilan.baslik,
              ilan.aciklama,
              kategoriler.find((k) => k.id === ilan.kategori)?.ad ?? '',
              ilan.altKategori,
              ilan.marka,
              ilan.model,
              ...Object.entries(ilan.ozellikler ?? {}).flat(),
            ].join(' '),
          ).includes(sozcuk),
        )) &&
      (!filtre.kategori || ilan.kategori === filtre.kategori) &&
      (!filtre.altKategori || ilan.altKategori === filtre.altKategori) &&
      (!filtre.marka || ilan.marka === filtre.marka) &&
      (!filtre.model || ilan.model === filtre.model) &&
      konumEslesir(ilan.konum, filtre.konum) &&
      (!filtre.enAz || ilan.fiyat >= Number(filtre.enAz)) &&
      (!filtre.enCok || ilan.fiyat <= Number(filtre.enCok)) &&
      (!filtre.durum || ilan.durum === filtre.durum) &&
      (!filtre.takas || ilan.takas) &&
      Object.entries(filtre.ozellikler ?? {}).every(
        ([ad, deger]) => !deger || ozellikFiltreEslesir(ilan.ozellikler?.[ad], deger),
      ),
  );
  return filtre.siralama === 'artan'
    ? sonuc.sort((a, b) => a.fiyat - b.fiyat)
    : filtre.siralama === 'azalan'
      ? sonuc.sort((a, b) => b.fiyat - a.fiyat)
      : sonuc;
}

export function ilanYolu(ilan: Ilan) {
  return {
    pathname: '/ilan/[id]' as const,
    params: ilan.id.startsWith('yerel-') ? { id: 'yerel', kayit: ilan.id } : { id: ilan.id },
  };
}
