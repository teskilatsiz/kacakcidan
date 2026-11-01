import { useState } from 'react';
import UserRound from 'lucide-react-native/icons/user-round';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import { useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { Pencere, Yazi } from './Temel';
import { HesapMenusuIcerigi } from './HesapMenusuIcerigi';

export function HesapMenusu() {
  const { renk } = useTema();
  const [acik, setAcik] = useState(false);
  return (
    <>
      <HareketliBas
        accessibilityLabel="Hesap menüsünü aç"
        accessibilityState={{ expanded: acik }}
        onPress={() => setAcik(true)}
        style={{ flexDirection: 'row', minHeight: 44, alignItems: 'center', gap: 7 }}
      >
        <UserRound size={20} color={renk.murekkep} />
        <Yazi style={{ fontSize: 12, fontWeight: '600' }}>Hesabım</Yazi>
        <ChevronDown size={13} color={renk.gri} />
      </HareketliBas>
      <Pencere acik={acik} kapat={() => setAcik(false)} baslik="Hesabım">
        <HesapMenusuIcerigi kapat={() => setAcik(false)} />
      </Pencere>
    </>
  );
}
