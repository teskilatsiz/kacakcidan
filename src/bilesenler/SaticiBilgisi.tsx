import { StyleSheet, View } from 'react-native';
import Star from 'lucide-react-native/icons/star';
import UserRound from 'lucide-react-native/icons/user-round';
import { Gorsel } from './Gorsel';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import type { SaticiProfili } from '../veri/saticilar';

export function SaticiResmi({
  satici,
  boyut = 48,
}: {
  satici: Pick<SaticiProfili, 'ad' | 'fotograf'>;
  boyut?: number;
}) {
  const { renk } = useTema();
  return (
    <View
      style={{
        width: boyut,
        height: boyut,
        borderRadius: boyut / 2,
        backgroundColor: renk.sari,
        overflow: 'hidden',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {satici.fotograf ? (
        <Gorsel
          source={gorselKaynagi(satici.fotograf)}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessibilityLabel={`${satici.ad} profil fotoğrafı`}
        />
      ) : (
        <UserRound size={boyut * 0.44} color={renk.vurguYazi} strokeWidth={1.7} />
      )}
    </View>
  );
}

export function SaticiPuani({ satici }: { satici: Pick<SaticiProfili, 'puan' | 'degerlendirmeSayisi'> }) {
  const { renk } = useTema();
  if (satici.puan === undefined || !satici.degerlendirmeSayisi)
    return <Yazi style={{ color: renk.gri, fontSize: 12 }}>Henüz değerlendirme yok</Yazi>;
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}
      accessibilityLabel={`${satici.puan.toLocaleString('tr-TR')} puan, ${satici.degerlendirmeSayisi} değerlendirme`}
    >
      <Star size={14} fill={renk.sari} color={renk.murekkep} strokeWidth={1.5} />
      <Yazi style={{ fontWeight: '700', fontSize: 13 }}>
        {satici.puan.toLocaleString('tr-TR', { minimumFractionDigits: 1 })}
      </Yazi>
      <Yazi style={{ color: renk.gri, fontSize: 12 }}>({satici.degerlendirmeSayisi} değerlendirme)</Yazi>
    </View>
  );
}
