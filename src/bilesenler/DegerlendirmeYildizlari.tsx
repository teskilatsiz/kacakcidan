import { View } from 'react-native';
import Star from 'lucide-react-native/icons/star';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';

export const puanAciklamalari = ['Çok kötü', 'Kötü', 'Orta', 'İyi', 'Çok iyi'];

export type DegerlendirmeYildizlariProps = {
  puan: number;
  degistir: (puan: number) => void;
  disabled?: boolean;
};

export function DegerlendirmeYildizlari({ puan, degistir, disabled }: DegerlendirmeYildizlariProps) {
  const { renk } = useTema();
  return (
    <View style={{ gap: 6 }}>
      <Yazi style={{ fontSize: 13, fontWeight: '700' }}>Puanın</Yazi>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Satıcı puanı"
        style={{ flexDirection: 'row', gap: 6 }}
      >
        {puanAciklamalari.map((aciklama, sira) => (
          <HareketliBas
            key={aciklama}
            accessibilityRole="radio"
            accessibilityLabel={`${sira + 1} yıldız, ${aciklama.toLocaleLowerCase('tr-TR')}`}
            accessibilityState={{ checked: puan === sira + 1, disabled }}
            disabled={disabled}
            onPress={() => degistir(sira + 1)}
            style={{
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: puan === sira + 1 ? renk.acik : 'transparent',
            }}
          >
            <Star
              size={30}
              color={puan >= sira + 1 ? renk.murekkep : renk.gri}
              fill={puan >= sira + 1 ? renk.sari : 'none'}
              strokeWidth={1.5}
            />
          </HareketliBas>
        ))}
      </View>
      <Yazi style={{ minHeight: 22, fontSize: 13, color: renk.gri }} accessibilityLiveRegion="polite">
        {puan ? `${puan} / 5 · ${puanAciklamalari[puan - 1]}` : '1 ile 5 arasında bir puan seç.'}
      </Yazi>
    </View>
  );
}
