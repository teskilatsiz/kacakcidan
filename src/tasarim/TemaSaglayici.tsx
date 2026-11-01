import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { acikRenkler, koyuRenkler, renk, TEMA_ANAHTARI, TemaBaglami, type TemaTercihi } from './tema';

function tercihMi(deger: unknown): deger is TemaTercihi {
  return deger === 'sistem' || deger === 'acik' || deger === 'koyu';
}
const sistemTemasiniOku = () => Appearance.getColorScheme() ?? 'light';
const sunucuTemasi = () => 'light' as const;
function sistemTemasiniIzle(guncelle: () => void) {
  const abonelik = Appearance.addChangeListener(guncelle);
  return () => abonelik.remove();
}

export function TemaSaglayici({ children }: { children: ReactNode }) {
  const sistem = useSyncExternalStore(sistemTemasiniIzle, sistemTemasiniOku, sunucuTemasi);
  const [tercih, setTercih] = useState<TemaTercihi>('sistem');
  const kullaniciSecti = useRef(false);
  const koyu = tercih === 'koyu' || (tercih === 'sistem' && sistem === 'dark');

  useEffect(() => {
    let etkin = true;
    if (Platform.OS === 'web') {
      try {
        const kayit = localStorage.getItem(TEMA_ANAHTARI);
        if (tercihMi(kayit)) setTercih(kayit);
      } catch {
        /* Depolama kapalıyken sistem tercihi kullanılabilir. */
      }
      const digerSekme = (olay: StorageEvent) => {
        if (olay.key === TEMA_ANAHTARI) setTercih(tercihMi(olay.newValue) ? olay.newValue : 'sistem');
      };
      window.addEventListener('storage', digerSekme);
      return () => window.removeEventListener('storage', digerSekme);
    }
    void AsyncStorage.getItem(TEMA_ANAHTARI)
      .then((kayit) => {
        if (etkin && !kullaniciSecti.current && tercihMi(kayit)) setTercih(kayit);
      })
      .catch(() => {});
    return () => {
      etkin = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.dataset.tema = koyu ? 'koyu' : 'acik';
      document.documentElement.style.colorScheme = koyu ? 'dark' : 'light';
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', koyu ? koyuRenkler.zemin : acikRenkler.beyaz);
    } else {
      Appearance.setColorScheme(tercih === 'sistem' ? 'auto' : koyu ? 'dark' : 'light');
      void SystemUI.setBackgroundColorAsync(koyu ? koyuRenkler.zemin : acikRenkler.beyaz);
    }
  }, [koyu, tercih]);

  const temaSec = useCallback((yeni: TemaTercihi) => {
    kullaniciSecti.current = true;
    setTercih(yeni);
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(TEMA_ANAHTARI, yeni);
      } catch {
        /* Tercih bu sekmede geçerli kalır. */
      }
    } else {
      void AsyncStorage.setItem(TEMA_ANAHTARI, yeni).catch(() => {});
    }
  }, []);

  const deger = useMemo(
    () => ({
      renk: Platform.OS === 'web' ? renk : koyu ? koyuRenkler : acikRenkler,
      koyu,
      tercih,
      temaSec,
    }),
    [koyu, tercih, temaSec],
  );
  return <TemaBaglami value={deger}>{children}</TemaBaglami>;
}
