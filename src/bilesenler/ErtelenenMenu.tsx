import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { View } from 'react-native';
import { Buton, Yazi } from './Temel';
import { IskeletParcasi, YuklemeIskeleti } from './YuklemeIskeleti';

/** Hover, klavye odağı ve tıklama aynı isteği paylaşır; başarısız istek yeniden denenebilir. */
export function menuyuErtele<P extends object>(yukle: () => Promise<{ default: ComponentType<P> }>) {
  let hazir: ComponentType<P> | undefined;
  let istek: Promise<ComponentType<P>> | undefined;
  const getir = () => {
    if (hazir) return Promise.resolve(hazir);
    if (!istek)
      istek = yukle()
        .then((modul) => {
          hazir = modul.default;
          return hazir;
        })
        .catch((hata: unknown) => {
          istek = undefined;
          throw hata;
        });
    return istek;
  };

  function Icerik({ ozellikler, bekleme }: { ozellikler: P; bekleme: ReactNode }) {
    const [Bilesen, setBilesen] = useState<ComponentType<P> | undefined>(() => hazir);
    const [hata, setHata] = useState(false);
    const [deneme, setDeneme] = useState(0);
    useEffect(() => {
      let etkin = true;
      void getir()
        .then((bilesen) => {
          if (etkin) setBilesen(() => bilesen);
        })
        .catch(() => {
          if (etkin) setHata(true);
        });
      return () => {
        etkin = false;
      };
    }, [deneme]);
    if (Bilesen) return <Bilesen {...ozellikler} />;
    if (hata)
      return (
        <View style={{ padding: 16, gap: 12, alignItems: 'flex-start' }}>
          <Yazi role="alert">Menü açılamadı.</Yazi>
          <Buton
            ikincil
            onPress={() => {
              setHata(false);
              setDeneme((deger) => deger + 1);
            }}
          >
            Tekrar dene
          </Buton>
        </View>
      );
    return bekleme;
  }

  return {
    Icerik,
    onYukle: () => {
      void getir().catch(() => {});
    },
  };
}

export function MenuIskeleti({ kategori = false, mobil = false }: { kategori?: boolean; mobil?: boolean }) {
  return (
    <YuklemeIskeleti
      etiket={kategori ? 'Kategoriler' : 'Hesap menüsü'}
      style={{
        padding: kategori ? 16 : 10,
        minHeight: kategori ? (mobil ? 340 : 300) : 310,
        flexDirection: kategori && !mobil ? 'row' : 'column',
        gap: 20,
        minWidth: 0,
      }}
    >
      {Array.from({ length: kategori && !mobil ? 3 : 1 }, (_, kolon) => (
        <View key={kolon} style={{ flex: 1, minWidth: 0, gap: 20 }}>
          <View style={{ gap: 8, paddingBottom: 8 }}>
            <IskeletParcasi genislik="52%" yukseklik={18} />
            <IskeletParcasi genislik="72%" yukseklik={12} />
          </View>
          {Array.from({ length: kategori ? 5 : 4 }, (_, satir) => (
            <View key={satir} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IskeletParcasi genislik={20} yukseklik={20} yaricap={6} />
              <IskeletParcasi genislik={satir % 2 ? '56%' : '68%'} yukseklik={14} />
            </View>
          ))}
        </View>
      ))}
    </YuklemeIskeleti>
  );
}
