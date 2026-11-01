import { useTema, temaStilleri } from '../tasarim/tema';
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
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
const GaleriResmi = memo(function GaleriResmi({
  kaynak,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { kaynak: string }) {
  const adres = useMedyaAdresi(kaynak);
  return <img {...props} src={adres} />;
});
export function IlanGalerisi({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();
  const s = useStiller();

  const fotograflar = useMemo(
    () => Array.from(new Set([ilan.gorsel, ...(ilan.fotografler ?? [])].filter(Boolean))),
    [ilan.gorsel, ilan.fotografler],
  );
  const adet = fotograflar.length + (ilan.video ? 1 : 0);
  const [sira, setSira] = useState(0);
  const [acik, setAcik] = useState(false);
  const [olcek, setOlcek] = useState(1);
  const [kayma, setKayma] = useState({ x: 0, y: 0 });
  const [tamResimHazir, setTamResimHazir] = useState('');
  const pencere = useRef<HTMLDialogElement>(null);
  const galeri = useRef<HTMLDivElement>(null);
  const onceAcikti = useRef(false);
  const noktalar = useRef(new Map<number, { x: number; y: number }>());
  const onceki = useRef({ x: 0, y: 0, uzaklik: 0 });
  const oncedenYuklenen = useRef(new Set<string>());
  const video = sira === fotograflar.length && !!ilan.video;
  const secili = fotograflar[sira] ?? ilan.gorsel;
  const poster = ilan.videoPoster || ilan.gorsel;
  function sifirla() {
    setOlcek(1);
    setKayma({ x: 0, y: 0 });
    noktalar.current.clear();
  }
  function gec(adim: number) {
    setSira((eski) => (eski + adim + adet) % adet);
    sifirla();
  }
  function sec(no: number) {
    setSira(no);
    sifirla();
  }
  useEffect(() => {
    setSira(0);
    setAcik(false);
    sifirla();
  }, [ilan.id]);
  useEffect(() => {
    const baglanti = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (baglanti?.saveData || baglanti?.effectiveType === '2g' || baglanti?.effectiveType === 'slow-2g')
      return;
    for (const fark of [-1, 1]) {
      const yol = fotograflar[(sira + fark + adet) % adet];
      if (!yol || yol.startsWith('medya:')) continue;
      const kaynak = acik ? yol : onizleme(yol);
      if (oncedenYuklenen.current.has(kaynak)) continue;
      oncedenYuklenen.current.add(kaynak);
      const resim = new Image();
      resim.decoding = 'async';
      resim.src = kaynak;
    }
  }, [sira, fotograflar, adet, acik]);
  useEffect(() => {
    if (!acik) {
      pencere.current?.close();
      if (onceAcikti.current)
        galeri.current
          ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
          ?.focus({ preventScroll: true });
      onceAcikti.current = false;
      return;
    }
    onceAcikti.current = true;
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
    <div ref={galeri} className="ilan-galeri" style={s.kok}>
      {video && !acik && ilan.video ? (
        <div className="ilan-galeri-ana" style={{ ...s.ana, display: 'flex' }}>
          <VideoOynatici kaynak={ilan.video} poster={poster} baslik={`${ilan.baslik} ürün videosu`} sahne />
          <button
            type="button"
            aria-label="Videoyu büyük aç"
            onClick={() => setAcik(true)}
            style={{ ...s.buyut, border: 0, top: 10, bottom: 'auto', zIndex: 2 }}
          >
            <Expand size={18} color={renk.murekkep} />
          </button>
        </div>
      ) : (
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
            kaynak={onizleme(video ? poster : secili)}
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
      )}
      {adet > 1 && (
        <div role="group" aria-label="İlan fotoğrafları ve video" style={s.serit}>
          {fotograflar.map((yol, no) => (
            <button
              type="button"
              key={yol}
              aria-label={`${no + 1}. fotoğrafı göster`}
              aria-pressed={sira === no}
              onClick={() => sec(no)}
              style={{ ...s.kucuk, borderColor: sira === no ? renk.murekkep : renk.cizgi }}
            >
              <GaleriResmi
                kaynak={onizleme(yol, true)}
                alt=""
                width={60}
                height={50}
                loading={no <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                style={s.kucukResim}
              />
            </button>
          ))}
          {!!ilan.video && (
            <button
              type="button"
              aria-label="Ürün videosunu seç"
              aria-pressed={video}
              onClick={() => sec(fotograflar.length)}
              style={{
                ...s.kucuk,
                position: 'relative',
                padding: 0,
                borderColor: video ? renk.murekkep : renk.cizgi,
              }}
            >
              <GaleriResmi
                kaynak={poster}
                alt=""
                width={68}
                height={56}
                decoding="async"
                style={{ ...s.kucukResim, objectFit: 'cover' }}
              />
              <span style={s.videoRozeti}>
                <Play size={17} color="#fff" fill="#fff" />
              </span>
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
              <button
                type="button"
                autoFocus
                aria-label="Galeriyi kapat"
                onClick={() => setAcik(false)}
                style={s.kontrol}
              >
                <X size={22} color="#fff" />
              </button>
            </div>
            {!video && (
              <div style={s.araclar}>
                <button
                  type="button"
                  aria-label="Uzaklaştır"
                  onClick={() => {
                    setOlcek((eski) => sinirla(eski - 0.5));
                    setKayma({ x: 0, y: 0 });
                  }}
                  style={s.kontrol}
                >
                  <ZoomOut size={20} color="#fff" />
                </button>
                <button
                  type="button"
                  aria-label="Yakınlaştır"
                  onClick={() => setOlcek((eski) => sinirla(eski + 0.5))}
                  style={s.kontrol}
                >
                  <ZoomIn size={20} color="#fff" />
                </button>
                <button type="button" aria-label="Görünümü sıfırla" onClick={sifirla} style={s.kontrol}>
                  <RotateCcw size={18} color="#fff" />
                </button>
                <span style={{ color: '#d1d1d1', fontSize: 12, minWidth: 42, textAlign: 'center' }}>
                  {Math.round(olcek * 100)}%
                </span>
              </div>
            )}
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
                  <VideoOynatici
                    kaynak={ilan.video}
                    poster={poster}
                    baslik={`${ilan.baslik} ürün videosu`}
                    sahne
                  />
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
                  {onizleme(secili) !== secili && (
                    <GaleriResmi
                      kaynak={onizleme(secili)}
                      alt=""
                      aria-hidden
                      draggable={false}
                      style={{
                        ...s.tamResim,
                        position: 'absolute',
                        inset: 0,
                        transform: `translate(${kayma.x}px, ${kayma.y}px) scale(${olcek})`,
                      }}
                    />
                  )}
                  <GaleriResmi
                    kaynak={secili}
                    alt={`${ilan.baslik}, ${sira + 1}. fotoğraf`}
                    draggable={false}
                    loading={acik ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setTamResimHazir(secili)}
                    style={{
                      ...s.tamResim,
                      opacity: onizleme(secili) === secili || tamResimHazir === secili ? 1 : 0,
                      transform: `translate(${kayma.x}px, ${kayma.y}px) scale(${olcek})`,
                    }}
                  />
                </div>
              )}
              {adet > 1 && !video && (
                <>
                  <button
                    type="button"
                    aria-label="Önceki medya"
                    onClick={() => gec(-1)}
                    style={{ ...s.gecis, left: 12 }}
                  >
                    <ChevronLeft size={24} color="#fff" />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki medya"
                    onClick={() => gec(1)}
                    style={{ ...s.gecis, right: 12 }}
                  >
                    <ChevronRight size={24} color="#fff" />
                  </button>
                </>
              )}
            </div>
            <div style={s.alt}>
              <button type="button" aria-label="Önceki medya" onClick={() => gec(-1)} style={s.kontrol}>
                <ChevronLeft size={22} color="#fff" />
              </button>
              <div role="group" aria-label="Galeride medya seç" style={s.modalSerit}>
                {fotograflar.map((yol, no) => (
                  <button
                    type="button"
                    key={yol}
                    aria-label={`${no + 1}. fotoğrafa geç`}
                    aria-pressed={sira === no}
                    onClick={() => sec(no)}
                    style={{ ...s.modalKucuk, borderColor: sira === no ? renk.sari : '#ffffff44' }}
                  >
                    <GaleriResmi
                      kaynak={onizleme(yol, true)}
                      alt=""
                      width={56}
                      height={44}
                      decoding="async"
                      style={s.kucukResim}
                    />
                  </button>
                ))}
                {!!ilan.video && (
                  <button
                    type="button"
                    aria-label="Videoya geç"
                    aria-pressed={video}
                    onClick={() => sec(fotograflar.length)}
                    style={{
                      ...s.modalKucuk,
                      position: 'relative',
                      borderColor: video ? renk.sari : '#ffffff44',
                    }}
                  >
                    <GaleriResmi
                      kaynak={poster}
                      alt=""
                      width={56}
                      height={44}
                      style={{ ...s.kucukResim, objectFit: 'cover' }}
                    />
                    <span style={s.videoRozeti}>
                      <Play size={17} color="#fff" fill="#fff" />
                    </span>
                  </button>
                )}
              </div>
              <button type="button" aria-label="Sonraki medya" onClick={() => gec(1)} style={s.kontrol}>
                <ChevronRight size={22} color="#fff" />
              </button>
            </div>
            <div
              aria-live="polite"
              style={{ color: '#d1d1d1', textAlign: 'center', padding: '0 16px 10px', fontSize: 11 }}
            >
              {video
                ? 'Video · Oynatmak için oynatıcı kontrollerini kullan.'
                : `${sira + 1} / ${fotograflar.length} · Yakınlaştırmak için iki kez dokun.`}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
const useStiller = temaStilleri((renk): Record<string, CSSProperties> => ({
  kok: { width: '100%', minWidth: 0 },
  ana: {
    display: 'block',
    position: 'relative',
    width: '100%',
    padding: 0,
    border: `1px solid ${renk.cizgi}`,
    borderRadius: 12,
    overflow: 'hidden',
    background: renk.acik,
  },
  onizleme: { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
  buyut: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    background: renk.beyaz,
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
    background: renk.beyaz,
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
    background: renk.acik,
    overflow: 'hidden',
  },
  kucukResim: { display: 'block', objectFit: 'contain', width: '100%', height: '100%' },
  videoRozeti: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#17191b66',
    color: '#fff',
  },
  araclar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    gap: 4,
    flexShrink: 0,
  },
  modalSerit: {
    display: 'flex',
    minWidth: 0,
    gap: 8,
    overflowX: 'auto',
    alignItems: 'center',
    flex: 1,
    padding: '4px 0',
  },
  modalKucuk: {
    width: 56,
    minWidth: 56,
    height: 44,
    padding: 0,
    border: '2px solid #ffffff44',
    borderRadius: 6,
    background: '#17191b',
    overflow: 'hidden',
    cursor: 'pointer',
  },
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
    color: '#fff',
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
    padding: '8px 12px',
    fontSize: 11,
    lineHeight: '18px',
    color: '#d1d1d1',
    borderTop: '1px solid #ffffff16',
    flexShrink: 0,
    alignItems: 'center',
  },
}));
