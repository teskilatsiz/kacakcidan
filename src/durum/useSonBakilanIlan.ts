import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import type { Ilan } from '../veri/ilanlar';
import {
  gezintiKaydiniOku,
  gezintiyeEkle,
  karsilastirilabilir,
  oncekiIlaniBul,
} from '../veri/ilanKarsilastirma';
import { GEZINTI_TEMIZLENDI, gezintiBellegi, gezintiyiSirala } from './sonBakilanDeposu';

/** Yalnız kimlik ve tarih saklanır; hesapların gezinme kayıtları birbirine karışmaz. */
export function useSonBakilanIlan(ilan: Ilan, ilanlar: Ilan[], hesapId?: string) {
  const anahtar = `kacakcidan:gezinti:v1:${hesapId ?? 'misafir'}`;
  const [sonuc, setSonuc] = useState<{ id: string; anahtar: string; onceki?: string }>();
  const sonIlanlar = useRef(ilanlar);
  sonIlanlar.current = ilanlar;
  useEffect(() => {
    const abonelik = DeviceEventEmitter.addListener(GEZINTI_TEMIZLENDI, () => setSonuc(undefined));
    return () => abonelik.remove();
  }, []);
  useEffect(() => {
    let etkin = true;
    const kaydet = async () => {
      const bellek = gezintiBellegi.get(anahtar);
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
      gezintiBellegi.set(anahtar, yeni);
      try {
        await AsyncStorage.setItem(anahtar, JSON.stringify(yeni));
      } catch {
        /* Oturum kaydı korunur. */
      }
    };
    void gezintiyiSirala(kaydet);
    return () => {
      etkin = false;
    };
  }, [anahtar, ilan.id]);

  const temizle = useCallback(async () => {
    setSonuc(undefined);
    return gezintiyiSirala(async () => {
      gezintiBellegi.delete(anahtar);
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
