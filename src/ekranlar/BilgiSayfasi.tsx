import { useCallback, useRef } from 'react';
import { Platform, ScrollView, View, type ScrollViewInstance } from 'react-native';
import { Link } from 'expo-router';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { BilgiBaglantisi } from '../bilesenler/BilgiBaglantisi';
import { GezintiGecmisiDenetimi } from '../bilesenler/CerezTercihleri';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { bilgiSayfalari } from '../veri/bilgiSayfalari';

const sekmeAdlari = {
  gizlilik: 'Gizlilik',
  kullanim: 'Kullanım koşulları',
  cerezler: 'Çerezler',
};

export default function BilgiSayfasi({ tur }: { tur: keyof typeof bilgiSayfalari }) {
  const { renk, koyu } = useTema();
  const { mobil, bosluk } = useEkran();
  const sayfa = bilgiSayfalari[tur];
  const sekmeler = useRef<ScrollViewInstance>(null);
  const gezintiGenisligi = useRef(0);
  const aktifSekme = useRef({ x: 0, width: 0 });
  const aktifSekmeyiGoster = useCallback(() => {
    const { x, width } = aktifSekme.current;
    if (!gezintiGenisligi.current || !width) return;
    sekmeler.current?.scrollTo({
      x: Math.max(0, x - Math.max(0, (gezintiGenisligi.current - width) / 2)),
      animated: false,
    });
  }, []);

  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 1080,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 24 : 42,
            paddingBottom: mobil ? 40 : 64,
            gap: mobil ? 26 : 36,
          },
        ]}
      >
        <View
          style={{
            minWidth: 0,
            borderBottomWidth: 1,
            borderColor: renk.cizgi,
          }}
          role="navigation"
          accessibilityLabel="Site bilgileri"
        >
          <ScrollView
            ref={sekmeler}
            horizontal
            indicatorStyle={koyu ? 'white' : 'black'}
            style={{ flexGrow: 0, minWidth: 0 }}
            contentContainerStyle={{ gap: mobil ? 16 : 24, alignItems: 'stretch' }}
            onLayout={({ nativeEvent }) => {
              gezintiGenisligi.current = nativeEvent.layout.width;
              aktifSekmeyiGoster();
            }}
            onContentSizeChange={aktifSekmeyiGoster}
          >
            {Object.entries(bilgiSayfalari).map(([anahtar, bilgi]) => (
              <Link key={bilgi.yol} href={bilgi.yol as '/'} asChild>
                <HareketliBas
                  accessibilityRole="link"
                  accessibilityState={Platform.OS === 'web' ? undefined : { selected: anahtar === tur }}
                  aria-current={Platform.OS === 'web' && anahtar === tur ? 'page' : undefined}
                  onLayout={({ nativeEvent }) => {
                    if (anahtar !== tur) return;
                    aktifSekme.current = nativeEvent.layout;
                    aktifSekmeyiGoster();
                  }}
                  style={{
                    minHeight: 48,
                    flexShrink: 0,
                    paddingVertical: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: anahtar === tur ? renk.murekkep : 'transparent',
                    justifyContent: 'center',
                  }}
                >
                  <Yazi
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      fontWeight: anahtar === tur ? '700' : '400',
                      color: anahtar === tur ? renk.murekkep : renk.gri,
                    }}
                  >
                    {sekmeAdlari[anahtar as keyof typeof bilgiSayfalari]}
                  </Yazi>
                </HareketliBas>
              </Link>
            ))}
          </ScrollView>
        </View>
        <View style={{ gap: 12, maxWidth: 760 }}>
          <Baslik buyuk>{sayfa.baslik}</Baslik>
          <Yazi style={{ fontSize: 15, lineHeight: 26, color: renk.gri }}>{sayfa.ozet}</Yazi>
          <Yazi style={{ fontSize: 12, color: renk.gri }}>Son güncelleme: 4 Kasım 2026</Yazi>
        </View>
        <View style={{ maxWidth: 760, gap: mobil ? 28 : 34 }}>
          {sayfa.bolumler.map(({ baslik, paragraflar }) => (
            <View key={baslik} style={{ gap: 12 }}>
              <Baslik style={{ fontSize: 20, lineHeight: 28, letterSpacing: -0.4 }}>{baslik}</Baslik>
              {paragraflar.map((paragraf) => (
                <Yazi key={paragraf} style={{ fontSize: 15, lineHeight: 27 }}>
                  {paragraf}
                </Yazi>
              ))}
            </View>
          ))}
          {tur === 'cerezler' && <GezintiGecmisiDenetimi />}
          <View style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 18, gap: 2 }}>
            <Baslik style={{ fontSize: 18 }}>İlgili bağlantılar</Baslik>
            {tur === 'gizlilik' && (
              <>
                <BilgiBaglantisi
                  ad="Gizlilikle ilgili iletişim: teskilatsiz@dev.com"
                  adres="mailto:teskilatsiz@dev.com"
                />
                <BilgiBaglantisi
                  ad="Kişisel Verileri Koruma Kurumu: İlgili kişinin hakları"
                  adres="https://www.kvkk.gov.tr/Icerik/2036/Ilgili-Kisinin-Haklari"
                />
                <BilgiBaglantisi ad="Netlify gizlilik açıklaması" adres="https://www.netlify.com/privacy/" />
                <BilgiBaglantisi
                  ad="OpenStreetMap gizlilik açıklaması"
                  adres="https://osmfoundation.org/wiki/Privacy_Policy"
                />
              </>
            )}
            {tur === 'cerezler' && (
              <BilgiBaglantisi
                ad="KVKK: Çerez Uygulamaları Hakkında Rehber"
                adres="https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber"
              />
            )}
            {tur === 'kullanim' && <BilgiBaglantisi ad="Alışveriş rehberi" adres="/blog" />}
            <BilgiBaglantisi
              ad="Teknik sorun bildir (GitHub)"
              adres="https://github.com/teskilatsiz/kacakcidan/issues"
            />
          </View>
        </View>
      </View>
    </Kabuk>
  );
}
