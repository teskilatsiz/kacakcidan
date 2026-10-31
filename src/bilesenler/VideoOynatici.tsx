import { Linking, View } from 'react-native';
import Play from 'lucide-react-native/icons/play';
import { Buton, Yazi } from './Temel';

export function VideoOynatici({ kaynak, baslik = 'Ürün videosu' }: { kaynak: string; baslik?: string }) {
  return (
    <View style={{ padding: 24, borderRadius: 12, backgroundColor: '#f6f6f3', gap: 12 }}>
      <Yazi>{baslik}</Yazi>
      <Buton ikincil simge={<Play size={18} />} onPress={() => Linking.openURL(kaynak)}>
        Videoyu aç
      </Buton>
    </View>
  );
}
