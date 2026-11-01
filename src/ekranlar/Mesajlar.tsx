import ShieldCheck from 'lucide-react-native/icons/shield-check';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Gorsel as Image } from '../bilesenler/Gorsel';
import { gorselKaynagi } from '../veri/gorseller';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import MapPin from 'lucide-react-native/icons/map-pin';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Search from 'lucide-react-native/icons/search';
import Send from 'lucide-react-native/icons/send';
import Tag from 'lucide-react-native/icons/tag';
import X from 'lucide-react-native/icons/x';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapGerekli } from '../bilesenler/HesapGerekli';
import { Giris, HareketliBas, useAzaltilmisHareket } from '../bilesenler/Hareketli';
import { Alan, Baslik, BosDurum, Buton, Pencere, SimgeButon, Yazi } from '../bilesenler/Temel';
import { kisiler, usePazar } from '../durum/Pazar';
import { font, kalin, ortak, temaStilleri, useEkran, useTema } from '../tasarim/tema';
import { ilanYolu, para, ilanBedeli } from '../veri/ilanlar';
import { urunKategorisiMi } from '../veri/anaKategoriler';
import { useGorunurAlan } from '../tasarim/gorunurAlan';
import { useKlavyeAcik } from '../tasarim/useKlavyeAcik';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';

