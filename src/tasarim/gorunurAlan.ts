import { useEkran } from './tema';

export type GorunurAlan = {
  yukseklik: number;
  genislik: number;
  ust: number;
  sol: number;
  alt: number;
  sag: number;
};

export function useGorunurAlan(_etkin = true): GorunurAlan {
  const { yukseklik, genislik } = useEkran();
  return { yukseklik, genislik, ust: 0, sol: 0, alt: 0, sag: 0 };
}
