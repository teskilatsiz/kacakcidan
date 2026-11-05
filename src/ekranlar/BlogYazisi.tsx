import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, BosDurum, Yazi } from '../bilesenler/Temel';
import { BilgiBaglantisi } from '../bilesenler/BilgiBaglantisi';
import { blogOkumaSuresi, blogYazisiniBul } from '../veri/blog';
import { ortak, useEkran, useTema } from '../tasarim/tema';

export default function BlogYazisi() {
  const { yol } = useLocalSearchParams<{ yol: string }>();
  const yazi = blogYazisiniBul(yol);
  const { renk } = useTema();
  const { mobil, bosluk } = useEkran();
  if (!yazi)
    return (
      <Kabuk>
        <BosDurum
          baslik="Yazı bulunamadı"
          aciklama="Diğer yazılara alışveriş rehberinden ulaşabilirsin."
          eylem={<BilgiBaglantisi ad="Alışveriş rehberine dön" adres="/blog" />}
        />
      </Kabuk>
    );
  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 920,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 16 : 30,
            paddingBottom: 56,
            gap: mobil ? 26 : 32,
          },
        ]}
      >
        <BilgiBaglantisi ad="Alışveriş rehberine dön" adres="/blog" />
        <View style={{ gap: 14 }}>
          <Yazi style={{ color: renk.gri, fontSize: 13 }}>
            {yazi.konu} · {blogOkumaSuresi(yazi)} dk okuma
          </Yazi>
          <Baslik buyuk style={{ fontSize: mobil ? 30 : 39, lineHeight: mobil ? 39 : 48 }}>
            {yazi.baslik}
          </Baslik>
          <Yazi style={{ fontSize: 17, lineHeight: 28, color: renk.gri }}>{yazi.ozet}</Yazi>
          <Yazi style={{ fontSize: 12, color: renk.gri }}>4 Kasım 2026</Yazi>
        </View>
        {yazi.bolumler.map(({ baslik, paragraflar }) => (
          <View key={baslik} style={{ gap: 13 }}>
            <Baslik style={{ fontSize: 22, lineHeight: 30, letterSpacing: -0.4 }}>{baslik}</Baslik>
            {paragraflar.map((paragraf) => (
              <Yazi key={paragraf} style={{ fontSize: 16, lineHeight: 29 }}>
                {paragraf}
              </Yazi>
            ))}
          </View>
        ))}
        {yazi.kaynaklar.length > 0 && (
          <View style={{ paddingTop: 20, borderTopWidth: 1, borderColor: renk.cizgi, gap: 3 }}>
            <Baslik style={{ fontSize: 18 }}>Kaynaklar ve ilgili bilgiler</Baslik>
            {yazi.kaynaklar.map(({ ad, adres }) => (
              <BilgiBaglantisi key={adres} ad={ad} adres={adres} />
            ))}
          </View>
        )}
      </View>
    </Kabuk>
  );
}
