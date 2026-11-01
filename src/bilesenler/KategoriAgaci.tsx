import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { HareketliBas } from './Hareketli';
import { Alan, Yazi } from './Temel';
import { aramaIcinDuzelt } from '../veri/arama';
import { type Ilan } from '../veri/ilanlar';
import { kategoriGezintisi, type KesifSecimi } from '../veri/kategoriler';
import { kalin, useTema, temaStilleri } from '../tasarim/tema';

/** Ebeveynler sabit kalır; kaydırılan bölüm yalnız bir sonraki seviyeyi içerir. */
export function KategoriAgaci({
  ilanlar,
  secim,
  sec,
  gorunum = 'yan',
}: {
  ilanlar: Ilan[];
  secim: KesifSecimi;
  sec: (alan: keyof KesifSecimi, deger: string) => void;
  gorunum?: 'yan' | 'mobil';
}) {
  const { renk } = useTema();
  const s = useStiller();

  const gezinti = useMemo(
    () => kategoriGezintisi(ilanlar, secim),
    [ilanlar, secim.kategori, secim.altKategori, secim.marka, secim.model],
  );
  const [arama, setArama] = useState('');
  useEffect(() => setArama(''), [gezinti.alan, secim.kategori, secim.altKategori, secim.marka]);
  const aramaVar = gezinti.secenekler.length > 10;
  const secenekler =
    aramaVar && arama
      ? gezinti.secenekler.filter((dal) => aramaIcinDuzelt(dal.ad).includes(aramaIcinDuzelt(arama)))
      : gezinti.secenekler;

  if (gorunum === 'mobil') {
    const ustDal = gezinti.yol.at(-2);
    const seciliDal = gezinti.yol.at(-1);
    return (
      <View style={s.mobilKutu} dataSet={{ 'mobil-kategoriler': 'true' }}>
        {seciliDal ? (
          <HareketliBas
            accessibilityLabel={ustDal ? `${ustDal.ad} seçeneklerine dön` : 'Tüm kategorilere dön'}
            onPress={() => (ustDal ? sec(ustDal.alan, ustDal.id) : sec('kategori', ''))}
            style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 8 }}
          >
            <ArrowLeft size={17} color={renk.murekkep} />
            <Yazi style={{ flex: 1, fontSize: 13, fontWeight: '600' }}>{seciliDal.ad}</Yazi>
            <Yazi style={s.sayac}>{seciliDal.sayi} ilan</Yazi>
          </HareketliBas>
        ) : null}
        {gezinti.alan ? (
          <Yazi style={s.baslik}>{gezinti.baslik}</Yazi>
        ) : (
          <Yazi style={s.altBaslik}>Üst kategoriye dönerek diğer ürünlere bakabilirsin.</Yazi>
        )}
        {aramaVar && (
          <Alan
            accessibilityLabel={`${gezinti.baslik} içinde ara`}
            placeholder="Listede ara"
            value={arama}
            onChangeText={setArama}
            autoCorrect={false}
          />
        )}
        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
          <View style={s.mobilSecenekler}>
            {secenekler.map((dal) => (
              <HareketliBas
                key={dal.id}
                onPress={() => gezinti.alan && sec(gezinti.alan, dal.id)}
                accessibilityLabel={`${dal.ad}, ${dal.sayi} ilan, seç`}
                style={s.mobilSecenek}
              >
                <Yazi numberOfLines={2} style={s.ad}>
                  {dal.ad}
                </Yazi>
                <Yazi style={s.sayac}>{dal.sayi}</Yazi>
                <ChevronRight size={15} color={renk.gri} />
              </HareketliBas>
            ))}
          </View>
          {gezinti.alan && secenekler.length === 0 && (
            <Yazi style={s.altBaslik}>Bu isimde bir seçenek bulunamadı.</Yazi>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ gap: 10 }} accessibilityLabel="Kategori seçimi" dataSet={{ 'kategori-agaci': 'true' }}>
      <Yazi style={s.baslik}>Kategori</Yazi>
      <View style={s.kutu}>
        <HareketliBas
          onPress={() => sec('kategori', '')}

          accessibilityLabel="Tüm kategorileri göster"
          accessibilityState={{ selected: gezinti.yol.length === 0 }}
          style={s.satir}
        >
          {gezinti.yol.length > 0 ? <ArrowLeft size={15} color={renk.gri} /> : null}
          <Yazi
            style={[
              s.ad,
              {
                color: gezinti.yol.length ? renk.gri : renk.murekkep,
                fontWeight: gezinti.yol.length ? '400' : '700',
              },
            ]}
          >
            {gezinti.yol.length ? 'Tüm kategoriler' : 'Tüm ilanlar'}
          </Yazi>
          <Yazi style={s.sayac}>{ilanlar.length}</Yazi>
        </HareketliBas>
        {gezinti.yol.map((dal, sira) => {
          const son = sira === gezinti.yol.length - 1;
          const icerik = (
            <>
              <Yazi numberOfLines={2} style={[s.ad, { fontWeight: son ? '700' : '500' }]}>
                {dal.ad}
              </Yazi>
              <Yazi style={s.sayac}>{dal.sayi}</Yazi>
            </>
          );
          return son ? (
            <View
              key={dal.alan}
              accessible
              accessibilityLabel={`${dal.ad}, ${dal.sayi} ilan, seçili`}
              style={[s.satir, s.secili, { marginLeft: sira * 10 }]}
              dataSet={{ 'kategori-yaprak': dal.alan }}
            >
              {icerik}
            </View>
          ) : (
            <HareketliBas
              key={dal.alan}
              onPress={() => sec(dal.alan, dal.id)}
              accessibilityLabel={`${dal.ad}, alt seçenekleri göster`}
              style={[s.satir, { paddingLeft: 10 + sira * 10 }]}
            >
              {icerik}
            </HareketliBas>
          );
        })}
        {gezinti.alan && gezinti.secenekler.length > 0 ? (
          <View style={s.cocuklar}>
            <Yazi style={s.altBaslik}>{gezinti.baslik}</Yazi>
            {aramaVar ? (
              <Alan
                accessibilityLabel={`${gezinti.baslik} içinde ara`}
                placeholder="Listede ara"
                value={arama}
                onChangeText={setArama}
                autoCorrect={false}
                style={{ minHeight: 44, height: 44, marginBottom: 6 }}
              />
            ) : null}
            <ScrollView
              key={`${gezinti.alan}-${secim.kategori}-${secim.altKategori}-${secim.marka}`}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              accessibilityLabel={gezinti.baslik}
              style={{ maxHeight: 264 }}
              contentContainerStyle={{ gap: 1 }}
            >
              {secenekler.map((dal) => (
                <HareketliBas
                  key={dal.id}
                  onPress={() => gezinti.alan && sec(gezinti.alan, dal.id)}
                  accessibilityLabel={`${dal.ad}, ${dal.sayi} ilan`}
                  style={s.satir}
                >
                  <Yazi numberOfLines={2} style={s.ad}>
                    {dal.ad}
                  </Yazi>
                  <Yazi style={s.sayac}>{dal.sayi}</Yazi>
                  <ChevronRight size={13} color={renk.gri} />
                </HareketliBas>
              ))}
              {secenekler.length === 0 ? (
                <Yazi style={{ padding: 10, fontSize: 12, lineHeight: 18, color: renk.gri }}>
                  Bu isimde bir seçenek bulunamadı.
                </Yazi>
              ) : null}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    baslik: { fontFamily: kalin, fontWeight: '700', fontSize: 14 },
    kutu: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      backgroundColor: renk.beyaz,
      padding: 7,
      gap: 1,
    },
    satir: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      minHeight: 44,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 6,
    },
    ad: { flex: 1, minWidth: 0, fontSize: 13, lineHeight: 19, color: renk.murekkep },
    secili: { backgroundColor: renk.acik },
    mobilKutu: { padding: 14, gap: 9, borderWidth: 1, borderColor: renk.cizgi, borderRadius: 10 },
    mobilSecenekler: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12 },
    mobilSecenek: {
      flexBasis: '46%',
      flexGrow: 1,
      minWidth: 110,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: renk.cizgi,
      borderRadius: 5,
    },
    sayac: { fontSize: 11, lineHeight: 18, color: renk.gri },
    cocuklar: { borderTopWidth: 1, borderTopColor: renk.cizgi, marginTop: 7, paddingTop: 9 },
    altBaslik: { fontSize: 11, lineHeight: 18, color: renk.gri, paddingHorizontal: 10, paddingBottom: 4 },
  }),
);
