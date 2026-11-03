import { useId, useState } from 'react';
import { Platform, View } from 'react-native';
import Info from 'lucide-react-native/icons/info';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import { Giris, HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';

/** İletişim bilgisi eklenmesi, kimlik veya telefon doğrulaması sayılmaz. */
export function SaticiKontrolleri() {
  const { renk } = useTema();
  const [acik, setAcik] = useState(false);
  const kimlik = useId();
  const Simge = acik ? ChevronUp : ChevronDown;
  return (
    <View
      dataSet={{ 'satici-guven-bilgileri': 'true' }}
      style={{ minWidth: 0, borderTopWidth: 1, borderColor: renk.cizgi }}
    >
      <HareketliBas
        accessibilityRole="button"
        accessibilityLabel="Doğrulama ve güvenlik bilgileri. Telefon doğrulanmadı, kimlik doğrulanmadı."
        accessibilityState={{ expanded: acik }}
        aria-controls={Platform.OS === 'web' ? kimlik : undefined}
        onPress={() => setAcik((deger) => !deger)}
        style={{ minHeight: 48, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <Info size={15} color={renk.gri} style={{ flexShrink: 0 }} />
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <Yazi style={{ fontSize: 12, lineHeight: 18, fontWeight: '600' }}>Doğrulama ve güvenlik</Yazi>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Telefon', 'Kimlik'].map((alan) => (
              <Yazi key={alan} style={{ fontSize: 11, lineHeight: 17, color: renk.gri }}>
                {alan}: Doğrulanmadı
              </Yazi>
            ))}
          </View>
        </View>
        <Simge size={15} color={renk.gri} style={{ flexShrink: 0 }} />
      </HareketliBas>
      <View nativeID={kimlik}>
        {acik && (
          <Giris style={{ paddingTop: 2, paddingBottom: 12, gap: 8 }}>
            <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
              Profil ve ilan bilgileri ilan sahibinin beyanıdır. Telefon numarası paylaşılması, numaranın veya
              kimliğin doğrulandığı anlamına gelmez.
            </Yazi>
            <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
              Ürünü görmeden kapora gönderme. Şifreni ve doğrulama kodlarını paylaşma.
            </Yazi>
          </Giris>
        )}
      </View>
    </View>
  );
}
