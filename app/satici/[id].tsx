import type { GenerateMetadataFunction } from 'expo-router/server';
import Satici from '../../src/ekranlar/Satici';
import { ilanlar } from '../../src/veri/ilanlar';
import { katalogSaticilari } from '../../src/veri/saticilar';
import { sayfaMetasi, saticiSayfaBilgisi } from '../../src/tasarim/seo';
const saticilar = katalogSaticilari(ilanlar);
export function generateStaticParams() {
  return [...saticilar.map(({ id }) => ({ id })), { id: 'yerel' }];
}
export const generateMetadata: GenerateMetadataFunction = (istek, params) => {
  const satici = saticilar.find(({ id }) => id === params.id);
  const yerel = params.id === 'yerel' || !!(istek && new URL(istek.url).searchParams.has('hesap'));
  const bilgi = saticiSayfaBilgisi(satici, yerel);
  return sayfaMetasi(bilgi.baslik, bilgi.aciklama, bilgi.yol, bilgi.kisisel);
};
export default Satici;
