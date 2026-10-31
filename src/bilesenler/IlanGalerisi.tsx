import { useEffect, useState } from 'react';
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
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { SimgeButon, Yazi } from './Temel';
import { VideoOynatici } from './VideoOynatici';
import { gorselKaynagi } from '../veri/gorseller';
import type { Ilan } from '../veri/ilanlar';
import { renk, useEkran } from '../tasarim/tema';

export function IlanGalerisi({ ilan }: { ilan: Ilan }) {
  const fotograflar = Array.from(new Set([ilan.gorsel, ...(ilan.fotografler ?? [])].filter(Boolean)));
  const [sira, setSira] = useState(0);
  const [acik, setAcik] = useState(false);
  const [olcek, setOlcek] = useState(1);
  const { genislik, yukseklik, mobil } = useEkran();
  const guvenli = useSafeAreaInsets();
  const video = sira === fotograflar.length && !!ilan.video;
  const adet = fotograflar.length + (ilan.video ? 1 : 0);
  const secili = fotograflar[sira] ?? ilan.gorsel;
  useEffect(() => {
    setSira(0);
    setAcik(false);
    setOlcek(1);
  }, [ilan.id]);
  function gec(adim: number) {
    setSira((eski) => (eski + adim + adet) % adet);
    setOlcek(1);
  }
  return (
    <View style={{ width: '100%', gap: 10 }}>
      <HareketliBas
        accessibilityLabel={video ? 'Ürün videosunu aç' : 'Ürün fotoğrafını büyüt'}
        onPress={() => setAcik(true)}
        style={[s.onizleme, { height: mobil ? 260 : 320 }]}
      >
        <Gorsel
          source={gorselKaynagi(video ? ilan.gorsel : secili)}
          contentFit="contain"
          style={StyleSheet.absoluteFill}
          accessibilityLabel={ilan.baslik}
        />
        <View style={s.buyut}>{video ? <Play size={18} /> : <Expand size={18} />}</View>
        <View style={s.sayac}>
          <Yazi style={{ fontSize: 11 }}>{video ? 'Video' : `${sira + 1} / ${fotograflar.length}`}</Yazi>
        </View>
      </HareketliBas>
      {adet > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {fotograflar.map((yol, no) => (
            <HareketliBas
              key={yol}
              accessibilityLabel={`${no + 1}. fotoğrafı göster`}
              accessibilityState={{ selected: sira === no }}
              onPress={() => setSira(no)}
              style={[s.kucuk, { borderColor: sira === no ? renk.murekkep : renk.cizgi }]}
            >
              <Gorsel source={gorselKaynagi(yol)} contentFit="contain" style={StyleSheet.absoluteFill} />
            </HareketliBas>
          ))}
          {!!ilan.video && (
            <HareketliBas
              accessibilityLabel="Ürün videosunu seç"
              onPress={() => setSira(fotograflar.length)}
              style={s.kucuk}
            >
              <Play size={20} />
              <Yazi style={{ fontSize: 10 }}>Video</Yazi>
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
            <View style={s.ust}>
              <Yazi numberOfLines={1} style={{ color: '#fff', flex: 1, fontSize: 13 }}>
                {ilan.baslik}
              </Yazi>
              {!video && (
                <>
                  <SimgeButon etiket="Uzaklaştır" onPress={() => setOlcek((eski) => Math.max(1, eski - 0.5))}>
                    <ZoomOut size={19} />
                  </SimgeButon>
                  <SimgeButon
                    etiket="Yakınlaştır"
                    onPress={() => setOlcek((eski) => Math.min(4, eski + 0.5))}
                  >
                    <ZoomIn size={19} />
                  </SimgeButon>
                  <SimgeButon etiket="Görünümü sıfırla" onPress={() => setOlcek(1)}>
                    <RotateCcw size={18} />
                  </SimgeButon>
                </>
              )}
              <SimgeButon etiket="Galeriyi kapat" onPress={() => setAcik(false)}>
                <X size={20} />
              </SimgeButon>
            </View>
            {video && ilan.video ? (
              <VideoOynatici kaynak={ilan.video} baslik={ilan.baslik} />
            ) : (
              <ScrollView
                maximumZoomScale={4}
                minimumZoomScale={1}
                centerContent
                contentContainerStyle={{
                  minHeight: yukseklik - 190,
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
                    contentFit="contain"
                    style={{ width: genislik * olcek, height: (yukseklik - 210) * olcek }}
                    accessibilityLabel={ilan.baslik}
                  />
                </ScrollView>
              </ScrollView>
            )}
            <View style={[s.ust, { justifyContent: 'space-between', paddingBottom: 24 }]}>
              <SimgeButon etiket="Önceki medya" onPress={() => gec(-1)}>
                <ChevronLeft size={21} />
              </SimgeButon>
              <Yazi style={{ color: '#fff' }}>{video ? 'Video' : `${sira + 1} / ${fotograflar.length}`}</Yazi>
              <SimgeButon etiket="Sonraki medya" onPress={() => gec(1)}>
                <ChevronRight size={21} />
              </SimgeButon>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  onizleme: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: renk.cizgi,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  buyut: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fffffff2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sayac: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 6,
    backgroundColor: '#fffffff2',
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
});
