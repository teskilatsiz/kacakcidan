import { useId } from 'react';
import Sun from 'lucide-react-native/icons/sun';
import Moon from 'lucide-react-native/icons/moon';
import Monitor from 'lucide-react-native/icons/monitor';
import Check from 'lucide-react-native/icons/check';
import { useTema } from '../tasarim/tema';

const secenekler = [
  { id: 'acik', ad: 'Açık', Simge: Sun },
  { id: 'koyu', ad: 'Koyu', Simge: Moon },
  { id: 'sistem', ad: 'Sistem', Simge: Monitor },
] as const;

export function TemaSecici({ kompakt = false }: { kompakt?: boolean }) {
  const { renk, tercih, temaSec } = useTema();
  const kimlik = useId();
  return (
    <fieldset aria-label="Görünüm tercihi" style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: kompakt ? 'row' : 'column',
          gap: 10,
          alignItems: kompakt ? 'center' : 'stretch',
          justifyContent: 'space-between',
        }}
      >
        <span aria-hidden style={{ color: renk.murekkep, fontSize: 13, fontWeight: 600 }}>
          Görünüm
        </span>
        <div
          style={{
            display: 'flex',
            gap: kompakt ? 2 : 8,
            padding: kompakt ? 3 : 0,
            borderRadius: 10,
            background: kompakt ? renk.zemin : undefined,
          }}
        >
          {secenekler.map(({ id, ad, Simge }) => {
            const secili = tercih === id;
            return (
              <label
                key={id}
                data-tema-secenegi
                title={`${ad} tema`}
                style={{
                  position: 'relative',
                  flex: kompakt ? undefined : 1,
                  width: kompakt ? 44 : undefined,
                  minWidth: 0,
                  minHeight: kompakt ? 44 : 72,
                  borderRadius: 8,
                  border: `1px solid ${secili ? renk.cizgi : 'transparent'}`,
                  background: secili ? renk.beyaz : kompakt ? 'transparent' : renk.acik,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name={`gorunum-${kimlik}`}
                  id={`gorunum-${kimlik}-${id}`}
                  value={id}
                  aria-label={`${ad} tema`}
                  checked={secili}
                  onChange={() => temaSec(id)}
                  style={{ position: 'absolute', width: 1, height: 1, margin: 0, opacity: 0 }}
                />
                <Simge size={19} color={renk.murekkep} strokeWidth={secili ? 2 : 1.6} aria-hidden />
                {!kompakt && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: renk.murekkep,
                      fontSize: 12,
                      fontWeight: secili ? 700 : 400,
                    }}
                  >
                    {ad}
                    {secili && <Check size={12} color={renk.murekkep} aria-hidden />}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
