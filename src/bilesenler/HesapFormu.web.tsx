import type { HesapFormuProps, HesapGonderProps } from './HesapFormu';
import { useTema } from '../tasarim/tema';

export function HesapFormu({ children, gonder, eposta, kayit }: HesapFormuProps) {
  return (
    <form
      id={kayit ? 'hesap-kayit-formu' : 'hesap-giris-formu'}
      name={kayit ? 'kayit' : 'giris'}
      autoComplete="on"
      noValidate
      onSubmit={(olay) => {
        olay.preventDefault();
        gonder();
      }}
      aria-label="Hesap bilgileri"
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {eposta ? <input type="hidden" name="username" autoComplete="username" value={eposta} /> : null}
      {children}
    </form>
  );
}
export function HesapGonder({ children, disabled, calisiyor }: HesapGonderProps) {
  const { renk } = useTema();
  return (
    <button
      name="hesap-gonder"
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
        color: renk.vurguYazi,
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
