import IlanVer from '../src/ekranlar/IlanVer';
import { sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi(
    'İlan ver | Kaçakçıdan',
    'Fotoğrafını ekle, hikâyesini anlat. Kullanmadığın eşyalar yeniden değerlensin.',
    '/ilan-ver',
    true,
  );
}
export default IlanVer;
