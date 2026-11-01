import { View } from 'react-native';
import Check from 'lucide-react-native/icons/check';
import X from 'lucide-react-native/icons/x';
import { usePazar } from '../durum/Pazar';
import { useTema } from '../tasarim/tema';
import { Giris, HareketliBas } from './Hareketli';
import { Yazi } from './Temel';

export function AnlikBildirim({ mesaj }: { mesaj: string }) {
  const { renk } = useTema();
  const { haberVer } = usePazar();
  return (
    <Giris
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        paddingLeft: 14,
        minHeight: 58,
        backgroundColor: renk.beyaz,
        borderWidth: 1,
        borderColor: renk.cizgi,
        borderRadius: 13,
        boxShadow: `0 8px 30px ${renk.golge}`,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: renk.sari,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Check size={17} color={renk.vurguYazi} strokeWidth={2.2} />
      </View>
      <Yazi
        accessibilityLiveRegion="polite"
        role="status"
        style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 20 }}
      >
        {mesaj}
      </Yazi>
      <HareketliBas
        accessibilityLabel="Bildirimi kapat"
        onPress={() => haberVer('')}
        style={{
          width: 38,
          height: 38,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: 8,
        }}
      >
        <X size={17} color={renk.gri} />
      </HareketliBas>
    </Giris>
  );
}
