import { useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Grid2X2 from 'lucide-react-native/icons/grid-2x2';
import SlidersHorizontal from 'lucide-react-native/icons/sliders-horizontal';
import Search from 'lucide-react-native/icons/search';
import { Baslik, BosDurum, Buton, Yazi } from '../bilesenler/Temel';
import { Kabuk } from '../bilesenler/Kabuk';
import { Giris, HareketliBas } from '../bilesenler/Hareketli';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { IlaniOneCikar } from '../bilesenler/IlaniOneCikar';
import { Gorsel } from '../bilesenler/Gorsel';
import { IkonluKategoriler } from '../bilesenler/IkonluKategoriler';
import { usePazar } from '../durum/Pazar';
import { gorselKaynagi } from '../veri/gorseller';
import { konumEslesir } from '../veri/konumlar';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import '../tasarim/anasayfa.web.css';

const vitrinSirasi = [
  'renault-clio-2018',
  'iphone-15-pro',
  'fiat-egea-2021',
  'playstation-5',
  'toyota-corolla-hibrit',
  'macbook-air',
  'fujifilm-x100v',
  'sari-masa-lambasi',
  'air-jordan',
  'otomatik-saat',
  'kawasaki-ninja',
];

export default function AnaSayfa() {
  const { renk } = useTema();
  const s = useStiller();
  const { mobil, bosluk, genislik } = useEkran();
  const web = Platform.OS === 'web';
  const { tumIlanlar, konum, konumSec } = usePazar();
  const [tumunuAc, setTumunuAc] = useState(0);
  const vitrin = useMemo(
    () =>
      tumIlanlar
        .filter((ilan) => konumEslesir(ilan.konum, konum))
        .sort((a, b) => {
          const sira = (id: string) =>
            id.startsWith('yerel-') ? -1 : vitrinSirasi.includes(id) ? vitrinSirasi.indexOf(id) : 100;
          return sira(a.id) - sira(b.id);
        })
        .slice(0, 14),
    [tumIlanlar, konum],
  );
  const kesifBandi = (kucuk: boolean) => (
    <Giris style={[s.kesifBandi, kucuk && s.kesifBandiMobil]} dataSet={{ 'kategori-kesif-bandi': 'true' }}>
      <View
        style={[s.bantGorseli, kucuk && { width: '40%', opacity: 0.45 }]}
        pointerEvents="none"
        dataSet={{ 'kesif-bant-gorseli': 'true' }}
      >
        <Gorsel
          source={gorselKaynagi('/gorseller/kategorilerde-kesfet.webp')}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Ahşap masa üzerinde dizüstü bilgisayar, telefon ve kulaklık"
          sizes="(max-width: 699px) 40vw, (max-width: 1099px) calc((100vw - 56px) * 0.32), (max-width: 1439px) calc((100vw - 96px) * 0.32), 430px"
          priority={kucuk ? undefined : 'high'}
          media={web && !kucuk ? '(min-width: 700px)' : undefined}
        />
      </View>
      <View
        dataSet={{ 'kesif-bant-icerigi': 'true' }}
        style={[
          s.bantIcerigi,
          {
            padding: kucuk ? 20 : 26,
            flexDirection: kucuk || (!web && genislik < 1080) ? 'column' : 'row',
            alignItems: kucuk || (!web && genislik < 1080) ? 'flex-start' : 'center',
          },
        ]}
      >
        <View
          dataSet={{ 'kesif-bant-metni': 'true' }}
          style={{
            flex: kucuk || (!web && genislik < 1080) ? undefined : 1,
            minWidth: 0,
            gap: 6,
            maxWidth: kucuk ? '88%' : 650,
          }}
        >
          <Yazi
            role="heading"
            aria-level={2}
            style={[s.bantBasligi, kucuk && { fontSize: 20, lineHeight: 27 }]}
          >
            Kategorilerde keşfet,{kucuk ? '\n' : ' '}aradığını hemen bul.
          </Yazi>
          {!kucuk && (
            <Yazi style={{ color: renk.gri, fontSize: 13, lineHeight: 21 }}>
              Otomobil, emlak, iş, hizmet ve ikinci el ürün ilanları bir arada.
            </Yazi>
          )}
        </View>
        <HareketliBas
          vurgu="dugme"
          onPress={() => setTumunuAc((sayac) => sayac + 1)}
          style={[s.bantButonu, { marginRight: kucuk || (!web && genislik < 1080) ? 0 : '18%' }]}
        >
          <Grid2X2 size={18} color={renk.vurguYazi} />
          <Yazi style={{ color: renk.vurguYazi, fontWeight: '700', fontSize: kucuk ? 12 : 13 }}>
            {kucuk ? 'Kategorileri keşfet' : 'Tüm kategorileri keşfet'}
          </Yazi>
          <ArrowRight size={18} color={renk.vurguYazi} />
        </HareketliBas>
      </View>
    </Giris>
  );
  return (
    <Kabuk>
      <IkonluKategoriler tumunuAc={tumunuAc} />
      <View
        dataSet={{ 'anasayfa-alani': 'true' }}
        style={[
          ortak.alan,
          {
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 4 : 22,
            paddingBottom: mobil ? 28 : 44,
            gap: mobil ? 26 : 24,
          },
        ]}
      >
        {web ? (
          <View dataSet={{ 'kesif-yerlesimi': 'ust' }}>{kesifBandi(false)}</View>
        ) : (
          !mobil && kesifBandi(false)
        )}
        <View dataSet={{ 'anasayfa-vitrin': 'true' }} style={{ gap: mobil ? 16 : 20 }}>
          <View dataSet={{ 'anasayfa-vitrin-basligi': 'true' }} style={[ortak.aralikli, { gap: 12 }]}>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Baslik
                buyuk
                style={{ fontSize: mobil ? 27 : 32, lineHeight: mobil ? 35 : 40, letterSpacing: -0.9 }}
              >
                Vitrin
              </Baslik>
              {(web || !mobil) && (
                <Yazi
                  dataSet={{ 'anasayfa-vitrin-altbaslik': 'true' }}
                  style={{ color: renk.gri, fontSize: 12 }}
                >
                  {konum ? `${konum} konumundan ilanlar` : 'Türkiye’den öne çıkan ilanlar'}
                </Yazi>
              )}
            </View>
            {web ? (
              <>
                <View dataSet={{ 'anasayfa-vitrin-eylemi': 'mobil' }}>
                  <Link href="/kesfet" asChild>
                    <HareketliBas style={s.vitrinBaglantisi}>
                      <Yazi style={{ fontSize: 12, fontWeight: '600' }}>Tüm ilanlar</Yazi>
                      <ArrowRight size={18} color={renk.murekkep} />
                    </HareketliBas>
                  </Link>
                </View>
                <View dataSet={{ 'anasayfa-vitrin-eylemi': 'masaustu' }}>
                  <Link href={{ pathname: '/kesfet', params: { filtre: '1' } }} asChild>
                    <HareketliBas
                      style={StyleSheet.flatten([
                        s.vitrinBaglantisi,
                        { borderWidth: 1, borderColor: renk.cizgi, paddingHorizontal: 12 },
                      ])}
                    >
                      <Yazi style={{ fontSize: 12, fontWeight: '600' }}>Detaylı ara</Yazi>
                      <SlidersHorizontal size={17} color={renk.murekkep} />
                    </HareketliBas>
                  </Link>
                </View>
              </>
            ) : (
              <Link href={mobil ? '/kesfet' : { pathname: '/kesfet', params: { filtre: '1' } }} asChild>
                <HareketliBas
                  style={StyleSheet.flatten([
                    s.vitrinBaglantisi,
                    !mobil && { borderWidth: 1, borderColor: renk.cizgi, paddingHorizontal: 12 },
                  ])}
                >
                  <Yazi style={{ fontSize: 12, fontWeight: '600' }}>
                    {mobil ? 'Tüm ilanlar' : 'Detaylı ara'}
                  </Yazi>
                  {mobil ? (
                    <ArrowRight size={18} color={renk.murekkep} />
                  ) : (
                    <SlidersHorizontal size={17} color={renk.murekkep} />
                  )}
                </HareketliBas>
              </Link>
            )}
          </View>
          {vitrin.length > 0 ? (
            <IlanIzgarasi
              ilanlar={vitrin}
              oncelikli
              vitrin
              araya={<IlaniOneCikar />}
              arayaSira={web ? 3 : mobil ? 3 : 4}
            />
          ) : (
            <BosDurum
              simge={<Search color={renk.murekkep} size={28} />}
              baslik="Bu konumda henüz ilan yok."
              aciklama="Diğer şehirlerdeki ilanlara da bakabilirsin."
              eylem={<Buton onPress={() => konumSec('')}>Türkiye’deki ilanları göster</Buton>}
            />
          )}
          <Link href="/kesfet" asChild>
            <HareketliBas style={s.tumIlanlar}>
              <Yazi style={{ fontSize: 13, fontWeight: '600' }}>Tüm ilanları gör</Yazi>
              <ArrowRight size={17} color={renk.murekkep} />
            </HareketliBas>
          </Link>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderColor: renk.cizgi,
            paddingTop: 20,
            gap: 8,
            flexDirection: mobil ? 'column' : 'row',
            alignItems: mobil ? 'stretch' : 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Yazi style={{ fontWeight: '700', fontSize: 17 }}>Aradığını bulamadın mı?</Yazi>
            <Yazi style={{ color: renk.gri, fontSize: 13 }}>
              Aradığın ürünü ve bütçeni alım taleplerine yaz.
            </Yazi>
          </View>
          <Link href="/alim-talepleri" asChild>
            <HareketliBas
              style={{
                minHeight: 44,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: mobil ? 0 : 12,
              }}
            >
              <Yazi style={{ fontSize: 13, fontWeight: '600' }}>Alım taleplerini gör</Yazi>
              <ArrowRight size={17} color={renk.murekkep} />
            </HareketliBas>
          </Link>
        </View>
        {web ? (
          <View dataSet={{ 'kesif-yerlesimi': 'alt' }}>{kesifBandi(true)}</View>
        ) : (
          mobil && kesifBandi(true)
        )}
      </View>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kesifBandi: {
      overflow: 'hidden',
      borderRadius: 14,
      backgroundColor: renk.acik,
      borderWidth: 1,
      borderColor: renk.cizgi,
      minHeight: 112,
    },
    kesifBandiMobil: { minHeight: 156, borderRadius: 12 },
    bantGorseli: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '32%', opacity: 0.85 },
    bantIcerigi: { flex: 1, justifyContent: 'space-between', gap: 16, zIndex: 1 },
    bantBasligi: { fontFamily: kalin, fontWeight: '700', fontSize: 26, lineHeight: 34, letterSpacing: -0.8 },
    bantButonu: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      paddingHorizontal: 16,
      backgroundColor: renk.sari,
      borderRadius: 8,
      flexShrink: 0,
    },
    vitrinBaglantisi: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderRadius: 8,
      flexShrink: 0,
    },
    tumIlanlar: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      alignSelf: 'center',
      paddingHorizontal: 22,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 8,
      marginTop: 8,
    },
  }),
);
