import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import LogOut from 'lucide-react-native/icons/log-out';
import { usePazar } from '../durum/Pazar';
import { useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { Buton, Pencere, Yazi } from './Temel';

export function CikisOnayi({ acik, kapat }: { acik: boolean; kapat: () => void }) {
  const { renk } = useTema();
  const { cikisYap } = usePazar();
  const router = useRouter();
  return (
    <Pencere
      acik={acik}
      kapat={kapat}
      baslik="Çıkış yapmak istiyor musun?"
      altlik={
        <View style={{ flexDirection: 'row', gap: 10, minWidth: 0 }}>
          <Buton ikincil onPress={kapat} style={{ flex: 1, minWidth: 0, paddingHorizontal: 8 }}>
            Vazgeç
          </Buton>
          <Buton
            onPress={() => {
              kapat();
              cikisYap();
              router.replace('/');
            }}
            style={{ flex: 1, minWidth: 0, paddingHorizontal: 8 }}
          >
            Çıkış yap
          </Buton>
        </View>
      }
    >
      <Yazi style={{ color: renk.gri, fontSize: 14, lineHeight: 23 }}>
        Bu cihazdaki oturumun kapanacak. İlanlarını ve favorilerini görmek için yeniden giriş yapabilirsin.
      </Yazi>
    </Pencere>
  );
}

export function CikisDugmesi({ style }: { style?: StyleProp<ViewStyle> }) {
  const { renk } = useTema();
  const [acik, setAcik] = useState(false);
  return (
    <>
      <HareketliBas
        accessibilityLabel="Hesabından çıkış yap"
        onPress={() => setAcik(true)}
        style={[
          {
            minHeight: 48,
            minWidth: 0,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            backgroundColor: renk.zemin,
          },
          style,
        ]}
      >
        <LogOut size={18} color={renk.murekkep} />
        <Yazi style={{ flexShrink: 1, minWidth: 0, fontSize: 13, fontWeight: '600' }}>Çıkış yap</Yazi>
      </HareketliBas>
      <CikisOnayi acik={acik} kapat={() => setAcik(false)} />
    </>
  );
}
