import { useState } from 'react';
import { Linking, View } from 'react-native';
import Phone from 'lucide-react-native/icons/phone';
import Copy from 'lucide-react-native/icons/copy';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import * as Clipboard from 'expo-clipboard';
import { Buton, Yazi } from './Temel';
import { HareketliBas } from './Hareketli';
import { useTema } from '../tasarim/tema';
import { telefonuGoster, telefonuNormallestir } from '../veri/telefon';

export function SaticiIletisimi({ telefon, gorunur }: { telefon?: string; gorunur: boolean }) {
  const { renk } = useTema();
  const [hata, setHata] = useState('');
  const [genislik, setGenislik] = useState(0);
  const dar = genislik === 0 || genislik < 300;
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
  async function kopyala() {
    if (!numara) return;
    try {
      await Clipboard.setStringAsync(numara);
      setHata('Telefon numarası kopyalandı.');
    } catch {
      setHata('Numarayı seçip kopyalayabilirsin.');
    }
  }
  const telefonYazisi = (
    <Yazi
      dataSet={{ 'satici-telefon-numarasi': 'true' }}
      style={{ fontSize: 15, lineHeight: 23, fontWeight: '700', flexShrink: 0 }}
    >
      {telefonuGoster(numara).replace(/ /g, '\u00a0')}
    </Yazi>
  );
  return (
    <View onLayout={(olay) => setGenislik(olay.nativeEvent.layout.width)} style={{ gap: 7, minWidth: 0 }}>
      <HareketliBas
        accessibilityRole="button"
        accessibilityLabel={`${telefonuGoster(numara)} numarasından ilan sahibini ara`}
        onPress={ara}
        style={{
          minHeight: 48,
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 5,
          borderWidth: 1,
          borderColor: renk.cizgi,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Phone size={15} color={renk.gri} style={{ flexShrink: 0 }} />
            <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>Cep</Yazi>
          </View>
          {!dar && telefonYazisi}
          <ArrowUpRight size={14} color={renk.gri} style={{ flexShrink: 0 }} />
        </View>
        {dar && telefonYazisi}
      </HareketliBas>
      {!!hata && (
        <View style={{ gap: 8 }}>
          <Yazi accessibilityLiveRegion="polite" style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
            {hata}
          </Yazi>
          <Yazi selectable style={{ fontSize: 14 }}>
            {telefonuGoster(numara)}
          </Yazi>
          <Buton ikincil onPress={kopyala} simge={<Copy size={14} />} style={{ minHeight: 48 }}>
            Numarayı kopyala
          </Buton>
        </View>
      )}
    </View>
  );
}
