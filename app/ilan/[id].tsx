import type { GenerateMetadataFunction } from 'expo-router/server';
import IlanDetayi from '../../src/ekranlar/IlanDetayi';
import { ilanlar } from '../../src/veri/ilanlar';
import { ilanAciklamasi, ilanSayfaBasligi, sayfaMetasi } from '../../src/tasarim/seo';
export function generateStaticParams() {
  return [...ilanlar.map((ilan) => ({ id: ilan.id })), { id: 'yerel' }];
}
export const generateMetadata: GenerateMetadataFunction = (_istek, params) => {
  const ilan = ilanlar.find((i) => i.id === params.id);
  if (!ilan)
    return sayfaMetasi('İlanım | Kaçakçıdan', 'İlan detayları ve satıcı bilgileri.', '/ilan/yerel', true);
  return sayfaMetasi(ilanSayfaBasligi(ilan), ilanAciklamasi(ilan), `/ilan/${ilan.id}`);
};
export default IlanDetayi;
