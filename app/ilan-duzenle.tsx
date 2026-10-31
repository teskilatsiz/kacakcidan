import IlanVer from '../src/ekranlar/IlanVer';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(
    'İlanı düzenle | Kaçakçıdan',
    'İlan bilgilerini ve fotoğraflarını güncelle.',
    '/ilan-duzenle',
    true,
  );
}

export default function IlanDuzenle() {
  return <IlanVer duzenleme />;
}
