import type { CSSProperties, ReactNode } from 'react';
import { StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { font, useTema } from '../tasarim/tema';

export function Paragraf({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { renk } = useTema();

  const bicim = StyleSheet.flatten([
    { fontFamily: font, fontSize: 14, lineHeight: 22, color: renk.murekkep },
    style,
  ]) as CSSProperties;

  return (
    <p
      style={{
        margin: 0,
        ...bicim,
        lineHeight: typeof bicim.lineHeight === 'number' ? `${bicim.lineHeight}px` : bicim.lineHeight,
      }}
    >
      {children}
    </p>
  );
}
