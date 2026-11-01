import type { Kayit } from './PazarBaglami';
import type { ParolaKaydi } from './parola.types';
import type { Ilan } from '../veri/ilanlar';
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
};

export function bosKayit(ad = ''): Kayit {
  return { favoriler: [], eklenenler: [], mesajlar: {}, profil: { ad, konum: '', hakkinda: '' }, konum: '' };
}

export function ilkDepo(misafir = bosKayit()): HesapDeposu {
  return { surum: 2, misafir, hesaplar: [], aktifHesap: null, etkilesimler: bosEtkilesimKaydi() };
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

export function ilanKaydiniGuncelle(depo: HesapDeposu, hesapId: string, ilan: Ilan): HesapDeposu | undefined {
  if (!hesapId || depo.aktifHesap !== hesapId || !depo.hesaplar.some((hesap) => hesap.id === hesapId)) return;
  const kayit = aktifKayit(depo);
  const onceki = kayit.eklenenler.find((kayitli) => kayitli.id === ilan.id);
  if (!onceki) return;
  return kaydiDegistir(depo, (eski) => ({
    ...eski,
    eklenenler: eski.eklenenler.map((kayitli) =>
      kayitli.id === ilan.id
        ? {
            ...ilan,
            id: onceki.id,
            ...((onceki.numara ?? depo.etkilesimler.ilanNumaralari[onceki.id])
              ? { numara: onceki.numara ?? depo.etkilesimler.ilanNumaralari[onceki.id] }
              : {}),
            saticiId: hesapId,
            zaman: onceki.zaman,
            oneCikan: onceki.oneCikan,
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
        ...ilan,
        numara: etkilesimler.ilanNumaralari[ilan.id],
        saticiId: hesapId,
        benim: true,
        satici: eski.profil.ad,
      },
      ...eski.eklenenler,
    ],
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
        ['altKategori', 'marka', 'model', 'video'].every(
          (k) => i[k] === undefined || typeof i[k] === 'string',
        ) &&
        (i.fotografler === undefined ||
          (Array.isArray(i.fotografler) && i.fotografler.every((f) => typeof f === 'string'))) &&
        (i.ozellikler === undefined ||
          (nesne(i.ozellikler) && Object.values(i.ozellikler).every((v) => typeof v === 'string'))),
    ) &&
    nesne(p) &&
    ['ad', 'konum', 'hakkinda'].every((k) => typeof p[k] === 'string') &&
    (p.fotograf === undefined || typeof p.fotograf === 'string') &&
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
      const hesaplar = veri.hesaplar.filter(hesapGecerli);
      return {
        surum: 2,
        misafir: veri.misafir,
        hesaplar,
        etkilesimler: etkilesimleriOku(veri.etkilesimler),
        aktifHesap: hesaplar.some((h) => h.id === veri.aktifHesap) ? String(veri.aktifHesap) : null,
      };
    }
  } catch {
    /* Önceki kayıt okunabiliyorsa onu koru. */
  }
  try {
    const eski: unknown = eskiHam ? JSON.parse(eskiHam) : null;
    if (kayitGecerli(eski)) return ilkDepo(eski);
  } catch {
    /* Bozuk bir kayıt uygulamanın açılmasını engellemez. */
  }
  return ilkDepo();
}
