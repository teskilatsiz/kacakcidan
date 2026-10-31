import { Gorsel } from './Gorsel';
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import Home from 'lucide-react-native/icons/house';
import MapPin from 'lucide-react-native/icons/map-pin';
import Menu from 'lucide-react-native/icons/menu';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Plus from 'lucide-react-native/icons/plus';
import UserRound from 'lucide-react-native/icons/user-round';
import LogOut from 'lucide-react-native/icons/log-out';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import { usePazar } from '../durum/Pazar';
import { kategoriler } from '../veri/ilanlar';
import { iller, ilceSecenekleri, konumuAyir, konumuBirlestir, ulkeler } from '../veri/konumlar';
import { font, kalin, mobilAltMenuYuksekligi, ortak, renk, useEkran } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
import { AraKutusu, Buton, Pencere, SimgeButon, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';
import { Paragraf } from './Paragraf';
import { Giris, HareketliBas } from './Hareketli';
import { KlavyeKaydirma } from './KlavyeKaydirma';
import { KategoriSimgesi } from './KategoriSimgesi';

export function Logo({ acik = false }: { acik?: boolean }) {
  return (
    <Link href="/" asChild>
      <HareketliBas
        accessibilityRole="link"
        accessibilityLabel="Kaçakçıdan ana sayfa"
        style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
      >
        <Yazi style={[s.logo, { color: acik ? '#fff' : renk.murekkep }]}>
          Kaçakçı
          <Yazi
            style={[
              s.logo,
              {
                color: acik ? '#fff' : renk.murekkep,
                textDecorationLine: 'underline',
                textDecorationColor: renk.sari,
                textDecorationStyle: 'solid',
              },
            ]}
          >
            dan
          </Yazi>
          <Yazi style={{ color: renk.sari, fontSize: 34, fontWeight: '700' }}>.</Yazi>
        </Yazi>
      </HareketliBas>
    </Link>
  );
}
function NavBaglanti({
  yol,
  children,
  simge,
  secili,
  style,
}: {
  yol: string;
  children: ReactNode;
  simge?: ReactNode;
  secili?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Link href={yol as '/'} asChild>
      <HareketliBas
        style={StyleSheet.flatten([
          ortak.satir,
          { minHeight: 44, gap: 8, paddingHorizontal: 8, borderRadius: 8 },
          style,
        ])}
      >
        {simge}
        <Yazi
          style={{
            fontFamily: secili ? kalin : font,
            fontWeight: secili ? '700' : '500',
            fontSize: 13,
            color: renk.murekkep,
          }}
        >
          {children}
        </Yazi>
      </HareketliBas>
    </Link>
  );
}
export function KonumSecici({ kisa = false }: { kisa?: boolean }) {
  const { mobil } = useEkran();
  const { konum, konumSec } = usePazar();
  const [acik, setAcik] = useState(false);
  const [ulke, setUlke] = useState('TR');
  const [il, setIl] = useState('');
  const [ilce, setIlce] = useState('');
  const secim = konumuAyir(konum);
  const konumEtiketi = secim.il ? `${secim.il}${secim.ilce ? ` · ${secim.ilce}` : ''}` : konum || 'Türkiye';
  return (
    <>
      <HareketliBas
        accessibilityLabel={`Konum: ${konum || 'Türkiye'}. Değiştir`}
        onPress={() => {
          const mevcut = konumuAyir(konum);
          setUlke('TR');
          setIl(mevcut.il);
          setIlce(mevcut.ilce);
          setAcik(true);
        }}
        style={{
          minHeight: 44,
          minWidth: 44,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
        }}
      >
        <MapPin size={17} color={renk.gri} />
        {!kisa && (
          <Yazi numberOfLines={1} style={{ maxWidth: mobil ? 116 : 180, fontSize: 12, color: renk.gri }}>
            {konumEtiketi}
          </Yazi>
        )}
        {!kisa && <ChevronDown size={12} color={renk.gri} />}
      </HareketliBas>
      <Pencere acik={acik} kapat={() => setAcik(false)} baslik="Konum seç">
        <Yazi style={{ color: renk.gri }}>İlanları görmek istediğin ülke, il ve ilçeyi seç.</Yazi>
        <SecimAlani
          etiket="Ülke"
          deger={ulke}
          secenekler={ulkeler}
          ipucu="Ülke seç"
          degistir={(deger) => {
            setUlke(deger);
            setIl('');
            setIlce('');
          }}
        />
        <SecimAlani
          etiket="İl"
          deger={il}
          secenekler={ulke === 'TR' ? iller : []}
          ipucu="İl seç"
          disabled={!ulke}
          degistir={(deger) => {
            setIl(deger);
            setIlce('');
          }}
        />
        <SecimAlani
          etiket="İlçe"
          deger={ilce}
          secenekler={ilceSecenekleri(ulke === 'TR' ? il : '')}
          ipucu={il ? 'Tüm ilçeler' : 'Önce il seç'}
          disabled={ulke !== 'TR' || !il}
          degistir={setIlce}
        />
        <Buton
          onPress={() => {
            konumSec(konumuBirlestir(il, ilce));
            setAcik(false);
          }}
        >
          Konumu uygula
        </Buton>
      </Pencere>
    </>
  );
}
export function UstMenu() {
  const { mobil, dar, bosluk, genislik } = useEkran();
  const { profil, favoriler, tumIlanlar, oturum, cikisYap } = usePazar();
  const router = useRouter();
  const { q } = useGlobalSearchParams<{ q?: string }>();
  const [arama, setArama] = useState('');
  useEffect(() => setArama(typeof q === 'string' ? q : ''), [q]);
  const [menu, setMenu] = useState(false);
  const yol = usePathname();
  const hesapSayfasi = yol === '/giris' || yol === '/kayit';
  const ikiSatir = genislik < 1000;
  const ara = (sorgu = arama) =>
    router.push({ pathname: '/kesfet', params: { q: sorgu.trim(), kategori: '' } });
  const aramaAlani = (
    <View
      style={{
        flex: ikiSatir ? undefined : 1,
        minWidth: 0,
        width: ikiSatir ? '100%' : undefined,
        maxWidth: ikiSatir ? undefined : 580,
        zIndex: 30,
      }}
      dataSet={{ 'ust-arama': 'true' }}
    >
      <AraKutusu deger={arama} degistir={setArama} ara={ara} />
    </View>
  );
  return (
    <>
      <View style={s.ust} dataSet={{ 'ust-menu': 'true' }}>
        <View
          style={[ortak.alan, { paddingHorizontal: bosluk, paddingVertical: ikiSatir ? 10 : 16, gap: 9 }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: mobil ? 8 : 22 }}>
            <Logo />
            {!ikiSatir && !hesapSayfasi && aramaAlani}
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: mobil ? 4 : 14 }}
            >
              <KonumSecici kisa={genislik < 375 || (!mobil && genislik < 1280)} />
              {!mobil && (
                <>
                  <Link href="/favoriler" asChild>
                    <HareketliBas
                      accessibilityLabel={`Favorilerim, ${favoriler.length} ilan`}
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                      }}
                    >
                      <Heart size={21} color={renk.murekkep} />
                      {!dar && <Yazi style={{ fontSize: 12 }}>Favoriler</Yazi>}
                    </HareketliBas>
                  </Link>
                  <Link href="/mesajlar" asChild>
                    <HareketliBas
                      accessibilityLabel="Mesajlarım"
                      style={{
                        minWidth: 44,
                        minHeight: 44,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                      }}
                    >
                      <MessageCircle size={21} color={renk.murekkep} />
                      {!dar && <Yazi style={{ fontSize: 12 }}>Mesajlar</Yazi>}
                    </HareketliBas>
                  </Link>
                  <Link href="/ilan-ver" asChild>
                    <HareketliBas vurgu="dugme" style={s.ilanButon}>
                      <Plus size={18} color={renk.murekkep} />
                      <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 13 }}>İlan ver</Yazi>
                    </HareketliBas>
                  </Link>
                  {!ikiSatir && (
                    <Link href={oturum ? '/profil' : '/giris'} asChild>
                      <HareketliBas
                        accessibilityLabel={oturum ? 'Hesabım' : 'Giriş yap'}
                        style={{
                          minWidth: 44,
                          height: 44,
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          gap: 7,
                        }}
                      >
                        {oturum ? (
                          <View style={s.avatar}>
                            {profil.fotograf ? (
                              <Gorsel
                                source={{ uri: profil.fotograf }}
                                style={{ width: 36, height: 36, borderRadius: 18 }}
                                accessibilityLabel="Profil fotoğrafın"
                              />
                            ) : (
                              <Yazi style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                                {profil.ad.slice(0, 1).toLocaleUpperCase('tr')}
                              </Yazi>
                            )}
                          </View>
                        ) : (
                          <>
                            <UserRound size={20} color={renk.murekkep} />
                            <Yazi style={{ fontSize: 12, fontWeight: '600' }}>Giriş yap</Yazi>
                          </>
                        )}
                      </HareketliBas>
                    </Link>
                  )}
                </>
              )}
              {ikiSatir && (
                <SimgeButon etiket="Menüyü aç" onPress={() => setMenu(true)} style={{ borderWidth: 0 }}>
                  <Menu size={22} color={renk.murekkep} />
                </SimgeButon>
              )}
            </View>
          </View>
          {ikiSatir && !hesapSayfasi && aramaAlani}
        </View>
      </View>
      <Pencere acik={menu} kapat={() => setMenu(false)} baslik="Menü">
        {!oturum ? (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={s.menuAvatar}>
                <UserRound size={20} color={renk.murekkep} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 15 }}>Hesabına giriş yap</Yazi>
                <Yazi style={{ fontSize: 12, color: renk.gri }}>
                  İlanlarını ve mesajlarını bir arada gör.
                </Yazi>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Link href="/giris" asChild>
                <HareketliBas
                  onPress={() => setMenu(false)}
                  style={StyleSheet.flatten([
                    s.hesapBaglantisi,
                    { backgroundColor: renk.sari, borderColor: renk.sari },
                  ])}
                >
                  <UserRound size={17} />
                  <Yazi style={{ fontWeight: '700' }}>Giriş yap</Yazi>
                </HareketliBas>
              </Link>
              <Link href="/kayit" asChild>
                <HareketliBas onPress={() => setMenu(false)} style={s.hesapBaglantisi}>
                  <Yazi style={{ fontWeight: '600' }}>Hesap oluştur</Yazi>
                </HareketliBas>
              </Link>
            </View>
          </View>
        ) : (
          <Link href="/profil" asChild>
            <HareketliBas onPress={() => setMenu(false)} style={s.menuHesap}>
              <View style={s.avatar}>
                {profil.fotograf ? (
                  <Gorsel
                    source={{ uri: profil.fotograf }}
                    style={{ width: 42, height: 42, borderRadius: 21 }}
                    accessibilityLabel="Profil fotoğrafın"
                  />
                ) : (
                  <Yazi style={{ color: '#fff', fontFamily: kalin, fontWeight: '700' }}>
                    {profil.ad.slice(0, 1).toLocaleUpperCase('tr')}
                  </Yazi>
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Yazi numberOfLines={1} style={{ fontFamily: kalin, fontWeight: '700', fontSize: 15 }}>
                  {profil.ad}
                </Yazi>
                <Yazi style={{ color: renk.gri, fontSize: 12 }}>Hesap bilgilerini ve ilanlarını gör.</Yazi>
              </View>
              <ArrowUpRight size={18} color={renk.gri} />
            </HareketliBas>
          </Link>
        )}
        <Link href="/ilan-ver" asChild>
          <HareketliBas
            vurgu="dugme"
            onPress={() => setMenu(false)}
            style={StyleSheet.flatten([s.menuIlanButonu, { width: '100%' }])}
          >
            <Plus size={20} color={renk.murekkep} strokeWidth={2.2} />
            <Yazi style={{ flex: 1, fontFamily: kalin, fontWeight: '700', fontSize: 14 }}>İlan ver</Yazi>
            <ArrowUpRight size={17} color={renk.murekkep} />
          </HareketliBas>
        </Link>
        <View style={s.menuKisayollar}>
          {[
            { href: '/profil', ad: 'Hesabım', simge: UserRound },
            { href: '/favoriler', ad: 'Favoriler', simge: Heart },
            { href: '/mesajlar', ad: 'Mesajlar', simge: MessageCircle },
          ].map(({ href, ad, simge: Simge }) => (
            <Link key={href} href={href as '/'} asChild>
              <HareketliBas onPress={() => setMenu(false)} style={s.menuKisayol}>
                <Simge size={18} color={renk.murekkep} />
                <Yazi style={{ flex: 1, minWidth: 0, fontSize: 13 }}>{ad}</Yazi>
                <ChevronRight size={15} color={renk.gri} />
              </HareketliBas>
            </Link>
          ))}
        </View>
        <View style={s.menuBolumBasligi}>
          <View style={{ gap: 2 }}>
            <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 16 }}>Kategoriler</Yazi>
            <Yazi style={{ color: renk.gri, fontSize: 12 }}>İlgilendiğin ürünü bul.</Yazi>
          </View>
          <Link href="/kesfet" onPress={() => setMenu(false)}>
            <Yazi style={{ fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>
              Tüm ilanlar
            </Yazi>
          </Link>
        </View>
        <View style={s.menuKategoriler}>
          {kategoriler.map((k) => {
            return (
              <Link key={k.id} href={{ pathname: '/kesfet', params: { kategori: k.id } }} asChild>
                <HareketliBas
                  vurgu="kategori"
                  onPress={() => setMenu(false)}
                  style={s.menuKategori}
                  dataSet={{ 'menu-kategori': 'true' }}
                >
                  {({ hovered }) => (
                    <>
                      <View style={[s.menuKategoriIkon, hovered && { backgroundColor: renk.sari }]}>
                        <KategoriSimgesi kategori={k.id} dolu={hovered} boyut={20} />
                      </View>
                      <Yazi numberOfLines={2} style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 17 }}>
                        {k.ad}
                      </Yazi>
                      <Yazi style={{ color: renk.gri, fontSize: 11 }}>
                        {tumIlanlar.filter((i) => i.kategori === k.id).length}
                      </Yazi>
                    </>
                  )}
                </HareketliBas>
              </Link>
            );
          })}
        </View>
        <NavBaglanti yol="/nasil-calisir" simge={<ArrowUpRight size={16} color={renk.gri} />}>
          Nasıl çalışır?
        </NavBaglanti>
        {oturum ? (
          <HareketliBas
            accessibilityLabel="Çıkış yap"
            onPress={() => {
              setMenu(false);
              cikisYap();
              router.replace('/');
            }}
            style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9 }}
          >
            <LogOut size={17} color={renk.gri} />
            <Yazi style={{ color: renk.gri }}>Çıkış yap</Yazi>
          </HareketliBas>
        ) : null}
      </Pencere>
    </>
  );
}
export function AltBilgi() {
  const { bosluk, genislik, mobil } = useEkran();
  const dar = genislik < 1100;
  const { oturum } = usePazar();
  const hesapBaglantilari = [
    { ad: oturum ? 'Profilim' : 'Giriş yap', yol: oturum ? '/profil' : '/giris' },
    { ad: 'Favorilerim', yol: '/favoriler' },
    { ad: 'Mesajlarım', yol: '/mesajlar' },
  ];
  const pazarBaglantilari = [
    { ad: 'Tüm ilanlar', yol: '/kesfet' },
    { ad: 'İlan ver', yol: '/ilan-ver' },
    { ad: 'Nasıl çalışır?', yol: '/nasil-calisir' },
  ];
  const baglanti = (ad: string, yol: string, kategori = false) => (
    <Link key={yol} href={yol as '/'} asChild>
      <HareketliBas style={StyleSheet.flatten([s.altBaglanti, kategori && s.altKategoriBaglanti])}>
        <Yazi style={s.altBaglantiYazi}>{ad}</Yazi>
      </HareketliBas>
    </Link>
  );
  return (
    <View style={s.altBilgi} role="contentinfo" dataSet={{ 'alt-bilgi': 'true' }}>
      <View style={[ortak.alan, s.altIc, { paddingHorizontal: bosluk }]}>
        <View style={[s.altGovde, dar && s.altGovdeDar]}>
          <View style={[s.altMarka, dar && s.altMarkaDar]}>
            <Logo />
            <Paragraf style={s.altAciklama}>Kullanmadıkların el değiştirsin.</Paragraf>
          </View>
          <View style={[s.altKolonlar, dar && s.altKolonlarDar]} role="navigation">
            <View style={[s.altKolon, s.altKategoriKolon, mobil && s.altKategoriKolonMobil]}>
              <Yazi role="heading" aria-level={2} style={s.altKolonBaslik}>
                Kategoriler
              </Yazi>
              <View style={s.altKategoriBaglantilari}>
                {kategoriler.map((kategori) =>
                  baglanti(kategori.ad, `/kesfet?kategori=${kategori.id}`, true),
                )}
              </View>
            </View>
            <View style={[s.altKolon, s.altIkincilKolon, mobil && s.altIkincilKolonMobil]}>
              <Yazi role="heading" aria-level={2} style={s.altKolonBaslik}>
                Hesabım
              </Yazi>
              {hesapBaglantilari.map(({ ad, yol }) => baglanti(ad, yol))}
            </View>
            <View style={[s.altKolon, s.altIkincilKolon, mobil && s.altIkincilKolonMobil]}>
              <Yazi role="heading" aria-level={2} style={s.altKolonBaslik}>
                Alışveriş
              </Yazi>
              {pazarBaglantilari.map(({ ad, yol }) => baglanti(ad, yol))}
            </View>
          </View>
        </View>
        <View style={[s.altAlt, mobil && s.altAltMobil]}>
          <Yazi style={s.altTelif}>© 2026 Kaçakçıdan</Yazi>
          <Yazi style={s.altTelif}>İkinci el alışveriş pazaryeri.</Yazi>
        </View>
      </View>
    </View>
  );
}
export function MobilMenu() {
  const { mobil } = useEkran();
  const klavyeAcik = useKlavyeAcik();
  const insets = useSafeAreaInsets();
  const yol = usePathname();
  if (!mobil || klavyeAcik) return null;
  const baglantilar = [
    { href: '/', ad: 'Ana sayfa', simge: Home },
    { href: '/favoriler', ad: 'Favoriler', simge: Heart },
    { href: '/ilan-ver', ad: 'İlan ver', simge: Plus },
    { href: '/mesajlar', ad: 'Mesajlar', simge: MessageCircle },
    { href: '/profil', ad: 'Hesabım', simge: UserRound },
  ];
  return (
    <View
      style={[s.mobilMenu, { paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom }]}
      dataSet={{ 'mobil-menu': 'true' }}
    >
      {baglantilar.map(({ href, ad, simge: Simge }) => (
        <Link href={href as '/'} asChild key={href}>
          <HareketliBas
            accessibilityLabel={ad}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: mobilAltMenuYuksekligi,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <View
              style={
                href === '/ilan-ver'
                  ? { padding: 6, borderRadius: 12, backgroundColor: renk.sari }
                  : undefined
              }
            >
              <Simge
                size={href === '/ilan-ver' ? 22 : 20}
                color={yol === href || href === '/ilan-ver' ? renk.murekkep : '#85897f'}
                strokeWidth={yol === href ? 2.5 : 1.8}
              />
            </View>
            {href !== '/ilan-ver' && (
              <Yazi
                style={{
                  fontSize: 9,
                  lineHeight: 14,
                  color: yol === href ? renk.murekkep : renk.gri,
                  fontWeight: yol === href ? '700' : '400',
                }}
              >
                {ad}
              </Yazi>
            )}
          </HareketliBas>
        </Link>
      ))}
    </View>
  );
}
export function Kabuk({
  children,
  altBilgi = true,
  altEylem,
  kaydirilabilir = true,
}: {
  children: ReactNode;
  altBilgi?: boolean;
  altEylem?: ReactNode;
  kaydirilabilir?: boolean;
}) {
  const { bildirim } = usePazar();
  const { mobil } = useEkran();
  const yol = usePathname();
  const urunSayfasi = yol.startsWith('/ilan/');
  const klavyeAcik = useKlavyeAcik();
  const insets = useSafeAreaInsets();
  const kaydirma = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    kaydirma.current?.scrollTo({ y: 0, animated: false });
  }, [yol]);
  const icerik = (
    <>
      <UstMenu />
      <View style={{ flex: 1 }} role="main" dataSet={{ 'ana-icerik': 'true' }}>
        {children}
      </View>
      {altBilgi && <AltBilgi />}
      {mobil && !klavyeAcik && (
        <View
          dataSet={{ 'alt-menu-boslugu': 'true' }}
          style={{ height: mobilAltMenuYuksekligi + (Platform.OS === 'web' ? 0 : insets.bottom) }}
        />
      )}
    </>
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        minHeight: '100%',
        paddingBottom: Platform.OS !== 'web' && !mobil ? insets.bottom : 0,
      }}
    >
      {Platform.OS !== 'web' && kaydirilabilir ? (
        <KlavyeKaydirma ref={kaydirma} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          {icerik}
        </KlavyeKaydirma>
      ) : (
        icerik
      )}
      {altEylem}
      <MobilMenu />
      {bildirim ? (
        <View
          dataSet={{ bildirim: 'true', 'urun-bildirimi': String(urunSayfasi) }}
          style={[s.bildirim, { bottom: mobil ? (urunSayfasi ? 150 : 90) : 28 }]}
        >
          <Giris style={s.bildirimIc}>
            <Check size={18} color={renk.sari} />
            <Yazi accessibilityLiveRegion="polite" role="status" style={{ color: '#fff', flexShrink: 1 }}>
              {bildirim}
            </Yazi>
          </Giris>
        </View>
      ) : null}
    </View>
  );
}
const s = StyleSheet.create({
  hesapBaglantisi: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: renk.cizgi,
    borderRadius: 9,
    paddingHorizontal: 10,
  },
  menuAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: renk.sariSoluk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuHesap: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  menuIlanButonu: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: renk.sari,
    borderRadius: 11,
    paddingHorizontal: 16,
  },
  menuKisayollar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuKisayol: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 132,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: renk.cizgi,
    borderRadius: 9,
  },
  menuBolumBasligi: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderColor: renk.cizgi,
    paddingTop: 12,
  },
  menuKategoriler: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuKategori: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 132,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: renk.cizgi,
    borderRadius: 9,
  },
  menuKategoriIkon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: renk.acik,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ust: { backgroundColor: '#fff', zIndex: 10, borderBottomWidth: 1, borderColor: '#edeee9' },
  logo: { fontFamily: kalin, fontWeight: '800', fontSize: 29, lineHeight: 39, letterSpacing: -1.8 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: renk.murekkep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ilanButon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: renk.sari,
    minHeight: 45,
    borderRadius: 9,
    paddingHorizontal: 18,
  },
  altBilgi: { backgroundColor: '#f7f7f5', borderTopWidth: 1, borderColor: renk.cizgi },
  altIc: { paddingTop: 32, paddingBottom: 22, gap: 24 },
  altGovde: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
  altGovdeDar: { flexDirection: 'column', gap: 26 },
  altMarka: { width: 242, flexShrink: 0, gap: 7 },
  altMarkaDar: { width: '100%' },
  altAciklama: { color: '#646464', fontSize: 14, lineHeight: 22, maxWidth: 300 },
  altKolonlar: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: 28,
    rowGap: 24,
  },
  altKolonlarDar: { flex: 0, width: '100%', columnGap: 0 },
  altKolon: { minWidth: 0 },
  altKategoriKolon: { flex: 2, flexBasis: 250 },
  altKategoriKolonMobil: { flex: 0, flexBasis: '100%', width: '100%' },
  altKategoriBaglantilari: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  altBaglanti: { minHeight: 44, justifyContent: 'center', paddingVertical: 8, paddingRight: 12 },
  altBaglantiYazi: { fontSize: 14, lineHeight: 22, color: '#454545', flexShrink: 1 },
  altKategoriBaglanti: { width: '50%', minWidth: 0 },
  altIkincilKolon: { flex: 1, flexBasis: 110 },
  altIkincilKolonMobil: { flex: 0, flexBasis: '50%', width: '50%' },
  altKolonBaslik: {
    fontFamily: kalin,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 22,
    color: renk.murekkep,
    marginBottom: 8,
  },
  altAlt: {
    borderTopWidth: 1,
    borderColor: renk.cizgi,
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  altAltMobil: { flexDirection: 'column', alignItems: 'flex-start', gap: 4 },
  altTelif: { color: '#737373', fontSize: 12, lineHeight: 19 },
  mobilMenu: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: renk.cizgi,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 20,
  },
  bildirim: { position: 'absolute', alignSelf: 'center', width: '92%', maxWidth: 500, zIndex: 100 },
  bildirimIc: {
    backgroundColor: renk.murekkep,
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    boxShadow: '0 8px 30px #0002',
  },
});
