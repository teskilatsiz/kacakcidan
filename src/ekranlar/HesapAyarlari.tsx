import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import LogOut from 'lucide-react-native/icons/log-out';
import Mail from 'lucide-react-native/icons/mail';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapGerekli } from '../bilesenler/HesapGerekli';
import { HesapAyarSekmeleri, type AyarBolumu } from '../bilesenler/HesapAyarSekmeleri';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';
import { HareketliBas } from '../bilesenler/Hareketli';
import { ProfilFormu } from '../bilesenler/ProfilFormu';
import { TemaSecici } from '../bilesenler/TemaSecici';
import { Baslik, Buton, Yazi } from '../bilesenler/Temel';
import { usePazar } from '../durum/Pazar';
import { ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';

export default function HesapAyarlari() {
  const { renk } = useTema();
  const s = useStiller();

  const { hazir, oturum, cikisYap } = usePazar();
  const { mobil, dar, bosluk } = useEkran();
  const router = useRouter();
  const [bolum, setBolum] = useState<AyarBolumu>('profil');

  if (!hazir)
    return (
      <Kabuk altBilgi={false}>
        <View style={[ortak.alan, { maxWidth: 1200, paddingHorizontal: bosluk, paddingVertical: 28 }]}>
          <YuklemeIskeleti etiket="Hesap ayarların yükleniyor" style={{ gap: 24 }}>
            <IskeletParcasi genislik={240} yukseklik={36} />
            <View style={{ flexDirection: dar ? 'column' : 'row', gap: 28 }}>
              <View style={{ width: dar ? '100%' : 224, gap: 10 }}>
                <IskeletParcasi yukseklik={48} />
                {!dar && (
                  <>
                    <IskeletParcasi yukseklik={48} />
                    <IskeletParcasi yukseklik={48} />
                  </>
                )}
              </View>
              <View style={{ flex: 1, gap: 24, padding: 20 }}>
                <IskeletParcasi genislik="45%" yukseklik={26} />
                <View style={{ flexDirection: 'row', gap: 14 }}>
                  <IskeletParcasi genislik={64} yukseklik={64} yaricap={32} />
                  <View style={{ flex: 1, gap: 12 }}>
                    <IskeletParcasi genislik="45%" yukseklik={32} />
                    <IskeletParcasi genislik="70%" />
                  </View>
                </View>
                <IskeletParcasi yukseklik={54} />
                <IskeletParcasi yukseklik={54} />
                <IskeletParcasi yukseklik={100} />
              </View>
            </View>
          </YuklemeIskeleti>
        </View>
      </Kabuk>
    );
  if (!oturum)
    return (
      <HesapGerekli
        baslik="Hesap ayarları için giriş yap"
        aciklama="Profil bilgilerini görmek ve güncellemek için hesabına giriş yap."
        donus="/ayarlar"
      />
    );

  return (
    <Kabuk altBilgi={false}>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 1200,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 12 : 24,
            paddingBottom: mobil ? 28 : 48,
            gap: mobil ? 18 : 24,
          },
        ]}
      >
        <View style={{ gap: 8 }}>
          <Link href="/profil" asChild>
            <HareketliBas style={s.geri}>
              <ArrowLeft size={18} color={renk.murekkep} />
              <Yazi style={{ fontSize: 13, fontWeight: '600' }}>Hesabım</Yazi>
            </HareketliBas>
          </Link>
          <Baslik buyuk>Hesap ayarları</Baslik>
        </View>
        <View
          style={{ flexDirection: dar ? 'column' : 'row', alignItems: 'flex-start', gap: mobil ? 18 : 28 }}
        >
          <HesapAyarSekmeleri secili={bolum} degistir={setBolum} />
          <View style={dar ? { width: '100%' } : { flex: 1, minWidth: 0 }}>
            <View
              nativeID="ayar-panel-profil"
              role="tabpanel"
              aria-labelledby="ayar-sekme-profil"
              accessibilityElementsHidden={bolum !== 'profil'}
              importantForAccessibility={bolum === 'profil' ? 'auto' : 'no-hide-descendants'}
              style={[s.bolum, { padding: mobil ? 18 : 28, display: bolum === 'profil' ? 'flex' : 'none' }]}
            >
              <View style={{ gap: 5 }}>
                <Baslik style={s.bolumBasligi}>Profil bilgileri</Baslik>
                <Yazi style={s.aciklama}>
                  Fotoğrafın, adın ve hakkında yazdıkların diğer kullanıcılara görünür.
                </Yazi>
              </View>
              <ProfilFormu key={oturum.id} />
            </View>
            <View
              nativeID="ayar-panel-hesap"
              role="tabpanel"
              aria-labelledby="ayar-sekme-hesap"
              accessibilityElementsHidden={bolum !== 'hesap'}
              importantForAccessibility={bolum === 'hesap' ? 'auto' : 'no-hide-descendants'}
              style={[s.bolum, { padding: mobil ? 18 : 28, display: bolum === 'hesap' ? 'flex' : 'none' }]}
            >
              <View style={[ortak.satir, { gap: 10 }]}>
                <Mail size={19} color={renk.murekkep} />
                <Baslik style={s.bolumBasligi}>Hesap bilgileri</Baslik>
              </View>
              <View style={{ gap: 10 }}>
                <Yazi style={{ fontSize: 12, fontWeight: '600', color: renk.gri }}>Giriş e-postan</Yazi>
                <Yazi selectable style={{ fontSize: 15, lineHeight: 24, fontWeight: '600', flexShrink: 1 }}>
                  {oturum.eposta}
                </Yazi>
                <Yazi style={s.aciklama}>
                  Giriş yaparken kullandığın e-posta adresi. Profilinde gösterilmez.
                </Yazi>
              </View>
              <View style={s.oturum}>
                <Yazi style={{ fontWeight: '600', fontSize: 14 }}>Oturum</Yazi>
                <Yazi style={s.aciklama}>Bu cihazdaki oturumunu kapat.</Yazi>
                <Buton
                  ikincil
                  simge={<LogOut size={17} color={renk.murekkep} />}
                  onPress={() => {
                    cikisYap();
                    router.replace('/');
                  }}
                  style={{ borderColor: renk.cizgi, marginTop: 4, alignSelf: 'flex-start', minWidth: 150 }}
                >
                  Çıkış yap
                </Buton>
              </View>
            </View>
            <View
              nativeID="ayar-panel-gorunum"
              role="tabpanel"
              aria-labelledby="ayar-sekme-gorunum"
              accessibilityElementsHidden={bolum !== 'gorunum'}
              importantForAccessibility={bolum === 'gorunum' ? 'auto' : 'no-hide-descendants'}
              style={[s.bolum, { padding: mobil ? 18 : 28, display: bolum === 'gorunum' ? 'flex' : 'none' }]}
            >
              <View style={{ gap: 5 }}>
                <Baslik style={s.bolumBasligi}>Görünüm tercihi</Baslik>
                <Yazi style={s.aciklama}>
                  Açık, koyu veya cihazının görünümünü seç. Tercihin otomatik kaydedilir.
                </Yazi>
              </View>
              <TemaSecici />
            </View>
          </View>
        </View>
      </View>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    geri: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
    bolum: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 14,
      backgroundColor: renk.beyaz,
      padding: 20,
      gap: 22,
    },
    bolumBasligi: { fontSize: 19, lineHeight: 27, letterSpacing: -0.5 },
    aciklama: { fontSize: 13, lineHeight: 20, color: renk.gri },
    oturum: { gap: 8, borderTopWidth: 1, borderTopColor: renk.cizgi, paddingTop: 20 },
  }),
);
