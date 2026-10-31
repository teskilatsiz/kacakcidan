import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import X from 'lucide-react-native/icons/x';
import { kalin, renk, useEkran } from '../tasarim/tema';
import { Giris, HareketliBas, useAzaltilmisHareket } from './Hareketli';
import type { PencereProps } from './Pencere.types';
import { KlavyeKaydirma } from './KlavyeKaydirma';

export function Pencere({ acik, kapat, baslik, children, altlik, genis = false }: PencereProps) {
  const { mobil, yukseklik } = useEkran();
  const guvenli = useSafeAreaInsets();
  const azalt = useAzaltilmisHareket();
  return (
    <Modal visible={acik} transparent animationType={azalt ? 'none' : 'fade'} onRequestClose={kapat}>
      <KeyboardAvoidingView style={s.perde} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable accessible={false} onPress={kapat} style={StyleSheet.absoluteFill} />
        <View
          pointerEvents="box-none"
          style={[
            s.kapsayici,
            { paddingTop: guvenli.top + 16 },
            mobil && { justifyContent: 'flex-end', paddingHorizontal: 0, paddingBottom: 0 },
          ]}
        >
          <Giris
            accessibilityViewIsModal
            style={[
              s.pencere,
              { maxWidth: genis ? 760 : 480, maxHeight: yukseklik - guvenli.top - 24 },
              mobil && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
            ]}
          >
            {mobil && <View style={s.tutamak} />}
            <View style={s.baslik}>
              <Text accessibilityRole="header" style={s.baslikYazisi}>
                {baslik}
              </Text>
              <HareketliBas accessibilityLabel="Pencereyi kapat" onPress={kapat} style={s.kapat}>
                <X size={21} color={renk.murekkep} />
              </HareketliBas>
            </View>
            <KlavyeKaydirma
              odagiSinirla
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={{ flexShrink: 1 }}
              contentContainerStyle={{
                gap: 20,
                paddingHorizontal: 22,
                paddingTop: 8,
                paddingBottom: altlik ? 20 : Math.max(24, guvenli.bottom),
              }}
            >
              {children}
            </KlavyeKaydirma>
            {altlik ? (
              <View style={[s.altlik, { paddingBottom: Math.max(16, guvenli.bottom) }]}>{altlik}</View>
            ) : null}
          </Giris>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  perde: { flex: 1, backgroundColor: '#111111a6' },
  kapsayici: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  pencere: { backgroundColor: '#fff', borderRadius: 20, width: '100%', overflow: 'hidden', flexShrink: 1 },
  tutamak: {
    width: 34,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#d3d3d3',
    alignSelf: 'center',
    marginTop: 10,
  },
  baslik: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  baslikYazisi: {
    flex: 1,
    fontFamily: kalin,
    fontSize: 23,
    lineHeight: 31,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: renk.murekkep,
  },
  kapat: {
    height: 44,
    width: 44,
    borderWidth: 1,
    borderColor: renk.cizgi,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  altlik: {
    flexShrink: 0,
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    backgroundColor: '#fff',
  },
});
