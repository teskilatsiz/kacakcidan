import { useSyncExternalStore } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

const dinleyiciler = new Set<() => void>();
let azaltilmisHareket = false;
let izlemeyiBirak: (() => void) | undefined;

function hareketTercihiniGuncelle(deger: boolean) {
  if (azaltilmisHareket === deger) return;
  azaltilmisHareket = deger;
  dinleyiciler.forEach((dinle) => dinle());
}

function hareketTercihiniIzle() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
    const sorgu = window.matchMedia('(prefers-reduced-motion: reduce)');
    const guncelle = () => hareketTercihiniGuncelle(sorgu.matches);
    guncelle();
    sorgu.addEventListener('change', guncelle);
    return () => sorgu.removeEventListener('change', guncelle);
  }

  let etkin = true;
  void AccessibilityInfo.isReduceMotionEnabled()
    .then((deger) => {
      if (etkin) hareketTercihiniGuncelle(deger);
    })
    .catch(() => undefined);
  const abonelik = AccessibilityInfo.addEventListener('reduceMotionChanged', hareketTercihiniGuncelle);
  return () => {
    etkin = false;
    abonelik.remove();
  };
}

function aboneOl(dinle: () => void) {
  dinleyiciler.add(dinle);
  if (dinleyiciler.size === 1) izlemeyiBirak = hareketTercihiniIzle();
  return () => {
    dinleyiciler.delete(dinle);
    if (dinleyiciler.size === 0) {
      izlemeyiBirak?.();
      izlemeyiBirak = undefined;
    }
  };
}

const anlikTercih = () => azaltilmisHareket;
const sunucuTercihi = () => true;

/** Açık ekranlarda değişen erişilebilirlik tercihini de takip eder. */
export function useAzaltilmisHareket() {
  return useSyncExternalStore(aboneOl, anlikTercih, sunucuTercihi);
}
