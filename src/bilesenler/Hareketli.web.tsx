import { useTema, temaStilleri } from '../tasarim/tema';
// Reacticx uyarlamalarının tarayıcı sürümü.
// Copyright (c) 2026 rit3zh, Reacticx uyarlaması, MIT lisansı.
import { forwardRef, memo, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewInstance,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Heart from 'lucide-react-native/icons/heart';
import { useAzaltilmisHareket } from './HareketTercihi';
import '../tasarim/hareket.web.css';

export { useAzaltilmisHareket } from './HareketTercihi';

type HareketliBasProps = PressableProps & {
  olcek?: number;
  vurgu?: 'kategori' | 'dugme';
};

export const HareketliBas = memo(
  forwardRef<ViewInstance, HareketliBasProps>(function HareketliBas(
    {
      children,
      style,
      disabled,
      olcek = 0.97,
      vurgu,
      accessibilityRole = 'button',
      accessibilityState,
      dataSet,
      ...diger
    },
    ref,
  ) {
    const s = useStiller();

    const azHareket = useAzaltilmisHareket();
    const rol = diger.role ?? accessibilityRole;
    const webDurumu = {
      'aria-busy': accessibilityState?.busy,
      'aria-checked': accessibilityState?.checked,
      'aria-expanded': accessibilityState?.expanded,
      'aria-selected': rol === 'button' ? undefined : accessibilityState?.selected,
      'aria-pressed': rol === 'button' ? accessibilityState?.selected : undefined,
    };

    return (
      <Pressable
        {...webDurumu}
        {...diger}
        ref={ref}
        disabled={disabled}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        dataSet={{ ...dataSet, 'hareketli-bas': 'true', ...(vurgu ? { vurgu } : {}) }}
        style={(durum) => [
          typeof style === 'function' ? style(durum) : style,
          {
            transform: [
              { translateY: durum.hovered && vurgu === 'kategori' && !disabled && !azHareket ? -2 : 0 },
              {
                scale:
                  disabled || azHareket
                    ? 1
                    : durum.pressed
                      ? olcek
                      : durum.hovered && vurgu === 'dugme'
                        ? 1.02
                        : 1,
              },
            ],
          },
          azHareket ? s.durgun : durum.pressed ? s.basma : s.birakma,
        ]}
      >
        {children}
      </Pressable>
    );
  }),
);

type GirisProps = ViewProps & { delay?: number };

export const Giris = memo(function Giris({ children, style, delay = 0, dataSet, ...diger }: GirisProps) {
  return (
    <View
      {...diger}
      dataSet={{ ...dataSet, 'hareket-giris': 'true' }}
      style={[style, { animationDelay: `${Math.min(Math.max(delay, 0), 250)}ms` }]}
    >
      {children}
    </View>
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
  const { renk } = useTema();
  const s = useStiller();

  const azHareket = useAzaltilmisHareket();
  const [nabiz, setNabiz] = useState(0);

  useEffect(() => {
    if (azHareket) setNabiz(0);
  }, [azHareket]);

  const favoriyiDegistir: NonNullable<PressableProps['onPress']> = (olay) => {
    olay.stopPropagation();
    if (!azHareket) setNabiz((eski) => eski + 1);
    onPress(olay);
  };

  return (
    <HareketliBas
      onPress={favoriyiDegistir}
      accessibilityLabel={accessibilityLabel ?? (secili ? 'Favorilerden çıkar' : 'Favorilere ekle')}
      accessibilityState={{ selected: secili }}
      aria-pressed={secili}
      hitSlop={4}
      olcek={0.94}
      style={[s.favori, kucuk && s.kucukFavori, secili && s.seciliFavori, style]}
    >
      <View key={nabiz} dataSet={{ 'favori-nabiz': nabiz > 0 ? 'true' : 'false' }} pointerEvents="none">
        <Heart
          size={kucuk ? 18 : 20}
          color={secili ? renk.vurguYazi : renk.murekkep}
          fill={secili ? renk.vurguYazi : 'none'}
          strokeWidth={1.8}
        />
      </View>
    </HareketliBas>
  );
});

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    basma: {
      transitionProperty: 'transform, background-color, border-color, box-shadow',
      transitionDuration: '100ms',
      transitionTimingFunction: 'ease-out',
    },
    birakma: {
      transitionProperty: 'transform, background-color, border-color, box-shadow',
      transitionDuration: '180ms',
      transitionTimingFunction: 'ease-out',
    },
    durgun: { transitionProperty: 'none' },
    favori: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: renk.beyaz,
      justifyContent: 'center',
      alignItems: 'center',
    },
    kucukFavori: { width: 36, height: 36, borderRadius: 18 },
    seciliFavori: { backgroundColor: renk.sari },
  }),
);
