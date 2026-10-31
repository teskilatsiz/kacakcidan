import { StyleSheet, View } from 'react-native';
import ArrowLeftRight from 'lucide-react-native/icons/arrow-left-right';
import { Yazi } from './Temel';
import type { Ilan } from '../veri/ilanlar';

export function IlanEtiketleri({
  durum,
  takas,
  kucuk = false,
}: Pick<Ilan, 'durum' | 'takas'> & { kucuk?: boolean }) {
  return (
    <View style={[s.satir, kucuk && { gap: 4 }]}>
      <View style={[s.etiket, kucuk && s.kucuk]} accessibilityLabel={`Ürün durumu: ${durum}`}>
        <Yazi style={[s.yazi, kucuk && s.kucukYazi]}>{durum}</Yazi>
      </View>
      {!!takas && (
        <View style={[s.etiket, kucuk && s.kucuk]} accessibilityLabel="Takasa açık">
          <ArrowLeftRight size={kucuk ? 11 : 13} color="#555555" />
          <Yazi style={[s.yazi, kucuk && s.kucukYazi]}>{kucuk ? 'Takas' : 'Takasa açık'}</Yazi>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  satir: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  etiket: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: '#f1f1ef',
    borderRadius: 5,
  },
  yazi: { color: '#4a4a4a', fontSize: 12, lineHeight: 20 },
  kucuk: { gap: 4, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  kucukYazi: { fontSize: 10, lineHeight: 16 },
});
