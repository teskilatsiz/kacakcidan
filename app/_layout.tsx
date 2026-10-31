import '../src/tasarim/global.css';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFontlar } from '../src/tasarim/useFontlar';
import { PazarSaglayici } from '../src/durum/PazarSaglayici';
import { Yazi } from '../src/bilesenler/Temel';
import { SayfaBasligi } from '../src/bilesenler/SayfaBasligi';
import { SayfaGecisi } from '../src/bilesenler/SayfaGecisi';
import { KlavyeOdagi } from '../src/bilesenler/KlavyeOdagi';

export default function KokDuzen() {
  const [fontlarHazir, fontHatasi] = useFontlar();
  const yol = usePathname();
  if (Platform.OS !== 'web' && !fontlarHazir && !fontHatasi)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Yazi>Birazdan buradayız.</Yazi>
      </View>
    );
  const icerik = (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
  return (
    <SafeAreaProvider>
      <PazarSaglayici>
        <SayfaBasligi />
        <SayfaGecisi />
        <KlavyeOdagi />
        {Platform.OS === 'web' ? (
          <View style={{ flex: 1 }} dataSet={{ uygulama: 'true' }}>
            {icerik}
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
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
