import { StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import LogOut from 'lucide-react-native/icons/log-out';
import Mail from 'lucide-react-native/icons/mail';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapGerekli } from '../bilesenler/HesapGerekli';
import { HareketliBas } from '../bilesenler/Hareketli';
import { ProfilFormu } from '../bilesenler/ProfilFormu';
import { Alan, Baslik, Buton, Yazi } from '../bilesenler/Temel';
import { usePazar } from '../durum/Pazar';
import { ortak, renk, useEkran } from '../tasarim/tema';

export default function HesapAyarlari() {
  const { hazir, oturum, cikisYap } = usePazar();
  const { mobil, dar, bosluk } = useEkran();
  const router = useRouter();

  if (!hazir || !oturum)
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
        <View style={{ flexDirection: dar ? 'column' : 'row', alignItems: 'flex-start', gap: 24 }}>
          <View style={[s.bolum, dar ? { width: '100%' } : { flex: 1, minWidth: 0 }]}>
            <View style={{ gap: 5 }}>
              <Baslik style={s.bolumBasligi}>Profil bilgileri</Baslik>
              <Yazi style={s.aciklama}>Adını, fotoğrafını ve konumunu güncelle.</Yazi>
            </View>
            <ProfilFormu key={oturum.id} />
          </View>
          <View style={[s.bolum, dar ? { width: '100%' } : { width: 320, flexShrink: 0 }]}>
            <View style={[ortak.satir, { gap: 10 }]}>
              <Mail size={19} color={renk.murekkep} />
              <Baslik style={s.bolumBasligi}>Hesap bilgileri</Baslik>
            </View>
            <View style={{ gap: 10 }}>
              <Alan
                nativeID="hesap-ayarlari-eposta"
                etiket="E-posta adresi"
                value={oturum.eposta}
                readOnly
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ backgroundColor: renk.acik, fontSize: 14 }}
              />
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
                style={{ borderColor: renk.murekkep, marginTop: 4 }}
              >
                Çıkış yap
              </Buton>
            </View>
          </View>
        </View>
      </View>
    </Kabuk>
  );
}

const s = StyleSheet.create({
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
});
