import { lazy, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Pencere } from './Temel';
import { useTema } from '../tasarim/tema';

const UyelikIcerigi = lazy(() => import('./HesapIcerigi').then((modul) => ({ default: modul.HesapIcerigi })));

export function UyelikPenceresi({
  acik,
  kayit,
  kapat,
  turDegistir,
  donus,
}: {
  acik: boolean;
  kayit: boolean;
  kapat: () => void;
  turDegistir: (kayit: boolean) => void;
  donus: string;
}) {
  const { renk } = useTema();
  return (
    <Pencere acik={acik} kapat={kapat} baslik="Hesabım">
      {acik && (
        <Suspense
          fallback={
            <View style={{ minHeight: 240, justifyContent: 'center' }}>
              <ActivityIndicator color={renk.murekkep} accessibilityLabel="Üyelik formu yükleniyor" />
            </View>
          }
        >
          <UyelikIcerigi modal kayit={kayit} turDegistir={turDegistir} tamamlandi={kapat} donus={donus} />
        </Suspense>
      )}
    </Pencere>
  );
}
