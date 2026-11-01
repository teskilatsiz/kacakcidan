import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import { Alan, Pencere, Yazi } from './Temel';
import { HareketliBas } from './Hareketli';
import { kalin, useTema, temaStilleri } from '../tasarim/tema';

export type SecimAlaniProps = {
  etiket: string;
  deger: string;
  secenekler: readonly { id: string; ad: string }[];
  degistir: (deger: string) => void;
  ipucu?: string;
  hata?: string;
  disabled?: boolean;
  gerekli?: boolean;
};

export function SecimAlani({
  etiket,
  deger,
  secenekler,
  degistir,
  ipucu = 'Seç',
  hata,
  disabled = false,
  gerekli = false,
}: SecimAlaniProps) {
  const { renk } = useTema();
  const s = useStiller();

  const [acik, setAcik] = useState(false);
  const [arama, setArama] = useState('');
  const secili = secenekler.find((s) => s.id === deger);
  const sonuc = useMemo(() => {
    const sorgu = arama.trim().toLocaleLowerCase('tr-TR');
    return secenekler.filter((s) => s.ad.toLocaleLowerCase('tr-TR').includes(sorgu));
  }, [arama, secenekler]);
  function sec(id: string) {
    degistir(id);
    setAcik(false);
    setArama('');
  }
  return (
    <View style={{ gap: 8, minWidth: 0 }}>
      <Yazi style={s.etiket}>
        {etiket}
        {gerekli ? ' *' : ''}
      </Yazi>
      <HareketliBas
        accessibilityRole="button"
        accessibilityLabel={`${etiket}: ${secili?.ad ?? ipucu}`}
        accessibilityHint="Seçenekleri açar"
        accessibilityState={{ disabled, expanded: acik }}
        disabled={disabled}
        onPress={() => setAcik(true)}
        style={[s.kutu, hata ? { borderColor: renk.hataCizgi } : {}, disabled && { opacity: 0.45 }]}
      >
        <Yazi numberOfLines={1} style={{ flex: 1, color: secili ? renk.murekkep : renk.gri }}>
          {secili?.ad ?? ipucu}
        </Yazi>
        <ChevronDown size={18} color={renk.gri} />
      </HareketliBas>
      {!!hata && (
        <Yazi accessibilityRole="alert" style={s.hata}>
          {hata}
        </Yazi>
      )}
      <Pencere
        acik={acik}
        baslik={etiket}
        kapat={() => {
          setAcik(false);
          setArama('');
        }}
      >
        {secenekler.length > 10 ? (
          <Alan
            accessibilityLabel={`${etiket} seçeneklerinde ara`}
            placeholder="Seçeneklerde ara"
            value={arama}
            onChangeText={setArama}
            autoCorrect={false}
          />
        ) : null}
        <View accessibilityRole="radiogroup" style={{ gap: 2 }}>
          {!gerekli ? (
            <HareketliBas
              accessibilityRole="radio"
              accessibilityState={{ checked: !deger }}
              onPress={() => sec('')}
              style={s.satir}
            >
              <Yazi style={{ flex: 1, color: renk.gri }}>{ipucu}</Yazi>
              {!deger ? <Check color={renk.murekkep} size={18} /> : null}
            </HareketliBas>
          ) : null}
          {sonuc.map((secenek) => (
            <HareketliBas
              key={secenek.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: deger === secenek.id }}
              onPress={() => sec(secenek.id)}
              style={[s.satir, deger === secenek.id && { backgroundColor: renk.sariSoluk }]}
            >
              <Yazi style={{ flex: 1, fontWeight: deger === secenek.id ? '700' : '400' }}>{secenek.ad}</Yazi>
              {deger === secenek.id ? <Check color={renk.murekkep} size={18} /> : null}
            </HareketliBas>
          ))}
          {!sonuc.length ? (
            <Yazi style={{ padding: 12, color: renk.gri }}>Bu aramayla eşleşen seçenek yok.</Yazi>
          ) : null}
        </View>
      </Pencere>
    </View>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    etiket: { fontFamily: kalin, fontWeight: '700', fontSize: 13 },
    kutu: {
      minHeight: 50,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: renk.beyaz,
    },
    satir: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 12,
      borderRadius: 8,
    },
    hata: { color: renk.hata, fontSize: 12 },
  }),
);
