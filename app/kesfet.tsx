import type { GenerateMetadataFunction } from 'expo-router/server';
import Kesfet from '../src/ekranlar/Kesfet';
import { kesfetSayfaBilgisi, sayfaMetasi } from '../src/tasarim/seo';
export const generateMetadata: GenerateMetadataFunction = (istek) => {
  const bilgi = kesfetSayfaBilgisi(istek ? new URL(istek.url).searchParams : {});
  return sayfaMetasi(bilgi.baslik, bilgi.aciklama, bilgi.yol, bilgi.kisisel);
};
export default Kesfet;
