import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTema } from '../tasarim/tema';
import { useAzaltilmisHareket } from './HareketTercihi';

export function KayitIlerlemesi({ adim }: { adim: 1 | 2 }) {
  const { renk } = useTema();
  const azHareket = useAzaltilmisHareket();
  const ilerleme = useSharedValue(adim / 2);

  useEffect(() => {
    cancelAnimation(ilerleme);
    ilerleme.value = azHareket
      ? adim / 2
      : withTiming(adim / 2, { duration: 220, reduceMotion: ReduceMotion.System });
    return () => cancelAnimation(ilerleme);
  }, [adim, azHareket, ilerleme]);

  const hareket = useAnimatedStyle(() => ({ transform: [{ scaleX: ilerleme.value }] }));

  return (
    <Animated.View
      style={[
        { height: 3, width: '100%', backgroundColor: renk.sari, transformOrigin: 'left center' },
        hareket,
      ]}
    />
  );
}
