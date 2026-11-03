import { View } from 'react-native';
import { Link } from 'expo-router';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { blogOkumaSuresi, blogYazilari } from '../veri/blog';
import { ortak, useEkran, useTema } from '../tasarim/tema';

export default function Blog() {
  const { renk } = useTema();
  const { mobil, bosluk } = useEkran();
  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 1100,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 24 : 42,
            paddingBottom: 56,
            gap: 28,
          },
        ]}
      >
        <View style={{ gap: 12, maxWidth: 680 }}>
          <Baslik buyuk>Alışveriş rehberi</Baslik>
          <Yazi style={{ color: renk.gri, fontSize: 15, lineHeight: 26 }}>
            İlan hazırlarken ve ikinci el alışveriş yaparken işine yarayacak kontroller.
          </Yazi>
        </View>
        <View style={{ borderTopWidth: 1, borderColor: renk.cizgi }}>
          {blogYazilari.map((yazi) => (
            <Link key={yazi.yol} href={`/blog/${yazi.yol}` as '/'} asChild>
              <HareketliBas
                accessibilityRole="link"
                style={{
                  minHeight: 44,
                  paddingVertical: mobil ? 24 : 30,
                  borderBottomWidth: 1,
                  borderColor: renk.cizgi,
                  gap: mobil ? 12 : 24,
                  flexDirection: mobil ? 'column' : 'row',
                  alignItems: mobil ? 'stretch' : 'flex-start',
                }}
              >
                <View style={{ width: mobil ? '100%' : 150, gap: 4 }}>
                  <Yazi style={{ fontSize: 13, fontWeight: '600' }}>{yazi.konu}</Yazi>
                  <Yazi style={{ color: renk.gri, fontSize: 12 }}>{blogOkumaSuresi(yazi)} dk okuma</Yazi>
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 10 }}>
                  <Yazi
                    role="heading"
                    aria-level={2}
                    style={{
                      fontSize: mobil ? 21 : 25,
                      lineHeight: mobil ? 29 : 33,
                      fontWeight: '700',
                      letterSpacing: -0.5,
                    }}
                  >
                    {yazi.baslik}
                  </Yazi>
                  <Yazi style={{ color: renk.gri, fontSize: 14, lineHeight: 24 }}>{yazi.ozet}</Yazi>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <Yazi style={{ fontWeight: '600', fontSize: 13 }}>Yazıyı oku</Yazi>
                    <ArrowRight size={17} color={renk.murekkep} />
                  </View>
                </View>
              </HareketliBas>
            </Link>
          ))}
        </View>
      </View>
    </Kabuk>
  );
}
