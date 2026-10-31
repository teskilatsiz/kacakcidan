import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Expand from 'lucide-react-native/icons/expand';
import Play from 'lucide-react-native/icons/play';
import X from 'lucide-react-native/icons/x';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import ZoomIn from 'lucide-react-native/icons/zoom-in';
import ZoomOut from 'lucide-react-native/icons/zoom-out';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import type { Ilan } from '../veri/ilanlar';
import { useMedyaAdresi } from '../durum/medyaDeposu';
import { VideoOynatici } from './VideoOynatici';
import { sayfaKaydirmasiniKilitle } from './pencereKaydirmasi.web';
import './IlanGalerisi.web.css';

function onizleme(yol: string, kucuk = false) {
  return /(?:iphone-15-pro-(arka|ekran)|playstation-5-detay|macbook-air-kapak)\.webp$/.test(yol)
    ? yol.replace('.webp', kucuk ? '-kucuk.webp' : '-onizleme.webp')
    : yol;
}
const sinirla = (sayi: number) => Math.max(1, Math.min(4, sayi));
function GaleriResmi({ kaynak, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { kaynak: string }) {
  const adres = useMedyaAdresi(kaynak);
  return <img {...props} src={adres} />;
}
export function IlanGalerisi({ ilan }: { ilan: Ilan }) {
  const fotograflar = Array.from(new Set([ilan.gorsel, ...(ilan.fotografler ?? [])].filter(Boolean)));
  const adet = fotograflar.length + (ilan.video ? 1 : 0);
  const [sira, setSira] = useState(0);
  const [acik, setAcik] = useState(false);
  const [olcek, setOlcek] = useState(1);
  const [kayma, setKayma] = useState({ x: 0, y: 0 });
  const pencere = useRef<HTMLDialogElement>(null);
  const noktalar = useRef(new Map<number, { x: number; y: number }>());
  const onceki = useRef({ x: 0, y: 0, uzaklik: 0 });
  const video = sira === fotograflar.length && !!ilan.video;
  const secili = fotograflar[sira] ?? ilan.gorsel;
  function sifirla() {
    setOlcek(1);
    setKayma({ x: 0, y: 0 });
    noktalar.current.clear();
  }
  function gec(adim: number) {
    setSira((eski) => (eski + adim + adet) % adet);
    sifirla();
  }
  useEffect(() => {
    setSira(0);
    setAcik(false);
    sifirla();
  }, [ilan.id]);
  useEffect(() => {
    if (!acik) {
      pencere.current?.close();
      return;
    }
    if (pencere.current && !pencere.current.open) pencere.current.showModal();
    return sayfaKaydirmasiniKilitle();
  }, [acik]);
  function hareket(olay: PointerEvent<HTMLDivElement>) {
    if (!noktalar.current.has(olay.pointerId)) return;
    const eski = noktalar.current.get(olay.pointerId)!;
    noktalar.current.set(olay.pointerId, { x: olay.clientX, y: olay.clientY });
    if (noktalar.current.size === 2) {
      const [a, b] = [...noktalar.current.values()];
      if (!a || !b) return;
      const uzaklik = Math.hypot(a.x - b.x, a.y - b.y);
      if (onceki.current.uzaklik) setOlcek((deger) => sinirla((deger * uzaklik) / onceki.current.uzaklik));
      onceki.current.uzaklik = uzaklik;
    } else if (olcek > 1) {
      const yataySinir = (olay.currentTarget.clientWidth * (olcek - 1)) / 2;
      const dikeySinir = (olay.currentTarget.clientHeight * (olcek - 1)) / 2;
      setKayma((yer) => ({
        x: Math.max(-yataySinir, Math.min(yataySinir, yer.x + olay.clientX - eski.x)),
        y: Math.max(-dikeySinir, Math.min(dikeySinir, yer.y + olay.clientY - eski.y)),
      }));
    }
  }
  return (
    <div className="ilan-galeri" style={s.kok}>
      <button
        type="button"
        className="ilan-galeri-ana"
        aria-label={
          video ? 'Ürün videosunu aç' : `Ürün fotoğrafını büyüt: ${sira + 1} / ${fotograflar.length}`
        }
        onClick={() => setAcik(true)}
        style={s.ana}
      >
        <GaleriResmi
          kaynak={onizleme(video ? ilan.gorsel : secili)}
          alt={ilan.baslik}
          width={560}
          height={320}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={s.onizleme}
        />
        <span style={s.buyut}>{video ? <Play size={19} /> : <Expand size={18} />}</span>
        <span style={s.sayac}>{video ? 'Video' : `${sira + 1} / ${fotograflar.length}`}</span>
      </button>
      {adet > 1 && (
        <div role="group" aria-label="İlan fotoğrafları ve video" style={s.serit}>
          {fotograflar.map((yol, no) => (
            <button
              type="button"
              key={yol}
              aria-label={`${no + 1}. fotoğrafı göster`}
              aria-pressed={sira === no}
              onClick={() => {
                setSira(no);
                sifirla();
              }}
              style={{ ...s.kucuk, borderColor: sira === no ? '#17191b' : '#e6e6e6' }}
            >
              <GaleriResmi
                kaynak={onizleme(yol, true)}
                alt=""
                width={60}
                height={50}
                loading="lazy"
                style={s.kucukResim}
              />
            </button>
          ))}
          {!!ilan.video && (
            <button
              type="button"
              aria-label="Ürün videosunu seç"
              aria-pressed={video}
              onClick={() => {
                setSira(fotograflar.length);
                sifirla();
              }}
              style={{ ...s.kucuk, borderColor: video ? '#17191b' : '#e6e6e6' }}
            >
              <Play size={19} />
              <span style={{ fontSize: 10 }}>Video</span>
            </button>
          )}
        </div>
      )}
      <dialog
        ref={pencere}
        className="ilan-goruntuleyici"
        aria-label={`${ilan.baslik}, fotoğraflar ve video`}
        onClose={() => {
          setAcik(false);
          sifirla();
        }}
        onCancel={() => setAcik(false)}
        onClick={(olay) => {
          if (olay.target === olay.currentTarget) {
            const alan = olay.currentTarget.getBoundingClientRect();
            if (
              olay.clientX < alan.left ||
              olay.clientX > alan.right ||
              olay.clientY < alan.top ||
              olay.clientY > alan.bottom
            )
              setAcik(false);
          }
        }}
        onKeyDown={(olay) => {
          if ((olay.target as HTMLElement).tagName === 'VIDEO') return;
          if (olay.key === 'ArrowLeft') {
            olay.preventDefault();
            gec(-1);
          }
          if (olay.key === 'ArrowRight') {
            olay.preventDefault();
            gec(1);
          }
        }}
      >
        {acik && (
          <div style={s.ic}>
            <div style={s.ust}>
              <span style={s.baslik}>{ilan.baslik}</span>
              {!video && (
                <div style={{ display: 'flex' }}>
                  <button
                    type="button"
                    aria-label="Uzaklaştır"
                    onClick={() => {
                      setOlcek((eski) => sinirla(eski - 0.5));
                      setKayma({ x: 0, y: 0 });
                    }}
                    style={s.kontrol}
                  >
                    <ZoomOut size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Yakınlaştır"
                    onClick={() => setOlcek((eski) => sinirla(eski + 0.5))}
                    style={s.kontrol}
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button type="button" aria-label="Görünümü sıfırla" onClick={sifirla} style={s.kontrol}>
                    <RotateCcw size={18} />
                  </button>
                </div>
              )}
              <button
                type="button"
                autoFocus
                aria-label="Galeriyi kapat"
                onClick={() => setAcik(false)}
                style={s.kontrol}
              >
                <X size={22} />
              </button>
            </div>
            <div style={s.sahne}>
              {video && ilan.video ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VideoOynatici kaynak={ilan.video} baslik={`${ilan.baslik} ürün videosu`} />
                </div>
              ) : (
                <div
                  style={{ ...s.resimAlani, cursor: olcek > 1 ? 'grab' : 'zoom-in' }}
                  onWheel={(olay) => {
                    setOlcek((eski) => sinirla(eski + (olay.deltaY < 0 ? 0.2 : -0.2)));
                    if (olcek <= 1.2) setKayma({ x: 0, y: 0 });
                  }}
                  onDoubleClick={() => {
                    setOlcek((eski) => (eski === 1 ? 2 : 1));
                    setKayma({ x: 0, y: 0 });
                  }}
                  onPointerDown={(olay) => {
                    olay.currentTarget.setPointerCapture(olay.pointerId);
                    noktalar.current.set(olay.pointerId, { x: olay.clientX, y: olay.clientY });
                    onceki.current.uzaklik = 0;
                  }}
                  onPointerMove={hareket}
                  onPointerUp={(olay) => {
                    noktalar.current.delete(olay.pointerId);
                    onceki.current.uzaklik = 0;
                  }}
                  onPointerCancel={() => noktalar.current.clear()}
                >
                  <GaleriResmi
                    kaynak={secili}
                    alt={`${ilan.baslik}, ${sira + 1}. fotoğraf`}
                    draggable={false}
                    loading={acik ? 'eager' : 'lazy'}
                    style={{
                      ...s.tamResim,
                      transform: `translate(${kayma.x}px, ${kayma.y}px) scale(${olcek})`,
                    }}
                  />
                </div>
              )}
              {adet > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Önceki medya"
                    onClick={() => gec(-1)}
                    style={{ ...s.gecis, left: 12 }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki medya"
                    onClick={() => gec(1)}
                    style={{ ...s.gecis, right: 12 }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            <div style={s.alt} aria-live="polite">
              <span>{video ? 'Video' : `${sira + 1} / ${fotograflar.length}`}</span>
              <span>
                {video
                  ? 'Oynatıcı kontrollerini kullanabilirsin.'
                  : `${Math.round(olcek * 100)}% · Yakınlaştırmak için iki kez dokun.`}
              </span>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
const s: Record<string, CSSProperties> = {
  kok: { width: '100%', minWidth: 0 },
  ana: {
    display: 'block',
    position: 'relative',
    width: '100%',
    padding: 0,
    border: '1px solid #e6e6e6',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#f5f5f5',
  },
  onizleme: { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
  buyut: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    background: '#fffffff2',
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sayac: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    fontSize: 11,
    background: '#fffffff2',
    padding: '4px 8px',
    borderRadius: 6,
  },
  serit: { display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 3 },
  kucuk: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: 2,
    width: 68,
    minWidth: 68,
    height: 56,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    background: '#f5f5f5',
    overflow: 'hidden',
  },
  kucukResim: { display: 'block', objectFit: 'contain', width: '100%', height: '100%' },
  ic: { height: '100%', display: 'flex', flexDirection: 'column' },
  ust: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    borderBottom: '1px solid #ffffff16',
    flexShrink: 0,
  },
  baslik: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 13,
    paddingLeft: 4,
  },
  kontrol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    padding: 0,
    border: 0,
    borderRadius: 8,
    background: 'transparent',
    flexShrink: 0,
    cursor: 'pointer',
  },
  sahne: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resimAlani: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    touchAction: 'none',
  },
  tamResim: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    userSelect: 'none',
    willChange: 'transform',
  },
  gecis: {
    position: 'absolute',
    top: 'calc(50% - 22px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    padding: 0,
    border: '1px solid #ffffff30',
    borderRadius: 22,
    background: '#17191b99',
    cursor: 'pointer',
  },
  alt: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    padding: '13px 16px',
    fontSize: 11,
    lineHeight: '18px',
    color: '#d1d1d1',
    borderTop: '1px solid #ffffff16',
    flexShrink: 0,
  },
};
