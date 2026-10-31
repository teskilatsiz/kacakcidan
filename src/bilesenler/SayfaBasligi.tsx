import { useGlobalSearchParams, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { usePazar } from '../durum/Pazar';
import {
  anaSayfaAciklamasi,
  anaSayfaBasligi,
  ilanAciklamasi,
  kesfetAciklamasi,
  nasilCalisirAciklamasi,
  siteAdresi,
} from '../tasarim/seo';
import { para } from '../veri/ilanlar';

const sayfalar: Record<string, [string, string, boolean?]> = {
  '/': [anaSayfaBasligi, anaSayfaAciklamasi],
  '/kesfet': ['İlanları keşfet | Kaçakçıdan', kesfetAciklamasi],
  '/favoriler': ['Favorilerim | Kaçakçıdan', 'Aklının kaldığı keşifler bir arada.', true],
  '/mesajlar': ['Mesajlarım | Kaçakçıdan', 'İlanlar hakkında doğrudan konuş.', true],
  '/profil': ['Profilim | Kaçakçıdan', 'İlanlarını, favorilerini ve profil bilgilerini yönet.', true],
  '/ayarlar': ['Hesap ayarları | Kaçakçıdan', 'Hesap ve iletişim bilgilerini yönet.', true],
  '/giris': ['Giriş yap | Kaçakçıdan', 'Hesabına giriş yap, kaldığın yerden devam et.', true],
  '/kayit': [
    'Hesap oluştur | Kaçakçıdan',
    'İlanlarını, favorilerini ve mesajlarını tek hesapta topla.',
    true,
  ],
  '/ilan-ver': ['İlan ver | Kaçakçıdan', 'Kullanmadığın eşyalar yeniden değerlensin.', true],
  '/ilan-duzenle': ['İlanı düzenle | Kaçakçıdan', 'İlan bilgilerini ve fotoğraflarını güncelle.', true],
  '/nasil-calisir': ['Nasıl çalışır? | Kaçakçıdan', nasilCalisirAciklamasi],
};

/** İlk HTML generateMetadata'dan gelir; web geçişlerinde mevcut etiketler güncellenir. */
export function SayfaBasligi() {
  const yol = usePathname();
  const { q, kayit } = useGlobalSearchParams<{ q?: string; kayit?: string }>();
  const { tumIlanlar } = usePazar();
  const id = typeof kayit === 'string' && yol === '/ilan/yerel' ? kayit : yol.split('/').at(-1);
  const ilan = yol.startsWith('/ilan/') ? tumIlanlar.find((i) => i.id === id) : undefined;
  const [varsayilanBaslik, varsayilanAciklama, kisisel] = sayfalar[yol] || [
    'Sayfa bulunamadı | Kaçakçıdan',
    'Bu sayfa burada değil.',
    true,
  ];
  const baslik = ilan
    ? `${ilan.baslik} - ${para(ilan.fiyat)} | Kaçakçıdan`
    : yol === '/kesfet' && typeof q === 'string' && q.trim()
      ? `“${q}” için ilanlar | Kaçakçıdan`
      : varsayilanBaslik;
  const aciklama = ilan ? ilanAciklamasi(ilan) : varsayilanAciklama;
  const adres = `${siteAdresi}${yol}`;
  const noindex = (kisisel && !ilan) || yol === '/ilan/yerel' || process.env.EXPO_PUBLIC_NOINDEX === 'true';
  const robotlar = noindex ? 'noindex, follow' : 'index, follow';

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.title = baslik;

    const guncelle = (secici: string, etiket: 'meta' | 'link', nitelikler: Record<string, string>) => {
      const [mevcut, ...yinelenenler] = document.head.querySelectorAll<HTMLElement>(secici);
      const eleman = mevcut || document.createElement(etiket);
      for (const [ad, deger] of Object.entries(nitelikler)) eleman.setAttribute(ad, deger);
      if (!mevcut) document.head.appendChild(eleman);
      for (const yinelenen of yinelenenler) yinelenen.remove();
    };

    for (const [ad, content] of Object.entries({
      description: aciklama,
      robots: robotlar,
      'twitter:title': baslik,
      'twitter:description': aciklama,
    })) {
      guncelle(`meta[name="${ad}"]`, 'meta', { name: ad, content });
    }
    for (const [property, content] of Object.entries({
      'og:title': baslik,
      'og:description': aciklama,
      'og:url': adres,
    })) {
      guncelle(`meta[property="${property}"]`, 'meta', { property, content });
    }
    guncelle('link[rel="canonical"]', 'link', { rel: 'canonical', href: adres });
  }, [baslik, aciklama, robotlar, adres]);

  if (Platform.OS === 'web') return null;
  return (
    <Head>
      <title>{baslik}</title>
      <meta name="description" content={aciklama} />
      <meta name="robots" content={robotlar} />
      <meta property="og:title" content={baslik} />
      <meta property="og:description" content={aciklama} />
      <link rel="canonical" href={adres} />
      <meta property="og:url" content={adres} />
      <meta name="twitter:title" content={baslik} />
      <meta name="twitter:description" content={aciklama} />
    </Head>
  );
}
