import { DeviceEventEmitter, Keyboard, Platform } from 'react-native';

export const SAYFA_BASINA_DON = 'kacakcidan:sayfa-basina-don';

/** Aynı alt sekme yeniden seçilse de görünümün başlangıcına dönülür. */
export function sayfaBasinaDon() {
  Keyboard.dismiss();
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  }
  DeviceEventEmitter.emit(SAYFA_BASINA_DON);
}
