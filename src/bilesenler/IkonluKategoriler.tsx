import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View, type ViewInstance } from 'react-native';
import { Link, type Href } from 'expo-router';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import Grid2X2 from 'lucide-react-native/icons/grid-2x2';
import { kategoriler, type Kategori } from '../veri/ilanlar';
import { kategoriYapisi } from '../veri/kategoriler';
import { kategoriAdresi } from '../veri/kategoriSayfalari';
import { usePazar } from '../durum/Pazar';
import { HareketliBas, Giris } from './Hareketli';
import { Baslik, Yazi } from './Temel';
import { KategoriSimgesi } from './KategoriSimgesi';
import { KaydirmaSeridi } from './KaydirmaSeridi';
import { Pencere } from './Pencere';
import type { MenuSecimi } from './KategoriMenuPaneli';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';

const ilkKategoriler: Kategori[] = ['otomotiv', 'telefon', 'bilgisayar', 'oyun', 'ev', 'moda', 'koleksiyon'];
const KategoriMenuPaneli = lazy(() =>
  import('./KategoriMenuPaneli').then((modul) => ({ default: modul.KategoriMenuPaneli })),
);

/** Ana sayfadaki kategori seçimi, katalogdaki aynı kategori zincirini kullanır. */
export function IkonluKategoriler({ tumunuAc = 0 }: { tumunuAc?: number }) {
  const { renk } = useTema();
  const s = useStiller();
  const { mobil, bosluk, genislik } = useEkran();
  const web = Platform.OS === 'web';
  const { tumIlanlar } = usePazar();
  const [secim, setSecim] = useState<MenuSecimi | null>(null);
  const [pencere, setPencere] = useState<'tum' | 'kategori' | null>(null);
  const kok = useRef<ViewInstance>(null);
  const dugmeler = useRef<Record<string, ViewInstance | null>>({});
  const menuKimligi = useId();
  const oncekiMobil = useRef(mobil);
  const sayilar = useMemo(() => {
    const sonuc = new Map<Kategori, number>();
    for (const ilan of tumIlanlar) sonuc.set(ilan.kategori, (sonuc.get(ilan.kategori) ?? 0) + 1);
    return sonuc;
  }, [tumIlanlar]);

  useEffect(() => {
    if (tumunuAc > 0) setPencere('tum');
  }, [tumunuAc]);

  useEffect(() => {
    if (oncekiMobil.current === mobil) return;
    oncekiMobil.current = mobil;
    setPencere(null);
    setSecim(null);
  }, [mobil]);

  useEffect(() => {
    if (Platform.OS !== 'web' || mobil || !secim || pencere || typeof document === 'undefined') return;
    const disinaBasildi = (olay: PointerEvent) => {
      const alan = kok.current as unknown as HTMLElement | null;
      if (olay.target instanceof Node && !alan?.contains(olay.target)) setSecim(null);
    };
    const tusBasildi = (olay: KeyboardEvent) => {
      if (olay.key !== 'Escape') return;
      olay.preventDefault();
      setSecim(null);
      dugmeler.current[secim.kategori]?.focus();
    };
    document.addEventListener('pointerdown', disinaBasildi);
    document.addEventListener('keydown', tusBasildi);
    return () => {
      document.removeEventListener('pointerdown', disinaBasildi);
      document.removeEventListener('keydown', tusBasildi);
    };
  }, [mobil, secim, pencere]);

  const kategoriSec = (kategori: Kategori) => {
    if (!mobil && secim?.kategori === kategori && !pencere) {
      setSecim(null);
      return;
    }
    const ilanlar = tumIlanlar.filter((ilan) => ilan.kategori === kategori);
    const altlar = kategoriYapisi(kategori).altKategoriler;
    const ilkAlt =
      [...altlar].sort(
        (a, b) =>
          ilanlar.filter((ilan) => ilan.altKategori === b.id).length -
          ilanlar.filter((ilan) => ilan.altKategori === a.id).length,
      )[0]?.id ?? '';
    const markalar = kategoriYapisi(kategori, ilkAlt).markalar;
    const ilkMarka =
      [...markalar].sort(
        (a, b) =>
          ilanlar.filter((ilan) => ilan.altKategori === ilkAlt && ilan.marka === b.id).length -
          ilanlar.filter((ilan) => ilan.altKategori === ilkAlt && ilan.marka === a.id).length,
      )[0]?.id ?? '';
    setSecim({ kategori, altKategori: mobil ? '' : ilkAlt, marka: mobil ? '' : ilkMarka });
    setPencere(mobil ? 'kategori' : null);
  };

  const kategoriKarti = (kategori: (typeof kategoriler)[number], tumu = false) => {
    const secili = !pencere && secim?.kategori === kategori.id;
    const kart = web || mobil || tumu;
    return (
      <HareketliBas
        key={kategori.id}
        dataSet={{ 'kategori-web-karti': tumu ? 'tum' : 'ana' }}
        ref={(eleman) => {
          if (!tumu) dugmeler.current[kategori.id] = eleman;
        }}
        accessibilityState={{ expanded: secili }}
        aria-controls={!mobil && !tumu ? menuKimligi : undefined}
        onPress={() => kategoriSec(kategori.id)}
        vurgu="kategori"
        style={({ hovered }) => [
          kart ? s.kart : s.sekme,
          !web &&
            mobil && {
              height: 68,
              minHeight: 68,
              paddingHorizontal: genislik < 360 ? 7 : 10,
              paddingVertical: 6,
              gap: genislik < 360 ? 6 : 8,
            },
          web && !tumu
            ? undefined
            : kart
              ? { width: tumu && !mobil ? '31.5%' : '48.5%' }
              : genislik < 1100
                ? { width: 148, flex: undefined }
                : genislik < 1260
                  ? { paddingHorizontal: 6, gap: 6 }
                  : undefined,
          (secili || hovered) && { backgroundColor: renk.sari, borderColor: renk.sari },
        ]}
      >
        {({ hovered }) => {
          const vurgulu = secili || hovered;
          return (
            <>
              <KategoriSimgesi
                kategori={kategori.id}
                dolu={vurgulu}
                boyut={web && !tumu ? 25 : kart ? (genislik < 360 ? 20 : mobil ? 24 : 28) : 25}
              />
              <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                <Yazi
                  dataSet={{ 'kategori-web-adi': 'true' }}
                  numberOfLines={kart ? 2 : 1}
                  style={[
                    s.kategoriAdi,
                    !kart && { fontSize: genislik < 1260 ? 12 : 13 },
                    !web && kart && mobil && { fontSize: 13, lineHeight: 18 },
                    vurgulu && { color: renk.vurguYazi },
                  ]}
                >
                  {kategori.ad}
                </Yazi>
                {kart && (
                  <Yazi
                    dataSet={{ 'kategori-web-adet': 'true' }}
                    style={[
                      s.adet,
                      !web && mobil && { lineHeight: 16 },
                      vurgulu && { color: renk.vurguYazi },
                    ]}
                  >
                    {sayilar.get(kategori.id) ?? 0} ilan
                  </Yazi>
                )}
              </View>
              {kart ? (
                <View dataSet={{ 'kategori-web-ok': 'true' }}>
                  <ChevronRight
                    size={web && !tumu ? 14 : mobil ? 14 : 17}
                    color={vurgulu ? renk.vurguYazi : renk.murekkep}
                  />
                </View>
              ) : secili ? (
                <ChevronUp size={15} color={renk.vurguYazi} />
              ) : null}
            </>
          );
        }}
      </HareketliBas>
    );
  };

  const digerSayisi = kategoriler
    .filter((kategori) => !ilkKategoriler.includes(kategori.id))
    .reduce((toplam, kategori) => toplam + (sayilar.get(kategori.id) ?? 0), 0);
  const tumuDugmesi = (
    <HareketliBas
      vurgu="kategori"
      dataSet={{ 'kategori-web-tumu': 'true' }}
      accessibilityState={{ expanded: pencere === 'tum' }}
      onPress={() => setPencere('tum')}
      style={({ hovered }) => [
        web || mobil ? s.kart : s.tumuSekmesi,
        !web &&
          mobil && {
            height: 68,
            minHeight: 68,
            paddingHorizontal: genislik < 360 ? 7 : 10,
            paddingVertical: 6,
            gap: genislik < 360 ? 6 : 8,
          },
        web
          ? undefined
          : mobil
            ? { width: '48.5%' }
            : genislik < 1100
              ? { width: 160, flex: undefined }
              : undefined,
        hovered && { backgroundColor: renk.sari, borderColor: renk.sari },
      ]}
    >
      {({ hovered }) => (
        <>
          <Grid2X2
            size={web ? 25 : mobil ? (genislik < 360 ? 20 : 24) : 25}
            strokeWidth={1.6}
            color={hovered ? renk.vurguYazi : renk.murekkep}
          />
          <View style={{ flex: web || mobil ? 1 : undefined, minWidth: 0 }}>
            <Yazi
              dataSet={{ 'kategori-web-adi': 'true' }}
              style={[
                s.kategoriAdi,
                { fontSize: 13 },
                !web && mobil && { lineHeight: 18 },
                hovered && { color: renk.vurguYazi },
              ]}
            >
              {web ? (
                <>
                  <Yazi
                    dataSet={{ 'kategori-web-tumu-yazi': 'masaustu' }}
                    style={{ fontSize: 13, fontWeight: '700' }}
                  >
                    Tüm kategoriler
                  </Yazi>
                  <Yazi
                    dataSet={{ 'kategori-web-tumu-yazi': 'mobil' }}
                    style={{ fontSize: 13, fontWeight: '700' }}
                  >
                    Diğer
                  </Yazi>
                </>
              ) : mobil ? (
                'Diğer'
              ) : (
                'Tüm kategoriler'
              )}
            </Yazi>
            {(web || mobil) && (
              <Yazi
                dataSet={{ 'kategori-web-adet': 'true' }}
                style={[s.adet, { lineHeight: 16 }, hovered && { color: renk.vurguYazi }]}
              >
                {digerSayisi} ilan
              </Yazi>
            )}
          </View>
          {(web || mobil) && (
            <View dataSet={{ 'kategori-web-ok': 'true' }}>
              <ChevronRight size={14} color={hovered ? renk.vurguYazi : renk.murekkep} />
            </View>
          )}
        </>
      )}
    </HareketliBas>
  );
  const seciliKategori = kategoriler.find((kategori) => kategori.id === secim?.kategori);
  const seciliYapi = secim ? kategoriYapisi(secim.kategori, secim.altKategori) : null;
  const sonucAdi =
    seciliYapi?.markalar.find((marka) => marka.id === secim?.marka)?.ad ??
    seciliYapi?.altKategoriler.find((alt) => alt.id === secim?.altKategori)?.ad ??
    seciliKategori?.ad;
  const kapat = () => setPencere(null);
  const ilkSatir = ilkKategoriler
    .map((id) => kategoriler.find((kategori) => kategori.id === id)!)
    .map((kategori) => kategoriKarti(kategori));

  return (
    <View ref={kok} style={s.kok} dataSet={{ 'ikonlu-kategoriler': 'true' }}>
      <View
        dataSet={{ 'kategori-ana-alan': 'true' }}
        style={[
          ortak.alan,
          {
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 19 : 8,
            paddingBottom: mobil ? 20 : 8,
            gap: mobil ? 16 : 8,
          },
        ]}
      >
        {(web || mobil) && (
          <View style={ortak.aralikli} dataSet={{ 'kategori-web-baslik': 'true' }}>
            <Baslik style={{ fontSize: 24, lineHeight: 32 }}>Kategoriler</Baslik>
            <HareketliBas onPress={() => setPencere('tum')} style={s.tumunuGor}>
              <Yazi style={{ fontSize: 13, fontWeight: '600' }}>Tümünü gör</Yazi>
              <ArrowRight size={18} color={renk.murekkep} />
            </HareketliBas>
          </View>
        )}
        {web ? (
          <View dataSet={{ 'kategori-web-kaydirma': 'true' }}>
            <View style={s.sekmeler} dataSet={{ 'kategori-web-satir': 'true' }}>
              {ilkSatir}
              {tumuDugmesi}
            </View>
          </View>
        ) : mobil ? (
          <View style={s.izgara}>
            {ilkSatir}
            {tumuDugmesi}
          </View>
        ) : genislik < 1100 ? (
          <KaydirmaSeridi etiket="İlan kategorileri">
            {ilkSatir}
            {tumuDugmesi}
          </KaydirmaSeridi>
        ) : (
          <View style={s.sekmeler}>
            {ilkSatir}
            {tumuDugmesi}
          </View>
        )}
        {!mobil && secim && !pencere && (
          <Giris key={secim.kategori} nativeID={menuKimligi} style={s.megaPanel}>
            <Suspense fallback={<Yazi style={{ padding: 16 }}>Kategoriler yükleniyor…</Yazi>}>
              <KategoriMenuPaneli
                secim={secim}
                degistir={setSecim}
                mobil={false}
                tumunuAc={() => setPencere('tum')}
              />
            </Suspense>
          </Giris>
        )}
      </View>
      <Pencere
        acik={!!pencere}
        kapat={kapat}
        baslik={pencere === 'kategori' ? (seciliKategori?.ad ?? 'Kategoriler') : 'Tüm kategoriler'}
        genis
        altlik={
          pencere === 'kategori' && secim ? (
            <Link href={kategoriAdresi(secim) as Href} asChild>
              <HareketliBas vurgu="dugme" onPress={kapat} style={s.sonucButonu}>
                <Yazi numberOfLines={2} style={{ flex: 1, fontWeight: '700', color: renk.vurguYazi }}>
                  {sonucAdi} ilanlarını gör
                </Yazi>
                <ArrowRight size={20} color={renk.vurguYazi} />
              </HareketliBas>
            </Link>
          ) : undefined
        }
      >
        {pencere === 'tum' ? (
          <View style={s.izgara}>{kategoriler.map((kategori) => kategoriKarti(kategori, true))}</View>
        ) : secim ? (
          <Suspense fallback={<Yazi style={{ padding: 16 }}>Kategoriler yükleniyor…</Yazi>}>
            <KategoriMenuPaneli secim={secim} degistir={setSecim} mobil tumunuAc={() => setPencere('tum')} />
          </Suspense>
        ) : null}
      </Pencere>
    </View>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kok: { backgroundColor: renk.beyaz },
    sekmeler: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    sekme: {
      flex: 1,
      minWidth: 0,
      minHeight: 48,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      borderRadius: 9,
    },
    tumuSekmesi: {
      flex: 1.15,
      minWidth: 0,
      minHeight: 48,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      borderRadius: 9,
    },
    kategoriAdi: { fontFamily: kalin, fontSize: 14, lineHeight: 21, fontWeight: '700' },
    adet: { fontSize: 12, lineHeight: 18, color: renk.gri },
    kart: {
      minHeight: 78,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: renk.cizgi,
      backgroundColor: renk.beyaz,
      borderRadius: 12,
    },
    izgara: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
    tumunuGor: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 0 },
    megaPanel: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      backgroundColor: renk.beyaz,
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginTop: 2,
      marginBottom: 5,
      boxShadow: '0 5px 18px ' + renk.golge,
    },
    sonucButonu: {
      minHeight: 48,
      borderRadius: 10,
      backgroundColor: renk.sari,
      paddingHorizontal: 16,
      paddingVertical: 11,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  }),
);
