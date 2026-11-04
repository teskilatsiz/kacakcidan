import { useDeferredValue, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, View } from 'react-native';
import { Link } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Check from 'lucide-react-native/icons/check';
import Heart from 'lucide-react-native/icons/heart';
import Plus from 'lucide-react-native/icons/plus';
import X from 'lucide-react-native/icons/x';
import { fiyatFarki, karsilastirmaAdaylari, karsilastirmaSatirlari } from '../veri/ilanKarsilastirma';
import { ilanBedeli, ilanYolu, para, type Ilan } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { useEkran, useTema } from '../tasarim/tema';
import { Alan, Buton, SimgeButon, Yazi } from './Temel';
import { Gorsel } from './Gorsel';
import { Giris, HareketliBas } from './Hareketli';

type Props = {
  baglam: Ilan;
  ilanlar: Ilan[];
  favoriler: string[];
  secimler: [Ilan | undefined, Ilan | undefined];
  degistir: (sira: 0 | 1, ilan?: Ilan) => void;
  kapat: () => void;
  gecmisiTemizle: () => void;
};

export default function KarsilastirmaIcerigi({
  baglam,
  ilanlar,
  favoriler,
  secimler,
  degistir,
  kapat,
  gecmisiTemizle,
}: Props) {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const [secilecek, setSecilecek] = useState<0 | 1>();
  const [arama, setArama] = useState('');
  const sorgu = useDeferredValue(arama);
  const [kaynak, setKaynak] = useState<'tumu' | 'favoriler'>('tumu');
  const [yalnizFarklar, setYalnizFarklar] = useState(false);
  const ilkDugme = useRef<ComponentRef<typeof HareketliBas>>(null);
  const ikinciDugme = useRef<ComponentRef<typeof HareketliBas>>(null);
  const geriDugmesi = useRef<ComponentRef<typeof HareketliBas>>(null);
  const [ilk, ikinci] = secimler;
  const digerId = secimler[secilecek === 0 ? 1 : 0]?.id;
  const favoriKimlikleri = useMemo(() => new Set(favoriler), [favoriler]);
  const tumAdaylar = useMemo(
    () => karsilastirmaAdaylari(ilanlar, baglam, digerId, sorgu, { favoriIdleri: favoriler }),
    [ilanlar, baglam, digerId, sorgu, favoriler],
  );
  const favoriSayisi = useMemo(
    () =>
      karsilastirmaAdaylari(ilanlar, baglam, digerId, '', { favoriIdleri: favoriler, yalnizFavoriler: true })
        .length,
    [ilanlar, baglam, digerId, favoriler],
  );
  const favoriAdaylar = tumAdaylar.filter((ilan) => favoriKimlikleri.has(ilan.id));
  const digerAdaylar = tumAdaylar.filter((ilan) => !favoriKimlikleri.has(ilan.id));
  const gruplar =
    kaynak === 'favoriler'
      ? [{ ad: 'Favorilerim', ilanlar: favoriAdaylar }]
      : favoriAdaylar.length
        ? [
            { ad: 'Favorilerinden', ilanlar: favoriAdaylar },
            { ad: 'Diğer uygun ilanlar', ilanlar: digerAdaylar },
          ]
        : [{ ad: 'Uygun ilanlar', ilanlar: digerAdaylar }];
  const sonucVar = kaynak === 'favoriler' ? favoriAdaylar.length > 0 : tumAdaylar.length > 0;
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

  useEffect(() => {
    if (secilecek === undefined) return;
    const kare = requestAnimationFrame(() => geriDugmesi.current?.focus());
    return () => cancelAnimationFrame(kare);
  }, [secilecek]);

  if (secilecek !== undefined)
    return (
      <Giris
        key={`secim-${secilecek}`}
        dataSet={{ 'karsilastirma-secici': String(secilecek + 1) }}
        style={{ gap: 16, minWidth: 0 }}
      >
        <HareketliBas
          ref={geriDugmesi}
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
          <Yazi style={{ color: renk.gri, fontSize: 13, lineHeight: 20 }}>
            Aynı ürün türündeki ilanlar gösterilir. Diğer alana eklediğin ilan listede yer almaz.
          </Yazi>
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
        {favoriler.length > 0 && (
          <View accessibilityLabel="İlan kaynağı" style={{ flexDirection: 'row', gap: 8, minWidth: 0 }}>
            {(['tumu', 'favoriler'] as const).map((secenek) => (
              <HareketliBas
                key={secenek}
                accessibilityState={{ selected: kaynak === secenek }}
                onPress={() => setKaynak(secenek)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 44,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: kaynak === secenek ? renk.sari : renk.zemin,
                }}
              >
                {secenek === 'favoriler' && (
                  <Heart size={15} color={kaynak === secenek ? renk.vurguYazi : renk.murekkep} />
                )}
                <Yazi
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: kaynak === secenek ? renk.vurguYazi : renk.murekkep,
                  }}
                >
                  {secenek === 'tumu' ? 'Uygun ilanlar' : `Favorilerim (${favoriSayisi})`}
                </Yazi>
              </HareketliBas>
            ))}
          </View>
        )}
        <View dataSet={{ 'karsilastirma-secim-listesi': 'true' }} style={{ gap: 8, minWidth: 0 }}>
          {gruplar
            .filter((grup) => grup.ilanlar.length > 0)
            .map((grup) => (
              <Giris key={grup.ad} style={{ gap: 8 }}>
                <Yazi style={{ color: renk.gri, fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                  {grup.ad}
                </Yazi>
                {grup.ilanlar.map((ilan) => (
                  <HareketliBas
                    key={ilan.id}
                    accessibilityLabel={`${ilan.baslik}, ${ilanBedeli(ilan)}, ${ilan.id === secimler[secilecek]?.id ? 'seçili' : `${secilecek + 1}. ilana ekle`}`}
                    accessibilityState={{
                      selected: ilan.id === secimler[secilecek]?.id,
                      disabled: ilan.id === secimler[secilecek]?.id,
                    }}
                    disabled={ilan.id === secimler[secilecek]?.id}
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        {favoriKimlikleri.has(ilan.id) && (
                          <Heart size={12} color={renk.gri} fill="none" accessibilityLabel="Favorilerinde" />
                        )}
                        <Yazi
                          numberOfLines={1}
                          style={{ flex: 1, minWidth: 0, fontSize: 12, color: renk.gri }}
                        >
                          {ilan.konum}
                        </Yazi>
                      </View>
                    </View>
                    {ilan.id === secimler[secilecek]?.id && <Check size={18} color={renk.murekkep} />}
                  </HareketliBas>
                ))}
              </Giris>
            ))}
          {!sonucVar && (
            <View style={{ paddingVertical: 20, gap: 12, alignItems: 'flex-start' }}>
              <Yazi role="status" style={{ color: renk.gri, lineHeight: 23 }}>
                {sorgu.trim()
                  ? kaynak === 'favoriler'
                    ? 'Favorilerinde bu aramayla eşleşen ilan yok.'
                    : 'Bu aramayla eşleşen ilan yok. Başka bir kelime deneyebilirsin.'
                  : kaynak === 'favoriler'
                    ? 'Bu ürün türünde favori ilanın yok.'
                    : 'Karşılaştırabileceğin başka bir ilan henüz yok.'}
              </Yazi>
              {kaynak === 'favoriler' && (
                <Buton ikincil onPress={() => setKaynak('tumu')}>
                  Uygun ilanları göster
                </Buton>
              )}
            </View>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 44,
                }}
              >
                <Yazi style={{ fontSize: 12, fontWeight: '600', color: renk.gri }}>{sira + 1}. ilan</Yazi>
                {ilan && (
                  <SimgeButon
                    etiket={`${sira + 1}. ilanı karşılaştırmadan çıkar`}
                    onPress={() => {
                      degistir(sira);
                      requestAnimationFrame(() => (sira === 0 ? ilkDugme : ikinciDugme).current?.focus());
                    }}
                    style={{ borderWidth: 0, backgroundColor: 'transparent' }}
                  >
                    <X size={16} color={renk.gri} />
                  </SimgeButon>
                )}
              </View>
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
                    setKaynak('tumu');
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
              <View
                dataSet={{ 'karsilastirma-sutun-basliklari': 'true' }}
                style={{
                  flexDirection: 'row',
                  gap: mobil ? 12 : 20,
                  paddingVertical: 10,
                  backgroundColor: renk.beyaz,
                }}
              >
                {[ilk, ikinci].map((ilan, sira) => (
                  <Yazi
                    key={ilan.id}
                    numberOfLines={2}
                    style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 18, fontWeight: '700' }}
                  >
                    {sira + 1}. {ilan.baslik}
                  </Yazi>
                ))}
              </View>
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
          {ilk
            ? 'Fiyat ve özellik farklarını görmek için ikinci ilanı ekle.'
            : ikinci
              ? 'Fiyat ve özellik farklarını görmek için birinci ilanı ekle.'
              : 'Fiyat ve özellik farklarını görmek için iki ilan ekle.'}
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
