import Hesap from '../src/ekranlar/Hesap';
import { sayfaMetasi } from '../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(
    'Hesap oluştur | Kaçakçıdan',
    'İlan vermek, satıcılarla konuşmak ve favorilerini kaydetmek için hesap oluştur.',
    '/kayit',
    true,
  );
}
export default function Kayit() {
  return <Hesap kayit />;
}
