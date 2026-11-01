export const ilanKaldirmaNedenleri = [
  { id: 'satildi', ad: 'Satış tamamlandı', aciklama: 'Ürünü sattım veya ilan amacına ulaştı.' },
  {
    id: 'vazgectim',
    ad: 'Yayından kaldırmak istiyorum',
    aciklama: 'Şimdilik ilanımın görünmesini istemiyorum.',
  },
  {
    id: 'duzenleyecegim',
    ad: 'Daha sonra yeniden yayınlayacağım',
    aciklama: 'İlanımı saklayıp sonra devam edeceğim.',
  },
] as const;
export type IlanKaldirmaNedeni = (typeof ilanKaldirmaNedenleri)[number]['id'];
export const sikayetNedenleri = [
  'Yanlış veya yanıltıcı bilgi',
  'Şüpheli ilan veya dolandırıcılık',
  'Yasaklı ürün ya da hizmet',
  'Yanlış kategori',
  'Mükerrer ilan',
  'Uygunsuz görsel veya açıklama',
  'Diğer',
] as const;
export type SikayetNedeni = (typeof sikayetNedenleri)[number];
export type IlanSikayeti = {
  id: string;
  ilanId: string;
  hesapId: string;
  neden: SikayetNedeni;
  aciklama: string;
  tarih: string;
};
