import { useState } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { IskeletParcasi, YuklemeIskeleti } from './YuklemeIskeleti';

export type GorselProps = ImageProps & {
  sizes?: string;
  /** Web'de picture kaynağı ve ön yükleme aynı ekran sorgusunu kullanır. */
  media?: string;
};

export function Gorsel({
  source,
  style,
  onLoad,
  onError,
  onDisplay,
  sizes: _sizes,
  media: _media,
  ...props
}: GorselProps) {
  const kaynak = Array.isArray(source) ? source[0] : source;
  const kimlik = kaynak && typeof kaynak === 'object' && 'uri' in kaynak ? kaynak.uri : kaynak;
  const [sonlanan, setSonlanan] = useState<unknown>(null);
  const yukleniyor = Boolean(source) && sonlanan !== kimlik;
  return (
    <View style={[StyleSheet.flatten(style) as ViewStyle, { overflow: 'hidden' }]}>
      {yukleniyor ? (
        <YuklemeIskeleti duyur={false} style={StyleSheet.absoluteFill}>
          <IskeletParcasi yukseklik="100%" yaricap={0} />
        </YuklemeIskeleti>
      ) : null}
      <Image
        {...props}
        source={source}
        style={StyleSheet.absoluteFill}
        onLoad={(olay) => {
          setSonlanan(kimlik);
          onLoad?.(olay);
        }}
        onError={(olay) => {
          setSonlanan(kimlik);
          onError?.(olay);
        }}
        onDisplay={() => {
          setSonlanan(kimlik);
          onDisplay?.();
        }}
      />
    </View>
  );
}

Gorsel.prefetch = Image.prefetch;
