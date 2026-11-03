import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
  ilanYayininiDegistir,
  kaydiDegistir,
  type HesapDeposu,
} from './hesapDeposu';
import { parolaDogrula, parolaOlustur } from './parola';
import { medyaSil } from './medyaDeposu';
import { profiliKaliciKaydet } from './profilKaydi';
import { katalogSaticilari, saticiKimligi, type SaticiProfili } from '../veri/saticilar';
import { sikayetNedenleri, type SikayetNedeni, type IlanKaldirmaNedeni } from '../veri/ilanYonetimi';
import {
  alisverisTalebiOlustur,
  alisverisTalebiniIptalEt,
  alisverisTesliminiOnayla,
  degerlendirmeOlustur,
  degerlendirmeyeCevapVer,
  degerlendirmeyiGuncelle,
  degerlendirmeyiSil,
  saticiPuanOzeti,
  type DegerlendirmeKaydi,
} from '../veri/saticiDegerlendirmeleri';
import {
  gorunurSorular,
  goruntulemeKaydet,
  numaralariTamamla,
  vitrinSorulari,
  type Bildirim,
} from '../veri/ilanEtkilesimleri';

const ANAHTAR = 'kacakcidan:hesaplar:v2';
const ESKI_ANAHTAR = 'kacakcidan:pazar:v1';

function ilanBul(depo: HesapDeposu, id: string) {
  const sahip = depo.hesaplar.find((hesap) => hesap.kayit.eklenenler.some((ilan) => ilan.id === id));
  return {
    ilan: sahip?.kayit.eklenenler.find((ilan) => ilan.id === id) ?? ilanlar.find((ilan) => ilan.id === id),
    sahip,
  };
}

function bildirimEkle(depo: HesapDeposu, bilgi: Omit<Bildirim, 'id' | 'tarih' | 'okundu'>): HesapDeposu {
  const bildirim: Bildirim = { ...bilgi, id: randomUUID(), tarih: new Date().toISOString(), okundu: false };
  return {
    ...depo,
    etkilesimler: {
      ...depo.etkilesimler,
      bildirimler: [bildirim, ...depo.etkilesimler.bildirimler].slice(0, 1000),
    },
  };
}

function alisverisBildirimleriniEkle(
  depo: HesapDeposu,
  onceki: DegerlendirmeKaydi,
  hesapId: string,
): HesapDeposu {
  let yeni = depo;
  const oncekiIslemler = new Map(onceki.alisverisler.map((islem) => [islem.id, islem]));
  for (const islem of depo.degerlendirmeKaydi.alisverisler) {
    const eski = oncekiIslemler.get(islem.id);
    if (eski === islem) continue;
    const alici = hesapId === islem.aliciId;
    const digerHesap = alici ? islem.saticiId : islem.aliciId;
    if (!depo.hesaplar.some((hesap) => hesap.id === digerHesap)) continue;
    yeni = bildirimEkle(yeni, {
      hesapId: digerHesap,
      ilanId: islem.ilanId,
      alisverisId: islem.id,
      tur: 'alisveris',
      baslik: !eski
        ? 'Yeni alışveriş talebi'
        : islem.durum === 'iptal'
          ? 'Alışveriş talebi iptal edildi'
          : islem.durum === 'tamamlandi'
            ? 'Alışveriş tamamlandı'
            : alici
              ? 'Alıcı teslim aldığını onayladı'
              : 'Satıcı teslim ettiğini onayladı',
      aciklama: `${islem.ilanBasligi} · ${alici ? islem.aliciAd : islem.saticiAd}`,
    });
  }
  const oncekiYorumlar = new Map(onceki.degerlendirmeler.map((yorum) => [yorum.id, yorum]));
  for (const yorum of depo.degerlendirmeKaydi.degerlendirmeler) {
    const eski = oncekiYorumlar.get(yorum.id);
    if (eski === yorum) continue;
    const saticiYanitladi = hesapId === yorum.saticiId;
    yeni = bildirimEkle(yeni, {
      hesapId: saticiYanitladi ? yorum.yazanId : yorum.saticiId,
      ilanId: yorum.ilanId,
      alisverisId: yorum.alisverisId,
      saticiId: yorum.saticiId,
      tur: 'degerlendirme',
      baslik: saticiYanitladi
        ? 'Satıcı değerlendirmeni yanıtladı'
        : eski
          ? 'Alıcı değerlendirmesini güncelledi'
          : 'Yeni satıcı değerlendirmen var',
      aciklama: yorum.ilanBasligi,
    });
  }
  return yeni;
}

