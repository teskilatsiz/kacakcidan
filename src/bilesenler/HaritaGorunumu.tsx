import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Buton, Yazi } from './Temel';
import { useTema } from '../tasarim/tema';
import { haritaAdresi } from '../veri/haritaAdresi';
import type { HaritaGorunumuProps } from './HaritaGorunumu.types';

function disBaglantiyiAc(adres: string) {
  try {
    const hedef = new URL(adres);
    if (
      hedef.protocol !== 'https:' ||
      !['maps.apple.com', 'www.google.com', 'www.openstreetmap.org'].includes(hedef.hostname)
    )
      return;
    void Linking.openURL(hedef.href).catch(() => {
      Alert.alert('Bağlantı açılamadı', 'İnternet bağlantını kontrol edip yeniden dene.');
    });
  } catch {
    // WebView'den yalnızca bilinen harita sağlayıcılarının HTTPS adresleri açılır.
  }
}

export function HaritaGorunumu({ konum, baslik, yukseklik }: HaritaGorunumuProps) {
  const { renk, koyu } = useTema();
  const [hata, setHata] = useState(false);
  const kaynak = useMemo(
    () => ({
      uri: `${(process.env.EXPO_PUBLIC_SITE_URL || 'https://kacakcidan.netlify.app').replace(/\/$/, '')}${haritaAdresi(konum, koyu)}`,
    }),
    [konum, koyu],
  );
  return (
    <View style={{ height: yukseklik, borderRadius: 8, overflow: 'hidden', backgroundColor: renk.zemin }}>
      {hata ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 }}>
          <Yazi style={{ textAlign: 'center', color: renk.gri }}>
            Harita yüklenemedi. Bağlantını kontrol edip yeniden dene.
          </Yazi>
          <Buton onPress={() => setHata(false)}>Yeniden dene</Buton>
        </View>
      ) : (
        <WebView
          source={kaynak}
          accessibilityLabel={baslik}
          style={{ flex: 1, backgroundColor: renk.zemin }}
          startInLoadingState
          renderLoading={() => <ActivityIndicator color={renk.murekkep} />}
          geolocationEnabled={false}
          applicationNameForUserAgent="Kacakcidan/1.0 (+https://kacakcidan.netlify.app)"
          onOpenWindow={({ nativeEvent }) => disBaglantiyiAc(nativeEvent.targetUrl)}
          onError={() => setHata(true)}
          onHttpError={() => setHata(true)}
          onShouldStartLoadWithRequest={({ url }) => {
            if (url === 'about:blank') return true;
            try {
              const hedef = new URL(url);
              const sunucu = new URL(kaynak.uri);
              if (hedef.origin === sunucu.origin && /^\/harita(?:\.html)?$/.test(hedef.pathname)) return true;
            } catch {
              return false;
            }
            disBaglantiyiAc(url);
            return false;
          }}
        />
      )}
    </View>
  );
}
