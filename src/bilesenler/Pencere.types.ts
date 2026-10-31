import type { ReactNode } from 'react';

export type PencereProps = {
  acik: boolean;
  kapat: () => void;
  baslik: string;
  children: ReactNode;
  altlik?: ReactNode;
  genis?: boolean;
};
