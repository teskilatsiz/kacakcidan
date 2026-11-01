import type { Metadata } from 'expo-router/server';
import type { Ilan } from '../veri/ilanlar';
import { kategoriler, type Kategori } from '../veri/anaKategoriler.ts';
import { bosSecim, kategoriYapisi, kesifSeciminiTamamla, type KesifSecimi } from '../veri/kategoriler.ts';
import type { SaticiProfili } from '../veri/saticilar';

export const siteAdresi = (process.env.EXPO_PUBLIC_SITE_URL || 'https://kacakcidan.netlify.app').replace(
  /\/$/,
  '',
);

export const paylasimGorseli = `${siteAdresi}/og-kacakcidan.png`;
export const anaSayfaBasligi = 'Kaçakçıdan | İkinci El Online İlan ve Alışveriş Sitesi';
export const anaSayfaAciklamasi =
  'İkinci el otomobil, emlak ve ürün ilanlarını ara; iş ve hizmet ilanlarını incele. Fiyat ve konuma göre filtrele, satıcıyla iletişime geç veya kendi ilanını ver.';
export const kesfetAciklamasi =
  'Otomobil, ev, iş ve ikinci el ürün ilanlarını keşfet. Marka, model, konum, fiyat ve kategoriye özel filtrelerle aradığını bul; ilan ayrıntılarını incele.';
export const nasilCalisirAciklamasi =
  'Kaçakçıdan’da ilan arama, ilan verme ve iletişim adımlarını öğren. Favorilerini kaydet, ilan sahibine soru sor, fotoğraf ve videoları incele; ilanını yönet.';

type SayfaBilgisi = { baslik: string; aciklama: string; yol: string; kisisel: boolean };
type AramaParametreleri = Record<string, string | string[] | undefined> | URLSearchParams;

function tekParametre(kaynak: AramaParametreleri, ad: string) {
  const veri =
    kaynak instanceof URLSearchParams
      ? kaynak.getAll(ad).length === 1
        ? kaynak.get(ad)
        : undefined
      : kaynak[ad];
  return typeof veri === 'string'
    ? veri
        .replace(/[\u0000-\u001f\u007f]/g, '')
        .trim()
        .replace(/\s+/g, ' ')
    : '';
}

function kisaAciklama(metin: string) {
  if (metin.length <= 160) return metin;
  return `${metin
    .slice(0, 157)
    .replace(/\s+\S*$/, '')
    .replace(/[.,;:]$/, '')}...`;
}

function ilanEtiketi(ad: string, kategori: string) {
  if (ad === 'Tüm') return 'Tüm ilanlar';
  if (/ilanları$/i.test(ad)) return ad;
  return `${ad}${kategori === 'is-ilanlari' ? ' iş' : ''} ilanları`;
}

