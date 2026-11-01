import { useRef } from 'react';
import Mail from 'lucide-react-native/icons/mail';
import Monitor from 'lucide-react-native/icons/monitor';
import UserRound from 'lucide-react-native/icons/user-round';
import { useEkran, useTema } from '../tasarim/tema';
import type { HesapAyarSekmeleriProps } from './HesapAyarSekmeleri';

export function HesapAyarSekmeleri({ secili, degistir }: HesapAyarSekmeleriProps) {
  const { renk } = useTema();
  const { dar } = useEkran();
  const dugmeler = useRef<(HTMLButtonElement | null)[]>([]);
  const secenekler = [
    { id: 'profil' as const, ad: dar ? 'Profil' : 'Profil bilgileri', Simge: UserRound },
    { id: 'hesap' as const, ad: dar ? 'Hesap' : 'Hesap bilgileri', Simge: Mail },
    { id: 'gorunum' as const, ad: 'Görünüm', Simge: Monitor },
  ];
  return (
    <div
      role="tablist"
      aria-label="Ayarlar bölümleri"
      aria-orientation={dar ? 'horizontal' : 'vertical'}
      style={{
        display: 'flex',
        flexDirection: dar ? 'row' : 'column',
        gap: 6,
        flexShrink: 0,
        width: dar ? '100%' : 224,
      }}
    >
      {secenekler.map(({ id, ad, Simge }, sira) => (
        <button
          key={id}
          type="button"
          id={`ayar-sekme-${id}`}
          ref={(eleman) => {
            dugmeler.current[sira] = eleman;
          }}
          role="tab"
          aria-selected={secili === id}
          aria-controls={`ayar-panel-${id}`}
          tabIndex={secili === id ? 0 : -1}
          onClick={() => degistir(id)}
          onKeyDown={(olay) => {
            let hedef = sira;
            if (olay.key === 'ArrowRight' || olay.key === 'ArrowDown') hedef = (sira + 1) % secenekler.length;
            else if (olay.key === 'ArrowLeft' || olay.key === 'ArrowUp')
              hedef = (sira + secenekler.length - 1) % secenekler.length;
            else if (olay.key === 'Home') hedef = 0;
            else if (olay.key === 'End') hedef = secenekler.length - 1;
            else return;
            olay.preventDefault();
            degistir(secenekler[hedef]!.id);
            dugmeler.current[hedef]?.focus({ preventScroll: true });
          }}
          style={{
            display: 'flex',
            flex: dar ? 1 : undefined,
            minWidth: 0,
            minHeight: dar ? 66 : 48,
            flexDirection: dar ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: dar ? 'center' : 'flex-start',
            gap: dar ? 5 : 10,
            padding: dar ? '6px 4px' : '0 16px',
            borderRadius: 10,
            border: `1px solid ${secili === id ? renk.cizgi : 'transparent'}`,
            background: secili === id ? renk.acik : 'transparent',
            color: renk.murekkep,
            font: 'inherit',
            fontSize: 13,
            fontWeight: secili === id ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          <Simge size={18} color={renk.murekkep} />
          <span>{ad}</span>
        </button>
      ))}
    </div>
  );
}
