import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import LayoutGrid from 'lucide-react-native/icons/layout-grid';
import List from 'lucide-react-native/icons/list';
import SlidersHorizontal from 'lucide-react-native/icons/sliders-horizontal';
import X from 'lucide-react-native/icons/x';
import { Kabuk } from '../bilesenler/Kabuk';
import { Alan, Baslik, BosDurum, Buton, Pencere, SimgeButon, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { KategoriAgaci } from '../bilesenler/KategoriAgaci';
import { SecimAlani } from '../bilesenler/SecimAlani';
import { useKesifSecimi } from '../durum/useKesifSecimi';
import { usePazar } from '../durum/Pazar';
import {
  ilanlariFiltrele,
  kategoriler,
  ozellikFiltreEslesir,
  type Kategori,
  type Siralama,
} from '../veri/ilanlar';
import {
  bosSecim,
  kategoriYapisi,
  kategoriGezintisi,
  kesifSeciminiDegistir,
  kesifSeciminiTamamla,
  type KesifSecimi,
} from '../veri/kategoriler';
import { ozellikFiltreAlanlari, type OzellikAlani } from '../veri/ozellikler';
import { urunKategorisiMi } from '../veri/anaKategoriler';
import { kategoriAdresi } from '../veri/kategoriSayfalari';
import { ilceSecenekleri, iller, konumuAyir, konumuBirlestir } from '../veri/konumlar';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { sayisalGirdiyiTemizle } from '../veri/formGirdileri';

type AktifFiltre = { id: string; ad: string; kaldir: () => void };

function filtreAlanlariniBirlestir(alanlar: OzellikAlani[]): OzellikAlani[] {
  const sonuc = new Map<string, OzellikAlani>();
  for (const alan of alanlar) {
    const onceki = sonuc.get(alan.ad);
    if (!onceki) {
      sonuc.set(alan.ad, alan);
      continue;
    }
    sonuc.set(alan.ad, {
      ...onceki,
      secenekler: [...new Set([...onceki.secenekler, ...alan.secenekler])],
      filtreSecenekleri: [
        ...new Map(
          [...(onceki.filtreSecenekleri ?? []), ...(alan.filtreSecenekleri ?? [])].map((secenek) => [
            secenek.id,
            secenek,
          ]),
        ).values(),
      ],
      sayisal: onceki.sayisal || alan.sayisal,
      enCok: Math.max(onceki.enCok ?? 0, alan.enCok ?? 0) || undefined,
      birim: onceki.birim ?? alan.birim,
    });
  }
  return [...sonuc.values()];
}

export default function Kesfet() {
  const { renk } = useTema();
  const s = useStiller();

  const parametreler = useLocalSearchParams<{
    q?: string;
    firsat?: string;
    takas?: string;
    ozellikler?: string;
    filtre?: string;
  }>();
  const { tumIlanlar, konum, konumSec, hazir } = usePazar();
  const { secim: hamSecim } = useKesifSecimi();
  const secim = useMemo(
    () => kesifSeciminiTamamla(tumIlanlar, hamSecim),
    [tumIlanlar, hamSecim.kategori, hamSecim.altKategori, hamSecim.marka, hamSecim.model],
  );
  const kategoriYolu = useMemo(
    () => kategoriGezintisi(tumIlanlar, secim).yol,
    [tumIlanlar, secim.kategori, secim.altKategori, secim.marka, secim.model],
  );
  const { mobil, tablet, bosluk } = useEkran();
  const router = useRouter();
  const q = hazir && typeof parametreler.q === 'string' ? parametreler.q : '';
  const firsat = hazir && parametreler.firsat === '1';
  const [enAz, setEnAz] = useState('');
  const [enCok, setEnCok] = useState('');
  const [durum, setDurum] = useState('');
  const [takas, setTakas] = useState(false);
  const [siralama, setSiralama] = useState<Siralama>('yeni');
  const [liste, setListe] = useState(false);
  const [filtreAcik, setFiltreAcik] = useState(false);
  const [siralaAcik, setSiralaAcik] = useState(false);
  const [teknikAcik, setTeknikAcik] = useState(false);
  const urunIlani = urunKategorisiMi(secim.kategori);
  const isIlani = secim.kategori === 'is-ilanlari';
  const ozellikBasligi = isIlani
    ? 'Çalışma koşulları'
    : secim.kategori === 'hizmetler'
      ? 'Hizmet ayrıntıları'
      : secim.kategori === 'emlak'
        ? 'Emlak özellikleri'
        : 'Teknik özellikler';
  useEffect(() => {
    if (!urunIlani) {
      setDurum('');
      setTakas(false);
    }
  }, [urunIlani]);
  useEffect(() => {
    if (!hazir || parametreler.filtre !== '1') return;
    if (tablet) setFiltreAcik(true);
    router.setParams({ filtre: '' });
  }, [hazir, parametreler.filtre, tablet, router]);
  useEffect(
    () => setTakas(urunIlani && hazir && parametreler.takas === '1'),
    [hazir, parametreler.takas, urunIlani],
  );
  useEffect(() => setEnCok(firsat ? '20000' : ''), [firsat]);
  const sorgu = useDeferredValue(q);
  const alanlar = useMemo(() => {
    if (!kategoriler.some((kategori) => kategori.id === secim.kategori) || !secim.altKategori) return [];
    return filtreAlanlariniBirlestir(
      ozellikFiltreAlanlari({
        ...secim,
        kategori: secim.kategori as Kategori,
        altKategori: secim.altKategori,
      }),
    );
  }, [secim.kategori, secim.altKategori, secim.marka, secim.model]);
  const ozellikler = useMemo<Record<string, string>>(() => {
    if (!hazir || typeof parametreler.ozellikler !== 'string' || parametreler.ozellikler.length > 4000)
      return {};
    try {
      const deger: unknown = JSON.parse(parametreler.ozellikler);
      if (!deger || typeof deger !== 'object' || Array.isArray(deger)) return {};
      return Object.fromEntries(
        Object.entries(deger)
          .slice(0, 24)
          .filter(
            ([ad, secili]) =>
              alanlar.some((alan) => alan.ad === ad) &&
              typeof secili === 'string' &&
              secili.length > 0 &&
              secili.length <= 80,
          ),
      );
    } catch {
      return {};
    }
  }, [hazir, parametreler.ozellikler, alanlar]);
  const ozellikSayisi = Object.keys(ozellikler).length;
  useEffect(() => {
    if (ozellikSayisi > 0) setTeknikAcik(true);
  }, [ozellikSayisi]);
  const anaKapsam = useMemo(
    () =>
      ilanlariFiltrele(tumIlanlar, {
        arama: sorgu,
        ...secim,
        konum,
        enAz,
        enCok,
        durum: urunIlani ? durum : '',
        takas: urunIlani && takas,
      }),
    [
      tumIlanlar,
      sorgu,
      secim.kategori,
      secim.altKategori,
      secim.marka,
      secim.model,
      konum,
      enAz,
      enCok,
      durum,
      takas,
      urunIlani,
    ],
  );
  const sonuc = useMemo(
    () => ilanlariFiltrele(anaKapsam, { ozellikler, siralama }),
    [anaKapsam, ozellikler, siralama],
  );
  const teknikAlanlar = useMemo(
    () =>
      alanlar.map((alan) => {
        const digerSecimler = Object.fromEntries(Object.entries(ozellikler).filter(([ad]) => ad !== alan.ad));
        const kapsam = ilanlariFiltrele(anaKapsam, { ozellikler: digerSecimler });
        const gorunen = new Map<string, string>();
        const sayilar = new Map<string, number>();
        const tanimliSecenekler =
          alan.filtreSecenekleri ?? alan.secenekler.map((deger) => ({ id: deger, ad: deger }));
        for (const secenek of tanimliSecenekler) {
          gorunen.set(secenek.id, secenek.ad);
          sayilar.set(
            secenek.id,
            kapsam.filter((ilan) => ozellikFiltreEslesir(ilan.ozellikler?.[alan.ad], secenek.id)).length,
          );
        }
        for (const ilan of kapsam) {
          const deger = ilan.ozellikler?.[alan.ad];
          if (deger && !alan.sayisal && !gorunen.has(deger)) {
            gorunen.set(deger, deger);
            sayilar.set(deger, 0);
          }
          if (deger && !alan.sayisal && !tanimliSecenekler.some((secenek) => secenek.id === deger))
            sayilar.set(deger, (sayilar.get(deger) ?? 0) + 1);
        }
        const secili = ozellikler[alan.ad];
        if (secili && !gorunen.has(secili)) {
          gorunen.set(secili, secili);
          sayilar.set(secili, 0);
        }
        return {
          ad: alan.ad,
          secenekler: [...gorunen].map(([id, ad]) => {
            const sayi = sayilar.get(id) ?? 0;
            return { id, ad: sayi ? `${ad} (${sayi})` : ad };
          }),
        };
      }),
    [alanlar, anaKapsam, ozellikler],
  );
  const yapi = kategoriYapisi(secim.kategori as Kategori, secim.altKategori);
  const kategoriAdi = kategoriler.find((kategori) => kategori.id === secim.kategori)?.ad;
  const altAdi = yapi.altKategoriler.find((alt) => alt.id === secim.altKategori)?.ad ?? secim.altKategori;
  const markaAdi = yapi.markalar.find((marka) => marka.id === secim.marka)?.ad ?? secim.marka;
  const modelAdi = yapi.modeller[secim.marka]?.find((model) => model.id === secim.model)?.ad ?? secim.model;
  const fiyatHatasi = Boolean(enAz && enCok && Number(enAz) > Number(enCok));
  const seciliKonum = useMemo(() => konumuAyir(konum), [konum]);
  const durumlar = useMemo(() => [...new Set(tumIlanlar.map((ilan) => ilan.durum))], [tumIlanlar]);

  function ozellikSec(ad: string, deger: string) {
    const sonraki = { ...ozellikler };
    if (deger) sonraki[ad] = deger;
    else delete sonraki[ad];
    router.setParams({ ozellikler: Object.keys(sonraki).length ? JSON.stringify(sonraki) : '' });
  }
  function sec(alan: keyof KesifSecimi, deger: string) {
    const sonraki = kesifSeciminiDegistir(secim, alan, deger);
    const kapsam = ilanlariFiltrele(tumIlanlar, sonraki);
    const izinliAlanlar = sonraki.kategori
      ? sonraki.altKategori
        ? ozellikFiltreAlanlari({
            ...sonraki,
            kategori: sonraki.kategori as Kategori,
            altKategori: sonraki.altKategori,
          })
        : []
      : [];
    const tutulan =
      alan === 'kategori'
        ? {}
        : Object.fromEntries(
            Object.entries(ozellikler).filter(
              ([ad, secili]) =>
                izinliAlanlar.some((tanim) => tanim.ad === ad) &&
                kapsam.some((ilan) => ozellikFiltreEslesir(ilan.ozellikler?.[ad], secili)),
            ),
          );
    router.replace(
      kategoriAdresi(sonraki, {
        q,
        firsat: firsat ? '1' : '',
        takas: takas ? '1' : '',
        ozellikler: Object.keys(tutulan).length ? JSON.stringify(tutulan) : '',
      }) as Href,
    );
  }
  const kategoriBaglantisi = (alan: keyof KesifSecimi, deger: string) =>
    kategoriAdresi(kesifSeciminiDegistir(secim, alan, deger)) as Href;
  function sifirla() {
    setEnAz('');
    setEnCok('');
    setDurum('');
    setTakas(false);
    setTeknikAcik(false);
    konumSec('');
    router.replace('/kesfet');
  }
  const aktifFiltreler: AktifFiltre[] = [
    ...(q ? [{ id: 'arama', ad: `Arama: ${q}`, kaldir: () => router.setParams({ q: '' }) }] : []),
    ...(kategoriAdi ? [{ id: 'kategori', ad: kategoriAdi, kaldir: () => sec('kategori', '') }] : []),
    ...(altAdi ? [{ id: 'altKategori', ad: altAdi, kaldir: () => sec('altKategori', '') }] : []),
    ...(markaAdi ? [{ id: 'marka', ad: markaAdi, kaldir: () => sec('marka', '') }] : []),
    ...(modelAdi ? [{ id: 'model', ad: modelAdi, kaldir: () => sec('model', '') }] : []),
    ...(konum ? [{ id: 'konum', ad: konum, kaldir: () => konumSec('') }] : []),
    ...(enAz || enCok
      ? [
          {
            id: 'fiyat',
            ad: `${enAz || '0'} - ${enCok || '∞'} TL`,
            kaldir: () => {
              setEnAz('');
              setEnCok('');
              router.setParams({ firsat: '' });
            },
          },
        ]
      : []),
    ...(durum ? [{ id: 'durum', ad: durum, kaldir: () => setDurum('') }] : []),
    ...(takas
      ? [
          {
            id: 'takas',
            ad: 'Takasa açık',
            kaldir: () => {
              setTakas(false);
              router.setParams({ takas: '' });
            },
          },
        ]
      : []),
    ...Object.entries(ozellikler).map(([ad, deger]) => ({
      id: `ozellik-${ad}`,
      ad: `${ad}: ${deger}`,
      kaldir: () => ozellikSec(ad, ''),
    })),
  ];
  const filtreIcerigi = (pencere = false) => (
    <View style={{ gap: 22 }}>
      <View style={ortak.aralikli}>
        {!pencere ? (
          <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 18 }}>Filtreler</Yazi>
        ) : (
          <Yazi style={{ color: renk.gri, fontSize: 12 }}>{aktifFiltreler.length} seçim</Yazi>
        )}
        <HareketliBas
          onPress={sifirla}
          accessibilityLabel="Tüm filtreleri temizle"
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Yazi style={{ fontSize: 12, textDecorationLine: 'underline' }}>Temizle</Yazi>
        </HareketliBas>
      </View>
      <View style={s.filtreBolum}>
        <KategoriAgaci ilanlar={tumIlanlar} secim={secim} sec={sec} adres={kategoriBaglantisi} />
      </View>
      <View style={s.filtreBolum}>
        <Yazi style={s.filtreBaslik}>Konum</Yazi>
        <SecimAlani
          etiket="İl"
          deger={seciliKonum.il}
          ipucu="Tüm iller"
          secenekler={iller}
          degistir={(il) => konumSec(konumuBirlestir(il))}
        />
        <SecimAlani
          etiket="İlçe"
          deger={seciliKonum.ilce}
          ipucu={seciliKonum.il ? 'Tüm ilçeler' : 'Önce il seç'}
          secenekler={ilceSecenekleri(seciliKonum.il)}
          degistir={(ilce) => konumSec(konumuBirlestir(seciliKonum.il, ilce))}
          disabled={!seciliKonum.il}
        />
      </View>
      <View style={s.filtreBolum}>
        <Yazi style={s.filtreBaslik}>{isIlani ? 'Ücret aralığı' : 'Fiyat aralığı'}</Yazi>
        <View style={[ortak.satir, { alignItems: 'flex-end', gap: 8 }]}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Alan
              etiket="En az (TL)"
              value={enAz}
              onChangeText={(deger) => setEnAz(sayisalGirdiyiTemizle(deger))}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={9}
              placeholder="0"
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Alan
              etiket="En çok (TL)"
              value={enCok}
              onChangeText={(deger) => setEnCok(sayisalGirdiyiTemizle(deger))}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={9}
              placeholder="Limitsiz"
            />
          </View>
        </View>
        {fiyatHatasi ? (
          <Yazi accessibilityRole="alert" style={{ fontSize: 12, lineHeight: 18, color: renk.hata }}>
            En az fiyat, en çok fiyattan büyük olamaz.
          </Yazi>
        ) : null}
      </View>
      {teknikAlanlar.length > 0 ? (
        <View style={s.filtreBolum}>
          <HareketliBas
            onPress={() => setTeknikAcik(!teknikAcik)}
            accessibilityLabel={`${ozellikBasligi} filtreleri`}
            accessibilityState={{ expanded: teknikAcik }}
            style={[ortak.aralikli, { minHeight: 44 }]}
          >
            <Yazi style={s.filtreBaslik}>
              {ozellikBasligi}
              {ozellikSayisi ? ` (${ozellikSayisi})` : ''}
            </Yazi>
            <ChevronDown
              size={17}
              color={renk.murekkep}
              style={{ transform: [{ rotate: teknikAcik ? '180deg' : '0deg' }] }}
            />
          </HareketliBas>
          {teknikAcik ? (
            <>
              {!secim.model && (
                <Yazi style={{ fontSize: 12, lineHeight: 18, color: renk.gri }}>
                  {isIlani
                    ? 'Pozisyon seçerek aramanı daraltabilirsin.'
                    : 'Daha ayrıntılı özellikler için alt kategoriyi seç.'}
                </Yazi>
              )}
              {teknikAlanlar.map((alan) => (
                <SecimAlani
                  key={alan.ad}
                  etiket={alan.ad}
                  deger={ozellikler[alan.ad] ?? ''}
                  ipucu="Fark etmez"
                  secenekler={alan.secenekler}
                  degistir={(deger) => ozellikSec(alan.ad, deger)}
                />
              ))}
            </>
          ) : null}
        </View>
      ) : !secim.kategori ? (
        <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 19 }}>
          Teknik özelliklerle aramak için bir kategori seç.
        </Yazi>
      ) : !secim.altKategori ? (
        <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 19 }}>
          İlan özellikleri için bir alt kategori seç.
        </Yazi>
      ) : !secim.model ? (
        <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 19 }}>
          Teknik özellikleri görmek için kategoriden ürün türünü seç.
        </Yazi>
      ) : null}
      <View style={s.filtreBolum}>
        {urunIlani ? (
          <SecimAlani
            etiket="Ürünün durumu"
            deger={durum}
            ipucu="Fark etmez"
            secenekler={durumlar.map((deger) => ({ id: deger, ad: deger }))}
            degistir={setDurum}
          />
        ) : null}
        {urunIlani ? (
          <HareketliBas
            accessibilityRole="checkbox"
            accessibilityState={{ checked: takas }}
            onPress={() => {
              setTakas(!takas);
              router.setParams({ takas: takas ? '' : '1' });
            }}
            style={[ortak.satir, { minHeight: 44 }]}
          >
            <View style={[s.kutu, takas && { backgroundColor: renk.sari, borderColor: renk.sari }]}>
              {takas ? <Check size={13} color={renk.vurguYazi} /> : null}
            </View>
            <Yazi style={{ fontSize: 13 }}>Takasa açık ilanlar</Yazi>
          </HareketliBas>
        ) : null}
      </View>
    </View>
  );

  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            paddingHorizontal: bosluk,
            flexDirection: 'row',
            gap: 28,
            paddingTop: mobil ? 18 : 25,
            paddingBottom: 30,
          },
        ]}
      >
        {!tablet ? (
          <View style={{ width: 250, paddingRight: 22, borderRightWidth: 1, borderColor: renk.cizgi }}>
            {filtreIcerigi()}
          </View>
        ) : null}
        <View style={{ flex: 1, minWidth: 0, gap: 18 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            accessibilityLabel="Kategori yolu"
            contentContainerStyle={{ alignItems: 'center', gap: 5 }}
            style={{ flexGrow: 0 }}
          >
            <Link href="/" asChild>
              <HareketliBas style={s.yolBaglantisi}>
                <Yazi style={s.kirik}>Ana sayfa</Yazi>
              </HareketliBas>
            </Link>
            <ChevronRight size={11} color={renk.gri} />
            {kategoriYolu.length > 0 ? (
              <HareketliBas
                onPress={() => sec('kategori', '')}
                accessibilityLabel="Tüm kategorilerin ilanlarını göster"
                style={s.yolBaglantisi}
              >
                <Yazi style={s.kirik}>İlanlar</Yazi>
              </HareketliBas>
            ) : (
              <Yazi style={s.kirik}>İlan ara</Yazi>
            )}
            {kategoriYolu.map((dal, sira) => (
              <View key={dal.alan} style={[ortak.satir, { gap: 5 }]}>
                <ChevronRight size={11} color={renk.gri} />
                {sira === kategoriYolu.length - 1 ? (
                  <Yazi
                    numberOfLines={1}
                    style={[s.kirik, { color: renk.murekkep, fontWeight: '600', maxWidth: 240 }]}
                  >
                    {dal.ad}
                  </Yazi>
                ) : (
                  <HareketliBas
                    onPress={() => sec(dal.alan, dal.id)}
                    accessibilityLabel={`${dal.ad} kategorisinin ilanlarını göster`}
                    style={s.yolBaglantisi}
                  >
                    <Yazi numberOfLines={1} style={[s.kirik, { maxWidth: 180 }]}>
                      {dal.ad}
                    </Yazi>
                  </HareketliBas>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={{ gap: 7 }}>
            <Baslik buyuk>
              {q
                ? `“${q}” için ilanlar`
                : modelAdi
                  ? `${modelAdi} ilanları`
                  : markaAdi
                    ? `${markaAdi} ilanları`
                    : altAdi
                      ? `${altAdi} ilanları`
                      : kategoriAdi
                        ? `${kategoriAdi} ilanları`
                        : firsat
                          ? '20.000 TL ve altı ilanlar'
                          : 'Tüm ilanlar'}
            </Baslik>
            <Yazi style={{ color: renk.gri, fontSize: 13 }} accessibilityLiveRegion="polite">
              {konum || 'Türkiye'} ·{' '}
              <Yazi style={{ fontWeight: '700', fontSize: 13 }}>{sonuc.length} ilan</Yazi>
            </Yazi>
          </View>
          {tablet && (
            <KategoriAgaci
              ilanlar={tumIlanlar}
              secim={secim}
              sec={sec}
              adres={kategoriBaglantisi}
              gorunum="mobil"
            />
          )}
          <View style={[ortak.aralikli, { gap: 8 }]}>
            {tablet ? (
              <Buton
                ikincil
                onPress={() => setFiltreAcik(true)}
                style={{ minHeight: 44, paddingHorizontal: 13 }}
                simge={<SlidersHorizontal size={16} color={renk.murekkep} />}
              >
                Filtrele{aktifFiltreler.length ? ` (${aktifFiltreler.length})` : ''}
              </Buton>
            ) : (
              <Yazi style={{ fontSize: 12, color: renk.gri }}>
                {aktifFiltreler.length ? `${aktifFiltreler.length} filtre seçili` : 'İlanlar'}
              </Yazi>
            )}
            <View style={[ortak.satir, { gap: 6 }]}>
              <HareketliBas
                onPress={() => setSiralaAcik(true)}
                accessibilityLabel="İlanları sırala"
                style={[ortak.satir, { minHeight: 44, paddingHorizontal: 8, gap: 5 }]}
              >
                <Yazi style={{ fontSize: 12, fontWeight: '600' }}>
                  {siralama === 'yeni' ? 'En yeni' : siralama === 'artan' ? 'Fiyat: artan' : 'Fiyat: azalan'}
                </Yazi>
                <ChevronDown size={14} color={renk.murekkep} />
              </HareketliBas>
              {!mobil ? (
                <>
                  <SimgeButon
                    etiket="Izgara görünümü"
                    onPress={() => setListe(false)}
                    style={[s.gorunum, !liste && s.seciliGorunum]}
                  >
                    <LayoutGrid size={17} color={!liste ? renk.vurguYazi : renk.murekkep} />
                  </SimgeButon>
                  <SimgeButon
                    etiket="Liste görünümü"
                    onPress={() => setListe(true)}
                    style={[s.gorunum, liste && s.seciliGorunum]}
                  >
                    <List size={17} color={liste ? renk.vurguYazi : renk.murekkep} />
                  </SimgeButon>
                </>
              ) : null}
            </View>
          </View>
          {aktifFiltreler.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              accessibilityLabel="Seçilen filtreler"
              contentContainerStyle={{ gap: 7, alignItems: 'center', paddingBottom: 3 }}
              style={{ flexGrow: 0 }}
            >
              {aktifFiltreler.map((filtre) => (
                <HareketliBas
                  key={filtre.id}
                  onPress={filtre.kaldir}
                  accessibilityLabel={`${filtre.ad} filtresini kaldır`}
                  style={s.aktifFiltre}
                >
                  <Yazi numberOfLines={1} style={{ fontSize: 12, maxWidth: 210 }}>
                    {filtre.ad}
                  </Yazi>
                  <X color={renk.murekkep} size={13} />
                </HareketliBas>
              ))}
              <HareketliBas
                onPress={sifirla}
                accessibilityLabel="Tüm filtreleri temizle"
                style={{ minHeight: 44, paddingHorizontal: 8, justifyContent: 'center' }}
              >
                <Yazi style={{ fontSize: 12, color: renk.gri, textDecorationLine: 'underline' }}>
                  Temizle
                </Yazi>
              </HareketliBas>
            </ScrollView>
          ) : null}
          {sonuc.length > 0 ? (
            <IlanIzgarasi ilanlar={sonuc} liste={liste && !mobil} sikisik={!tablet} />
          ) : (
            <BosDurum
              baslik="Aradığın ilanı bulamadık"
              aciklama="Fiyat aralığını genişletebilir veya seçtiğin filtrelerden birkaçını kaldırabilirsin."
              eylem={<Buton onPress={sifirla}>Filtreleri temizle</Buton>}
            />
          )}
        </View>
      </View>
      <Pencere
        acik={filtreAcik}
        kapat={() => setFiltreAcik(false)}
        baslik="Filtrele"
        altlik={
          <Buton
            onPress={() => setFiltreAcik(false)}
            disabled={fiyatHatasi}
            simge={<ArrowRight color={renk.murekkep} size={17} />}
          >
            {sonuc.length} ilanı göster
          </Buton>
        }
      >
        {filtreIcerigi(true)}
      </Pencere>
      <Pencere acik={siralaAcik} kapat={() => setSiralaAcik(false)} baslik="İlanları sırala">
        <View accessibilityRole="radiogroup">
          {[
            { id: 'yeni', ad: 'En yeni ilanlar' },
            { id: 'artan', ad: 'Fiyat: düşükten yükseğe' },
            { id: 'azalan', ad: 'Fiyat: yüksekten düşüğe' },
          ].map((secenek) => (
            <HareketliBas
              key={secenek.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: siralama === secenek.id }}
              onPress={() => {
                setSiralama(secenek.id as Siralama);
                setSiralaAcik(false);
              }}
              style={[ortak.aralikli, { minHeight: 48, paddingVertical: 12 }]}
            >
              <Yazi>{secenek.ad}</Yazi>
              {siralama === secenek.id ? <Check size={18} color={renk.murekkep} /> : null}
            </HareketliBas>
          ))}
        </View>
      </Pencere>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    filtreBolum: { gap: 16, paddingBottom: 22, borderBottomWidth: 1, borderColor: renk.cizgi },
    filtreBaslik: { fontFamily: kalin, fontWeight: '700', fontSize: 14 },
    kutu: {
      width: 19,
      height: 19,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: renk.cizgi,
      alignItems: 'center',
      justifyContent: 'center',
    },
    kirik: { color: renk.gri, fontSize: 12 },
    yolBaglantisi: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: 5 },
    aktifFiltre: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 44,
      backgroundColor: renk.acik,
      borderWidth: 1,
      borderColor: renk.cizgi,
      paddingVertical: 8,
      paddingHorizontal: 11,
      borderRadius: 8,
    },
    gorunum: { width: 44, height: 44, borderRadius: 8 },
    seciliGorunum: { backgroundColor: renk.sari, borderColor: renk.sari },
  }),
);
