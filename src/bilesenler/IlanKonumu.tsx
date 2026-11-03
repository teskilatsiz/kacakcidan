import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useEkran, useTema } from '../tasarim/tema';
import { Yazi } from './Temel';
import { HaritaGorunumu } from './HaritaGorunumu';
import type { konumHaritasi as haritaVerisi } from '../veri/konumHaritasi';

export function IlanKonumu({ konum }: { konum: string }) {
  const { renk } = useTema();
  const { mobil, yukseklik } = useEkran();
  const [bilgi, setBilgi] = useState<ReturnType<typeof haritaVerisi>>();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  useEffect(() => {
    let gecerli = true;
    setYukleniyor(true);
    setHata('');
    import('../veri/konumHaritasi')
      .then(({ konumHaritasi }) => {
        if (gecerli) {
          setBilgi(konumHaritasi(konum));
          setYukleniyor(false);
        }
      })
      .catch(() => {
        if (gecerli) {
          setHata('Harita yüklenemedi. Bağlantını kontrol edip yeniden dene.');
          setYukleniyor(false);
        }
      });
    return () => {
      gecerli = false;
    };
  }, [konum]);

  return (
    <View dataSet={{ 'ilan-konum-haritasi': 'true' }} style={{ minWidth: 0 }}>
      {yukleniyor ? (
        <View
          style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}
          accessibilityLabel="Harita yükleniyor"
        >
          <ActivityIndicator color={renk.murekkep} />
        </View>
      ) : bilgi ? (
        <HaritaGorunumu
          konum={bilgi}
          baslik={`${bilgi.adres} çevresi haritası`}
          yukseklik={mobil ? Math.max(260, Math.min(360, yukseklik * 0.46)) : 400}
        />
      ) : !hata ? (
        <Yazi>Bu ilan için haritada gösterilecek konum belirtilmemiş.</Yazi>
      ) : null}
      {!!hata && (
        <Yazi accessibilityRole="alert" style={{ fontSize: 13 }}>
          {hata}
        </Yazi>
      )}
    </View>
  );
}
