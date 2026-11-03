import { createContext, useContext, useSyncExternalStore } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';

import { acikRenkler, type Renkler } from './palet';
export { acikRenkler, koyuRenkler, type Renkler } from './palet';

const webRenkler = Object.fromEntries(
  Object.keys(acikRenkler).map((ad) => [ad, `var(--renk-${ad})`]),
) as Renkler;
export const renk = Platform.OS === 'web' ? webRenkler : acikRenkler;
export type TemaTercihi = 'sistem' | 'acik' | 'koyu';
export const TEMA_ANAHTARI = 'kacakcidan-gorunum';
export const TemaBaglami = createContext({
  renk,
  koyu: false,
  tercih: 'sistem' as TemaTercihi,
  temaSec: (_tercih: TemaTercihi) => {},
});
export const useTema = () => useContext(TemaBaglami);

/** Web stilleri modül yüklenirken, native stiller palet başına bir kez oluşturulur. */
export function temaStilleri<T>(olustur: (renkler: Renkler) => T) {
  const onbellek = new WeakMap<Renkler, T>();
  // RN Web, atomik kuralları StyleSheet.create çağrısında kaydeder. Expo'nun
  // ilk HTML başlığı alınmadan hazır olmaları gerekir; renkler CSS değişkenidir.
  if (Platform.OS === 'web') onbellek.set(renk, olustur(renk));
  return function useTemaStilleri(): T {
    const { renk: palet } = useTema();
    if (!onbellek.has(palet)) onbellek.set(palet, olustur(palet));
    return onbellek.get(palet)!;
  };
}
export const font = Platform.OS === 'web' ? 'DM Sans' : 'DMSans_400Regular';
export const kalin = Platform.OS === 'web' ? 'DM Sans' : 'DMSans_700Bold';
export const mobilAltMenuYuksekligi = 64;
export const ortak = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aralikli: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  alan: { width: '100%', maxWidth: 1440, alignSelf: 'center', paddingHorizontal: 48 },
  kart: { backgroundColor: renk.beyaz, borderWidth: 1, borderColor: renk.cizgi, borderRadius: 16 },
});
const sunucuOlcusu = { width: 1440, height: 900, scale: 1, fontScale: 1 };
const sunucuEkrani = () => sunucuOlcusu;
const anlikEkran = () => Dimensions.get('window');
const dokunmatikSorgusu =
  Platform.OS === 'web' && typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)') : null;
const dokunmatikEkran = () => dokunmatikSorgusu?.matches ?? false;
const sunucuDokunmatigi = () => false;
function dokunmatigiIzle(guncelle: () => void) {
  dokunmatikSorgusu?.addEventListener('change', guncelle);
  return () => dokunmatikSorgusu?.removeEventListener('change', guncelle);
}
function ekraniIzle(guncelle: () => void) {
  const abonelik = Dimensions.addEventListener('change', guncelle);
  return () => abonelik.remove();
}
export function useEkran() {
  const { width, height } = useSyncExternalStore(ekraniIzle, anlikEkran, sunucuEkrani);
  const dokunmatik = useSyncExternalStore(dokunmatigiIzle, dokunmatikEkran, sunucuDokunmatigi);
  const genislik = width || 1440;
  const kompakt =
    genislik < 1100 ||
    (Platform.OS === 'web' ? dokunmatik && genislik < 1440 : Math.min(genislik, height) < 1100);
  return {
    genislik,
    yukseklik: height,
    mobil: genislik < 700,
    kompakt,
    dar: genislik < 1100,
    tablet: genislik < 960,
    bosluk: genislik < 700 ? 20 : kompakt ? 28 : 48,
  };
}
