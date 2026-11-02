import { useId, useState } from 'react';
import { Platform, View } from 'react-native';
import Info from 'lucide-react-native/icons/info';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';

/** İlan veya profil bilgisi eklemek; kimlik, telefon ya da satış doğrulaması sağlamaz. */
export function SaticiKontrolleri() {
  const { renk } = useTema();
  const [acik, setAcik] = useState(false);
  const kimlik = `satici-bilgileri-${useId()}`;
  return (
    <View style={{ minWidth: 0, borderTopWidth: 1, borderColor: renk.cizgi }}>
      <HareketliBas
        accessibilityRole="button"
        accessibilityState={{ expanded: acik }}
        aria-controls={Platform.OS === 'web' ? kimlik : undefined}
        onPress={() => setAcik((onceki) => !onceki)}
        style={{ flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: 8, paddingVertical: 10 }}
      >
        <Info size={15} color={renk.gri} style={{ flexShrink: 0 }} />
        <Yazi style={{ flex: 1, fontSize: 12, lineHeight: 19, fontWeight: '600' }}>Alışverişten önce</Yazi>
        <ChevronDown
          size={15}
          color={renk.gri}
          style={{ flexShrink: 0, transform: [{ rotate: acik ? '180deg' : '0deg' }] }}
        />
      </HareketliBas>
      <View nativeID={kimlik} style={{ display: acik ? 'flex' : 'none', gap: 9, paddingBottom: 3 }}>
        <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 20 }}>
          İlanı ve satıcının profilini incele. Sorularını mesajla sor; şifreni veya doğrulama kodlarını
          paylaşma.
        </Yazi>
        <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 20 }}>
          Bu profilde kimlik ya da telefon doğrulama bilgisi bulunmuyor. Profil bilgileri ve ilanlar satıcının
          beyanıdır.
        </Yazi>
      </View>
    </View>
  );
}