/** Yalnızca katalogda doğrulanabilen kategori zinciri kanonik adrese taşınır. */
export function kesfetSayfaBilgisi(
  parametreler: AramaParametreleri = {},
): SayfaBilgisi & { secim: KesifSecimi } {
  const q = tekParametre(parametreler, 'q').slice(0, 100);
  const kategori = kategoriler.find(({ id }) => id === tekParametre(parametreler, 'kategori'));
  let secim = { ...bosSecim };
  if (kategori) {
    secim.kategori = kategori.id;
    const altKategori = tekParametre(parametreler, 'altKategori');
    const kokYapi = kategoriYapisi(kategori.id);
    const altGecerli = !altKategori || kokYapi.altKategoriler.some(({ id }) => id === altKategori);
    if (altGecerli) {
      secim.altKategori = altKategori;
      const yapi = kategoriYapisi(kategori.id, altKategori);
      const marka = tekParametre(parametreler, 'marka');
      const markaGecerli = !marka || yapi.markalar.some(({ id }) => id === marka);
      if (markaGecerli) {
        secim.marka = marka;
        const model = tekParametre(parametreler, 'model');
        const modeller = marka ? (yapi.modeller[marka] ?? []) : Object.values(yapi.modeller).flat();
        if (model && modeller.some(({ id }) => id === model)) secim.model = model;
        secim = kesifSeciminiTamamla([], secim);
        if (!secim.marka) secim.model = '';
      }
    }
  }
  const yapi = kategoriYapisi(secim.kategori as Kategori, secim.altKategori);
  const altAdi = yapi.altKategoriler.find(({ id }) => id === secim.altKategori)?.ad;
  const markaAdi = yapi.markalar.find(({ id }) => id === secim.marka)?.ad;
  const modelAdi = (yapi.modeller[secim.marka] ?? []).find(({ id }) => id === secim.model)?.ad;
  const birlestir = (ust: string | undefined, alt: string) =>
    !ust || alt.toLocaleLowerCase('tr-TR').startsWith(ust.toLocaleLowerCase('tr-TR')) ? alt : `${ust} ${alt}`;
  const ad = (
    modelAdi
      ? secim.kategori === 'is-ilanlari' || secim.kategori === 'hizmetler'
        ? modelAdi
        : birlestir(markaAdi, modelAdi)
      : markaAdi
        ? secim.kategori === 'is-ilanlari' || secim.kategori === 'hizmetler'
          ? markaAdi
          : birlestir(markaAdi, altAdi ?? kategori?.ad ?? '')
        : (altAdi ?? kategori?.ad ?? 'Tüm')
  ).replace(/\s*&\s*/g, ' ve ');
  const etiket = ilanEtiketi(ad, secim.kategori);
  const baslik = q ? (kategori ? `“${q}” - ${etiket}` : `“${q}” için ilanlar`) : etiket;
  const aciklama = q
    ? `${kategori ? `${ad} kategorisinde ` : ''}“${q}” aramasına ait ilanları incele. Konum, fiyat ve özelliklerle sonuçları daralt; ilan sahipleriyle iletişime geç.`
    : kategori
      ? `${etiket} için güncel seçenekleri Kaçakçıdan’da incele. Konum, fiyat ve ${secim.kategori === 'is-ilanlari' ? 'çalışma biçimine' : 'kategoriye özel özelliklere'} göre ara; ilan ayrıntılarını gör.`
      : kesfetAciklamasi;
  const sorgu = new URLSearchParams();
  for (const alan of ['kategori', 'altKategori', 'marka', 'model'] as const)
    if (secim[alan]) sorgu.set(alan, secim[alan]);
  if (q) sorgu.set('q', q);
  return {
    baslik: `${baslik} | Kaçakçıdan`,
    aciklama: kisaAciklama(aciklama),
    yol: `/kesfet${sorgu.size ? `?${sorgu}` : ''}`,
    kisisel: !!q,
    secim,
  };
}

export function ilanSayfaBasligi(ilan: Pick<Ilan, 'baslik'>) {
  return `${ilan.baslik} | Kaçakçıdan`;
}

export function saticiSayfaBilgisi(satici?: Pick<SaticiProfili, 'id' | 'ad'>, yerel = false): SayfaBilgisi {
  const kisisel = yerel || !satici || satici.id.startsWith('uye-');
  return {
    baslik: satici ? `${satici.ad} - İlanları | Kaçakçıdan` : 'Satıcı profili | Kaçakçıdan',
    aciklama: satici
      ? `${satici.ad} satıcısının yayındaki ilanlarını ve profil bilgilerini incele.`
      : 'Satıcının yayındaki ilanları ve profil bilgileri.',
    yol: `/satici/${kisisel ? 'yerel' : satici.id}`,
    kisisel,
  };
}

/** Uzun ilan açıklamalarını kelimeyi bölmeden arama özeti haline getirir. */
export function ilanAciklamasi(
  ilan: Pick<Ilan, 'baslik' | 'konum' | 'durum' | 'aciklama'> & Partial<Pick<Ilan, 'kategori'>>,
) {
  const urunDegil =
    ilan.kategori === 'is-ilanlari' || ilan.kategori === 'emlak' || ilan.kategori === 'hizmetler';
  const durum = urunDegil ? '' : `, ${ilan.durum.toLocaleLowerCase('tr')}`;
  const metin = `${ilan.baslik}. ${ilan.konum}${durum}. ${ilan.aciklama}`.replace(/\s+/g, ' ').trim();
  if (metin.length <= 160) return metin;
  return `${metin
    .slice(0, 157)
    .replace(/\s+\S*$/, '')
    .replace(/[.,;:]$/, '')}...`;
}

export function sayfaMetasi(baslik: string, aciklama: string, yol = '/', kisisel = false): Metadata {
  const adres = `${siteAdresi}${yol}`;
  return {
    title: baslik,
    description: aciklama,
    applicationName: 'Kaçakçıdan',
    robots: { index: !kisisel && process.env.EXPO_PUBLIC_NOINDEX !== 'true', follow: true },
    alternates: { canonical: adres },
    openGraph: {
      title: baslik,
      description: aciklama,
      url: adres,
      siteName: 'Kaçakçıdan',
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: baslik,
      description: aciklama,
    },
  };
}
