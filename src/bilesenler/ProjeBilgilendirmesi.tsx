import { useState } from 'react';
import { View } from 'react-native';
import { Buton, Pencere, Yazi } from './Temel';
import { useTema } from '../tasarim/tema';

/** Uygulama her açıldığında mevcut deneyimin bir demo olduğunu açıkça belirtir. */
export function ProjeBilgilendirmesi() {
  const [acik, setAcik] = useState(true);
  const { renk } = useTema();

  return (
    <Pencere acik={acik} kapat={() => setAcik(false)} baslik="Bilgilendirme">
      <View style={{ gap: 14 }}>
        <Yazi style={{ fontSize: 15, lineHeight: 24 }}>
          Kaçakçıdan, gerçek alışveriş işlemlerinin yürütüldüğü bir pazaryeri platformu değildir. Pazaryeri
          arayüzünü tanıtmak amacıyla hazırlanmış bir projedir.
        </Yazi>
        <Yazi style={{ fontSize: 14, lineHeight: 22, color: renk.gri }}>
          İlanlar ve profiller örnek içeriktir. Hesap ve ilan bilgileri yalnızca bu cihazda saklanır; başka
          kullanıcılara yayımlanmaz. Mesaj, teklif, param güvende, ödeme ve kargo adımları gerçek bir işlem
          başlatmaz.
        </Yazi>
        <Buton onPress={() => setAcik(false)} style={{ alignSelf: 'stretch', marginTop: 4 }}>
          Anladım
        </Buton>
      </View>
    </Pencere>
  );
}
