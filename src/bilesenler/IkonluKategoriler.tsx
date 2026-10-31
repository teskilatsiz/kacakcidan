import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { kategoriler } from '../veri/ilanlar';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { KategoriSimgesi } from './KategoriSimgesi';
import { ortak, renk, useEkran } from '../tasarim/tema';

export function IkonluKategoriler() {
  const { mobil, bosluk } = useEkran();
  return (
    <View style={s.kok} dataSet={{ 'ikonlu-kategoriler': 'true' }}>
      <View style={[ortak.alan, { paddingHorizontal: bosluk, paddingVertical: mobil ? 12 : 18 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          accessibilityLabel="İlan kategorileri"
          contentContainerStyle={{ flexGrow: 1, gap: mobil ? 8 : 12, padding: 2 }}
        >
          {kategoriler.map((kategori) => {
            return (
              <Link
                key={kategori.id}
                href={{ pathname: '/kesfet', params: { kategori: kategori.id } }}
                asChild
              >
                <HareketliBas
                  vurgu="kategori"
                  accessibilityLabel={`${kategori.ad} ilanlarını keşfet`}
                  style={StyleSheet.flatten([
                    s.kategori,
                    {
                      width: mobil ? 88 : undefined,
                      flex: mobil ? undefined : 1,
                      minWidth: mobil ? 88 : 100,
                      minHeight: mobil ? 94 : 83,
                    },
                  ])}
                >
                  {({ hovered }) => (
                    <>
                      <KategoriSimgesi kategori={kategori.id} dolu={hovered} />
                      <Yazi
                        numberOfLines={mobil ? 2 : 1}
                        style={{
                          fontSize: 11,
                          lineHeight: 18,
                          fontWeight: '600',
                          marginTop: 7,
                          textAlign: 'center',
                          minHeight: mobil ? 36 : 18,
                        }}
                      >
                        {kategori.ad}
                      </Yazi>
                    </>
                  )}
                </HareketliBas>
              </Link>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  kok: { backgroundColor: '#fff', borderBottomWidth: 1, borderColor: renk.cizgi },
  kategori: {
    minHeight: 83,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: renk.cizgi,
    backgroundColor: '#fafafa',
  },
});
