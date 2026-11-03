import BilgiSayfasi from '../src/ekranlar/BilgiSayfasi';
import { bilgiSayfalari } from '../src/veri/bilgiSayfalari';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  const sayfa = bilgiSayfalari.gizlilik;
  return sayfaMetasi(`${sayfa.baslik} | Kaçakçıdan`, sayfa.ozet, sayfa.yol);
}
export default function GizlilikPolitikasi() {
  return <BilgiSayfasi tur="gizlilik" />;
}
