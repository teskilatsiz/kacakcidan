import { useEffect, useLayoutEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Keyboard, Platform, StyleSheet, TextInput, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import Check from 'lucide-react-native/icons/check';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Kabuk } from '../bilesenler/Kabuk';
import { Alan, Baslik, Yazi } from '../bilesenler/Temel';
import { Giris, HareketliBas, useAzaltilmisHareket } from '../bilesenler/Hareketli';
import { HesapFormu, HesapGonder } from '../bilesenler/HesapFormu';
import { usePazar } from '../durum/Pazar';
import { kalin, ortak, temaStilleri, useEkran, useTema } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';

function AdimIlerlemesi({ adim, kayit }: { adim: 1 | 2; kayit: boolean }) {
  const { renk } = useTema();
  const s = useStiller();
  const azHareket = useAzaltilmisHareket();
  const ilerleme = useSharedValue(adim / 2);
  useEffect(() => {
    cancelAnimation(ilerleme);
    ilerleme.value = azHareket
      ? adim / 2
      : withTiming(adim / 2, { duration: 220, reduceMotion: ReduceMotion.System });
    return () => cancelAnimation(ilerleme);
  }, [adim, azHareket, ilerleme]);
  const hareket = useAnimatedStyle(() => ({ transform: [{ scaleX: ilerleme.value }] }));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={kayit ? 'Hesap oluşturma adımları' : 'Giriş adımları'}
      accessibilityValue={{ min: 1, max: 2, now: adim, text: `${adim} / 2` }}
      style={{ gap: 10 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        {[kayit ? 'Bilgilerin' : 'E-posta', 'Şifren'].map((etiket, sira) => (
          <View key={etiket} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <View style={[s.adimNumarasi, { backgroundColor: adim >= sira + 1 ? renk.sari : renk.zemin }]}>
              {sira === 0 && adim === 2 ? (
                <Check size={12} color={renk.vurguYazi} />
              ) : (
                <Yazi
                  style={{
                    fontSize: 11,
                    lineHeight: 18,
                    color: adim >= sira + 1 ? renk.vurguYazi : renk.gri,
                    fontWeight: '700',
                  }}
                >
                  {sira + 1}
                </Yazi>
              )}
            </View>
            <Yazi style={{ fontSize: 12, color: adim === sira + 1 ? renk.murekkep : renk.gri }}>
              {etiket}
            </Yazi>
          </View>
        ))}
      </View>
      <View style={{ height: 3, backgroundColor: renk.cizgi, overflow: 'hidden', borderRadius: 3 }}>
        <Animated.View
          style={[
            { height: 3, width: '100%', backgroundColor: renk.sari, transformOrigin: 'left center' },
            hareket,
          ]}
        />
      </View>
    </View>
  );
}

function donusYolu(deger: string | string[] | undefined) {
  const yol = Array.isArray(deger) ? deger[0] : deger;
  if (!yol || !yol.startsWith('/') || yol.startsWith('//') || /[\\\u0000-\u001f]/.test(yol)) return '/profil';
  const sayfa = yol.split(/[?#]/)[0];
  return sayfa === '/giris' || sayfa === '/kayit' ? '/profil' : yol;
}

export default function Hesap({ kayit = false }: { kayit?: boolean }) {
  const { renk } = useTema();
  const s = useStiller();
  const { mobil, bosluk } = useEkran();
  const { hazir, oturum, girisYap, kayitOl } = usePazar();
  const { donus } = useLocalSearchParams<{ donus?: string | string[] }>();
  const router = useRouter();
  const kimlik = kayit ? 'kayit' : 'giris';
  const klavyeAcik = useKlavyeAcik();
  const hedef = donusYolu(donus);
  const [ad, setAd] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGorunur, setSifreGorunur] = useState(false);
  const [adim, setAdim] = useState<1 | 2>(1);
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [hata, setHata] = useState('');
  const [calisiyor, setCalisiyor] = useState(false);
  const suruyor = useRef(false);
  const yonlendirildi = useRef(false);
  const ekranda = useRef(true);
  const adAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const epostaAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const sifreAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const odaklanacak = useRef<'ad' | 'eposta' | 'sifre' | null>(null);

  useLayoutEffect(() => {
    const odak = odaklanacak.current;
    if (!odak) return;
    odaklanacak.current = null;
    const alan = { ad: adAlani, eposta: epostaAlani, sifre: sifreAlani }[odak];
    // Webde odak aynı kullanıcı etkileşiminde taşınır; iOS klavyesi gecikmiş focus ile açılmaz.
    if (Platform.OS === 'web') alan.current?.focus();
    else {
      const kare = requestAnimationFrame(() => alan.current?.focus());
      return () => cancelAnimationFrame(kare);
    }
  }, [adim, hatalar]);

  useEffect(() => {
    ekranda.current = true;
    return () => {
      ekranda.current = false;
    };
  }, []);
  useEffect(() => {
    if (hazir && oturum && !yonlendirildi.current) {
      yonlendirildi.current = true;
      router.replace(hedef as '/');
    }
  }, [hazir, oturum, hedef, router]);

  const duzelt = (alan: string) => {
    setHatalar((onceki) => ({ ...onceki, [alan]: '' }));
    setHata('');
  };
  async function gonder() {
    if (!hazir || suruyor.current) return;
    const yeniHatalar: Record<string, string> = {};
    if (kayit && ad.trim().length < 2) yeniHatalar.ad = 'Adını en az iki karakterle yaz.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim()))
      yeniHatalar.eposta = 'Geçerli bir e-posta adresi yaz.';
    if (adim === 2) {
      if (!sifre) yeniHatalar.sifre = 'Şifreni yaz.';
      else if (kayit && sifre.length < 8) yeniHatalar.sifre = 'Şifren en az 8 karakter olmalı.';
    }
    setHatalar(yeniHatalar);
    setHata('');
    if (Object.keys(yeniHatalar).length) {
      const ilkHata = Object.keys(yeniHatalar)[0];
      if (ilkHata !== 'sifre') setAdim(1);
      odaklanacak.current = ilkHata as 'ad' | 'eposta' | 'sifre';
      return;
    }
    if (adim === 1) {
      odaklanacak.current = 'sifre';
      setAdim(2);
      return;
    }
    suruyor.current = true;
    setCalisiyor(true);
    try {
      const sonuc = kayit
        ? await kayitOl({ ad: ad.trim(), eposta: eposta.trim(), sifre })
        : await girisYap({ eposta: eposta.trim(), sifre });
      if (!ekranda.current) return;
      if (!sonuc.basarili) setHata(sonuc.hata || 'İşlem tamamlanamadı. Tekrar dene.');
      else if (!yonlendirildi.current) {
        yonlendirildi.current = true;
        Keyboard.dismiss();
        setSifre('');
        router.replace(hedef as '/');
      }
    } catch {
      if (ekranda.current) setHata('İşlem tamamlanamadı. Tekrar dene.');
    } finally {
      suruyor.current = false;
      if (ekranda.current) setCalisiyor(false);
    }
  }

  return (
    <Kabuk altBilgi={false}>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 480,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? (klavyeAcik ? 8 : 16) : 28,
            paddingBottom: mobil ? 20 : 40,
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
                marginBottom: 8,
              }}
            >
              <ArrowLeft size={16} color={renk.gri} />
              <Yazi style={{ color: renk.gri, fontSize: 13 }}>İlanlara dön</Yazi>
            </HareketliBas>
          </Link>
        )}
        <Giris style={[s.kart, { padding: mobil ? 18 : 28, gap: klavyeAcik ? 14 : 20 }]}>
          <AdimIlerlemesi adim={adim} kayit={kayit} />
          <View style={{ gap: 6 }}>
            {adim === 2 ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <Yazi numberOfLines={1} style={{ flex: 1, minWidth: 0, fontSize: 13, color: renk.gri }}>
                  {eposta}
                </Yazi>
                <HareketliBas
                  onPress={() => {
                    odaklanacak.current = 'eposta';
                    setAdim(1);
                    setHata('');
                  }}
                  disabled={calisiyor}
                  accessibilityLabel="Hesap bilgilerini değiştir"
                  style={{ minHeight: 44, flexDirection: 'row', gap: 5, alignItems: 'center', flexShrink: 0 }}
                >
                  <ArrowLeft size={14} color={renk.gri} />
                  <Yazi style={{ fontSize: 12, color: renk.gri }}>Değiştir</Yazi>
                </HareketliBas>
              </View>
            ) : null}
            <Baslik buyuk style={{ fontSize: mobil ? 26 : 30, lineHeight: mobil ? 34 : 38 }}>
              {adim === 2
                ? kayit
                  ? 'Şifreni belirle'
                  : 'Şifreni yaz'
                : kayit
                  ? 'Hesap oluştur'
                  : 'Giriş yap'}
            </Baslik>
            {adim === 1 ? (
              <Yazi style={{ color: renk.gri, fontSize: 14 }}>
                {kayit ? 'Adını ve e-posta adresini yaz.' : 'Kayıt olduğun e-posta adresiyle devam et.'}
              </Yazi>
            ) : null}
          </View>
          <HesapFormu
            gonder={() => void gonder()}
            kayit={kayit}
            eposta={adim === 2 ? eposta.trim() : undefined}
          >
            <Giris key={`${kimlik}-${adim}`} style={{ gap: 16 }}>
              {kayit && adim === 1 ? (
                <Alan
                  ref={adAlani}
                  nativeID={`hesap-ad-${kimlik}`}
                  etiket="Adın"
                  autoComplete="name"
                  autoCapitalize="words"
                  value={ad}
                  onChangeText={(deger) => {
                    setAd(deger);
                    duzelt('ad');
                  }}
                  maxLength={60}
                  editable={!calisiyor}
                  hata={hatalar.ad}
                  returnKeyType="next"
                  submitBehavior="submit"
                  blurOnSubmit={Platform.OS === 'web' ? false : undefined}
                  onKeyPress={
                    Platform.OS === 'web'
                      ? (olay) => {
                          if (olay.nativeEvent.key === 'Enter') {
                            olay.preventDefault();
                            epostaAlani.current?.focus();
                          }
                        }
                      : undefined
                  }
                  onSubmitEditing={Platform.OS === 'web' ? undefined : () => epostaAlani.current?.focus()}
                />
              ) : null}
              {adim === 1 ? (
                <Alan
                  ref={epostaAlani}
                  nativeID={`hesap-eposta-${kimlik}`}
                  etiket="E-posta adresin"
                  keyboardType="email-address"
                  inputMode="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  value={eposta}
                  onChangeText={(deger) => {
                    setEposta(deger);
                    duzelt('eposta');
                  }}
                  maxLength={254}
                  editable={!calisiyor}
                  hata={hatalar.eposta}
                  returnKeyType="next"
                  submitBehavior="submit"
                  blurOnSubmit={Platform.OS === 'web' ? false : undefined}
                  onSubmitEditing={Platform.OS === 'web' ? undefined : () => void gonder()}
                />
              ) : null}
              {adim === 2 ? (
                <View style={{ gap: 8 }}>
                  <View style={{ position: 'relative' }}>
                    <Alan
                      ref={sifreAlani}
                      nativeID={`hesap-sifre-${kimlik}`}
                      etiket="Şifren"
                      aria-invalid={!!hatalar.sifre}
                      aria-describedby={
                        hatalar.sifre
                          ? `hesap-sifre-hata-${kimlik}`
                          : kayit
                            ? `hesap-sifre-ipucu-${kimlik}`
                            : undefined
                      }
                      secureTextEntry={!sifreGorunur}
                      autoComplete={kayit ? 'new-password' : 'current-password'}
                      autoCapitalize="none"
                      autoCorrect={false}
                      spellCheck={false}
                      value={sifre}
                      onChangeText={(deger) => {
                        setSifre(deger);
                        duzelt('sifre');
                      }}
                      maxLength={128}
                      editable={!calisiyor}
                      style={{ paddingRight: 54 }}
                      returnKeyType="done"
                      submitBehavior="submit"
                      blurOnSubmit={Platform.OS === 'web' ? false : undefined}
                      onSubmitEditing={Platform.OS === 'web' ? undefined : () => void gonder()}
                    />
                    <HareketliBas
                      accessibilityLabel={sifreGorunur ? 'Şifreyi gizle' : 'Şifreyi göster'}
                      onPointerDown={Platform.OS === 'web' ? (olay) => olay.preventDefault() : undefined}
                      accessibilityState={{ selected: sifreGorunur }}
                      onPress={() => setSifreGorunur(!sifreGorunur)}
                      style={s.goster}
                    >
                      {sifreGorunur ? (
                        <EyeOff size={19} color={renk.gri} />
                      ) : (
                        <Eye size={19} color={renk.gri} />
                      )}
                    </HareketliBas>
                  </View>
                  {hatalar.sifre ? (
                    <Yazi nativeID={`hesap-sifre-hata-${kimlik}`} accessibilityRole="alert" style={s.hata}>
                      {hatalar.sifre}
                    </Yazi>
                  ) : kayit ? (
                    <Yazi nativeID={`hesap-sifre-ipucu-${kimlik}`} style={{ color: renk.gri, fontSize: 12 }}>
                      En az 8 karakter kullan.
                    </Yazi>
                  ) : null}
                </View>
              ) : null}
            </Giris>
            {hata ? (
              <Yazi accessibilityRole="alert" style={s.hata}>
                {hata}
              </Yazi>
            ) : null}
            <HesapGonder gonder={() => void gonder()} disabled={!hazir || calisiyor} calisiyor={calisiyor}>
              {adim === 1 ? 'Devam et' : kayit ? 'Hesap oluştur' : 'Giriş yap'}
            </HesapGonder>
            {!hazir ? (
              <ActivityIndicator accessibilityLabel="Hesap bilgileri yükleniyor" color={renk.gri} />
            ) : null}
          </HesapFormu>
          <View style={s.gecis}>
            <Yazi style={{ color: renk.gri, fontSize: 13 }}>
              {kayit ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}
            </Yazi>
            <Link href={{ pathname: kayit ? '/giris' : '/kayit', params: { donus: hedef } }} asChild>
              <HareketliBas style={{ minHeight: 44, justifyContent: 'center' }}>
                <Yazi
                  style={{
                    fontFamily: kalin,
                    fontWeight: '700',
                    fontSize: 13,
                    textDecorationLine: 'underline',
                  }}
                >
                  {kayit ? 'Giriş yap' : 'Hesap oluştur'}
                </Yazi>
              </HareketliBas>
            </Link>
          </View>
        </Giris>
      </View>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kart: { borderRadius: 14, borderWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.beyaz },
    adimNumarasi: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    goster: {
      position: 'absolute',
      right: 3,
      top: 33,
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    hata: { color: renk.hata, fontSize: 12, lineHeight: 19 },
    gecis: {
      borderTopWidth: 1,
      borderTopColor: renk.cizgi,
      paddingTop: 6,
      flexDirection: 'row',
      gap: 7,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
