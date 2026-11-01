import { useEffect, useState, type ReactNode } from 'react';
import { View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAzaltilmisHareket } from './HareketTercihi';
import { useTema } from '../tasarim/tema';

export type YuklemeIskeletiProps = {
  children: ReactNode;
  etiket?: string;
  style?: StyleProp<ViewStyle>;
  duyur?: boolean;
};
export type IskeletParcasiProps = {
  genislik?: DimensionValue;
  yukseklik?: DimensionValue;
  yaricap?: number;
  style?: StyleProp<ViewStyle>;
};

/** Hızlı yüklemelerde yanıp sönmez; ayrılan alan gerçek içerik gelir gelmez bırakılır. */
export function YuklemeIskeleti({
  children,
  etiket = 'Yükleniyor',
  style,
  duyur = true,
}: YuklemeIskeletiProps) {
  const [gorunur, setGorunur] = useState(false);
  const azHareket = useAzaltilmisHareket();
  const saydamlik = useSharedValue(0);
  useEffect(() => {
    const zamanlayici = setTimeout(() => setGorunur(true), 200);
    return () => clearTimeout(zamanlayici);
  }, []);
  useEffect(() => {
    cancelAnimation(saydamlik);
    if (!gorunur) saydamlik.value = 0;
    else if (azHareket) saydamlik.value = 1;
    else {
      saydamlik.value = 0.5;
      saydamlik.value = withRepeat(
        withTiming(1, { duration: 900, reduceMotion: ReduceMotion.System }),
        -1,
        true,
        undefined,
        ReduceMotion.System,
      );
    }
    return () => cancelAnimation(saydamlik);
  }, [azHareket, gorunur, saydamlik]);
  const hareket = useAnimatedStyle(() => ({ opacity: saydamlik.value }));
  return (
    <Animated.View
      accessible={duyur && gorunur}
      accessibilityRole={duyur ? 'progressbar' : undefined}
      accessibilityLabel={duyur ? etiket : undefined}
      accessibilityState={duyur ? { busy: true } : undefined}
      accessibilityElementsHidden={!duyur || !gorunur}
      importantForAccessibility={duyur && gorunur ? 'yes' : 'no-hide-descendants'}
      aria-hidden={!duyur || !gorunur}
      pointerEvents="none"
      dataSet={{ 'yukleme-iskeleti': 'true', 'iskelet-gorunur': String(gorunur) }}
      style={[style, hareket]}
    >
      {children}
    </Animated.View>
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
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={[
        { width: genislik, height: yukseklik, borderRadius: yaricap, backgroundColor: renk.cizgi },
        style,
      ]}
    />
  );
}
