import type { Kayit } from './PazarBaglami';
import type { ParolaKaydi } from './parola.types';
import type { Ilan } from '../veri/ilanlar';
import {
  bosDegerlendirmeKaydi,
  degerlendirmeKaydiniOku,
  type DegerlendirmeKaydi,
} from '../veri/saticiDegerlendirmeleri.ts';
import { telefonuNormallestir } from '../veri/telefon.ts';
import { guvenliAlisverisAyariniTemizle } from '../veri/guvenliAlisveris.ts';
import { modelOzellikleriniUygula } from '../veri/modelOzellikleri.ts';
import {
  ilanKaldirmaNedenleri,
  sikayetNedenleri,
  type IlanKaldirmaNedeni,
  type IlanSikayeti,
} from '../veri/ilanYonetimi.ts';
import {
  bosEtkilesimKaydi,
  etkilesimleriOku,
  numaralariTamamla,
  type EtkilesimKaydi,
} from '../veri/ilanEtkilesimleri.ts';

export type Hesap = { id: string; eposta: string; parola: ParolaKaydi; kayit: Kayit };
export type HesapDeposu = {
  surum: 2;
  misafir: Kayit;
  hesaplar: Hesap[];
  aktifHesap: string | null;
  etkilesimler: EtkilesimKaydi;
  sikayetler: IlanSikayeti[];
  degerlendirmeKaydi: DegerlendirmeKaydi;
};

export function iletisimiDuzenle<T extends { telefon?: string; telefonGoster?: boolean }>(veri: T): T {
  if (veri.telefon === undefined && veri.telefonGoster === undefined) return veri;
  const { telefon: _telefon, telefonGoster: _izin, ...diger } = veri;
  const telefon = telefonuNormallestir(veri.telefon);
  return {
    ...diger,
    ...(telefon ? { telefon } : {}),
    telefonGoster: !!telefon && veri.telefonGoster === true,
  } as T;
}

function kaydiTemizle(kayit: Kayit): Kayit {
  return {
    ...kayit,
    profil: iletisimiDuzenle(kayit.profil),
    eklenenler: kayit.eklenenler.map(ilanBilgileriniTemizle),
  };
}

function ilanBilgileriniTemizle(ilan: Ilan): Ilan {
  const oncekiOzellikler = ilan.ozellikler ?? {};
  const ozellikler = modelOzellikleriniUygula(ilan, oncekiOzellikler);
  const temiz = iletisimiDuzenle(ozellikler === oncekiOzellikler ? ilan : { ...ilan, ozellikler });
  // Eski kayıtlardaki fotoğraflı durum raporu artık kullanılmıyor.
  const { durumKanitlari: _kanitlar, guvenliAlisveris: _teslimat, ...diger } = temiz;
  const guvenliAlisveris = guvenliAlisverisAyariniTemizle(temiz);
  return { ...diger, ...(guvenliAlisveris ? { guvenliAlisveris } : {}) };
}

export function bosKayit(ad = ''): Kayit {
  return { favoriler: [], eklenenler: [], mesajlar: {}, profil: { ad, konum: '', hakkinda: '' }, konum: '' };
}

export function ilkDepo(misafir = bosKayit()): HesapDeposu {
  return {
    surum: 2,
    misafir,
    hesaplar: [],
    aktifHesap: null,
    etkilesimler: bosEtkilesimKaydi(),
    sikayetler: [],
    degerlendirmeKaydi: bosDegerlendirmeKaydi(),
  };
}

export function aktifKayit(depo: HesapDeposu): Kayit {
  return depo.hesaplar.find((hesap) => hesap.id === depo.aktifHesap)?.kayit ?? depo.misafir;
}

export function kaydiDegistir(depo: HesapDeposu, guncelle: (kayit: Kayit) => Kayit): HesapDeposu {
  if (!depo.aktifHesap) return { ...depo, misafir: guncelle(depo.misafir) };
  return {
    ...depo,
    hesaplar: depo.hesaplar.map((hesap) =>
      hesap.id === depo.aktifHesap ? { ...hesap, kayit: guncelle(hesap.kayit) } : hesap,
    ),
  };
}

