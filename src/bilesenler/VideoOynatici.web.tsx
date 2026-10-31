import { StyleSheet, View } from 'react-native';
import { useMedyaAdresi } from '../durum/medyaDeposu';

export function VideoOynatici({ kaynak, baslik = 'Ürün videosu' }: { kaynak: string; baslik?: string }) {
  const adres = useMedyaAdresi(kaynak);
  return (
    <View style={s.kutu}>
      <video
        src={adres}
        aria-label={baslik}
        controls
        playsInline
        preload="none"
        style={{ display: 'block', width: '100%', maxHeight: 420, objectFit: 'contain' }}
      />
    </View>
  );
}
const s = StyleSheet.create({ kutu: { overflow: 'hidden', borderRadius: 12, backgroundColor: '#17191b' } });
