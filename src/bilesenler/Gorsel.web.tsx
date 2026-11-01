import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { ImageProps } from 'expo-image';
import { useMedyaAdresi } from '../durum/medyaDeposu';
import { IskeletParcasi, YuklemeIskeleti } from './YuklemeIskeleti';

/** Web görseli ilk statik HTML'de de yer alır; kart alanı yüklenmeden ayrılır. */
export function Gorsel({
  source,
  style,
  contentFit = 'cover',
  priority,
  accessibilityLabel,
  onLoad,
  onError,
  onLoadEnd,
  onDisplay,
}: ImageProps) {
  const kaynak = Array.isArray(source) ? source[0] : source;
  const uri =
    typeof kaynak === 'string'
      ? kaynak
      : kaynak && typeof kaynak === 'object' && 'uri' in kaynak
        ? kaynak.uri
        : undefined;
  const adres = useMedyaAdresi(uri);
  const resim = useRef<HTMLImageElement>(null);
  const [gorunur, setGorunur] = useState(priority === 'high' || priority === 'normal');
  const [sonlanan, setSonlanan] = useState<string>();
  useEffect(() => {
    const eleman = resim.current;
    if (!eleman) return;
    if (eleman.complete && eleman.currentSrc) setSonlanan(adres);
    if (gorunur) return;
    if (typeof IntersectionObserver === 'undefined') {
      setGorunur(true);
      return;
    }
    const gozlem = new IntersectionObserver((kayitlar) => {
      if (kayitlar.some((kayit) => kayit.isIntersecting)) {
        setGorunur(true);
        gozlem.disconnect();
      }
    });
    gozlem.observe(eleman);
    return () => gozlem.disconnect();
  }, [adres, gorunur]);
  const yukleniyor = gorunur && Boolean(uri) && (!adres || sonlanan !== adres);
  return (
    <View style={[{ overflow: 'hidden' }, StyleSheet.flatten(style) as ViewStyle]}>
      {yukleniyor ? (
        <YuklemeIskeleti duyur={false} style={StyleSheet.absoluteFill}>
          <IskeletParcasi yukseklik="100%" yaricap={0} />
        </YuklemeIskeleti>
      ) : null}
      <img
        ref={resim}
        src={adres}
        alt={accessibilityLabel || ''}
        loading={priority === 'high' || priority === 'normal' ? 'eager' : 'lazy'}
        fetchPriority={priority === 'high' ? 'high' : priority === 'low' ? 'low' : 'auto'}
        decoding="async"
        draggable={false}
        onLoad={(olay) => {
          setSonlanan(adres);
          onLoad?.({
            cacheType: 'none',
            source: {
              url: adres ?? '',
              width: olay.currentTarget.naturalWidth,
              height: olay.currentTarget.naturalHeight,
              mediaType: 'image',
            },
          });
          onLoadEnd?.();
          onDisplay?.();
        }}
        onError={() => {
          setSonlanan(adres);
          onError?.({ error: 'Görsel yüklenemedi.' });
          onLoadEnd?.();
        }}
        style={{
          display: 'block',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: contentFit,
          color: 'transparent',
        }}
      />
    </View>
  );
}