export default function Mesajlar() {
  const { renk, koyu } = useTema();
  const s = useStiller();
  const { mobil, bosluk, genislik, yukseklik: height } = useEkran();
  const gorunurAlan = useGorunurAlan();
  const klavyeAcik = useKlavyeAcik();
  const [mesajOdakta, setMesajOdakta] = useState(false);
  const yazismaOdakta = Platform.OS === 'web' && mobil && klavyeAcik && mesajOdakta;
  useEffect(() => {
    if (!klavyeAcik) setMesajOdakta(false);
  }, [klavyeAcik]);
  const pencereYuksekligi = Platform.OS === 'web' ? gorunurAlan.yukseklik : height;
  const [webPanelYuksekligi, setWebPanelYuksekligi] = useState<number | undefined>(undefined);
  const [panelUst, setPanelUst] = useState(0);
  const sayfa = useRef<ComponentRef<typeof View>>(null);
  const { kisi: kisiParametresi, ilan: ilanParametresi } = useLocalSearchParams<{
    kisi?: string;
    ilan?: string;
  }>();
  const router = useRouter();
  const { mesajlar, mesajGonder, tumIlanlar, hazir, haberVer, oturum } = usePazar();
  const [secim, setSecim] = useState<string | null>(null);
  const [arama, setArama] = useState('');
  const [taslaklar, setTaslaklar] = useState<Record<string, string>>({});
  const [teklifAcik, setTeklifAcik] = useState(false);
  const [teklif, setTeklif] = useState('');
  const [teklifHatasi, setTeklifHatasi] = useState('');
  const akis = useRef<ComponentRef<typeof ScrollView>>(null);
  const sonKisi = useRef<string | null>(null);
  const azHareket = useAzaltilmisHareket();
  const sagPanel = genislik >= 1200;
  const parametre = hazir
    ? Array.isArray(kisiParametresi)
      ? kisiParametresi[0]
      : kisiParametresi
    : undefined;
  const ilanParam = hazir
    ? Array.isArray(ilanParametresi)
      ? ilanParametresi[0]
      : ilanParametresi
    : undefined;
  const digerKimlikler = new Set([
    ...Object.keys(mesajlar).filter((id) => id.startsWith('ilan-')),
    ...(parametre?.startsWith('ilan-') ? [parametre] : []),
  ]);
  const digerKisiler = [...digerKimlikler].flatMap((id) => {
    const urun = tumIlanlar.find((i) => i.id === (id === parametre && ilanParam ? ilanParam : id.slice(5)));
    return urun
      ? [
          {
            id,
            ad: urun.satici,
            harf: urun.satici
              .split(' ')
              .map((ad) => ad[0])
              .join('')
              .slice(0, 2)
              .toLocaleUpperCase('tr-TR'),
            ilanId: urun.id,
            son: 'Görüşmeyi başlat.',
            saat: '',
            renk: renk.acik,
          },
        ]
      : [];
  });
  const sonMesajZamani = (id: string) => Number(mesajlar[id]?.at(-1)?.id.split('-')[0]) || 0;
  const tumKisiler = [...kisiler, ...digerKisiler]
    .filter((k) => Object.prototype.hasOwnProperty.call(mesajlar, k.id) || k.id === parametre)
    .sort((a, b) => sonMesajZamani(b.id) - sonMesajZamani(a.id));
  const aktifId =
    parametre && tumKisiler.some((k) => k.id === parametre)
      ? parametre
      : (secim ?? (mobil ? null : (tumKisiler[0]?.id ?? null)));
  const kisi = tumKisiler.find((k) => k.id === aktifId);
  const ilan = tumIlanlar.find((i) => i.id === kisi?.ilanId);
  const urunIlani = ilan ? urunKategorisiMi(ilan.kategori) : false;
  const konusma = kisi ? (mesajlar[kisi.id] ?? []) : [];
  const taslak = kisi ? (taslaklar[kisi.id] ?? '') : '';
  const sorgu = arama.trim().toLocaleLowerCase('tr-TR');
  const gorusmeler = tumKisiler.filter((k) => {
    const urun = tumIlanlar.find((i) => i.id === k.ilanId);
    return !sorgu || `${k.ad} ${urun?.baslik ?? ''}`.toLocaleLowerCase('tr-TR').includes(sorgu);
  });

  useEffect(() => {
    if (!kisi) return;
    const degisti = sonKisi.current !== kisi.id;
    sonKisi.current = kisi.id;
    const zamanlayici = setTimeout(() => akis.current?.scrollToEnd({ animated: !degisti && !azHareket }), 40);
    return () => clearTimeout(zamanlayici);
  }, [kisi?.id, konusma.length, azHareket]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !oturum) return;
    let kare: number | undefined;
    const olc = () => {
      if (kare !== undefined) cancelAnimationFrame(kare);
      kare = requestAnimationFrame(() => {
        kare = undefined;
        const panel = document.querySelector<HTMLElement>('[data-mesajlar-duzeni]');
        if (!panel) return;
        const taban = gorunurAlan.ust + gorunurAlan.yukseklik;
        const menu = document.querySelector<HTMLElement>('[data-mobil-menu]')?.getBoundingClientRect();
        // Gizli mobil menü sıfır boyutla (0, 0) döner; onu kullanılabilir alan
        // sanıp çıkarmak masaüstü sohbetini 120 px'e kadar daraltıyordu.
        const menuGorunurVeAltaSabit =
          !!menu && menu.width > 0 && menu.height > 0 && menu.top < taban && menu.bottom >= taban - 2;
        const menuPayi = menuGorunurVeAltaSabit ? Math.max(0, taban - menu!.top) : 0;
        const kalan = Math.floor(taban - panel.getBoundingClientRect().top - menuPayi - (mobil ? 0 : 22));
        const altSinir = yazismaOdakta ? 120 : mobil ? 220 : 420;
        const uygunYukseklik = Math.max(altSinir, kalan);
        setWebPanelYuksekligi(mobil ? uygunYukseklik : Math.min(760, uygunYukseklik));
      });
    };
    olc();
    window.addEventListener('scroll', olc, { passive: true });
    return () => {
      window.removeEventListener('scroll', olc);
      if (kare !== undefined) cancelAnimationFrame(kare);
    };
  }, [gorunurAlan, klavyeAcik, mobil, kisi?.id, oturum?.id]);

  const gorusmeyiAc = (id: string) => {
    setSecim(id);
    router.setParams({ kisi: id, ilan: id.startsWith('ilan-') ? id.slice(5) : '' });
  };
  const listeyeDon = () => {
    setSecim(null);
    router.setParams({ kisi: '', ilan: '' });
  };
  const gonder = () => {
    if (!kisi || !taslak.trim() || !hazir) return;
    mesajGonder(kisi.id, taslak);
    setTaslaklar((eski) => ({ ...eski, [kisi.id]: '' }));
  };
  const teklifGonder = () => {
    if (!hazir) return;
    const tutar = Number(teklif);
    if (!Number.isSafeInteger(tutar) || tutar <= 0 || tutar > 999999999) {
      setTeklifHatasi('1 ile 999.999.999 TL arasında tam bir tutar yaz.');
      return;
    }
    if (!kisi) return;
    mesajGonder(kisi.id, `Merhaba, bu ilan için teklifim ${para(tutar)}. Değerlendirmek ister misiniz?`);
    setTeklifAcik(false);
    setTeklif('');
    setTeklifHatasi('');
    haberVer('Teklifin görüşmeye eklendi.');
  };

  if (!hazir)
    return (
      <Kabuk altBilgi={false}>
        <YuklemeIskeleti
          etiket="Mesajların yükleniyor"
          style={[ortak.alan, s.sayfa, { paddingHorizontal: bosluk }]}
        >
          <IskeletParcasi genislik={180} yukseklik={36} />
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: renk.cizgi,
              borderRadius: 16,
              overflow: 'hidden',
              height: Math.max(260, Math.min(680, pencereYuksekligi - 220)),
            }}
          >
            {!mobil || !kisiParametresi ? (
              <View
                style={{
                  width: mobil ? '100%' : 300,
                  padding: 18,
                  gap: 22,
                  borderRightWidth: mobil ? 0 : 1,
                  borderColor: renk.cizgi,
                }}
              >
                <IskeletParcasi yukseklik={48} />
                {Array.from({ length: 4 }, (_, sira) => (
                  <View key={sira} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <IskeletParcasi genislik={43} yukseklik={43} yaricap={22} />
                    <View style={{ flex: 1, gap: 8 }}>
                      <IskeletParcasi genislik="55%" />
                      <IskeletParcasi yukseklik={14} />
                      <IskeletParcasi genislik="80%" yukseklik={14} />
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
            {!mobil || !!kisiParametresi ? (
              <View style={{ flex: 1, padding: 18, gap: 18 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <IskeletParcasi genislik={40} yukseklik={40} yaricap={20} />
                  <View style={{ flex: 1, gap: 8 }}>
                    <IskeletParcasi genislik="45%" />
                    <IskeletParcasi genislik="70%" yukseklik={14} />
                  </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', gap: 14 }}>
                  <IskeletParcasi genislik="64%" yukseklik={56} yaricap={12} />
                  <IskeletParcasi
                    genislik="55%"
                    yukseklik={56}
                    yaricap={12}
                    style={{ alignSelf: 'flex-end' }}
                  />
                </View>
                <IskeletParcasi yukseklik={52} yaricap={10} />
              </View>
            ) : null}
          </View>
        </YuklemeIskeleti>
      </Kabuk>
    );
  if (!oturum) {
    const donusParams = new URLSearchParams();
    const donusKisi = Array.isArray(kisiParametresi) ? kisiParametresi[0] : kisiParametresi;
    const donusIlan = Array.isArray(ilanParametresi) ? ilanParametresi[0] : ilanParametresi;
    if (donusKisi) donusParams.set('kisi', donusKisi);
    if (donusIlan) donusParams.set('ilan', donusIlan);
    const donusSorgusu = donusParams.toString();
    const donus = `/mesajlar${donusSorgusu ? `?${donusSorgusu}` : ''}`;
    return (
      <HesapGerekli
        baslik="Mesajların için giriş yap"
        aciklama="Satıcılarla görüşmek ve tekliflerini takip etmek için hesabına giriş yap."
        donus={donus}
      />
    );
  }

  return (
    <Kabuk altBilgi={false} kaydirilabilir={false}>
      <View
        ref={sayfa}
        dataSet={{ 'mesaj-odagi': String(yazismaOdakta) }}
        style={[
          ortak.alan,
          s.sayfa,
          Platform.OS !== 'web' && { flex: 1, minHeight: 0 },
          { paddingHorizontal: mobil && kisi ? 0 : bosluk },
          mobil && kisi && { paddingVertical: 0, gap: 0 },
        ]}
      >
        {(!mobil || !kisi) && (
          <View style={[ortak.aralikli, { alignItems: 'flex-end' }]}>
            <View style={{ gap: 5 }}>
              <Baslik buyuk>Mesajlarım</Baslik>
              <Yazi style={{ color: renk.gri, fontSize: 13 }}>İlanlar hakkında yaptığın görüşmeler.</Yazi>
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'web' ? 0 : panelUst}
          onLayout={() => {
            if (Platform.OS === 'web') return;
            // KAV kendi yerel y konumunu zaten hesaba katar; yalnız üst kapsayıcının ekran farkı eklenir.
            sayfa.current?.measureInWindow((_x, y) => setPanelUst(y));
          }}
          style={[
            s.duzen,
            Platform.OS === 'web'
              ? {
                  height:
                    webPanelYuksekligi !== undefined
                      ? webPanelYuksekligi
                      : mobil
                        ? Math.max(220, (pencereYuksekligi || 844) - (kisi ? 190 : 290))
                        : Math.min(760, Math.max(420, (height || 900) - 290)),
                }
              : { flex: 1, minHeight: 0 },
            mobil && s.mobilDuzen,
          ]}
          dataSet={{ 'mesajlar-duzeni': 'true' }}
        >
          {(!mobil || !kisi) && (
            <View style={[s.liste, mobil && { width: '100%', borderRightWidth: 0 }]}>
              <View style={s.listeBaslik}>
                <Yazi style={s.kalin}>Görüşmeler</Yazi>
                <Yazi style={s.adet}>{tumKisiler.length}</Yazi>
              </View>
              <View style={s.arama} dataSet={{ 'girdi-kapsayici': 'true' }}>
                <Search size={17} color={renk.gri} />
                <TextInput
                  nativeID="mesajlar-gorusme-arama"
                  accessibilityLabel="Görüşmelerde kişi veya ilan ara"
                  autoComplete="off"
                  keyboardAppearance={koyu ? 'dark' : 'light'}
                  returnKeyType="search"
                  placeholder="Kişi veya ilan ara"
                  placeholderTextColor={renk.gri}
                  value={arama}
                  onChangeText={setArama}
                  style={s.aramaGirdi}
                  underlineColorAndroid="transparent"
                />
                {arama ? (
                  <HareketliBas
                    accessibilityLabel="Görüşme aramasını temizle"
                    onPress={() => setArama('')}
                    style={s.aramaTemizle}
                  >
                    <X size={15} color={renk.gri} />
                  </HareketliBas>
                ) : null}
              </View>
              <ScrollView contentContainerStyle={{ paddingVertical: 12 }} keyboardShouldPersistTaps="handled">
                {gorusmeler.map((k) => {
                  const son = mesajlar[k.id]?.at(-1);
                  const urun = tumIlanlar.find((i) => i.id === k.ilanId);
                  const secili = aktifId === k.id;
                  return (
                    <HareketliBas
                      key={k.id}
                      onPress={() => gorusmeyiAc(k.id)}
                      accessibilityLabel={`${k.ad}, ${urun?.baslik ?? 'ilan görüşmesi'}`}
                      accessibilityState={{ selected: secili }}
                      olcek={0.99}
                      style={[s.gorusme, secili && s.seciliGorusme]}
                    >
                      <View style={[s.avatar, { backgroundColor: koyu ? renk.acik : k.renk }]}>
                        <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 13 }}>{k.harf}</Yazi>
                      </View>
                      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                        <View style={[ortak.aralikli, { gap: 4 }]}>
                          <Yazi style={[s.kalin, { fontSize: 14 }]}>{k.ad}</Yazi>
                          <Yazi style={{ fontSize: 11, color: renk.gri }}>{son?.saat ?? k.saat}</Yazi>
                        </View>
                        <Yazi numberOfLines={1} style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
                          {urun?.baslik}
                        </Yazi>
                        <Yazi
                          numberOfLines={1}
                          style={{ fontSize: 13, lineHeight: 20, color: secili ? renk.murekkep : renk.gri }}
                        >
                          {son?.benim ? 'Sen: ' : ''}
                          {son?.yazi ?? k.son}
                        </Yazi>
                      </View>
                      {mobil && <ChevronRight size={16} color={renk.gri} />}
                    </HareketliBas>
                  );
                })}
                {gorusmeler.length === 0 && (
                  <View style={{ padding: 24, gap: 8 }}>
                    <Yazi style={s.kalin}>Görüşme bulunamadı.</Yazi>
                    <Yazi style={{ color: renk.gri, fontSize: 13 }}>
                      Başka bir kişi veya ürün adıyla deneyebilirsin.
                    </Yazi>
                  </View>
                )}
              </ScrollView>
              <View style={s.listeAlt}>
                <MessageCircle size={15} color={renk.gri} />
                <Yazi style={{ fontSize: 13, lineHeight: 21, color: renk.gri }}>
                  İlgini çeken bir ilandan yeni görüşme başlatabilirsin.
                </Yazi>
              </View>
            </View>
          )}

          {kisi && ilan ? (
            <>
              <View style={s.sohbet}>
                <View style={[s.sohbetBaslik, mobil && { paddingHorizontal: 12, minHeight: 64 }]}>
                  {mobil && (
                    <SimgeButon
                      etiket="Görüşme listesine dön"
                      onPress={listeyeDon}
                      style={{ borderWidth: 0, width: 44 }}
                    >
                      <ArrowLeft size={21} color={renk.murekkep} />
                    </SimgeButon>
                  )}
                  <View
                    style={[
                      s.avatar,
                      { backgroundColor: koyu ? renk.acik : kisi.renk, width: 40, height: 40 },
                    ]}
                  >
                    <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 12 }}>{kisi.harf}</Yazi>
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                    <Yazi style={s.kalin}>{kisi.ad}</Yazi>
                    <Yazi numberOfLines={1} style={{ fontSize: 12, color: renk.gri }}>
                      {ilan.baslik} hakkında
                    </Yazi>
                  </View>
                  <Link href={ilanYolu(ilan)} asChild>
                    <HareketliBas accessibilityLabel="Görüşülen ilanı aç" style={s.ilanBaglanti}>
                      <Yazi style={{ fontSize: 13, fontWeight: '600' }}>İlanı gör</Yazi>
                      <ArrowUpRight size={15} color={renk.murekkep} />
                    </HareketliBas>
                  </Link>
                </View>
                {!sagPanel && (!mobil || pencereYuksekligi >= 620) && (
                  <Link href={ilanYolu(ilan)} asChild>
                    <HareketliBas style={s.urunSeridi}>
                      <Image
                        source={gorselKaynagi(ilan.gorsel)}
                        accessibilityLabel={ilan.baslik}
                        style={s.urunMinik}
                        contentFit="cover"
                        transition={0}
                      />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Yazi numberOfLines={1} style={{ fontSize: 13, lineHeight: 20 }}>
                          {ilan.baslik}
                        </Yazi>
                        <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 13 }}>
                          {ilanBedeli(ilan)}
                        </Yazi>
                      </View>
                      <ChevronRight size={17} color={renk.gri} />
                    </HareketliBas>
                  </Link>
                )}
                <ScrollView
                  ref={akis}
                  style={{ flex: 1, minHeight: 0 }}
                  contentContainerStyle={[s.mesajAkisi, mobil && { paddingHorizontal: 18 }]}
                  onContentSizeChange={() => akis.current?.scrollToEnd({ animated: false })}
                  onLayout={() => akis.current?.scrollToEnd({ animated: false })}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode={
                    Platform.OS === 'web' ? 'none' : Platform.OS === 'ios' ? 'interactive' : 'on-drag'
                  }
                  accessibilityLabel={`${kisi.ad} ile görüşme`}
                >
                  <View style={s.tarih}>
                    <View style={s.tarihCizgi} />
                    <Yazi style={{ fontSize: 11, color: renk.gri }}>Görüşmenin başlangıcı</Yazi>
                    <View style={s.tarihCizgi} />
                  </View>
                  {konusma.length === 0 && (
                    <View
                      style={{ alignItems: 'center', paddingVertical: 35, paddingHorizontal: 15, gap: 10 }}
                    >
                      <MessageCircle size={28} color={renk.gri} />
                      <Yazi style={{ fontSize: 13, fontWeight: '600' }}>İlk mesaj senden gelsin.</Yazi>
                      <Yazi style={{ fontSize: 13, color: renk.gri, textAlign: 'center', maxWidth: 280 }}>
                        İlanla ilgili merak ettiklerini sorabilir, ayrıntıları burada konuşabilirsin.
                      </Yazi>
                    </View>
                  )}
                  {konusma.map((mesaj) => (
                    <View
                      key={mesaj.id}
                      style={[s.mesajSatiri, { alignItems: mesaj.benim ? 'flex-end' : 'flex-start' }]}
                    >
                      <View style={[s.balon, mesaj.benim ? s.benimBalon : s.karsiBalon]}>
                        <Yazi style={{ fontSize: 14, lineHeight: 23 }}>{mesaj.yazi}</Yazi>
                        <Yazi style={s.saat}>{mesaj.saat}</Yazi>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View
                  style={[s.yazmaAlani, mobil && { paddingHorizontal: 12 }]}
                  dataSet={{ 'klavye-yerlesimi': yazismaOdakta ? 'sabit' : 'akis' }}
                >
                  <View style={s.mesajGirdisi} dataSet={{ 'girdi-kapsayici': 'true' }}>
                    <TextInput
                      nativeID={`mesaj-${kisi.id}`}
                      accessibilityLabel={`${kisi.ad} için mesajın`}
                      autoComplete="off"
                      keyboardAppearance={koyu ? 'dark' : 'light'}
                      placeholder="Mesajını yaz…"
                      placeholderTextColor={renk.gri}
                      value={taslak}
                      onFocus={() => setMesajOdakta(true)}
                      onBlur={() => setMesajOdakta(false)}
                      onChangeText={(yazi) => setTaslaklar((eski) => ({ ...eski, [kisi.id]: yazi }))}
                      onSubmitEditing={gonder}
                      returnKeyType="send"
                      maxLength={2000}
                      underlineColorAndroid="transparent"
                      {...(Platform.OS === 'web'
                        ? { blurOnSubmit: false }
                        : { submitBehavior: 'submit' as const })}
                      editable={hazir}
                      style={[s.mesajGirdi, mobil && { fontSize: 16 }]}
                    />
                    {urunIlani && (
                      <HareketliBas
                        onPointerDown={Platform.OS === 'web' ? (olay) => olay.preventDefault() : undefined}
                        onPress={() => {
                          setTeklifHatasi('');
                          setTeklifAcik(true);
                        }}
                        accessibilityLabel="İlan için teklif yaz"
                        style={s.teklifKisa}
                      >
                        <Tag size={18} color={renk.gri} />
                        {!mobil && <Yazi style={{ color: renk.gri, fontSize: 13 }}>Teklif</Yazi>}
                      </HareketliBas>
                    )}
                    <HareketliBas
                      onPointerDown={Platform.OS === 'web' ? (olay) => olay.preventDefault() : undefined}
                      accessibilityLabel="Mesajı gönder"
                      disabled={!taslak.trim() || !hazir}
                      accessibilityState={{ disabled: !taslak.trim() || !hazir }}
                      onPress={gonder}
                      style={[s.gonder, (!taslak.trim() || !hazir) && { opacity: 0.4 }]}
                    >
                      <Send size={18} strokeWidth={1.8} color={renk.vurguYazi} />
                    </HareketliBas>
                  </View>
                </View>
              </View>
              {sagPanel && (
                <ScrollView style={s.ilanPaneli} contentContainerStyle={{ paddingBottom: 24 }}>
                  <Giris key={ilan.id} style={{ gap: 17 }}>
                    <Yazi style={s.kucukBaslik}>BU GÖRÜŞMEDEKİ İLAN</Yazi>
                    <Link href={ilanYolu(ilan)} asChild>
                      <HareketliBas
                        accessibilityLabel={`${ilan.baslik} ilanını aç`}
                        style={{ width: '100%' }}
                      >
                        <Image
                          source={gorselKaynagi(ilan.gorsel)}
                          accessibilityLabel={ilan.baslik}
                          style={s.urunGorseli}
                          contentFit="cover"
                          transition={0}
                        />
                      </HareketliBas>
                    </Link>
                    <View style={{ gap: 8 }}>
                      <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 16, lineHeight: 24 }}>
                        {ilan.baslik}
                      </Yazi>
                      <Yazi
                        style={{
                          fontFamily: kalin,
                          fontWeight: '700',
                          fontSize: 24,
                          lineHeight: 32,
                          letterSpacing: -0.7,
                        }}
                      >
                        {ilanBedeli(ilan)}
                      </Yazi>
                    </View>
                    <View style={s.detaylar}>
                      {urunIlani && (
                        <View style={ortak.aralikli}>
                          <Yazi style={s.detayEtiket}>Ürün durumu</Yazi>
                          <Yazi style={{ fontSize: 13 }}>{ilan.durum}</Yazi>
                        </View>
                      )}
                      <View style={[ortak.satir, { gap: 6 }]}>
                        <MapPin size={13} color={renk.gri} />
                        <Yazi style={s.detayEtiket}>{ilan.konum}</Yazi>
                      </View>
                    </View>
                    <Buton
                      ikincil
                      onPress={() => router.push(ilanYolu(ilan))}
                      simge={<ArrowUpRight size={16} color={renk.murekkep} />}
                      style={{ minHeight: 43 }}
                    >
                      İlanı incele
                    </Buton>
                    <View style={s.ipucu}>
                      <ShieldCheck size={20} color={renk.murekkep} />
                      <View style={{ flex: 1, gap: 5 }}>
                        <Yazi style={{ fontSize: 13, fontWeight: '700' }}>
                          {urunIlani ? 'Teslim almadan önce' : 'Ayrıntıları netleştir'}
                        </Yazi>
                        <Yazi style={{ fontSize: 13, lineHeight: 21, color: renk.gri }}>
                          {urunIlani
                            ? 'Ürünü görüp kontrol et. Teslim detaylarını satıcıyla birlikte netleştir.'
                            : 'İlandaki koşulları kontrol et, merak ettiklerini ilan sahibine sor.'}
                        </Yazi>
                      </View>
                    </View>
                  </Giris>
                </ScrollView>
              )}
            </>
          ) : (
            !mobil && (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <BosDurum
                  simge={<MessageCircle size={30} color={renk.murekkep} />}
                  baslik="Sohbet burada başlıyor."
                  aciklama="Bir görüşme seçerek kaldığın yerden devam et."
                />
              </View>
            )
          )}
        </KeyboardAvoidingView>
      </View>
      <Pencere acik={teklifAcik} kapat={() => setTeklifAcik(false)} baslik="Aklındaki fiyat ne?">
        <Yazi style={{ color: renk.gri, fontSize: 13 }}>
          {ilan?.baslik} için teklifini mesaj olarak ekle.
        </Yazi>
        <Alan
          etiket="Teklifin (TL)"
          placeholder="30000"
          keyboardType="number-pad"
          inputMode="numeric"
          value={teklif}
          onChangeText={(deger) => {
            setTeklif(deger.replace(/\D/g, ''));
            setTeklifHatasi('');
          }}
          hata={teklifHatasi}
          maxLength={9}
          onSubmitEditing={teklifGonder}
        />
        <Buton
          onPress={teklifGonder}
          disabled={!teklif || !hazir}
          simge={<Send size={16} color={renk.vurguYazi} />}
        >
          Teklifi mesaja ekle
        </Buton>
      </Pencere>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    sayfa: { paddingVertical: 22, gap: 18 },
    duzen: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: renk.beyaz,
    },
    mobilDuzen: { borderRadius: 0, borderWidth: 0 },
    liste: { width: 300, borderRightWidth: 1, borderColor: renk.cizgi, backgroundColor: renk.beyaz },
    listeBaslik: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      paddingHorizontal: 22,
      paddingTop: 20,
      paddingBottom: 16,
    },
    kalin: { fontFamily: kalin, fontWeight: '700', fontSize: 14 },
    adet: {
      backgroundColor: renk.zemin,
      color: renk.gri,
      fontSize: 12,
      lineHeight: 21,
      paddingHorizontal: 6,
      borderRadius: 6,
    },
    arama: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 18,
      paddingLeft: 12,
      paddingRight: 2,
      gap: 8,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 8,
      backgroundColor: renk.zemin,
      height: 48,
    },
    aramaGirdi: {
      flex: 1,
      minWidth: 0,
      height: 44,
      borderWidth: 0,
      fontFamily: font,
      fontSize: 13,
      color: renk.murekkep,
    },
    aramaTemizle: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    gorusme: {
      minHeight: 96,
      paddingVertical: 14,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderLeftWidth: 3,
      borderLeftColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: renk.cizgi,
    },
    seciliGorusme: { backgroundColor: renk.sariSoluk, borderLeftColor: renk.sari },
    avatar: { width: 43, height: 43, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    listeAlt: {
      borderTopWidth: 1,
      borderColor: renk.cizgi,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    sohbet: { flex: 1, minWidth: 0, minHeight: 0, backgroundColor: renk.zemin },
    sohbetBaslik: {
      minHeight: 72,
      backgroundColor: renk.beyaz,
      borderBottomWidth: 1,
      borderColor: renk.cizgi,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    ilanBaglanti: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44 },
    urunSeridi: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: renk.beyaz,
      borderBottomWidth: 1,
      borderColor: renk.cizgi,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    urunMinik: { width: 42, height: 42, borderRadius: 7, backgroundColor: renk.zemin },
    mesajAkisi: {
      paddingHorizontal: 24,
      paddingTop: 18,
      paddingBottom: 18,
      gap: 14,
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    tarih: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 4 },
    tarihCizgi: { width: 38, height: 1, backgroundColor: renk.cizgi },
    mesajSatiri: { width: '100%' },
    balon: {
      maxWidth: '86%',
      paddingHorizontal: 15,
      paddingTop: 11,
      paddingBottom: 7,
      borderRadius: 12,
      minWidth: 85,
    },
    benimBalon: { backgroundColor: renk.sariSoluk, borderBottomRightRadius: 3 },
    karsiBalon: {
      backgroundColor: renk.beyaz,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderBottomLeftRadius: 3,
    },
    saat: { alignSelf: 'flex-end', color: renk.gri, fontSize: 11, lineHeight: 16, marginTop: 3 },
    yazmaAlani: {
      backgroundColor: renk.beyaz,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 10,
      borderTopWidth: 1,
      borderColor: renk.cizgi,
    },
    mesajGirdisi: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: renk.zemin,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      paddingLeft: 12,
      paddingRight: 4,
      gap: 6,
    },
    mesajGirdi: {
      flex: 1,
      minWidth: 0,
      height: 52,
      borderWidth: 0,
      fontFamily: font,
      fontSize: 14,
      color: renk.murekkep,
    },
    gonder: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: renk.sari,
      alignItems: 'center',
      justifyContent: 'center',
    },
    teklifKisa: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      gap: 6,
      minHeight: 44,
      minWidth: 44,
    },
    ilanPaneli: {
      width: 250,
      backgroundColor: renk.beyaz,
      borderLeftWidth: 1,
      borderColor: renk.cizgi,
      padding: 20,
    },
    kucukBaslik: { fontSize: 11, letterSpacing: 0.8, color: renk.gri, fontWeight: '600' },
    urunGorseli: { width: '100%', height: 140, borderRadius: 10, backgroundColor: renk.zemin },
    detaylar: {
      paddingVertical: 16,
      gap: 11,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: renk.cizgi,
    },
    detayEtiket: { fontSize: 13, color: renk.gri },
    ipucu: {
      padding: 14,
      marginTop: 6,
      borderRadius: 10,
      backgroundColor: renk.acik,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
  }),
);
