import { View } from 'react-native';
import Mail from 'lucide-react-native/icons/mail';
import Monitor from 'lucide-react-native/icons/monitor';
import UserRound from 'lucide-react-native/icons/user-round';
import { useEkran, useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';

export type AyarBolumu = 'profil' | 'hesap' | 'gorunum';
export type HesapAyarSekmeleriProps = { secili: AyarBolumu; degistir: (bolum: AyarBolumu) => void };

export function HesapAyarSekmeleri({ secili, degistir }: HesapAyarSekmeleriProps) {
  const { renk } = useTema();
  const { dar } = useEkran();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Ayarlar bölümleri"
      style={{ gap: 6, flexShrink: 0, width: dar ? '100%' : 224, flexDirection: dar ? 'row' : 'column' }}
    >
      {[
        { id: 'profil' as const, ad: dar ? 'Profil' : 'Profil bilgileri', Simge: UserRound },
        { id: 'hesap' as const, ad: dar ? 'Hesap' : 'Hesap bilgileri', Simge: Mail },
        { id: 'gorunum' as const, ad: 'Görünüm', Simge: Monitor },
      ].map(({ id, ad, Simge }) => (
        <HareketliBas
          key={id}
          accessibilityRole="tab"
          accessibilityState={{ selected: secili === id }}
          nativeID={`ayar-sekme-${id}`}
          onPress={() => degistir(id)}
          style={{
            minHeight: dar ? 66 : 48,
            flex: dar ? 1 : undefined,
            minWidth: 0,
            flexDirection: dar ? 'column' : 'row',
            alignItems: 'center',
            gap: dar ? 5 : 10,
            paddingHorizontal: dar ? 4 : 16,
            justifyContent: dar ? 'center' : 'flex-start',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: secili === id ? renk.cizgi : 'transparent',
            backgroundColor: secili === id ? renk.acik : 'transparent',
          }}
        >
          <Simge size={18} color={renk.murekkep} />
          <Yazi style={{ fontSize: 13, fontWeight: secili === id ? '700' : '500' }}>{ad}</Yazi>
        </HareketliBas>
      ))}
    </View>
  );
}
