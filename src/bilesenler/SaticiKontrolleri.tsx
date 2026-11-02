import { View } from 'react-native';
import Info from 'lucide-react-native/icons/info';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';

/** İletişim bilgisi eklenmesi, kimlik veya telefon doğrulaması sayılmaz. */
export function SaticiKontrolleri() {
  const { renk } = useTema();
  return (
    <View
      dataSet={{ 'satici-guven-bilgileri': 'true' }}
      style={{ minWidth: 0, borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 14, gap: 12 }}
    >
      <Yazi style={{ fontSize: 13, lineHeight: 20, fontWeight: '700' }}>Doğrulama bilgileri</Yazi>
      <View style={{ gap: 8 }}>
        {['Telefon', 'Kimlik'].map((alan) => (
          <View key={alan} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: 8 }}>
            <Yazi style={{ flex: 1, fontSize: 12, lineHeight: 20 }}>{alan}</Yazi>
            <Yazi style={{ fontSize: 12, lineHeight: 20, color: renk.gri }}>Doğrulanmadı</Yazi>
          </View>
        ))}
      </View>
      <Yazi style={{ fontSize: 11, lineHeight: 18, color: renk.gri }}>
        Profil ve ilan bilgileri ilan sahibinin beyanıdır.
      </Yazi>
      <View style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 12, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Info size={14} color={renk.gri} style={{ flexShrink: 0 }} />
          <Yazi style={{ flex: 1, fontSize: 12, lineHeight: 20, fontWeight: '600' }}>Alışverişten önce</Yazi>
        </View>
        <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 20 }}>
          İlanla ilgili sorularını mesajla sor. Şifreni ya da doğrulama kodlarını paylaşma.
        </Yazi>
      </View>
    </View>
  );
}
