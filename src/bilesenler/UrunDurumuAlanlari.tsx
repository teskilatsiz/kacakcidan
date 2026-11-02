import { useState } from 'react';
import { View } from 'react-native';
import Camera from 'lucide-react-native/icons/camera';
import Check from 'lucide-react-native/icons/check';
import { Alan, Buton, Pencere, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';
import { HareketliBas } from './Hareketli';
import { Gorsel } from './Gorsel';
import { useEkran, useTema } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import type { OzellikAlani } from '../veri/ozellikler';
import type { DurumKaniti } from '../veri/urunDurumu';

type Props = {
  alanlar: readonly OzellikAlani[];
  degerler: Record<string, string>;
  degistir: (alan: string, deger: string) => void;
  kanitlar: readonly DurumKaniti[];
  kanitDegistir: (alan: string, kanit?: DurumKaniti) => void;
  fotograflar: readonly string[];
  hatalar: Record<string, string>;
};

export function UrunDurumuAlanlari({
  alanlar,
  degerler,
  degistir,
  kanitlar,
  kanitDegistir,
  fotograflar,
  hatalar,
}: Props) {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const [kanitAlani, setKanitAlani] = useState<string>();
  const secili = kanitlar.find((kanit) => kanit.alan === kanitAlani);
  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <Yazi style={{ fontSize: 15, fontWeight: '700' }}>Ayrıntılı durum bilgileri</Yazi>
        <Yazi style={{ color: renk.gri, fontSize: 12, lineHeight: 19 }}>
          Bildiğin bilgileri seç; emin olmadıklarını boş bırak veya bilinmiyor olarak belirt. İstersen ilgili
          bilginin fotoğrafını ekle.
        </Yazi>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {alanlar.map((alan) => {
          const kanit = kanitlar.find((kanit) => kanit.alan === alan.ad);
          const deger = degerler[alan.ad] ?? '';
          return (
            <View
              key={alan.ad}
              style={{ flexBasis: mobil ? '100%' : '47%', flexGrow: 1, minWidth: 0, gap: 2 }}
            >
              {alan.sayisal ? (
                <Alan
                  nativeID={`durum-${alan.ad.toLocaleLowerCase('tr-TR')}`}
                  etiket={`${alan.ad}${alan.birim ? ` (${alan.birim})` : ''}`}
                  placeholder="Ölçüyü yaz"
                  value={deger}
                  keyboardType="number-pad"
                  onChangeText={(yeni) => degistir(alan.ad, yeni.replace(/[^0-9]/g, ''))}
                  maxLength={4}
                  hata={hatalar[alan.ad]}
                />
              ) : (
                <SecimAlani
                  etiket={alan.ad}
                  deger={deger}
                  secenekler={alan.secenekler.map((ad) => ({ id: ad, ad }))}
                  degistir={(yeni) => degistir(alan.ad, yeni)}
                  ipucu="Belirtilmedi"
                />
              )}
              {deger && deger !== 'Bilinmiyor' ? (
                <HareketliBas
                  accessibilityRole="button"
                  accessibilityLabel={`${alan.ad} için ${kanit ? 'kanıt fotoğrafını değiştir' : 'kanıt fotoğrafı seç'}`}
                  onPress={() => setKanitAlani(alan.ad)}
                  style={{
                    minHeight: 44,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Camera size={14} color={renk.murekkep} />
                  <Yazi style={{ fontSize: 12, textDecorationLine: 'underline' }}>
                    {kanit ? 'Kanıt fotoğrafı seçildi' : 'Kanıt fotoğrafı seç'}
                  </Yazi>
                </HareketliBas>
              ) : null}
            </View>
          );
        })}
      </View>
      <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 19 }}>
        Bu bilgiler ilanda satıcı beyanı olarak görünür. Fotoğraf eklemek bağımsız doğrulama sağlamaz.
      </Yazi>
      <Pencere acik={Boolean(kanitAlani)} baslik="Kanıt fotoğrafı seç" kapat={() => setKanitAlani(undefined)}>
        <View style={{ gap: 16 }}>
          <Yazi style={{ fontSize: 14, fontWeight: '600' }}>
            {kanitAlani}: {kanitAlani ? degerler[kanitAlani] : ''}
          </Yazi>
          <Yazi style={{ fontSize: 13, lineHeight: 21, color: renk.gri }}>
            İlan fotoğraflarından bu bilgiyi gösteren fotoğrafı seç. Kişisel bilgilerin fotoğrafta
            görünmediğinden emin ol.
          </Yazi>
          {fotograflar.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {fotograflar.map((gorsel, sira) => (
                <HareketliBas
                  key={gorsel}
                  accessibilityRole="button"
                  accessibilityLabel={`${sira + 1}. ilan fotoğrafını ${kanitAlani} için seç${secili?.gorsel === gorsel ? ', seçili fotoğraf' : ''}`}
                  onPress={() => {
                    if (!kanitAlani) return;
                    kanitDegistir(kanitAlani, { alan: kanitAlani, deger: degerler[kanitAlani]!, gorsel });
                    setKanitAlani(undefined);
                  }}
                  style={{
                    flexBasis: '30%',
                    flexGrow: 1,
                    maxWidth: '48%',
                    aspectRatio: 1,
                    minWidth: 72,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  <Gorsel
                    source={gorselKaynagi(gorsel)}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                  {secili?.gorsel === gorsel ? (
                    <View
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: 6,
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: renk.sari,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={16} color={renk.vurguYazi} />
                    </View>
                  ) : null}
                </HareketliBas>
              ))}
            </View>
          ) : (
            <Yazi style={{ fontSize: 13, lineHeight: 21 }}>Önce fotoğraf adımından bir fotoğraf ekle.</Yazi>
          )}
          {secili && kanitAlani ? (
            <Buton
              ikincil
              onPress={() => {
                kanitDegistir(kanitAlani);
                setKanitAlani(undefined);
              }}
            >
              Kanıt fotoğrafını kaldır
            </Buton>
          ) : null}
        </View>
      </Pencere>
    </View>
  );
}
