import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { GorselProps } from './Gorsel';
import { useMedyaAdresi } from '../durum/medyaDeposu';
import { gorselVaryantlari } from '../veri/gorselVaryantlari';
import { IskeletParcasi, YuklemeIskeleti } from './YuklemeIskeleti';

const saydamPiksel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/** Web görseli ilk statik HTML'de de yer alır; kart alanı yüklenmeden ayrılır. */
export function Gorsel({
  source,
  style,
  contentFit = 'cover',
  priority,
  sizes,
  media,
  accessibilityLabel,
  onLoad,
  onError,
  onLoadEnd,
  onDisplay,
}: GorselProps) {
  const kaynak = Array.isArray(source) ? source[0] : source;
  const uri =
    typeof kaynak === 'string'
      ? kaynak
      : kaynak && typeof kaynak === 'object' && 'uri' in kaynak
        ? kaynak.uri
        : undefined;
  const adres = useMedyaAdresi(uri);
  const varyantlar = sizes && adres ? gorselVaryantlari[adres] : undefined;
  const srcSet = varyantlar?.variants.map((gorsel) => `${gorsel.uri} ${gorsel.width}w`).join(', ');
  const oncelikli = priority === 'high' || priority === 'normal';
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
  const resimElemani = (
    <img
      ref={resim}
      src={media ? saydamPiksel : (varyantlar?.variants[1]?.uri ?? adres)}
      srcSet={media ? undefined : srcSet}
      sizes={!media && srcSet ? `${oncelikli ? '' : 'auto, '}${sizes}` : undefined}
      width={varyantlar?.width}
      height={varyantlar?.height}
      alt={accessibilityLabel || ''}
      loading={oncelikli ? 'eager' : 'lazy'}
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
  );
  return (
    <View style={[{ overflow: 'hidden' }, StyleSheet.flatten(style) as ViewStyle]}>
      {yukleniyor ? (
        <YuklemeIskeleti duyur={false} style={StyleSheet.absoluteFill}>
          <IskeletParcasi yukseklik="100%" yaricap={0} />
        </YuklemeIskeleti>
      ) : null}
      {priority === 'high' && !media && !!adres && (
        <link
          rel="preload"
          as="image"
          href={srcSet ? undefined : adres}
          imageSrcSet={srcSet}
          imageSizes={sizes}
          fetchPriority="high"
        />
      )}
      {media ? (
        <>
          {oncelikli && adres && (
            <link
              rel="preload"
              as="image"
              media={media}
              href={srcSet ? undefined : adres}
              imageSrcSet={srcSet}
              imageSizes={sizes}
              fetchPriority={priority === 'high' ? 'high' : 'auto'}
            />
          )}
          <picture style={{ display: 'contents' }}>
            <source media={media} srcSet={srcSet ?? adres} sizes={sizes} />
            {resimElemani}
          </picture>
        </>
      ) : (
        resimElemani
      )}
    </View>
  );
}
