import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Buton } from './Temel';

export type HesapFormuProps = {
  children: ReactNode;
  gonder: () => void;
  /** Şifre adımında tarayıcının doğru hesabı otomatik doldurabilmesi için korunur. */
  eposta?: string;
  kayit?: boolean;
  kimlik?: string;
};
export type HesapGonderProps = {
  children: string;
  gonder: () => void;
  disabled: boolean;
  calisiyor: boolean;
};

export function HesapFormu({ children }: HesapFormuProps) {
  return <View style={{ gap: 16 }}>{children}</View>;
}
export function HesapGonder({ children, gonder, disabled, calisiyor }: HesapGonderProps) {
  return (
    <Buton onPress={gonder} disabled={disabled}>
      {calisiyor ? 'Bir saniye…' : children}
    </Buton>
  );
}
