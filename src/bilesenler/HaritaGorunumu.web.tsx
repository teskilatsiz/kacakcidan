import { useMemo } from 'react';
import { useTema } from '../tasarim/tema';
import { haritaAdresi } from '../veri/haritaAdresi';
import type { HaritaGorunumuProps } from './HaritaGorunumu.types';

export function HaritaGorunumu({ konum, baslik, yukseklik }: HaritaGorunumuProps) {
  const { koyu } = useTema();
  const adres = useMemo(() => haritaAdresi(konum, koyu), [konum, koyu]);
  return (
    <iframe
      title={baslik}
      src={adres}
      loading="eager"
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ width: '100%', height: yukseklik, display: 'block', border: 0, borderRadius: 8 }}
    />
  );
}
