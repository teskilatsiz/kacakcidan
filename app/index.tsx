import AnaSayfa from '../src/ekranlar/AnaSayfa';
import { anaSayfaAciklamasi, anaSayfaBasligi, sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi(anaSayfaBasligi, anaSayfaAciklamasi);
}
export default AnaSayfa;
