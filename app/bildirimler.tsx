import Bildirimler from '../src/ekranlar/Bildirimler';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(
    'Bildirimler | Kaçakçıdan',
    'İlanlarına gelen soruları, cevapları ve güncellemeleri takip et.',
    '/bildirimler',
    true,
  );
}

export default Bildirimler;
