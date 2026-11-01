import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import Play from 'lucide-react-native/icons/play';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { gorselKaynagi } from '../veri/gorseller';
import type { VideoOynaticiProps } from './VideoOynatici.types';

export function VideoOynatici({
  kaynak,
  baslik = 'Ürün videosu',
  poster,
  aktif = true,
  sahne = false,
}: VideoOynaticiProps) {
  const [ilkKare, setIlkKare] = useState(false);
  const kucukPencere = useRef(false);
  const player = useVideoPlayer(
    kaynak === '/videolar/iphone-15-pro.mp4'
      ? require('../../public/videolar/iphone-15-pro.mp4')
      : { uri: kaynak },
    (oynatici) => {
      oynatici.loop = false;
      oynatici.staysActiveInBackground = false;
      oynatici.showNowPlayingNotification = false;
    },
  );
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  useEffect(() => {
    setIlkKare(false);
  }, [kaynak]);
  useEffect(() => {
    if (!aktif) player.pause();
    const abonelik = AppState.addEventListener('change', (durum) => {
      if (durum !== 'active' && !kucukPencere.current) player.pause();
    });
    return () => {
      abonelik.remove();
      try {
        player.pause();
      } catch {
        /* Hook oynatıcıyı serbest bırakmış olabilir. */
      }
    };
  }, [aktif, player]);
  return (
    <View style={[s.kutu, sahne ? { flex: 1, height: '100%' } : { aspectRatio: 16 / 10, maxHeight: 420 }]}>
      <VideoView
        accessibilityLabel={baslik}
        player={player}
        nativeControls
        contentFit="contain"
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
        startsPictureInPictureAutomatically={false}
        onPictureInPictureStart={() => {
          kucukPencere.current = true;
        }}
        onPictureInPictureStop={() => {
          kucukPencere.current = false;
        }}
        onFirstFrameRender={() => setIlkKare(true)}
        style={StyleSheet.absoluteFill}
      />
      {!!poster && !ilkKare && status !== 'error' && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Gorsel source={gorselKaynagi(poster)} contentFit="contain" style={StyleSheet.absoluteFill} />
        </View>
      )}
      {(status === 'loading' || status === 'idle') && (
        <View pointerEvents="none" style={s.durum}>
          <ActivityIndicator color="#ffd12f" accessibilityLabel="Video yükleniyor" />
        </View>
      )}
      {status === 'readyToPlay' && !ilkKare && (
        <HareketliBas
          accessibilityRole="button"
          accessibilityLabel="Videoyu oynat"
          onPress={() => player.play()}
          style={s.oynat}
        >
          <Play size={26} color="#17191b" fill="#17191b" />
        </HareketliBas>
      )}
      {status === 'error' && (
        <View style={[s.durum, { padding: 22, gap: 14, backgroundColor: '#17191b' }]}>
          <Yazi style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Video oynatılamadı</Yazi>
          <Yazi style={{ color: '#d1d1d1', textAlign: 'center', fontSize: 12 }}>
            Bağlantını kontrol edip tekrar dene. Dosya bu cihazda desteklenmiyor olabilir.
          </Yazi>
          <HareketliBas
            accessibilityRole="button"
            onPress={() => {
              setIlkKare(false);
              void player
                .replaceAsync(
                  kaynak === '/videolar/iphone-15-pro.mp4'
                    ? require('../../public/videolar/iphone-15-pro.mp4')
                    : kaynak,
                )
                .catch(() => {});
            }}
            style={s.tekrar}
          >
            <RotateCcw color="#fff" size={16} />
            <Yazi style={{ color: '#fff', fontWeight: '600' }}>Tekrar dene</Yazi>
          </HareketliBas>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  kutu: { width: '100%', minHeight: 160, backgroundColor: '#17191b', overflow: 'hidden', borderRadius: 10 },
  durum: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  oynat: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -28,
    marginTop: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffd12f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tekrar: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ffffff55',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
