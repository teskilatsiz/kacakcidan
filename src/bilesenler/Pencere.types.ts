import type { ReactNode } from 'react';

export type PencereProps = {
  acik: boolean;
  kapat: () => void;
  baslik: string;
  children: ReactNode;
  altlik?: ReactNode;
  genis?: boolean;
  /** Tablet gibi geniş ekranlarda da alt kenardan açılan, genişliği sınırlı pencere. */
  alttan?: boolean;
};
