import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import Expand from 'lucide-react-native/icons/expand';
import Play from 'lucide-react-native/icons/play';
import X from 'lucide-react-native/icons/x';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import ZoomIn from 'lucide-react-native/icons/zoom-in';
import ZoomOut from 'lucide-react-native/icons/zoom-out';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { VideoOynatici } from './VideoOynatici';
import { gorselKaynagi } from '../veri/gorseller';
import type { Ilan } from '../veri/ilanlar';
import { useEkran, useTema, temaStilleri } from '../tasarim/tema';

const onizleme = (yol: string, kucuk = false) =>
  /(?:iphone-15-pro-(arka|ekran)|playstation-5-detay|macbook-air-kapak)\.webp$/.test(yol)
    ? yol.replace('.webp', kucuk ? '-kucuk.webp' : '-onizleme.webp')
    : yol;
function GaleriKontrolu({
  etiket,
  onPress,
  children,
}: {
  etiket: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <HareketliBas
      accessibilityRole="button"
      accessibilityLabel={etiket}
      onPress={onPress}
      style={{
        minWidth: 44,
        minHeight: 44,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </HareketliBas>
  );
}

export function IlanGalerisi({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();
  const s = useStiller();

  const fotograflar = useMemo(
    () => Array.from(new Set([ilan.gorsel, ...(ilan.fotografler ?? [])].filter(Boolean))),
    [ilan.gorsel, ilan.fotografler],
  );
  const [sira, setSira] = useState(0);
  const [acik, setAcik] = useState(false);
  const [olcek, setOlcek] = useState(1);
  const { genislik, yukseklik, mobil } = useEkran();
  const guvenli = useSafeAreaInsets();
  const video = sira === fotograflar.length && !!ilan.video;
  const adet = fotograflar.length + (ilan.video ? 1 : 0);
  const secili = fotograflar[sira] ?? ilan.gorsel;
  const poster = ilan.videoPoster || ilan.gorsel;
  useEffect(() => {
    setSira(0);
    setAcik(false);
    setOlcek(1);
  }, [ilan.id]);
  useEffect(() => {
    const komsular = [-1, 1].flatMap((fark) => {
      const yol = fotograflar[(sira + fark + adet) % adet];
      return yol && /^https?:/.test(yol) ? [acik ? yol : onizleme(yol)] : [];
    });
    if (komsular.length) void Gorsel.prefetch(komsular, 'memory-disk').catch(() => {});
  }, [sira, fotograflar, adet, acik]);
  function gec(adim: number) {
    setSira((eski) => (eski + adim + adet) % adet);
    setOlcek(1);
  }
  return (
    <View style={{ width: '100%', gap: 10 }}>
      {video && !acik && ilan.video ? (
        <View style={[s.onizleme, { height: mobil ? 260 : 320 }]}>
          <VideoOynatici kaynak={ilan.video} poster={poster} baslik={`${ilan.baslik} ürün videosu`} sahne />
          <HareketliBas
            accessibilityRole="button"
            accessibilityLabel="Videoyu büyük aç"
            onPress={() => setAcik(true)}
            style={[s.buyut, { top: 10, bottom: undefined, minWidth: 44, minHeight: 44 }]}
          >
            <Expand size={18} color={renk.murekkep} />
          </HareketliBas>
        </View>
      ) : (
        <HareketliBas
          accessibilityLabel={video ? 'Ürün videosunu aç' : 'Ürün fotoğrafını büyüt'}
          onPress={() => setAcik(true)}
          style={[s.onizleme, { height: mobil ? 260 : 320 }]}
        >
          <Gorsel
            source={gorselKaynagi(onizleme(video ? poster : secili))}
            contentFit="contain"
            style={StyleSheet.absoluteFill}
            accessibilityLabel={ilan.baslik}
            cachePolicy="memory-disk"
            transition={80}
          />
          <View style={s.buyut}>
            {video ? <Play color={renk.murekkep} size={18} /> : <Expand color={renk.murekkep} size={18} />}
          </View>
          <View style={s.sayac}>
            <Yazi style={{ fontSize: 11 }}>{video ? 'Video' : `${sira + 1} / ${fotograflar.length}`}</Yazi>
          </View>
        </HareketliBas>
      )}
      {adet > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {fotograflar.map((yol, no) => (
            <HareketliBas
              key={yol}
              accessibilityLabel={`${no + 1}. fotoğrafı göster`}
              accessibilityState={{ selected: sira === no }}
              onPress={() => {
                setSira(no);
                setOlcek(1);
              }}
              style={[s.kucuk, { borderColor: sira === no ? renk.murekkep : renk.cizgi }]}
            >
              <Gorsel
                source={gorselKaynagi(onizleme(yol, true))}
                contentFit="contain"
                cachePolicy="memory-disk"
                style={StyleSheet.absoluteFill}
              />
            </HareketliBas>
          ))}
          {!!ilan.video && (
            <HareketliBas
              accessibilityLabel="Ürün videosunu seç"
              onPress={() => {
                setSira(fotograflar.length);
                setOlcek(1);
              }}
              accessibilityState={{ selected: video }}
              style={[s.kucuk, { borderColor: video ? renk.murekkep : renk.cizgi }]}
            >
              <Gorsel source={gorselKaynagi(poster)} contentFit="cover" style={StyleSheet.absoluteFill} />
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  backgroundColor: '#17191b66',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Play color="#fff" fill="#fff" size={20} />
              </View>
            </HareketliBas>
          )}
        </ScrollView>
      )}
      <Modal visible={acik} animationType="fade" onRequestClose={() => setAcik(false)}>
        {acik && (
          <View
            style={{
              flex: 1,
              backgroundColor: '#17191b',
              paddingTop: guvenli.top,
              paddingBottom: guvenli.bottom,
            }}
          >
            <StatusBar style="light" />
            <View style={s.ust}>
              <Yazi numberOfLines={1} style={{ color: '#fff', flex: 1, minWidth: 0, fontSize: 13 }}>
                {ilan.baslik}
              </Yazi>
              <GaleriKontrolu etiket="Galeriyi kapat" onPress={() => setAcik(false)}>
                <X color="#fff" size={22} />
              </GaleriKontrolu>
            </View>
            {!video && (
              <View style={[s.ust, { paddingVertical: 0, justifyContent: 'center' }]}>
                <GaleriKontrolu
                  etiket="Uzaklaştır"
                  onPress={() => setOlcek((eski) => Math.max(1, eski - 0.5))}
                >
                  <ZoomOut color="#fff" size={19} />
                </GaleriKontrolu>
                <GaleriKontrolu
                  etiket="Yakınlaştır"
                  onPress={() => setOlcek((eski) => Math.min(4, eski + 0.5))}
                >
                  <ZoomIn color="#fff" size={19} />
                </GaleriKontrolu>
                <GaleriKontrolu etiket="Görünümü sıfırla" onPress={() => setOlcek(1)}>
                  <RotateCcw color="#fff" size={18} />
                </GaleriKontrolu>
                <Yazi style={{ color: '#d1d1d1', fontSize: 12 }}>{Math.round(olcek * 100)}%</Yazi>
              </View>
            )}
            <View style={{ flex: 1, minHeight: 0 }}>
              {video && ilan.video ? (
                <VideoOynatici kaynak={ilan.video} poster={poster} baslik={ilan.baslik} sahne />
              ) : (
                <ScrollView
                  maximumZoomScale={4}
                  minimumZoomScale={1}
                  centerContent
                  contentContainerStyle={{
                    minHeight: Math.max(160, yukseklik - guvenli.top - guvenli.bottom - 220),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      minWidth: genislik,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Gorsel
                      source={gorselKaynagi(secili)}
                      placeholder={onizleme(secili) !== secili ? gorselKaynagi(onizleme(secili)) : undefined}
                      placeholderContentFit="contain"
                      contentFit="contain"
                      style={{
                        width: genislik * olcek,
                        height: Math.max(160, yukseklik - guvenli.top - guvenli.bottom - 220) * olcek,
                      }}
                      accessibilityLabel={ilan.baslik}
                      cachePolicy="memory-disk"
                    />
                  </ScrollView>
                </ScrollView>
              )}
            </View>
            <View style={[s.ust, { gap: 4, paddingVertical: 8 }]}>
              <GaleriKontrolu etiket="Önceki medya" onPress={() => gec(-1)}>
                <ChevronLeft color="#fff" size={22} />
              </GaleriKontrolu>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ gap: 8, alignItems: 'center' }}
              >
                {fotograflar.map((yol, no) => (
                  <HareketliBas
                    key={yol}
                    accessibilityRole="button"
                    accessibilityLabel={`${no + 1}. fotoğrafa geç`}
                    accessibilityState={{ selected: sira === no }}
                    onPress={() => {
                      setSira(no);
                      setOlcek(1);
                    }}
                    style={[
                      s.kucuk,
                      { width: 56, height: 46, borderColor: sira === no ? renk.sari : '#ffffff44' },
                    ]}
                  >
                    <Gorsel
                      source={gorselKaynagi(onizleme(yol, true))}
                      contentFit="contain"
                      style={StyleSheet.absoluteFill}
                    />
                  </HareketliBas>
                ))}
                {!!ilan.video && (
                  <HareketliBas
                    accessibilityRole="button"
                    accessibilityLabel="Videoya geç"
                    accessibilityState={{ selected: video }}
                    onPress={() => {
                      setSira(fotograflar.length);
                      setOlcek(1);
                    }}
                    style={[s.kucuk, { width: 56, height: 46, borderColor: video ? renk.sari : '#ffffff44' }]}
                  >
                    <Gorsel
                      source={gorselKaynagi(poster)}
                      contentFit="cover"
                      style={StyleSheet.absoluteFill}
                    />
                    <View
                      style={{
                        ...StyleSheet.absoluteFill,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#17191b66',
                      }}
                    >
                      <Play size={18} color="#fff" fill="#fff" />
                    </View>
                  </HareketliBas>
                )}
              </ScrollView>
              <GaleriKontrolu etiket="Sonraki medya" onPress={() => gec(1)}>
                <ChevronRight color="#fff" size={22} />
              </GaleriKontrolu>
            </View>
            <Yazi style={{ color: '#d1d1d1', textAlign: 'center', fontSize: 11, paddingBottom: 10 }}>
              {video ? 'Video' : `${sira + 1} / ${fotograflar.length}`}
            </Yazi>
          </View>
        )}
      </Modal>
    </View>
  );
}
const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    onizleme: {
      width: '100%',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: renk.cizgi,
      backgroundColor: renk.acik,
      overflow: 'hidden',
    },
    buyut: {
      position: 'absolute',
      right: 10,
      bottom: 10,
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: renk.beyaz,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sayac: {
      position: 'absolute',
      left: 10,
      bottom: 10,
      borderRadius: 6,
      backgroundColor: renk.beyaz,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    kucuk: {
      width: 68,
      height: 56,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: renk.cizgi,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ust: { padding: 14, flexDirection: 'row', gap: 8, alignItems: 'center' },
  }),
);
