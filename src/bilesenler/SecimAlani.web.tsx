import { useMemo, useState, type KeyboardEvent } from 'react';
import { StyleSheet, View } from 'react-native';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import type { SecimAlaniProps } from './SecimAlani';
import { Alan, Pencere, Yazi } from './Temel';
import { HareketliBas } from './Hareketli';
import { kalin, useTema, temaStilleri } from '../tasarim/tema';

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
  const secili = secenekler.find((secenek) => secenek.id === deger);
  const sonuc = useMemo(() => {
    const sorgu = arama.trim().toLocaleLowerCase('tr-TR');
    return secenekler.filter((secenek) => secenek.ad.toLocaleLowerCase('tr-TR').includes(sorgu));
  }, [arama, secenekler]);
  const sekmeHedefi =
    deger && sonuc.some((secenek) => secenek.id === deger) ? deger : gerekli ? sonuc[0]?.id : '';

  function klavyeGezintisi(olay: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(olay.key)) return;
    const etkin =
      olay.target instanceof HTMLElement ? olay.target.closest<HTMLElement>('[role="radio"]') : null;
    const secenekOgeleri = Array.from(olay.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]'));
    const mevcut = secenekOgeleri.indexOf(etkin as HTMLElement);
    if (mevcut < 0 || !secenekOgeleri.length) return;

    olay.preventDefault();
    const son = secenekOgeleri.length - 1;
    const sonraki =
      olay.key === 'Home'
        ? 0
        : olay.key === 'End'
          ? son
          : (mevcut +
              (olay.key === 'ArrowDown' || olay.key === 'ArrowRight' ? 1 : -1) +
              secenekOgeleri.length) %
            secenekOgeleri.length;
    const hedef = secenekOgeleri[sonraki];
    hedef?.focus();
    const sonrakiDeger = hedef?.dataset.secimDegeri;
    if (sonrakiDeger !== undefined) degistir(sonrakiDeger);
  }

  function sec(id: string) {
    degistir(id);
    setAcik(false);
    setArama('');
  }

  function kapat() {
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
        dataSet={{ 'secim-alani': 'true' }}
        accessibilityRole="button"
        accessibilityLabel={`${etiket}: ${secili?.ad ?? ipucu}`}
        accessibilityHint="Seçenekleri açar"
        accessibilityState={{ disabled, expanded: acik }}
        disabled={disabled}
        onPress={() => setAcik(true)}
        style={[s.kutu, hata ? s.hataSiniri : null, disabled && s.devreDisi]}
      >
        <Yazi numberOfLines={1} style={{ flex: 1, color: secili ? renk.murekkep : renk.gri }}>
          {secili?.ad ?? ipucu}
        </Yazi>
        <ChevronDown size={18} color={renk.gri} />
      </HareketliBas>
      {hata ? (
        <Yazi accessibilityRole="alert" style={s.hata}>
          {hata}
        </Yazi>
      ) : null}

      <Pencere acik={acik} baslik={etiket} kapat={kapat}>
        {secenekler.length > 10 ? (
          <Alan
            accessibilityLabel={`${etiket} seçeneklerinde ara`}
            placeholder="Seçeneklerde ara"
            value={arama}
            onChangeText={setArama}
            autoCorrect={false}
            autoComplete="off"
          />
        ) : null}
        <div
          role="radiogroup"
          aria-label={`${etiket} seçenekleri`}
          onKeyDown={klavyeGezintisi}
          style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {!gerekli ? (
            <HareketliBas
              accessibilityRole="radio"
              accessibilityLabel={ipucu}
              accessibilityState={{ checked: !deger }}
              dataSet={{ 'secim-degeri': '' }}
              tabIndex={sekmeHedefi === '' ? 0 : -1}
              onPress={() => sec('')}
              style={s.satir}
            >
              <Yazi style={{ flex: 1, color: renk.gri }}>{ipucu}</Yazi>
              {!deger ? <Check size={18} color={renk.murekkep} /> : null}
            </HareketliBas>
          ) : null}
          {sonuc.map((secenek) => {
            const seciliMi = deger === secenek.id;
            return (
              <HareketliBas
                key={secenek.id}
                accessibilityRole="radio"
                accessibilityLabel={secenek.ad}
                accessibilityState={{ checked: seciliMi }}
                dataSet={{ 'secim-degeri': secenek.id }}
                tabIndex={secenek.id === sekmeHedefi ? 0 : -1}
                onPress={() => sec(secenek.id)}
                style={[s.satir, seciliMi && s.seciliSatir]}
              >
                <Yazi style={{ flex: 1, fontWeight: seciliMi ? '700' : '400' }}>{secenek.ad}</Yazi>
                {seciliMi ? <Check size={18} color={renk.murekkep} /> : null}
              </HareketliBas>
            );
          })}
          {!sonuc.length ? <Yazi style={s.bosSonuc}>Bu aramayla eşleşen seçenek yok.</Yazi> : null}
        </div>
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
    hataSiniri: { borderColor: renk.hataCizgi },
    devreDisi: { opacity: 0.45 },
    liste: { gap: 2 },
    satir: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 12,
      borderRadius: 8,
    },
    seciliSatir: { backgroundColor: renk.sariSoluk },
    hata: { color: renk.hata, fontSize: 12 },
    bosSonuc: { padding: 12, color: renk.gri },
  }),
);
