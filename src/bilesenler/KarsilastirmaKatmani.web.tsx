import type { ReactNode } from 'react';
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
  if (!sabit) return <>{children}</>;
  return typeof document === 'undefined' ? null : createPortal(children, document.body);
}
