import NasilCalisir from '../src/ekranlar/NasilCalisir';
import { nasilCalisirAciklamasi, sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi('Nasıl çalışır? | Kaçakçıdan', nasilCalisirAciklamasi, '/nasil-calisir', false);
}
export default NasilCalisir;
