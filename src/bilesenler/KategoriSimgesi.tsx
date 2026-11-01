import { View } from 'react-native';
import Smartphone from 'lucide-react-native/icons/smartphone';
import Laptop from 'lucide-react-native/icons/laptop';
import Gamepad2 from 'lucide-react-native/icons/gamepad-2';
import Armchair from 'lucide-react-native/icons/armchair';
import Shirt from 'lucide-react-native/icons/shirt';
import Camera from 'lucide-react-native/icons/camera';
import CarFront from 'lucide-react-native/icons/car-front';
import Disc3 from 'lucide-react-native/icons/disc-3';
import Bike from 'lucide-react-native/icons/bike';
import Baby from 'lucide-react-native/icons/baby';
import Guitar from 'lucide-react-native/icons/guitar';
import BookOpen from 'lucide-react-native/icons/book-open';
import Puzzle from 'lucide-react-native/icons/puzzle';
import Flower2 from 'lucide-react-native/icons/flower-2';
import Sparkles from 'lucide-react-native/icons/sparkles';
import CircuitBoard from 'lucide-react-native/icons/circuit-board';
import BriefcaseBusiness from 'lucide-react-native/icons/briefcase-business';
import Landmark from 'lucide-react-native/icons/landmark';
import { useTema } from '../tasarim/tema';
import type { Kategori } from '../veri/ilanlar';

const simgeler = {
  telefon: Smartphone,
  bilgisayar: Laptop,
  oyun: Gamepad2,
  ev: Armchair,
  moda: Shirt,
  fotograf: Camera,
  otomotiv: CarFront,
  koleksiyon: Disc3,
  spor: Bike,
  'anne-bebek': Baby,
  muzik: Guitar,
  kitap: BookOpen,
  hobi: Puzzle,
  bahce: Flower2,
  'kisisel-bakim': Sparkles,
  'teknik-elektronik': CircuitBoard,
  ofis: BriefcaseBusiness,
  antika: Landmark,
};

/** Vurgu, simgenin iç boşluklarını kapatmadan çizgi kalınlığını artırır. */
export function KategoriSimgesi({
  kategori,
  dolu = false,
  boyut = 25,
}: {
  kategori: Kategori;
  dolu?: boolean;
  boyut?: number;
}) {
  const { renk } = useTema();
  const Simge = simgeler[kategori];
  return (
    <View style={{ width: boyut, height: boyut }} dataSet={{ 'kategori-simgesi': 'true' }}>
      <Simge
        size={boyut}
        color={dolu ? renk.vurguYazi : renk.murekkep}
        strokeWidth={dolu ? 2 : 1.6}
        fill="none"
      />
    </View>
  );
}
