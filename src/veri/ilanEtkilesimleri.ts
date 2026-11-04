export type IlanSorusu = {
  id: string;
  ilanId: string;
  soranId: string;
  soranAd: string;
  soru: string;
  tarih: string;
  cevap?: string;
  cevapTarihi?: string;
  herkeseAcik: boolean;
};

export type BildirimTuru =
  'soru' | 'cevap' | 'yayin' | 'duzenleme' | 'kaldirma' | 'favori' | 'fiyat' | 'alisveris' | 'degerlendirme';
export type Bildirim = {
  id: string;
  hesapId: string;
  ilanId: string;
  soruId?: string;
  saticiId?: string;
  alisverisId?: string;
  tur: BildirimTuru;
  baslik: string;
  aciklama: string;
  tarih: string;
  okundu: boolean;
};

export type EtkilesimKaydi = {
  ilanNumaralari: Record<string, string>;
  sonIlanNumarasi: number;
  sorular: IlanSorusu[];
  bildirimler: Bildirim[];
  goruntulenmeler: Record<string, { sayi: number; sonZiyaretler: Record<string, string> }>;
};

export const baslangicIlanNumarasi = 1074000000;

export function bosEtkilesimKaydi(): EtkilesimKaydi {
  return {
    ilanNumaralari: {},
    sonIlanNumarasi: baslangicIlanNumarasi,
    sorular: [],
    bildirimler: [],
    goruntulenmeler: {},
  };
}

function nesne(veri: unknown): veri is Record<string, unknown> {
  return !!veri && typeof veri === 'object' && !Array.isArray(veri);
}

export function etkilesimleriOku(veri: unknown): EtkilesimKaydi {
  const bos = bosEtkilesimKaydi();
  if (!nesne(veri)) return bos;
  const numaraKayitlari: [string, string][] = [];
  const kullanilan = new Set<string>();
  if (nesne(veri.ilanNumaralari)) {
    for (const [id, numara] of Object.entries(veri.ilanNumaralari)) {
      if (typeof numara !== 'string' || !/^\d{10,14}$/.test(numara) || kullanilan.has(numara)) continue;
      numaraKayitlari.push([id, numara]);
      kullanilan.add(numara);
    }
  }
  const sorular = Array.isArray(veri.sorular)
    ? veri.sorular.filter(
        (s): s is IlanSorusu =>
          nesne(s) &&
          ['id', 'ilanId', 'soranId', 'soranAd', 'soru', 'tarih'].every((k) => typeof s[k] === 'string') &&
          Number.isFinite(Date.parse(String(s.tarih))) &&
          typeof s.herkeseAcik === 'boolean' &&
          (s.cevap === undefined || typeof s.cevap === 'string') &&
          (s.cevapTarihi === undefined ||
            (typeof s.cevapTarihi === 'string' && Number.isFinite(Date.parse(s.cevapTarihi)))),
      )
    : [];
  const turler: BildirimTuru[] = [
    'soru',
    'cevap',
    'yayin',
    'duzenleme',
    'kaldirma',
    'favori',
    'fiyat',
    'alisveris',
    'degerlendirme',
  ];
  const bildirimler = Array.isArray(veri.bildirimler)
    ? veri.bildirimler.filter(
        (b): b is Bildirim =>
          nesne(b) &&
          ['id', 'hesapId', 'ilanId', 'baslik', 'aciklama', 'tarih'].every((k) => typeof b[k] === 'string') &&
          Number.isFinite(Date.parse(String(b.tarih))) &&
          turler.includes(b.tur as BildirimTuru) &&
          typeof b.okundu === 'boolean' &&
          ['soruId', 'saticiId', 'alisverisId'].every(
            (alan) => b[alan] === undefined || typeof b[alan] === 'string',
          ),
      )
    : [];
  const numaralar = Object.fromEntries(numaraKayitlari);
  const goruntulenmeKayitlari: [string, EtkilesimKaydi['goruntulenmeler'][string]][] = [];
  if (nesne(veri.goruntulenmeler)) {
    for (const [id, kayit] of Object.entries(veri.goruntulenmeler)) {
      if (
        !nesne(kayit) ||
        typeof kayit.sayi !== 'number' ||
        !Number.isSafeInteger(kayit.sayi) ||
        kayit.sayi < 0
      )
        continue;
      goruntulenmeKayitlari.push([
        id,
        {
          sayi: kayit.sayi,
          sonZiyaretler: nesne(kayit.sonZiyaretler)
            ? (Object.fromEntries(
                Object.entries(kayit.sonZiyaretler).filter(([, tarih]) => typeof tarih === 'string'),
              ) as Record<string, string>)
            : {},
        },
      ]);
    }
  }
  return {
    ilanNumaralari: numaralar,
    sonIlanNumarasi: Math.max(
      baslangicIlanNumarasi,
      ...Object.values(numaralar).map(Number),
      typeof veri.sonIlanNumarasi === 'number' && Number.isSafeInteger(veri.sonIlanNumarasi)
        ? veri.sonIlanNumarasi
        : 0,
    ),
    sorular,
    bildirimler,
    goruntulenmeler: Object.fromEntries(goruntulenmeKayitlari),
  };
}

