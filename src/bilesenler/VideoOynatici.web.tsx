import { useEffect, useRef, useState } from 'react';
import { useMedyaAdresi } from '../durum/medyaDeposu';
import type { VideoOynaticiProps } from './VideoOynatici.types';

export function VideoOynatici({
  kaynak,
  baslik = 'Ürün videosu',
  poster,
  aktif = true,
  sahne = false,
}: VideoOynaticiProps) {
  const adres = useMedyaAdresi(kaynak);
  const posterAdresi = useMedyaAdresi(poster);
  const video = useRef<HTMLVideoElement>(null);
  const [hata, setHata] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  useEffect(() => {
    setHata(false);
    setYukleniyor(false);
    const eleman = video.current;
    const durdur = () => {
      if (document.hidden && document.pictureInPictureElement !== eleman) eleman?.pause();
    };
    document.addEventListener('visibilitychange', durdur);
    return () => {
      document.removeEventListener('visibilitychange', durdur);
      if (!eleman) return;
      eleman.pause();
      if (document.pictureInPictureElement === eleman) void document.exitPictureInPicture().catch(() => {});
      eleman.removeAttribute('src');
      eleman.load();
    };
  }, [adres]);
  useEffect(() => {
    if (!aktif) video.current?.pause();
  }, [aktif]);
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: sahne ? '100%' : undefined,
        minHeight: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 10,
        background: '#17191b',
        color: '#fff',
      }}
    >
      <video
        key={adres ?? kaynak}
        ref={video}
        src={adres}
        aria-label={baslik}
        controls
        playsInline
        preload="metadata"
        poster={posterAdresi}
        onLoadStart={() => {
          setHata(false);
        }}
        onWaiting={() => setYukleniyor(true)}
        onPlaying={() => setYukleniyor(false)}
        onCanPlay={() => setYukleniyor(false)}
        onPause={() => setYukleniyor(false)}
        onError={() => {
          setHata(true);
          setYukleniyor(false);
        }}
        style={{
          display: 'block',
          width: '100%',
          height: sahne ? '100%' : 'auto',
          maxHeight: sahne ? '100%' : 420,
          objectFit: 'contain',
          background: '#17191b',
        }}
      >
        Tarayıcın bu videoyu oynatamıyor.
      </video>
      {yukleniyor && !hata && (
        <div
          role="status"
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '6px 10px',
            borderRadius: 8,
            background: '#17191bcc',
            color: '#fff',
            fontSize: 12,
            pointerEvents: 'none',
          }}
        >
          Video yükleniyor…
        </div>
      )}
      {hata && (
        <div
          role="alert"
          style={{
            position: 'absolute',
            inset: 0,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: '#17191b',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <strong>Video oynatılamadı</strong>
          <span style={{ fontSize: 12, lineHeight: '20px', color: '#d1d1d1' }}>
            Bağlantını kontrol edip tekrar dene. Dosya bu tarayıcıda desteklenmiyor olabilir.
          </span>
          <button
            type="button"
            onClick={() => {
              setHata(false);
              video.current?.load();
            }}
            style={{
              minHeight: 44,
              padding: '0 16px',
              background: 'transparent',
              border: '1px solid #ffffff55',
              borderRadius: 8,
              color: '#fff',
              font: 'inherit',
              fontWeight: 600,
            }}
          >
            Tekrar dene
          </button>
        </div>
      )}
    </div>
  );
}
