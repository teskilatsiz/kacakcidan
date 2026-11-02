import { View } from 'react-native';
import { useTema } from '../tasarim/tema';
import { useAzaltilmisHareket } from './HareketTercihi';

export function KayitIlerlemesi({ adim }: { adim: 1 | 2 }) {
  const { renk } = useTema();
  const azHareket = useAzaltilmisHareket();

  return (
    <View
      style={{
        height: 3,
        width: '100%',
        backgroundColor: renk.sari,
        transformOrigin: 'left center',
        transform: [{ scaleX: adim / 2 }],
        transitionProperty: 'transform',
        transitionDuration: azHareket ? '0ms' : '220ms',
        transitionTimingFunction: 'ease-out',
      }}
    />
  );
}
