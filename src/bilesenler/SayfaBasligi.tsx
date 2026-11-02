import { useGlobalSearchParams, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { usePazar } from '../durum/Pazar';
import {
  anaSayfaAciklamasi,
  anaSayfaBasligi,
  ilanAciklamasi,
  ilanSayfaBasligi,
  ilanPaylasimGorseli,
  ilanUrunVerisi,
  kesfetSayfaBilgisi,
  kategoriSayfaBilgisi,
  saticiSayfaBilgisi,
  nasilCalisirAciklamasi,
  siteAdresi,
} from '../tasarim/seo';

const sayfalar: Record<string, [string, string, boolean?]> = {
  '/': [anaSayfaBasligi, anaSayfaAciklamasi],
  '/favoriler': ['Favorilerim | Kaçakçıdan', 'Aklının kaldığı keşifler bir arada.', true],
  '/mesajlar': ['Mesajlarım | Kaçakçıdan', 'İlanlar hakkında doğrudan konuş.', true],
  '/bildirimler': [
    'Bildirimler | Kaçakçıdan',
    'İlanlarına gelen soruları, cevapları ve güncellemeleri takip et.',
    true,
  ],
  '/profil': ['Profilim | Kaçakçıdan', 'İlanlarını, favorilerini ve profil bilgilerini yönet.', true],
  '/ayarlar': ['Hesap ayarları | Kaçakçıdan', 'Hesap ve iletişim bilgilerini yönet.', true],
  '/giris': ['Giriş yap | Kaçakçıdan', 'Hesabına giriş yap, kaldığın yerden devam et.', true],
  '/kayit': [
    'Hesap oluştur | Kaçakçıdan',
    'İlanlarını, favorilerini ve mesajlarını tek hesapta topla.',
    true,
  ],
  '/ilan-ver': ['İlan ver | Kaçakçıdan', 'Ürün, araç, emlak, iş veya hizmet ilanını oluştur.', true],
  '/ilan-duzenle': ['İlanı düzenle | Kaçakçıdan', 'İlan bilgilerini ve fotoğraflarını güncelle.', true],
  '/nasil-calisir': ['Nasıl çalışır? | Kaçakçıdan', nasilCalisirAciklamasi],
};

/** İlk HTML generateMetadata'dan gelir; web geçişlerinde mevcut etiketler güncellenir. */
export function SayfaBasligi() {
  const yol = usePathname();
  const parametreler = useGlobalSearchParams();
  const { tumIlanlar, eklenenler, saticilar, oturum } = usePazar();
  const kayit = typeof parametreler.kayit === 'string' ? parametreler.kayit : undefined;
  const hesap = typeof parametreler.hesap === 'string' ? parametreler.hesap : undefined;
  const id = kayit && yol === '/ilan/yerel' ? kayit : yol.split('/').at(-1);
  const ilan = yol.startsWith('/ilan/')
    ? (tumIlanlar.find((i) => i.id === id) ?? (oturum ? eklenenler.find((i) => i.id === id) : undefined))
    : undefined;
  const satici = yol.startsWith('/satici/') ? saticilar.find((s) => s.id === (hesap ?? id)) : undefined;
  const [varsayilanBaslik, varsayilanAciklama, kisisel] = sayfalar[yol] || [
    'Sayfa bulunamadı | Kaçakçıdan',
    'Bu sayfa burada değil.',
    true,
  ];
  const bilgi = ilan
    ? {
        baslik: ilanSayfaBasligi(ilan),
        aciklama: ilanAciklamasi(ilan),
        yol: `/ilan/${yol === '/ilan/yerel' ? 'yerel' : ilan.id}`,
        kisisel: yol === '/ilan/yerel',
      }
    : yol === '/kesfet'
      ? kesfetSayfaBilgisi(parametreler)
      : yol.startsWith('/kategori/')
        ? kategoriSayfaBilgisi(yol.slice('/kategori/'.length), parametreler)
        : yol.startsWith('/satici/')
          ? saticiSayfaBilgisi(satici, yol === '/satici/yerel' || !!hesap)
          : { baslik: varsayilanBaslik, aciklama: varsayilanAciklama, yol, kisisel: !!kisisel };
  const { baslik, aciklama } = bilgi;
  const paylasimBasligi = ilan?.baslik ?? baslik;
  const {
    url: gorselAdresi,
    alt: gorselAciklamasi,
    width,
    height,
    type,
  } = ilanPaylasimGorseli(bilgi.kisisel ? undefined : ilan);
  const adres = `${siteAdresi}${bilgi.yol}`;
  const noindex = bilgi.kisisel || process.env.EXPO_PUBLIC_NOINDEX === 'true';
  const robotlar = noindex ? 'noindex, follow' : 'index, follow';
  const urunVerisi = ilanUrunVerisi(ilan);
  const urunMetni = urunVerisi ? JSON.stringify(urunVerisi) : '';

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
      'twitter:card': 'summary_large_image',
      'twitter:title': paylasimBasligi,
      'twitter:description': aciklama,
      'twitter:image': gorselAdresi,
      'twitter:image:alt': gorselAciklamasi,
    })) {
      guncelle(`meta[name="${ad}"]`, 'meta', { name: ad, content });
    }
    for (const [property, content] of Object.entries({
      'og:title': paylasimBasligi,
      'og:description': aciklama,
      'og:url': adres,
      'og:image': gorselAdresi,
      'og:image:secure_url': gorselAdresi,
      'og:image:alt': gorselAciklamasi,
      'og:image:width': String(width),
      'og:image:height': String(height),
      'og:image:type': type,
    })) {
      guncelle(`meta[property="${property}"]`, 'meta', { property, content });
    }
    guncelle('link[rel="canonical"]', 'link', { rel: 'canonical', href: adres });
    const oncekiUrun = document.getElementById('ilan-urun-verisi');
    if (urunMetni) {
      const etiket = oncekiUrun ?? document.createElement('script');
      etiket.id = 'ilan-urun-verisi';
      etiket.setAttribute('type', 'application/ld+json');
      etiket.textContent = urunMetni;
      if (!oncekiUrun) document.head.appendChild(etiket);
    } else oncekiUrun?.remove();
  }, [
    baslik,
    paylasimBasligi,
    aciklama,
    robotlar,
    adres,
    gorselAdresi,
    gorselAciklamasi,
    width,
    height,
    type,
    urunMetni,
  ]);

  if (Platform.OS === 'web') return null;
  return (
    <Head>
      <title>{baslik}</title>
      <meta name="description" content={aciklama} />
      <meta name="robots" content={robotlar} />
      <meta property="og:title" content={paylasimBasligi} />
      <meta property="og:description" content={aciklama} />
      <meta property="og:image" content={gorselAdresi} />
      <meta property="og:image:secure_url" content={gorselAdresi} />
      <meta property="og:image:alt" content={gorselAciklamasi} />
      <meta property="og:image:width" content={String(width)} />
      <meta property="og:image:height" content={String(height)} />
      <meta property="og:image:type" content={type} />
      <link rel="canonical" href={adres} />
      <meta property="og:url" content={adres} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={paylasimBasligi} />
      <meta name="twitter:description" content={aciklama} />
      <meta name="twitter:image" content={gorselAdresi} />
      <meta name="twitter:image:alt" content={gorselAciklamasi} />
    </Head>
  );
}
