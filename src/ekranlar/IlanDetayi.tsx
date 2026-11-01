import { useEffect, useId, useState } from 'react';
import { Platform, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import MapPin from 'lucide-react-native/icons/map-pin';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Pencil from 'lucide-react-native/icons/pencil';
import Share2 from 'lucide-react-native/icons/share-2';
import Copy from 'lucide-react-native/icons/copy';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import * as Clipboard from 'expo-clipboard';
import { Kabuk } from '../bilesenler/Kabuk';
import { Alan, Baslik, BosDurum, Buton, Pencere, SimgeButon, Yazi } from '../bilesenler/Temel';
import { FavoriDugmesi } from '../bilesenler/Hareketli';
import { DetaySekmeleri, type DetaySekmesi } from '../bilesenler/DetaySekmeleri';
import { IlanGalerisi } from '../bilesenler/IlanGalerisi';
import { IlanEtiketleri } from '../bilesenler/IlanEtiketleri';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { IlanSorulari } from '../bilesenler/IlanSorulari';
import { IlanSikayeti } from '../bilesenler/IlanSikayeti';
import { SaticiIletisimi } from '../bilesenler/SaticiIletisimi';
import { SaticiPuani, SaticiResmi } from '../bilesenler/SaticiBilgisi';
import { HareketliBas } from '../bilesenler/Hareketli';
import { saticiKimligi, saticiYolu } from '../veri/saticilar';
import { kisiler, usePazar } from '../durum/Pazar';
import { kategoriler, para, ilanBedeli } from '../veri/ilanlar';
import { urunKategorisiMi } from '../veri/anaKategoriler';
import { kategoriYapisi } from '../veri/kategoriler';
import { kalin, mobilAltMenuYuksekligi, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
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
  const { mobil, tablet, bosluk, genislik } = useEkran();
  const guvenliAlan = useSafeAreaInsets();
  const klavyeAcik = useKlavyeAcik();
  const router = useRouter();
  const [teklifAcik, setTeklifAcik] = useState(false);
  const [teklif, setTeklif] = useState('');
  const [hata, setHata] = useState('');
  const [sekme, setSekme] = useState<DetaySekmesi>('aciklama');
  const sekmeId = useId();
  useEffect(() => {
    setSekme(bolum === 'sorular' ? 'sorular' : 'aciklama');
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
    Kategori: kategori?.ad ?? ilan.kategori,
    ...(altKategoriAdi
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
    ...(urunIlani ? { Durum: ilan.durum } : {}),
    ...ilan.ozellikler,
    ...(urunIlani ? { Takas: ilan.takas ? 'Evet' : 'Hayır' } : {}),
    Konum: ilan.konum,
  });
  const benzer = [
    ...tumIlanlar.filter((i) => i.id !== id && i.kategori === ilan.kategori),
    ...tumIlanlar.filter((i) => i.id !== id && i.kategori !== ilan.kategori),
  ].slice(0, web ? 5 : mobil ? 4 : 5);

  async function paylas() {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) await navigator.share({ title: ilan!.baslik, url: window.location.href });
        else {
          await navigator.clipboard.writeText(window.location.href);
          haberVer('İlan bağlantısı kopyalandı.');
        }
      } else await Share.share({ message: ilan!.baslik });
    } catch (hata) {
      if (!(hata instanceof Error && hata.name === 'AbortError'))
        haberVer('Bağlantıyı adres çubuğundan kopyalayabilirsin.');
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
    <View dataSet={{ 'ilan-baslik': 'true' }} style={{ gap: mobil ? 10 : 12 }}>
      <Baslik buyuk style={{ fontSize: mobil ? 23 : 29, lineHeight: mobil ? 31 : 38, letterSpacing: -0.7 }}>
        {ilan.baslik}
      </Baslik>
      <View style={[ortak.satir, { gap: 6, flexWrap: 'wrap' }]}>
        <MapPin size={14} color={renk.gri} />
        <Yazi style={s.yardimci}>{ilan.konum}</Yazi>
        <Yazi style={s.yardimci}>· {ilan.zaman}</Yazi>
      </View>
      <View dataSet={{ 'ilan-fiyat-alani': 'true' }} style={{ gap: mobil ? 8 : 10, paddingTop: 2 }}>
        <Yazi
          dataSet={{ 'ilan-ana-fiyati': 'true' }}
          style={[s.fiyat, { fontSize: mobil ? 30 : 34, lineHeight: mobil ? 38 : 43 }]}
        >
          {ilanBedeli(ilan)}
        </Yazi>
        {urunIlani ? <IlanEtiketleri durum={ilan.durum} takas={ilan.takas} /> : null}
      </View>
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
            maxWidth: 1340,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 8 : 16,
            paddingBottom: mobil ? 100 : 40,
            gap: mobil ? 20 : 28,
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
                <Link href={{ pathname: '/kesfet', params: k.params }}>
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

        <View
          dataSet={{ 'ilan-ust-yerlesimi': 'true' }}
          style={{ flexDirection: tablet ? 'column' : 'row', alignItems: 'stretch', gap: tablet ? 20 : 36 }}
        >
          {web && <View dataSet={{ 'ilan-web-baslik': 'true' }}>{ilanBasligi}</View>}
          <View
            dataSet={{ 'ilan-galeri-alani': 'true' }}
            style={{ flex: tablet ? undefined : 1.1, minWidth: 0, gap: 20 }}
          >
            {ilan.yayinDurumu === 'kaldirildi' && (
              <View style={{ padding: 14, backgroundColor: renk.zemin, borderRadius: 9 }}>
                <Yazi style={{ fontWeight: '600' }}>Bu ilan yayında değil</Yazi>
                <Yazi style={s.yardimci}>İlanını hesabından yeniden yayınlayabilirsin.</Yazi>
              </View>
            )}
            {!web && tablet && ilanBasligi}
            <IlanGalerisi ilan={ilan} />
          </View>
          <View
            dataSet={{ 'ilan-yan-alani': 'true' }}
            style={{ flex: tablet ? undefined : 1, minWidth: 0, gap: 24 }}
          >
            {!web && !tablet && ilanBasligi}
            {(web || !mobil) && ilanBanaAit && (
              <View dataSet={{ 'ilan-masaustu-eylemi': 'true' }}>
                <Buton onPress={ilanDuzenle} simge={<Pencil size={17} />}>
                  İlanı düzenle
                </Buton>
              </View>
            )}
            {(web || !mobil) && !ilanBanaAit && (
              <View dataSet={{ 'ilan-masaustu-eylemi': 'true' }} style={{ flexDirection: 'row', gap: 10 }}>
                <Buton onPress={iletisim} simge={<MessageCircle size={17} />} style={{ flex: 1 }}>
                  {iletisimEtiketi}
                </Buton>
                {urunIlani && (
                  <Buton ikincil onPress={teklifPenceresiAc} style={{ flex: 1 }}>
                    Teklif yap
                  </Buton>
                )}
              </View>
            )}
            <View dataSet={{ 'ilan-satici-karti': 'true' }} style={[s.satici, { padding: mobil ? 16 : 20 }]}>
              <View style={[ortak.satir, { gap: 12 }]}>
                <SaticiResmi satici={satici} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Yazi style={{ fontSize: 15, fontFamily: kalin, fontWeight: '700' }}>{ilan.satici}</Yazi>
                  <Yazi style={s.yardimci}>
                    {ilanBanaAit
                      ? 'Bu ilan sana ait'
                      : isIlani
                        ? 'İşveren'
                        : ilan.kategori === 'hizmetler'
                          ? 'Hizmet veren'
                          : ilan.kategori === 'emlak'
                            ? 'İlan sahibi'
                            : 'Bireysel satıcı'}
                  </Yazi>
                  <SaticiPuani satici={satici} />
                </View>
                {(web || mobil) && !ilanBanaAit && (
                  <View dataSet={{ 'ilan-mobil-eylemi': 'true' }}>
                    <SimgeButon etiket="İlan sahibine mesaj yaz" onPress={iletisim}>
                      <MessageCircle size={18} />
                    </SimgeButon>
                  </View>
                )}
              </View>
              <SaticiIletisimi telefon={ilan.telefon} gorunur={ilan.telefonGoster === true} />
              <Link href={saticiYolu(satici.id)} asChild>
                <HareketliBas
                  accessibilityRole="link"
                  accessibilityLabel={`${satici.ad} profilini ve ilanlarını gör`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 44,
                    gap: 8,
                    borderTopWidth: 1,
                    borderColor: renk.cizgi,
                    paddingTop: 10,
                  }}
                >
                  <Yazi style={{ fontSize: 13, fontWeight: '600', flex: 1 }}>Profili ve diğer ilanları</Yazi>
                  <ChevronRight size={17} color={renk.murekkep} />
                </HareketliBas>
              </Link>
              {(web || mobil) && !ilanBanaAit && urunIlani && (
                <View dataSet={{ 'ilan-mobil-eylemi': 'true' }}>
                  <Buton ikincil onPress={teklifPenceresiAc} style={{ minHeight: 44 }}>
                    Teklif yap
                  </Buton>
                </View>
              )}
            </View>
            <IlanSikayeti ilan={{ ...ilan, benim: ilanBanaAit }} />
          </View>
        </View>

        <View style={{ gap: 20 }}>
          <DetaySekmeleri secili={sekme} degistir={setSekme} kimlik={sekmeId} />
          <View
            nativeID={`${sekmeId}-icerik`}
            role="tabpanel"
            accessibilityLabel={
              sekme === 'aciklama' ? 'Açıklama' : sekme === 'sorular' ? 'Soru ve cevap' : 'Özellikler'
            }
            style={{ minHeight: 128 }}
          >
            {sekme === 'sorular' ? (
              <IlanSorulari key={ilan.id} ilan={ilan} />
            ) : sekme === 'aciklama' ? (
              <Yazi
                style={{
                  maxWidth: 860,
                  fontSize: 15,
                  lineHeight: 27,
                  color: renk.murekkep,
                  paddingBottom: 10,
                }}
              >
                {ilan.aciklama}
              </Yazi>
            ) : (
              <View style={{ maxWidth: 860 }}>
                {ozellikler.map(([ad, deger], sira) => (
                  <View
                    key={ad}
                    dataSet={{ 'ilan-ozellik-satiri': 'true' }}
                    style={{
                      flexDirection: 'row',
                      gap: mobil ? 12 : 28,
                      paddingHorizontal: mobil ? 12 : 16,
                      paddingVertical: 12,
                      backgroundColor: sira % 2 === 0 ? renk.zemin : renk.beyaz,
                      borderRadius: 5,
                    }}
                  >
                    <Yazi
                      dataSet={{ 'ilan-ozellik-adi': 'true' }}
                      style={{ width: mobil ? '42%' : 170, maxWidth: 170, color: renk.gri, fontSize: 13 }}
                    >
                      {ad}
                    </Yazi>
                    <View
                      style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    >
                      <Yazi selectable style={{ flexShrink: 1, fontSize: 13, fontWeight: '500' }}>
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
                                kopyalandi
                                  ? 'İlan numarası kopyalandı.'
                                  : 'Numaraya basılı tutarak kopyalayabilirsin.',
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
            setTeklif(s.replace(/[^0-9]/g, ''));
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
    satici: { borderWidth: 1, borderColor: renk.cizgi, borderRadius: 12, gap: 14 },
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
