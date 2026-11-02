import { memo, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gorsel as Image } from './Gorsel';
import { gorselKaynagi } from '../veri/gorseller';
import { Link } from 'expo-router';
import MapPin from 'lucide-react-native/icons/map-pin';
import { type Ilan, ilanBedeli, ilanYolu } from '../veri/ilanlar';
import { urunKategorisiMi } from '../veri/anaKategoriler';
import { usePazar } from '../durum/Pazar';
import { FavoriDugmesi, HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { IlanEtiketleri } from './IlanEtiketleri';
import { kalin, useEkran, useTema, temaStilleri } from '../tasarim/tema';

export const IlanKarti = memo(function IlanKarti({
  ilan,
  liste = false,
  priority,
  sizes,
  vitrin = false,
}: {
  ilan: Ilan;
  liste?: boolean;
  priority?: 'high' | 'normal';
  sizes?: string;
  vitrin?: boolean;
}) {
  const { renk } = useTema();
  const s = useStiller();

  const { favoriler, favoriDegistir } = usePazar();
  const { mobil } = useEkran();
  return (
    <View
      style={[s.kart, liste && s.liste]}
      dataSet={{ 'ilan-karti': 'true', 'vitrin-karti': String(vitrin), 'liste-karti': String(liste) }}
    >
      <Link href={ilanYolu(ilan)} asChild>
        <HareketliBas
          olcek={0.99}
          style={StyleSheet.flatten([{ flex: 1 }, liste && { flexDirection: 'row' }])}
        >
          <View
            style={[
              s.resim,
              liste && {
                width: mobil ? 100 : 180,
                aspectRatio: undefined,
                alignSelf: 'stretch',
                minHeight: 148,
              },
            ]}
          >
            <Image
              source={gorselKaynagi(ilan.gorsel)}
              contentFit="cover"
              style={StyleSheet.absoluteFill}
              priority={priority}
              sizes={sizes}
              accessibilityLabel=""
              transition={0}
              cachePolicy="memory-disk"
            />
            {ilan.oneCikan && (
              <View style={s.rozet}>
                <Yazi
                  style={{
                    fontFamily: kalin,
                    fontWeight: '700',
                    fontSize: 10,
                    lineHeight: 18,
                    color: renk.vurguYazi,
                  }}
                >
                  ÖNE ÇIKAN
                </Yazi>
              </View>
            )}
          </View>
          <View
            style={[
              s.icerik,
              liste && { flex: 1, minWidth: 0, justifyContent: 'center', paddingHorizontal: mobil ? 12 : 24 },
            ]}
          >
            {urunKategorisiMi(ilan.kategori) && (Platform.OS === 'web' || !vitrin || !mobil) && (
              <View dataSet={{ 'ilan-etiketleri': 'true' }}>
                <IlanEtiketleri durum={ilan.durum} takas={ilan.takas} kucuk />
              </View>
            )}
            <Yazi numberOfLines={2} style={s.baslik}>
              {ilan.baslik}
            </Yazi>
            <Yazi style={[s.fiyat, liste && mobil && { fontSize: 19, lineHeight: 28 }]}>
              {ilanBedeli(ilan)}
            </Yazi>
            <View
              dataSet={{ 'ilan-konumu': 'true' }}
              style={[
                s.konum,
                Platform.OS !== 'web' && mobil && { flexDirection: 'column', alignItems: 'stretch', gap: 2 },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                  minWidth: 0,
                  flex: Platform.OS === 'web' || !mobil ? 1 : undefined,
                }}
              >
                <MapPin size={12} color={renk.gri} />
                <Yazi
                  numberOfLines={1}
                  style={{ color: renk.gri, fontSize: 11, lineHeight: 17, flexShrink: 1 }}
                >
                  {ilan.konum}
                </Yazi>
              </View>
              <Yazi
                numberOfLines={1}
                style={{ color: renk.gri, fontSize: 10, lineHeight: 16, flexShrink: 0 }}
              >
                {ilan.zaman}
              </Yazi>
            </View>
          </View>
        </HareketliBas>
      </Link>
      <View style={s.favori}>
        <FavoriDugmesi
          kucuk
          secili={favoriler.includes(ilan.id)}
          onPress={() => favoriDegistir(ilan.id)}
          accessibilityLabel={
            favoriler.includes(ilan.id)
              ? `${ilan.baslik} favorilerden çıkar`
              : `${ilan.baslik} favorilere ekle`
          }
        />
      </View>
    </View>
  );
});

export function IlanIzgarasi({
  ilanlar,
  liste = false,
  sikisik = false,
  oncelikli = false,
  vitrin = false,
  araya,
  arayaSira = 4,
}: {
  ilanlar: Ilan[];
  liste?: boolean;
  sikisik?: boolean;
  oncelikli?: boolean;
  vitrin?: boolean;
  araya?: ReactNode;
  arayaSira?: number;
}) {
  const { genislik, mobil } = useEkran();
  const sutun = liste ? 1 : mobil ? 2 : genislik < 1000 ? 3 : sikisik ? 3 : genislik < 1250 ? 4 : 5;
  const gorselBoyutu = liste
    ? '(max-width: 699px) 100px, 180px'
    : sikisik
      ? '(max-width: 699px) calc(50vw - 26px), (max-width: 1099px) 280px, 350px'
      : '(max-width: 699px) calc(50vw - 26px), (max-width: 999px) calc((100vw - 96px) / 3), (max-width: 1099px) calc((100vw - 116px) / 4), (max-width: 1249px) calc((100vw - 156px) / 4), (max-width: 1439px) calc((100vw - 176px) / 5), 253px';
  const hucreStili = {
    width: liste
      ? ('100%' as const)
      : (`${100 / sutun - (mobil ? 2 : sutun === 5 ? 1.3 : 1.6)}%` as `${number}%`),
    flexGrow: 0,
    flexShrink: 0,
  };
  const kartlar = ilanlar.map((ilan, index) => (
    <View key={ilan.id} style={hucreStili} dataSet={{ 'ilan-hucresi': 'true' }}>
      <IlanKarti
        ilan={ilan}
        liste={liste}
        vitrin={vitrin}
        priority={oncelikli && index === 0 ? 'high' : oncelikli && index === 1 ? 'normal' : undefined}
        sizes={gorselBoyutu}
      />
    </View>
  ));
  if (araya)
    kartlar.splice(
      Math.min(arayaSira, kartlar.length),
      0,
      <View key="ilanini-one-cikar" style={hucreStili} dataSet={{ 'ilan-hucresi': 'true' }}>
        {araya}
      </View>,
    );
  return (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: mobil ? 12 : 20 }}
      dataSet={{ 'ilan-izgarasi': liste ? 'liste' : sikisik ? 'sik' : 'normal' }}
    >
      {kartlar}
    </View>
  );
}
const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kart: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: renk.cizgi,
      backgroundColor: renk.beyaz,
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
    },
    liste: { minHeight: 144 },
    resim: { width: '100%', aspectRatio: 1.32, backgroundColor: renk.acik, overflow: 'hidden' },
    rozet: {
      position: 'absolute',
      left: 10,
      top: 10,
      backgroundColor: renk.sari,
      borderRadius: 5,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    icerik: { padding: 14, gap: 4 },
    baslik: {
      fontFamily: kalin,
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: -0.2,
      minHeight: 40,
    },
    fiyat: {
      fontFamily: kalin,
      fontWeight: '700',
      fontSize: 21,
      lineHeight: 31,
      letterSpacing: -0.6,
      marginBottom: 7,
    },
    konum: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      borderTopWidth: 1,
      borderTopColor: renk.cizgi,
      paddingTop: 9,
    },
    favori: { position: 'absolute', right: 9, top: 9 },
  }),
);
