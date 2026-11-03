import { useId, useState } from 'react';
import { Platform, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import MapPin from 'lucide-react-native/icons/map-pin';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, BosDurum, Buton, Yazi } from '../bilesenler/Temel';
import { SaticiIletisimi } from '../bilesenler/SaticiIletisimi';
import { SaticiPuani, SaticiResmi } from '../bilesenler/SaticiBilgisi';
import { SaticiKontrolleri } from '../bilesenler/SaticiKontrolleri';
import { SaticiDegerlendirmeleri } from '../bilesenler/SaticiDegerlendirmeleri';
import { Giris, HareketliBas } from '../bilesenler/Hareketli';
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
          { maxWidth: 1280, paddingHorizontal: bosluk, paddingVertical: mobil ? 16 : 24, gap: 20 },
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
            padding: mobil ? 16 : 20,
            borderWidth: 1,
            borderColor: renk.cizgi,
            borderRadius: 10,
            backgroundColor: renk.beyaz,
            flexDirection: mobil ? 'column' : 'row',
            gap: mobil ? 12 : 28,
          }}
        >
          <View style={{ flex: mobil ? undefined : 1, minWidth: 0, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <SaticiResmi satici={satici} boyut={mobil ? 54 : 64} />
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Baslik style={{ fontSize: mobil ? 21 : 25, lineHeight: mobil ? 28 : 33 }}>
                  {satici.ad}
                </Baslik>
                <SaticiPuani satici={satici} />
                {!!satici.konum && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5 }}>
                    <MapPin size={14} color={renk.gri} style={{ marginTop: 3, flexShrink: 0 }} />
                    <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri, flex: 1 }}>
                      {satici.konum}
                    </Yazi>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 14,
                rowGap: 6,
                flexWrap: 'wrap',
              }}
            >
              <Yazi style={{ fontSize: 12, lineHeight: 19, fontWeight: '600' }}>
                {ilanlar.length} ilan yayında
              </Yazi>
              {!!satici.uyelikYili && (
                <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
                  {satici.uyelikYili} yılından beri üye
                </Yazi>
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
            {!!satici.hakkinda && <SaticiHakkinda hakkinda={satici.hakkinda} />}
          </View>
          <View style={{ width: mobil ? '100%' : 280, minWidth: 0, flexShrink: 0, gap: 10 }}>
            {!!satici.telefon && <SaticiIletisimi telefon={satici.telefon} gorunur />}
            <SaticiKontrolleri />
          </View>
        </View>
        <SaticiDegerlendirmeleri key={satici.id} saticiId={satici.id} />
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

function SaticiHakkinda({ hakkinda }: { hakkinda: string }) {
  const { renk } = useTema();
  const [acik, setAcik] = useState(false);
  const kimlik = useId();
  const Simge = acik ? ChevronUp : ChevronDown;
  return (
    <View style={{ minWidth: 0, borderTopWidth: 1, borderColor: renk.cizgi }}>
      <HareketliBas
        accessibilityRole="button"
        accessibilityState={{ expanded: acik }}
        aria-controls={Platform.OS === 'web' ? kimlik : undefined}
        onPress={() => setAcik((deger) => !deger)}
        style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
        <Yazi style={{ flex: 1, fontSize: 13, lineHeight: 20, fontWeight: '600' }}>Satıcı hakkında</Yazi>
        <Simge size={15} color={renk.gri} style={{ flexShrink: 0 }} />
      </HareketliBas>
      <View nativeID={kimlik}>
        {acik && (
          <Giris style={{ paddingBottom: 8 }}>
            <Yazi selectable style={{ fontSize: 13, lineHeight: 21 }}>
              {hakkinda}
            </Yazi>
          </Giris>
        )}
      </View>
    </View>
  );
}
