import { View } from 'react-native';
import Info from 'lucide-react-native/icons/info';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';

const kontroller = [
  { ad: 'Telefon kontrolü', deger: 'Doğrulama kaydı yok' },
  { ad: 'Satış geçmişi', deger: 'Doğrulanmış işlem yok' },
  { ad: 'Yanıt geçmişi', deger: 'Yeterli veri yok' },
];

/** İlan veya profil bilgisi eklemek; kimlik, telefon ya da satış doğrulaması sağlamaz. */
export function SaticiKontrolleri() {
  const { renk } = useTema();
  return (
    <View style={{ gap: 12, minWidth: 0 }}>
      <Yazi style={{ fontWeight: '700', fontSize: 13 }}>Satıcı bilgileri</Yazi>
      {kontroller.map((kontrol) => (
        <View key={kontrol.ad} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          <Yazi style={{ fontSize: 12, lineHeight: 19, flex: 1, minWidth: 90, color: renk.gri }}>
            {kontrol.ad}
          </Yazi>
          <Yazi style={{ fontSize: 12, lineHeight: 19, flex: 1.2, minWidth: 110 }}>{kontrol.deger}</Yazi>
        </View>
      ))}
      <View style={{ flexDirection: 'row', gap: 7, paddingTop: 2 }}>
        <Info size={14} color={renk.gri} style={{ marginTop: 2 }} />
        <Yazi style={{ flex: 1, fontSize: 11, color: renk.gri, lineHeight: 18 }}>
          Profil ve iletişim bilgileri ürünün ya da satıcının doğrulandığı anlamına gelmez.
        </Yazi>
      </View>
    </View>
  );
}
