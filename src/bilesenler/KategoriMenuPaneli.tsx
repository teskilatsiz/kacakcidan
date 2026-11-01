import { useMemo, useState, type ComponentProps, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import MapPin from 'lucide-react-native/icons/map-pin';
import { kategoriYapisi, type KategoriSecenegi } from '../veri/kategoriler';
import { kategoriler, ilanYolu, ilanBedeli, type Ilan, type Kategori } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { usePazar } from '../durum/Pazar';
import { kalin, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { FavoriDugmesi, Giris, HareketliBas } from './Hareketli';
import { Gorsel } from './Gorsel';
import { KategoriSimgesi } from './KategoriSimgesi';
import { Yazi } from './Temel';

export type MenuSecimi = { kategori: Kategori; altKategori: string; marka: string };
type Props = {
  secim: MenuSecimi;
  degistir: (secim: MenuSecimi) => void;
  mobil: boolean;
  tumunuAc: () => void;
};

export function KategoriMenuPaneli({ secim, degistir, mobil, tumunuAc }: Props) {
  const { renk } = useTema();
  const s = useStiller();
  const { genislik } = useEkran();
  const { tumIlanlar } = usePazar();
  const { kategori, altKategori, marka } = secim;
  const yapi = useMemo(() => kategoriYapisi(kategori, altKategori), [kategori, altKategori]);
  const kategoriAdi = kategoriler.find((aday) => aday.id === kategori)?.ad ?? '';
  const kapsam = useMemo(
    () => tumIlanlar.filter((ilan) => ilan.kategori === kategori),
    [tumIlanlar, kategori],
  );
  const altKapsam = useMemo(
    () => kapsam.filter((ilan) => !altKategori || ilan.altKategori === altKategori),
    [kapsam, altKategori],
  );
  const sirala = (liste: KategoriSecenegi[], alan: 'altKategori' | 'marka' | 'model', ilanlar: Ilan[]) =>
    liste
      .map((secenek, sira) => ({
        ...secenek,
        sayi: ilanlar.filter((ilan) => ilan[alan] === secenek.id).length,
        sira,
      }))
      .sort((a, b) => b.sayi - a.sayi || a.sira - b.sira);
  const altlar = sirala(yapi.altKategoriler, 'altKategori', kapsam);
  const markalar = sirala(yapi.markalar, 'marka', altKapsam);
  const markaKapsami = altKapsam.filter((ilan) => !marka || ilan.marka === marka);
  const modeller = sirala(yapi.modeller[marka] ?? [], 'model', markaKapsami);
  const altAdi = yapi.altKategoriler.find((aday) => aday.id === altKategori)?.ad;
  const markaAdi = yapi.markalar.find((aday) => aday.id === marka)?.ad;
  const altSec = (id: string) => {
    const yeniMarkalar = kategoriYapisi(kategori, id).markalar;
    const ilkMarka =
      kapsam.find((ilan) => ilan.altKategori === id && yeniMarkalar.some((aday) => aday.id === ilan.marka))
        ?.marka ??
      yeniMarkalar[0]?.id ??
      '';
    degistir({ kategori, altKategori: id, marka: mobil ? '' : ilkMarka });
  };
  const altBaglantisi = (id: string) => ({
    pathname: '/kesfet' as const,
    params: { kategori, altKategori: id },
  });
  const modelBaglantisi = (id: string) => ({ pathname: '/kesfet' as const, params: { ...secim, model: id } });

  if (mobil) {
    const alan = !altKategori ? 'altKategori' : !marka ? 'marka' : 'model';
    const liste = alan === 'altKategori' ? altlar : alan === 'marka' ? markalar : modeller;
    const baslik =
      alan === 'altKategori'
        ? yapi.altKategoriBasligi
        : alan === 'marka'
          ? yapi.markaBasligi
          : yapi.modelBasligi;
    const geri = () => {
      if (marka) degistir({ ...secim, marka: '' });
      else if (altKategori) degistir({ ...secim, altKategori: '', marka: '' });
      else tumunuAc();
    };
    return (
      <View style={{ gap: 15 }}>
        <HareketliBas
          onPress={geri}
          style={s.geri}
          accessibilityLabel={
            marka ? 'Markalara dön' : altKategori ? 'Alt kategorilere dön' : 'Tüm kategorilere dön'
          }
        >
          <ArrowLeft size={18} color={renk.murekkep} />
          <Yazi style={{ fontSize: 13, fontWeight: '600' }}>
            {marka ? altAdi : altKategori ? kategoriAdi : 'Tüm kategoriler'}
          </Yazi>
        </HareketliBas>
        <View style={s.mobilSecim}>
          <KategoriSimgesi kategori={kategori} boyut={27} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Yazi style={{ fontWeight: '700', fontSize: 16 }}>{markaAdi ?? altAdi ?? kategoriAdi}</Yazi>
            <Yazi style={s.adet}>
              {marka ? markaKapsami.length : altKategori ? altKapsam.length : kapsam.length} ilan
            </Yazi>
          </View>
        </View>
        <Giris key={kategori + altKategori + marka} style={{ gap: 7 }}>
          <Yazi role="heading" aria-level={3} style={s.kolonBasligi}>
            {baslik}
          </Yazi>
          {liste.map((secenek) => {
            const ileri =
              alan === 'altKategori'
                ? kategoriYapisi(kategori, secenek.id).markalar.length > 0
                : alan === 'marka'
                  ? (yapi.modeller[secenek.id]?.length ?? 0) > 0
                  : false;
            const satir = (
              <HareketliBas
                onPress={
                  ileri
                    ? () =>
                        alan === 'altKategori'
                          ? altSec(secenek.id)
                          : degistir({ ...secim, marka: secenek.id })
                    : undefined
                }
                style={s.mobilSatir}
                accessibilityLabel={
                  secenek.ad + ', ' + secenek.sayi + ' ilan' + (ileri ? '. Alt seçenekleri göster' : '')
                }
              >
                <Yazi style={{ flex: 1, fontSize: 15, minWidth: 0 }}>{secenek.ad}</Yazi>
                <Yazi style={s.adet}>{secenek.sayi}</Yazi>
                <ChevronRight size={17} color={renk.gri} />
              </HareketliBas>
            );
            if (ileri) return <View key={secenek.id}>{satir}</View>;
            const href =
              alan === 'model'
                ? modelBaglantisi(secenek.id)
                : alan === 'marka'
                  ? { pathname: '/kesfet' as const, params: { ...secim, marka: secenek.id } }
                  : altBaglantisi(secenek.id);
            return (
              <Link key={secenek.id} href={href} asChild>
                {satir}
              </Link>
            );
          })}
          {!liste.length && (
            <Yazi style={{ color: renk.gri, paddingVertical: 10 }}>
              Bu kategorideki ilanları aşağıdan görebilirsin.
            </Yazi>
          )}
        </Giris>
      </View>
    );
  }

  const kolon = (baslik: string, children: ReactNode, altlik: ReactNode, agirlik: number, ilk = false) => (
    <View style={[s.kolon, { flex: genislik < 1100 ? 1 : agirlik }, !ilk && s.ayrac]}>
      <Yazi role="heading" aria-level={3} style={s.kolonBasligi}>
        {baslik}
      </Yazi>
      <ScrollView
        showsVerticalScrollIndicator
        style={{ maxHeight: 224, minHeight: 196 }}
        contentContainerStyle={{ paddingRight: 3 }}
      >
        {children}
      </ScrollView>
      {altlik}
    </View>
  );
  return (
    <View style={{ flexDirection: 'row', minWidth: 0 }}>
      {kolon(
        yapi.altKategoriBasligi,
        altlar.map((alt) => (
          <MenuSatiri key={alt.id} ad={alt.ad} secili={alt.id === altKategori} bas={() => altSec(alt.id)} />
        )),
        <MenuBaglantisi
          etiket={'Tüm ' + kategoriAdi + ' ilanları'}
          href={{ pathname: '/kesfet', params: { kategori } }}
        />,
        0.2,
        true,
      )}
      {kolon(
        yapi.markaGirisi ? 'Popüler markalar' : yapi.markaBasligi,
        markalar.map((aday) => (
          <MenuSatiri
            key={aday.id}
            ad={aday.ad}
            secili={aday.id === marka}
            bas={() => degistir({ ...secim, marka: aday.id })}
          />
        )),
        <MenuBaglantisi
          etiket={yapi.markaGirisi ? 'Tüm markaları gör' : 'Tüm ilanları gör'}
          href={{ pathname: '/kesfet', params: { kategori, altKategori } }}
        />,
        0.18,
      )}
      {kolon(
        yapi.modelGirisi ? 'Popüler modeller' : yapi.modelBasligi,
        modeller.length ? (
          modeller.map((model) => (
            <MenuSatiri key={model.id} href={modelBaglantisi(model.id)} ad={model.ad} />
          ))
        ) : (
          <Yazi style={{ color: renk.gri, fontSize: 13, paddingVertical: 9 }}>
            Bu gruptaki ilanları inceleyebilirsin.
          </Yazi>
        ),
        <MenuBaglantisi
          etiket={yapi.modelGirisi ? 'Tüm modelleri gör' : 'Tüm ilanları gör'}
          href={{ pathname: '/kesfet', params: { ...secim } }}
        />,
        0.19,
      )}
      {genislik >= 1100 && (
        <View style={[s.kolon, s.ayrac, { flex: 0.43 }]}>
          <Yazi role="heading" aria-level={3} style={s.kolonBasligi}>
            Hızlı keşif: {kategoriAdi}
          </Yazi>
          {markaKapsami.length ? (
            <View style={{ flexDirection: 'row', gap: 10, paddingTop: 4 }}>
              {markaKapsami.slice(0, genislik >= 1260 ? 3 : 2).map((ilan) => (
                <KucukIlan key={ilan.id} ilan={ilan} />
              ))}
            </View>
          ) : (
            <View style={s.bosKesif}>
              <KategoriSimgesi kategori={kategori} boyut={34} />
              <Yazi style={{ color: renk.gri, textAlign: 'center', fontSize: 13 }}>
                Bu seçimde henüz ilan yok.
              </Yazi>
              <MenuBaglantisi etiket="İlk ilanı sen ver" href="/ilan-ver" />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function MenuSatiri({
  ad,
  secili,
  bas,
  href,
}: {
  ad: string;
  secili?: boolean;
  bas?: () => void;
  href?: ComponentProps<typeof Link>['href'];
}) {
  const { renk } = useTema();
  const s = useStiller();
  const [uzerinde, setUzerinde] = useState(false);
  const icerik = (
    <HareketliBas
      onPress={bas}
      onHoverIn={() => setUzerinde(true)}
      onHoverOut={() => setUzerinde(false)}
      accessibilityState={bas ? { selected: secili } : undefined}
      style={StyleSheet.flatten([s.menuSatiri, (secili || uzerinde) && { backgroundColor: renk.sari }])}
    >
      <Yazi
        numberOfLines={1}
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 13,
          lineHeight: 21,
          fontWeight: secili ? '700' : '400',
          color: secili || uzerinde ? renk.vurguYazi : renk.murekkep,
        }}
      >
        {ad}
      </Yazi>
      <ChevronRight size={15} color={secili || uzerinde ? renk.vurguYazi : renk.gri} />
    </HareketliBas>
  );
  return href ? (
    <Link href={href} asChild>
      {icerik}
    </Link>
  ) : (
    icerik
  );
}

function MenuBaglantisi({ etiket, href }: { etiket: string; href: ComponentProps<typeof Link>['href'] }) {
  const { renk } = useTema();
  const s = useStiller();
  return (
    <Link href={href} asChild>
      <HareketliBas style={s.menuBaglantisi}>
        <Yazi numberOfLines={2} style={{ fontSize: 12, lineHeight: 18, fontWeight: '600', flexShrink: 1 }}>
          {etiket}
        </Yazi>
        <ArrowRight size={16} color={renk.murekkep} />
      </HareketliBas>
    </Link>
  );
}

function KucukIlan({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();
  const s = useStiller();
  const { favoriler, favoriDegistir } = usePazar();
  return (
    <View style={s.kucukIlan}>
      <Link href={ilanYolu(ilan)} asChild>
        <HareketliBas
          olcek={0.99}
          accessibilityLabel={ilan.baslik + ', ' + ilanBedeli(ilan)}
          style={{ flex: 1 }}
        >
          <View style={{ aspectRatio: 1.42, backgroundColor: renk.acik }}>
            <Gorsel
              source={gorselKaynagi(ilan.gorsel)}
              accessibilityLabel={ilan.baslik}
              style={StyleSheet.absoluteFill}
              priority="normal"
              contentFit="cover"
              transition={0}
            />
            {ilan.oneCikan && (
              <View style={s.rozet}>
                <Yazi style={{ fontSize: 9, lineHeight: 15, fontWeight: '700', color: renk.vurguYazi }}>
                  ÖNE ÇIKAN
                </Yazi>
              </View>
            )}
          </View>
          <View style={{ paddingHorizontal: 9, paddingTop: 8, paddingBottom: 7, gap: 4, flex: 1 }}>
            <Yazi
              numberOfLines={2}
              style={{ fontSize: 11, lineHeight: 16, fontWeight: '700', minHeight: 32 }}
            >
              {ilan.baslik}
            </Yazi>
            <Yazi
              numberOfLines={1}
              style={{ fontFamily: kalin, fontSize: 15, lineHeight: 22, fontWeight: '700' }}
            >
              {ilanBedeli(ilan)}
            </Yazi>
            <View style={s.kucukIlanAlt}>
              <MapPin size={11} color={renk.gri} />
              <Yazi numberOfLines={1} style={{ fontSize: 10, lineHeight: 16, color: renk.gri, flex: 1 }}>
                {ilan.konum}
              </Yazi>
            </View>
          </View>
        </HareketliBas>
      </Link>
      <View style={{ position: 'absolute', top: 5, right: 5 }}>
        <FavoriDugmesi
          kucuk
          secili={favoriler.includes(ilan.id)}
          onPress={() => favoriDegistir(ilan.id)}
          accessibilityLabel={
            ilan.baslik + (favoriler.includes(ilan.id) ? ' favorilerden çıkar' : ' favorilere ekle')
          }
        />
      </View>
    </View>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    kolon: { minWidth: 0, paddingHorizontal: 16, gap: 9 },
    ayrac: { borderLeftWidth: 1, borderLeftColor: renk.cizgi },
    kolonBasligi: { fontFamily: kalin, fontWeight: '700', fontSize: 15, lineHeight: 23 },
    adet: { fontSize: 12, lineHeight: 19, color: renk.gri },
    menuSatiri: {
      minHeight: 38,
      marginBottom: 5,
      borderRadius: 7,
      paddingVertical: 8,
      paddingHorizontal: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    menuBaglantisi: {
      minHeight: 38,
      paddingHorizontal: 9,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    geri: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 44 },
    mobilSecim: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 12,
      backgroundColor: renk.acik,
    },
    mobilSatir: {
      minHeight: 49,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 2,
      gap: 10,
      borderBottomWidth: 1,
      borderBottomColor: renk.cizgi,
    },
    kucukIlan: {
      flex: 1,
      minWidth: 0,
      maxWidth: 180,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: renk.beyaz,
    },
    kucukIlanAlt: {
      borderTopWidth: 1,
      borderColor: renk.cizgi,
      paddingTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 2,
    },
    rozet: {
      position: 'absolute',
      left: 6,
      top: 7,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 5,
      backgroundColor: renk.sari,
    },
    bosKesif: {
      minHeight: 224,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 13,
      borderRadius: 10,
      backgroundColor: renk.acik,
      padding: 16,
    },
  }),
);