export function ilanKaydiniGuncelle(
  depo: HesapDeposu,
  hesapId: string,
  ilan: Ilan,
  oneCikar = false,
): HesapDeposu | undefined {
  if (!hesapId || depo.aktifHesap !== hesapId || !depo.hesaplar.some((hesap) => hesap.id === hesapId)) return;
  const kayit = aktifKayit(depo);
  const onceki = kayit.eklenenler.find((kayitli) => kayitli.id === ilan.id);
  if (!onceki) return;
  return kaydiDegistir(depo, (eski) => ({
    ...eski,
    eklenenler: eski.eklenenler.map((kayitli) =>
      kayitli.id === ilan.id
        ? {
            ...ilanBilgileriniTemizle(ilan),
            id: onceki.id,
            ...((onceki.numara ?? depo.etkilesimler.ilanNumaralari[onceki.id])
              ? { numara: onceki.numara ?? depo.etkilesimler.ilanNumaralari[onceki.id] }
              : {}),
            saticiId: hesapId,
            yayinDurumu: onceki.yayinDurumu ?? 'yayinda',
            ...(onceki.kaldirmaNedeni ? { kaldirmaNedeni: onceki.kaldirmaNedeni } : {}),
            zaman: onceki.zaman,
            oneCikan: oneCikar || onceki.oneCikan,
            satici: eski.profil.ad,
            benim: true,
          }
        : kayitli,
    ),
  }));
}

export function ilanKaydiniEkle(depo: HesapDeposu, hesapId: string, ilan: Ilan): HesapDeposu | undefined {
  if (!hesapId || depo.aktifHesap !== hesapId || !depo.hesaplar.some((hesap) => hesap.id === hesapId)) return;
  if (depo.hesaplar.some((hesap) => hesap.kayit.eklenenler.some((kayit) => kayit.id === ilan.id))) return;
  const etkilesimler = numaralariTamamla(depo.etkilesimler, [ilan.id]);
  return kaydiDegistir({ ...depo, etkilesimler }, (eski) => ({
    ...eski,
    eklenenler: [
      {
        ...ilanBilgileriniTemizle(ilan),
        numara: etkilesimler.ilanNumaralari[ilan.id],
        saticiId: hesapId,
        yayinDurumu: 'yayinda',
        benim: true,
        satici: eski.profil.ad,
      },
      ...eski.eklenenler,
    ],
  }));
}

export function ilanYayininiDegistir(
  depo: HesapDeposu,
  hesapId: string,
  ilanId: string,
  neden?: IlanKaldirmaNedeni,
): HesapDeposu | undefined {
  if (!hesapId || depo.aktifHesap !== hesapId) return;
  const ilan = aktifKayit(depo).eklenenler.find((kayit) => kayit.id === ilanId);
  if (!ilan || (neden && !ilanKaldirmaNedenleri.some((kayit) => kayit.id === neden))) return;
  if ((!neden && ilan.yayinDurumu !== 'kaldirildi') || (neden && ilan.yayinDurumu === 'kaldirildi')) return;
  return kaydiDegistir(depo, (kayit) => ({
    ...kayit,
    eklenenler: kayit.eklenenler.map((kayitli) => {
      if (kayitli.id !== ilanId) return kayitli;
      const { kaldirmaNedeni: _oncekiNeden, ...bilgiler } = kayitli;
      return {
        ...bilgiler,
        yayinDurumu: neden ? 'kaldirildi' : 'yayinda',
        ...(neden ? { kaldirmaNedeni: neden } : {}),
        oneCikan: neden ? false : !!kayitli.oneCikan,
      };
    }),
  }));
}

function nesne(veri: unknown): veri is Record<string, unknown> {
  return !!veri && typeof veri === 'object' && !Array.isArray(veri);
}

