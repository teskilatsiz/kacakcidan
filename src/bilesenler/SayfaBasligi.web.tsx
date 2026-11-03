import { useEffect, useRef, useState, type ComponentType } from 'react';
import { usePathname } from 'expo-router';

/** İlk sayfanın metası statik HTML'de hazırdır; gezinti güncelleyicisi gerektiğinde yüklenir. */
export function SayfaBasligi() {
  const yol = usePathname();
  const [Guncelleyici, setGuncelleyici] = useState<ComponentType>();
  const gezintiBasladi = useRef(false);

  useEffect(() => {
    if ((yol === '/' && !gezintiBasladi.current) || Guncelleyici) return;
    // Paket yüklenirken ana sayfaya dönülse de önceki ilanın metası kalmasın.
    gezintiBasladi.current = true;
    let etkin = true;
    void import('./SayfaMetasi')
      .then((modul) => {
        if (etkin) setGuncelleyici(() => modul.SayfaBasligi);
      })
      .catch(() => {
        // Ağ isteği başarısızsa statik metaveri geçerlidir; sonraki gezintide yeniden denenir.
      });
    return () => {
      etkin = false;
    };
  }, [yol, Guncelleyici]);

  return Guncelleyici ? <Guncelleyici /> : null;
}
