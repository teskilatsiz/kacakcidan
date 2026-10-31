import { useRef } from 'react';
import type { DetaySekmeleriProps } from './DetaySekmeleri';

const sekmeler = [
  { id: 'aciklama', ad: 'Açıklama' },
  { id: 'ozellikler', ad: 'Özellikler' },
] as const;

export function DetaySekmeleri({ secili, degistir, kimlik }: DetaySekmeleriProps) {
  const dugmeler = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div
      role="tablist"
      aria-label="İlan bilgileri"
      style={{ display: 'flex', gap: 24, borderBottom: '1px solid #e6e7e3' }}
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
            padding: '0 2px',
            border: 0,
            borderBottom: `2px solid ${secili === sekme.id ? '#17191b' : 'transparent'}`,
            background: 'transparent',
            font: 'inherit',
            fontSize: 14,
            fontWeight: 700,
            color: secili === sekme.id ? '#17191b' : '#747870',
            cursor: 'pointer',
          }}
        >
          {sekme.ad}
        </button>
      ))}
    </div>
  );
}
