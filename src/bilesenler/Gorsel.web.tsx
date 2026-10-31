import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { ImageProps } from 'expo-image';
import { useMedyaAdresi } from '../durum/medyaDeposu';

/** Web görseli ilk statik HTML'de de yer alır; kart alanı yüklenmeden ayrılır. */
export function Gorsel({ source, style, contentFit = 'cover', priority, accessibilityLabel }: ImageProps) {
  const kaynak = Array.isArray(source) ? source[0] : source;
  const uri =
    typeof kaynak === 'string'
      ? kaynak
      : kaynak && typeof kaynak === 'object' && 'uri' in kaynak
        ? kaynak.uri
        : undefined;
  const adres = useMedyaAdresi(uri);
  return (
    <View style={[{ overflow: 'hidden' }, StyleSheet.flatten(style) as ViewStyle]}>
      <img
        src={adres}
        alt={accessibilityLabel || ''}
        loading={priority === 'high' || priority === 'normal' ? 'eager' : 'lazy'}
        fetchPriority={priority === 'high' ? 'high' : priority === 'low' ? 'low' : 'auto'}
        decoding="async"
        draggable={false}
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
