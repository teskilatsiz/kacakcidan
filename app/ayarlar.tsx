import HesapAyarlari from '../src/ekranlar/HesapAyarlari';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(
    'Hesap ayarları | Kaçakçıdan',
    'Profil bilgilerini ve hesap ayarlarını yönet.',
    '/ayarlar',
    true,
  );
}

export default HesapAyarlari;
