import { useRouter } from 'expo-router';
import { Kabuk } from '../src/bilesenler/Kabuk';
import { BosDurum, Buton } from '../src/bilesenler/Temel';
import { sayfaMetasi } from '../src/tasarim/seo';
export function generateMetadata() {
  return sayfaMetasi(
    'Sayfa bulunamadı | Kaçakçıdan',
    'Aradığın sayfa burada değil. Yeni keşiflere göz at.',
    '/404',
    true,
  );
}
export default function Bulunamadi() {
  const router = useRouter();
  return (
    <Kabuk>
      <BosDurum
        baslik="Burada bir şey kalmamış."
        aciklama="Bu adres değişmiş ya da sayfa kaldırılmış olabilir. Yeni bir keşifle devam edelim."
        eylem={<Buton onPress={() => router.replace('/')}>Ana sayfaya dön</Buton>}
      />
    </Kabuk>
  );
}
