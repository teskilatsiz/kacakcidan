import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import SquareSplitHorizontal from 'lucide-react-native/icons/square-split-horizontal';
import X from 'lucide-react-native/icons/x';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Check from 'lucide-react-native/icons/check';
import { usePazar } from '../durum/Pazar';
import { useSonBakilanIlan } from '../durum/useSonBakilanIlan';
import { fiyatFarki, karsilastirmaSatirlari } from '../veri/ilanKarsilastirma';
import { ilanBedeli, ilanYolu, para, type Ilan } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { useEkran, useTema } from '../tasarim/tema';
import { Gorsel } from './Gorsel';
import { Buton, Pencere, SimgeButon, Yazi } from './Temel';
import { HareketliBas, Giris } from './Hareketli';
import { KarsilastirmaKatmani } from './KarsilastirmaKatmani';
import '../tasarim/karsilastirma.web.css';

function IlanOzeti({ ilan, ad, kompakt = false }: { ilan: Ilan; ad: string; kompakt?: boolean }) {
  const { renk } = useTema();
  return (
    <View
      dataSet={{ 'karsilastirma-ilani': kompakt ? 'kisa' : 'tam' }}
      style={{ flex: 1, minWidth: 0, gap: 8 }}
    >
      {!kompakt && <Yazi style={{ color: renk.gri, fontSize: 12 }}>{ad}</Yazi>}
      <View style={{ flexDirection: kompakt ? 'row' : 'column', gap: kompakt ? 10 : 12, minWidth: 0 }}>
        <Gorsel
          source={gorselKaynagi(ilan.gorsel)}
          sizes={kompakt ? '56px' : '(max-width: 699px) 42vw, 320px'}
          priority="normal"
          style={
            kompakt
              ? { width: 56, height: 48, borderRadius: 7, flexShrink: 0 }
              : { width: '100%', aspectRatio: 1.8, borderRadius: 10, backgroundColor: renk.zemin }
          }
          accessibilityLabel={`${ilan.baslik} kapak fotoğrafı`}
        />
        <View style={{ minWidth: 0, flex: kompakt ? 1 : undefined, gap: 2 }}>
          <Yazi
            numberOfLines={2}
            style={{ fontWeight: '600', fontSize: kompakt ? 12 : 14, lineHeight: kompakt ? 17 : 20 }}
          >
            {ilan.baslik}
          </Yazi>
          <Yazi style={{ fontWeight: '700', fontSize: kompakt ? 14 : 18, lineHeight: kompakt ? 20 : 25 }}>
            {ilanBedeli(ilan)}
          </Yazi>
          {!kompakt && <Yazi style={{ fontSize: 12, lineHeight: 18, color: renk.gri }}>{ilan.konum}</Yazi>}
        </View>
      </View>
    </View>
  );
}

