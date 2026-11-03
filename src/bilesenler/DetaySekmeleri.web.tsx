import { useTema } from '../tasarim/tema';
import { useRef } from 'react';
import type { DetaySekmeleriProps } from './DetaySekmeleri';
import { haritaVerisiniHazirla } from '../veri/haritaYukleyici';

const tumSekmeler = [
  { id: 'aciklama', ad: 'Açıklama' },
  { id: 'ozellikler', ad: 'Özellikler' },
  { id: 'konum', ad: 'Konum' },
  { id: 'sorular', ad: 'Soru & cevap' },
] as const;

export function DetaySekmeleri({ secili, degistir, kimlik, ozellikler = true }: DetaySekmeleriProps) {
  const { renk } = useTema();
  const sekmeler = tumSekmeler.filter((sekme) => ozellikler || sekme.id !== 'ozellikler');

  const dugmeler = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div
      role="tablist"
      aria-label="İlan bilgileri"
      style={{
        display: 'flex',
        gap: 'clamp(10px, 3vw, 20px)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        borderBottom: `1px solid ${renk.cizgi}`,
      }}
    >
      {sekmeler.map((sekme, sira) => (
        <button
          type="button"
          key={sekme.id}
          ref={(eleman) => {
            dugmeler.current[sira] = eleman;
          }}
          id={`${kimlik}-${sekme.id}`}
          role="tab"
          aria-selected={secili === sekme.id}
          aria-controls={`${kimlik}-icerik`}
          tabIndex={secili === sekme.id ? 0 : -1}
          onClick={() => degistir(sekme.id)}
          onPointerEnter={sekme.id === 'konum' ? haritaVerisiniHazirla : undefined}
          onPointerDown={sekme.id === 'konum' ? haritaVerisiniHazirla : undefined}
          onFocus={sekme.id === 'konum' ? haritaVerisiniHazirla : undefined}
          onKeyDown={(olay) => {
            let hedef = sira;
            if (olay.key === 'ArrowRight') hedef = (sira + 1) % sekmeler.length;
            else if (olay.key === 'ArrowLeft') hedef = (sira + sekmeler.length - 1) % sekmeler.length;
            else if (olay.key === 'Home') hedef = 0;
            else if (olay.key === 'End') hedef = sekmeler.length - 1;
            else return;
            olay.preventDefault();
            const yeni = sekmeler[hedef];
            if (yeni) {
              degistir(yeni.id);
              dugmeler.current[hedef]?.focus();
            }
          }}
          style={{
            minHeight: 48,
            flexShrink: 0,
            padding: '0 2px',
            border: 0,
            borderBottom: `2px solid ${secili === sekme.id ? renk.murekkep : 'transparent'}`,
            background: 'transparent',
            font: 'inherit',
            fontSize: 13,
            fontWeight: 700,
            color: secili === sekme.id ? renk.murekkep : renk.gri,
            cursor: 'pointer',
          }}
        >
          {sekme.ad}
        </button>
      ))}
    </div>
  );
}
