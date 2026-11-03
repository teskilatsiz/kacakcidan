import { useState } from 'react';
import { useEkran, useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { menuyuErtele } from './ErtelenenMenu';
import { Pencere, Yazi } from './Temel';
import { IskeletParcasi, YuklemeIskeleti } from './YuklemeIskeleti';

const tercihler = menuyuErtele(() => import('./CerezTercihleri'));

export function CerezAyarlariDugmesi() {
  const { renk } = useTema();
  const { kompakt } = useEkran();
  const [acik, setAcik] = useState(false);
  const kapat = () => setAcik(false);
  return (
    <>
      <HareketliBas
        accessibilityRole="button"
        onHoverIn={tercihler.onYukle}
        onFocus={tercihler.onYukle}
        onPressIn={tercihler.onYukle}
        onPress={() => setAcik(true)}
        style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', paddingVertical: 8 }}
      >
        <Yazi style={{ color: renk.gri, fontSize: 14 }}>Çerezler ve cihaz verileri</Yazi>
      </HareketliBas>
      <Pencere acik={acik} kapat={kapat} baslik="Çerezler ve cihaz verileri" alttan={kompakt}>
        {acik && (
          <tercihler.Icerik
            ozellikler={{ kapat }}
            bekleme={
              <YuklemeIskeleti etiket="Cihaz verileri" style={{ gap: 20, paddingVertical: 12 }}>
                <IskeletParcasi yukseklik={18} genislik="90%" />
                <IskeletParcasi yukseklik={56} />
                <IskeletParcasi yukseklik={56} />
                <IskeletParcasi yukseklik={48} genislik="75%" />
              </YuklemeIskeleti>
            }
          />
        )}
      </Pencere>
    </>
  );
}
