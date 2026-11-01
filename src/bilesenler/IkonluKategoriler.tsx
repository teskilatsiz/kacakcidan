import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import Grid2X2 from 'lucide-react-native/icons/grid-2x2';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import { kategoriler, type Kategori } from '../veri/ilanlar';
import { HareketliBas, Giris } from './Hareketli';
import { Yazi } from './Temel';
import { KategoriSimgesi } from './KategoriSimgesi';
import { KaydirmaSeridi } from './KaydirmaSeridi';
import { ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';

const ilkSatir: Kategori[] = ['telefon', 'bilgisayar', 'oyun', 'ev', 'moda', 'koleksiyon', 'otomotiv'];

export function IkonluKategoriler() {
  const { renk } = useTema();
  const s = useStiller();
  const { mobil, bosluk, genislik } = useEkran();
  const [genisletildi, setGenisletildi] = useState(false);
  const kartGenisligi = mobil ? 88 : Math.max(88, (Math.min(genislik, 1440) - bosluk * 2 - 70) / 8);
  const kategoriDugmesi = (kategori: (typeof kategoriler)[number]) => (
    <Link key={kategori.id} href={{ pathname: '/kesfet', params: { kategori: kategori.id } }} asChild>
      <HareketliBas
        vurgu="kategori"
        accessibilityLabel={`${kategori.ad} ilanlarını keşfet`}
        style={StyleSheet.flatten([s.kategori, { width: kartGenisligi }])}
      >
        {({ hovered }) => (
          <>
            <KategoriSimgesi kategori={kategori.id} dolu={hovered} boyut={24} />
            <Yazi
              dataSet={{ 'kategori-yazisi': 'true' }}
              numberOfLines={2}
              style={[s.yazi, { color: hovered ? renk.vurguYazi : renk.murekkep }]}
            >
              {kategori.ad}
            </Yazi>
          </>
        )}
      </HareketliBas>
    </Link>
  );
  return (
    <View style={s.kok} dataSet={{ 'ikonlu-kategoriler': 'true' }}>
      <View style={[ortak.alan, { paddingHorizontal: bosluk, paddingVertical: mobil ? 10 : 14, gap: 8 }]}>
        <KaydirmaSeridi etiket="İlan kategorileri">
          {ilkSatir
            .map((id) => kategoriler.find((kategori) => kategori.id === id))
            .filter((kategori) => !!kategori)
            .map(kategoriDugmesi)}
          <HareketliBas
            vurgu="kategori"
            accessibilityLabel={genisletildi ? 'Daha az kategori göster' : 'Daha fazla kategori göster'}
            accessibilityState={{ expanded: genisletildi }}
            onPress={() => setGenisletildi(!genisletildi)}
            style={[
              s.kategori,
              { width: kartGenisligi },
              genisletildi && { borderColor: renk.sari, backgroundColor: renk.sari },
            ]}
          >
            {({ hovered }) => {
              const Simge = genisletildi ? ChevronUp : Grid2X2;
              return (
                <>
                  <Simge
                    size={24}
                    color={hovered || genisletildi ? renk.vurguYazi : renk.murekkep}
                    strokeWidth={1.6}
                  />
                  <Yazi
                    dataSet={{ 'kategori-yazisi': 'true' }}
                    numberOfLines={2}
                    style={[s.yazi, { color: hovered || genisletildi ? renk.vurguYazi : renk.murekkep }]}
                  >
                    {genisletildi ? 'Daha az' : 'Daha fazla'}
                  </Yazi>
                </>
              );
            }}
          </HareketliBas>
        </KaydirmaSeridi>
        {genisletildi && (
          <Giris>
            <KaydirmaSeridi etiket="Diğer kategoriler">
              {kategoriler.filter((kategori) => !ilkSatir.includes(kategori.id)).map(kategoriDugmesi)}
            </KaydirmaSeridi>
          </Giris>
        )}
      </View>
    </View>
  );
}
const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kok: { backgroundColor: renk.beyaz, borderBottomWidth: 1, borderColor: renk.cizgi },
    kategori: {
      minHeight: 88,
      paddingVertical: 10,
      paddingHorizontal: 7,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: renk.cizgi,
      backgroundColor: renk.acik,
      flexShrink: 0,
    },
    yazi: { fontSize: 11, lineHeight: 17, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  }),
);
