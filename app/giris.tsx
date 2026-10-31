import Hesap from '../src/ekranlar/Hesap';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(
    'Giriş yap | Kaçakçıdan',
    'İlanlarını, favorilerini ve mesajlarını yönetmek için hesabına giriş yap.',
    '/giris',
    true,
  );
}
export default function Giris() {
  return <Hesap />;
}
