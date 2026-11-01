import { useId, useRef, useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTema } from '../tasarim/tema';

/** Yalnız taşan kenarda perde gösterir; kaydırma sırasında ekranı yeniden çizmez. */
export function KaydirmaSeridi({ children, etiket }: { children: ReactNode; etiket: string }) {
  const { renk } = useTema();
  const kimlik = useId().replace(/[^a-zA-Z0-9]/g, '');
  const olcu = useRef({ alan: 0, icerik: 0, sol: 0 });
  const kenarlar = useRef({ sol: false, sag: false });
  const [perde, setPerde] = useState(kenarlar.current);
  const guncelle = () => {
    const yeni = {
      sol: olcu.current.sol > 3,
      sag: olcu.current.icerik - olcu.current.alan - olcu.current.sol > 3,
    };
    if (yeni.sol !== kenarlar.current.sol || yeni.sag !== kenarlar.current.sag) {
      kenarlar.current = yeni;
      setPerde(yeni);
    }
  };
  return (
    <View style={{ minWidth: 0 }} dataSet={{ 'kaydirma-seridi': 'true' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityLabel={etiket}
        scrollEventThrottle={32}
        directionalLockEnabled
        onLayout={(olay) => {
          olcu.current.alan = olay.nativeEvent.layout.width;
          guncelle();
        }}
        onContentSizeChange={(genislik) => {
          olcu.current.icerik = genislik;
          guncelle();
        }}
        onScroll={(olay) => {
          olcu.current.sol = olay.nativeEvent.contentOffset.x;
          guncelle();
        }}
        contentContainerStyle={{ gap: 10, paddingVertical: 3 }}
      >
        {children}
      </ScrollView>
      {(['sol', 'sag'] as const).map(
        (yon) =>
          perde[yon] && (
            <View
              key={yon}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 24,
                [yon === 'sol' ? 'left' : 'right']: 0,
              }}
              dataSet={{ 'kaydirma-golgesi': yon }}
            >
              <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 24 100">
                <Defs>
                  <LinearGradient
                    id={`${kimlik}-${yon}`}
                    x1={yon === 'sol' ? '0%' : '100%'}
                    y1="0%"
                    x2={yon === 'sol' ? '100%' : '0%'}
                    y2="0%"
                  >
                    <Stop offset="0" stopColor={renk.beyaz} stopOpacity={1} />
                    <Stop offset="1" stopColor={renk.beyaz} stopOpacity={0} />
                  </LinearGradient>
                </Defs>
                <Rect width={24} height={100} fill={`url(#${kimlik}-${yon})`} />
              </Svg>
            </View>
          ),
      )}
    </View>
  );
}
