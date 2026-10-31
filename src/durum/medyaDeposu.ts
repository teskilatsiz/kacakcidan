import type { ImagePickerAsset } from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const boyutAnahtari = (kaynak: string) => `kacakcidan:medya-boyutu:${kaynak}`;

export async function medyaKaydet(medya: ImagePickerAsset): Promise<string> {
  if (medya.fileSize) await AsyncStorage.setItem(boyutAnahtari(medya.uri), String(medya.fileSize));
  return medya.uri;
}
export async function medyaSil(kaynak: string): Promise<void> {
  await AsyncStorage.removeItem(boyutAnahtari(kaynak));
}
export async function medyaBoyutlariniOku(kaynaklar: string[]): Promise<Record<string, number>> {
  if (!kaynaklar.length) return {};
  const kayitlar = await AsyncStorage.multiGet(kaynaklar.map(boyutAnahtari));
  return Object.fromEntries(
    kayitlar.flatMap(([, boyut], sira) => (Number(boyut) > 0 ? [[kaynaklar[sira]!, Number(boyut)]] : [])),
  );
}
export function useMedyaAdresi(kaynak: string | undefined): string | undefined {
  return kaynak;
}
export function medyaOnizlemesiniBirak(_kaynak: string) {}
