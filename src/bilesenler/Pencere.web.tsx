import { useEffect, useRef, type CSSProperties } from 'react';
import X from 'lucide-react-native/icons/x';
import type { PencereProps } from './Pencere.types';
import { sayfaKaydirmasiniKilitle } from './pencereKaydirmasi.web';
import { useGorunurAlan } from '../tasarim/gorunurAlan';
import './Pencere.web.css';

export function Pencere({ acik, kapat, baslik, children, altlik, genis = false }: PencereProps) {
  const pencere = useRef<HTMLDialogElement>(null);
  const gorunurAlan = useGorunurAlan(acik);
  const kapatRef = useRef(kapat);
  kapatRef.current = kapat;

  useEffect(() => {
    const eleman = pencere.current;
    if (!eleman || !acik) return;
    const oncekiOdak = document.activeElement;
    if (!eleman.open) eleman.showModal();
    const serbestBirak = sayfaKaydirmasiniKilitle();
    return () => {
      if (document.activeElement instanceof HTMLElement && eleman.contains(document.activeElement))
        document.activeElement.blur();
      if (eleman.open) eleman.close();
      serbestBirak();
      if (oncekiOdak instanceof HTMLElement && oncekiOdak.isConnected)
        oncekiOdak.focus({ preventScroll: true });
    };
  }, [acik]);

  return (
    <dialog
      ref={pencere}
      className="pazar-pencere"
      style={
        {
          '--pencere-yuksekligi': `${gorunurAlan.yukseklik}px`,
          '--pencere-genisligi': `${gorunurAlan.genislik}px`,
          '--pencere-ust': `${gorunurAlan.ust}px`,
          '--pencere-alt': `${gorunurAlan.alt}px`,
          '--pencere-sol': `${gorunurAlan.sol}px`,
          '--pencere-sag': `${gorunurAlan.sag}px`,
        } as CSSProperties
      }
      data-genis={genis || undefined}
      data-altlik={!!altlik || undefined}
      aria-label={baslik}
      onCancel={(olay) => {
        olay.preventDefault();
        kapatRef.current();
      }}
      onClick={(olay) => {
        if (olay.target !== olay.currentTarget) return;
        const alan = olay.currentTarget.getBoundingClientRect();
        if (
          olay.clientX < alan.left ||
          olay.clientX > alan.right ||
          olay.clientY < alan.top ||
          olay.clientY > alan.bottom
        )
          kapatRef.current();
      }}
    >
      {acik && (
        <div className="pazar-pencere-ic">
          <div className="pazar-pencere-tutamak" aria-hidden="true" />
          <header className="pazar-pencere-baslik">
            <h2>{baslik}</h2>
            <button type="button" aria-label="Pencereyi kapat" onClick={kapat}>
              <X size={21} />
            </button>
          </header>
          <div className="pazar-pencere-icerik">{children}</div>
          {altlik ? <div className="pazar-pencere-altlik">{altlik}</div> : null}
        </div>
      )}
    </dialog>
  );
}
