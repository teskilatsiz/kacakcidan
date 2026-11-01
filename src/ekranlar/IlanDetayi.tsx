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
import { Kabuk } from '../bilesenler/Kabuk';
import { Alan, Baslik, BosDurum, Buton, Pencere, SimgeButon, Yazi } from '../bilesenler/Temel';
import { FavoriDugmesi } from '../bilesenler/Hareketli';
import { DetaySekmeleri, type DetaySekmesi } from '../bilesenler/DetaySekmeleri';
import { IlanGalerisi } from '../bilesenler/IlanGalerisi';
import { IlanEtiketleri } from '../bilesenler/IlanEtiketleri';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { IlanSorulari } from '../bilesenler/IlanSorulari';
import { kisiler, usePazar } from '../durum/Pazar';
import { kategoriler, para } from '../veri/ilanlar';
import { kategoriYapisi } from '../veri/kategoriler';
import { kalin, mobilAltMenuYuksekligi, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';

export default function IlanDetayi() {
  const { renk } = useTema();
  const s = useStiller();

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
  const ilan = tumIlanlar.find((i) => i.id === id);
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

  const kisi = kisiler.find((k) => k.ilanId === id)?.id || `ilan-${id}`;
  const ilanBanaAit = !!oturum && eklenenler.some((kayit) => kayit.id === ilan.id);
  const ilanDuzenle = () => router.push({ pathname: '/ilan-duzenle', params: { id: ilan.id } });
  const iletisim = () => router.push({ pathname: '/mesajlar', params: { kisi, ilan: ilan.id } });
  const kategori = kategoriler.find((k) => k.id === ilan.kategori);
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
    ...(altKategoriAdi ? { 'Ürün türü': altKategoriAdi } : {}),
    ...(markaAdi ? { Marka: markaAdi } : {}),
    ...(modelAdi ? { Model: modelAdi } : {}),
    Durum: ilan.durum,
    ...ilan.ozellikler,
    Takas: ilan.takas ? 'Evet' : 'Hayır',
    Konum: ilan.konum,
  });
  const benzer = [
    ...tumIlanlar.filter((i) => i.id !== id && i.kategori === ilan.kategori),
    ...tumIlanlar.filter((i) => i.id !== id && i.kategori !== ilan.kategori),
  ].slice(0, mobil ? 4 : 5);

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
    <View style={{ gap: mobil ? 10 : 12 }}>
      <Baslik buyuk style={{ fontSize: mobil ? 23 : 29, lineHeight: mobil ? 31 : 38, letterSpacing: -0.7 }}>
        {ilan.baslik}
      </Baslik>
      <View style={[ortak.satir, { gap: 6, flexWrap: 'wrap' }]}>
        <MapPin size={14} color={renk.gri} />
        <Yazi style={s.yardimci}>{ilan.konum}</Yazi>
        <Yazi style={s.yardimci}>· {ilan.zaman}</Yazi>
        {!!ilan.numara && <Yazi style={s.yardimci}>· İlan no {ilan.numara}</Yazi>}
      </View>
      <View style={{ gap: mobil ? 8 : 10, paddingTop: 2 }}>
        <Yazi style={[s.fiyat, { fontSize: mobil ? 30 : 34, lineHeight: mobil ? 38 : 43 }]}>
          {para(ilan.fiyat)}
        </Yazi>
        <IlanEtiketleri durum={ilan.durum} takas={ilan.takas} />
      </View>
    </View>
  );

  const altEylem =
    mobil && !klavyeAcik ? (
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
          {para(ilan.fiyat)}
        </Yazi>
        <Buton
          onPress={ilanBanaAit ? ilanDuzenle : iletisim}
          simge={ilanBanaAit ? <Pencil size={17} /> : <MessageCircle size={17} />}
          style={{ minHeight: 44, paddingHorizontal: genislik < 360 ? 12 : 18, flexShrink: 0 }}
        >
          {ilanBanaAit ? 'İlanı düzenle' : 'Mesaj yaz'}
        </Buton>
      </View>
    ) : undefined;

  return (
    <Kabuk altEylem={altEylem}>
      <View
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
          <View style={[ortak.satir, { gap: mobil ? 10 : 14 }]}>
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
          style={{ flexDirection: tablet ? 'column' : 'row', alignItems: 'stretch', gap: tablet ? 20 : 36 }}
        >
          <View style={{ flex: tablet ? undefined : 1.1, minWidth: 0, gap: 20 }}>
            {tablet && ilanBasligi}
            <IlanGalerisi ilan={ilan} />
          </View>
          <View style={{ flex: tablet ? undefined : 1, minWidth: 0, gap: 24 }}>
            {!tablet && ilanBasligi}
            {!mobil && ilanBanaAit && (
              <Buton onPress={ilanDuzenle} simge={<Pencil size={17} />}>
                İlanı düzenle
              </Buton>
            )}
            {!mobil && !ilanBanaAit && (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Buton onPress={iletisim} simge={<MessageCircle size={17} />} style={{ flex: 1 }}>
                  Mesaj yaz
                </Buton>
                <Buton ikincil onPress={teklifPenceresiAc} style={{ flex: 1 }}>
                  Teklif yap
                </Buton>
              </View>
            )}
            <View style={[s.satici, { padding: mobil ? 16 : 20 }]}>
              <View style={[ortak.satir, { gap: 12 }]}>
                <View style={s.avatar}>
                  <Yazi style={{ fontWeight: '700', fontSize: 15 }}>
                    {ilan.satici
                      .split(' ')
                      .map((s) => s[0])
                      .join('')
                      .replace(/\./g, '')}
                  </Yazi>
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Yazi style={{ fontSize: 15, fontFamily: kalin, fontWeight: '700' }}>{ilan.satici}</Yazi>
                  <Yazi style={s.yardimci}>{ilanBanaAit ? 'Bu ilan sana ait' : 'Bireysel satıcı'}</Yazi>
                </View>
                {mobil && !ilanBanaAit && (
                  <SimgeButon etiket="Satıcıya mesaj yaz" onPress={iletisim}>
                    <MessageCircle size={18} />
                  </SimgeButon>
                )}
              </View>
              {mobil && !ilanBanaAit && (
                <Buton ikincil onPress={teklifPenceresiAc} style={{ minHeight: 44 }}>
                  Teklif yap
                </Buton>
              )}
            </View>
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
                      style={{ width: mobil ? '42%' : 170, maxWidth: 170, color: renk.gri, fontSize: 13 }}
                    >
                      {ad}
                    </Yazi>
                    <Yazi style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: '500' }}>{deger}</Yazi>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 24, gap: 18 }}>
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
          {ilan.baslik} · {para(ilan.fiyat)}
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
