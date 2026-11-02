import { alimTalepleriniOku, type AlimTalebi } from '../veri/alimTalepleri.ts';

export const ALIM_TALEBI_ANAHTARI = 'kacakcidan-alim-talepleri-v1';
export type AlimTalebiDeposuDurumu = { talepler: AlimTalebi[]; hazir: boolean; hata: string };
type Saklama = {
  getItem: (anahtar: string) => Promise<string | null>;
  setItem: (anahtar: string, deger: string) => Promise<unknown>;
};

/** Yazmaları sırala; diske yazılamayan bir değişikliği kaydedilmiş gibi gösterme. */
export function alimTalebiDeposuOlustur(saklama: Saklama) {
  let durum: AlimTalebiDeposuDurumu = { talepler: [], hazir: false, hata: '' };
  const sunucu = durum;
  const aboneler = new Set<() => void>();
  let yukleme: Promise<void> | undefined;
  let kuyruk: Promise<unknown> = Promise.resolve();
  function bildir(yeni: AlimTalebiDeposuDurumu) {
    durum = yeni;
    aboneler.forEach((abone) => abone());
  }
  function yukle() {
    if (yukleme) return yukleme;
    yukleme = saklama
      .getItem(ALIM_TALEBI_ANAHTARI)
      .then((metin) => {
        bildir({ talepler: alimTalepleriniOku(metin), hazir: true, hata: '' });
      })
      .catch(() => {
        bildir({
          ...durum,
          hazir: true,
          hata: 'Alım talepleri bu cihazdan okunamadı. Sayfayı yeniden açıp tekrar dene.',
        });
      });
    return yukleme;
  }
  function degistir(islem: (talepler: AlimTalebi[]) => AlimTalebi[]) {
    const sirali = kuyruk.then(async () => {
      await yukle();
      if (durum.hata) throw new Error(durum.hata);
      const talepler = islem(durum.talepler);
      try {
        await saklama.setItem(ALIM_TALEBI_ANAHTARI, JSON.stringify({ surum: 1, talepler }));
      } catch {
        throw new Error(
          'Talep bu cihaza kaydedilemedi. Depolama iznini ve boş alanı kontrol edip tekrar dene.',
        );
      }
      bildir({ ...durum, talepler });
    });
    kuyruk = sirali.catch(() => undefined);
    return sirali;
  }
  return {
    oku: () => durum,
    sunucuyuOku: () => sunucu,
    izle: (abone: () => void) => {
      aboneler.add(abone);
      return () => {
        aboneler.delete(abone);
      };
    },
    yukle,
    degistir,
  };
}
