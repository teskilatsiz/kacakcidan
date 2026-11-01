import type { HesapSonucu, Profil } from './PazarBaglami';
import { iletisimiDuzenle, type HesapDeposu } from './hesapDeposu.ts';

type ProfilDeposu = {
  oku: () => HesapDeposu;
  uygula: (depo: HesapDeposu) => void;
  sakla: (depo: HesapDeposu) => Promise<void>;
  medyaSil: (kaynak: string) => Promise<void>;
};

function kaynakKullaniliyor(depo: HesapDeposu, kaynak: string) {
  return [depo.misafir, ...depo.hesaplar.map((hesap) => hesap.kayit)].some(
    (kayit) =>
      kayit.profil.fotograf === kaynak ||
      kayit.eklenenler.some(
        (ilan) => ilan.gorsel === kaynak || ilan.fotografler?.includes(kaynak) || ilan.video === kaynak,
      ),
  );
}

/** Kalıcı yazı başarısız olursa yalnız bu profil değişikliğini geri alır. */
export async function profiliKaliciKaydet(
  { oku, uygula, sakla, medyaSil }: ProfilDeposu,
  hesapId: string,
  profil: Profil,
): Promise<HesapSonucu> {
  const depo = oku();
  const hesap = depo.hesaplar.find((kayit) => kayit.id === hesapId);
  if (!hesap || depo.aktifHesap !== hesapId)
    return { basarili: false, hata: 'Profilini kaydetmek için hesabına tekrar giriş yap.' };
  const onceki = hesap.kayit.profil;
  const yeniProfil = iletisimiDuzenle(profil);
  const yeni = {
    ...depo,
    hesaplar: depo.hesaplar.map((kayit) =>
      kayit.id === hesapId ? { ...kayit, kayit: { ...kayit.kayit, profil: yeniProfil } } : kayit,
    ),
  };
  uygula(yeni);
  try {
    await sakla(yeni);
  } catch {
    const guncel = oku();
    const geri = {
      ...guncel,
      hesaplar: guncel.hesaplar.map((kayit) =>
        kayit.id === hesapId && kayit.kayit.profil === yeniProfil
          ? { ...kayit, kayit: { ...kayit.kayit, profil: onceki } }
          : kayit,
      ),
    };
    uygula(geri);
    // Başka bir kayıt isteği yazma kuyruğundaysa, düzeltilmiş son durum ondan sonra saklanır.
    await sakla(geri).catch(() => undefined);
    return { basarili: false, hata: 'Profilin kaydedilemedi. Depolama alanını kontrol edip tekrar dene.' };
  }
  if (
    onceki.fotograf &&
    onceki.fotograf !== yeniProfil.fotograf &&
    !kaynakKullaniliyor(oku(), onceki.fotograf)
  )
    void medyaSil(onceki.fotograf).catch(() => undefined);
  return { basarili: true };
}
