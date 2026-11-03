import { View } from 'react-native';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';
import { alisverisParasi } from '../veri/guvenliAlisveris';

export function TutarSatiri({
  ad,
  tutar,
  vurgulu = false,
}: {
  ad: string;
  tutar: number;
  vurgulu?: boolean;
}) {
  const { renk } = useTema();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, minWidth: 0 }}>
      <Yazi
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: vurgulu ? 14 : 12,
          fontWeight: vurgulu ? '700' : '400',
          color: vurgulu ? renk.murekkep : renk.gri,
        }}
      >
        {ad}
      </Yazi>
      <Yazi style={{ flexShrink: 0, fontSize: vurgulu ? 15 : 13, fontWeight: vurgulu ? '700' : '500' }}>
        {alisverisParasi(tutar)}
      </Yazi>
    </View>
  );
}