export function numaralariTamamla(kayit: EtkilesimKaydi, kimlikler: string[]): EtkilesimKaydi {
  let son = kayit.sonIlanNumarasi;
  const eksikler = [...new Set(kimlikler)].filter((id) => !Object.hasOwn(kayit.ilanNumaralari, id));
  return eksikler.length === 0
    ? kayit
    : {
        ...kayit,
        ilanNumaralari: {
          ...kayit.ilanNumaralari,
          ...Object.fromEntries(eksikler.map((id) => [id, String(++son)])),
        },
        sonIlanNumarasi: son,
      };
}

export function gorunurSorular(sorular: IlanSorusu[], hesapId: string | null, sahipOlduklari: Set<string>) {
  return sorular.filter(
    (soru) =>
      (!!soru.cevap && soru.herkeseAcik) || soru.soranId === hesapId || sahipOlduklari.has(soru.ilanId),
  );
}

export function goruntulemeKaydet(kayit: EtkilesimKaydi, ilanId: string, ziyaretci: string, gun: string) {
  const onceki = Object.hasOwn(kayit.goruntulenmeler, ilanId)
    ? kayit.goruntulenmeler[ilanId]!
    : { sayi: 0, sonZiyaretler: {} };
  if (onceki.sonZiyaretler[ziyaretci] === gun) return kayit;
  return {
    ...kayit,
    goruntulenmeler: {
      ...kayit.goruntulenmeler,
      [ilanId]: { sayi: onceki.sayi + 1, sonZiyaretler: { ...onceki.sonZiyaretler, [ziyaretci]: gun } },
    },
  };
}

export const vitrinSorulari: IlanSorusu[] = [
  {
    id: 'soru-iphone-kutu',
    ilanId: 'iphone-15-pro',
    soranId: 'ziyaretci-deniz',
    soranAd: 'Deniz A.',
    soru: 'Kutusu ve faturası duruyor mu, pil sağlığı nedir?',
    tarih: '2026-10-28T11:20:00.000Z',
    cevap: 'Kutusu ve şarj kablosu duruyor. Pil sağlığı %89. Gelip telefonu kontrol ederek alabilirsin.',
    cevapTarihi: '2026-10-28T12:05:00.000Z',
    herkeseAcik: true,
  },
  {
    id: 'soru-ps-kol',
    ilanId: 'playstation-5',
    soranId: 'ziyaretci-cem',
    soranAd: 'Cem K.',
    soru: 'Kol orijinal mi? Deneyerek alabilir miyim?',
    tarih: '2026-10-29T09:15:00.000Z',
    cevap: 'Bir orijinal DualSense kol ile veriyorum. Elden teslimde birlikte deneyebiliriz.',
    cevapTarihi: '2026-10-29T10:05:00.000Z',
    herkeseAcik: true,
  },
  {
    id: 'soru-fuji-shutter',
    ilanId: 'fujifilm-x100v',
    soranId: 'ziyaretci-ece',
    soranAd: 'Ece D.',
    soru: 'Shutter sayısı kaç? Lens üzerinde çizik var mı?',
    tarih: '2026-10-30T10:00:00.000Z',
    cevap: 'Deklanşör sayısı 8.400. Lens ve vizör temiz. Beyoğlu’nda deneyebilirsin.',
    cevapTarihi: '2026-10-30T11:15:00.000Z',
    herkeseAcik: true,
  },
];
