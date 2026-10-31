import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { font, renk } from '../tasarim/tema';

export function Paragraf({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <Text style={[{ fontFamily: font, fontSize: 14, lineHeight: 22, color: renk.murekkep }, style]}>
      {children}
    </Text>
  );
}
