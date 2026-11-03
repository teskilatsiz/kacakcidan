import { ilanlar, type Kategori } from './ilanlar.ts';

/** Ana kategori bağlantısı için bütün marka/model kataloğunu yüklemek gerekmez. */
export function anaKategoriAdresi(kategori: Kategori) {
  return ilanlar.some((ilan) => ilan.kategori === kategori && ilan.yayinDurumu !== 'kaldirildi')
    ? `/kategori/${kategori}`
    : `/kesfet?kategori=${kategori}`;
}
