import { useEffect, useId, useState } from 'react';
import { Platform, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import MapPin from 'lucide-react-native/icons/map-pin';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Pencil from 'lucide-react-native/icons/pencil';
import Share2 from 'lucide-react-native/icons/share-2';
import Copy from 'lucide-react-native/icons/copy';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import * as Clipboard from 'expo-clipboard';
import { Kabuk } from '../bilesenler/Kabuk';
import { Alan, Baslik, BosDurum, Buton, Pencere, SimgeButon, Yazi } from '../bilesenler/Temel';
import { FavoriDugmesi } from '../bilesenler/Hareketli';
import { DetaySekmeleri, type DetaySekmesi } from '../bilesenler/DetaySekmeleri';
import { IlanGalerisi } from '../bilesenler/IlanGalerisi';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { IlanSorulari } from '../bilesenler/IlanSorulari';
import { IlanSikayeti } from '../bilesenler/IlanSikayeti';
import { IlanKarsilastirmasi } from '../bilesenler/IlanKarsilastirmasi';
import { IlanKonumu } from '../bilesenler/IlanKonumu';
import { GuvenliAlisveris } from '../bilesenler/GuvenliAlisveris';
import { SaticiKontrolleri } from '../bilesenler/SaticiKontrolleri';
import { SaticiIletisimi } from '../bilesenler/SaticiIletisimi';
import { SaticiOzeti } from '../bilesenler/SaticiBilgisi';
import { saticiKimligi } from '../veri/saticilar';
import { kisiler, usePazar } from '../durum/Pazar';
import { kategoriler, para, ilanBedeli } from '../veri/ilanlar';
import { urunKategorisiMi } from '../veri/anaKategoriler';
import { kategoriYapisi } from '../veri/kategoriler';
import { kategoriAdresi } from '../veri/kategoriSayfalari';
import { konumuAyir } from '../veri/konumlar';
import { HareketliBas } from '../bilesenler/Hareketli';
import { kalin, mobilAltMenuYuksekligi, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
import { ilanPaylasimAdresi } from '../tasarim/seo';
import { sayisalGirdiyiTemizle } from '../veri/formGirdileri';
import '../tasarim/ilanDetayi.web.css';

export default function IlanDetayi() {
  const { renk } = useTema();
  const s = useStiller();
  const web = Platform.OS === 'web';

  const { id: yolId, kayit, bolum } = useLocalSearchParams<{ id: string; kayit?: string; bolum?: string }>();
  const id = kayit || yolId;
  const {
    tumIlanlar,
    eklenenler,
    oturum,
    favoriler,
    favoriDegistir,
    mesajGonder,
    haberVer,
    hazir,
    ilaniGoruntule,
    saticilar,
  } = usePazar();
  const { mobil, bosluk, genislik } = useEkran();
  const guvenliAlan = useSafeAreaInsets();
  const klavyeAcik = useKlavyeAcik();
  const router = useRouter();
  const [teklifAcik, setTeklifAcik] = useState(false);
  const [teklif, setTeklif] = useState('');
  const [hata, setHata] = useState('');
  const [sekme, setSekme] = useState<DetaySekmesi>('aciklama');
  const [digerOzelliklerAcik, setDigerOzelliklerAcik] = useState(false);
  const sekmeId = useId();
  useEffect(() => {
    setSekme(bolum === 'sorular' ? 'sorular' : bolum === 'konum' ? 'konum' : 'aciklama');
    setDigerOzelliklerAcik(false);
    setTeklifAcik(false);
    setTeklif('');
    setHata('');
  }, [id, bolum]);
  useEffect(() => {
    if (hazir) ilaniGoruntule(id);
  }, [hazir, id, ilaniGoruntule, oturum?.id]);
  const ilan =
    tumIlanlar.find((i) => i.id === id) ?? (oturum ? eklenenler.find((i) => i.id === id) : undefined);
  if (!ilan)
    return (
      <Kabuk>
        <BosDurum
          baslik="İlan bulunamadı"
          aciklama="İlan kaldırılmış olabilir. Diğer ilanlara göz atabilirsin."
          eylem={<Buton onPress={() => router.replace('/kesfet')}>İlanları keşfet</Buton>}
        />
      </Kabuk>
    );

  const satici = saticilar.find(
    (kayit) =>
      kayit.id ===
      (ilan.saticiId ??
        (oturum && eklenenler.some((kayit) => kayit.id === ilan.id)
          ? oturum.id
          : saticiKimligi(ilan.satici))),
  ) ?? { id: saticiKimligi(ilan.satici), ad: ilan.satici, konum: ilan.konum, hakkinda: '' };
  const kisi = kisiler.find((k) => k.ilanId === id)?.id || `ilan-${id}`;
  const ilanBanaAit = !!oturum && eklenenler.some((kayit) => kayit.id === ilan.id);
  const saticininIlanSayisi = tumIlanlar.filter(
    (kayit) => (kayit.saticiId ?? saticiKimligi(kayit.satici)) === satici.id,
  ).length;
  const ilanDuzenle = () => router.push({ pathname: '/ilan-duzenle', params: { id: ilan.id } });
  const iletisim = () => router.push({ pathname: '/mesajlar', params: { kisi, ilan: ilan.id } });
  const kategori = kategoriler.find((k) => k.id === ilan.kategori);
  const urunIlani = urunKategorisiMi(ilan.kategori);
  const isIlani = ilan.kategori === 'is-ilanlari';
  const iletisimEtiketi = isIlani
    ? 'Başvuru için yaz'
    : ilan.kategori === 'hizmetler'
      ? 'Bilgi al'
      : 'Mesaj yaz';
  const yapi = kategoriYapisi(ilan.kategori, ilan.altKategori);
  const altKategoriAdi = yapi.altKategoriler.find((k) => k.id === ilan.altKategori)?.ad;
  const markaAdi = yapi.markalar.find((m) => m.id === ilan.marka)?.ad ?? ilan.marka;
  const modelAdi = (yapi.modeller[ilan.marka ?? ''] ?? []).find((m) => m.id === ilan.model)?.ad ?? ilan.model;
  const kirilimlar = [
    { ad: kategori?.ad ?? 'İlanlar', params: { kategori: ilan.kategori } },
    ...(altKategoriAdi
      ? [{ ad: altKategoriAdi, params: { kategori: ilan.kategori, altKategori: ilan.altKategori } }]
      : []),
    ...(markaAdi
      ? [
          {
            ad: markaAdi,
            params: { kategori: ilan.kategori, altKategori: ilan.altKategori, marka: ilan.marka },
          },
        ]
      : []),
    ...(modelAdi
      ? [
          {
            ad: modelAdi,
            params: {
              kategori: ilan.kategori,
              altKategori: ilan.altKategori,
              marka: ilan.marka,
              model: ilan.model,
            },
          },
        ]
      : []),
  ];
  const ozellikler = Object.entries({
    ...(ilan.numara ? { 'İlan no': ilan.numara } : {}),
    ...(!urunIlani && altKategoriAdi
      ? {
          [isIlani
            ? 'İş alanı'
            : ilan.kategori === 'emlak'
              ? 'Emlak grubu'
              : ilan.kategori === 'hizmetler'
                ? 'Hizmet alanı'
                : 'Ürün türü']: altKategoriAdi,
        }
      : {}),
    ...(markaAdi
      ? {
          [isIlani
            ? 'Pozisyon grubu'
            : ilan.kategori === 'emlak'
              ? 'İlan türü'
              : ilan.kategori === 'hizmetler'
                ? 'Hizmet grubu'
                : 'Marka']: markaAdi,
        }
      : {}),
    ...(modelAdi
      ? {
          [isIlani
            ? 'Pozisyon'
            : ilan.kategori === 'emlak'
              ? 'Emlak türü'
              : ilan.kategori === 'hizmetler'
                ? 'Hizmet türü'
                : 'Model']: modelAdi,
        }
      : {}),
    ...ilan.ozellikler,
    ...(urunIlani ? { Durum: ilan.durum } : {}),
    ...(urunIlani ? { Takas: ilan.takas ? 'Evet' : 'Hayır' } : {}),
  });
  // Temel telefon bilgileri ilk bakışta okunur; ikincil donanım ayrıntıları isteğe bağlıdır.
  const telefonSirasi = [
    'İlan no',
    'Marka',
    'Model',
    'Renk',
    'Depolama',
    'Ekran',
    'Ekran boyutu',
    'Kamera',
    'Ön kamera',
    'İşletim sistemi',
    'Kayıt durumu',
    'Garanti',
    'Pil sağlığı',
    'Ekran durumu',
    'Değişen parça',
    'Satıcı türü',
    'Durum',
    'Takas',
  ];
  const telefonBilgisi =
    ilan.kategori === 'telefon' && ['cep-telefonu', 'yenilenmis-telefon'].includes(ilan.altKategori ?? '');
  const anaOzellikler = telefonBilgisi
    ? telefonSirasi.flatMap((ad) => ozellikler.filter(([anahtar]) => anahtar === ad))
    : ozellikler;
  const digerOzellikler = telefonBilgisi ? ozellikler.filter(([ad]) => !telefonSirasi.includes(ad)) : [];
  const gorunenOzellikler = [...anaOzellikler, ...(digerOzelliklerAcik ? digerOzellikler : [])];
  const konum = konumuAyir(ilan.konum);
  const konumMetni = [konum.il, konum.ilce].filter(Boolean).join(' / ') || ilan.konum;
  const benzer = [
    ...tumIlanlar.filter((i) => i.id !== id && i.kategori === ilan.kategori),
    ...tumIlanlar.filter((i) => i.id !== id && i.kategori !== ilan.kategori),
  ].slice(0, web ? 5 : mobil ? 4 : 5);

  async function paylas() {
    if (!ilan) return;
    const adres = ilanPaylasimAdresi(ilan);
    if (!adres) {
      haberVer('Bu ilanın henüz paylaşıma açık bir bağlantısı yok.');
      return;
    }
    const kopyala = async () => {
      const kopyalandi = await Clipboard.setStringAsync(adres);
      haberVer(kopyalandi ? 'İlan bağlantısı kopyalandı.' : 'Bağlantı kopyalanamadı. Yeniden dene.');
    };
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) await navigator.share({ title: ilan.baslik, url: adres });
        else await kopyala();
      } else {
        await Share.share(
          Platform.OS === 'ios'
            ? { title: ilan.baslik, message: ilan.baslik, url: adres }
            : { title: ilan.baslik, message: `${ilan.baslik}\n${adres}` },
          { dialogTitle: 'İlanı paylaş' },
        );
      }
    } catch (hata) {
      if (hata instanceof Error && hata.name === 'AbortError') return;
      try {
        await kopyala();
      } catch {
        haberVer('Bağlantı kopyalanamadı. Yeniden dene.');
      }
    }
  }
  function teklifGonder() {
    const tutar = Number(teklif);
    if (!Number.isFinite(tutar) || tutar < 1 || tutar >= ilan!.fiyat) {
      setHata('İlan fiyatından düşük, geçerli bir tutar yaz.');
      return;
    }
    mesajGonder(kisi, `${ilan!.baslik} için ${para(tutar)} teklif etmek istiyorum. Uygun olur mu?`);
    setTeklifAcik(false);
    setTeklif('');
    iletisim();
  }
  function teklifPenceresiAc() {
    setHata('');
    setTeklifAcik(true);
  }
  const ilanBasligi = (
    <View dataSet={{ 'ilan-baslik': 'true' }} style={{ gap: 6 }}>
      <Baslik buyuk style={{ fontSize: mobil ? 21 : 24, lineHeight: mobil ? 28 : 32, letterSpacing: -0.5 }}>
        {ilan.baslik}
      </Baslik>
      <View style={[ortak.satir, { gap: 6, flexWrap: 'wrap' }]}>
        <Yazi style={s.yardimci}>{ilan.zaman}</Yazi>
      </View>
    </View>
  );

  const ozellikSekmesi = !web || mobil;
  const etkinSekme = sekme === 'ozellikler' && !ozellikSekmesi ? 'aciklama' : sekme;
  const ozellikTablosu = (
    <View
      dataSet={{ 'ilan-ozellik-tablosu': 'true' }}
      role="region"
      accessibilityLabel="İlan özellikleri"
      style={{ minWidth: 0 }}
    >
      {gorunenOzellikler.map(([ad, deger], sira) => (
        <View
          key={ad}
          dataSet={{ 'ilan-ozellik-satiri': 'true' }}
          style={{
            flexDirection: 'row',
            gap: 12,
            paddingHorizontal: 12,
            paddingVertical: ozellikSekmesi ? 9 : 5,
            backgroundColor: sira % 2 === 0 ? renk.zemin : renk.beyaz,
            borderRadius: 5,
          }}
        >
          <Yazi
            dataSet={{ 'ilan-ozellik-adi': 'true' }}
            style={{ width: '45%', maxWidth: 170, color: renk.gri, fontSize: 13, lineHeight: 19 }}
          >
            {ad === 'Ekran' && telefonBilgisi ? 'Ekran boyutu' : ad}
          </Yazi>
          <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Yazi selectable style={{ flexShrink: 1, fontSize: 13, lineHeight: 19, fontWeight: '500' }}>
              {deger}
            </Yazi>
            {ad === 'İlan no' && (
              <SimgeButon
                etiket="İlan numarasını kopyala"
                style={{
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  minHeight: 36,
                  marginLeft: 2,
                  borderWidth: 0,
                  backgroundColor: renk.zemin,
                  borderRadius: 8,
                }}
                onPress={async () => {
                  try {
                    const kopyalandi = await Clipboard.setStringAsync(deger);
                    haberVer(
                      kopyalandi ? 'İlan numarası kopyalandı.' : 'Numaraya basılı tutarak kopyalayabilirsin.',
                    );
                  } catch {
                    haberVer('Numaraya basılı tutarak kopyalayabilirsin.');
                  }
                }}
              >
                <Copy size={14} color={renk.murekkep} />
              </SimgeButon>
            )}
          </View>
        </View>
      ))}
      {digerOzellikler.length > 0 && (
        <HareketliBas
          accessibilityRole="button"
          accessibilityLabel={
            digerOzelliklerAcik
              ? 'Diğer özellikleri gizle'
              : `${digerOzellikler.length} diğer özelliği göster`
          }
          accessibilityState={{ expanded: digerOzelliklerAcik }}
          onPress={() => setDigerOzelliklerAcik((acik) => !acik)}
          style={{
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Yazi style={{ fontSize: 12, fontWeight: '600' }}>
            {digerOzelliklerAcik ? 'Daha az göster' : `Diğer özellikler (${digerOzellikler.length})`}
          </Yazi>
          <ChevronDown
            size={15}
            color={renk.murekkep}
            style={{ transform: [{ rotate: digerOzelliklerAcik ? '180deg' : '0deg' }] }}
          />
        </HareketliBas>
      )}
    </View>
  );

  const altEylem =
    (web || mobil) && !klavyeAcik ? (
      <View
        dataSet={{ 'ilan-eylemleri': 'true' }}
        style={[
          s.altEylemler,
          {
            paddingHorizontal: bosluk,
            bottom: mobilAltMenuYuksekligi + (Platform.OS === 'web' ? 0 : guvenliAlan.bottom),
          },
        ]}
      >
        <Yazi
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={[s.fiyat, { fontSize: genislik < 360 ? 18 : 21, lineHeight: 29, flex: 1, minWidth: 0 }]}
        >
          {ilanBedeli(ilan)}
        </Yazi>
        <Buton
          onPress={ilanBanaAit ? ilanDuzenle : iletisim}
          simge={ilanBanaAit ? <Pencil size={17} /> : <MessageCircle size={17} />}
          style={{ minHeight: 44, paddingHorizontal: genislik < 360 ? 12 : 18, flexShrink: 0 }}
        >
          {ilanBanaAit ? 'İlanı düzenle' : iletisimEtiketi}
        </Buton>
      </View>
    ) : undefined;

  return (
    <Kabuk altEylem={altEylem}>
      <View
        dataSet={{ 'ilan-detay-alani': 'true' }}
        style={[
          ortak.alan,
          {
            maxWidth: 1280,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 8 : 16,
            paddingBottom: mobil ? 100 : 40,
            gap: mobil ? 16 : 20,
          },
        ]}
      >
        <View style={[ortak.aralikli, { gap: 12 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ alignItems: 'center', gap: 8, minHeight: 44 }}
          >
            <ArrowLeft size={15} color={renk.gri} />
            {kirilimlar.map((k, sira) => (
              <View key={`${sira}-${k.ad}`} style={[ortak.satir, { gap: 8 }]}>
                {sira > 0 && <Yazi style={{ color: renk.gri, fontSize: 12 }}>›</Yazi>}
                <Link href={kategoriAdresi(k.params) as Href}>
                  <Yazi style={{ fontSize: 12, color: renk.gri }}>{k.ad}</Yazi>
                </Link>
              </View>
            ))}
          </ScrollView>
          <View dataSet={{ 'ilan-ust-eylemleri': 'true' }} style={[ortak.satir, { gap: mobil ? 10 : 14 }]}>
            <FavoriDugmesi
              secili={favoriler.includes(ilan.id)}
              onPress={() => favoriDegistir(ilan.id)}
              accessibilityLabel={favoriler.includes(ilan.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            />
            <SimgeButon etiket="İlanı paylaş" onPress={paylas}>
              <Share2 size={18} color={renk.murekkep} />
            </SimgeButon>
          </View>
        </View>

        <View dataSet={{ 'ilan-web-baslik': 'true' }}>{ilanBasligi}</View>

        <View dataSet={{ 'ilan-ust-yerlesimi': 'true' }} style={{ gap: mobil ? 20 : 24 }}>
          <View dataSet={{ 'ilan-fiyat-alani': 'true' }} style={{ minWidth: 0, gap: mobil ? 8 : 10 }}>
            <Yazi
              dataSet={{ 'ilan-ana-fiyati': 'true' }}
              style={[s.fiyat, { fontSize: mobil ? 26 : 25, lineHeight: mobil ? 34 : 33 }]}
            >
              {ilanBedeli(ilan)}
            </Yazi>
            <HareketliBas
              accessibilityRole="button"
              accessibilityLabel={`${konumMetni}, konumunu haritada göster`}
              onPress={() => {
                setSekme('konum');
                if (web)
                  requestAnimationFrame(() =>
                    document.getElementById(`${sekmeId}-icerik`)?.scrollIntoView({
                      block: 'start',
                      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                        ? 'instant'
                        : 'smooth',
                    }),
                  );
              }}
              dataSet={{ 'ilan-oncelikli-konum': 'true' }}
              style={{
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                borderBottomWidth: 1,
                borderColor: renk.cizgi,
                paddingBottom: 6,
              }}
            >
              <MapPin size={16} color={renk.murekkep} style={{ flexShrink: 0 }} />
              <Yazi style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 20, fontWeight: '700' }}>
                {konumMetni}
              </Yazi>
              <ArrowRight size={14} color={renk.murekkep} style={{ flexShrink: 0 }} />
            </HareketliBas>
          </View>
          <View dataSet={{ 'ilan-galeri-alani': 'true' }} style={{ minWidth: 0, gap: 20 }}>
            {ilan.yayinDurumu === 'kaldirildi' && (
              <View style={{ padding: 14, backgroundColor: renk.zemin, borderRadius: 9 }}>
                <Yazi style={{ fontWeight: '600' }}>Bu ilan yayında değil</Yazi>
                <Yazi style={s.yardimci}>İlanını hesabından yeniden yayınlayabilirsin.</Yazi>
              </View>
            )}
            <IlanGalerisi ilan={ilan} />
            {hazir && <IlanKarsilastirmasi key={ilan.id} ilan={ilan} />}
          </View>
          {!ozellikSekmesi && (
            <View dataSet={{ 'ilan-ozellik-alani': 'true' }} style={{ minWidth: 0, gap: 12 }}>
              {ozellikTablosu}
            </View>
          )}
          <View dataSet={{ 'ilan-yan-alani': 'true' }} style={{ minWidth: 0, gap: 16 }}>
            {(web || !mobil) && ilanBanaAit && (
              <View dataSet={{ 'ilan-masaustu-eylemi': 'true' }}>
                <Buton onPress={ilanDuzenle} simge={<Pencil size={17} />}>
                  İlanı düzenle
                </Buton>
              </View>
            )}
            {!ilanBanaAit && (
              <View dataSet={{ 'ilan-iletisim-eylemleri': 'true' }} style={{ gap: 8, minWidth: 0 }}>
                <GuvenliAlisveris ilan={ilan} />
                <View style={{ flexDirection: 'row', gap: 8, minWidth: 0 }}>
                  <Buton
                    onPress={iletisim}
                    simge={<MessageCircle size={17} />}
                    style={{ flex: 1, paddingHorizontal: 8, gap: 6 }}
                    yaziStili={{ fontSize: 13 }}
                  >
                    {iletisimEtiketi}
                  </Buton>
                  {urunIlani && (
                    <Buton
                      ikincil
                      onPress={teklifPenceresiAc}
                      style={{ flex: 1, paddingHorizontal: 8 }}
                      yaziStili={{ fontSize: 13 }}
                    >
                      Teklif yap
                    </Buton>
                  )}
                </View>
              </View>
            )}
            <View dataSet={{ 'ilan-satici-karti': 'true' }} style={[s.satici, { padding: 14 }]}>
              <SaticiOzeti
                satici={satici}
                rol={
                  ilanBanaAit
                    ? 'Bu ilan sana ait'
                    : isIlani
                      ? 'İşveren'
                      : ilan.kategori === 'hizmetler'
                        ? 'Hizmet veren'
                        : ilan.kategori === 'emlak'
                          ? 'İlan sahibi'
                          : (ilan.ozellikler?.['Satıcı türü'] ?? 'İlan sahibi')
                }
                ilanSayisi={saticininIlanSayisi}
              />
              <SaticiIletisimi telefon={ilan.telefon} gorunur={ilan.telefonGoster === true} />
              <SaticiKontrolleri />
            </View>
            <IlanSikayeti ilan={{ ...ilan, benim: ilanBanaAit }} />
          </View>
        </View>

        <View style={{ gap: 20 }}>
          <DetaySekmeleri
            secili={etkinSekme}
            degistir={setSekme}
            kimlik={sekmeId}
            ozellikler={ozellikSekmesi}
          />
          <View
            nativeID={`${sekmeId}-icerik`}
            role="tabpanel"
            accessibilityLabel={
              etkinSekme === 'aciklama'
                ? 'Açıklama'
                : etkinSekme === 'sorular'
                  ? 'Soru ve cevap'
                  : etkinSekme === 'konum'
                    ? 'Konum'
                    : 'Özellikler'
            }
            style={{ minHeight: 128 }}
          >
            {etkinSekme === 'sorular' ? (
              <IlanSorulari key={ilan.id} ilan={ilan} />
            ) : etkinSekme === 'konum' ? (
              <IlanKonumu key={ilan.konum} konum={ilan.konum} />
            ) : etkinSekme === 'ozellikler' ? (
              ozellikTablosu
            ) : (
              <View style={{ gap: 26, maxWidth: 860 }}>
                <Yazi
                  style={{
                    fontSize: 15,
                    lineHeight: 27,
                    color: renk.murekkep,
                    paddingBottom: 10,
                  }}
                >
                  {ilan.aciklama}
                </Yazi>
              </View>
            )}
          </View>
        </View>
        <View
          dataSet={{ 'ilan-benzerleri': 'true' }}
          style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 24, gap: 18 }}
        >
          <Baslik style={{ fontSize: mobil ? 21 : 24, lineHeight: 32 }}>Diğer ilanlar</Baslik>
          <IlanIzgarasi ilanlar={benzer} />
        </View>
      </View>
      <Pencere
        acik={teklifAcik}
        kapat={() => setTeklifAcik(false)}
        baslik="Teklif yap"
        altlik={
          <Buton onPress={teklifGonder} simge={<ArrowRight size={18} />}>
            Teklifi gönder
          </Buton>
        }
      >
        <Yazi style={{ color: renk.gri }}>
          {ilan.baslik} · {ilanBedeli(ilan)}
        </Yazi>
        <Alan
          nativeID="ilan-teklif-tutari"
          etiket="Teklifin (TL)"
          value={teklif}
          onChangeText={(s) => {
            setTeklif(sayisalGirdiyiTemizle(s));
            setHata('');
          }}
          keyboardType="numeric"
          inputMode="numeric"
          returnKeyType="done"
          onSubmitEditing={teklifGonder}
          placeholder="Tutar yaz"
          hata={hata}
        />
      </Pencere>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    yardimci: { fontSize: 12, lineHeight: 20, color: renk.gri },
    fiyat: { fontFamily: kalin, fontWeight: '700', letterSpacing: -0.8 },
    satici: {
      backgroundColor: renk.beyaz,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 12,
      gap: 14,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: renk.zemin,
      alignItems: 'center',
      justifyContent: 'center',
    },
    altEylemler: {
      position: 'absolute',
      bottom: mobilAltMenuYuksekligi,
      left: 0,
      right: 0,
      zIndex: 30,
      backgroundColor: renk.beyaz,
      borderTopWidth: 1,
      borderColor: renk.cizgi,
      paddingVertical: 10,
      minHeight: 66,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
  }),
);
