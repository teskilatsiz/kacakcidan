import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTema } from '../tasarim/tema';
import type { IskeletParcasiProps, YuklemeIskeletiProps } from './YuklemeIskeleti';
import './YuklemeIskeleti.web.css';

export function YuklemeIskeleti({
  children,
  etiket = 'Yükleniyor',
  style,
  duyur = true,
}: YuklemeIskeletiProps) {
  const [gorunur, setGorunur] = useState(false);
  useEffect(() => {
    const zamanlayici = setTimeout(() => setGorunur(true), 200);
    return () => clearTimeout(zamanlayici);
  }, []);
  return (
    <View
      accessible={duyur && gorunur}
      role={duyur ? 'progressbar' : undefined}
      aria-label={duyur ? etiket : undefined}
      aria-busy={duyur ? true : undefined}
      aria-hidden={!duyur || !gorunur}
      pointerEvents="none"
      dataSet={{ 'yukleme-iskeleti': 'true', 'iskelet-gorunur': String(gorunur) }}
      style={[style, { opacity: gorunur ? 1 : 0 }]}
    >
      {children}
    </View>
  );
}

export function IskeletParcasi({
  genislik = '100%',
  yukseklik = 16,
  yaricap = 8,
  style,
}: IskeletParcasiProps) {
  const { renk } = useTema();
  return (
    <View
      aria-hidden
      style={[
        { width: genislik, height: yukseklik, borderRadius: yaricap, backgroundColor: renk.cizgi },
        style,
      ]}
    />
  );
}
