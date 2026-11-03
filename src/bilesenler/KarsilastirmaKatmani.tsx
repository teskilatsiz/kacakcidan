import type { ReactNode } from 'react';
import { AppState, Keyboard, TextInput } from 'react-native';

export function karsilastirmaOnerisiAcilebilir() {
  return (
    AppState.currentState === 'active' && !Keyboard.isVisible() && !TextInput.State.currentlyFocusedInput()
  );
}

export function KarsilastirmaKatmani({ children }: { children: ReactNode; sabit: boolean }) {
  return <>{children}</>;
}
