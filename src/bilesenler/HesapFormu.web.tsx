import type { HesapFormuProps, HesapGonderProps } from './HesapFormu';
import { renk } from '../tasarim/tema';

export function HesapFormu({ children, gonder }: HesapFormuProps) {
  return (
    <form
      noValidate
      onSubmit={(olay) => {
        olay.preventDefault();
        gonder();
      }}
      aria-label="Hesap bilgileri"
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {children}
    </form>
  );
}
export function HesapGonder({ children, disabled, calisiyor }: HesapGonderProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-busy={calisiyor}
      style={{
        minHeight: 50,
        width: '100%',
        padding: '12px 20px',
        border: `1px solid ${renk.sari}`,
        backgroundColor: renk.sari,
        borderRadius: 10,
        color: renk.murekkep,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {calisiyor ? 'Bir saniye…' : children}
    </button>
  );
}
