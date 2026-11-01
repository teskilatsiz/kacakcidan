import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import SlidersHorizontal from 'lucide-react-native/icons/sliders-horizontal';
import Plus from 'lucide-react-native/icons/plus';
import Search from 'lucide-react-native/icons/search';
import { Baslik, BosDurum, Buton, Yazi } from '../bilesenler/Temel';
import { Paragraf } from '../bilesenler/Paragraf';
import { Kabuk } from '../bilesenler/Kabuk';
import { HareketliBas } from '../bilesenler/Hareketli';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { Gorsel } from '../bilesenler/Gorsel';
import { IkonluKategoriler } from '../bilesenler/IkonluKategoriler';
import { usePazar } from '../durum/Pazar';
import { gorselKaynagi } from '../veri/gorseller';
import { konumEslesir } from '../veri/konumlar';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';

const vitrinSirasi = [
  'iphone-15-pro',
  'playstation-5',
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

  const { mobil, bosluk } = useEkran();
  const { tumIlanlar, konum, konumSec } = usePazar();
  const konumdakiler = useMemo(
    () => tumIlanlar.filter((i) => konumEslesir(i.konum, konum)),
    [tumIlanlar, konum],
  );
  const vitrin = useMemo(
    () =>
      [...konumdakiler].sort((a, b) => {
        const sira = (id: string) =>
          id.startsWith('yerel-') ? -1 : vitrinSirasi.includes(id) ? vitrinSirasi.indexOf(id) : 100;
        return sira(a.id) - sira(b.id);
      }),
    [konumdakiler],
  );
  const sifirla = () => konumSec('');
  const kesfetYolu = '/kesfet' as const;
  const filtreBaglantisi = (
    <Link href={{ pathname: '/kesfet', params: { filtre: '1' } }} asChild>
      <HareketliBas
        style={{
          minHeight: 44,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: renk.cizgi,
          borderRadius: 8,
          backgroundColor: renk.beyaz,
          flexDirection: 'row',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <Yazi style={{ fontSize: 12, fontWeight: '600' }}>{mobil ? 'Filtrele' : 'Detaylı ara'}</Yazi>
        <SlidersHorizontal size={17} color={renk.murekkep} />
      </HareketliBas>
    </Link>
  );

  return (
    <Kabuk>
      <IkonluKategoriler />
      <View style={{ backgroundColor: renk.zemin }}>
        <View
          style={[
            ortak.alan,
            {
              paddingHorizontal: bosluk,
              paddingTop: mobil ? 18 : 25,
              paddingBottom: 32,
              gap: mobil ? 16 : 20,
            },
          ]}
        >
          <View style={[ortak.aralikli, { alignItems: 'flex-end', gap: 10 }]}>
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <Baslik
                buyuk
                style={{ fontSize: mobil ? 26 : 32, lineHeight: mobil ? 34 : 40, letterSpacing: -0.9 }}
              >
                Vitrin
              </Baslik>
              <View style={mobil ? ortak.aralikli : undefined}>
                <Yazi style={{ color: renk.gri, fontSize: 12 }} accessibilityLiveRegion="polite">
                  {konum || 'Türkiye'} · {vitrin.length} ilan
                </Yazi>
                {mobil && filtreBaglantisi}
              </View>
            </View>
            {!mobil && filtreBaglantisi}
          </View>
          {vitrin.length ? (
            <IlanIzgarasi ilanlar={vitrin} oncelikli />
          ) : (
            <BosDurum
              simge={<Search color={renk.murekkep} size={28} />}
              baslik="Bu filtrelerde ilan yok."
              aciklama="Bir filtreyi kaldırabilir ya da başka bir kategoriye bakabilirsin."
              eylem={<Buton onPress={sifirla}>Tüm ilanları göster</Buton>}
            />
          )}
          <View style={{ alignItems: 'center', paddingTop: 5 }}>
            <Link href={kesfetYolu} asChild>
              <HareketliBas
                style={{
                  minHeight: 46,
                  borderWidth: 1,
                  borderColor: renk.cizgi,
                  backgroundColor: renk.beyaz,
                  borderRadius: 9,
                  paddingHorizontal: 22,
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <Yazi style={{ fontSize: 13, fontWeight: '600' }}>İlanların tümünü gör</Yazi>
                <ArrowRight color={renk.murekkep} size={17} />
              </HareketliBas>
            </Link>
          </View>
        </View>
      </View>

      <View style={[ortak.alan, { paddingHorizontal: bosluk, paddingVertical: mobil ? 24 : 40 }]}>
        <View style={[s.ilanCagrisi, mobil && s.ilanCagrisiMobil]} dataSet={{ 'ilan-cagrisi': 'true' }}>
          <View style={[s.cagriMetni, mobil && s.cagriMetniMobil, { padding: mobil ? 24 : 36 }]}>
            <Yazi
              role="heading"
              aria-level={2}
              style={[s.cagriBaslik, mobil && { fontSize: 26, lineHeight: 33 }]}
            >
              Mal burada, pazarlık sende.
            </Yazi>
            <Paragraf style={s.cagriAciklama}>
              Kullanmadıkların bir başkasının aradığı olabilir. Fotoğrafını ekle, fiyatını belirle, alıcıyla
              konuş.
            </Paragraf>
            <Link href="/ilan-ver" asChild>
              <HareketliBas style={s.cagriButonu} vurgu="dugme">
                <Plus size={19} color={renk.vurguYazi} />
                <Yazi style={{ fontWeight: '700', fontSize: 14, color: renk.vurguYazi }}>
                  Ücretsiz ilan ver
                </Yazi>
              </HareketliBas>
            </Link>
          </View>
          <View style={[s.cagriGorseli, mobil && s.cagriGorseliMobil]}>
            <Gorsel
              source={gorselKaynagi('/gorseller/kapak.webp')}
              style={s.cagriFotografi}
              contentFit="cover"
              contentPosition="right center"
              accessibilityLabel="İkinci el bir fotoğraf makinesi, sarı masa lambası ve plaklar"
            />
          </View>
        </View>
      </View>
    </Kabuk>
  );
}
const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    ilanCagrisi: {
      flexDirection: 'row',
      overflow: 'hidden',
      borderRadius: 12,
      backgroundColor: renk.sabitKoyu,
      minHeight: 252,
    },
    ilanCagrisiMobil: { flexDirection: 'column-reverse', minHeight: 0 },
    cagriMetni: { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0, gap: 12, justifyContent: 'center' },
    cagriMetniMobil: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' },
    cagriBaslik: {
      fontFamily: kalin,
      fontWeight: '700',
      color: '#fff',
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: -0.8,
      maxWidth: 470,
    },
    cagriAciklama: { color: '#d5d5d6', fontSize: 14, lineHeight: 23, maxWidth: 450 },
    cagriButonu: {
      alignSelf: 'flex-start',
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingHorizontal: 18,
      marginTop: 5,
      borderRadius: 8,
      backgroundColor: renk.sari,
    },
    cagriGorseli: { width: '43%', minHeight: 252, overflow: 'hidden', backgroundColor: '#25221d' },
    cagriGorseliMobil: { width: '100%', minHeight: 0, height: 156 },
    cagriFotografi: { position: 'absolute', top: 0, right: 0, width: '150%', height: '100%' },
  }),
);
