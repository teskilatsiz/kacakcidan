import { useId } from 'react';
import Star from 'lucide-react-native/icons/star';
import { useTema } from '../tasarim/tema';
import type { DegerlendirmeYildizlariProps } from './DegerlendirmeYildizlari';
import './DegerlendirmeYildizlari.web.css';

const puanAciklamalari = ['Çok kötü', 'Kötü', 'Orta', 'İyi', 'Çok iyi'];

export function DegerlendirmeYildizlari({ puan, degistir, disabled }: DegerlendirmeYildizlariProps) {
  const { renk } = useTema();
  const kimlik = useId();
  return (
    <fieldset className="degerlendirme-puani" disabled={disabled} aria-describedby={`${kimlik}-aciklama`}>
      <legend>Puanın</legend>
      <div className="degerlendirme-yildizlari">
        {puanAciklamalari.map((aciklama, sira) => (
          <label className="degerlendirme-yildizi" key={aciklama}>
            <input
              type="radio"
              id={`${kimlik}-${sira}`}
              name={`satici-puani-${kimlik}`}
              value={sira + 1}
              checked={puan === sira + 1}
              onChange={() => degistir(sira + 1)}
              aria-label={`${sira + 1} yıldız, ${aciklama.toLocaleLowerCase('tr-TR')}`}
            />
            <Star
              aria-hidden
              size={30}
              color={puan >= sira + 1 ? renk.murekkep : renk.gri}
              fill={puan >= sira + 1 ? renk.sari : 'none'}
              strokeWidth={1.5}
            />
          </label>
        ))}
      </div>
      <p id={`${kimlik}-aciklama`} aria-live="polite">
        {puan ? `${puan} / 5 · ${puanAciklamalari[puan - 1]}` : '1 ile 5 arasında bir puan seç.'}
      </p>
    </fieldset>
  );
}
