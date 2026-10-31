import { useContext } from 'react';
import { PazarBaglami } from './PazarBaglami';

export type { Mesaj, Profil } from './PazarBaglami';

export const kisiler = [
  {
    id: 'mert',
    ad: 'Mert K.',
    harf: 'MK',
    ilanId: 'iphone-15-pro',
    son: 'Kadıköy’de buluşabiliriz.',
    saat: '14.32',
    renk: '#e9e6da',
  },
  {
    id: 'ayse',
    ad: 'Ayşe Y.',
    harf: 'AY',
    ilanId: 'fujifilm-x100v',
    son: 'Evet, makine hâlâ satılık.',
    saat: '13.48',
    renk: '#e9e1da',
  },
  {
    id: 'berk',
    ad: 'Berk A.',
    harf: 'BA',
    ilanId: 'playstation-5',
    son: 'Kutusu ve faturası mevcut.',
    saat: 'Dün',
    renk: '#dfe6df',
  },
];

export function usePazar() {
  const deger = useContext(PazarBaglami);
  if (!deger) throw new Error('usePazar, PazarSaglayici içinde kullanılmalı.');
  return deger;
}