export function IlanKarsilastirmasi({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();
  const { mobil, genislik, yukseklik } = useEkran();
  const { tumIlanlar, oturum, haberVer } = usePazar();
  const { onceki, temizle } = useSonBakilanIlan(ilan, tumIlanlar, oturum?.id);
  const [acik, setAcik] = useState(false);
  const [ertelendi, setErtelendi] = useState(false);
  const [yalnizFarklar, setYalnizFarklar] = useState(false);
  const satirlar = useMemo(() => (onceki ? karsilastirmaSatirlari(onceki, ilan) : []), [onceki, ilan]);
  if (!onceki) return null;
  const fark = fiyatFarki(onceki, ilan);
  const farkEtiketi =
    fark === undefined
      ? 'Fiyat farkı hesaplanamıyor'
      : fark === 0
        ? 'İki ilanın fiyatı aynı'
        : `Bu ilan ${para(Math.abs(fark))} ${fark > 0 ? 'daha pahalı' : 'daha uygun'}`;
  const gorunenSatirlar = yalnizFarklar ? satirlar.filter((satir) => satir.farkli) : satirlar;
  return (
    <View dataSet={{ 'karsilastirma-bileseni': 'true', 'oneri-gorunur': String(!ertelendi) }}>
      {ertelendi ? (
        <HareketliBas
          accessibilityRole="button"
          onPress={() => setAcik(true)}
          style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <SquareSplitHorizontal size={18} color={renk.murekkep} />
          <Yazi style={{ fontSize: 13, fontWeight: '600' }}>Son baktığın ilanla karşılaştır</Yazi>
        </HareketliBas>
      ) : (
        <KarsilastirmaKatmani sabit={genislik >= 1100 && yukseklik >= 560}>
          <Giris
            role="region"
            accessibilityLabel="Son baktığın ilanla karşılaştır"
            dataSet={{ 'karsilastirma-onerisi': 'true' }}
            style={{
              gap: 14,
              borderWidth: 1,
              borderColor: renk.cizgi,
              borderRadius: 12,
              backgroundColor: renk.beyaz,
              padding: mobil ? 14 : 18,
            }}
          >
            <View
              dataSet={{ 'karsilastirma-davet': 'true' }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: renk.zemin,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SquareSplitHorizontal size={21} color={renk.murekkep} strokeWidth={1.7} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Yazi style={{ fontSize: 14, fontWeight: '700', lineHeight: 20 }}>
                  Son baktığın ilanla karşılaştır
                </Yazi>
                <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 18 }}>
                  Fiyatı ve özellikleri yan yana gör.
                </Yazi>
              </View>
              <View dataSet={{ 'karsilastirma-mobil-kapat': 'true' }}>
                <SimgeButon
                  etiket="Karşılaştırma önerisini gizle"
                  onPress={() => setErtelendi(true)}
                  style={{ borderWidth: 0, backgroundColor: 'transparent' }}
                >
                  <X size={18} color={renk.murekkep} />
                </SimgeButon>
              </View>
            </View>
            <View dataSet={{ 'karsilastirma-onceki': 'true' }}>
              <IlanOzeti ilan={onceki} ad="Önceki ilan" kompakt />
            </View>
            <View dataSet={{ 'karsilastirma-simdiki': 'true' }}>
              <IlanOzeti ilan={ilan} ad="Bu ilan" kompakt />
            </View>
            <View
              dataSet={{ 'karsilastirma-davet-eylemleri': 'true' }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <Buton
                simge={<SquareSplitHorizontal size={17} strokeWidth={2.4} />}
                onPress={() => setAcik(true)}
                style={{ flex: mobil ? 1 : undefined, minHeight: 44 }}
              >
                Karşılaştır
              </Buton>
              <HareketliBas
                accessibilityRole="button"
                onPress={() => setErtelendi(true)}
                style={{
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                }}
              >
                <Yazi style={{ fontSize: 13 }}>Sonra</Yazi>
              </HareketliBas>
            </View>
          </Giris>
        </KarsilastirmaKatmani>
      )}
      <Pencere acik={acik} kapat={() => setAcik(false)} baslik="İlanları karşılaştır" genis>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: mobil ? 14 : 24 }}>
          <IlanOzeti ilan={onceki} ad="Önceki ilan" />
          <IlanOzeti ilan={ilan} ad="Bu ilan" />
        </View>
        <View style={{ padding: 14, borderRadius: 10, backgroundColor: renk.zemin, gap: 3 }}>
          <Yazi style={{ fontWeight: '700', fontSize: 15 }}>{farkEtiketi}</Yazi>
          <Yazi style={{ color: renk.gri, fontSize: 12, lineHeight: 18 }}>
            Ürün durumu ve eksik bilgileri de dikkate al.
          </Yazi>
        </View>
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
            {yalnizFarklar ? <Check size={16} color={renk.vurguYazi} /> : null}
          </View>
          <Yazi style={{ fontSize: 13 }}>Yalnızca farkları göster</Yazi>
        </HareketliBas>
        <View
          role="region"
          accessibilityLabel="Karşılaştırılan ilanların özellikleri"
          style={{ minWidth: 0 }}
        >
          {gorunenSatirlar.map((satir) => (
            <View
              key={satir.ad}
              style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingVertical: 12, gap: 6 }}
            >
              <Yazi style={{ color: renk.gri, fontSize: 12 }}>{satir.ad}</Yazi>
              <View style={{ flexDirection: 'row', gap: mobil ? 14 : 24 }}>
                <Yazi
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 13,
                    lineHeight: 20,
                    fontWeight: satir.farkli ? '600' : '400',
                  }}
                  accessibilityLabel={`Önceki ilan, ${satir.ad}: ${satir.onceki}`}
                >
                  {satir.onceki}
                </Yazi>
                <Yazi
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 13,
                    lineHeight: 20,
                    fontWeight: satir.farkli ? '600' : '400',
                  }}
                  accessibilityLabel={`Bu ilan, ${satir.ad}: ${satir.simdiki}`}
                >
                  {satir.simdiki}
                </Yazi>
              </View>
            </View>
          ))}
          {!gorunenSatirlar.length && <Yazi style={{ color: renk.gri }}>Belirtilen özellikler aynı.</Yazi>}
        </View>
        <Yazi style={{ color: renk.gri, fontSize: 12, lineHeight: 19 }}>
          Özellikler ilan sahiplerinin verdiği bilgilerdir. Belirtilmemiş alanlar ürünün kontrol edildiği
          anlamına gelmez.
        </Yazi>
        <Link href={ilanYolu(onceki)} asChild>
          <HareketliBas
            accessibilityRole="link"
            onPress={() => setAcik(false)}
            style={{
              minHeight: 44,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              borderWidth: 1,
              borderColor: renk.cizgi,
              borderRadius: 10,
            }}
          >
            <Yazi style={{ fontWeight: '600' }}>Önceki ilana dön</Yazi>
            <ArrowUpRight size={17} color={renk.murekkep} />
          </HareketliBas>
        </Link>
        <View style={{ borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 12, gap: 4 }}>
          <Yazi style={{ color: renk.gri, fontSize: 11, lineHeight: 17 }}>
            Son baktığın ilanlar 30 gün boyunca bu cihazda tutulur.
          </Yazi>
          <HareketliBas
            accessibilityRole="button"
            onPress={async () => {
              setAcik(false);
              const basarili = await temizle();
              haberVer(
                basarili
                  ? 'Göz atma geçmişin temizlendi.'
                  : 'Geçmiş silinemedi. Depolama izinlerini kontrol et.',
              );
            }}
            style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
          >
            <Yazi style={{ fontSize: 12, textDecorationLine: 'underline' }}>Göz atma geçmişini temizle</Yazi>
          </HareketliBas>
        </View>
      </Pencere>
    </View>
  );
}
