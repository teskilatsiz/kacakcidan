import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Check from 'lucide-react-native/icons/check';
import CheckCircle2 from 'lucide-react-native/icons/circle-check';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import ImagePlus from 'lucide-react-native/icons/image-plus';
import Package from 'lucide-react-native/icons/package';
import Pencil from 'lucide-react-native/icons/pencil';
import Video from 'lucide-react-native/icons/video';
import X from 'lucide-react-native/icons/x';
import Camera from 'lucide-react-native/icons/camera';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapGerekli } from '../bilesenler/HesapGerekli';
import { Alan, Baslik, BosDurum, Buton, Secenek, Yazi } from '../bilesenler/Temel';
import { Giris, HareketliBas } from '../bilesenler/Hareketli';
import { Gorsel } from '../bilesenler/Gorsel';
import { VideoOynatici } from '../bilesenler/VideoOynatici';
import { SecimAlani } from '../bilesenler/SecimAlani';
import { usePazar } from '../durum/Pazar';
import { medyaSec } from '../durum/medyaSecici';
import { medyaBoyutlariniOku, medyaKaydet, medyaOnizlemesiniBirak, medyaSil } from '../durum/medyaDeposu';
import { fotografHatasi, MEDYA_SINIRLARI, megabayt, videoHatasi } from '../veri/medya';
import { kategoriYapisi } from '../veri/kategoriler';
import { ozellikAlanlari, ozellikleriTemizle } from '../veri/ozellikler';
import { ilceSecenekleri, iller, konumuAyir, konumuBirlestir } from '../veri/konumlar';
import { kategoriler, ilanYolu, para, type Ilan, type Kategori } from '../veri/ilanlar';
import { kalin, ortak, renk, useEkran } from '../tasarim/tema';

const adimlar = ['Kategori', 'Fotoğraf & video', 'İlan bilgileri', 'Önizleme'];
export default function IlanVer({ duzenleme = false }: { duzenleme?: boolean } = {}) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { eklenenler, hazir, oturum } = usePazar();
  const router = useRouter();
  const ilan = duzenleme && typeof id === 'string' ? eklenenler.find((kayit) => kayit.id === id) : undefined;
  if (!hazir || !oturum)
    return (
      <HesapGerekli
        baslik={duzenleme ? 'İlanını düzenlemek için giriş yap' : 'İlan vermek için giriş yap'}
        aciklama="İlanlarını hesabından yönet, bilgilerini ve fotoğraflarını güncelle."
        donus={duzenleme ? `/ilan-duzenle?id=${encodeURIComponent(id ?? '')}` : '/ilan-ver'}
      />
    );
  if (duzenleme && !ilan)
    return (
      <Kabuk>
        <View style={[ortak.alan, { maxWidth: 650, padding: 24 }]}>
          <BosDurum
            simge={<Package size={28} />}
            baslik="Bu ilan düzenlenemiyor"
            aciklama="İlan kaldırılmış olabilir. Düzenlemek istediğin ilanı hesabındaki ilanlardan seç."
            eylem={<Buton onPress={() => router.replace('/profil')}>İlanlarım</Buton>}
          />
        </View>
      </Kabuk>
    );
  return <IlanFormu key={`${oturum.id}:${ilan?.id ?? 'yeni'}`} ilan={ilan} hesapId={oturum.id} />;
}

