import { View } from 'react-native';
import { useRouter } from 'expo-router';
import UserRound from 'lucide-react-native/icons/user-round';
import { Kabuk } from './Kabuk';
import { Baslik, Buton, Yazi } from './Temel';
import { usePazar } from '../durum/Pazar';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { IskeletParcasi, YuklemeIskeleti } from './YuklemeIskeleti';

export function HesapGerekli({
  baslik,
  aciklama,
  donus,
}: {
  baslik: string;
  aciklama: string;
  donus: string;
}) {
  const { renk } = useTema();

  const { hazir } = usePazar();
  const { bosluk } = useEkran();
  const router = useRouter();
  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          { maxWidth: 520, paddingHorizontal: bosluk, paddingVertical: 48, gap: 20, alignItems: 'center' },
        ]}
      >
        {hazir ? (
          <>
            <View
              style={{
                backgroundColor: renk.sari,
                width: 64,
                height: 64,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserRound size={28} color={renk.sabitKoyu} />
            </View>
            <Baslik buyuk style={{ textAlign: 'center' }}>
              {baslik}
            </Baslik>
            <Yazi style={{ color: renk.gri, textAlign: 'center' }}>{aciklama}</Yazi>
            <View style={{ width: '100%', gap: 10, marginTop: 4 }}>
              <Buton onPress={() => router.push({ pathname: '/giris', params: { donus } })}>Giriş yap</Buton>
              <Buton ikincil onPress={() => router.push({ pathname: '/kayit', params: { donus } })}>
                Hesap oluştur
              </Buton>
            </View>
          </>
        ) : (
          <YuklemeIskeleti
            etiket="Hesap bilgileri yükleniyor"
            style={{ width: '100%', alignItems: 'center', gap: 20 }}
          >
            <IskeletParcasi genislik={64} yukseklik={64} yaricap={20} />
            <IskeletParcasi genislik="72%" yukseklik={32} />
            <View style={{ width: '100%', gap: 8, alignItems: 'center' }}>
              <IskeletParcasi genislik="94%" />
              <IskeletParcasi genislik="70%" />
            </View>
            <View style={{ width: '100%', gap: 10, marginTop: 4 }}>
              <IskeletParcasi yukseklik={48} yaricap={10} />
              <IskeletParcasi yukseklik={48} yaricap={10} />
            </View>
          </YuklemeIskeleti>
        )}
      </View>
    </Kabuk>
  );
}
