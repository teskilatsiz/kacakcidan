import { ScrollView } from 'react-native';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { kalin, useTema } from '../tasarim/tema';
import { haritaVerisiniHazirla } from '../veri/haritaYukleyici';

export type DetaySekmesi = 'aciklama' | 'ozellikler' | 'konum' | 'sorular';
export type DetaySekmeleriProps = {
  secili: DetaySekmesi;
  degistir: (sekme: DetaySekmesi) => void;
  kimlik: string;
  ozellikler?: boolean;
};
export const detaySekmeleri = [
  { id: 'aciklama', ad: 'Açıklama' },
  { id: 'ozellikler', ad: 'Özellikler' },
  { id: 'konum', ad: 'Konum' },
  { id: 'sorular', ad: 'Soru & cevap' },
] as const;

export function DetaySekmeleri({ secili, degistir, kimlik, ozellikler = true }: DetaySekmeleriProps) {
  const { renk } = useTema();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel="İlan bilgileri"
      style={{
        flexGrow: 0,
        borderBottomWidth: 1,
        borderColor: renk.cizgi,
      }}
      contentContainerStyle={{ flexDirection: 'row', gap: 16 }}
    >
      {detaySekmeleri
        .filter((sekme) => ozellikler || sekme.id !== 'ozellikler')
        .map((sekme) => (
          <HareketliBas
            key={sekme.id}
            nativeID={`${kimlik}-${sekme.id}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: secili === sekme.id }}
            onPress={() => degistir(sekme.id)}
            onPressIn={sekme.id === 'konum' ? haritaVerisiniHazirla : undefined}
            style={{
              minHeight: 48,
              flexShrink: 0,
              justifyContent: 'center',
              borderBottomWidth: 2,
              borderColor: secili === sekme.id ? renk.murekkep : 'transparent',
            }}
          >
            <Yazi
              style={{
                fontFamily: kalin,
                fontWeight: '700',
                fontSize: 13,
                color: secili === sekme.id ? renk.murekkep : renk.gri,
              }}
            >
              {sekme.ad}
            </Yazi>
          </HareketliBas>
        ))}
    </ScrollView>
  );
}
