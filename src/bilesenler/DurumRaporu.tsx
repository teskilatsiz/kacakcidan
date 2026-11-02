import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Camera from 'lucide-react-native/icons/camera';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { Baslik, Pencere, Yazi } from './Temel';
import { useTema } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import { durumRaporu, type DurumKaniti } from '../veri/urunDurumu';
import type { Ilan } from '../veri/ilanlar';

export function DurumRaporu({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();
  const satirlar = useMemo(() => durumRaporu(ilan), [ilan]);
  const [acikKanit, setAcikKanit] = useState<DurumKaniti>();
  const [tumunuGoster, setTumunuGoster] = useState(false);
  if (!satirlar.length) return null;
  const kanitSayisi = satirlar.filter((satir) => satir.kanit).length;
  const belirtilenler = satirlar.filter((satir) => satir.deger);
  const eksikSayisi = satirlar.length - belirtilenler.length;
  const gorunenler = tumunuGoster ? satirlar : belirtilenler;
  return (
    <View style={{ gap: 16, minWidth: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <ClipboardList size={20} color={renk.murekkep} />
        <Baslik style={{ fontSize: 18, lineHeight: 26, flex: 1, minWidth: 130 }}>Ürün durumu</Baslik>
        <Yazi style={{ fontSize: 12, color: renk.gri }}>Satıcı beyanı</Yazi>
      </View>
      <View>
        {!belirtilenler.length && !tumunuGoster && (
          <Yazi style={{ color: renk.gri, fontSize: 13 }}>Satıcı ürün durumu için ayrıntı eklememiş.</Yazi>
        )}
        {gorunenler.map((satir, sira) => (
          <View
            key={satir.ad}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
              paddingVertical: 11,
              borderTopWidth: sira ? 1 : 0,
              borderColor: renk.cizgi,
            }}
          >
            <Yazi style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 21, color: renk.gri }}>
              {satir.ad}
            </Yazi>
            <View style={{ flex: 1.2, minWidth: 0, alignItems: 'flex-start', gap: 4 }}>
              <Yazi style={{ fontSize: 13, lineHeight: 21, color: satir.deger ? renk.murekkep : renk.gri }}>
                {satir.deger ? `${satir.deger}${satir.birim ? ` ${satir.birim}` : ''}` : 'Belirtilmedi'}
              </Yazi>
              {satir.kanit ? (
                <HareketliBas
                  accessibilityRole="button"
                  accessibilityLabel={`${satir.ad}: kanıt fotoğrafını aç`}
                  onPress={() => setAcikKanit(satir.kanit)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 44 }}
                >
                  <Camera size={14} color={renk.murekkep} />
                  <Yazi style={{ fontSize: 12, textDecorationLine: 'underline' }}>Fotoğrafı incele</Yazi>
                </HareketliBas>
              ) : null}
            </View>
          </View>
        ))}
      </View>
      {!!eksikSayisi && (
        <HareketliBas
          accessibilityRole="button"
          accessibilityState={{ expanded: tumunuGoster }}
          onPress={() => setTumunuGoster((deger) => !deger)}
          style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
        >
          <Yazi style={{ fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' }}>
            {tumunuGoster ? 'Daha az göster' : `Belirtilmeyen ${eksikSayisi} bilgiyi gör`}
          </Yazi>
        </HareketliBas>
      )}
      <View style={{ padding: 14, borderRadius: 10, backgroundColor: renk.zemin, gap: 6 }}>
        <Yazi style={{ fontSize: 12, lineHeight: 19, fontWeight: '600' }}>
          {kanitSayisi ? `${kanitSayisi} bilgi için kanıt fotoğrafı var` : 'Kanıt fotoğrafı eklenmemiş'}
        </Yazi>
        <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
          Bilgileri ve varsa fotoğrafları satıcı ekledi. Bu bilgiler için bağımsız doğrulama kaydı yok.
        </Yazi>
      </View>
      <Pencere acik={Boolean(acikKanit)} baslik="Kanıt fotoğrafı" kapat={() => setAcikKanit(undefined)}>
        {acikKanit ? (
          <View style={{ gap: 14 }}>
            <Yazi style={{ fontWeight: '700', fontSize: 15 }}>
              {acikKanit.alan}: {acikKanit.deger}
            </Yazi>
            <Gorsel
              source={gorselKaynagi(acikKanit.gorsel)}
              accessibilityLabel={`${acikKanit.alan} için satıcının eklediği fotoğraf`}
              style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 10, backgroundColor: renk.zemin }}
              contentFit="contain"
            />
            <Yazi style={{ color: renk.gri, fontSize: 13, lineHeight: 21 }}>
              Bu fotoğraf satıcı tarafından eklendi. Fotoğrafın varlığı, bilginin bağımsız olarak doğrulandığı
              anlamına gelmez.
            </Yazi>
          </View>
        ) : null}
      </Pencere>
    </View>
  );
}
