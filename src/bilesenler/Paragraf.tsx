import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { font, useTema } from '../tasarim/tema';

export function Paragraf({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { renk } = useTema();

  return (
    <Text style={[{ fontFamily: font, fontSize: 14, lineHeight: 22, color: renk.murekkep }, style]}>
      {children}
    </Text>
  );
}
