import { View } from 'react-native';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { kalin, useTema } from '../tasarim/tema';

export type DetaySekmesi = 'aciklama' | 'ozellikler' | 'sorular';
export type DetaySekmeleriProps = {
  secili: DetaySekmesi;
  degistir: (sekme: DetaySekmesi) => void;
  kimlik: string;
};
export const detaySekmeleri = [
  { id: 'aciklama', ad: 'Açıklama' },
  { id: 'ozellikler', ad: 'Özellikler' },
  { id: 'sorular', ad: 'Soru & cevap' },
] as const;

export function DetaySekmeleri({ secili, degistir, kimlik }: DetaySekmeleriProps) {
  const { renk } = useTema();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="İlan bilgileri"
      style={{
        flexDirection: 'row',
        gap: 20,
        borderBottomWidth: 1,
        borderColor: renk.cizgi,
        flexWrap: 'wrap',
      }}
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