export function kayitGecerli(veri: unknown): veri is Kayit {
  if (!nesne(veri)) return false;
  const p = veri.profil;
  return (
    Array.isArray(veri.favoriler) &&
    veri.favoriler.every((id) => typeof id === 'string') &&
    Array.isArray(veri.eklenenler) &&
    veri.eklenenler.every(
      (i) =>
        nesne(i) &&
        ['id', 'baslik', 'kategori', 'gorsel', 'konum', 'zaman', 'satici', 'durum', 'aciklama'].every(
          (k) => typeof i[k] === 'string',
        ) &&
        typeof i.fiyat === 'number' &&
        Number.isFinite(i.fiyat) &&
        ['altKategori', 'marka', 'model', 'video', 'telefon'].every(
          (k) => i[k] === undefined || typeof i[k] === 'string',
        ) &&
        (i.telefonGoster === undefined || typeof i.telefonGoster === 'boolean') &&
        (i.yayinDurumu === undefined || ['yayinda', 'kaldirildi'].includes(String(i.yayinDurumu))) &&
        (i.kaldirmaNedeni === undefined ||
          ilanKaldirmaNedenleri.some((neden) => neden.id === i.kaldirmaNedeni)) &&
        (i.fotografler === undefined ||
          (Array.isArray(i.fotografler) && i.fotografler.every((f) => typeof f === 'string'))) &&
        (i.ozellikler === undefined ||
          (nesne(i.ozellikler) && Object.values(i.ozellikler).every((v) => typeof v === 'string'))),
    ) &&
    nesne(p) &&
    ['ad', 'konum', 'hakkinda'].every((k) => typeof p[k] === 'string') &&
    (p.fotograf === undefined || typeof p.fotograf === 'string') &&
    (p.telefon === undefined || typeof p.telefon === 'string') &&
    (p.telefonGoster === undefined || typeof p.telefonGoster === 'boolean') &&
    typeof veri.konum === 'string' &&
    nesne(veri.mesajlar) &&
    Object.values(veri.mesajlar).every(
      (liste) =>
        Array.isArray(liste) &&
        liste.every(
          (m) =>
            nesne(m) &&
            typeof m.id === 'string' &&
            typeof m.yazi === 'string' &&
            typeof m.saat === 'string' &&
            typeof m.benim === 'boolean',
        ),
    )
  );
}

function hesapGecerli(veri: unknown): veri is Hesap {
  return (
    nesne(veri) &&
    typeof veri.id === 'string' &&
    !!veri.id &&
    typeof veri.eposta === 'string' &&
    nesne(veri.parola) &&
    typeof veri.parola.tuz === 'string' &&
    /^[a-f0-9]{32}$/.test(veri.parola.tuz) &&
    typeof veri.parola.ozet === 'string' &&
    /^[a-f0-9]{64}$/.test(veri.parola.ozet) &&
    kayitGecerli(veri.kayit)
  );
}

export function depoyuOku(ham: string | null, eskiHam: string | null): HesapDeposu {
  try {
    const veri: unknown = ham ? JSON.parse(ham) : null;
    if (nesne(veri) && veri.surum === 2 && kayitGecerli(veri.misafir) && Array.isArray(veri.hesaplar)) {
      const hesaplar = veri.hesaplar
        .filter(hesapGecerli)
        .map((hesap) => ({ ...hesap, kayit: kaydiTemizle(hesap.kayit) }));
      return {
        surum: 2,
        misafir: kaydiTemizle(veri.misafir),
        hesaplar,
        degerlendirmeKaydi: degerlendirmeKaydiniOku(
          veri.degerlendirmeKaydi,
          new Set(hesaplar.map((hesap) => hesap.id)),
        ),
        etkilesimler: etkilesimleriOku(veri.etkilesimler),
        sikayetler: Array.isArray(veri.sikayetler)
          ? veri.sikayetler.filter(
              (s): s is IlanSikayeti =>
                nesne(s) &&
                ['id', 'ilanId', 'hesapId', 'aciklama', 'tarih'].every(
                  (alan) => typeof s[alan] === 'string',
                ) &&
                sikayetNedenleri.includes(s.neden as IlanSikayeti['neden']) &&
                Number.isFinite(Date.parse(String(s.tarih))),
            )
          : [],
        aktifHesap: hesaplar.some((h) => h.id === veri.aktifHesap) ? String(veri.aktifHesap) : null,
      };
    }
  } catch {
    /* Önceki kayıt okunabiliyorsa onu koru. */
  }
  try {
    const eski: unknown = eskiHam ? JSON.parse(eskiHam) : null;
    if (kayitGecerli(eski)) return ilkDepo(kaydiTemizle(eski));
  } catch {
    /* Bozuk bir kayıt uygulamanın açılmasını engellemez. */
  }
  return ilkDepo();
}
