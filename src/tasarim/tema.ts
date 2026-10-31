import { useSyncExternalStore } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';

export const renk = {
  murekkep: '#17191b',
  sari: '#ffd12f',
  sariSoluk: '#fff7d9',
  zemin: '#f7f7f7',
  cizgi: '#e5e5e5',
  gri: '#737373',
  acik: '#fafafa',
  beyaz: '#ffffff',
};
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
function ekraniIzle(guncelle: () => void) {
  const abonelik = Dimensions.addEventListener('change', guncelle);
  return () => abonelik.remove();
}
export function useEkran() {
  const { width, height } = useSyncExternalStore(ekraniIzle, anlikEkran, sunucuEkrani);
  const genislik = width || 1440;
  return {
    genislik,
    yukseklik: height,
    mobil: genislik < 700,
    dar: genislik < 1100,
    tablet: genislik < 960,
    bosluk: genislik < 700 ? 20 : genislik < 1100 ? 28 : 48,
  };
}
