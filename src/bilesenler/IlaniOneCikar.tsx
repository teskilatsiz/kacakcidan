import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Check from 'lucide-react-native/icons/check';
import Plus from 'lucide-react-native/icons/plus';
import TrendingUp from 'lucide-react-native/icons/trending-up';
import { usePazar } from '../durum/Pazar';
import { ilanYolu, ilanBedeli } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { kalin, temaStilleri, useTema } from '../tasarim/tema';
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { Buton, Pencere, Yazi } from './Temel';

export function IlaniOneCikar() {
  const { renk } = useTema();
  const s = useStiller();
  const { oturum, eklenenler, ilanOneCikar } = usePazar();
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const [secili, setSecili] = useState('');
  const [calisiyor, setCalisiyor] = useState(false);
  const [hata, setHata] = useState('');
  const [tamamlanan, setTamamlanan] = useState('');
  const ilan = eklenenler.find((kayit) => kayit.id === secili);
  const tamamlandi = eklenenler.find((kayit) => kayit.id === tamamlanan);

  async function oneCikar() {
    if (!ilan || !oturum || calisiyor) return;
    setCalisiyor(true);
    setHata('');
    try {
      const sonuc = await ilanOneCikar(ilan.id, oturum.id);
      if (sonuc.basarili) {
        setTamamlanan(ilan.id);
      } else setHata(sonuc.hata || 'İlanın öne çıkarılamadı. Tekrar dene.');
    } catch {
      setHata('İşlem tamamlanamadı. Tekrar dene.');
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <>
      <HareketliBas
        onPress={() => {
          setHata('');
          setTamamlanan('');
          setAcik(true);
        }}
        style={s.kart}
        dataSet={{ 'vitrin-tanitim': 'true' }}
      >
        <View style={s.gorsel}>
          <View style={s.arkaKart} />
          <View style={s.onKart}>
            <TrendingUp size={38} color={renk.vurguYazi} strokeWidth={1.7} />
            <View
              style={{
                height: 5,
                width: 45,
                borderRadius: 3,
                backgroundColor: renk.vurguYazi,
                opacity: 0.18,
              }}
            />
            <View
              style={{ height: 4, width: 28, borderRadius: 3, backgroundColor: renk.vurguYazi, opacity: 0.1 }}
            />
          </View>
          <View style={s.arti}>
            <Plus size={19} color={renk.vurguYazi} />
          </View>
        </View>
        <View style={s.icerik}>
          <Yazi style={s.baslik}>Alıcısı burada olabilir.</Yazi>
          <Yazi style={{ color: renk.gri, fontSize: 12, lineHeight: 19 }}>
            İlanını vitrine taşı, daha çok kişi görsün.
          </Yazi>
          <View style={s.eylem}>
            <Yazi style={{ flex: 1, fontSize: 13, fontWeight: '700' }}>İlanını öne çıkar</Yazi>
            <ArrowUpRight size={19} color={renk.murekkep} />
          </View>
        </View>
      </HareketliBas>
      <Pencere
        acik={acik}
        kapat={() => {
          if (!calisiyor) setAcik(false);
        }}
        baslik={tamamlandi ? 'İlanın vitrinde' : 'İlanını öne çıkar'}
      >
        {tamamlandi ? (
          <View style={{ gap: 18, alignItems: 'center', paddingVertical: 8 }}>
            <View style={s.sonuc}>
              <Check size={30} color={renk.vurguYazi} />
            </View>
            <Yazi style={{ textAlign: 'center' }}>
              {tamamlandi.baslik} artık vitrinde öne çıkan etiketiyle görünüyor.
            </Yazi>
            <Buton
              style={{ alignSelf: 'stretch' }}
              onPress={() => {
                setAcik(false);
                router.push(ilanYolu(tamamlandi));
              }}
            >
              İlanımı gör
            </Buton>
          </View>
        ) : !oturum ? (
          <View style={{ gap: 16 }}>
            <Yazi>Vitrinde göstermek istediğin ilanı seçmek için hesabına giriş yap.</Yazi>
            <Buton
              onPress={() => {
                setAcik(false);
                router.push({ pathname: '/giris', params: { donus: '/profil' } });
              }}
            >
              Giriş yap
            </Buton>
            <Buton
              ikincil
              onPress={() => {
                setAcik(false);
                router.push('/kayit');
              }}
            >
              Hesap oluştur
            </Buton>
          </View>
        ) : eklenenler.length === 0 ? (
          <View style={{ gap: 16 }}>
            <Yazi>Vitrine eklemek için önce bir ilan yayınla.</Yazi>
            <Buton
              onPress={() => {
                setAcik(false);
                router.push('/ilan-ver');
              }}
            >
              İlan ver
            </Buton>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <Yazi style={{ color: renk.gri }}>Vitrinde göstermek istediğin ilanı seç.</Yazi>
            <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
              {eklenenler.map((kayit) => (
                <HareketliBas
                  key={kayit.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: secili === kayit.id }}
                  onPress={() => setSecili(kayit.id)}
                  disabled={calisiyor || kayit.oneCikan}
                  style={[
                    s.ilan,
                    secili === kayit.id && { borderColor: renk.sari, backgroundColor: renk.sariSoluk },
                  ]}
                >
                  <Gorsel
                    source={gorselKaynagi(kayit.gorsel)}
                    style={{ width: 58, height: 58, borderRadius: 7 }}
                    accessibilityLabel={kayit.baslik}
                  />
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Yazi numberOfLines={2} style={{ fontWeight: '600', fontSize: 13 }}>
                      {kayit.baslik}
                    </Yazi>
                    <Yazi style={{ fontSize: 12, color: renk.gri }}>
                      {kayit.oneCikan ? 'Zaten vitrinde' : ilanBedeli(kayit)}
                    </Yazi>
                  </View>
                  {secili === kayit.id && <Check size={18} color={renk.murekkep} />}
                </HareketliBas>
              ))}
            </View>
            {hata ? (
              <Yazi role="alert" style={{ color: renk.hata }}>
                {hata}
              </Yazi>
            ) : null}
            <Buton
              disabled={!ilan || calisiyor || ilan.oneCikan}
              onPress={() => void oneCikar()}
              simge={calisiyor ? <ActivityIndicator color={renk.vurguYazi} /> : undefined}
            >
              {calisiyor ? 'Kaydediliyor…' : 'Vitrine ekle'}
            </Buton>
          </View>
        )}
      </Pencere>
    </>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kart: {
      height: '100%',
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: renk.beyaz,
    },
    gorsel: {
      aspectRatio: 1.32,
      width: '100%',
      backgroundColor: renk.sariSoluk,
      alignItems: 'center',
      justifyContent: 'center',
    },
    arkaKart: {
      position: 'absolute',
      width: 78,
      height: 94,
      borderRadius: 9,
      backgroundColor: renk.sari,
      opacity: 0.4,
      transform: [{ rotate: '-13deg' }, { translateX: -13 }],
    },
    onKart: {
      width: 78,
      height: 94,
      borderRadius: 9,
      backgroundColor: renk.sari,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transform: [{ rotate: '8deg' }],
    },
    arti: {
      position: 'absolute',
      top: '23%',
      right: '24%',
      width: 30,
      height: 30,
      backgroundColor: renk.sari,
      borderWidth: 3,
      borderColor: renk.sariSoluk,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icerik: { padding: 14, gap: 8, flex: 1 },
    baslik: { fontFamily: kalin, fontSize: 15, lineHeight: 21, fontWeight: '700', letterSpacing: -0.3 },
    eylem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      minHeight: 36,
      marginTop: 'auto',
      paddingTop: 10,
    },
    ilan: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      padding: 10,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    sonuc: {
      width: 62,
      height: 62,
      backgroundColor: renk.sari,
      borderRadius: 31,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
