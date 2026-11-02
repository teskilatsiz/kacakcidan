import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import MapPin from 'lucide-react-native/icons/map-pin';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, BosDurum, Buton, Yazi } from '../bilesenler/Temel';
import { SaticiIletisimi } from '../bilesenler/SaticiIletisimi';
import { SaticiPuani, SaticiResmi } from '../bilesenler/SaticiBilgisi';
import { SaticiKontrolleri } from '../bilesenler/SaticiKontrolleri';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { usePazar } from '../durum/Pazar';
import { ortak, useEkran, useTema } from '../tasarim/tema';

export default function Satici() {
  const { id, hesap } = useLocalSearchParams<{ id: string; hesap?: string }>();
  const { saticilar, tumIlanlar, oturum } = usePazar();
  const { mobil, bosluk } = useEkran();
  const { renk } = useTema();
  const router = useRouter();
  const satici = saticilar.find((kayit) => kayit.id === (hesap || id));
  if (!satici)
    return (
      <Kabuk>
        <BosDurum
          baslik="Profil bulunamadı"
          aciklama="Bu profile şu anda ulaşılamıyor. Diğer ilanlara göz atabilirsin."
          eylem={<Buton onPress={() => router.replace('/kesfet')}>İlanları keşfet</Buton>}
        />
      </Kabuk>
    );
  const ilanlar = tumIlanlar.filter((ilan) => ilan.saticiId === satici.id);
  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          { maxWidth: 1280, paddingHorizontal: bosluk, paddingVertical: mobil ? 18 : 28, gap: 24 },
        ]}
      >
        <Buton
          ikincil
          simge={<ArrowLeft size={16} />}
          style={{ alignSelf: 'flex-start', minHeight: 40 }}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/kesfet'))}
        >
          Geri
        </Buton>
        <View
          dataSet={{ 'satici-profil-bilgileri': 'true' }}
          style={{
            padding: mobil ? 20 : 28,
            borderWidth: 1,
            borderColor: renk.cizgi,
            borderRadius: 14,
            backgroundColor: renk.beyaz,
            flexDirection: mobil ? 'column' : 'row',
            gap: mobil ? 22 : 32,
          }}
        >
          <View style={{ flex: mobil ? undefined : 1, minWidth: 0, gap: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: mobil ? 14 : 20 }}>
              <SaticiResmi satici={satici} boyut={mobil ? 66 : 86} />
              <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
                <Baslik style={{ fontSize: mobil ? 23 : 29, lineHeight: mobil ? 30 : 38 }}>
                  {satici.ad}
                </Baslik>
                <SaticiPuani satici={satici} />
                {!!satici.konum && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5 }}>
                    <MapPin size={14} color={renk.gri} style={{ marginTop: 3, flexShrink: 0 }} />
                    <Yazi style={{ fontSize: 13, color: renk.gri, flex: 1 }}>{satici.konum}</Yazi>
                  </View>
                )}
              </View>
            </View>
            {!!satici.hakkinda && (
              <Yazi style={{ fontSize: 14, lineHeight: 24, maxWidth: 800 }}>{satici.hakkinda}</Yazi>
            )}
            {!!satici.telefon && (
              <View style={{ maxWidth: 320 }}>
                <SaticiIletisimi telefon={satici.telefon} gorunur />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <Yazi style={{ fontSize: 13, fontWeight: '600' }}>{ilanlar.length} ilan yayında</Yazi>
              {!!satici.uyelikYili && (
                <Yazi style={{ fontSize: 13, color: renk.gri }}>{satici.uyelikYili} yılından beri üye</Yazi>
              )}
              {oturum?.id === satici.id && (
                <Buton
                  ikincil
                  style={{ minHeight: 48, paddingHorizontal: 12 }}
                  onPress={() => router.push('/profil')}
                >
                  Hesabıma git
                </Buton>
              )}
            </View>
          </View>
          <View style={{ width: mobil ? '100%' : 280, minWidth: 0, flexShrink: 0 }}>
            <SaticiKontrolleri />
          </View>
        </View>
        <Baslik style={{ fontSize: mobil ? 21 : 25 }}>İlanları</Baslik>
        {ilanlar.length ? (
          <IlanIzgarasi ilanlar={ilanlar} />
        ) : (
          <BosDurum
            baslik="Şu anda yayında ilanı yok"
            aciklama="Satıcının yeni ilanları yayınlandığında burada görünecek."
          />
        )}
      </View>
    </Kabuk>
  );
}
