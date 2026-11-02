import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { usePazar } from './Pazar';
import { bosSecim, kesifSeciminiDegistir, type KesifSecimi } from '../veri/kategoriler';
import { kategoriAdresi, kategoriSeciminiOku } from '../veri/kategoriSayfalari';

export function useKesifSecimi() {
  const parametreler = useLocalSearchParams<Record<string, string | string[]>>();
  const router = useRouter();
  const { hazir } = usePazar();
  const secim = kategoriSeciminiOku(parametreler, hazir);
  const git = (sonraki: KesifSecimi) =>
    router.replace(
      kategoriAdresi(
        sonraki,
        Object.fromEntries(
          Object.entries(parametreler).filter(
            (cift): cift is [string, string] => typeof cift[1] === 'string',
          ),
        ),
      ) as Href,
    );
  const sec = (alan: keyof KesifSecimi, deger: string) => git(kesifSeciminiDegistir(secim, alan, deger));
  return { secim, sec, sifirla: () => git(bosSecim) };
}
