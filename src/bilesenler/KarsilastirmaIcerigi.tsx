import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, View } from 'react-native';
import { Link } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Check from 'lucide-react-native/icons/check';
import Plus from 'lucide-react-native/icons/plus';
import { fiyatFarki, karsilastirmaAdaylari, karsilastirmaSatirlari } from '../veri/ilanKarsilastirma';
import { ilanBedeli, ilanYolu, para, type Ilan } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { useEkran, useTema } from '../tasarim/tema';
import { Alan, Yazi } from './Temel';
import { Gorsel } from './Gorsel';
import { Giris, HareketliBas } from './Hareketli';

type Props = {
  baglam: Ilan;
  ilanlar: Ilan[];
  secimler: [Ilan | undefined, Ilan | undefined];
  degistir: (sira: 0 | 1, ilan: Ilan) => void;
  kapat: () => void;
  gecmisiTemizle: () => void;
};

export default function KarsilastirmaIcerigi({
  baglam,
  ilanlar,
  secimler,
  degistir,
  kapat,
  gecmisiTemizle,
}: Props) {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const [secilecek, setSecilecek] = useState<0 | 1>();
  const [arama, setArama] = useState('');
  const [yalnizFarklar, setYalnizFarklar] = useState(false);
  const ilkDugme = useRef<ComponentRef<typeof HareketliBas>>(null);
  const ikinciDugme = useRef<ComponentRef<typeof HareketliBas>>(null);
  const [ilk, ikinci] = secimler;
  const adaylar = useMemo(
    () => karsilastirmaAdaylari(ilanlar, baglam, secimler[secilecek === 0 ? 1 : 0]?.id, arama),
    [ilanlar, baglam, ilk?.id, ikinci?.id, secilecek, arama],
  );
  const satirlar = useMemo(() => (ilk && ikinci ? karsilastirmaSatirlari(ilk, ikinci) : []), [ilk, ikinci]);
  const fark = ilk && ikinci ? fiyatFarki(ilk, ikinci) : undefined;
  const farkMetni =
    fark === undefined
      ? 'İlanların fiyatlarını ve belirtilen özelliklerini yan yana görebilirsin.'
      : fark === 0
        ? 'İki ilanın fiyatı aynı.'
        : `2. ilan ${para(Math.abs(fark))} ${fark > 0 ? 'daha pahalı.' : 'daha uygun.'}`;
  const secimiBitir = (sira: 0 | 1) => {
    Keyboard.dismiss();
    setSecilecek(undefined);
    setArama('');
    requestAnimationFrame(() => (sira === 0 ? ilkDugme : ikinciDugme).current?.focus());
  };

  if (secilecek !== undefined)
    return (
      <Giris
        key={`secim-${secilecek}`}
        dataSet={{ 'karsilastirma-secici': String(secilecek + 1) }}
        style={{ gap: 16, minWidth: 0 }}
      >
        <HareketliBas
          accessibilityLabel="İlan seçimini iptal et"
          onPress={() => secimiBitir(secilecek)}
          style={{
            alignSelf: 'flex-start',
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ArrowLeft size={18} color={renk.murekkep} />
          <Yazi style={{ fontWeight: '600' }}>Karşılaştırmaya dön</Yazi>
        </HareketliBas>
        <View style={{ gap: 6 }}>
          <Yazi style={{ fontWeight: '700', fontSize: 17 }}>{secilecek + 1}. ilanı seç</Yazi>
          <Yazi style={{ color: renk.gri, fontSize: 13 }}>Aynı ürün türündeki ilanlar gösterilir.</Yazi>
        </View>
        <Alan
          etiket="Karşılaştırmak için ilan ara"
          placeholder="İlan başlığı, konum veya ilan no"
          value={arama}
          onChangeText={setArama}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
          style={{ minHeight: 48 }}
        />
        <View dataSet={{ 'karsilastirma-secim-listesi': 'true' }} style={{ gap: 8, minWidth: 0 }}>
          {adaylar.map((ilan) => (
            <HareketliBas
              key={ilan.id}
              accessibilityLabel={`${ilan.baslik}, ${ilanBedeli(ilan)}, ${secilecek + 1}. ilana ekle`}
              accessibilityState={{ selected: ilan.id === secimler[secilecek]?.id }}
              dataSet={{ 'karsilastirma-aday': ilan.id }}
              onPress={() => {
                degistir(secilecek, ilan);
                secimiBitir(secilecek);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 10,
                backgroundColor: renk.zemin,
                borderRadius: 10,
                minHeight: 88,
              }}
            >
              <Gorsel
                source={gorselKaynagi(ilan.gorsel)}
                sizes="64px"
                priority="normal"
                style={{ width: 64, height: 56, borderRadius: 6, flexShrink: 0 }}
                accessibilityLabel={`${ilan.baslik} kapak fotoğrafı`}
              />
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Yazi numberOfLines={2} style={{ fontSize: 13, lineHeight: 19, fontWeight: '600' }}>
                  {ilan.baslik}
                </Yazi>
                <Yazi style={{ fontSize: 14, fontWeight: '700' }}>{ilanBedeli(ilan)}</Yazi>
                <Yazi numberOfLines={1} style={{ fontSize: 12, color: renk.gri }}>
                  {ilan.konum}
                </Yazi>
              </View>
              {ilan.id === secimler[secilecek]?.id && <Check size={18} color={renk.murekkep} />}
            </HareketliBas>
          ))}
          {!adaylar.length && (
            <Yazi role="status" style={{ paddingVertical: 20, color: renk.gri, lineHeight: 23 }}>
              {arama.trim()
                ? 'Bu aramayla eşleşen ilan yok. Başka bir kelime deneyebilirsin.'
                : 'Karşılaştırabileceğin başka bir ilan henüz yok.'}
            </Yazi>
          )}
        </View>
      </Giris>
    );

  return (
    <View dataSet={{ 'karsilastirma-tablosu': 'true' }} style={{ gap: 20, minWidth: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: mobil ? 12 : 20 }}>
        {([0, 1] as const).map((sira) => {
          const ilan = secimler[sira];
          return (
            <View
              key={sira}
              dataSet={{ 'karsilastirma-yuva': sira === 0 ? 'ilk' : 'ikinci' }}
              style={{ flex: 1, minWidth: 0, gap: 8 }}
            >
              <Yazi style={{ fontSize: 12, fontWeight: '600', color: renk.gri }}>{sira + 1}. ilan</Yazi>
              <Giris
                key={ilan?.id ?? 'bos'}
                style={{
                  flex: 1,
                  minWidth: 0,
                  backgroundColor: renk.zemin,
                  borderRadius: 10,
                  padding: mobil ? 10 : 14,
                  gap: 10,
                }}
              >
                {ilan ? (
                  <Link href={ilanYolu(ilan)} asChild>
                    <HareketliBas
                      accessibilityRole="link"
                      accessibilityLabel={`${sira + 1}. ilan ayrıntılarını aç: ${ilan.baslik}`}
                      onPress={kapat}
                      style={{ minWidth: 0, gap: 10, borderRadius: 7 }}
                    >
                      <Gorsel
                        source={gorselKaynagi(ilan.gorsel)}
                        sizes="(max-width: 699px) 40vw, 320px"
                        priority="normal"
                        style={{ width: '100%', aspectRatio: 1.7, borderRadius: 6 }}
                        accessibilityLabel={`${ilan.baslik} kapak fotoğrafı`}
                      />
                      <Yazi
                        numberOfLines={2}
                        style={{ minHeight: 40, fontSize: 13, lineHeight: 20, fontWeight: '600' }}
                      >
                        {ilan.baslik}
                      </Yazi>
                      <Yazi style={{ fontSize: mobil ? 16 : 18, lineHeight: 25, fontWeight: '700' }}>
                        {ilanBedeli(ilan)}
                      </Yazi>
                      <Yazi numberOfLines={2} style={{ fontSize: 12, color: renk.gri, lineHeight: 18 }}>
                        {ilan.konum}
                      </Yazi>
                    </HareketliBas>
                  </Link>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      minHeight: 150,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                    }}
                  >
                    <Plus size={26} color={renk.gri} strokeWidth={1.5} />
                    <Yazi style={{ color: renk.gri, fontSize: 13, textAlign: 'center' }}>
                      Karşılaştırmak için bir ilan seç
                    </Yazi>
                  </View>
                )}
                <View style={{ flex: 1 }} />
                <HareketliBas
                  ref={sira === 0 ? ilkDugme : ikinciDugme}
                  accessibilityLabel={ilan ? `${sira + 1}. ilanı değiştir` : `${sira + 1}. ilana ilan ekle`}
                  onPress={() => {
                    setArama('');
                    setSecilecek(sira);
                  }}
                  style={{
                    minHeight: 44,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: renk.cizgi,
                    borderRadius: 7,
                    paddingHorizontal: 8,
                  }}
                >
                  <Yazi style={{ fontSize: 13, fontWeight: '600' }}>{ilan ? 'Değiştir' : 'İlan ekle'}</Yazi>
                </HareketliBas>
              </Giris>
            </View>
          );
        })}
      </View>
      {ilk && ikinci ? (
        <>
          <Giris key={`${ilk.id}:${ikinci.id}`} style={{ gap: 16 }}>
            <Yazi style={{ fontWeight: '700', fontSize: 15 }}>{farkMetni}</Yazi>
            <HareketliBas
              accessibilityRole="checkbox"
              accessibilityState={{ checked: yalnizFarklar }}
              onPress={() => setYalnizFarklar((deger) => !deger)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                minHeight: 44,
                alignSelf: 'flex-start',
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderWidth: 1,
                  borderColor: renk.murekkep,
                  borderRadius: 5,
                  backgroundColor: yalnizFarklar ? renk.sari : renk.beyaz,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {yalnizFarklar && <Check size={16} color={renk.vurguYazi} />}
              </View>
              <Yazi style={{ fontSize: 13 }}>Yalnızca farkları göster</Yazi>
            </HareketliBas>
            <View
              role="region"
              accessibilityLabel="Karşılaştırılan ilanların özellikleri"
              style={{ minWidth: 0 }}
            >
              {(yalnizFarklar ? satirlar.filter((satir) => satir.farkli) : satirlar).map((satir) => (
                <View
                  key={satir.ad}
                  style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingVertical: 12, gap: 6 }}
                >
                  <Yazi style={{ color: renk.gri, fontSize: 12 }}>{satir.ad}</Yazi>
                  <View style={{ flexDirection: 'row', gap: mobil ? 12 : 20 }}>
                    {([satir.onceki, satir.simdiki] as const).map((deger, sira) => (
                      <Yazi
                        key={sira}
                        accessibilityLabel={`${sira + 1}. ilan, ${satir.ad}: ${deger}`}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 13,
                          lineHeight: 20,
                          fontWeight: satir.farkli ? '600' : '400',
                        }}
                      >
                        {deger}
                      </Yazi>
                    ))}
                  </View>
                </View>
              ))}
              {yalnizFarklar && !satirlar.some((satir) => satir.farkli) && (
                <Yazi style={{ color: renk.gri }}>Belirtilen özellikler aynı.</Yazi>
              )}
            </View>
          </Giris>
          <Yazi style={{ color: renk.gri, fontSize: 12, lineHeight: 19 }}>
            Özellikler ilan sahiplerinin verdiği bilgilerdir. Eksik belirtilen özellikleri ilan sahibine
            sorabilirsin.
          </Yazi>
        </>
      ) : (
        <Yazi role="status" style={{ color: renk.gri, fontSize: 13, lineHeight: 22 }}>
          Fiyat ve özellik farklarını görmek için ikinci ilanı ekle.
        </Yazi>
      )}
      <View style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 12, gap: 4 }}>
        <Yazi style={{ color: renk.gri, fontSize: 11, lineHeight: 17 }}>
          Son baktığın ilanlar 30 gün boyunca bu cihazda tutulur.
        </Yazi>
        <HareketliBas
          onPress={gecmisiTemizle}
          style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
        >
          <Yazi style={{ fontSize: 12, textDecorationLine: 'underline' }}>Göz atma geçmişini temizle</Yazi>
        </HareketliBas>
      </View>
    </View>
  );
}
