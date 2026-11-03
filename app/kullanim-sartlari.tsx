import BilgiSayfasi from '../src/ekranlar/BilgiSayfasi';
import { bilgiSayfalari } from '../src/veri/bilgiSayfalari';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  const sayfa = bilgiSayfalari.kullanim;
  return sayfaMetasi(`${sayfa.baslik} | Kaçakçıdan`, sayfa.ozet, sayfa.yol);
}
export default function KullanimSartlari() {
  return <BilgiSayfasi tur="kullanim" />;
}
