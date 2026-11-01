import { View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapIcerigi, guvenliDonusYolu } from '../bilesenler/HesapIcerigi';
import { HareketliBas } from '../bilesenler/Hareketli';
import { Yazi } from '../bilesenler/Temel';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';

export { HesapIcerigi } from '../bilesenler/HesapIcerigi';

export default function Hesap({ kayit = false }: { kayit?: boolean }) {
  const { renk } = useTema();
  const { mobil, bosluk, genislik } = useEkran();
  const klavyeAcik = useKlavyeAcik();
  const { donus } = useLocalSearchParams<{ donus?: string | string[] }>();
  return (
    <Kabuk altBilgi={false}>
      <View
        style={[
          ortak.alan,
          {
            flex: 1,
            maxWidth: genislik < 900 ? 540 : 1100,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? (klavyeAcik ? 8 : 18) : 24,
            paddingBottom: mobil ? 20 : 48,
            gap: 14,
          },
        ]}
      >
        {!mobil && (
          <Link href="/kesfet" asChild>
            <HareketliBas
              style={{
                alignSelf: 'flex-start',
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <ArrowLeft size={16} color={renk.gri} />
              <Yazi style={{ color: renk.gri, fontSize: 13 }}>İlanlara dön</Yazi>
            </HareketliBas>
          </Link>
        )}
        <HesapIcerigi kayit={kayit} donus={guvenliDonusYolu(donus)} />
      </View>
    </Kabuk>
  );
}
