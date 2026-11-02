import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Keyboard, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Bell from 'lucide-react-native/icons/bell';
import Check from 'lucide-react-native/icons/check';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import Heart from 'lucide-react-native/icons/heart';
import Plus from 'lucide-react-native/icons/plus';
import { usePazar } from '../durum/Pazar';
import { kalin, temaStilleri, useEkran, useTema } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
import { gorselKaynagi } from '../veri/gorseller';
import { Gorsel } from './Gorsel';
import { Giris, HareketliBas } from './Hareketli';
import { HesapFormu, HesapGonder } from './HesapFormu';
import { KayitIlerlemesi } from './KayitIlerlemesi';
import { Alan, Baslik, Yazi } from './Temel';

export function guvenliDonusYolu(deger?: string | string[]) {
  const yol = Array.isArray(deger) ? deger[0] : deger;
  if (!yol || !yol.startsWith('/') || yol.startsWith('//') || /[\\\u0000-\u001f]/.test(yol)) return '/profil';
  const sayfa = yol.split(/[?#]/)[0];
  return sayfa === '/giris' || sayfa === '/kayit' ? '/profil' : yol;
}

function KayitAdimlari({ adim }: { adim: 1 | 2 }) {
  const { renk } = useTema();
  const s = useStiller();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Hesap oluşturma adımları"
      accessibilityValue={{ min: 1, max: 2, now: adim, text: `${adim} / 2` }}
      style={{ gap: 12 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 22 }}>
        {['Hesap bilgileri', 'Şifre'].map((etiket, sira) => (
          <View key={etiket} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <View style={[s.adimNumarasi, { backgroundColor: adim >= sira + 1 ? renk.sari : renk.zemin }]}>
              {sira === 0 && adim === 2 ? (
                <Check size={13} color={renk.vurguYazi} />
              ) : (
                <Yazi
                  style={{
                    fontSize: 11,
                    lineHeight: 18,
                    fontWeight: '700',
                    color: adim >= sira + 1 ? renk.vurguYazi : renk.gri,
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
        <KayitIlerlemesi adim={adim} />
      </View>
    </View>
  );
}

function UyelikTanitim({ modal, kayit }: { modal: boolean; kayit: boolean }) {
  const { renk } = useTema();
  const s = useStiller();
  return (
    <View style={[s.tanitim, modal && { flex: 0.83, minHeight: 420 }]}>
      <Gorsel
        source={gorselKaynagi('/gorseller/uyelik.webp')}
        priority="normal"
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#111315a8' }]} />
      <View style={{ flex: 1, justifyContent: 'space-between', padding: modal ? 24 : 38, gap: 34 }}>
        <Yazi
          style={{
            color: renk.sabitBeyaz,
            fontFamily: kalin,
            fontWeight: '700',
            fontSize: modal ? 23 : 29,
            lineHeight: modal ? 32 : 40,
            letterSpacing: -1.3,
          }}
        >
          Kaçakçıdan
          <Yazi
            style={{
              color: renk.sari,
              fontFamily: kalin,
              fontWeight: '700',
              fontSize: modal ? 30 : 36,
              lineHeight: modal ? 32 : 40,
            }}
          >
            .
          </Yazi>
        </Yazi>
        <View style={{ gap: modal ? 22 : 32 }}>
          <Yazi
            style={{
              fontFamily: kalin,
              fontWeight: '700',
              fontSize: modal ? 27 : 36,
              lineHeight: modal ? 34 : 44,
              letterSpacing: -1.1,
              color: renk.sabitBeyaz,
            }}
          >
            {kayit ? 'Aradığını bul.\nFazlasını sat.' : 'Birinin fazlası,\nsenin aradığın.'}
          </Yazi>
          <View style={{ gap: modal ? 16 : 22 }}>
            {[
              { Simge: Plus, baslik: 'İlanlarını yönet', aciklama: 'İlan ver, düzenle, alıcılara ulaş.' },
              { Simge: Heart, baslik: 'Beğendiklerini kaydet', aciklama: 'Favori ilanlarına kolayca dön.' },
              {
                Simge: Bell,
                baslik: 'Gelişmelerden haberdar ol',
                aciklama: 'Mesajlarını ve yanıtları takip et.',
              },
            ].map(({ Simge, baslik, aciklama }) => (
              <View key={baslik} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                <Simge size={modal ? 20 : 23} color={renk.sari} strokeWidth={1.7} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <Yazi
                    style={{
                      color: renk.sabitBeyaz,
                      fontWeight: '600',
                      fontSize: modal ? 13 : 14,
                      lineHeight: 20,
                    }}
                  >
                    {baslik}
                  </Yazi>
                  {!modal && (
                    <Yazi style={{ color: '#d4d4d4', fontSize: 12, lineHeight: 19 }}>{aciklama}</Yazi>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export type HesapIcerigiProps = {
  kayit?: boolean;
  modal?: boolean;
  turDegistir?: (kayit: boolean) => void;
  tamamlandi?: () => void;
  donus?: string;
};

/** Sayfa ve üyelik penceresi aynı formu ve doğrulama akışını kullanır. */
export function HesapIcerigi({
  kayit = false,
  modal = false,
  turDegistir,
  tamamlandi,
  donus,
}: HesapIcerigiProps) {
  const { renk, koyu } = useTema();
  const s = useStiller();
  const { mobil, genislik } = useEkran();
  const { hazir, oturum, girisYap, kayitOl } = usePazar();
  const router = useRouter();
  const klavyeAcik = useKlavyeAcik();
  const kimlik = useId();
  const hedef = guvenliDonusYolu(donus);
  const panelGorunur = !modal && !mobil && genislik >= 900;
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
  const tamamlandiRef = useRef(tamamlandi);
  tamamlandiRef.current = tamamlandi;
  const adAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const epostaAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const sifreAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const odaklanacak = useRef<'ad' | 'eposta' | 'sifre' | null>(null);

  useLayoutEffect(() => {
    const odak = odaklanacak.current;
    if (!odak) return;
    odaklanacak.current = null;
    const alan = { ad: adAlani, eposta: epostaAlani, sifre: sifreAlani }[odak];
    // iOS webde bir sonraki girdiye geçiş aynı kullanıcı etkileşimi içinde kalır.
    if (Platform.OS === 'web') alan.current?.focus();
    else {
      const kare = requestAnimationFrame(() => alan.current?.focus());
      return () => cancelAnimationFrame(kare);
    }
  }, [adim, hatalar]);
  useEffect(() => {
    setAdim(1);
    setHatalar({});
    setHata('');
    setSifre('');
    setSifreGorunur(false);
  }, [kayit]);
  useEffect(() => {
    ekranda.current = true;
    return () => {
      ekranda.current = false;
    };
  }, []);
  useEffect(() => {
    if (!hazir || !oturum || yonlendirildi.current) return;
    yonlendirildi.current = true;
    Keyboard.dismiss();
    tamamlandiRef.current?.();
    if (!modal) router.replace(hedef as '/');
  }, [hazir, oturum, hedef, modal, router]);

  const duzelt = (alan: string) => {
    setHatalar((onceki) => ({ ...onceki, [alan]: '' }));
    setHata('');
  };
  const turuDegistir = (yeniKayit: boolean) => {
    if (calisiyor || kayit === yeniKayit) return;
    if (turDegistir) turDegistir(yeniKayit);
    else router.replace({ pathname: yeniKayit ? '/kayit' : '/giris', params: { donus: hedef } });
  };
  async function gonder() {
    if (!hazir || suruyor.current) return;
    const yeniHatalar: Record<string, string> = {};
    if (kayit && ad.trim().length < 2) yeniHatalar.ad = 'Adını en az iki karakterle yaz.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim()))
      yeniHatalar.eposta = 'Geçerli bir e-posta adresi yaz.';
    if (!kayit || adim === 2) {
      if (!sifre) yeniHatalar.sifre = 'Şifreni yaz.';
      else if (kayit && sifre.length < 8) yeniHatalar.sifre = 'Şifren en az 8 karakter olmalı.';
    }
    setHatalar(yeniHatalar);
    setHata('');
    if (Object.keys(yeniHatalar).length) {
      const ilkHata = Object.keys(yeniHatalar)[0] as 'ad' | 'eposta' | 'sifre';
      if (kayit && ilkHata !== 'sifre') setAdim(1);
      odaklanacak.current = ilkHata;
      return;
    }
    if (kayit && adim === 1) {
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
        tamamlandiRef.current?.();
        if (!modal) router.replace(hedef as '/');
      }
    } catch {
      if (ekranda.current) setHata('İşlem tamamlanamadı. Tekrar dene.');
    } finally {
      suruyor.current = false;
      if (ekranda.current) setCalisiyor(false);
    }
  }

  return (
    <Giris style={[s.kart, modal && s.modalKart, { flexDirection: panelGorunur ? 'row' : 'column' }]}>
      {panelGorunur && <UyelikTanitim modal={modal} kayit={kayit} />}
      <View
        style={[
          s.formPaneli,
          {
            padding: modal ? 0 : mobil ? 20 : genislik < 1100 ? 32 : 48,
            gap: mobil ? (klavyeAcik ? 16 : 20) : 24,
          },
        ]}
      >
        <View accessibilityRole="tablist" accessibilityLabel="Üyelik işlemi" style={s.sekmeler}>
          {[
            { kayit: false, ad: 'Giriş yap' },
            { kayit: true, ad: 'Hesap oluştur' },
          ].map((sekme) => (
            <HareketliBas
              key={sekme.ad}
              accessibilityRole="tab"
              accessibilityState={{ selected: kayit === sekme.kayit, disabled: calisiyor }}
              disabled={calisiyor}
              onPress={() => turuDegistir(sekme.kayit)}
              style={[s.sekme, kayit === sekme.kayit && { backgroundColor: renk.murekkep }]}
            >
              <Yazi
                style={{
                  fontWeight: '600',
                  fontSize: 13,
                  color: kayit === sekme.kayit ? renk.tersYazi : renk.gri,
                }}
              >
                {sekme.ad}
              </Yazi>
            </HareketliBas>
          ))}
        </View>
        <View style={{ gap: kayit ? 16 : 7 }}>
          {kayit && <KayitAdimlari adim={adim} />}
          <View style={{ gap: 6 }}>
            <Baslik
              buyuk
              style={{ fontSize: mobil || modal ? 25 : 29, lineHeight: mobil || modal ? 33 : 38 }}
            >
              {kayit ? (adim === 2 ? 'Şifreni belirle' : 'Hesap oluştur') : 'Hesabına giriş yap'}
            </Baslik>
            {(!mobil || !klavyeAcik) && (
              <Yazi style={{ color: renk.gri, fontSize: 13, lineHeight: 21 }}>
                {kayit
                  ? adim === 2
                    ? 'Hesabın için en az 8 karakterli bir şifre seç.'
                    : 'İlan vermeye ve favorilerini kaydetmeye başla.'
                  : 'İlanlarını, favorilerini ve mesajlarını yönet.'}
              </Yazi>
            )}
          </View>
        </View>
        <HesapFormu
          kimlik={kimlik}
          gonder={() => void gonder()}
          kayit={kayit}
          eposta={kayit && adim === 2 ? eposta.trim() : undefined}
        >
          <Giris key={`${kayit}-${adim}`} style={{ gap: 16 }}>
            {kayit && adim === 2 ? (
              <View style={s.hesapOzeti}>
                <Yazi numberOfLines={1} style={{ flex: 1, minWidth: 0, color: renk.gri, fontSize: 13 }}>
                  {eposta}
                </Yazi>
                <HareketliBas
                  accessibilityLabel="Hesap bilgilerini değiştir"
                  onPress={() => {
                    odaklanacak.current = 'eposta';
                    setAdim(1);
                    setHata('');
                  }}
                  disabled={calisiyor}
                  style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <ArrowLeft size={14} color={renk.murekkep} />
                  <Yazi style={{ fontSize: 12, fontWeight: '600' }}>Değiştir</Yazi>
                </HareketliBas>
              </View>
            ) : null}
            {kayit && adim === 1 ? (
              <Alan
                ref={adAlani}
                style={{ backgroundColor: koyu ? '#202020' : '#fafafa' }}
                nativeID={`hesap-ad-${kimlik}`}
                etiket="Adın soyadın"
                placeholder="Adın ve soyadın"
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
            {!kayit || adim === 1 ? (
              <Alan
                ref={epostaAlani}
                style={{ backgroundColor: koyu ? '#202020' : '#fafafa' }}
                nativeID={`hesap-eposta-${kimlik}`}
                etiket="E-posta adresin"
                placeholder="ornek@eposta.com"
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
                onKeyPress={
                  Platform.OS === 'web' && !kayit
                    ? (olay) => {
                        if (olay.nativeEvent.key === 'Enter') {
                          olay.preventDefault();
                          sifreAlani.current?.focus();
                        }
                      }
                    : undefined
                }
                onSubmitEditing={
                  Platform.OS === 'web'
                    ? undefined
                    : () => (kayit ? void gonder() : sifreAlani.current?.focus())
                }
              />
            ) : null}
            {!kayit || adim === 2 ? (
              <View style={{ gap: 8 }}>
                <View style={{ position: 'relative' }}>
                  <Alan
                    ref={sifreAlani}
                    nativeID={`hesap-sifre-${kimlik}`}
                    etiket="Şifren"
                    placeholder={kayit ? 'En az 8 karakter' : 'Şifreni yaz'}
                    aria-invalid={!!hatalar.sifre}
                    aria-describedby={hatalar.sifre ? `hesap-sifre-hata-${kimlik}` : undefined}
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
                    style={{ paddingRight: 54, backgroundColor: koyu ? '#202020' : '#fafafa' }}
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
            {kayit ? (adim === 1 ? 'Devam et' : 'Hesap oluştur') : 'Giriş yap'}
          </HesapGonder>
          {!hazir && <ActivityIndicator accessibilityLabel="Hesap bilgileri yükleniyor" color={renk.gri} />}
        </HesapFormu>
        {!mobil && (
          <View style={s.gecis}>
            <Yazi style={{ color: renk.gri, fontSize: 12 }}>
              {kayit ? 'Zaten hesabın var mı?' : 'Henüz hesabın yok mu?'}
            </Yazi>
            <HareketliBas
              onPress={() => turuDegistir(!kayit)}
              disabled={calisiyor}
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <Yazi style={{ fontWeight: '700', fontSize: 12, textDecorationLine: 'underline' }}>
                {kayit ? 'Giriş yap' : 'Hesap oluştur'}
              </Yazi>
            </HareketliBas>
          </View>
        )}
      </View>
    </Giris>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kart: {
      width: '100%',
      overflow: 'hidden',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: renk.cizgi,
      backgroundColor: renk.beyaz,
    },
    modalKart: { borderWidth: 0, borderRadius: 12 },
    tanitim: { flex: 1, minWidth: 0, minHeight: 550, overflow: 'hidden', backgroundColor: renk.sabitKoyu },
    formPaneli: { flex: 1, minWidth: 0, justifyContent: 'center' },
    sekmeler: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: renk.zemin,
      padding: 4,
      borderRadius: 28,
    },
    sekme: {
      flex: 1,
      minWidth: 0,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
    },
    adimNumarasi: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    hesapOzeti: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: renk.zemin,
    },
    goster: {
      position: 'absolute',
      right: 3,
      top: 32,
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
      paddingTop: 3,
      flexDirection: 'row',
      gap: 6,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
