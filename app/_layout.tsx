import '../src/tasarim/global.css';
import { KeyboardAvoidingView, Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { Slot, usePathname, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFontlar } from '../src/tasarim/useFontlar';
import { PazarSaglayici } from '../src/durum/PazarSaglayici';
import { Yazi } from '../src/bilesenler/Temel';
import { SayfaBasligi } from '../src/bilesenler/SayfaBasligi';
import { SayfaGecisi } from '../src/bilesenler/SayfaGecisi';
import { KlavyeOdagi } from '../src/bilesenler/KlavyeOdagi';
import { TemaSaglayici } from '../src/tasarim/TemaSaglayici';
import { EkranSaglayici } from '../src/tasarim/EkranSaglayici';
import { useTema } from '../src/tasarim/tema';
import { ProjeBilgilendirmesi } from '../src/bilesenler/ProjeBilgilendirmesi';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const koyu = useColorScheme() === 'dark';
  const arkaPlan = koyu ? '#1b1d1f' : '#f7f7f4';
  const yazi = koyu ? '#f3f3f0' : '#202224';
  const ikincil = koyu ? '#b1b3b5' : '#686b6e';

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: arkaPlan,
      }}
    >
      <View style={{ width: '100%', maxWidth: 380, alignItems: 'center', gap: 12 }}>
        <Text style={{ color: yazi, fontSize: 20, fontWeight: '700', textAlign: 'center' }}>
          Sayfa açılamadı
        </Text>
        <Text style={{ color: ikincil, fontSize: 14, lineHeight: 21, textAlign: 'center' }}>
          {__DEV__ ? error.message : 'Bağlantını kontrol edip yeniden deneyebilirsin.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={retry}
          style={{
            minHeight: 44,
            minWidth: 140,
            marginTop: 4,
            paddingHorizontal: 18,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffd12f',
          }}
        >
          <Text style={{ color: '#17191b', fontSize: 14, fontWeight: '700' }}>Yeniden dene</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function KokDuzen() {
  return (
    <EkranSaglayici>
      <TemaSaglayici>
        <UygulamaDuzeni />
      </TemaSaglayici>
    </EkranSaglayici>
  );
}

function UygulamaDuzeni() {
  const { renk, koyu } = useTema();
  const [fontlarHazir, fontHatasi] = useFontlar();
  const yol = usePathname();
  if (Platform.OS !== 'web' && !fontlarHazir && !fontHatasi)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: renk.beyaz }}>
        <Yazi>Birazdan buradayız.</Yazi>
      </View>
    );
  const icerik = (
    <>
      <StatusBar style={koyu ? 'light' : 'dark'} />
      <Slot />
    </>
  );
  return (
    <SafeAreaProvider>
      <PazarSaglayici>
        <SayfaBasligi />
        <SayfaGecisi />
        <KlavyeOdagi />
        <ProjeBilgilendirmesi />
        {Platform.OS === 'web' ? (
          <View style={{ flex: 1 }} dataSet={{ uygulama: 'true' }}>
            {icerik}
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1, backgroundColor: renk.beyaz }} edges={['top', 'left', 'right']}>
            {yol === '/mesajlar' ? (
              icerik
            ) : (
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              >
                {icerik}
              </KeyboardAvoidingView>
            )}
          </SafeAreaView>
        )}
      </PazarSaglayici>
    </SafeAreaProvider>
  );
}
