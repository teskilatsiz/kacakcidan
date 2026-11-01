import { useCallback, useEffect, useId, useRef, useState } from 'react';
import UserRound from 'lucide-react-native/icons/user-round';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import { usePazar } from '../durum/Pazar';
import { useMedyaAdresi } from '../durum/medyaDeposu';
import { useTema } from '../tasarim/tema';
import { HesapMenusuIcerigi } from './HesapMenusuIcerigi';
import { UyelikPenceresi } from './UyelikPenceresi';
import { CikisOnayi } from './CikisOnayi';
import { usePathname } from 'expo-router';

export function HesapMenusu() {
  const { renk } = useTema();
  const { profil, oturum } = usePazar();
  const fotograf = useMedyaAdresi(profil.fotograf);
  const dugme = useRef<HTMLButtonElement>(null);
  const pencere = useRef<HTMLDivElement>(null);
  const [acik, setAcik] = useState(false);
  const [uyelik, setUyelik] = useState<'giris' | 'kayit' | null>(null);
  const [cikis, setCikis] = useState(false);
  const yol = usePathname();
  const [konum, setKonum] = useState({ top: 70, left: 0 });
  const kimlik = useId();
  const kapat = () => pencere.current?.hidePopover();
  const yerlestir = useCallback(() => {
    const kutu = dugme.current?.getBoundingClientRect();
    if (kutu)
      setKonum({
        top: Math.max(12, Math.min(kutu.bottom + 8, window.innerHeight - 280)),
        left: Math.max(12, Math.min(kutu.right - 304, window.innerWidth - 316)),
      });
  }, []);
  useEffect(() => {
    if (!acik) return;
    window.addEventListener('resize', yerlestir);
    return () => window.removeEventListener('resize', yerlestir);
  }, [acik, yerlestir]);
  const acKapat = () => {
    if (acik) {
      kapat();
      return;
    }
    yerlestir();
    pencere.current?.showPopover();
  };

  return (
    <>
      <button
        ref={dugme}
        type="button"
        aria-label={oturum ? 'Hesap menüsünü aç' : 'Giriş ve kayıt seçeneklerini aç'}
        aria-expanded={acik}
        aria-controls={kimlik}
        aria-haspopup="dialog"
        onClick={acKapat}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          minWidth: 44,
          minHeight: 44,
          border: 0,
          padding: '0 4px',
          background: 'transparent',
          color: renk.murekkep,
          font: 'inherit',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {oturum ? (
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              background: renk.acik,
              border: `1px solid ${renk.cizgi}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {fotograf ? (
              <img
                src={fotograf}
                width={32}
                height={32}
                alt="Profil fotoğrafın"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              profil.ad.slice(0, 1).toLocaleUpperCase('tr')
            )}
          </span>
        ) : (
          <>
            <UserRound size={20} color={renk.murekkep} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Giriş yap</span>
          </>
        )}
        <ChevronDown size={13} color={renk.gri} />
      </button>
      <div
        ref={pencere}
        popover="auto"
        id={kimlik}
        role="dialog"
        aria-label="Hesap ve görünüm"
        onToggle={(olay) => setAcik(olay.newState === 'open')}
        style={{
          position: 'fixed',
          inset: 'auto',
          ...konum,
          margin: 0,
          width: 304,
          maxWidth: 'calc(100vw - 24px)',
          maxHeight: 'calc(100dvh - 100px)',
          overflowY: 'auto',
          border: `1px solid ${renk.cizgi}`,
          borderRadius: 14,
          padding: 14,
          background: renk.beyaz,
          color: renk.murekkep,
          boxShadow: `0 12px 36px ${renk.golge}`,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <HesapMenusuIcerigi
          kapat={kapat}
          uyelikAc={(kayit) => setUyelik(kayit ? 'kayit' : 'giris')}
          cikisIste={() => setCikis(true)}
        />
      </div>
      <UyelikPenceresi
        acik={uyelik !== null}
        kayit={uyelik === 'kayit'}
        kapat={() => setUyelik(null)}
        turDegistir={(kayit) => setUyelik(kayit ? 'kayit' : 'giris')}
        donus={yol}
      />
      <CikisOnayi acik={cikis} kapat={() => setCikis(false)} />
    </>
  );
}
