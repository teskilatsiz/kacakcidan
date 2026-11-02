import AlimTalepleri from '../src/ekranlar/AlimTalepleri';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(
    'Alım talepleri | Kaçakçıdan',
    'Aradığın ürünü ve bütçeni belirt, uygun ilanları bul.',
    '/alim-talepleri',
    true,
  );
}

export default AlimTalepleri;
