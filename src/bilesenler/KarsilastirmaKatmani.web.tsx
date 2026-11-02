import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Sabit şerit, sayfanın grid ve animasyon katmanlarından etkilenmez. */
export function KarsilastirmaKatmani({ children, sabit }: { children: ReactNode; sabit: boolean }) {
  if (!sabit) return <>{children}</>;
  return typeof document === 'undefined' ? null : createPortal(children, document.body);
}