function IlanFormu({ ilan, hesapId }: { ilan?: Ilan; hesapId: string }) {
  const { mobil, dar, bosluk } = useEkran();
  const { profil, ilanEkle, ilanGuncelle, hazir, oturum } = usePazar();
  const router = useRouter();
  const ilkYapi = ilan ? kategoriYapisi(ilan.kategori, ilan.altKategori) : undefined;
  const ilkAltKategoriGecerli = Boolean(
    ilan?.altKategori && ilkYapi?.altKategoriler.some((secenek) => secenek.id === ilan.altKategori),
  );
  const ilkAltYapi =
    ilan && ilkAltKategoriGecerli ? kategoriYapisi(ilan.kategori, ilan.altKategori) : undefined;
  const bilinenMarka = ilkAltYapi?.markalar.some((secenek) => secenek.id === ilan?.marka);
  const bilinenModel = ilkAltYapi?.modeller[ilan?.marka ?? '']?.some((secenek) => secenek.id === ilan?.model);
  const [adim, setAdim] = useState(1);
  const [kategori, setKategori] = useState<Kategori | ''>(ilan?.kategori ?? '');
  const [altKategori, setAltKategori] = useState(ilkAltKategoriGecerli ? (ilan?.altKategori ?? '') : '');
  const [marka, setMarka] = useState(
    ilan?.marka && ilkAltKategoriGecerli
      ? bilinenMarka || ilan.marka === 'markasiz'
        ? ilan.marka
        : 'diger'
      : '',
  );
  const [digerMarka, setDigerMarka] = useState(
    ilan?.marka && ilkAltKategoriGecerli && !bilinenMarka && ilan.marka !== 'markasiz' ? ilan.marka : '',
  );
  const [model, setModel] = useState(
    ilan?.model && ilkAltKategoriGecerli ? (bilinenModel ? ilan.model : 'diger') : '',
  );
  const [digerModel, setDigerModel] = useState(
    ilan?.model && ilkAltKategoriGecerli && !bilinenModel ? ilan.model : '',
  );
  const [fotograflar, setFotograflar] = useState<ImagePickerAsset[]>(() =>
    ilan
      ? [...new Set([ilan.gorsel, ...(ilan.fotografler ?? [])])].map((uri) => ({ uri, width: 1, height: 1 }))
      : [],
  );
  const [video, setVideo] = useState<ImagePickerAsset | undefined>(() =>
    ilan?.video ? { uri: ilan.video, width: 1, height: 1 } : undefined,
  );
  const [baslik, setBaslik] = useState(ilan?.baslik ?? '');
  const [fiyat, setFiyat] = useState(ilan ? String(ilan.fiyat).replace('.', ',') : '');
  const [durum, setDurum] = useState<Ilan['durum']>(ilan?.durum ?? 'İkinci el');
  const [aciklama, setAciklama] = useState(ilan?.aciklama ?? '');
  const [konum, setKonum] = useState(ilan?.konum ?? profil.konum);
  const [konumaDokunuldu, setKonumaDokunuldu] = useState(Boolean(ilan));
  const [takas, setTakas] = useState(ilan?.takas ?? false);
  const [ozellikler, setOzellikler] = useState<Record<string, string>>(ilan?.ozellikler ?? {});
  const [hata, setHata] = useState('');
  const [alanHatalari, setAlanHatalari] = useState<Record<string, string>>({});
  const [calisiyor, setCalisiyor] = useState(false);
  const [medyaHazir, setMedyaHazir] = useState(!ilan);
  const [kaydedilen, setKaydedilen] = useState<Ilan>();
  const baslikAlani = useRef<ComponentRef<typeof View>>(null);
  const medyalar = useRef<ImagePickerAsset[]>([]);
  const ilkFotograflar = useRef(fotograflar.map((fotograf) => fotograf.uri));
  const etkin = useRef(true);
  const islemSuruyor = useRef(false);
  const ilkMedya = useMemo(
    () =>
      new Set(ilan ? [ilan.gorsel, ...(ilan.fotografler ?? []), ...(ilan.video ? [ilan.video] : [])] : []),
    [ilan],
  );
  medyalar.current = [...fotograflar, ...(video ? [video] : [])];

  useEffect(() => {
    if (hazir && !konumaDokunuldu) setKonum(profil.konum);
  }, [hazir, profil.konum, konumaDokunuldu]);
  useEffect(() => {
    etkin.current = true;
    let gecerli = true;
    void medyaBoyutlariniOku(ilkFotograflar.current)
      .then((boyutlar) => {
        if (!gecerli) return;
        setFotograflar((onceki) =>
          onceki.map((fotograf) => ({ ...fotograf, fileSize: boyutlar[fotograf.uri] ?? fotograf.fileSize })),
        );
        setMedyaHazir(true);
      })
      .catch((sorun) => {
        if (gecerli)
          setHata(
            sorun instanceof Error
              ? sorun.message
              : 'Fotoğraf bilgileri okunamadı. Sayfayı yenileyip tekrar dene.',
          );
      });
    return () => {
      gecerli = false;
      etkin.current = false;
      medyalar.current.forEach((medya) => medyaOnizlemesiniBirak(medya.uri));
    };
  }, []);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const oge = baslikAlani.current as unknown as HTMLElement | null;
      oge?.focus?.();
    }
  }, [adim, kaydedilen]);

  const yapi = kategori ? kategoriYapisi(kategori, altKategori) : undefined;
  const altKategoriEtiketi = yapi?.altKategoriBasligi
    .replace('Alt kategoriler', 'Alt kategori')
    .replace('Ürün grupları', 'Ürün grubu')
    .replace('Ekipman türleri', 'Ekipman türü')
    .replace('Araç türleri', 'Araç türü')
    .replace('Koleksiyon türleri', 'Koleksiyon türü');
  const markaSecenekleri = yapi?.markalar.filter((m) => !['diger', 'markasiz'].includes(m.id)) ?? [];
  const modelSecenekleri = yapi?.modeller[marka] ?? [];
  const kategoriAdi = kategoriler.find((k) => k.id === kategori)?.ad;
  const altKategoriAdi = yapi?.altKategoriler.find((k) => k.id === altKategori)?.ad;
  const markaAdi =
    marka === 'diger'
      ? digerMarka.trim()
      : marka === 'markasiz'
        ? 'Markasız'
        : markaSecenekleri.find((m) => m.id === marka)?.ad;
  const modelAdi = model === 'diger' ? digerModel.trim() : modelSecenekleri.find((m) => m.id === model)?.ad;
  const kategoriYolu = [kategoriAdi, altKategoriAdi, markaAdi, modelAdi].filter(Boolean).join(' / ');
  const sayisalFiyat = Number(fiyat.replace(',', '.'));
  const kapak = fotograflar[0];
  const seciliKonum = useMemo(() => konumuAyir(konum), [konum]);

  const teknikAlanlar = useMemo(
    () => (kategori ? ozellikAlanlari({ kategori, altKategori, marka, model }) : []),
    [kategori, altKategori, marka, model],
  );
  useEffect(() => {
    setOzellikler((onceki) => {
      const yeni = ozellikleriTemizle(teknikAlanlar, onceki);
      return JSON.stringify(yeni) === JSON.stringify(onceki) ? onceki : yeni;
    });
  }, [teknikAlanlar]);

  function kategoriSec(deger: string) {
    const yeni = deger as Kategori;
    const altlar = kategoriYapisi(yeni).altKategoriler;
    setKategori(yeni);
    setAltKategori(altlar.length === 1 ? altlar[0]!.id : '');
    setMarka('');
    setModel('');
    setDigerMarka('');
    setDigerModel('');
    setOzellikler({});
    setHata('');
  }
  function altKategoriSec(deger: string) {
    setAltKategori(deger);
    setMarka('');
    setModel('');
    setDigerMarka('');
    setDigerModel('');
    setOzellikler({});
    setHata('');
  }
  function markaSec(deger: string) {
    setMarka(deger);
    setModel('');
    setDigerModel('');
    setHata('');
  }
  function modelSec(deger: string) {
    setModel(deger);
    setHata('');
  }

  function hataSil(alan: string) {
    setAlanHatalari((onceki) => ({ ...onceki, [alan]: '' }));
    setHata('');
  }
  function adimaGit(yeni: number) {
    Keyboard.dismiss();
    setHata('');
    setAlanHatalari({});
    setAdim(yeni);
  }
  function kategoriDenetle() {
    if (!kategori) return 'Önce ürününün kategorisini seç.';
    if (!altKategori) return 'Ürünün için bir alt kategori seç.';
    if (!marka) return 'Bir marka seç. Ürünün markasızsa Markasız seçeneğini kullanabilirsin.';
    if (marka === 'diger' && digerMarka.trim().length < 2) return 'Ürünün markasını yaz.';
    if ((modelSecenekleri.length > 0 || marka === 'diger') && !model)
      return 'Ürünün modelini seç veya Diğer model seçeneğine modelini yaz.';
    if (model === 'diger' && digerModel.trim().length < 2) return 'Ürünün modelini yaz.';
    return '';
  }
  function bilgileriDenetle() {
    const hatalar: Record<string, string> = {};
    if (baslik.trim().length < 5) hatalar.baslik = 'Başlık en az 5 karakter olmalı.';
    if (!fiyat.trim() || !Number.isFinite(sayisalFiyat) || sayisalFiyat < 1 || sayisalFiyat > 999999999)
      hatalar.fiyat = '1 TL ile 999.999.999 TL arasında bir fiyat yaz.';
    if (!seciliKonum.il) hatalar.il = 'İlanın bulunduğu ili seç.';
    if (!seciliKonum.ilce) hatalar.ilce = 'İlanın bulunduğu ilçeyi seç.';
    if (aciklama.trim().length < 20)
      hatalar.aciklama = 'Ürünün hakkında en az 20 karakterlik bir açıklama yaz.';
    for (const alan of teknikAlanlar) {
      const deger = ozellikler[alan.ad];
      if (alan.sayisal && deger && Number(deger) > (alan.enCok ?? Number.MAX_SAFE_INTEGER))
        hatalar[alan.ad] = `${alan.ad} en fazla ${alan.enCok?.toLocaleString('tr-TR')} olabilir.`;
    }
    return hatalar;
  }
  function devam() {
    setHata('');
    if (adim === 1) {
      const sorun = kategoriDenetle();
      if (sorun) {
        setHata(sorun);
        return;
      }
    }
    if (adim === 2 && !fotograflar.length) {
      setHata('İlanına en az bir fotoğraf ekle.');
      return;
    }
    if (adim === 3) {
      const hatalar = bilgileriDenetle();
      setAlanHatalari(hatalar);
      if (Object.keys(hatalar).length) {
        setHata('İşaretli alanları kontrol edip devam edebilirsin.');
        return;
      }
    }
    adimaGit(adim + 1);
  }

  async function dosyaSec(tur: 'fotograf' | 'video') {
    if (islemSuruyor.current || (tur === 'fotograf' && !medyaHazir)) return;
    islemSuruyor.current = true;
    setHata('');
    setCalisiyor(true);
    try {
      const secilenler = await medyaSec(tur, tur === 'fotograf' ? fotograflar : []);
      if (!etkin.current) {
        secilenler.forEach((medya) => medyaOnizlemesiniBirak(medya.uri));
        return;
      }
      if (tur === 'fotograf') {
        const yeni = [...fotograflar];
        let sorun = '';
        for (const medya of secilenler) {
          const aynisiVar = yeni.some(
            (f) =>
              f.uri === medya.uri ||
              (f.file &&
                medya.file &&
                f.file.name === medya.file.name &&
                f.file.size === medya.file.size &&
                f.file.lastModified === medya.file.lastModified),
          );
          const dosyaHatasi = aynisiVar ? 'Bu fotoğraf zaten ekli.' : fotografHatasi(medya, yeni);
          if (dosyaHatasi) {
            sorun = dosyaHatasi;
            medyaOnizlemesiniBirak(medya.uri);
          } else yeni.push(medya);
        }
        setFotograflar(yeni);
        if (sorun) setHata(sorun);
      } else if (secilenler[0]) {
        const secilen = secilenler[0];
        const sorun = videoHatasi(secilen, Platform.OS === 'web');
        if (sorun) {
          medyaOnizlemesiniBirak(secilen.uri);
          setHata(sorun);
        } else {
          if (video) medyaOnizlemesiniBirak(video.uri);
          setVideo(secilen);
        }
      }
    } catch (hata) {
      setHata(hata instanceof Error ? hata.message : 'Dosya seçilemedi. Tekrar deneyebilirsin.');
    } finally {
      islemSuruyor.current = false;
      if (etkin.current) setCalisiyor(false);
    }
  }
  function fotografiSil(sira: number) {
    if (islemSuruyor.current) return;
    const silinecek = fotograflar[sira];
    if (silinecek) medyaOnizlemesiniBirak(silinecek.uri);
    setFotograflar((onceki) => onceki.filter((_, i) => i !== sira));
    setHata('');
  }
  function fotografiTasi(sira: number, hedef: number) {
    if (islemSuruyor.current || hedef < 0 || hedef >= fotograflar.length) return;
    setFotograflar((onceki) => {
      const yeni = [...onceki];
      const [secilen] = yeni.splice(sira, 1);
      if (secilen) yeni.splice(hedef, 0, secilen);
      return yeni;
    });
  }
  async function kaydet() {
    if (islemSuruyor.current || !hazir) return;
    if (oturum?.id !== hesapId) {
      setHata('Oturumun değişti. İlanlarını hesabından tekrar aç.');
      return;
    }
    const kategoriHatasi = kategoriDenetle();
    if (kategoriHatasi) {
      adimaGit(1);
      setHata(kategoriHatasi);
      return;
    }
    if (!kategori || !kapak) {
      adimaGit(2);
      setHata('En az bir fotoğraf ekle.');
      return;
    }
    const bilgiHatalari = bilgileriDenetle();
    if (Object.keys(bilgiHatalari).length) {
      adimaGit(3);
      setAlanHatalari(bilgiHatalari);
      return;
    }
    islemSuruyor.current = true;
    setCalisiyor(true);
    setHata('');
    const kayitlar: string[] = [];
    try {
      const medyayiSakla = async (medya: ImagePickerAsset) => {
        if (ilkMedya.has(medya.uri)) return medya.uri;
        const kaynak = await medyaKaydet(medya);
        kayitlar.push(kaynak);
        return kaynak;
      };
      const fotografKayitlari: string[] = [];
      for (const fotograf of fotograflar) fotografKayitlari.push(await medyayiSakla(fotograf));
      const videoKaydi = video ? await medyayiSakla(video) : undefined;
      const yeni: Ilan = {
        id: ilan?.id ?? `yerel-${Date.now()}`,
        baslik: baslik.trim(),
        kategori,
        altKategori,
        marka: marka === 'diger' ? digerMarka.trim() : marka,
        model: model === 'diger' ? digerModel.trim() : model || undefined,
        fiyat: sayisalFiyat,
        durum,
        aciklama: aciklama.trim(),
        konum: konumuBirlestir(seciliKonum.il, seciliKonum.ilce),
        gorsel: fotografKayitlari[0]!,
        fotografler: fotografKayitlari,
        video: videoKaydi,
        ozellikler: ozellikleriTemizle(teknikAlanlar, ozellikler),
        satici: profil.ad,
        benim: true,
        takas,
        zaman: ilan?.zaman ?? 'Az önce',
      };
      const sonuc = await (ilan ? ilanGuncelle(yeni, hesapId) : ilanEkle(yeni, hesapId));
      if (!sonuc.basarili) throw new Error(sonuc.hata ?? 'İlan kaydedilemedi. Tekrar dene.');
      setKaydedilen(yeni);
    } catch (sorun) {
      await Promise.allSettled(kayitlar.map(medyaSil));
      setHata(
        sorun instanceof Error
          ? sorun.message
          : 'İlan kaydedilemedi. Depolama alanını kontrol edip tekrar dene; bilgilerin burada duruyor.',
      );
    } finally {
      islemSuruyor.current = false;
      if (etkin.current) setCalisiyor(false);
    }
  }

  return (
    <Kabuk altBilgi={false}>
      <View
        style={[
          ortak.alan,
          { maxWidth: 1120, paddingHorizontal: bosluk, paddingTop: mobil ? 18 : 30, paddingBottom: 32 },
        ]}
      >
        {kaydedilen ? (
          <Giris style={{ alignItems: 'center', paddingVertical: mobil ? 40 : 70, gap: 20 }}>
            <View style={s.tamam}>
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </View>
            <Baslik buyuk>{ilan ? 'İlanın güncellendi.' : 'İlanın hazır.'}</Baslik>
            <Yazi style={{ textAlign: 'center', color: renk.gri }}>{kaydedilen.baslik}</Yazi>
            <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 25, lineHeight: 34 }}>
              {para(kaydedilen.fiyat)}
            </Yazi>
            <View style={{ flexDirection: mobil ? 'column' : 'row', gap: 12 }}>
              <Buton onPress={() => router.replace(ilanYolu(kaydedilen))} simge={<ArrowRight size={18} />}>
                İlanı görüntüle
              </Buton>
              <Buton ikincil onPress={() => router.replace('/profil')}>
                İlanlarım
              </Buton>
            </View>
          </Giris>
        ) : (
          <>
            <View style={{ gap: 6, marginBottom: mobil ? 18 : 24 }}>
              <Baslik buyuk>{ilan ? 'İlanı düzenle' : 'İlan oluştur'}</Baslik>
              <Yazi style={{ color: renk.gri, fontSize: 13 }}>
                {ilan
                  ? 'Bilgilerini güncelle, değişikliklerini gözden geçirip kaydet.'
                  : 'Ürününü anlat, fotoğraflarını ekle, son bir kez gözden geçir.'}
              </Yazi>
            </View>
            <View
              accessibilityRole="progressbar"
              aria-valuemin={1}
              aria-valuemax={4}
              aria-valuenow={adim}
              aria-valuetext={`${adim}. adım: ${adimlar[adim - 1]}`}
              accessibilityLabel={ilan ? 'İlan düzenleme adımları' : 'İlan oluşturma adımları'}
              accessibilityValue={{ min: 1, max: 4, now: adim, text: `${adim}. adım: ${adimlar[adim - 1]}` }}
              style={{ height: 3, backgroundColor: renk.cizgi, borderRadius: 2, marginBottom: 18 }}
            >
              <View
                style={{ height: 3, backgroundColor: renk.murekkep, width: `${adim * 25}%`, borderRadius: 2 }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: mobil ? 18 : 26, gap: mobil ? 6 : 18 }}>
              {adimlar.map((ad, i) => (
                <HareketliBas
                  key={ad}
                  accessibilityRole="button"
                  accessibilityLabel={`${i + 1}. ${ad}${adim === i + 1 ? ', şu anki adım' : ''}`}
                  accessibilityState={{ selected: adim === i + 1, disabled: i + 1 >= adim || calisiyor }}
                  disabled={i + 1 >= adim || calisiyor}
                  onPress={() => adimaGit(i + 1)}
                  style={{
                    flex: 1,
                    flexDirection: mobil ? 'column' : 'row',
                    alignItems: mobil ? 'flex-start' : 'center',
                    gap: 8,
                    minHeight: 44,
                  }}
                >
                  <View style={[s.adimNo, { backgroundColor: adim >= i + 1 ? renk.murekkep : '#edeee8' }]}>
                    {adim > i + 1 ? (
                      <Check size={14} color="#fff" />
                    ) : (
                      <Yazi
                        style={{ color: adim === i + 1 ? '#fff' : renk.gri, fontSize: 12, fontWeight: '700' }}
                      >
                        {i + 1}
                      </Yazi>
                    )}
                  </View>
                  <Yazi
                    style={{
                      fontSize: mobil ? 10 : 12,
                      lineHeight: 17,
                      fontWeight: adim === i + 1 ? '700' : '400',
                      color: adim >= i + 1 ? renk.murekkep : renk.gri,
                    }}
                  >
                    {ad}
                  </Yazi>
                </HareketliBas>
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
              <View
                style={[ortak.kart, { flex: 1, minWidth: 0, padding: mobil ? 16 : 28, gap: mobil ? 18 : 24 }]}
              >
                <View ref={baslikAlani} tabIndex={-1} style={{ gap: 6 }}>
                  <Baslik style={{ fontSize: mobil ? 22 : 25 }}>
                    {
                      [
                        'Neyi satıyorsun?',
                        'Ürünün her açıdan görünsün.',
                        'Alıcının merak edecekleri',
                        'Son bir kez gözden geçir.',
                      ][adim - 1]
                    }
                  </Baslik>
                  <Yazi style={{ fontSize: 12, color: renk.gri }}>
                    {
                      [
                        'Doğru kategori, ürününün daha kolay bulunmasını sağlar.',
                        'İlk fotoğraf ilanının kapağı olacak. Sıralamayı değiştirebilirsin.',
                        'Açık bir başlık ve dürüst bir açıklama alışverişi kolaylaştırır.',
                        'Bir şey eksikse ilgili bölüme dönüp düzenleyebilirsin.',
                      ][adim - 1]
                    }
                  </Yazi>
                </View>

                {adim === 1 ? (
                  <View style={{ gap: 20 }}>
                    {kategoriYolu ? (
                      <View
                        accessibilityRole="text"
                        style={{
                          minHeight: 40,
                          justifyContent: 'center',
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: renk.zemin,
                        }}
                      >
                        <Yazi numberOfLines={2} style={{ color: renk.gri, fontSize: 12, lineHeight: 18 }}>
                          {kategoriYolu}
                        </Yazi>
                      </View>
                    ) : null}
                    <SecimAlani
                      etiket="Kategori"
                      deger={kategori}
                      secenekler={kategoriler}
                      degistir={kategoriSec}
                      ipucu="Ürününün kategorisini seç"
                      gerekli
                    />
                    <SecimAlani
                      etiket={altKategoriEtiketi ?? 'Alt kategori'}
                      deger={altKategori}
                      secenekler={yapi?.altKategoriler ?? []}
                      degistir={altKategoriSec}
                      ipucu={kategori ? 'Alt kategori seç' : 'Önce kategori seç'}
                      disabled={!kategori}
                      gerekli
                    />
                    <View style={{ flexDirection: mobil ? 'column' : 'row', gap: 18 }}>
                      <View style={{ flex: 1, minWidth: 0, gap: 14 }}>
                        <SecimAlani
                          etiket={yapi?.markaBasligi ?? 'Marka'}
                          deger={marka}
                          secenekler={[
                            ...markaSecenekleri,
                            { id: 'diger', ad: 'Diğer marka' },
                            { id: 'markasiz', ad: 'Markasız' },
                          ]}
                          degistir={markaSec}
                          ipucu={altKategori ? 'Marka seç' : 'Önce alt kategori seç'}
                          disabled={!altKategori}
                          gerekli
                        />
                        {marka === 'diger' ? (
                          <Alan
                            nativeID="ilan-marka-adi"
                            etiket="Marka adı"
                            placeholder="Listede bulunmayan marka"
                            value={digerMarka}
                            onChangeText={setDigerMarka}
                            maxLength={50}
                          />
                        ) : null}
                      </View>
                      <View style={{ flex: 1, minWidth: 0, gap: 14 }}>
                        <SecimAlani
                          etiket={yapi?.modelBasligi ?? 'Model'}
                          deger={model}
                          secenekler={[
                            ...modelSecenekleri.filter((m) => m.id !== 'diger'),
                            ...(marka ? [{ id: 'diger', ad: 'Diğer model' }] : []),
                          ]}
                          degistir={modelSec}
                          ipucu={marka ? 'Model seç' : 'Önce marka seç'}
                          disabled={!marka}
                          gerekli={modelSecenekleri.length > 0 || marka === 'diger'}
                        />
                        {model === 'diger' ? (
                          <Alan
                            nativeID="ilan-model-adi"
                            etiket="Model adı"
                            placeholder="Listede bulunmayan model"
                            value={digerModel}
                            onChangeText={setDigerModel}
                            maxLength={60}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                ) : null}

                {adim === 2 ? (
                  <View style={{ gap: 24 }}>
                    <View style={ortak.aralikli}>
                      <Yazi style={s.etiket}>Fotoğraflar</Yazi>
                      <Yazi style={{ fontSize: 12, color: renk.gri }}>
                        {fotograflar.length} / {MEDYA_SINIRLARI.fotografSayisi}
                      </Yazi>
                    </View>
                    {fotograflar.length ? (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                        {fotograflar.map((fotograf, i) => (
                          <View
                            key={fotograf.uri}
                            style={{ flexBasis: mobil ? '47%' : '30.5%', minWidth: 0, gap: 6 }}
                          >
                            <View
                              style={{
                                aspectRatio: 1.15,
                                borderRadius: 10,
                                overflow: 'hidden',
                                backgroundColor: renk.zemin,
                              }}
                            >
                              <Gorsel
                                source={{ uri: fotograf.uri }}
                                accessibilityLabel={`${i + 1}. ilan fotoğrafı${i === 0 ? ', kapak' : ''}`}
                                style={StyleSheet.absoluteFill}
                                contentFit="cover"
                              />
                              {i === 0 ? (
                                <View style={s.kapak}>
                                  <Yazi style={{ fontSize: 10, fontWeight: '700' }}>Kapak</Yazi>
                                </View>
                              ) : null}
                              <HareketliBas
                                accessibilityRole="button"
                                accessibilityLabel={`${i + 1}. fotoğrafı kaldır`}
                                onPress={() => fotografiSil(i)}
                                style={s.kaldir}
                              >
                                <X size={16} />
                              </HareketliBas>
                            </View>
                            <Yazi numberOfLines={1} style={{ fontSize: 10, color: renk.gri }}>
                              {fotograf.fileName || `${i + 1}. fotoğraf`}
                            </Yazi>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <HareketliBas
                                accessibilityRole="button"
                                accessibilityLabel={`${i + 1}. fotoğrafı sola taşı`}
                                disabled={i === 0}
                                accessibilityState={{ disabled: i === 0 }}
                                onPress={() => fotografiTasi(i, i - 1)}
                                style={[s.siraDugmesi, i === 0 && { opacity: 0.3 }]}
                              >
                                <ChevronLeft size={16} />
                              </HareketliBas>
                              <HareketliBas
                                accessibilityRole="button"
                                accessibilityLabel={`${i + 1}. fotoğrafı sağa taşı`}
                                disabled={i === fotograflar.length - 1}
                                accessibilityState={{ disabled: i === fotograflar.length - 1 }}
                                onPress={() => fotografiTasi(i, i + 1)}
                                style={[s.siraDugmesi, i === fotograflar.length - 1 && { opacity: 0.3 }]}
                              >
                                <ChevronRight size={16} />
                              </HareketliBas>
                              {i > 0 ? (
                                <HareketliBas
                                  accessibilityRole="button"
                                  accessibilityLabel={`${i + 1}. fotoğrafı kapak yap`}
                                  onPress={() => fotografiTasi(i, 0)}
                                  style={{
                                    minHeight: 40,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                  }}
                                >
                                  <Yazi style={{ fontSize: 10, textDecorationLine: 'underline' }}>
                                    Kapak yap
                                  </Yazi>
                                </HareketliBas>
                              ) : null}
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : null}
                    {fotograflar.length < MEDYA_SINIRLARI.fotografSayisi ? (
                      <HareketliBas
                        accessibilityRole="button"
                        disabled={calisiyor || !medyaHazir}
                        accessibilityLabel="Fotoğraf ekle"
                        onPress={() => dosyaSec('fotograf')}
                        style={s.yukle}
                      >
                        <ImagePlus size={30} strokeWidth={1.4} color={renk.gri} />
                        <Yazi style={{ fontWeight: '700', fontSize: 14 }}>
                          {fotograflar.length ? 'Fotoğraf ekle' : 'Fotoğraflarını seç'}
                        </Yazi>
                        <Yazi style={{ fontSize: 11, color: renk.gri, textAlign: 'center' }}>
                          JPG, PNG, WebP · Fotoğraf başına {megabayt(MEDYA_SINIRLARI.fotografBoyutu)} MB ·
                          Toplam {megabayt(MEDYA_SINIRLARI.toplamFotografBoyutu)} MB
                        </Yazi>
                        <Yazi style={{ fontSize: 11, color: renk.gri }}>
                          Birden fazla fotoğraf seçebilirsin.
                        </Yazi>
                      </HareketliBas>
                    ) : null}
                    <View style={{ gap: 14, paddingTop: 20, borderTopWidth: 1, borderTopColor: renk.cizgi }}>
                      <View style={ortak.aralikli}>
                        <Yazi style={s.etiket}>Ürün videosu</Yazi>
                        <Yazi style={{ fontSize: 11, color: renk.gri }}>İsteğe bağlı</Yazi>
                      </View>
                      {video ? (
                        <>
                          <VideoOynatici kaynak={video.uri} baslik="Seçtiğin ürün videosu" />
                          <Yazi numberOfLines={1} style={{ fontSize: 11, color: renk.gri }}>
                            {video.fileName || 'Ürün videosu'}
                          </Yazi>
                          <View style={ortak.aralikli}>
                            <Buton ikincil disabled={calisiyor} onPress={() => dosyaSec('video')}>
                              Videoyu değiştir
                            </Buton>
                            <HareketliBas
                              accessibilityRole="button"
                              onPress={() => {
                                if (islemSuruyor.current) return;
                                medyaOnizlemesiniBirak(video.uri);
                                setVideo(undefined);
                              }}
                              style={{ minHeight: 44, justifyContent: 'center' }}
                            >
                              <Yazi style={{ fontSize: 12, color: '#a63327' }}>Videoyu kaldır</Yazi>
                            </HareketliBas>
                          </View>
                        </>
                      ) : (
                        <HareketliBas
                          accessibilityRole="button"
                          disabled={calisiyor}
                          onPress={() => dosyaSec('video')}
                          style={[s.yukle, { paddingVertical: 22 }]}
                        >
                          <Video size={25} strokeWidth={1.5} color={renk.gri} />
                          <Yazi style={{ fontWeight: '600', fontSize: 13 }}>Video ekle</Yazi>
                          <Yazi style={{ fontSize: 11, color: renk.gri, textAlign: 'center' }}>
                            En fazla {MEDYA_SINIRLARI.videoSuresi / 1000} saniye ve{' '}
                            {megabayt(MEDYA_SINIRLARI.videoBoyutu)} MB · MP4, WebM, MOV
                          </Yazi>
                        </HareketliBas>
                      )}
                    </View>
                    <View style={s.ipucu}>
                      <Camera size={18} color={renk.gri} />
                      <Yazi style={{ flex: 1, fontSize: 12, color: renk.gri }}>
                        Gün ışığında çek. Kusurları da göster. Ürünün farklı açılarını eklemek alıcının karar
                        vermesini kolaylaştırır.
                      </Yazi>
                    </View>
                  </View>
                ) : null}

                {adim === 3 ? (
                  <View style={{ gap: 22 }}>
                    <Alan
                      nativeID="ilan-basligi"
                      etiket="İlan başlığı"
                      placeholder="Örn. iPhone 15 Pro 256 GB, kutulu ve faturalı"
                      value={baslik}
                      onChangeText={(v) => {
                        setBaslik(v);
                        hataSil('baslik');
                      }}
                      maxLength={75}
                      hata={alanHatalari.baslik}
                    />
                    <Yazi style={{ fontSize: 11, color: renk.gri, marginTop: -15, textAlign: 'right' }}>
                      {baslik.length} / 75
                    </Yazi>
                    <View style={{ flexDirection: mobil ? 'column' : 'row', gap: 18 }}>
                      <View style={{ flex: 1 }}>
                        <Alan
                          nativeID="ilan-fiyati"
                          etiket="Fiyat (TL)"
                          placeholder="Örn. 25000"
                          keyboardType="decimal-pad"
                          value={fiyat}
                          onChangeText={(v) => {
                            setFiyat(v.replace(/[^0-9,]/g, ''));
                            hataSil('fiyat');
                          }}
                          maxLength={12}
                          hata={alanHatalari.fiyat}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: mobil ? 'column' : 'row', gap: 18 }}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <SecimAlani
                          etiket="İl"
                          ipucu="İl seç"
                          deger={seciliKonum.il}
                          secenekler={iller}
                          gerekli
                          disabled={calisiyor}
                          degistir={(il) => {
                            setKonumaDokunuldu(true);
                            setKonum(konumuBirlestir(il));
                            hataSil('il');
                            hataSil('ilce');
                          }}
                          hata={alanHatalari.il}
                        />
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <SecimAlani
                          etiket="İlçe"
                          ipucu={seciliKonum.il ? 'İlçe seç' : 'Önce il seç'}
                          deger={seciliKonum.ilce}
                          secenekler={ilceSecenekleri(seciliKonum.il)}
                          gerekli
                          disabled={calisiyor || !seciliKonum.il}
                          degistir={(ilce) => {
                            setKonumaDokunuldu(true);
                            setKonum(konumuBirlestir(seciliKonum.il, ilce));
                            hataSil('ilce');
                          }}
                          hata={alanHatalari.ilce}
                        />
                      </View>
                    </View>
                    <View style={{ gap: 10 }}>
                      <Yazi style={s.etiket}>Ürünün durumu</Yazi>
                      <View style={s.secenekler}>
                        {(['İkinci el', 'Yeni gibi', 'Sıfır'] as const).map((d) => (
                          <Secenek key={d} secili={durum === d} onPress={() => setDurum(d)}>
                            {d}
                          </Secenek>
                        ))}
                      </View>
                    </View>
                    {kategori ? (
                      <View style={{ gap: 14 }}>
                        <View style={ortak.aralikli}>
                          <Yazi style={s.etiket}>Ürün özellikleri</Yazi>
                          <Yazi style={{ fontSize: 11, color: renk.gri }}>İsteğe bağlı</Yazi>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
                          {teknikAlanlar.map((alan) => (
                            <View
                              key={alan.ad}
                              style={{ flexBasis: mobil ? '100%' : '47%', flexGrow: 1, minWidth: 0 }}
                            >
                              {alan.sayisal ? (
                                <Alan
                                  nativeID={`ilan-ozellik-${alan.ad.replace(/\s+/g, '-').toLocaleLowerCase('tr')}`}
                                  etiket={alan.birim ? `${alan.ad} (${alan.birim})` : alan.ad}
                                  placeholder="Sayı yaz"
                                  value={ozellikler[alan.ad] || ''}
                                  keyboardType="number-pad"
                                  onChangeText={(v) => {
                                    setOzellikler((onceki) => ({
                                      ...onceki,
                                      [alan.ad]: v.replace(/[^0-9]/g, ''),
                                    }));
                                    hataSil(alan.ad);
                                  }}
                                  maxLength={8}
                                  hata={alanHatalari[alan.ad]}
                                />
                              ) : (
                                <SecimAlani
                                  etiket={alan.ad}
                                  deger={ozellikler[alan.ad] || ''}
                                  secenekler={alan.secenekler.map((ad) => ({ id: ad, ad }))}
                                  degistir={(deger) =>
                                    setOzellikler((onceki) => ({ ...onceki, [alan.ad]: deger }))
                                  }
                                  ipucu="Belirtilmedi"
                                />
                              )}
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : null}
                    <Alan
                      nativeID="ilan-aciklamasi"
                      etiket="Açıklama"
                      placeholder="Ne zamandır kullanıyorsun? Kutusu ve faturası var mı? Bilinmesi gereken bir kusuru var mı?"
                      value={aciklama}
                      onChangeText={(v) => {
                        setAciklama(v);
                        hataSil('aciklama');
                      }}
                      maxLength={2000}
                      multiline
                      hata={alanHatalari.aciklama}
                    />
                    <Yazi style={{ fontSize: 11, color: renk.gri, marginTop: -15, textAlign: 'right' }}>
                      {aciklama.length} / 2000
                    </Yazi>
                    <HareketliBas
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: takas }}
                      onPress={() => setTakas(!takas)}
                      style={[ortak.satir, { minHeight: 44 }]}
                    >
                      <View
                        style={{
                          width: 21,
                          height: 21,
                          borderWidth: 1,
                          borderRadius: 5,
                          borderColor: takas ? renk.murekkep : '#b8bcb1',
                          backgroundColor: takas ? renk.murekkep : '#fff',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {takas ? <Check size={15} color="#fff" /> : null}
                      </View>
                      <Yazi style={{ fontSize: 12, flex: 1 }}>Takas tekliflerini değerlendirebilirim.</Yazi>
                    </HareketliBas>
                  </View>
                ) : null}

                {adim === 4 ? (
                  <View style={{ gap: 22 }}>
                    <View style={ortak.aralikli}>
                      <Yazi style={{ fontSize: 12, color: renk.gri, flex: 1 }}>
                        {[kategoriAdi, altKategoriAdi, markaAdi, modelAdi].filter(Boolean).join(' / ')}
                      </Yazi>
                      <Duzenle onPress={() => adimaGit(1)} etiket="Kategoriyi düzenle" />
                    </View>
                    {kapak ? (
                      <Gorsel
                        source={{ uri: kapak.uri }}
                        style={{ width: '100%', aspectRatio: mobil ? 1.15 : 1.55, borderRadius: 12 }}
                        contentFit="contain"
                        accessibilityLabel="İlanın kapak fotoğrafı"
                      />
                    ) : null}
                    <View style={ortak.aralikli}>
                      <Yazi style={{ fontSize: 12, color: renk.gri }}>
                        {fotograflar.length} fotoğraf{video ? ' · 1 video' : ''}
                      </Yazi>
                      <Duzenle onPress={() => adimaGit(2)} etiket="Fotoğrafları ve videoyu düzenle" />
                    </View>
                    {fotograflar.length > 1 ? (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {fotograflar.map((foto, i) => (
                          <Gorsel
                            key={foto.uri}
                            source={{ uri: foto.uri }}
                            accessibilityLabel={`${i + 1}. fotoğraf`}
                            style={{ width: 64, height: 64, borderRadius: 6 }}
                            contentFit="cover"
                          />
                        ))}
                      </View>
                    ) : null}
                    {video ? <VideoOynatici kaynak={video.uri} baslik="İlan videosu önizlemesi" /> : null}
                    <View style={{ gap: 10, paddingTop: 20, borderTopWidth: 1, borderColor: renk.cizgi }}>
                      <View style={ortak.aralikli}>
                        <Yazi style={{ fontSize: 11, color: renk.gri }}>
                          {durum}
                          {takas ? ' · Takasa açık' : ''}
                        </Yazi>
                        <Duzenle onPress={() => adimaGit(3)} etiket="İlan bilgilerini düzenle" />
                      </View>
                      <Baslik>{baslik}</Baslik>
                      <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 28, lineHeight: 38 }}>
                        {para(sayisalFiyat)}
                      </Yazi>
                      <Yazi style={{ color: renk.gri, fontSize: 13 }}>{konum}</Yazi>
                    </View>
                    {Object.values(ozellikler).some((deger) => deger.trim()) ? (
                      <View style={{ gap: 8 }}>
                        {Object.entries(ozellikler)
                          .filter(([, deger]) => deger.trim())
                          .map(([ad, deger]) => (
                            <View key={ad} style={ortak.aralikli}>
                              <Yazi style={{ fontSize: 12, color: renk.gri }}>{ad}</Yazi>
                              <Yazi style={{ fontSize: 12 }}>{deger}</Yazi>
                            </View>
                          ))}
                      </View>
                    ) : null}
                    <Yazi style={{ color: '#51584b', lineHeight: 25 }}>{aciklama}</Yazi>
                    <View style={s.ipucu}>
                      <CheckCircle2 size={20} color={renk.murekkep} />
                      <Yazi style={{ flex: 1, fontSize: 12, color: renk.gri }}>
                        Bilgiler doğruysa ilanını kaydet. Sonrasında ilanını profilinden yönetebilirsin.
                      </Yazi>
                    </View>
                  </View>
                ) : null}

                {hata ? (
                  <Yazi role="alert" style={{ fontSize: 12, color: '#a63327' }}>
                    {hata}
                  </Yazi>
                ) : null}
                {calisiyor ? (
                  <Yazi role="status" style={{ fontSize: 12, color: renk.gri }}>
                    {adim === 4 ? 'Fotoğraflar ve ilan bilgileri kaydediliyor…' : 'Dosyalar hazırlanıyor…'}
                  </Yazi>
                ) : null}
                <View
                  style={[
                    ortak.aralikli,
                    {
                      borderTopWidth: 1,
                      borderTopColor: renk.cizgi,
                      paddingTop: 18,
                      flexWrap: 'wrap',
                      gap: 10,
                    },
                  ]}
                >
                  {adim > 1 ? (
                    <Buton
                      ikincil
                      disabled={calisiyor}
                      onPress={() => adimaGit(adim - 1)}
                      simge={<ArrowLeft size={16} />}
                    >
                      Geri
                    </Buton>
                  ) : ilan ? (
                    <Buton ikincil disabled={calisiyor} onPress={() => router.replace('/profil')}>
                      Vazgeç
                    </Buton>
                  ) : (
                    <Yazi style={{ color: renk.gri, fontSize: 11 }}>1 / 4</Yazi>
                  )}
                  <Buton
                    disabled={calisiyor || !hazir}
                    onPress={adim === 4 ? kaydet : devam}
                    simge={adim === 4 ? <Check size={17} /> : <ArrowRight size={17} />}
                    testID="ilan-devam"
                    style={mobil && adim === 4 ? { flexGrow: 1 } : undefined}
                  >
                    {adim === 4 ? (ilan ? 'Değişiklikleri kaydet' : 'İlanı kaydet') : 'Devam et'}
                  </Buton>
                </View>
              </View>
              {!dar ? (
                <View style={[ortak.kart, { width: 270, padding: 20, gap: 16 }]}>
                  {kapak ? (
                    <Gorsel
                      source={{ uri: kapak.uri }}
                      accessibilityLabel="Kapak önizlemesi"
                      style={{ width: '100%', aspectRatio: 1.25, borderRadius: 10 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      style={{
                        height: 145,
                        backgroundColor: renk.zemin,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Package size={40} strokeWidth={1.2} color="#a8ad9d" />
                    </View>
                  )}
                  <Yazi style={{ fontWeight: '700', fontSize: 15 }}>
                    {baslik.trim() || 'İlanın burada şekilleniyor.'}
                  </Yazi>
                  {Number.isFinite(sayisalFiyat) && sayisalFiyat > 0 ? (
                    <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 23, lineHeight: 31 }}>
                      {para(sayisalFiyat)}
                    </Yazi>
                  ) : null}
                  <Yazi style={{ fontSize: 12, color: renk.gri }}>
                    {[kategoriAdi, altKategoriAdi].filter(Boolean).join(' / ') || 'Önce bir kategori seç.'}
                  </Yazi>
                  <View style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 16, gap: 12 }}>
                    {[
                      { ad: 'Kategori ve ürün', hazir: Boolean(altKategori && marka) },
                      { ad: 'Ürün fotoğrafları', hazir: fotograflar.length > 0 },
                      {
                        ad: 'Başlık ve açıklama',
                        hazir: baslik.trim().length >= 5 && aciklama.trim().length >= 20,
                      },
                      {
                        ad: 'Fiyat ve konum',
                        hazir: sayisalFiyat > 0 && Boolean(seciliKonum.il && seciliKonum.ilce),
                      },
                    ].map((madde) => (
                      <View key={madde.ad} style={ortak.satir}>
                        <CheckCircle2 size={16} color={madde.hazir ? renk.murekkep : '#c6cabf'} />
                        <Yazi style={{ fontSize: 12, color: madde.hazir ? renk.murekkep : renk.gri }}>
                          {madde.ad}
                        </Yazi>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </>
        )}
      </View>
    </Kabuk>
  );
}

function Duzenle({ onPress, etiket }: { onPress: () => void; etiket: string }) {
  return (
    <HareketliBas
      accessibilityRole="button"
      accessibilityLabel={etiket}
      onPress={onPress}
      style={{ flexDirection: 'row', gap: 5, alignItems: 'center', minHeight: 44 }}
    >
      <Pencil size={14} />
      <Yazi style={{ fontSize: 11, textDecorationLine: 'underline' }}>Düzenle</Yazi>
    </HareketliBas>
  );
}
const s = StyleSheet.create({
  etiket: { fontSize: 13, fontWeight: '700' },
  secenekler: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  adimNo: { width: 29, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  yukle: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#c7cbbc',
    backgroundColor: '#fafbf8',
    borderRadius: 12,
    padding: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  kaldir: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kapak: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: renk.sari,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  siraDugmesi: { minWidth: 32, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  ipucu: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    borderRadius: 10,
    backgroundColor: renk.zemin,
    padding: 15,
  },
  tamam: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: renk.sariSoluk,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
