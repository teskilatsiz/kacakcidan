import type { GenerateMetadataFunction } from 'expo-router/server';
import IlanDetayi from '../../src/ekranlar/IlanDetayi';
import { ilanlar, para } from '../../src/veri/ilanlar';
import { ilanAciklamasi, sayfaMetasi } from '../../src/tasarim/seo';
export function generateStaticParams() {
  return [...ilanlar.map((ilan) => ({ id: ilan.id })), { id: 'yerel' }];
}
export const generateMetadata: GenerateMetadataFunction = (_istek, params) => {
  const ilan = ilanlar.find((i) => i.id === params.id);
  if (!ilan)
    return sayfaMetasi('İlanım | Kaçakçıdan', 'İlan detayları ve satıcı bilgileri.', '/ilan/yerel', true);
  return sayfaMetasi(
    `${ilan.baslik} - ${para(ilan.fiyat)} | Kaçakçıdan`,
    ilanAciklamasi(ilan),
    `/ilan/${ilan.id}`,
  );
};
export default IlanDetayi;
