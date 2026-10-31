import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ilanlar, type Ilan } from '../veri/ilanlar';
import { epostaDuzenle, kayitBilgisiHatasi } from '../veri/hesap';
import { PazarBaglami, type HesapSonucu, type Kayit, type Mesaj, type Profil } from './PazarBaglami';
import {
  aktifKayit,
  bosKayit,
  depoyuOku,
  ilkDepo,
  ilanKaydiniEkle,
  ilanKaydiniGuncelle,
  kaydiDegistir,
  type HesapDeposu,
} from './hesapDeposu';
import { parolaDogrula, parolaOlustur } from './parola';
import { medyaSil } from './medyaDeposu';

const ANAHTAR = 'kacakcidan:hesaplar:v2';
const ESKI_ANAHTAR = 'kacakcidan:pazar:v1';

export function PazarSaglayici({ children }: { children: ReactNode }) {
  const [depo, setDepo] = useState(ilkDepo);
  const [hazir, setHazir] = useState(false);
  const [bildirim, setBildirim] = useState('');
  const depoRef = useRef(depo);
  const yuklendi = useRef(false);
  const hesapIsleniyor = useRef(false);
  const bekleyen = useRef<((eski: Kayit) => Kayit)[]>([]);
  const yazma = useRef<Promise<void>>(Promise.resolve());
  const zamanlayici = useRef<ReturnType<typeof setTimeout> | null>(null);

  const haberVer = useCallback((mesaj: string) => {
    setBildirim(mesaj);
    if (zamanlayici.current) clearTimeout(zamanlayici.current);
    zamanlayici.current = setTimeout(() => setBildirim(''), 3500);
  }, []);

  const sakla = useCallback((yeni: HesapDeposu) => {
    // Native depolamada da eski bir yazma işlemi yeni kaydın üzerine gelemez.
    const islem = yazma.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(ANAHTAR, JSON.stringify(yeni)));
    yazma.current = islem;
    return islem;
  }, []);
  const uygula = useCallback((yeni: HesapDeposu) => {
    depoRef.current = yeni;
    setDepo(yeni);
  }, []);
  const degistir = useCallback(
    (guncelle: (eski: Kayit) => Kayit) => {
      if (!yuklendi.current) {
        bekleyen.current.push(guncelle);
        uygula(kaydiDegistir(depoRef.current, guncelle));
        return;
      }
      const yeni = kaydiDegistir(depoRef.current, guncelle);
      uygula(yeni);
      void sakla(yeni).catch(() => haberVer('Değişiklikler kaydedilemedi. Depolama alanını kontrol et.'));
    },
    [haberVer, sakla, uygula],
  );

  useEffect(() => {
    let etkin = true;
    void Promise.all([AsyncStorage.getItem(ANAHTAR), AsyncStorage.getItem(ESKI_ANAHTAR)])
      .then(([ham, eskiHam]) => {
        if (!etkin) return;
        const okunan = depoyuOku(ham, eskiHam);
        const degisiklikVar = bekleyen.current.length > 0;
        const yeni = bekleyen.current.reduce((sonuc, guncelle) => kaydiDegistir(sonuc, guncelle), okunan);
        bekleyen.current = [];
        uygula(yeni);
        if (eskiHam || degisiklikVar) void sakla(yeni).catch(() => {});
      })
      .catch(() => {
        if (etkin) haberVer('Kayıtlı bilgiler okunamadı. Depolama izinlerini kontrol et.');
      })
      .finally(() => {
        if (!etkin) return;
        yuklendi.current = true;
        setHazir(true);
      });
    return () => {
      etkin = false;
      if (zamanlayici.current) clearTimeout(zamanlayici.current);
    };
  }, [haberVer, sakla, uygula]);

  const kayit = aktifKayit(depo);
  const aktifHesap = depo.hesaplar.find((h) => h.id === depo.aktifHesap);
  const oturum = useMemo(
    () => (aktifHesap ? { id: aktifHesap.id, eposta: aktifHesap.eposta } : null),
    [aktifHesap],
  );

  const kayitOl = useCallback(
    async (bilgiler: { ad: string; eposta: string; sifre: string }): Promise<HesapSonucu> => {
      if (!yuklendi.current || hesapIsleniyor.current)
        return { basarili: false, hata: 'Biraz bekleyip tekrar dene.' };
      const hata = kayitBilgisiHatasi(bilgiler);
      if (hata) return { basarili: false, hata };
      const eposta = epostaDuzenle(bilgiler.eposta);
      if (depoRef.current.hesaplar.some((h) => h.eposta === eposta))
        return { basarili: false, hata: 'Bu e-posta adresiyle bir hesap var. Giriş yapabilirsin.' };
      hesapIsleniyor.current = true;
      try {
        const parola = await parolaOlustur(bilgiler.sifre);
        const id = `uye-${parola.tuz}`;
        const yeniKayit = bosKayit(bilgiler.ad.trim().replace(/\s+/g, ' '));
        yeniKayit.favoriler = [...depoRef.current.misafir.favoriler];
        yeniKayit.konum = depoRef.current.misafir.konum;
        const yeni: HesapDeposu = {
          ...depoRef.current,
          hesaplar: [...depoRef.current.hesaplar, { id, eposta, parola, kayit: yeniKayit }],
          aktifHesap: id,
        };
        await sakla(yeni);
        uygula(yeni);
        haberVer('Hesabın hazır. Hoş geldin!');
        return { basarili: true };
      } catch {
        return {
          basarili: false,
          hata: 'Hesap kaydedilemedi. Bağlantını ve depolama izinlerini kontrol edip tekrar dene.',
        };
      } finally {
        hesapIsleniyor.current = false;
      }
    },
    [haberVer, sakla, uygula],
  );

  const girisYap = useCallback(
    async ({ eposta, sifre }: { eposta: string; sifre: string }): Promise<HesapSonucu> => {
      if (!yuklendi.current || hesapIsleniyor.current)
        return { basarili: false, hata: 'Biraz bekleyip tekrar dene.' };
      const hesap = depoRef.current.hesaplar.find((h) => h.eposta === epostaDuzenle(eposta));
      if (!hesap || !sifre || sifre.length > 128)
        return { basarili: false, hata: 'E-posta adresin veya şifren hatalı.' };
      hesapIsleniyor.current = true;
      try {
        if (!(await parolaDogrula(sifre, hesap.parola)))
          return { basarili: false, hata: 'E-posta adresin veya şifren hatalı.' };
        const yeni = { ...depoRef.current, aktifHesap: hesap.id };
        await sakla(yeni);
        uygula(yeni);
        haberVer('Tekrar hoş geldin.');
        return { basarili: true };
      } catch {
        return {
          basarili: false,
          hata: 'Giriş yapılamadı. Bağlantını ve depolama izinlerini kontrol edip tekrar dene.',
        };
      } finally {
        hesapIsleniyor.current = false;
      }
    },
    [haberVer, sakla, uygula],
  );
  const cikisYap = useCallback(() => {
    const yeni = { ...depoRef.current, aktifHesap: null };
    uygula(yeni);
    void sakla(yeni).catch(() =>
      haberVer('Çıkış kaydedilemedi. Bu sayfayı kapatmadan depolama izinlerini kontrol et.'),
    );
    haberVer('Çıkış yaptın.');
  }, [haberVer, sakla, uygula]);

  const favoriDegistir = useCallback(
    (id: string) => {
      const secili = aktifKayit(depoRef.current).favoriler.includes(id);
      degistir((eski) => ({
        ...eski,
        favoriler: eski.favoriler.includes(id)
          ? eski.favoriler.filter((k) => k !== id)
          : [...eski.favoriler, id],
      }));
      haberVer(secili ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.');
    },
    [degistir, haberVer],
  );
  const ilanSil = useCallback(
    (id: string) => {
      const ilan = aktifKayit(depoRef.current).eklenenler.find((i) => i.id === id);
      if (!ilan) return;
      degistir((eski) => ({
        ...eski,
        eklenenler: eski.eklenenler.filter((i) => i.id !== id),
        favoriler: eski.favoriler.filter((k) => k !== id),
      }));
      haberVer('İlan kaldırıldı.');
      const kaynaklar = new Set([
        ilan.gorsel,
        ...(ilan.fotografler ?? []),
        ...(ilan.video ? [ilan.video] : []),
      ]);
      void Promise.allSettled([...kaynaklar].map(medyaSil));
    },
    [haberVer, degistir],
  );
  const ilaniKaydet = useCallback(
    async (ilan: Ilan, hesapId: string, duzenleme: boolean): Promise<HesapSonucu> => {
      if (!yuklendi.current)
        return { basarili: false, hata: 'Hesabın yükleniyor. Biraz bekleyip tekrar dene.' };
      const onceki = aktifKayit(depoRef.current).eklenenler.find((kayitli) => kayitli.id === ilan.id);
      const yeni = duzenleme
        ? ilanKaydiniGuncelle(depoRef.current, hesapId, ilan)
        : ilanKaydiniEkle(depoRef.current, hesapId, ilan);
      if (!yeni)
        return {
          basarili: false,
          hata: duzenleme
            ? 'Yalnızca kendi ilanlarını düzenleyebilirsin.'
            : 'İlan kaydedilemedi. Hesabına giriş yapıp tekrar dene.',
        };
      const guncel = aktifKayit(yeni).eklenenler.find((kayitli) => kayitli.id === ilan.id)!;
      uygula(yeni);
      try {
        await sakla(yeni);
      } catch {
        const geri = {
          ...depoRef.current,
          hesaplar: depoRef.current.hesaplar.map((hesap) =>
            hesap.id === hesapId
              ? {
                  ...hesap,
                  kayit: {
                    ...hesap.kayit,
                    eklenenler: hesap.kayit.eklenenler.flatMap((kayitli) =>
                      kayitli === guncel ? (onceki ? [onceki] : []) : [kayitli],
                    ),
                  },
                }
              : hesap,
          ),
        };
        uygula(geri);
        void sakla(geri).catch(() => {});
        return {
          basarili: false,
          hata: 'Değişiklikler kaydedilemedi. Depolama alanını kontrol edip tekrar dene.',
        };
      }
      const korunan = new Set([
        ilan.gorsel,
        ...(ilan.fotografler ?? []),
        ...(ilan.video ? [ilan.video] : []),
      ]);
      const eskiKaynaklar = new Set(
        onceki ? [onceki.gorsel, ...(onceki.fotografler ?? []), ...(onceki.video ? [onceki.video] : [])] : [],
      );
      void Promise.allSettled([...eskiKaynaklar].filter((kaynak) => !korunan.has(kaynak)).map(medyaSil));
      haberVer(duzenleme ? 'İlanın güncellendi.' : 'İlanın kaydedildi.');
      return { basarili: true };
    },
    [haberVer, sakla, uygula],
  );
  const ilanEkle = useCallback(
    (ilan: Ilan, hesapId: string) => ilaniKaydet(ilan, hesapId, false),
    [ilaniKaydet],
  );
  const ilanGuncelle = useCallback(
    (ilan: Ilan, hesapId: string) => ilaniKaydet(ilan, hesapId, true),
    [ilaniKaydet],
  );
  const mesajGonder = useCallback(
    (kisi: string, yazi: string) => {
      if (!yazi.trim() || !depoRef.current.aktifHesap) return;
      const yeni: Mesaj = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        yazi: yazi.trim(),
        benim: true,
        saat: new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      };
      degistir((eski) => ({
        ...eski,
        mesajlar: { ...eski.mesajlar, [kisi]: [...(eski.mesajlar[kisi] ?? []), yeni] },
      }));
    },
    [degistir],
  );
  const tumIlanlar = useMemo(
    () => [
      ...depo.hesaplar.flatMap((hesap) =>
        hesap.kayit.eklenenler.map((ilan) => ({
          ...ilan,
          satici: hesap.kayit.profil.ad,
          benim: hesap.id === depo.aktifHesap,
        })),
      ),
      ...depo.misafir.eklenenler.map((ilan) => ({ ...ilan, benim: false })),
      ...ilanlar.map((ilan) => ({ ...ilan, benim: false })),
    ],
    [depo.hesaplar, depo.misafir.eklenenler, depo.aktifHesap],
  );
  const profilKaydet = useCallback(
    (profil: Profil) => {
      if (!depoRef.current.aktifHesap) return;
      const onceki = aktifKayit(depoRef.current).profil.fotograf;
      degistir((eski) => ({ ...eski, profil }));
      if (onceki && onceki !== profil.fotograf) void medyaSil(onceki).catch(() => {});
    },
    [degistir],
  );

  return (
    <PazarBaglami.Provider
      value={{
        ...kayit,
        hazir,
        bildirim,
        oturum,
        girisYap,
        kayitOl,
        cikisYap,
        tumIlanlar,
        favoriDegistir,
        ilanEkle,
        ilanGuncelle,
        ilanSil,
        mesajGonder,
        haberVer,
        profilKaydet,
        konumSec: (konum) => degistir((eski) => ({ ...eski, konum })),
      }}
    >
      {children}
    </PazarBaglami.Provider>
  );
}
