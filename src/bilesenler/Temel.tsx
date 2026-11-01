import { cloneElement, isValidElement, useId, type ComponentRef, type ReactNode, type Ref } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type ViewStyle,
} from 'react-native';
import Search from 'lucide-react-native/icons/search';
import { font, kalin, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';

export function Yazi({ style, ...props }: TextProps) {
  const { renk } = useTema();

  return (
    <Text
      {...props}
      style={[{ fontFamily: font, fontSize: 14, lineHeight: 22, color: renk.murekkep }, style]}
    />
  );
}
export function Baslik({
  children,
  buyuk = false,
  style,
}: {
  children: ReactNode;
  buyuk?: boolean;
  style?: TextProps['style'];
}) {
  const { mobil } = useEkran();
  return (
    <Yazi
      role="heading"
      aria-level={buyuk ? 1 : 2}
      style={[
        {
          fontFamily: kalin,
          fontWeight: '700',
          fontSize: buyuk ? (mobil ? 28 : 32) : mobil ? 22 : 26,
          lineHeight: buyuk ? (mobil ? 36 : 40) : 34,
          letterSpacing: -1.1,
        },
        style,
      ]}
    >
      {children}
    </Yazi>
  );
}
export function Buton({
  children,
  onPress,
  ikincil = false,
  koyu = false,
  simge,
  disabled,
  style,
  testID,
}: {
  children: ReactNode;
  onPress?: () => void;
  ikincil?: boolean;
  koyu?: boolean;
  simge?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { renk } = useTema();
  const s = useStiller();
  const icerikRengi = koyu ? renk.tersYazi : ikincil ? renk.murekkep : renk.vurguYazi;
  const dugmeSimgesi = isValidElement<{ color?: string }>(simge)
    ? cloneElement(simge, { color: icerikRengi })
    : simge;

  return (
    <HareketliBas
      accessibilityRole="button"
      testID={testID}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        s.buton,
        ikincil && s.ikincil,
        koyu && { backgroundColor: renk.murekkep, borderColor: renk.murekkep },
        disabled && { opacity: 0.45 },
        style,
      ]}
    >
      {dugmeSimgesi}
      <Yazi
        style={{
          fontFamily: kalin,
          fontWeight: '700',
          color: icerikRengi,
        }}
      >
        {children}
      </Yazi>
    </HareketliBas>
  );
}
export function SimgeButon({
  children,
  onPress,
  etiket,
  style,
}: {
  children: ReactNode;
  onPress: () => void;
  etiket: string;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useStiller();

  return (
    <HareketliBas
      accessibilityLabel={etiket}
      accessibilityRole="button"
      onPress={onPress}
      style={[s.simgeButon, style]}
    >
      {children}
    </HareketliBas>
  );
}
export function Alan({
  etiket,
  hata,
  style,
  ref,
  ...props
}: TextInputProps & {
  etiket?: string;
  hata?: string;
  ref?: Ref<ComponentRef<typeof TextInput>>;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}) {
  const { renk, koyu } = useTema();
  const s = useStiller();

  const kimlik = useId();
  const { mobil } = useEkran();
  const alanKimligi = props.id ?? props.nativeID ?? `alan-${kimlik}`;
  const hataKimligi = `${alanKimligi}-hata`;
  return (
    <View style={{ gap: 8 }}>
      {!!etiket && <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 13 }}>{etiket}</Yazi>}
      <TextInput
        ref={ref}
        accessibilityLabel={etiket || props.placeholder}
        placeholderTextColor={renk.gri}
        keyboardAppearance={koyu ? 'dark' : 'light'}
        {...props}
        nativeID={alanKimligi}
        aria-invalid={props['aria-invalid'] ?? !!hata}
        aria-describedby={props['aria-describedby'] ?? (hata ? hataKimligi : undefined)}
        underlineColorAndroid="transparent"
        dataSet={{ ...props.dataSet, 'form-girdisi': 'true' }}
        style={[
          s.girdi,
          mobil && { fontSize: 16 },
          props.multiline && { height: 128, paddingTop: 14, textAlignVertical: 'top' },
          hata && { borderColor: renk.hataCizgi },
          style,
        ]}
      />
      {!!hata && (
        <Yazi nativeID={hataKimligi} accessibilityRole="alert" style={{ color: renk.hata, fontSize: 12 }}>
          {hata}
        </Yazi>
      )}
    </View>
  );
}
export { AraKutusu } from './AramaCubugu';

export { Pencere } from './Pencere';

export function BosDurum({
  simge,
  baslik,
  aciklama,
  eylem,
}: {
  simge?: ReactNode;
  baslik: string;
  aciklama: string;
  eylem?: ReactNode;
}) {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const bosSimge = isValidElement<{ color?: string; size?: number; strokeWidth?: number; fill?: string }>(
    simge,
  ) ? (
    cloneElement(simge, { color: renk.murekkep, size: 28, strokeWidth: 1.6, fill: 'none' })
  ) : (
    <Search color={renk.murekkep} size={28} strokeWidth={1.6} />
  );
  return (
    <View
      style={{
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        maxWidth: 560,
        paddingVertical: mobil ? 44 : 64,
        paddingHorizontal: 20,
        gap: 14,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: renk.acik,
          borderWidth: 1,
          borderColor: renk.cizgi,
        }}
      >
        {bosSimge}
      </View>
      <Baslik style={{ textAlign: 'center' }}>{baslik}</Baslik>
      <Yazi style={{ textAlign: 'center', color: renk.gri, maxWidth: 390 }}>{aciklama}</Yazi>
      {eylem}
    </View>
  );
}
export function Secenek({
  secili,
  children,
  onPress,
}: {
  secili: boolean;
  children: ReactNode;
  onPress: () => void;
}) {
  const { renk } = useTema();
  const s = useStiller();

  return (
    <HareketliBas
      accessibilityRole="button"
      accessibilityState={{ selected: secili }}
      onPress={onPress}
      style={[s.secenek, secili && { borderColor: renk.murekkep, backgroundColor: renk.murekkep }]}
    >
      <Yazi style={{ fontSize: 13, color: secili ? renk.tersYazi : renk.gri, fontWeight: '500' }}>
        {children}
      </Yazi>
    </HareketliBas>
  );
}
const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    buton: {
      minHeight: 48,
      paddingHorizontal: 22,
      borderRadius: 10,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: renk.sari,
      borderWidth: 1,
      borderColor: renk.sari,
    },
    ikincil: { backgroundColor: renk.beyaz, borderColor: renk.cizgi },
    simgeButon: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      backgroundColor: renk.beyaz,
    },
    girdi: {
      fontFamily: font,
      fontSize: 14,
      color: renk.murekkep,
      height: 50,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      paddingHorizontal: 14,
      backgroundColor: renk.beyaz,
      ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
    },
    secenek: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      minHeight: 44,
      backgroundColor: renk.beyaz,
    },
  }),
);
