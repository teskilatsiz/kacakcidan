import { View } from 'react-native';
import Sun from 'lucide-react-native/icons/sun';
import Moon from 'lucide-react-native/icons/moon';
import Monitor from 'lucide-react-native/icons/monitor';
import Check from 'lucide-react-native/icons/check';
import { useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';

const secenekler = [
  { id: 'acik', ad: 'Açık', Simge: Sun },
  { id: 'koyu', ad: 'Koyu', Simge: Moon },
  { id: 'sistem', ad: 'Sistem', Simge: Monitor },
] as const;

export function TemaSecici({ kompakt = false }: { kompakt?: boolean }) {
  const { renk, tercih, temaSec } = useTema();
  return (
    <View
      style={{
        gap: 10,
        flexDirection: kompakt ? 'row' : 'column',
        alignItems: kompakt ? 'center' : 'stretch',
        justifyContent: 'space-between',
      }}
    >
      <Yazi style={{ fontWeight: '600', fontSize: 13 }}>Görünüm</Yazi>
      <View
        style={{
          flexDirection: 'row',
          gap: kompakt ? 2 : 8,
          padding: kompakt ? 3 : 0,
          backgroundColor: kompakt ? renk.zemin : undefined,
          borderRadius: 10,
        }}
        accessibilityRole="radiogroup"
        accessibilityLabel="Görünüm tercihi"
      >
        {secenekler.map(({ id, ad, Simge }) => {
          const secili = tercih === id;
          return (
            <HareketliBas
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ checked: secili }}
              accessibilityLabel={`${ad} tema`}
              onPress={() => temaSec(id)}
              style={{
                flex: kompakt ? undefined : 1,
                width: kompakt ? 44 : undefined,
                minWidth: 0,
                minHeight: kompakt ? 44 : 72,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: secili ? renk.cizgi : 'transparent',
                backgroundColor: secili ? renk.beyaz : kompakt ? 'transparent' : renk.acik,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <Simge size={19} color={renk.murekkep} strokeWidth={secili ? 2 : 1.6} />
              {!kompakt && (
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                  <Yazi style={{ fontSize: 12, fontWeight: secili ? '700' : '400' }}>{ad}</Yazi>
                  {secili && <Check size={12} color={renk.murekkep} />}
                </View>
              )}
            </HareketliBas>
          );
        })}
      </View>
    </View>
  );
}
