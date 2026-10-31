import { useEffect } from 'react';
import {
  gorunurAlaniIzle,
  gorunurAlaniOku,
  klavyeDurumunuOku,
  yaziGirdisiMi,
} from '../tasarim/gorunurAlan.web';

function gerekenKayma(girdi: HTMLElement, ust: number, alt: number) {
  const alan = girdi.getBoundingClientRect();
  if (alt <= ust) return 0;
  if (alan.height > alt - ust) return alan.top - ust;
  if (alan.bottom > alt) return alan.bottom - alt;
  if (alan.top < ust) return alan.top - ust;
  return 0;
}

/** Önce girdinin iç kaydırıcısını, ardından gerekirse sayfayı kaydırır. */
export function odaklananGirdiyiGoster() {
  const girdi = document.activeElement;
  if (!yaziGirdisiMi(girdi) || girdi.closest('[data-klavye-yerlesimi="sabit"]')) return;
  const ekran = gorunurAlaniOku();
  let ust = ekran.ust + 12;
  let alt = ekran.ust + ekran.yukseklik - 12;
  const pencere = girdi.closest<HTMLElement>('.pazar-pencere-icerik');
  if (pencere) {
    const sinir = pencere.getBoundingClientRect();
    ust = Math.max(ust, sinir.top + 8);
    alt = Math.min(alt, sinir.bottom - 8);
  } else {
    const menuElemani = document.querySelector<HTMLElement>('[data-ust-menu]');
    const menu = menuElemani?.getBoundingClientRect();
    if (menu && !menuElemani?.contains(girdi) && menu.top <= ust && menu.bottom > ust) ust = menu.bottom + 12;
    const altMenu = document.querySelector<HTMLElement>('[data-mobil-menu]')?.getBoundingClientRect();
    if (altMenu && altMenu.top < alt && altMenu.bottom > ekran.ust) alt = altMenu.top - 12;
  }

  let kapsayici = girdi.parentElement;
  while (kapsayici && kapsayici !== document.body && kapsayici !== document.documentElement) {
    const bicim = getComputedStyle(kapsayici);
    if (/(auto|scroll|overlay)/.test(bicim.overflowY) && kapsayici.scrollHeight > kapsayici.clientHeight) {
      const sinir = kapsayici.getBoundingClientRect();
      const kayma = gerekenKayma(girdi, Math.max(ust, sinir.top + 8), Math.min(alt, sinir.bottom - 8));
      if (Math.abs(kayma) > 1) kapsayici.scrollTop += kayma;
    }
    if (kapsayici === pencere) return;
    kapsayici = kapsayici.parentElement;
  }
  const kayma = gerekenKayma(girdi, ust, alt);
  if (Math.abs(kayma) > 1) window.scrollBy({ top: kayma, behavior: 'instant' });
}

export function KlavyeOdagi() {
  useEffect(() => {
    let kare: number | undefined;
    let odakKaresi: number | undefined;
    let zamanlayicilar: ReturnType<typeof setTimeout>[] = [];
    const goster = () => {
      if (kare !== undefined) cancelAnimationFrame(kare);
      kare = requestAnimationFrame(() => {
        kare = undefined;
        const alan = gorunurAlaniOku();
        const kok = document.documentElement;
        const acik = klavyeDurumunuOku();
        kok.style.setProperty('--pazar-gorunur-ust', `${alan.ust}px`);
        kok.style.setProperty('--pazar-gorunur-sol', `${alan.sol}px`);
        kok.style.setProperty('--pazar-gorunur-yukseklik', `${alan.yukseklik}px`);
        kok.style.setProperty('--pazar-gorunur-genislik', `${alan.genislik}px`);
        kok.classList.toggle('pazar-klavye-acik', acik);
        // React panel/modal yüksekliğini uyguladıktan sonra odak sınırını kontrol et.
        if (odakKaresi !== undefined) cancelAnimationFrame(odakKaresi);
        odakKaresi = requestAnimationFrame(() => {
          odakKaresi = undefined;
          odaklananGirdiyiGoster();
        });
      });
    };
    const odakDegisti = () => {
      zamanlayicilar.forEach(clearTimeout);
      goster();
      zamanlayicilar = [100, 350, 650].map((sure) => setTimeout(goster, sure));
    };
    const birak = gorunurAlaniIzle(goster);
    document.addEventListener('focusin', odakDegisti);
    document.addEventListener('focusout', odakDegisti);
    goster();
    return () => {
      birak();
      document.removeEventListener('focusin', odakDegisti);
      document.removeEventListener('focusout', odakDegisti);
      zamanlayicilar.forEach(clearTimeout);
      if (kare !== undefined) cancelAnimationFrame(kare);
      if (odakKaresi !== undefined) cancelAnimationFrame(odakKaresi);
      document.documentElement.classList.remove('pazar-klavye-acik');
      for (const ad of ['ust', 'sol', 'yukseklik', 'genislik'])
        document.documentElement.style.removeProperty(`--pazar-gorunur-${ad}`);
    };
  }, []);
  return null;
}
