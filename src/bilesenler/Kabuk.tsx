import { Gorsel } from './Gorsel';
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { DeviceEventEmitter, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import Home from 'lucide-react-native/icons/house';
import MapPin from 'lucide-react-native/icons/map-pin';
import Menu from 'lucide-react-native/icons/menu';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Bell from 'lucide-react-native/icons/bell';
import Plus from 'lucide-react-native/icons/plus';
import UserRound from 'lucide-react-native/icons/user-round';
import LogOut from 'lucide-react-native/icons/log-out';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Settings from 'lucide-react-native/icons/settings-2';
import CircleHelp from 'lucide-react-native/icons/circle-question-mark';
import Palette from 'lucide-react-native/icons/palette';
import { usePazar } from '../durum/Pazar';
import { kategoriler } from '../veri/ilanlar';
import { iller, ilceSecenekleri, konumuAyir, konumuBirlestir, ulkeler } from '../veri/konumlar';
import { kalin, mobilAltMenuYuksekligi, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
import { AraKutusu, Buton, Pencere, SimgeButon, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';
import { Paragraf } from './Paragraf';
import { Giris, HareketliBas } from './Hareketli';
import { KlavyeKaydirma } from './KlavyeKaydirma';
import { KategoriSimgesi } from './KategoriSimgesi';
import { TemaSecici } from './TemaSecici';
import { HesapMenusu } from './HesapMenusu';
import { CikisOnayi } from './CikisOnayi';
import { AnlikBildirim } from './AnlikBildirim';
import { SAYFA_BASINA_DON, sayfaBasinaDon } from '../tasarim/sayfaOdagi';

export function Logo({ acik = false, kucuk = false }: { acik?: boolean; kucuk?: boolean }) {
  const { renk } = useTema();
  const s = useStiller();

  return (
    <Link href="/" asChild>
      <HareketliBas
        accessibilityRole="link"
        accessibilityLabel="Kaçakçıdan ana sayfa"
        style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
      >
        <Yazi
          dataSet={{ 'logo-yazisi': 'true' }}
          style={[
            s.logo,
            kucuk && { fontSize: 25, lineHeight: 35 },
            { color: acik ? renk.sabitBeyaz : renk.murekkep },
          ]}
        >
          Kaçakçı
          <Yazi
            dataSet={{ 'logo-yazisi': 'true' }}
            style={[
              s.logo,
              kucuk && { fontSize: 25, lineHeight: 35 },
              {
                color: acik ? renk.sabitBeyaz : renk.murekkep,
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
export function KonumSecici({ kisa = false, satir = false }: { kisa?: boolean; satir?: boolean }) {
  const { renk } = useTema();
  const s = useStiller();

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
        style={
          satir
            ? s.menuTercihSatiri
            : {
                minHeight: 44,
                minWidth: 44,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }
        }
      >
        <MapPin size={satir ? 20 : 17} color={satir ? renk.murekkep : renk.gri} />
        {satir ? (
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <Yazi style={s.menuSatirBasligi}>Konum</Yazi>
            <Yazi numberOfLines={1} style={{ fontSize: 12, color: renk.gri }}>
              {konumEtiketi}
            </Yazi>
          </View>
        ) : (
          !kisa && (
            <Yazi
              dataSet={{ 'konum-metni': 'true' }}
              numberOfLines={1}
              style={{ maxWidth: mobil ? 116 : 180, fontSize: 12, color: renk.gri }}
            >
              {konumEtiketi}
            </Yazi>
          )
        )}
        {satir ? (
          <ChevronRight size={17} color={renk.gri} />
        ) : (
          !kisa && <ChevronDown size={12} color={renk.gri} />
        )}
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
  const { renk } = useTema();
  const s = useStiller();

  const { mobil, bosluk, genislik } = useEkran();
  const { profil, favoriler, oturum, okunmamisBildirimSayisi } = usePazar();
  const router = useRouter();
  const { q } = useGlobalSearchParams<{ q?: string }>();
  const [arama, setArama] = useState('');
  useEffect(() => setArama(typeof q === 'string' ? q : ''), [q]);
  const [menu, setMenu] = useState(false);
  const [cikisOnayi, setCikisOnayi] = useState(false);
  const yol = usePathname();
  const hesapSayfasi = yol === '/giris' || yol === '/kayit';
  const anaSayfa = yol === '/';
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
      <AraKutusu deger={arama} degistir={setArama} ara={ara} sade={mobil && anaSayfa} />
    </View>
  );
  return (
    <>
      <View style={s.ust} dataSet={{ 'ust-menu': 'true', anasayfa: String(anaSayfa) }}>
        <View
          style={[ortak.alan, { paddingHorizontal: bosluk, paddingVertical: ikiSatir ? 10 : 16, gap: 9 }]}
        >
          <View
            dataSet={{ 'ust-satir': 'true' }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: mobil ? 8 : 22 }}
          >
            <Logo kucuk={mobil && anaSayfa} />
            {!hesapSayfasi && (Platform.OS === 'web' || !ikiSatir) && aramaAlani}
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', gap: mobil ? 4 : 14 }}
            >
              {(Platform.OS === 'web' || !mobil) && (
                <View dataSet={{ 'ust-masaustu': 'true' }}>
                  <KonumSecici kisa={Platform.OS !== 'web' && genislik < 1280} />
                </View>
              )}
              {(Platform.OS === 'web' || !mobil) && (
                <Link href="/favoriler" asChild>
                  <HareketliBas
                    accessibilityLabel={`Favorilerim, ${favoriler.length} ilan`}
                    dataSet={{ 'ust-masaustu': 'true' }}
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
                  </HareketliBas>
                </Link>
              )}
              <Link href="/bildirimler" asChild>
                <HareketliBas
                  accessibilityLabel={`Bildirimler${okunmamisBildirimSayisi ? `, ${okunmamisBildirimSayisi} okunmamış` : ''}`}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 7,
                  }}
                >
                  <View>
                    <Bell size={21} color={renk.murekkep} />
                    {okunmamisBildirimSayisi > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          right: -7,
                          top: -7,
                          minWidth: 16,
                          height: 16,
                          borderRadius: 8,
                          backgroundColor: renk.sari,
                          paddingHorizontal: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Yazi
                          style={{ color: renk.vurguYazi, fontSize: 9, lineHeight: 13, fontWeight: '700' }}
                        >
                          {okunmamisBildirimSayisi > 9 ? '9+' : okunmamisBildirimSayisi}
                        </Yazi>
                      </View>
                    )}
                  </View>
                </HareketliBas>
              </Link>
              {(Platform.OS === 'web' || !mobil) && (
                <Link href="/mesajlar" asChild>
                  <HareketliBas
                    accessibilityLabel="Mesajlarım"
                    dataSet={{ 'ust-masaustu': 'true' }}
                    style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <MessageCircle size={21} color={renk.murekkep} />
                  </HareketliBas>
                </Link>
              )}
              {(Platform.OS === 'web' || !mobil) && (
                <View
                  dataSet={{ 'ust-masaustu': 'true' }}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}
                >
                  {(Platform.OS === 'web' || !ikiSatir) && (
                    <View dataSet={{ 'ust-hesap': 'true' }}>
                      <HesapMenusu />
                    </View>
                  )}
                  <Link href="/ilan-ver" asChild>
                    <HareketliBas vurgu="dugme" style={s.ilanButon}>
                      <Plus size={18} color={renk.vurguYazi} />
                      <Yazi
                        style={{ fontFamily: kalin, fontWeight: '700', fontSize: 13, color: renk.vurguYazi }}
                      >
                        İlan ver
                      </Yazi>
                    </HareketliBas>
                  </Link>
                </View>
              )}
              {(Platform.OS === 'web' || ikiSatir) && (
                <View dataSet={{ 'ust-hamburger': 'true' }}>
                  <SimgeButon etiket="Menüyü aç" onPress={() => setMenu(true)} style={{ borderWidth: 0 }}>
                    <Menu size={22} color={renk.murekkep} />
                  </SimgeButon>
                </View>
              )}
            </View>
          </View>
          {Platform.OS !== 'web' && ikiSatir && !hesapSayfasi && aramaAlani}
        </View>
      </View>
      <Pencere acik={menu} kapat={() => setMenu(false)} baslik="Menü">
        {!oturum ? (
          <View style={s.menuHesapKarti}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[s.menuAvatar, { backgroundColor: renk.sari }]}>
                <UserRound size={20} color={renk.vurguYazi} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 16 }}>Hesabım</Yazi>
                <Yazi style={{ fontSize: 12, color: renk.gri }}>
                  İlanların, favorilerin ve mesajların burada.
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
                  <UserRound size={17} color={renk.vurguYazi} />
                  <Yazi style={{ fontWeight: '700', color: renk.vurguYazi }}>Giriş yap</Yazi>
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
            <HareketliBas
              onPress={() => setMenu(false)}
              style={StyleSheet.flatten([s.menuHesapKarti, s.menuHesap])}
            >
              <View style={s.menuAvatar}>
                {profil.fotograf ? (
                  <Gorsel
                    source={{ uri: profil.fotograf }}
                    style={{ width: 46, height: 46, borderRadius: 14 }}
                    accessibilityLabel="Profil fotoğrafın"
                  />
                ) : (
                  <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 18 }}>
                    {profil.ad.slice(0, 1).toLocaleUpperCase('tr')}
                  </Yazi>
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Yazi numberOfLines={1} style={{ fontFamily: kalin, fontWeight: '700', fontSize: 15 }}>
                  {profil.ad}
                </Yazi>
                <Yazi style={{ color: renk.gri, fontSize: 12 }}>Profilimi ve ilanlarımı gör</Yazi>
              </View>
              <ArrowUpRight size={18} color={renk.gri} />
            </HareketliBas>
          </Link>
        )}
        <View style={s.menuKisayollar}>
          {[
            { href: '/favoriler', ad: 'Favoriler', simge: Heart },
            { href: '/mesajlar', ad: 'Mesajlar', simge: MessageCircle },
            { href: '/bildirimler', ad: 'Bildirimler', simge: Bell },
            { href: '/ayarlar', ad: 'Hesap ayarları', simge: Settings },
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
        <View style={s.menuTercihler}>
          <KonumSecici satir />
          <View style={[s.menuTercihSatiri, s.menuSatirAyirici]}>
            <Palette size={20} color={renk.murekkep} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <TemaSecici kompakt />
            </View>
          </View>
          <Link href="/nasil-calisir" asChild>
            <HareketliBas
              onPress={() => setMenu(false)}
              style={StyleSheet.flatten([s.menuTercihSatiri, s.menuSatirAyirici])}
            >
              <CircleHelp size={20} color={renk.murekkep} />
              <Yazi style={[s.menuSatirBasligi, { flex: 1 }]}>Nasıl çalışır?</Yazi>
              <ChevronRight size={17} color={renk.gri} />
            </HareketliBas>
          </Link>
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
                      <Yazi
                        dataSet={{ 'kategori-yazisi': 'true' }}
                        numberOfLines={2}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 12,
                          lineHeight: 17,
                          color: hovered ? renk.vurguYazi : renk.murekkep,
                        }}
                      >
                        {k.ad}
                      </Yazi>
                    </>
                  )}
                </HareketliBas>
              </Link>
            );
          })}
        </View>
        {oturum ? (
          <HareketliBas
            accessibilityLabel="Çıkış yap"
            onPress={() => {
              setMenu(false);
              setCikisOnayi(true);
            }}
            style={s.menuTercihSatiri}
          >
            <LogOut size={17} color={renk.gri} />
            <Yazi style={{ color: renk.gri }}>Çıkış yap</Yazi>
          </HareketliBas>
        ) : null}
      </Pencere>
      <CikisOnayi acik={cikisOnayi} kapat={() => setCikisOnayi(false)} />
    </>
  );
}
export function AltBilgi() {
  const s = useStiller();

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
        <View dataSet={{ 'footer-govde': 'true' }} style={[s.altGovde, dar && s.altGovdeDar]}>
          <View dataSet={{ 'footer-marka': 'true' }} style={[s.altMarka, dar && s.altMarkaDar]}>
            <Logo />
            <Paragraf style={s.altAciklama}>Kullanmadıkların el değiştirsin.</Paragraf>
          </View>
          <View
            dataSet={{ 'footer-kolonlar': 'true' }}
            style={[s.altKolonlar, dar && s.altKolonlarDar]}
            role="navigation"
          >
            <View
              dataSet={{ 'footer-kategoriler': 'true' }}
              style={[s.altKolon, s.altKategoriKolon, mobil && s.altKategoriKolonMobil]}
            >
              <Yazi role="heading" aria-level={2} style={s.altKolonBaslik}>
                Kategoriler
              </Yazi>
              <View style={s.altKategoriBaglantilari}>
                {kategoriler.map((kategori) =>
                  baglanti(kategori.ad, `/kesfet?kategori=${kategori.id}`, true),
                )}
              </View>
            </View>
            <View
              dataSet={{ 'footer-ikincil': 'true' }}
              style={[s.altKolon, s.altIkincilKolon, mobil && s.altIkincilKolonMobil]}
            >
              <Yazi role="heading" aria-level={2} style={s.altKolonBaslik}>
                Hesabım
              </Yazi>
              {hesapBaglantilari.map(({ ad, yol }) => baglanti(ad, yol))}
            </View>
            <View
              dataSet={{ 'footer-ikincil': 'true' }}
              style={[s.altKolon, s.altIkincilKolon, mobil && s.altIkincilKolonMobil]}
            >
              <Yazi role="heading" aria-level={2} style={s.altKolonBaslik}>
                Alışveriş
              </Yazi>
              {pazarBaglantilari.map(({ ad, yol }) => baglanti(ad, yol))}
            </View>
          </View>
        </View>
        <View dataSet={{ 'footer-telif': 'true' }} style={[s.altAlt, mobil && s.altAltMobil]}>
          <Yazi style={s.altTelif}>© 2026 Kaçakçıdan</Yazi>
          <Yazi style={s.altTelif}>İkinci el online ilan ve alışveriş sitesi.</Yazi>
        </View>
      </View>
    </View>
  );
}
export function MobilMenu() {
  const { renk } = useTema();
  const s = useStiller();

  const { mobil } = useEkran();
  const klavyeAcik = useKlavyeAcik();
  const insets = useSafeAreaInsets();
  const yol = usePathname();
  if ((Platform.OS !== 'web' && !mobil) || klavyeAcik) return null;
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
            onPress={sayfaBasinaDon}
            accessibilityState={Platform.OS === 'web' ? undefined : { selected: yol === href }}
            aria-current={Platform.OS === 'web' && yol === href ? 'page' : undefined}
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
                color={href === '/ilan-ver' ? renk.vurguYazi : yol === href ? renk.murekkep : renk.gri}
                strokeWidth={yol === href ? 2.5 : 1.8}
              />
            </View>
            {href !== '/ilan-ver' && (
              <Yazi
                style={{
                  fontSize: 10,
                  lineHeight: 16,
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
  const { renk } = useTema();
  const s = useStiller();

  const { bildirim } = usePazar();
  const { mobil } = useEkran();
  const yol = usePathname();
  const { kayit, hesap } = useGlobalSearchParams<{ kayit?: string; hesap?: string }>();
  const sayfa =
    yol === '/ilan/yerel' ? `${yol}:${kayit ?? ''}` : yol === '/satici/yerel' ? `${yol}:${hesap ?? ''}` : yol;
  const urunSayfasi = yol.startsWith('/ilan/');
  const klavyeAcik = useKlavyeAcik();
  const insets = useSafeAreaInsets();
  const kaydirma = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    kaydirma.current?.scrollTo({ y: 0, animated: false });
  }, [sayfa]);
  useEffect(() => {
    const abonelik = DeviceEventEmitter.addListener(SAYFA_BASINA_DON, () =>
      kaydirma.current?.scrollTo({ y: 0, animated: false }),
    );
    return () => abonelik.remove();
  }, []);
  const icerik = (
    <>
      <UstMenu />
      <View style={{ flex: 1 }} role="main" dataSet={{ 'ana-icerik': 'true' }}>
        {children}
      </View>
      {altBilgi && <AltBilgi />}
      {(Platform.OS === 'web' || mobil) && !klavyeAcik && (
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
        backgroundColor: renk.beyaz,
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
          <AnlikBildirim mesaj={bildirim} />
        </View>
      ) : null}
    </View>
  );
}
const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
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
      backgroundColor: renk.acik,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuHesapKarti: {
      padding: 14,
      gap: 14,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 12,
    },
    menuHesap: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuTercihler: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 12,
      paddingHorizontal: 14,
    },
    menuTercihSatiri: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 8,
    },
    menuSatirAyirici: { borderTopWidth: 1, borderColor: renk.cizgi },
    menuSatirBasligi: { fontSize: 13, fontWeight: '600' },
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
    ust: { backgroundColor: renk.beyaz, zIndex: 10, borderBottomWidth: 1, borderColor: renk.cizgi },
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
    altBilgi: { backgroundColor: renk.acik, borderTopWidth: 1, borderColor: renk.cizgi },
    altIc: { paddingTop: 32, paddingBottom: 22, gap: 24 },
    altGovde: { flexDirection: 'row', alignItems: 'flex-start', gap: 48 },
    altGovdeDar: { flexDirection: 'column', gap: 26 },
    altMarka: { width: 242, flexShrink: 0, gap: 7 },
    altMarkaDar: { width: '100%' },
    altAciklama: { color: renk.gri, fontSize: 14, lineHeight: 22, maxWidth: 300 },
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
    altBaglantiYazi: { fontSize: 14, lineHeight: 22, color: renk.gri, flexShrink: 1 },
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
    altTelif: { color: renk.gri, fontSize: 12, lineHeight: 19 },
    mobilMenu: {
      flexDirection: 'row',
      backgroundColor: renk.beyaz,
      borderTopWidth: 1,
      borderColor: renk.cizgi,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      zIndex: 20,
    },
    bildirim: { position: 'absolute', alignSelf: 'center', width: '92%', maxWidth: 500, zIndex: 100 },
  }),
);
