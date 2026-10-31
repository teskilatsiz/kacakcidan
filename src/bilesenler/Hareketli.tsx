// Reacticx Button ve FadeComponent uyarlaması.
// Copyright (c) 2026 rit3zh, Reacticx uyarlaması, MIT lisansı.
import { forwardRef, memo, useCallback, useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewInstance,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Heart from 'lucide-react-native/icons/heart';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAzaltilmisHareket } from './HareketTercihi';
import { renk } from '../tasarim/tema';

export { useAzaltilmisHareket } from './HareketTercihi';

const HareketliPressable = Animated.createAnimatedComponent(Pressable);

type HareketliBasProps = PressableProps & {
  /** Basılınca uygulanacak ölçek. Kartlarda 0.99, düğmelerde 0.97 uygundur. */
  olcek?: number;
  vurgu?: 'kategori' | 'dugme';
};

export const HareketliBas = memo(
  forwardRef<ViewInstance, HareketliBasProps>(function HareketliBas(
    {
      children,
      style,
      onPressIn,
      onPressOut,
      onHoverIn,
      onHoverOut,
      disabled,
      olcek = 0.97,
      vurgu,
      accessibilityRole = 'button',
      accessibilityState,
      ...diger
    },
    ref,
  ) {
    const azHareket = useAzaltilmisHareket();
    const olcekDegeri = useSharedValue(1);
    const [basili, basiliAyarla] = useState(false);
    const [uzerinde, uzeriniAyarla] = useState(false);
    const hareket = useAnimatedStyle(() => ({ transform: [{ scale: olcekDegeri.value }] }));
    const rol = diger.role ?? accessibilityRole;
    // React Native Web, accessibilityState nesnesini DOM'a aktarmıyor.
    const webDurumu =
      Platform.OS === 'web'
        ? {
            'aria-busy': accessibilityState?.busy,
            'aria-checked': accessibilityState?.checked,
            'aria-expanded': accessibilityState?.expanded,
            'aria-selected': rol === 'button' ? undefined : accessibilityState?.selected,
            'aria-pressed': rol === 'button' ? accessibilityState?.selected : undefined,
          }
        : undefined;

    useEffect(() => {
      if (azHareket || disabled) {
        cancelAnimation(olcekDegeri);
        olcekDegeri.value = 1;
      }
    }, [azHareket, disabled, olcekDegeri]);

    const basildi: NonNullable<PressableProps['onPressIn']> = useCallback(
      (olay) => {
        basiliAyarla(true);
        if (!disabled && !azHareket) {
          olcekDegeri.value = withTiming(olcek, { duration: 100, reduceMotion: ReduceMotion.System });
        }
        onPressIn?.(olay);
      },
      [azHareket, disabled, olcek, olcekDegeri, onPressIn],
    );

    const birakildi: NonNullable<PressableProps['onPressOut']> = useCallback(
      (olay) => {
        basiliAyarla(false);
        olcekDegeri.value = azHareket
          ? 1
          : withTiming(1, { duration: 180, reduceMotion: ReduceMotion.System });
        onPressOut?.(olay);
      },
      [azHareket, olcekDegeri, onPressOut],
    );

    return (
      <HareketliPressable
        {...webDurumu}
        {...diger}
        ref={ref}
        disabled={disabled}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        onPressIn={basildi}
        onPressOut={birakildi}
        onHoverIn={(olay) => {
          uzeriniAyarla(true);
          onHoverIn?.(olay);
        }}
        onHoverOut={(olay) => {
          uzeriniAyarla(false);
          onHoverOut?.(olay);
        }}
        style={[
          typeof style === 'function' ? style({ pressed: basili, hovered: uzerinde }) : style,
          vurgu && uzerinde && !disabled && { backgroundColor: vurgu === 'dugme' ? '#f5c51e' : renk.sari },
          hareket,
        ]}
      >
        {typeof children === 'function' ? children({ pressed: basili, hovered: uzerinde }) : children}
      </HareketliPressable>
    );
  }),
);

type GirisProps = ViewProps & { delay?: number };

/** Statik HTML görünür kalır; JS açıldığında yalnızca kısa bir geçiş uygulanır. */
export const Giris = memo(function Giris({ children, style, delay = 0, ...diger }: GirisProps) {
  const azHareket = useAzaltilmisHareket();
  const ilerleme = useSharedValue(1);

  useEffect(() => {
    if (azHareket) {
      cancelAnimation(ilerleme);
      ilerleme.value = 1;
      return;
    }
    ilerleme.value = 0;
    ilerleme.value = withDelay(
      Math.min(Math.max(delay, 0), 250),
      withTiming(1, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      }),
      ReduceMotion.System,
    );
    return () => cancelAnimation(ilerleme);
  }, [azHareket, delay, ilerleme]);

  const hareket = useAnimatedStyle(() => ({
    opacity: 0.72 + 0.28 * ilerleme.value,
    transform: [{ translateY: (1 - ilerleme.value) * 8 }],
  }));

  return (
    <Animated.View {...diger} style={[style, hareket]}>
      {children}
    </Animated.View>
  );
});

type FavoriDugmesiProps = {
  secili: boolean;
  onPress: NonNullable<PressableProps['onPress']>;
  kucuk?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export const FavoriDugmesi = memo(function FavoriDugmesi({
  secili,
  onPress,
  kucuk = false,
  style,
  accessibilityLabel,
}: FavoriDugmesiProps) {
  const azHareket = useAzaltilmisHareket();
  const olcek = useSharedValue(1);
  const hareket = useAnimatedStyle(() => ({ transform: [{ scale: olcek.value }] }));

  useEffect(() => {
    if (azHareket) {
      cancelAnimation(olcek);
      olcek.value = 1;
    }
  }, [azHareket, olcek]);

  const favoriyiDegistir: NonNullable<PressableProps['onPress']> = (olay) => {
    olay.stopPropagation();
    if (!azHareket) {
      olcek.value = withSequence(
        withTiming(1.16, { duration: 100, reduceMotion: ReduceMotion.System }),
        withTiming(1, { duration: 160, reduceMotion: ReduceMotion.System }),
      );
    }
    onPress(olay);
  };

  return (
    <HareketliBas
      onPress={favoriyiDegistir}
      accessibilityLabel={accessibilityLabel ?? (secili ? 'Favorilerden çıkar' : 'Favorilere ekle')}
      accessibilityState={{ selected: secili }}
      aria-pressed={Platform.OS === 'web' ? secili : undefined}
      hitSlop={4}
      olcek={0.94}
      style={[stiller.favori, kucuk && stiller.kucukFavori, secili && stiller.seciliFavori, style]}
    >
      <Animated.View style={hareket} pointerEvents="none">
        <Heart size={kucuk ? 18 : 20} color="#101113" fill={secili ? '#101113' : 'none'} strokeWidth={1.8} />
      </Animated.View>
    </HareketliBas>
  );
});

const stiller = StyleSheet.create({
  favori: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kucukFavori: { width: 36, height: 36, borderRadius: 18 },
  seciliFavori: { backgroundColor: '#ffd02b' },
});
