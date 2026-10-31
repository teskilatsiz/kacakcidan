import { View } from 'react-native';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { kalin, renk } from '../tasarim/tema';

export type DetaySekmesi = 'aciklama' | 'ozellikler';
export type DetaySekmeleriProps = {
  secili: DetaySekmesi;
  degistir: (sekme: DetaySekmesi) => void;
  kimlik: string;
};
export const detaySekmeleri = [
  { id: 'aciklama', ad: 'Açıklama' },
  { id: 'ozellikler', ad: 'Özellikler' },
] as const;

export function DetaySekmeleri({ secili, degistir, kimlik }: DetaySekmeleriProps) {
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="İlan bilgileri"
      style={{ flexDirection: 'row', gap: 24, borderBottomWidth: 1, borderColor: renk.cizgi }}
    >
      {detaySekmeleri.map((sekme) => (
        <HareketliBas
          key={sekme.id}
          nativeID={`${kimlik}-${sekme.id}`}
          accessibilityRole="tab"
          accessibilityState={{ selected: secili === sekme.id }}
          onPress={() => degistir(sekme.id)}
          style={{
            minHeight: 48,
            justifyContent: 'center',
            borderBottomWidth: 2,
            borderColor: secili === sekme.id ? renk.murekkep : 'transparent',
          }}
        >
          <Yazi
            style={{
              fontFamily: kalin,
              fontWeight: '700',
              color: secili === sekme.id ? renk.murekkep : renk.gri,
            }}
          >
            {sekme.ad}
          </Yazi>
        </HareketliBas>
      ))}
    </View>
  );
}
