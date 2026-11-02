import { forwardRef, memo, type ComponentPropsWithoutRef } from 'react';
import { Link } from 'expo-router';
import { usePazar } from '../durum/Pazar';
import { urunKategorisiMi } from '../veri/anaKategoriler';
import { gorselKaynagi } from '../veri/gorseller';
import { ilanBedeli, ilanYolu, type Ilan } from '../veri/ilanlar';
import { Gorsel } from './Gorsel';
import type { VitrinIzgarasiProps } from './VitrinIzgarasi';
import '../tasarim/vitrin.web.css';

const gorselBoyutu =
  '(max-width: 699px) calc(50vw - 26px), (max-width: 999px) calc((100vw - 96px) / 3), (max-width: 1099px) calc((100vw - 116px) / 4), (max-width: 1249px) calc((100vw - 156px) / 4), (max-width: 1439px) calc((100vw - 176px) / 5), 253px';
const gorselStili = { position: 'absolute' as const, inset: 0 };

// Router web'de onClick de sağlar; React Native'e ait onPress DOM'a taşınmaz.
const VitrinBaglantisi = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'> & { onPress?: unknown }>(
  function VitrinBaglantisi({ onPress: _onPress, ...nitelikler }, ref) {
    return <a {...nitelikler} ref={ref} />;
  },
);

/** Vitrinde ölçü ve etkileşim katmanları her kart için tekrar kurulmaz. */
export function VitrinIzgarasi({ ilanlar, araya, arayaSira = 4 }: VitrinIzgarasiProps) {
  const { favoriler, favoriDegistir } = usePazar();
  const kartlar = ilanlar.map((ilan, sira) => (
    <VitrinKarti
      key={ilan.id}
      ilan={ilan}
      favori={favoriler.includes(ilan.id)}
      favoriDegistir={favoriDegistir}
      oncelik={sira === 0 ? 'high' : sira === 1 ? 'normal' : undefined}
    />
  ));
  if (araya)
    kartlar.splice(
      Math.max(0, Math.min(arayaSira, kartlar.length)),
      0,
      <div key="ilanini-one-cikar" data-ilan-hucresi="true">
        {araya}
      </div>,
    );
  return (
    <div className="vitrin-izgarasi" data-ilan-izgarasi="normal">
      {kartlar}
    </div>
  );
}

const VitrinKarti = memo(function VitrinKarti({
  ilan,
  favori,
  favoriDegistir,
  oncelik,
}: {
  ilan: Ilan;
  favori: boolean;
  favoriDegistir: (id: string) => void;
  oncelik?: 'high' | 'normal';
}) {
  return (
    <article
      className="vitrin-karti"
      data-ilan-hucresi="true"
      data-ilan-karti="true"
      data-vitrin-karti="true"
      data-liste-karti="false"
    >
      <Link href={ilanYolu(ilan)} asChild>
        <VitrinBaglantisi className="vitrin-karti-baglantisi">
          <div className="vitrin-karti-gorseli">
            <Gorsel
              source={gorselKaynagi(ilan.gorsel)}
              style={gorselStili}
              contentFit="cover"
              priority={oncelik}
              sizes={gorselBoyutu}
              accessibilityLabel=""
              transition={0}
              cachePolicy="memory-disk"
            />
            {ilan.oneCikan && <span className="vitrin-karti-rozet">ÖNE ÇIKAN</span>}
          </div>
          <div className="vitrin-karti-icerigi">
            {urunKategorisiMi(ilan.kategori) && (
              <div className="vitrin-karti-etiketler" data-ilan-etiketleri="true">
                <span className="vitrin-karti-etiket" aria-label={`Ürün durumu: ${ilan.durum}`}>
                  {ilan.durum}
                </span>
                {!!ilan.takas && (
                  <span className="vitrin-karti-etiket" aria-label="Takasa açık">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="m8 3-4 4 4 4M4 7h16m-4 14 4-4-4-4m4 4H4" />
                    </svg>
                    Takas
                  </span>
                )}
              </div>
            )}
            <h2 className="vitrin-karti-basligi">{ilan.baslik}</h2>
            <p className="vitrin-karti-fiyati">{ilanBedeli(ilan)}</p>
            <div className="vitrin-karti-konumu" data-ilan-konumu="true">
              <span className="vitrin-karti-konum-adi">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{ilan.konum}</span>
              </span>
              <span className="vitrin-karti-zamani">{ilan.zaman}</span>
            </div>
          </div>
        </VitrinBaglantisi>
      </Link>
      <button
        type="button"
        className="vitrin-karti-favori"
        aria-label={favori ? `${ilan.baslik} favorilerden çıkar` : `${ilan.baslik} favorilere ekle`}
        aria-pressed={favori}
        onClick={() => favoriDegistir(ilan.id)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={favori ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      </button>
    </article>
  );
});
