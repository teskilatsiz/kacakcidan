import Kesfet from '../src/ekranlar/Kesfet';
import { kesfetAciklamasi, sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi('İlanları keşfet | Kaçakçıdan', kesfetAciklamasi, '/kesfet', false);
}
export default Kesfet;
