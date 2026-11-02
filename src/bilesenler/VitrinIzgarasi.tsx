import type { ReactNode } from 'react';
import type { Ilan } from '../veri/ilanlar';
import { IlanIzgarasi } from './IlanKarti';

export type VitrinIzgarasiProps = {
  ilanlar: Ilan[];
  araya?: ReactNode;
  arayaSira?: number;
};

export function VitrinIzgarasi(props: VitrinIzgarasiProps) {
  return <IlanIzgarasi {...props} oncelikli vitrin />;
}
