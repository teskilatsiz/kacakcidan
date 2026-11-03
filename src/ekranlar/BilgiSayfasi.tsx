import { View } from 'react-native';
import { Link } from 'expo-router';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { BilgiBaglantisi } from '../bilesenler/BilgiBaglantisi';
import { GezintiGecmisiDenetimi } from '../bilesenler/CerezTercihleri';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { bilgiSayfalari } from '../veri/bilgiSayfalari';

export default function BilgiSayfasi({ tur }: { tur: keyof typeof bilgiSayfalari }) {
  const { renk } = useTema();
  const { mobil, bosluk } = useEkran();
  const sayfa = bilgiSayfalari[tur];
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
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: 24,
            rowGap: 0,
            borderBottomWidth: 1,
            borderColor: renk.cizgi,
          }}
          role="navigation"
          accessibilityLabel="Site bilgileri"
        >
          {Object.entries(bilgiSayfalari).map(([anahtar, bilgi]) => (
            <Link key={bilgi.yol} href={bilgi.yol as '/'} asChild>
              <HareketliBas
                accessibilityState={{ selected: anahtar === tur }}
                style={{
                  minHeight: 46,
                  paddingVertical: 10,
                  borderBottomWidth: anahtar === tur ? 2 : 0,
                  borderBottomColor: renk.murekkep,
                  justifyContent: 'center',
                  maxWidth: '100%',
                }}
              >
                <Yazi
                  style={{
                    fontSize: 13,
                    fontWeight: anahtar === tur ? '700' : '400',
                    color: anahtar === tur ? renk.murekkep : renk.gri,
                  }}
                >
                  {bilgi.baslik}
                </Yazi>
              </HareketliBas>
            </Link>
          ))}
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
