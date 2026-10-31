import Mesajlar from '../src/ekranlar/Mesajlar';
import { sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi(
    'Mesajlarım | Kaçakçıdan',
    'İlanlar hakkında doğrudan konuş, teslim detaylarını netleştir.',
    '/mesajlar',
    true,
  );
}
export default Mesajlar;
