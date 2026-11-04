import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import SquareSplitHorizontal from 'lucide-react-native/icons/square-split-horizontal';
import X from 'lucide-react-native/icons/x';
import { usePazar } from '../durum/Pazar';
import { useSonBakilanIlan } from '../durum/useSonBakilanIlan';
import { karsilastirmaAdaylari } from '../veri/ilanKarsilastirma';
import { ilanBedeli, type Ilan } from '../veri/ilanlar';
import { gorselKaynagi } from '../veri/gorseller';
import { useEkran, useTema } from '../tasarim/tema';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
import { Gorsel } from './Gorsel';
import { Buton, Pencere, SimgeButon, Yazi } from './Temel';
import { HareketliBas, Giris } from './Hareketli';
import { KarsilastirmaKatmani, karsilastirmaOnerisiAcilebilir } from './KarsilastirmaKatmani';
import '../tasarim/karsilastirma.web.css';

// Aynı ilanın önerisi, bu oturumda yeniden açılmaz; karşılaştır düğmesi erişilebilir kalır.
const gosterilenOneriler = new Set<string>();
const KarsilastirmaIcerigi = lazy(() => import('./KarsilastirmaIcerigi'));

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
  const { mobil, kompakt, yukseklik } = useEkran();
  const { tumIlanlar, favoriler, oturum, haberVer, bildirim } = usePazar();
  const { onceki, temizle } = useSonBakilanIlan(ilan, tumIlanlar, oturum?.id);
  const oneriAnahtari = `${oturum?.id ?? 'misafir'}:${ilan.id}`;
  const [acik, setAcik] = useState(false);
  const [oneriAcik, setOneriAcik] = useState(false);
  const [ertelendi, setErtelendi] = useState(() => gosterilenOneriler.has(oneriAnahtari));
  const [secimler, setSecimler] = useState<[string | undefined, string | undefined]>([ilan.id, undefined]);
  const elleDegisti = useRef(false);
  const klavyeAcik = useKlavyeAcik();
  const klavye = useRef(klavyeAcik);
  klavye.current = klavyeAcik;
  const bildirimAcik = useRef(!!bildirim);
  bildirimAcik.current = !!bildirim;
  const sabitSerit = !kompakt && yukseklik >= 560;
  useEffect(() => {
    elleDegisti.current = false;
    setSecimler([ilan.id, undefined]);
    setAcik(false);
    setErtelendi(gosterilenOneriler.has(oneriAnahtari));
  }, [oneriAnahtari, ilan.id]);
  useEffect(() => {
    if (onceki && !elleDegisti.current) setSecimler([ilan.id, onceki.id]);
  }, [onceki?.id, ilan.id, oneriAnahtari]);
  const seciliIlanlar = secimler.map((id) =>
    id === ilan.id ? ilan : tumIlanlar.find((kayit) => kayit.id === id && kayit.yayinDurumu !== 'kaldirildi'),
  ) as [Ilan | undefined, Ilan | undefined];
  const secimiDegistir = (sira: 0 | 1, secilen?: Ilan) => {
    const digerId = secimler[sira === 0 ? 1 : 0];
    if (secilen && !karsilastirmaAdaylari(tumIlanlar, ilan, digerId).some((aday) => aday.id === secilen.id))
      return;
    elleDegisti.current = true;
    setSecimler((once) => (sira === 0 ? [secilen?.id, once[1]] : [once[0], secilen?.id]));
  };

  useFocusEffect(
    useCallback(() => {
      let zamanlayici: ReturnType<typeof setTimeout> | undefined;
      const oneriyiGoster = () => {
        // Yazarken veya başka bir pencere açıkken kullanıcının odağını bölme.
        if (klavye.current || bildirimAcik.current || !karsilastirmaOnerisiAcilebilir()) {
          zamanlayici = setTimeout(oneriyiGoster, 400);
          return;
        }
        gosterilenOneriler.add(oneriAnahtari);
        setOneriAcik(true);
      };
      if (kompakt && onceki && !gosterilenOneriler.has(oneriAnahtari))
        zamanlayici = setTimeout(oneriyiGoster, 2500);
      return () => {
        clearTimeout(zamanlayici);
        setOneriAcik(false);
        setAcik(false);
      };
    }, [kompakt, onceki?.id, oneriAnahtari]),
  );

  const oneriyiKapat = () => {
    gosterilenOneriler.add(oneriAnahtari);
    setOneriAcik(false);
    setErtelendi(true);
  };
  const karsilastirmayiAc = () => {
    oneriyiKapat();
    setAcik(true);
  };
  return (
    <View
      dataSet={{
        'karsilastirma-bileseni': 'true',
        'oneri-gorunur': String(!!onceki && sabitSerit && !ertelendi),
        'sabit-oneri': String(!!onceki && sabitSerit && !ertelendi),
      }}
    >
      <HareketliBas
        accessibilityRole="button"
        accessibilityLabel="İlanları karşılaştır"
        onPress={karsilastirmayiAc}
        style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}
      >
        <SquareSplitHorizontal size={18} color={renk.murekkep} strokeWidth={2.4} />
        <Yazi style={{ fontSize: 13, fontWeight: '600' }}>Karşılaştır</Yazi>
      </HareketliBas>
      {!!onceki && sabitSerit && !ertelendi ? (
        <KarsilastirmaKatmani sabit={sabitSerit}>
          <Giris
            role="region"
            accessibilityLabel="Son baktığın ilanla karşılaştır"
            dataSet={{ 'karsilastirma-onerisi': 'true', 'karsilastirma-sabit': String(sabitSerit) }}
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
                  onPress={oneriyiKapat}
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
                onPress={karsilastirmayiAc}
                style={{ flex: mobil ? 1 : undefined, minHeight: 44 }}
              >
                Karşılaştır
              </Buton>
              <HareketliBas
                accessibilityRole="button"
                onPress={oneriyiKapat}
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
      ) : null}
      <Pencere
        acik={acik || (kompakt && oneriAcik)}
        kapat={() => {
          oneriyiKapat();
          setAcik(false);
        }}
        baslik={oneriAcik && !acik ? 'İlanları yan yana gör' : 'İlanları karşılaştır'}
        genis={acik}
        alttan={kompakt}
      >
        {oneriAcik && !acik && onceki ? (
          <View dataSet={{ 'karsilastirma-alt-penceresi': 'true' }} style={{ gap: 16, minWidth: 0 }}>
            <Yazi style={{ color: renk.gri, fontSize: 14, lineHeight: 21 }}>
              Son baktığın ilanla fiyatını ve özelliklerini karşılaştırabilirsin.
            </Yazi>
            <View style={{ gap: 8 }}>
              <Yazi style={{ color: renk.gri, fontSize: 12 }}>Önceki ilan</Yazi>
              <IlanOzeti ilan={onceki} ad="Önceki ilan" kompakt />
            </View>
            <View style={{ gap: 8 }}>
              <Yazi style={{ color: renk.gri, fontSize: 12 }}>Bu ilan</Yazi>
              <IlanOzeti ilan={ilan} ad="Bu ilan" kompakt />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Buton
                simge={<SquareSplitHorizontal size={17} strokeWidth={2.4} />}
                onPress={karsilastirmayiAc}
                style={{ flex: 1, minHeight: 48 }}
              >
                Karşılaştır
              </Buton>
              <Buton ikincil onPress={oneriyiKapat} style={{ minHeight: 48 }}>
                Sonra
              </Buton>
            </View>
          </View>
        ) : (
          <Suspense
            fallback={
              <View
                accessibilityLabel="Karşılaştırma açılıyor"
                style={{ height: 240, borderRadius: 10, backgroundColor: renk.zemin }}
              />
            }
          >
            {acik && (
              <KarsilastirmaIcerigi
                baglam={ilan}
                ilanlar={tumIlanlar}
                favoriler={oturum ? favoriler : []}
                secimler={seciliIlanlar}
                degistir={secimiDegistir}
                kapat={() => setAcik(false)}
                gecmisiTemizle={async () => {
                  setAcik(false);
                  const basarili = await temizle();
                  haberVer(
                    basarili
                      ? 'Göz atma geçmişin temizlendi.'
                      : 'Geçmiş silinemedi. Depolama izinlerini kontrol et.',
                  );
                }}
              />
            )}
          </Suspense>
        )}
      </Pencere>
    </View>
  );
}
