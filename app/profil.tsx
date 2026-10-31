import Profil from '../src/ekranlar/Profil';
import { sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi(
    'Profilim | Kaçakçıdan',
    'İlanlarını, favorilerini ve profil bilgilerini bir arada yönet.',
    '/profil',
    true,
  );
}
export default Profil;