export function PazarSaglayici({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [depo, setDepo] = useState(ilkDepo);
  const [hazir, setHazir] = useState(false);
  const [bildirim, setBildirim] = useState('');
  const depoRef = useRef(depo);
  const yuklendi = useRef(false);
  const hesapIsleniyor = useRef(false);
  const profilIsleniyor = useRef(false);
  const bekleyen = useRef<((eski: Kayit) => Kayit)[]>([]);
  const yazma = useRef<Promise<void>>(Promise.resolve());
  const degerlendirmeYazma = useRef<Promise<void>>(Promise.resolve());
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
  const depoyuDegistir = useCallback(
    (guncelle: (eski: HesapDeposu) => HesapDeposu) => {
      if (!yuklendi.current) return;
      const onceki = depoRef.current;
      const yeni = guncelle(onceki);
      if (yeni === onceki) return;
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
        const bekleyenlerle = bekleyen.current.reduce(
          (sonuc, guncelle) => kaydiDegistir(sonuc, guncelle),
          okunan,
        );
        const yeni = {
          ...bekleyenlerle,
          etkilesimler: numaralariTamamla(bekleyenlerle.etkilesimler, [
            ...ilanlar.map((ilan) => ilan.id),
            ...bekleyenlerle.hesaplar.flatMap((hesap) => hesap.kayit.eklenenler.map((ilan) => ilan.id)),
          ]),
        };
        bekleyen.current = [];
        // Kayıt okunurken vitrinin ilk etkileşimleri beklemesin.
        depoRef.current = yeni;
        startTransition(() => setDepo(yeni));
        if (eskiHam || degisiklikVar || yeni.etkilesimler !== okunan.etkilesimler)
          void sakla(yeni).catch(() => {});
      })
      .catch(() => {
        if (etkin) haberVer('Kayıtlı bilgiler okunamadı. Depolama izinlerini kontrol et.');
      })
      .finally(() => {
        if (!etkin) return;
        yuklendi.current = true;
        startTransition(() => setHazir(true));
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
      if (!yuklendi.current || hesapIsleniyor.current || profilIsleniyor.current)
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
      if (!yuklendi.current || hesapIsleniyor.current || profilIsleniyor.current)
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
      if (!depoRef.current.aktifHesap) {
        haberVer('Favorilerine eklemek için giriş yap.');
        router.push({ pathname: '/giris', params: { donus: '/favoriler' } });
        return;
      }
      const { ilan, sahip } = ilanBul(depoRef.current, id);
      if (!ilan || ilan.yayinDurumu === 'kaldirildi') {
        haberVer('Bu ilan artık yayında değil.');
        return;
      }
      const secili = aktifKayit(depoRef.current).favoriler.includes(id);
      depoyuDegistir((depo) => {
        const yeni = kaydiDegistir(depo, (eski) => ({
          ...eski,
          favoriler: secili ? eski.favoriler.filter((k) => k !== id) : [...eski.favoriler, id],
        }));
        if (secili || !sahip || sahip.id === depo.aktifHesap) return yeni;
        return bildirimEkle(yeni, {
          hesapId: sahip.id,
          ilanId: id,
          tur: 'favori',
          baslik: 'İlanın favorilere eklendi',
          aciklama: `${ilan.baslik} ilanını bir kişi favorilerine ekledi.`,
        });
      });
      haberVer(secili ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.');
    },
    [depoyuDegistir, haberVer, router],
  );
  const ilanSil = useCallback(
    (id: string) => {
      const ilan = aktifKayit(depoRef.current).eklenenler.find((i) => i.id === id);
      if (!ilan) return;
      depoyuDegistir((depo) => {
        let yeni = {
          ...depo,
          hesaplar: depo.hesaplar.map((hesap) => ({
            ...hesap,
            kayit: {
              ...hesap.kayit,
              eklenenler:
                hesap.id === depo.aktifHesap
                  ? hesap.kayit.eklenenler.filter((i) => i.id !== id)
                  : hesap.kayit.eklenenler,
              favoriler: hesap.kayit.favoriler.filter((k) => k !== id),
            },
          })),
          etkilesimler: {
            ...depo.etkilesimler,
            sorular: depo.etkilesimler.sorular.filter((soru) => soru.ilanId !== id),
          },
        };
        yeni = bildirimEkle(yeni, {
          hesapId: depo.aktifHesap!,
          ilanId: id,
          tur: 'kaldirma',
          baslik: 'İlanın yayından kaldırıldı',
          aciklama: `${ilan.baslik} ilanını yayından kaldırdın.`,
        });
        for (const hesap of depo.hesaplar)
          if (hesap.id !== depo.aktifHesap && hesap.kayit.favoriler.includes(id))
            yeni = bildirimEkle(yeni, {
              hesapId: hesap.id,
              ilanId: id,
              tur: 'kaldirma',
              baslik: 'Favorindeki ilan yayından kaldırıldı',
              aciklama: `${ilan.baslik} artık yayında değil.`,
            });
        return yeni;
      });
      haberVer('İlan kaldırıldı.');
      const kaynaklar = new Set([
        ilan.gorsel,
        ...(ilan.fotografler ?? []),
        ...(ilan.video ? [ilan.video] : []),
      ]);
      void Promise.allSettled([...kaynaklar].map(medyaSil));
    },
    [haberVer, depoyuDegistir],
  );
  const ilaniKaydet = useCallback(
    async (ilan: Ilan, hesapId: string, duzenleme: boolean, oneCikar = false): Promise<HesapSonucu> => {
      if (!yuklendi.current)
        return { basarili: false, hata: 'Hesabın yükleniyor. Biraz bekleyip tekrar dene.' };
      const onceki = aktifKayit(depoRef.current).eklenenler.find((kayitli) => kayitli.id === ilan.id);
      const yeni = duzenleme
        ? ilanKaydiniGuncelle(depoRef.current, hesapId, ilan, oneCikar)
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
      depoyuDegistir((depo) => {
        let sonuc = bildirimEkle(depo, {
          hesapId,
          ilanId: ilan.id,
          tur: duzenleme ? 'duzenleme' : 'yayin',
          baslik: oneCikar ? 'İlanın vitrinde' : duzenleme ? 'İlanın güncellendi' : 'İlanın yayında',
          aciklama: oneCikar
            ? `${ilan.baslik} ilanını vitrine ekledin.`
            : `${ilan.baslik} ${duzenleme ? 'ilanındaki değişiklikler kaydedildi.' : 'ilanını alıcılar görebilir.'}`,
        });
        if (duzenleme && onceki && onceki.fiyat !== ilan.fiyat) {
          for (const hesap of depo.hesaplar)
            if (hesap.id !== hesapId && hesap.kayit.favoriler.includes(ilan.id))
              sonuc = bildirimEkle(sonuc, {
                hesapId: hesap.id,
                ilanId: ilan.id,
                tur: 'fiyat',
                baslik: 'Favorindeki ilanın fiyatı değişti',
                aciklama: `${ilan.baslik} ilanının fiyatı güncellendi.`,
              });
        }
        return sonuc;
      });
      haberVer(
        oneCikar ? 'İlanın vitrine eklendi.' : duzenleme ? 'İlanın güncellendi.' : 'İlanın kaydedildi.',
      );
      return { basarili: true };
    },
    [depoyuDegistir, haberVer, sakla, uygula],
  );
  const ilanEkle = useCallback(
    (ilan: Ilan, hesapId: string) => ilaniKaydet(ilan, hesapId, false),
    [ilaniKaydet],
  );
  const ilanGuncelle = useCallback(
    (ilan: Ilan, hesapId: string) => ilaniKaydet(ilan, hesapId, true),
    [ilaniKaydet],
  );
  const ilanOneCikar = useCallback(
    async (id: string, hesapId: string): Promise<HesapSonucu> => {
      const ilan = aktifKayit(depoRef.current).eklenenler.find((kayitli) => kayitli.id === id);
      if (!ilan || ilan.yayinDurumu === 'kaldirildi')
        return { basarili: false, hata: 'Yayındaki kendi ilanlarını öne çıkarabilirsin.' };
      return ilaniKaydet(ilan, hesapId, true, true);
    },
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
  const soruSor = useCallback(
    (ilanId: string, metin: string): HesapSonucu => {
      const depo = depoRef.current;
      const hesap = depo.hesaplar.find((h) => h.id === depo.aktifHesap);
      if (!hesap) return { basarili: false, hata: 'Soru sormak için giriş yap.' };
      const { ilan, sahip } = ilanBul(depo, ilanId);
      if (!ilan || ilan.yayinDurumu === 'kaldirildi')
        return { basarili: false, hata: 'Bu ilan artık yayında değil.' };
      if (sahip?.id === hesap.id) return { basarili: false, hata: 'Kendi ilanına soru soramazsın.' };
      const soru = metin.trim();
      if (soru.length < 5 || soru.length > 600)
        return { basarili: false, hata: 'Sorunu 5–600 karakter arasında yaz.' };
      const onceki = depo.etkilesimler.sorular.find(
        (s) => s.ilanId === ilanId && s.soranId === hesap.id && s.soru === soru,
      );
      if (onceki && Date.now() - new Date(onceki.tarih).getTime() < 60_000)
        return { basarili: false, hata: 'Bu soruyu az önce gönderdin. Satıcının yanıtını bekleyebilirsin.' };
      const parcalar = hesap.kayit.profil.ad.split(' ');
      const soranAd = `${parcalar[0]}${parcalar.length > 1 ? ` ${parcalar[parcalar.length - 1]?.[0]}.` : ''}`;
      const yeniSoru = {
        id: randomUUID(),
        ilanId,
        soranId: hesap.id,
        soranAd,
        soru,
        tarih: new Date().toISOString(),
        herkeseAcik: false,
      };
      depoyuDegistir((guncel) => {
        const yeni = {
          ...guncel,
          etkilesimler: { ...guncel.etkilesimler, sorular: [...guncel.etkilesimler.sorular, yeniSoru] },
        };
        return sahip
          ? bildirimEkle(yeni, {
              hesapId: sahip.id,
              ilanId,
              soruId: yeniSoru.id,
              tur: 'soru',
              baslik: `${soranAd} ilanına soru sordu`,
              aciklama: `${ilan.baslik}: ${soru}`,
            })
          : yeni;
      });
      haberVer('Sorun satıcıya iletildi.');
      return { basarili: true };
    },
    [depoyuDegistir, haberVer],
  );
  const soruCevapla = useCallback(
    (soruId: string, metin: string, herkeseAcik: boolean): HesapSonucu => {
      const depo = depoRef.current;
      const soru = depo.etkilesimler.sorular.find((s) => s.id === soruId);
      const { ilan, sahip } = soru ? ilanBul(depo, soru.ilanId) : {};
      if (!soru || !ilan || !sahip || sahip.id !== depo.aktifHesap)
        return { basarili: false, hata: 'Yalnızca kendi ilanına gelen soruları cevaplayabilirsin.' };
      const cevap = metin.trim();
      if (cevap.length < 2 || cevap.length > 1000)
        return { basarili: false, hata: 'Cevabını 2–1000 karakter arasında yaz.' };
      depoyuDegistir((guncel) =>
        bildirimEkle(
          {
            ...guncel,
            etkilesimler: {
              ...guncel.etkilesimler,
              sorular: guncel.etkilesimler.sorular.map((s) =>
                s.id === soruId ? { ...s, cevap, cevapTarihi: new Date().toISOString(), herkeseAcik } : s,
              ),
            },
          },
          {
            hesapId: soru.soranId,
            ilanId: soru.ilanId,
            soruId,
            tur: 'cevap',
            baslik: `${sahip.kayit.profil.ad} sorunu cevapladı`,
            aciklama: `${ilan.baslik}: ${cevap}`,
          },
        ),
      );
      haberVer('Cevabın gönderildi.');
      return { basarili: true };
    },
    [depoyuDegistir, haberVer],
  );
  const soruGorunurluguDegistir = useCallback(
    (soruId: string) => {
      depoyuDegistir((depo) => {
        const soru = depo.etkilesimler.sorular.find((s) => s.id === soruId);
        if (!soru?.cevap || ilanBul(depo, soru.ilanId).sahip?.id !== depo.aktifHesap) return depo;
        return {
          ...depo,
          etkilesimler: {
            ...depo.etkilesimler,
            sorular: depo.etkilesimler.sorular.map((s) =>
              s.id === soruId ? { ...s, herkeseAcik: !s.herkeseAcik } : s,
            ),
          },
        };
      });
    },
    [depoyuDegistir],
  );
  const bildirimOku = useCallback(
    (id?: string) => {
      depoyuDegistir((depo) => ({
        ...depo,
        etkilesimler: {
          ...depo.etkilesimler,
          bildirimler: depo.etkilesimler.bildirimler.map((b) =>
            b.hesapId === depo.aktifHesap && (!id || b.id === id) ? { ...b, okundu: true } : b,
          ),
        },
      }));
    },
    [depoyuDegistir],
  );
  const ilaniGoruntule = useCallback(
    (id: string) => {
      depoyuDegistir((depo) => {
        const { ilan, sahip } = ilanBul(depo, id);
        if (!ilan || ilan.yayinDurumu === 'kaldirildi' || (sahip && sahip.id === depo.aktifHesap))
          return depo;
        const etkilesimler = goruntulemeKaydet(
          depo.etkilesimler,
          id,
          depo.aktifHesap ?? 'ziyaretci',
          new Date().toISOString().slice(0, 10),
        );
        return etkilesimler === depo.etkilesimler ? depo : { ...depo, etkilesimler };
      });
    },
    [depoyuDegistir],
  );
  const bildirimler = useMemo(
    () => depo.etkilesimler.bildirimler.filter((b) => b.hesapId === depo.aktifHesap),
    [depo.etkilesimler.bildirimler, depo.aktifHesap],
  );
  const sorular = useMemo(
    () =>
      gorunurSorular(
        [...vitrinSorulari, ...depo.etkilesimler.sorular],
        depo.aktifHesap,
        new Set(kayit.eklenenler.map((ilan) => ilan.id)),
      ),
    [depo.etkilesimler.sorular, depo.aktifHesap, kayit.eklenenler],
  );
  const ilanIstatistikleri = useMemo(
    () =>
      Object.fromEntries(
        kayit.eklenenler.map((ilan) => [
          ilan.id,
          {
            goruntulenme: depo.etkilesimler.goruntulenmeler[ilan.id]?.sayi ?? 0,
            favori: depo.hesaplar.filter(
              (h) => h.id !== depo.aktifHesap && h.kayit.favoriler.includes(ilan.id),
            ).length,
          },
        ]),
      ),
    [kayit.eklenenler, depo.etkilesimler.goruntulenmeler, depo.hesaplar, depo.aktifHesap],
  );
  const saticilar = useMemo<SaticiProfili[]>(
    () =>
      [
        ...katalogSaticilari(ilanlar),
        ...depo.hesaplar.map(({ id, kayit }) => ({
          id,
          ad: kayit.profil.ad,
          konum: kayit.profil.konum,
          hakkinda: kayit.profil.hakkinda,
          fotograf: kayit.profil.fotograf,
          telefon: kayit.profil.telefonGoster ? kayit.profil.telefon : undefined,
        })),
      ].map((satici) => ({
        ...satici,
        ...saticiPuanOzeti(depo.degerlendirmeKaydi.degerlendirmeler, satici.id),
      })),
    [depo.hesaplar, depo.degerlendirmeKaydi.degerlendirmeler],
  );
  const tumIlanlar = useMemo(
    () => [
      ...depo.hesaplar.flatMap((hesap) =>
        hesap.kayit.eklenenler
          .filter((ilan) => ilan.yayinDurumu !== 'kaldirildi')
          .map((ilan) => ({
            ...ilan,
            satici: hesap.kayit.profil.ad,
            saticiId: hesap.id,
            numara: depo.etkilesimler.ilanNumaralari[ilan.id] ?? ilan.numara,
            benim: hesap.id === depo.aktifHesap,
          })),
      ),
      ...depo.misafir.eklenenler
        .filter((ilan) => ilan.yayinDurumu !== 'kaldirildi')
        .map((ilan) => ({ ...ilan, benim: false })),
      ...ilanlar.map((ilan) => ({
        ...ilan,
        saticiId: saticiKimligi(ilan.satici),
        numara: depo.etkilesimler.ilanNumaralari[ilan.id],
        benim: false,
      })),
    ],
    [depo.hesaplar, depo.misafir.eklenenler, depo.aktifHesap, depo.etkilesimler.ilanNumaralari],
  );
  const yayinDegistir = useCallback(
    async (id: string, neden?: IlanKaldirmaNedeni): Promise<HesapSonucu> => {
      const depo = depoRef.current;
      if (!yuklendi.current || !depo.aktifHesap)
        return { basarili: false, hata: 'İlanını yönetmek için giriş yap.' };
      const yeni = ilanYayininiDegistir(depo, depo.aktifHesap, id, neden);
      if (!yeni)
        return { basarili: false, hata: 'Bu işlem yalnızca uygun durumdaki kendi ilanlarında yapılabilir.' };
      const ilan = aktifKayit(yeni).eklenenler.find((kayit) => kayit.id === id)!;
      let sonuc = bildirimEkle(yeni, {
        hesapId: depo.aktifHesap,
        ilanId: id,
        tur: neden ? 'kaldirma' : 'yayin',
        baslik: neden ? 'İlanın yayından kaldırıldı' : 'İlanın yeniden yayında',
        aciklama: neden
          ? `${ilan.baslik} artık ilan listelerinde görünmüyor. İlanın hesabında saklanıyor.`
          : `${ilan.baslik} yeniden yayınlandı.`,
      });
      if (neden)
        for (const hesap of depo.hesaplar) {
          if (hesap.id === depo.aktifHesap || !hesap.kayit.favoriler.includes(id)) continue;
          sonuc = bildirimEkle(sonuc, {
            hesapId: hesap.id,
            ilanId: id,
            tur: 'kaldirma',
            baslik: 'Favorindeki ilan yayından kaldırıldı',
            aciklama: `${ilan.baslik} artık yayında değil.`,
          });
        }
      const oncekiBildirimler = new Set(depo.etkilesimler.bildirimler.map((kayit) => kayit.id));
      const yeniBildirimler = new Set(
        sonuc.etkilesimler.bildirimler
          .filter((kayit) => !oncekiBildirimler.has(kayit.id))
          .map((kayit) => kayit.id),
      );
      uygula(sonuc);
      try {
        await sakla(sonuc);
      } catch {
        const onceki = aktifKayit(depo).eklenenler.find((kayit) => kayit.id === id)!;
        const geri = {
          ...depoRef.current,
          hesaplar: depoRef.current.hesaplar.map((hesap) =>
            hesap.id === depo.aktifHesap
              ? {
                  ...hesap,
                  kayit: {
                    ...hesap.kayit,
                    eklenenler: hesap.kayit.eklenenler.map((kayit) => (kayit === ilan ? onceki : kayit)),
                  },
                }
              : hesap,
          ),
          etkilesimler: {
            ...depoRef.current.etkilesimler,
            bildirimler: depoRef.current.etkilesimler.bildirimler.filter(
              (kayit) => !yeniBildirimler.has(kayit.id),
            ),
          },
        };
        uygula(geri);
        void sakla(geri).catch(() => {});
        return { basarili: false, hata: 'İşlem kaydedilemedi. Depolama alanını kontrol edip tekrar dene.' };
      }
      haberVer(
        neden
          ? 'İlanın yayından kaldırıldı. Hesabından yeniden yayınlayabilirsin.'
          : 'İlanın yeniden yayında.',
      );
      return { basarili: true };
    },
    [haberVer, sakla, uygula],
  );
  const ilaniYayindanKaldir = useCallback(
    (id: string, neden: IlanKaldirmaNedeni) => yayinDegistir(id, neden),
    [yayinDegistir],
  );
  const ilaniYenidenYayinla = useCallback((id: string) => yayinDegistir(id), [yayinDegistir]);
  const ilanSikayetEt = useCallback(
    async (id: string, neden: SikayetNedeni, metin: string): Promise<HesapSonucu> => {
      const depo = depoRef.current;
      if (!yuklendi.current || !depo.aktifHesap)
        return { basarili: false, hata: 'Şikayetini iletmek için giriş yap.' };
      const { ilan, sahip } = ilanBul(depo, id);
      if (!ilan || ilan.yayinDurumu === 'kaldirildi')
        return { basarili: false, hata: 'Bu ilan artık yayında değil.' };
      if (sahip?.id === depo.aktifHesap) return { basarili: false, hata: 'Kendi ilanını şikayet edemezsin.' };
      const aciklama = metin.trim();
      if (!sikayetNedenleri.includes(neden) || aciklama.length < 10 || aciklama.length > 1000)
        return { basarili: false, hata: 'Bir neden seç ve açıklamanı 10–1000 karakter arasında yaz.' };
      if (depo.sikayetler.some((kayit) => kayit.ilanId === id && kayit.hesapId === depo.aktifHesap))
        return { basarili: false, hata: 'Bu ilan için şikayetin zaten kaydedilmiş.' };
      const sikayet = {
        id: randomUUID(),
        ilanId: id,
        hesapId: depo.aktifHesap,
        neden,
        aciklama,
        tarih: new Date().toISOString(),
      };
      const yeni = { ...depo, sikayetler: [...depo.sikayetler, sikayet] };
      uygula(yeni);
      try {
        await sakla(yeni);
      } catch {
        const geri = {
          ...depoRef.current,
          sikayetler: depoRef.current.sikayetler.filter((kayit) => kayit.id !== sikayet.id),
        };
        uygula(geri);
        void sakla(geri).catch(() => {});
        return { basarili: false, hata: 'Şikayetin kaydedilemedi. Tekrar deneyebilirsin.' };
      }
      haberVer('Şikayetin kaydedildi.');
      return { basarili: true };
    },
    [haberVer, sakla, uygula],
  );
  const profilKaydet = useCallback(
    async (profil: Profil): Promise<HesapSonucu> => {
      const hesapId = depoRef.current.aktifHesap;
      if (!yuklendi.current || !hesapId)
        return { basarili: false, hata: 'Profilini kaydetmek için hesabına tekrar giriş yap.' };
      if (profilIsleniyor.current || hesapIsleniyor.current)
        return { basarili: false, hata: 'Profilin kaydediliyor. Biraz bekleyip tekrar dene.' };
      profilIsleniyor.current = true;
      try {
        return await profiliKaliciKaydet(
          { oku: () => depoRef.current, uygula, sakla, medyaSil },
          hesapId,
          profil,
        );
      } finally {
        profilIsleniyor.current = false;
      }
    },
    [sakla, uygula],
  );

  const degerlendirmeKaydet = useCallback(
    (
      guncelle: (
        kayit: DegerlendirmeKaydi,
        hesapId: string,
        depo: HesapDeposu,
      ) => ReturnType<typeof degerlendirmeOlustur>,
    ): Promise<HesapSonucu> => {
      const hesapId = depoRef.current.aktifHesap;
      if (!yuklendi.current || !hesapId)
        return Promise.resolve({ basarili: false, hata: 'Bu işlem için hesabına giriş yap.' });
      // Çift dokunma aynı alışverişe ikinci değerlendirme veya onay oluşturmasın.
      const islem = degerlendirmeYazma.current
        .catch(() => {})
        .then(async (): Promise<HesapSonucu> => {
          const onceki = depoRef.current;
          if (onceki.aktifHesap !== hesapId)
            return { basarili: false, hata: 'Hesabın değişti. İşlemi tekrar başlatabilirsin.' };
          const sonuc = guncelle(onceki.degerlendirmeKaydi, hesapId, onceki);
          if (!sonuc.basarili) return sonuc;
          const yeni = alisverisBildirimleriniEkle(
            { ...onceki, degerlendirmeKaydi: sonuc.kayit },
            onceki.degerlendirmeKaydi,
            hesapId,
          );
          const yeniBildirimler = new Set(
            yeni.etkilesimler.bildirimler
              .filter((bildirim) => !onceki.etkilesimler.bildirimler.includes(bildirim))
              .map((bildirim) => bildirim.id),
          );
          uygula(yeni);
          try {
            await sakla(yeni);
            return { basarili: true };
          } catch {
            if (depoRef.current.degerlendirmeKaydi === sonuc.kayit) {
              const geri = {
                ...depoRef.current,
                degerlendirmeKaydi: onceki.degerlendirmeKaydi,
                etkilesimler: {
                  ...depoRef.current.etkilesimler,
                  bildirimler: depoRef.current.etkilesimler.bildirimler.filter(
                    (bildirim) => !yeniBildirimler.has(bildirim.id),
                  ),
                },
              };
              uygula(geri);
              void sakla(geri).catch(() => {});
            }
            return {
              basarili: false,
              hata: 'İşlem kaydedilemedi. Depolama alanını kontrol edip tekrar dene.',
            };
          }
        });
      degerlendirmeYazma.current = islem.then(() => {});
      return islem;
    },
    [sakla, uygula],
  );
  const alisverisTalepEt = useCallback(
    (ilanId: string) =>
      degerlendirmeKaydet((kayit, hesapId, depo) => {
        const { ilan, sahip } = ilanBul(depo, ilanId);
        if (!ilan || ilan.yayinDurumu === 'kaldirildi')
          return { basarili: false, hata: 'Bu ilan artık yayında değil.' };
        const alici = depo.hesaplar.find((hesap) => hesap.id === hesapId)!;
        return alisverisTalebiOlustur(kayit, {
          id: randomUUID(),
          ilanId,
          ilanBasligi: ilan.baslik,
          aliciId: hesapId,
          aliciAd: alici.kayit.profil.ad,
          saticiId: sahip?.id ?? saticiKimligi(ilan.satici),
          saticiAd: sahip?.kayit.profil.ad ?? ilan.satici,
          tarih: new Date().toISOString(),
        });
      }),
    [degerlendirmeKaydet],
  );
  const alisverisiOnayla = useCallback(
    (id: string) =>
      degerlendirmeKaydet((kayit, hesapId) =>
        alisverisTesliminiOnayla(kayit, id, hesapId, new Date().toISOString()),
      ),
    [degerlendirmeKaydet],
  );
  const alisverisiIptalEt = useCallback(
    (id: string) =>
      degerlendirmeKaydet((kayit, hesapId) =>
        alisverisTalebiniIptalEt(kayit, id, hesapId, new Date().toISOString()),
      ),
    [degerlendirmeKaydet],
  );
  const saticiyiDegerlendir = useCallback(
    (bilgi: { alisverisId: string; puan: number; yorum: string }) =>
      degerlendirmeKaydet((kayit, hesapId) =>
        degerlendirmeOlustur(kayit, { ...bilgi, id: randomUUID() }, hesapId, new Date().toISOString()),
      ),
    [degerlendirmeKaydet],
  );
  const degerlendirmeGuncelle = useCallback(
    (id: string, bilgi: { puan: number; yorum: string }) =>
      degerlendirmeKaydet((kayit, hesapId) =>
        degerlendirmeyiGuncelle(kayit, id, bilgi, hesapId, new Date().toISOString()),
      ),
    [degerlendirmeKaydet],
  );
  const degerlendirmeSil = useCallback(
    (id: string) => degerlendirmeKaydet((kayit, hesapId) => degerlendirmeyiSil(kayit, id, hesapId)),
    [degerlendirmeKaydet],
  );
  const degerlendirmeCevapla = useCallback(
    (id: string, cevap: string) =>
      degerlendirmeKaydet((kayit, hesapId) =>
        degerlendirmeyeCevapVer(kayit, id, cevap, hesapId, new Date().toISOString()),
      ),
    [degerlendirmeKaydet],
  );
  const alisverisler = useMemo(
    () =>
      depo.degerlendirmeKaydi.alisverisler.filter(
        (islem) => !!oturum && [islem.aliciId, islem.saticiId].includes(oturum.id),
      ),
    [depo.degerlendirmeKaydi.alisverisler, oturum],
  );
  const degerlendirmeHakkiKullanilanlar = useMemo(
    () => [
      ...depo.degerlendirmeKaydi.degerlendirmeler.map((kayit) => kayit.alisverisId),
      ...depo.degerlendirmeKaydi.silinenDegerlendirmeler,
    ],
    [depo.degerlendirmeKaydi],
  );

  return (
    <PazarBaglami.Provider
      value={{
        ...kayit,
        hazir,
        bildirim,
        oturum,
        bildirimler,
        okunmamisBildirimSayisi: bildirimler.filter((b) => !b.okundu).length,
        bildirimOku,
        sorular,
        soruSor,
        soruCevapla,
        soruGorunurluguDegistir,
        ilaniGoruntule,
        ilanIstatistikleri,
        girisYap,
        kayitOl,
        cikisYap,
        tumIlanlar,
        saticilar,
        alisverisler,
        degerlendirmeler: depo.degerlendirmeKaydi.degerlendirmeler,
        degerlendirmeHakkiKullanilanlar,
        alisverisTalepEt,
        alisverisiOnayla,
        alisverisiIptalEt,
        saticiyiDegerlendir,
        degerlendirmeGuncelle,
        degerlendirmeSil,
        degerlendirmeCevapla,
        favoriDegistir,
        ilanEkle,
        ilanGuncelle,
        ilanOneCikar,
        ilanSil,
        ilaniYayindanKaldir,
        ilaniYenidenYayinla,
        ilanSikayetEt,
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
