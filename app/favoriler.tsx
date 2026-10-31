import Favoriler from '../src/ekranlar/Favoriler';
import { sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi('Favorilerim | Kaçakçıdan', 'Aklının kaldığı keşifler bir arada.', '/favoriler', true);
}
export default Favoriler;
