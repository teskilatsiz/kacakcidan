import { useState } from 'react';
import { Linking, View } from 'react-native';
import Phone from 'lucide-react-native/icons/phone';
import { Buton, Yazi } from './Temel';
import { useTema } from '../tasarim/tema';
import { telefonuGoster, telefonuNormallestir } from '../veri/telefon';

export function SaticiIletisimi({ telefon, gorunur }: { telefon?: string; gorunur: boolean }) {
  const { renk } = useTema();
  const [hata, setHata] = useState('');
  const numara = telefonuNormallestir(telefon);
  if (!gorunur || !numara) return null;
  async function ara() {
    setHata('');
    try {
      await Linking.openURL(`tel:${numara}`);
    } catch {
      setHata('Arama açılamadı. Numarayı kopyalayıp telefonundan arayabilirsin.');
    }
  }
  return (
    <View style={{ gap: 7 }}>
      <Buton
        ikincil
        onPress={ara}
        simge={<Phone size={16} color={renk.murekkep} />}
        style={{ minHeight: 46 }}
      >
        {telefonuGoster(numara)}
      </Buton>
      {!!hata && (
        <Yazi selectable style={{ fontSize: 14 }}>
          {telefonuGoster(numara)}
        </Yazi>
      )}
      <Yazi style={{ fontSize: 11, color: renk.gri }}>
        {hata || 'İlan sahibinin paylaştığı telefon numarası'}
      </Yazi>
    </View>
  );
}
