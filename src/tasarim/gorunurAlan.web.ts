import { useSyncExternalStore } from 'react';
import type { GorunurAlan } from './gorunurAlan';

const sunucu: GorunurAlan = { yukseklik: 900, genislik: 1440, ust: 0, sol: 0, alt: 0, sag: 0 };
const sunucuOlcusu = () => sunucu;
const aboneOlma = () => () => {};
let sonOlcu = sunucu;
let kapaliYukseklik = 0;
let oncekiGenislik = 0;
let klavyeAcik = false;
const aboneler = new Set<() => void>();
let dinlemeyiBirak: (() => void) | undefined;

export function yaziGirdisiMi(alan: Element | null): alan is HTMLElement {
  return (
    alan instanceof HTMLElement &&
    alan.matches(
      'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled]), [contenteditable="true"]',
    )
  );
}

export function gorunurAlaniOku(): GorunurAlan {
  if (typeof window === 'undefined') return sunucu;
  const ekran = window.visualViewport;
  const yukseklik = Math.max(1, ekran?.height ?? window.innerHeight);
  const genislik = Math.max(1, ekran?.width ?? window.innerWidth);
  const ust = Math.max(0, ekran?.offsetTop ?? 0);
  const sol = Math.max(0, ekran?.offsetLeft ?? 0);
  const girdiOdakta = yaziGirdisiMi(document.activeElement);
  if (!kapaliYukseklik || Math.abs(window.innerWidth - oncekiGenislik) > 80) {
    kapaliYukseklik = Math.max(yukseklik, window.innerHeight);
    oncekiGenislik = window.innerWidth;
  } else if (!girdiOdakta) {
    kapaliYukseklik = Math.max(kapaliYukseklik, yukseklik);
  }
  const klavyePayi = Math.max(kapaliYukseklik, window.innerHeight) - yukseklik;
  klavyeAcik =
    girdiOdakta && (ekran?.scale ?? 1) < 1.05 && klavyePayi > Math.max(100, kapaliYukseklik * 0.15);
  const yeni = {
    yukseklik,
    genislik,
    ust,
    sol,
    alt: Math.max(0, window.innerHeight - yukseklik - ust),
    sag: Math.max(0, window.innerWidth - genislik - sol),
  };
  if (
    Object.keys(yeni).some((alan) => yeni[alan as keyof GorunurAlan] !== sonOlcu[alan as keyof GorunurAlan])
  )
    sonOlcu = yeni;
  return sonOlcu;
}

export function klavyeDurumunuOku() {
  if (typeof window === 'undefined') return false;
  gorunurAlaniOku();
  return klavyeAcik;
}

/** Klavye animasyonundaki resize/scroll olaylarını kare başına bir ölçüme indirir. */
export function gorunurAlaniIzle(guncelle: () => void) {
  aboneler.add(guncelle);
  if (!dinlemeyiBirak) {
    let kare: number | undefined;
    const ekran = window.visualViewport;
    const olc = () => {
      if (kare !== undefined) return;
      kare = requestAnimationFrame(() => {
        kare = undefined;
        gorunurAlaniOku();
        aboneler.forEach((abone) => abone());
      });
    };
    window.addEventListener('resize', olc);
    document.addEventListener('focusin', olc);
    document.addEventListener('focusout', olc);
    ekran?.addEventListener('resize', olc);
    ekran?.addEventListener('scroll', olc);
    ekran?.addEventListener('scrollend', olc);
    dinlemeyiBirak = () => {
      window.removeEventListener('resize', olc);
      document.removeEventListener('focusin', olc);
      document.removeEventListener('focusout', olc);
      ekran?.removeEventListener('resize', olc);
      ekran?.removeEventListener('scroll', olc);
      ekran?.removeEventListener('scrollend', olc);
      if (kare !== undefined) cancelAnimationFrame(kare);
    };
  }
  return () => {
    aboneler.delete(guncelle);
    if (aboneler.size === 0) {
      dinlemeyiBirak?.();
      dinlemeyiBirak = undefined;
    }
  };
}

export function useGorunurAlan(etkin = true) {
  return useSyncExternalStore(etkin ? gorunurAlaniIzle : aboneOlma, gorunurAlaniOku, sunucuOlcusu);
}
