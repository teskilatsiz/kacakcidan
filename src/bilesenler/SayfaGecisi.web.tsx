import { useEffect, useLayoutEffect } from 'react';
import { useGlobalSearchParams, usePathname } from 'expo-router';

export function SayfaGecisi() {
  const yol = usePathname();
  const { kayit, q } = useGlobalSearchParams<{ kayit?: string; q?: string }>();
  const sayfa =
    yol === '/ilan/yerel' ? `${yol}:${kayit ?? ''}` : yol === '/kesfet' ? `${yol}:${q ?? ''}` : yol;
  useEffect(() => {
    const onceki = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => {
      history.scrollRestoration = onceki;
    };
  }, []);
  useLayoutEffect(() => {
    // Filtre değişimleri aynı sayfada kalır; yeni sayfa ve ilan üstten açılır.
    window.scrollTo(0, 0);
    const istek = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      const etkin = document.activeElement;
      if (etkin instanceof HTMLElement && etkin.matches('input, textarea, select, [contenteditable="true"]'))
        return;
      const baslik = document.querySelector<HTMLElement>(
        '[data-ana-icerik] [role="heading"][aria-level="1"]',
      );
      if (baslik) {
        baslik.tabIndex = -1;
        baslik.dataset.sayfaOdagi = 'true';
        baslik.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(istek);
  }, [sayfa]);
  return null;
}
