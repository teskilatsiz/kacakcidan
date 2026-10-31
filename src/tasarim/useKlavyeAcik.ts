import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKlavyeAcik() {
  const [acik, setAcik] = useState(() => Keyboard.isVisible());
  useEffect(() => {
    const gorundu = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () =>
      setAcik(true),
    );
    const kapandi = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setAcik(false),
    );
    return () => {
      gorundu.remove();
      kapandi.remove();
    };
  }, []);
  return acik;
}
