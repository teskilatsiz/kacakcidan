import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Heart from 'lucide-react-native/icons/heart';
import Search from 'lucide-react-native/icons/search';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapGerekli } from '../bilesenler/HesapGerekli';
import { Baslik, BosDurum, Buton, Yazi } from '../bilesenler/Temel';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { usePazar } from '../durum/Pazar';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';

export default function Favoriler() {
  const { renk } = useTema();

  const { favoriler, tumIlanlar, hazir, oturum } = usePazar();
  const { bosluk, mobil, genislik } = useEkran();
  const router = useRouter();
  const kaydedilenler = tumIlanlar.filter((ilan) => favoriler.includes(ilan.id));

  if (!hazir) {
    const sutun = mobil ? 2 : genislik < 1000 ? 3 : genislik < 1250 ? 4 : 5;
    return (
      <Kabuk>
        <YuklemeIskeleti
          etiket="Favori ilanların yükleniyor"
          style={[
            ortak.alan,
            { paddingHorizontal: bosluk, paddingTop: mobil ? 20 : 28, paddingBottom: 32, gap: 24 },
          ]}
        >
          <View style={{ gap: 8 }}>
            <IskeletParcasi genislik={180} yukseklik={36} />
            <IskeletParcasi genislik={110} yukseklik={18} />
          </View>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', gap: mobil ? 12 : 20 }}
            dataSet={{ 'ilan-izgarasi': 'normal' }}
          >
            {Array.from({ length: sutun * 2 }, (_, sira) => (
              <View
                key={sira}
                dataSet={{ 'ilan-hucresi': 'true' }}
                style={{
                  width: `${100 / sutun - (mobil ? 2 : sutun === 5 ? 1.3 : 1.6)}%`,
                  borderWidth: 1,
                  borderColor: renk.cizgi,
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <IskeletParcasi yukseklik="auto" yaricap={0} style={{ aspectRatio: 1.32 }} />
                <View style={{ padding: 14, gap: 9 }}>
                  <IskeletParcasi genislik="44%" yukseklik={14} />
                  <IskeletParcasi yukseklik={18} />
                  <IskeletParcasi genislik="70%" yukseklik={18} />
                  <IskeletParcasi genislik="60%" yukseklik={24} />
                  <IskeletParcasi genislik="72%" yukseklik={14} />
                </View>
              </View>
            ))}
          </View>
        </YuklemeIskeleti>
      </Kabuk>
    );
  }
  if (!oturum)
    return (
      <HesapGerekli
        baslik="Favorilerin için giriş yap"
        aciklama="Kaydettiğin ilanları görmek ve favorilerini takip etmek için hesabına giriş yap."
        donus="/favoriler"
      />
    );

  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          { paddingHorizontal: bosluk, paddingTop: mobil ? 20 : 28, paddingBottom: 32, gap: 24 },
        ]}
      >
        <View style={[ortak.aralikli, { flexWrap: 'wrap', gap: 12 }]}>
          <View style={{ gap: 4, flex: 1, minWidth: 160 }}>
            <Baslik buyuk style={{ fontSize: mobil ? 28 : 32, lineHeight: 40, letterSpacing: -0.8 }}>
              Favorilerim
            </Baslik>
            <Yazi accessibilityLiveRegion="polite" style={{ color: renk.gri, fontSize: 13, lineHeight: 20 }}>
              {kaydedilenler.length} kayıtlı ilan
            </Yazi>
          </View>
          <Buton
            ikincil
            onPress={() => router.push('/kesfet')}
            simge={<Search size={16} />}
            style={{ minHeight: 44, paddingHorizontal: 15 }}
          >
            İlanlara göz at
          </Buton>
        </View>

        {kaydedilenler.length > 0 ? (
          <IlanIzgarasi ilanlar={kaydedilenler} />
        ) : (
          <BosDurum
            simge={<Heart size={30} />}
            baslik="Henüz favorin yok"
            aciklama="Tekrar bakmak istediğin ilanları kalp düğmesiyle kaydet. Kaydettiğin ilanları burada bulabilirsin."
            eylem={
              <Buton onPress={() => router.push('/kesfet')} simge={<Search size={17} />}>
                İlanları keşfet
              </Buton>
            }
          />
        )}
      </View>
    </Kabuk>
  );
}
