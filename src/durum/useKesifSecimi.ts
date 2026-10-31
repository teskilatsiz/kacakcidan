import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePazar } from './Pazar';
import { bosSecim, kesifSeciminiDegistir, type KesifSecimi } from '../veri/kategoriler';

export function useKesifSecimi() {
  const parametreler = useLocalSearchParams<Record<keyof KesifSecimi, string>>();
  const router = useRouter();
  const { hazir } = usePazar();
  const oku = (alan: keyof KesifSecimi) =>
    hazir && typeof parametreler[alan] === 'string' ? parametreler[alan] : '';
  const secim: KesifSecimi = {
    kategori: oku('kategori'),
    altKategori: oku('altKategori'),
    marka: oku('marka'),
    model: oku('model'),
  };
  const sec = (alan: keyof KesifSecimi, deger: string) =>
    router.setParams(kesifSeciminiDegistir(secim, alan, deger));
  return { secim, sec, sifirla: () => router.setParams(bosSecim) };
}
