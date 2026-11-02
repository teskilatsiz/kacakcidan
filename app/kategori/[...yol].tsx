import type { GenerateMetadataFunction } from 'expo-router/server';
import Kesfet from '../../src/ekranlar/Kesfet';
import { kategoriSayfalari } from '../../src/veri/kategoriSayfalari';
import { kategoriSayfaBilgisi, sayfaMetasi } from '../../src/tasarim/seo';

export function generateStaticParams() {
  return kategoriSayfalari.map(({ yol }) => ({ yol }));
}

export const generateMetadata: GenerateMetadataFunction = (istek, params) => {
  const bilgi = kategoriSayfaBilgisi(params.yol, istek ? new URL(istek.url).searchParams : {});
  return sayfaMetasi(bilgi.baslik, bilgi.aciklama, bilgi.yol, bilgi.kisisel);
};

export default Kesfet;
