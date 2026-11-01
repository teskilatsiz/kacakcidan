import { useId, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import LayoutGrid from 'lucide-react-native/icons/layout-grid';
import Search from 'lucide-react-native/icons/search';
import X from 'lucide-react-native/icons/x';
import { usePazar } from '../durum/Pazar';
import { font, useTema, temaStilleri } from '../tasarim/tema';
import { aramaOnerileri, type AramaOnerisi, type AramaKutusuProps } from '../veri/arama';
import { kategoriAgaci } from '../veri/kategoriler';
import { ilanYolu, kategoriler, para } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { HareketliBas } from './Hareketli';

export function AraKutusu({
  deger,
  degistir,
  ara,
  buyuk = false,
  inline = false,
  secildi,
}: AramaKutusuProps) {
  const { renk } = useTema();
  const s = useStiller();

  const { tumIlanlar } = usePazar();
  const kimlik = useId();
  const router = useRouter();
  const girdi = useRef<ComponentRef<typeof TextInput>>(null);
  const [acik, setAcik] = useState(false);
  const sorgu = deger.trim();
  const oneriler = useMemo(
    () => aramaOnerileri(tumIlanlar, kategoriler, kategoriAgaci, deger).slice(0, sorgu ? 6 : 4),
    [tumIlanlar, deger, sorgu],
  );
  function tamamla(oneri?: AramaOnerisi) {
    setAcik(false);
    Keyboard.dismiss();
    secildi?.();
    if (oneri?.tur === 'ilan') router.push(ilanYolu(oneri.ilan));
    else if (oneri?.tur === 'kategori') {
      degistir('');
      router.push({
        pathname: '/kesfet',
        params: {
          kategori: oneri.kategori,
          altKategori: oneri.altKategori,
          marka: oneri.marka,
          model: oneri.model,
          q: '',
        },
      });
    } else {
      const metin = oneri?.sorgu ?? sorgu;
      degistir(metin);
      ara(metin);
    }
  }
  return (
    <View style={{ width: '100%', zIndex: acik ? 60 : 1 }}>
      <View style={[s.cubuk, buyuk && s.buyuk, acik && { borderColor: renk.murekkep }]}>
        <Search size={20} color={renk.gri} />
        <TextInput
          ref={girdi}
          nativeID={`arama-girdisi-${kimlik}`}
          accessibilityLabel="İlanlarda ara"
          value={deger}
          onChangeText={(metin) => {
            degistir(metin);
            setAcik(true);
          }}
          onFocus={() => setAcik(true)}
          onBlur={() => setAcik(false)}
          placeholder="Ne arıyorsun?"
          placeholderTextColor={renk.gri}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          maxLength={150}
          onSubmitEditing={() => tamamla()}
          style={s.girdi}
        />
        {deger.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aramayı temizle"
            onPress={() => {
              degistir('');
              girdi.current?.focus();
            }}
            style={s.temizle}
          >
            <X color={renk.murekkep} size={17} />
          </Pressable>
        )}
        <HareketliBas
          vurgu="dugme"
          accessibilityRole="button"
          accessibilityLabel="İlan ara"
          onPress={() => tamamla()}
          style={s.ara}
        >
          <Text style={s.araYazi}>Ara</Text>
          <Search size={17} color={renk.vurguYazi} />
        </HareketliBas>
      </View>
      {acik && (sorgu.length > 0 || oneriler.length > 0) && (
        <View style={[s.panel, inline && s.inline]}>
          {!sorgu && <Text style={s.ipucu}>Aramaya buradan başla</Text>}
          <ScrollView keyboardShouldPersistTaps="always" style={{ maxHeight: 330 }}>
            {!!sorgu && (
              <Pressable accessibilityRole="button" onPress={() => tamamla()} style={s.satir}>
                <View style={s.simge}>
                  <Search size={17} color={renk.gri} />
                </View>
                <Text numberOfLines={1} style={[s.baslik, { flex: 1 }]}>
                  “{sorgu}” için tüm ilanları gör
                </Text>
                <ArrowUpRight size={16} color={renk.gri} />
              </Pressable>
            )}
            {oneriler.map((oneri) => (
              <Pressable
                key={oneri.id}
                accessibilityRole="button"
                onPress={() => tamamla(oneri)}
                style={[s.satir, oneri.tur === 'kategori' && s.kategori]}
              >
                {oneri.tur === 'ilan' ? (
                  <Image source={gorselKaynagi(oneri.ilan.gorsel)} style={s.resim} />
                ) : (
                  <View style={s.simge}>
                    {oneri.tur === 'kategori' ? (
                      <LayoutGrid size={17} color={renk.murekkep} />
                    ) : (
                      <Search size={17} color={renk.gri} />
                    )}
                  </View>
                )}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    numberOfLines={1}
                    style={[s.baslik, oneri.tur === 'kategori' && { color: renk.murekkep }]}
                  >
                    {oneri.baslik}
                  </Text>
                  <Text numberOfLines={1} style={s.aciklama}>
                    {oneri.tur === 'ilan'
                      ? `${para(oneri.ilan.fiyat)} · ${oneri.ilan.konum}`
                      : oneri.tur === 'kategori'
                        ? `${oneri.seviye} · ${oneri.adet} ilan`
                        : `Arama önerisi · ${oneri.adet} ilan`}
                  </Text>
                </View>
                <ArrowUpRight size={16} color={renk.gri} />
              </Pressable>
            ))}
          </ScrollView>
          {!!sorgu && oneriler.length === 0 && (
            <Text style={s.ipucu}>Eşleşen öneri yok. Arayarak tüm ilanlara bakabilirsin.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    cubuk: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 52,
      paddingLeft: 14,
      paddingRight: 5,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      backgroundColor: renk.acik,
    },
    buyuk: { minHeight: 58, backgroundColor: renk.beyaz, borderRadius: 12 },
    girdi: {
      flex: 1,
      minWidth: 0,
      height: 46,
      padding: 0,
      fontFamily: font,
      fontSize: 14,
      color: renk.murekkep,
    },
    ara: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 44,
      paddingHorizontal: 14,
      backgroundColor: renk.sari,
      borderRadius: 7,
    },
    araYazi: { fontFamily: font, fontSize: 13, fontWeight: '700', color: renk.vurguYazi },
    temizle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    panel: {
      position: 'absolute',
      top: '100%',
      marginTop: 6,
      left: 0,
      right: 0,
      backgroundColor: renk.beyaz,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: renk.cizgi,
      boxShadow: '0 12px 32px #17191b1a',
      overflow: 'hidden',
    },
    inline: { position: 'relative', top: 0, marginTop: 8, boxShadow: 'none' },
    ipucu: {
      fontFamily: font,
      fontSize: 11,
      lineHeight: 17,
      color: renk.gri,
      paddingVertical: 11,
      paddingHorizontal: 14,
    },
    satir: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      minHeight: 50,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    kategori: { borderTopWidth: 1, borderTopColor: renk.cizgi },
    resim: { width: 38, height: 38, borderRadius: 6, backgroundColor: renk.zemin },
    simge: { width: 38, alignItems: 'center', justifyContent: 'center' },
    baslik: { fontFamily: font, fontSize: 13, lineHeight: 19, fontWeight: '500', color: renk.murekkep },
    aciklama: { fontFamily: font, fontSize: 11, lineHeight: 17, color: renk.gri },
  }),
);
