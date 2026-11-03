import BilgiSayfasi from '../src/ekranlar/BilgiSayfasi';
import { bilgiSayfalari } from '../src/veri/bilgiSayfalari';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  const sayfa = bilgiSayfalari.cerezler;
  return sayfaMetasi(`${sayfa.baslik} | Kaçakçıdan`, sayfa.ozet, sayfa.yol);
}
export default function Cerezler() {
  return <BilgiSayfasi tur="cerezler" />;
}
