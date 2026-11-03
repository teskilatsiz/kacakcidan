import { useId } from 'react';
import { Platform, Switch, View } from 'react-native';
import { useTema } from '../tasarim/tema';
import { Alan, Yazi } from './Temel';

export function TelefonBilgisiAlanlari({
  telefon,
  telefonGoster,
  degistir,
  hata,
  disabled = false,
  ilan = false,
}: {
  telefon: string;
  telefonGoster: boolean;
  degistir: (deger: { telefon: string; telefonGoster: boolean }) => void;
  hata?: string;
  disabled?: boolean;
  ilan?: boolean;
}) {
  const { renk, koyu } = useTema();
  const kimlik = useId();
  return (
    <View style={{ gap: 16, minWidth: 0 }}>
      <Alan
        nativeID={`iletisim-telefon-${kimlik}`}
        etiket="Cep telefonu (isteğe bağlı)"
        placeholder="0532 123 45 67"
        value={telefon}
        onChangeText={(deger) => degistir({ telefon: deger, telefonGoster })}
        keyboardType="phone-pad"
        inputMode="tel"
        autoComplete="tel"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={24}
        editable={!disabled}
        hata={hata}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, minWidth: 0 }}>
        <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
          <Yazi style={{ fontSize: 13, fontWeight: '600', lineHeight: 20 }}>
            {ilan ? 'Numaram bu ilanda görünsün' : 'Numaram profilimde görünsün'}
          </Yazi>
          <Yazi style={{ color: renk.gri, fontSize: 12, lineHeight: 19 }}>
            {ilan
              ? 'Açarsan ziyaretçiler numaranı görüp seni arayabilir. Mesajla görüşmeye devam edebilirsin.'
              : 'Yeni ilanlarında da bu tercih kullanılır. Her ilanın numara görünürlüğünü ayrıca değiştirebilirsin.'}
          </Yazi>
        </View>
        <Switch
          {...(Platform.OS === 'web' ? { activeThumbColor: renk.sabitKoyu } : {})}
          ref={(oge) => {
            // React Native Web nativeID'yi dış kapsayıcıya verir; gerçek form girdisi de adlandırılır.
            if (Platform.OS === 'web' && oge) {
              const girdi = oge as unknown as { setAttribute?: (ad: string, deger: string) => void };
              girdi.setAttribute?.('id', `iletisim-gorunurluk-girdisi-${kimlik}`);
              girdi.setAttribute?.('name', `telefon-gorunurlugu-${kimlik}`);
            }
          }}
          nativeID={`iletisim-gorunurluk-${kimlik}`}
          accessibilityLabel={ilan ? 'Cep telefonum bu ilanda görünsün' : 'Cep telefonum profilimde görünsün'}
          value={telefonGoster}
          disabled={disabled}
          onValueChange={(deger) => degistir({ telefon, telefonGoster: deger })}
          trackColor={{ false: koyu ? '#767b84' : '#d0d2d5', true: renk.sari }}
          thumbColor={telefonGoster ? renk.sabitKoyu : renk.murekkep}
          ios_backgroundColor={koyu ? '#767b84' : '#d0d2d5'}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ flexShrink: 0, ...(Platform.OS === 'web' ? { height: 26, width: 52 } : {}) }}
        />
      </View>
    </View>
  );
}
