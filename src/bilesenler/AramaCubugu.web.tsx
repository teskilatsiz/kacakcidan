import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useRouter } from 'expo-router';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import LayoutGrid from 'lucide-react-native/icons/layout-grid';
import Search from 'lucide-react-native/icons/search';
import X from 'lucide-react-native/icons/x';
import { usePazar } from '../durum/Pazar';
import { useMedyaAdresi } from '../durum/medyaDeposu';
import { renk } from '../tasarim/tema';
import { aramaOnerileri, type AramaOnerisi, type AramaKutusuProps } from '../veri/arama';
import { kategoriAgaci } from '../veri/kategoriler';
import { ilanYolu, kategoriler, para } from '../veri/ilanlar';

type Satir = AramaOnerisi | { id: 'tum-sonuclar'; tur: 'tum'; baslik: string; sorgu: string };

function OneriResmi({ kaynak }: { kaynak: string }) {
  const adres = useMedyaAdresi(kaynak);
  return <img src={adres} alt="" width={38} height={38} loading="eager" decoding="async" style={s.resim} />;
}

export function AraKutusu({
  deger,
  degistir,
  ara,
  buyuk = false,
  inline = false,
  secildi,
}: AramaKutusuProps) {
  const { tumIlanlar } = usePazar();
  const router = useRouter();
  const kimlik = useId();
  const kutu = useRef<HTMLDivElement>(null);
  const girdi = useRef<HTMLInputElement>(null);
  const [acik, setAcik] = useState(false);
  const [aktif, setAktif] = useState(-1);
  const sorgu = deger.trim();
  const oneriler = useMemo(
    () => aramaOnerileri(tumIlanlar, kategoriler, kategoriAgaci, deger),
    [tumIlanlar, deger],
  );
  const satirlar: Satir[] = useMemo(
    () =>
      sorgu
        ? [
            { id: 'tum-sonuclar', tur: 'tum', baslik: `“${sorgu}” için tüm ilanları gör`, sorgu },
            ...oneriler.slice(0, 6),
          ]
        : oneriler,
    [sorgu, oneriler],
  );
  const gorunur = acik && satirlar.length > 0;
  const listeId = `arama-${kimlik}`;

  useEffect(() => {
    setAktif(-1);
  }, [deger]);
  useEffect(() => {
    const disariBasildi = (olay: PointerEvent) => {
      if (olay.target instanceof Node && !kutu.current?.contains(olay.target)) {
        setAcik(false);
        setAktif(-1);
      }
    };
    document.addEventListener('pointerdown', disariBasildi);
    return () => document.removeEventListener('pointerdown', disariBasildi);
  }, []);
  useEffect(() => {
    if (gorunur && aktif >= 0)
      document.getElementById(`${listeId}-${aktif}`)?.scrollIntoView({ block: 'nearest' });
  }, [aktif, gorunur, listeId]);

  function tamamla(satir?: Satir) {
    setAcik(false);
    setAktif(-1);
    secildi?.();
    if (satir?.tur === 'ilan') {
      router.push(ilanYolu(satir.ilan));
    } else if (satir?.tur === 'kategori') {
      degistir('');
      router.push({
        pathname: '/kesfet',
        params: {
          kategori: satir.kategori,
          altKategori: satir.altKategori,
          marka: satir.marka,
          model: satir.model,
          q: '',
        },
      });
    } else {
      const metin = satir?.sorgu ?? sorgu;
      degistir(metin);
      ara(metin);
    }
  }
  function tus(olay: KeyboardEvent<HTMLInputElement>) {
    if (olay.nativeEvent.isComposing) return;
    if (olay.key === 'ArrowDown' || olay.key === 'ArrowUp') {
      olay.preventDefault();
      setAcik(true);
      setAktif((eski) =>
        olay.key === 'ArrowDown'
          ? Math.min(eski + 1, satirlar.length - 1)
          : eski < 0
            ? satirlar.length - 1
            : Math.max(0, eski - 1),
      );
    } else if (gorunur && (olay.key === 'Home' || olay.key === 'End')) {
      olay.preventDefault();
      setAktif(olay.key === 'Home' ? 0 : satirlar.length - 1);
    } else if (olay.key === 'Escape') {
      olay.preventDefault();
      setAcik(false);
      setAktif(-1);
    } else if (olay.key === 'Enter') {
      olay.preventDefault();
      tamamla(gorunur && aktif >= 0 ? satirlar[aktif] : undefined);
    }
  }

  return (
    <div
      ref={kutu}
      style={{ ...s.kok, zIndex: acik ? 60 : 1 }}
      onBlur={(olay) => {
        if (!olay.currentTarget.contains(olay.relatedTarget)) {
          setAcik(false);
          setAktif(-1);
        }
      }}
    >
      <div style={{ ...s.cubuk, ...(buyuk ? s.buyuk : {}), ...(acik ? s.odak : {}) }}>
        <Search size={20} color={renk.gri} aria-hidden />
        <input
          ref={girdi}
          id={`arama-girdisi-${kimlik}`}
          name="q"
          data-arama-girdisi
          role="combobox"
          aria-label="İlanlarda ara"
          aria-autocomplete="list"
          aria-expanded={gorunur}
          aria-controls={gorunur ? listeId : undefined}
          aria-activedescendant={gorunur && aktif >= 0 ? `${listeId}-${aktif}` : undefined}
          type="text"
          inputMode="search"
          autoComplete="off"
          enterKeyHint="search"
          maxLength={150}
          placeholder={buyuk ? 'Ne arıyorsun? iPhone, koltuk, bisiklet…' : 'İlanlarda ara'}
          value={deger}
          onChange={(olay) => {
            degistir(olay.target.value);
            setAcik(true);
            setAktif(-1);
          }}
          onFocus={() => {
            setAcik(true);
            setAktif(-1);
          }}
          onKeyDown={tus}
          style={s.girdi}
        />
        {deger.length > 0 && (
          <button
            type="button"
            aria-label="Aramayı temizle"
            style={s.temizle}
            onClick={() => {
              degistir('');
              setAktif(-1);
              setAcik(true);
              girdi.current?.focus();
            }}
          >
            <X size={17} />
          </button>
        )}
        <button
          type="button"
          aria-label="İlan ara"
          data-vurgu="dugme"
          data-arama-dugmesi
          style={{ ...s.ara, ...(buyuk ? { minHeight: 44 } : {}) }}
          onClick={() => tamamla()}
        >
          <span>Ara</span>
          <ArrowRight size={17} color={renk.murekkep} aria-hidden />
        </button>
      </div>
      {gorunur && (
        <div style={{ ...s.panel, ...(inline ? s.inline : {}) }}>
          {!sorgu && <div style={s.ipucu}>Aramaya buradan başla</div>}
          <div
            role="listbox"
            id={listeId}
            aria-label={sorgu ? 'Arama önerileri' : 'Önerilen aramalar'}
            style={s.liste}
            onPointerDown={(olay) => olay.preventDefault()}
          >
            {satirlar.map((satir, sira) => (
              <div
                key={satir.id}
                id={`${listeId}-${sira}`}
                role="option"
                aria-selected={aktif === sira}
                tabIndex={-1}
                onPointerMove={(olay) => {
                  // Açılan panel sabit imlecin altında kalsa da klavye seçimi değişmez.
                  if (olay.pointerType === 'mouse' || olay.pointerType === 'pen') setAktif(sira);
                }}
                onClick={() => tamamla(satir)}
                style={{
                  ...s.satir,
                  backgroundColor: aktif === sira ? renk.sariSoluk : 'transparent',
                  ...(satir.tur === 'kategori' ? s.kategori : {}),
                }}
              >
                {satir.tur === 'ilan' ? (
                  <OneriResmi kaynak={satir.ilan.gorsel} />
                ) : (
                  <span style={s.simge}>
                    {satir.tur === 'kategori' ? (
                      <LayoutGrid size={17} color={renk.murekkep} />
                    ) : (
                      <Search size={17} color={renk.gri} />
                    )}
                  </span>
                )}
                <span style={s.metin}>
                  <span
                    style={{ ...s.baslik, ...(satir.tur === 'kategori' ? { color: renk.murekkep } : {}) }}
                  >
                    {satir.baslik}
                  </span>
                  {satir.tur === 'ilan' && (
                    <span style={s.aciklama}>
                      {para(satir.ilan.fiyat)} <span style={{ color: '#6b6b6b' }}>· {satir.ilan.konum}</span>
                    </span>
                  )}
                  {satir.tur === 'kategori' && (
                    <span style={s.aciklama}>
                      {satir.seviye} · {satir.adet} ilan
                    </span>
                  )}
                  {satir.tur === 'sorgu' && <span style={s.aciklama}>Arama önerisi · {satir.adet} ilan</span>}
                </span>
                <ArrowUpRight size={16} color={renk.gri} aria-hidden />
              </div>
            ))}
          </div>
          {!!sorgu && oneriler.length === 0 && (
            <div style={s.ipucu}>Eşleşen öneri yok. Arayarak tüm ilanlara bakabilirsin.</div>
          )}
        </div>
      )}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  kok: {
    width: '100%',
    position: 'relative',
    minWidth: 0,
    fontFamily: 'DM Sans, sans-serif',
    color: renk.murekkep,
  },
  cubuk: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    padding: '3px 4px 3px 12px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
  },
  buyuk: { minHeight: 58, backgroundColor: '#fff', borderColor: '#dadada', borderRadius: 12 },
  odak: { borderColor: renk.murekkep },
  girdi: {
    width: 0,
    flex: 1,
    minWidth: 0,
    height: 44,
    padding: 0,
    margin: 0,
    border: 0,
    outline: 0,
    background: 'transparent',
    font: 'inherit',
    fontSize: 14,
    color: 'inherit',
    appearance: 'none',
  },
  ara: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: 0,
    borderRadius: 7,
    minHeight: 44,
    padding: '0 14px',
    backgroundColor: renk.sari,
    font: 'inherit',
    fontSize: 13,
    fontWeight: 700,
    color: renk.murekkep,
    cursor: 'pointer',
    flexShrink: 0,
  },
  temizle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    border: 0,
    background: 'transparent',
    borderRadius: 6,
    cursor: 'pointer',
    flexShrink: 0,
  },
  panel: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    borderRadius: 12,
    border: '1px solid #e6e6e6',
    backgroundColor: '#fff',
    boxShadow: '0 12px 32px #17191b1a',
    overflow: 'hidden',
    textAlign: 'left',
  },
  inline: { position: 'relative', top: 'auto', marginTop: 8, boxShadow: 'none' },
  liste: {
    maxHeight: 'min(340px, max(110px, calc(100dvh - 190px)))',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    touchAction: 'pan-y',
    padding: 5,
  },
  ipucu: { padding: '11px 14px', fontSize: 11, lineHeight: '17px', color: renk.gri },
  satir: {
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    minHeight: 48,
    padding: '8px 9px',
    borderRadius: 7,
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  kategori: { borderTop: '1px solid #eeeeee', borderRadius: 0 },
  resim: {
    display: 'block',
    width: 38,
    height: 38,
    objectFit: 'cover',
    borderRadius: 6,
    backgroundColor: renk.zemin,
    flexShrink: 0,
  },
  simge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    minHeight: 30,
    flexShrink: 0,
  },
  metin: { display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0, gap: 1 },
  baslik: {
    display: 'block',
    fontSize: 13,
    lineHeight: '19px',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  aciklama: {
    display: 'block',
    fontSize: 11,
    lineHeight: '17px',
    color: renk.gri,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
