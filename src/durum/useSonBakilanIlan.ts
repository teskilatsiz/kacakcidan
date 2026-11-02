import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Ilan } from '../veri/ilanlar';
import {
  gezintiKaydiniOku,
  gezintiyeEkle,
  karsilastirilabilir,
  oncekiIlaniBul,
  type GezintiKaydi,
} from '../veri/ilanKarsilastirma';

const yazmalar = new Map<string, Promise<unknown>>();
const oturumGecmisi = new Map<string, GezintiKaydi[]>();
function sirayaAl<T>(anahtar: string, islem: () => Promise<T>): Promise<T> {
  const onceki = yazmalar.get(anahtar) ?? Promise.resolve();
  const siradaki = onceki.catch(() => undefined).then(islem);
  yazmalar.set(anahtar, siradaki);
  void siradaki
    .finally(() => {
      if (yazmalar.get(anahtar) === siradaki) yazmalar.delete(anahtar);
    })
    .catch(() => undefined);
  return siradaki;
}

/** Yalnız kimlik ve tarih saklanır; hesapların gezinme kayıtları birbirine karışmaz. */
export function useSonBakilanIlan(ilan: Ilan, ilanlar: Ilan[], hesapId?: string) {
  const anahtar = `kacakcidan:gezinti:v1:${hesapId ?? 'misafir'}`;
  const [sonuc, setSonuc] = useState<{ id: string; anahtar: string; onceki?: string }>();
  const sonIlanlar = useRef(ilanlar);
  sonIlanlar.current = ilanlar;
  useEffect(() => {
    let etkin = true;
    const kaydet = async () => {
      const bellek = oturumGecmisi.get(anahtar);
      let kayitlar = bellek ? gezintiKaydiniOku(JSON.stringify(bellek)) : [];
      if (!bellek) {
        try {
          const ham = await AsyncStorage.getItem(anahtar);
          kayitlar = gezintiKaydiniOku(ham);
        } catch {
          // Depolama kapalıysa karşılaştırma açık oturum içinde çalışmaya devam eder.
        }
      }
      const onceki = oncekiIlaniBul(kayitlar, ilan, sonIlanlar.current);
      if (etkin) setSonuc({ id: ilan.id, anahtar, onceki: onceki?.id });
      const yeni = gezintiyeEkle(kayitlar, ilan.id);
      oturumGecmisi.set(anahtar, yeni);
      try {
        await AsyncStorage.setItem(anahtar, JSON.stringify(yeni));
      } catch {
        /* Oturum kaydı korunur. */
      }
    };
    void sirayaAl(anahtar, kaydet);
    return () => {
      etkin = false;
    };
  }, [anahtar, ilan.id]);

  const temizle = useCallback(async () => {
    setSonuc(undefined);
    return sirayaAl(anahtar, async () => {
      oturumGecmisi.delete(anahtar);
      try {
        await AsyncStorage.removeItem(anahtar);
        return true;
      } catch {
        return false;
      }
    });
  }, [anahtar]);
  return {
    onceki:
      sonuc?.id === ilan.id && sonuc.anahtar === anahtar
        ? ilanlar.find((kayit) => kayit.id === sonuc.onceki && karsilastirilabilir(kayit, ilan))
        : undefined,
    temizle,
  };
}
