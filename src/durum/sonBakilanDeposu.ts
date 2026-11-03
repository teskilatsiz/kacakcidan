import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import type { GezintiKaydi } from '../veri/ilanKarsilastirma';

export const GEZINTI_TEMIZLENDI = 'kacakcidan:gezinti-temizlendi';
export const gezintiBellegi = new Map<string, GezintiKaydi[]>();
let yazma: Promise<unknown> = Promise.resolve();

/** Temizleme, daha önce başlamış bir yazmanın ardından tamamlanır. */
export function gezintiyiSirala<T>(islem: () => Promise<T>): Promise<T> {
  const siradaki = yazma.catch(() => undefined).then(islem);
  yazma = siradaki;
  return siradaki;
}

export function sonBakilanlariTemizle() {
  return gezintiyiSirala(async () => {
    const anahtarlar = (await AsyncStorage.getAllKeys()).filter((anahtar) =>
      anahtar.startsWith('kacakcidan:gezinti:v1:'),
    );
    if (anahtarlar.length) await AsyncStorage.multiRemove(anahtarlar);
    gezintiBellegi.clear();
    DeviceEventEmitter.emit(GEZINTI_TEMIZLENDI);
  });
}
