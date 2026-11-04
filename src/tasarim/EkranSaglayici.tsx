import { startTransition, useEffect, useState, type ReactNode } from 'react';
import { Dimensions, Platform } from 'react-native';
import { EkranBaglami } from './tema';

function ilkOlcu() {
  // İlk web çizimi, statik HTML ile aynı kalır. Görsel yerleşimi CSS belirler.
  if (Platform.OS === 'web') return { width: 1440, height: 900, dokunmatik: false };
  const { width, height } = Dimensions.get('window');
  return { width, height, dokunmatik: true };
}

export function EkranSaglayici({ children }: { children: ReactNode }) {
  const [olcu, setOlcu] = useState(ilkOlcu);

  useEffect(() => {
    const sorgu = Platform.OS === 'web' ? window.matchMedia('(pointer: coarse)') : undefined;
    const guncelle = () => {
      const { width, height } = Dimensions.get('window');
      const dokunmatik = sorgu?.matches ?? true;
      const uygula = () =>
        setOlcu((onceki) =>
          onceki.width === width && onceki.height === height && onceki.dokunmatik === dokunmatik
            ? onceki
            : { width, height, dokunmatik },
        );
      // External store güncellemeleri React'te eşzamanlıdır. Webde boyut değişimi
      // giriş ve tıklamaların önüne geçmeden, tek sağlayıcı üzerinden yayılır.
      if (Platform.OS === 'web') startTransition(uygula);
      else uygula();
    };
    const abonelik = Dimensions.addEventListener('change', guncelle);
    sorgu?.addEventListener('change', guncelle);
    guncelle();
    return () => {
      abonelik.remove();
      sorgu?.removeEventListener('change', guncelle);
    };
  }, []);

  return <EkranBaglami value={olcu}>{children}</EkranBaglami>;
}
