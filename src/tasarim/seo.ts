import type { Metadata } from 'expo-router/server';
import type { Ilan } from '../veri/ilanlar';

export const siteAdresi = (process.env.EXPO_PUBLIC_SITE_URL || 'https://kacakcidan.netlify.app').replace(
  /\/$/,
  '',
);

export const paylasimGorseli = `${siteAdresi}/og-kacakcidan.png`;
export const anaSayfaBasligi = 'Kaçakçıdan | İkinci el alışveriş pazaryeri';
export const anaSayfaAciklamasi =
  'Telefon, bilgisayar, konsol ve daha pek çok ikinci el ilanını Kaçakçıdan’da bul. Fiyatları karşılaştır, satıcıya mesaj gönder, kullanmadıklarını satışa çıkar.';
export const kesfetAciklamasi =
  'İkinci el telefon, bilgisayar, konsol ve daha fazlasını keşfet. Kategori, marka, model, konum ve fiyat filtreleriyle ilanları bul, satıcıyla iletişime geç.';
export const nasilCalisirAciklamasi =
  'Kaçakçıdan’da ikinci el alışverişin adımlarını öğren. İlanları incele, satıcıya mesaj gönder, favorilerini sakla ya da kullanmadığın eşyalar için ilan oluştur.';

/** Uzun ilan açıklamalarını kelimeyi bölmeden arama özeti haline getirir. */
export function ilanAciklamasi(ilan: Pick<Ilan, 'baslik' | 'konum' | 'durum' | 'aciklama'>) {
  const metin = `${ilan.baslik}. ${ilan.konum}, ${ilan.durum.toLocaleLowerCase('tr')}. ${ilan.aciklama}`
    .replace(/\s+/g, ' ')
    .trim();
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
