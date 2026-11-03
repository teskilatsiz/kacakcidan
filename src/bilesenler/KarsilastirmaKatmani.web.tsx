import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function karsilastirmaOnerisiAcilebilir() {
  return (
    document.visibilityState === 'visible' &&
    !document.querySelector('dialog[open], [aria-modal="true"]') &&
    !document.activeElement?.matches(
      'input, textarea, select, iframe, video, [contenteditable="true"], [contenteditable=""]',
    )
  );
}

/** Sabit şerit, sayfanın grid ve animasyon katmanlarından etkilenmez. */
export function KarsilastirmaKatmani({ children, sabit }: { children: ReactNode; sabit: boolean }) {
  const katman = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sabit) return;
    const serit = katman.current?.firstElementChild;
    if (!(serit instanceof HTMLElement)) return;
    const kok = document.documentElement;
    const boyutuGuncelle = () => {
      kok.style.setProperty('--karsilastirma-serit-yuksekligi', `${Math.ceil(serit.offsetHeight)}px`);
    };
    boyutuGuncelle();
    const gozlemci = new ResizeObserver(boyutuGuncelle);
    gozlemci.observe(serit, { box: 'border-box' });
    return () => {
      gozlemci.disconnect();
      kok.style.removeProperty('--karsilastirma-serit-yuksekligi');
    };
  }, [sabit]);
  if (!sabit) return <>{children}</>;
  return typeof document === 'undefined'
    ? null
    : createPortal(
        <div ref={katman} data-karsilastirma-katmani style={{ display: 'contents' }}>
          {children}
        </div>,
        document.body,
      );
}
