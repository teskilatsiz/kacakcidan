import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Smartphone from 'lucide-react-native/icons/smartphone';
import Laptop from 'lucide-react-native/icons/laptop';
import Gamepad2 from 'lucide-react-native/icons/gamepad-2';
import Armchair from 'lucide-react-native/icons/armchair';
import Shirt from 'lucide-react-native/icons/shirt';
import Camera from 'lucide-react-native/icons/camera';
import CarFront from 'lucide-react-native/icons/car-front';
import Disc3 from 'lucide-react-native/icons/disc-3';
import { renk } from '../tasarim/tema';
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
};

/** Dolgulu simgede düğme ve lens gibi küçük ayrıntılar zeminin rengiyle açık kalır. */
export function KategoriSimgesi({
  kategori,
  dolu = false,
  boyut = 25,
}: {
  kategori: Kategori;
  dolu?: boolean;
  boyut?: number;
}) {
  const Simge = simgeler[kategori];
  return (
    <View style={{ width: boyut, height: boyut }} dataSet={{ 'kategori-simgesi': 'true' }}>
      <Simge size={boyut} color={renk.murekkep} strokeWidth={1.5} fill={dolu ? renk.murekkep : 'none'} />
      {dolu && (
        <Svg
          width={boyut}
          height={boyut}
          viewBox="0 0 24 24"
          fill="none"
          stroke={renk.sari}
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ position: 'absolute', top: 0, left: 0 }}
          pointerEvents="none"
        >
          {kategori === 'telefon' && <Path d="M11 18h2" />}
          {kategori === 'bilgisayar' && <Path d="M5 16h14" />}
          {kategori === 'oyun' && (
            <>
              <Path d="M6 11h4M8 9v4" />
              <Circle cx={15} cy={12} r={0.7} fill={renk.sari} />
              <Circle cx={18} cy={10} r={0.7} fill={renk.sari} />
            </>
          )}
          {kategori === 'ev' && <Path d="M6 10v2.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10" />}
          {kategori === 'fotograf' && <Circle cx={12} cy={13} r={3} />}
          {kategori === 'otomotiv' && (
            <>
              <Path d="M8 7h8l1 2H7z" fill={renk.sari} />
              <Path d="M6.5 14h1M16.5 14h1" />
            </>
          )}
          {kategori === 'koleksiyon' && (
            <>
              <Circle cx={12} cy={12} r={2} fill={renk.sari} />
              <Path d="M6 12c0-1.7.7-3.2 1.8-4.2M18 12c0 1.7-.7 3.2-1.8 4.2" />
            </>
          )}
        </Svg>
      )}
    </View>
  );
}
