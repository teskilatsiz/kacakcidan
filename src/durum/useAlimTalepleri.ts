import { useEffect, useRef, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { usePazar } from './Pazar';
import { alimTalebiDeposuOlustur } from './alimTalebiDeposu';
import {
  alimTalebiOlustur,
  alimTalebiKapat,
  alimTalebiniYanitla,
  type AlimTalebiGirdisi,
} from '../veri/alimTalepleri';

const depo = alimTalebiDeposuOlustur(AsyncStorage);

export function useAlimTalepleri() {
  const pazar = usePazar();
  const anlik = useRef(pazar);
  anlik.current = pazar;
  const durum = useSyncExternalStore(depo.izle, depo.oku, depo.sunucuyuOku);
  useEffect(() => {
    void depo.yukle();
  }, []);
  function hesabim(beklenenId: string | undefined) {
    const { oturum, profil } = anlik.current;
    if (!oturum || oturum.id !== beklenenId)
      throw new Error('Hesabın değişti. Devam etmek için sayfayı yeniden aç.');
    return { id: oturum.id, ad: profil.ad };
  }
  const hesapId = pazar.oturum?.id;
  return {
    ...durum,
    async olustur(girdi: AlimTalebiGirdisi) {
      let id = '';
      await depo.degistir((talepler) => {
        const hesap = hesabim(hesapId);
        if (talepler.length >= 500) throw new Error('Bu cihazdaki talep kayıt sınırına ulaşıldı.');
        const yeni = alimTalebiOlustur(girdi, hesap, randomUUID(), new Date().toISOString());
        id = yeni.id;
        return [yeni, ...talepler];
      });
      return id;
    },
    async kapat(id: string) {
      await depo.degistir((talepler) => {
        const hesap = hesabim(hesapId);
        if (!talepler.some((talep) => talep.id === id)) throw new Error('Bu talep bulunamadı.');
        return talepler.map((talep) => (talep.id === id ? alimTalebiKapat(talep, hesap.id) : talep));
      });
    },
    async yanitla(id: string, ilanId: string, mesaj: string) {
      await depo.degistir((talepler) => {
        const hesap = hesabim(hesapId);
        if (!talepler.some((talep) => talep.id === id)) throw new Error('Bu talep bulunamadı.');
        const ilan = anlik.current.tumIlanlar.find(
          (ilan) => ilan.id === ilanId && ilan.saticiId === hesap.id,
        );
        return talepler.map((talep) =>
          talep.id === id
            ? alimTalebiniYanitla(talep, hesap, ilan, mesaj, randomUUID(), new Date().toISOString())
            : talep,
        );
      });
    },
  };
}
