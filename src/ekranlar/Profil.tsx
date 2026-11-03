import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Camera from 'lucide-react-native/icons/camera';
import Eye from 'lucide-react-native/icons/eye';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import MapPin from 'lucide-react-native/icons/map-pin';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Package from 'lucide-react-native/icons/package';
import Pencil from 'lucide-react-native/icons/pencil';
import Settings from 'lucide-react-native/icons/settings';
import UserRound from 'lucide-react-native/icons/user-round';
import EyeOff from 'lucide-react-native/icons/eye-off';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import { Gorsel } from '../bilesenler/Gorsel';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, BosDurum, Buton, Pencere, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';
import { usePazar } from '../durum/Pazar';
import { ProfilDuzenlemePenceresi, ProfilResmi } from '../bilesenler/ProfilFormu';
import { CikisDugmesi } from '../bilesenler/CikisOnayi';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import { ilanBedeli, ilanYolu } from '../veri/ilanlar';
import { ilanKaldirmaNedenleri, type IlanKaldirmaNedeni } from '../veri/ilanYonetimi';
import { saticiYolu } from '../veri/saticilar';
import { AlisverisIslemleri } from '../bilesenler/AlisverisIslemleri';

export default function Profil() {
  const { renk } = useTema();
  const s = useStiller();

  const {
    profil,
    tumIlanlar,
    favoriler,
    eklenenler,
    ilaniYayindanKaldir,
    ilaniYenidenYayinla,
    oturum,
    hazir,
    ilanIstatistikleri,
    sorular,
    haberVer,
    alisverisler,
  } = usePazar();
  const { mobil, dar, bosluk } = useEkran();
  const yanPanel = !dar;
  const router = useRouter();
  const { bolum } = useLocalSearchParams<{ bolum?: string }>();
  const [duzenle, setDuzenle] = useState(false);
  const [sekme, setSekme] = useState<'ilanlar' | 'favoriler' | 'alisverisler'>('ilanlar');
  useEffect(() => {
    if (bolum === 'alisverisler') setSekme('alisverisler');
  }, [bolum]);
  const [silinecek, setSilinecek] = useState('');
  const [yayinFiltresi, setYayinFiltresi] = useState<'yayinda' | 'kaldirildi'>('yayinda');
  const [kaldirmaNedeni, setKaldirmaNedeni] = useState<IlanKaldirmaNedeni>('satildi');
  const [yayinMesgul, setYayinMesgul] = useState(false);
  const [yayinHatasi, setYayinHatasi] = useState('');
  const tumBenimkiler = eklenenler.map(
    (ilan) => tumIlanlar.find((kayit) => kayit.id === ilan.id) ?? { ...ilan, satici: profil.ad, benim: true },
  );
  const benimkiler = tumBenimkiler.filter((ilan) =>
    yayinFiltresi === 'kaldirildi' ? ilan.yayinDurumu === 'kaldirildi' : ilan.yayinDurumu !== 'kaldirildi',
  );
  const kaydedilen = tumIlanlar.filter((ilan) => favoriler.includes(ilan.id));
  const silinecekIlan = eklenenler.find((ilan) => ilan.id === silinecek);

  const ac = () => setDuzenle(true);
  async function kaldir() {
    if (yayinMesgul) return;
    setYayinMesgul(true);
    const sonuc = await ilaniYayindanKaldir(silinecek, kaldirmaNedeni);
    setYayinMesgul(false);
    if (!sonuc.basarili) {
      setYayinHatasi(sonuc.hata ?? 'İşlem tamamlanamadı.');
      return;
    }
    setSilinecek('');
    setYayinFiltresi('kaldirildi');
  }
  async function yenidenYayinla(id: string) {
    if (yayinMesgul) return;
    setYayinMesgul(true);
    const sonuc = await ilaniYenidenYayinla(id);
    setYayinMesgul(false);
    if (!sonuc.basarili) haberVer(sonuc.hata ?? 'İlanın yeniden yayınlanamadı.');
    else setYayinFiltresi('yayinda');
  }

  if (!hazir)
    return (
      <Kabuk>
        <View style={[ortak.alan, { maxWidth: 1280, paddingHorizontal: bosluk, paddingVertical: 28 }]}>
          <YuklemeIskeleti etiket="Hesabın yükleniyor" style={{ gap: 24 }}>
            <IskeletParcasi genislik={160} yukseklik={36} />
            <View style={{ flexDirection: yanPanel ? 'row' : 'column', gap: 24 }}>
              <View style={{ width: yanPanel ? 290 : '100%', padding: 20, gap: 20 }}>
                <View style={{ flexDirection: 'row', gap: 14 }}>
                  <IskeletParcasi genislik={64} yukseklik={64} yaricap={32} />
                  <View style={{ flex: 1, gap: 10, justifyContent: 'center' }}>
                    <IskeletParcasi genislik="80%" yukseklik={22} />
                    <IskeletParcasi genislik="65%" />
                  </View>
                </View>
                <IskeletParcasi yukseklik={44} />
                <IskeletParcasi yukseklik={60} />
                <IskeletParcasi yukseklik={44} />
              </View>
              <View style={{ flex: 1, gap: 20 }}>
                <IskeletParcasi yukseklik={48} />
                {[0, 1].map((sira) => (
                  <View key={sira} style={{ flexDirection: 'row', gap: 14, padding: 16 }}>
                    <IskeletParcasi genislik={84} yukseklik={84} />
                    <View style={{ flex: 1, gap: 10 }}>
                      <IskeletParcasi yukseklik={20} />
                      <IskeletParcasi genislik="55%" />
                      <IskeletParcasi genislik="75%" />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </YuklemeIskeleti>
        </View>
      </Kabuk>
    );
  if (!oturum)
    return (
      <Kabuk>
        <View
          style={[
            ortak.alan,
            { maxWidth: 600, paddingHorizontal: bosluk, paddingTop: mobil ? 34 : 60, paddingBottom: 48 },
          ]}
        >
          <View
            style={[
              { ...ortak.kart, backgroundColor: renk.beyaz, borderColor: renk.cizgi },
              {
                width: '100%',
                padding: mobil ? 24 : 36,
                gap: 20,
                alignItems: mobil ? 'center' : 'stretch',
              },
            ]}
          >
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: renk.sari,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserRound color={renk.vurguYazi} size={27} strokeWidth={1.6} />
            </View>
            <Baslik buyuk style={mobil ? { textAlign: 'center' } : undefined}>
              Hesabım
            </Baslik>
            <Yazi
              style={{
                color: renk.gri,
                textAlign: mobil ? 'center' : 'left',
                maxWidth: mobil ? 360 : undefined,
              }}
            >
              İlanlarını yönetmek, satıcılarla konuşmak ve favorilerini bir arada görmek için giriş yap.
            </Yazi>
            <Buton
              style={mobil ? { width: '100%', maxWidth: 360 } : undefined}
              onPress={() => router.push({ pathname: '/giris', params: { donus: '/profil' } })}
            >
              Giriş yap
            </Buton>
            <Buton
              ikincil
              style={mobil ? { width: '100%', maxWidth: 360 } : undefined}
              onPress={() => router.push({ pathname: '/kayit', params: { donus: '/profil' } })}
            >
              Hesap oluştur
            </Buton>
          </View>
        </View>
      </Kabuk>
    );

  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 1280,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 20 : 28,
            paddingBottom: 32,
            gap: 22,
          },
        ]}
      >
        <Baslik buyuk>Hesabım</Baslik>
        <View style={{ flexDirection: yanPanel ? 'row' : 'column', gap: 24, alignItems: 'flex-start' }}>
          <View style={[s.profilKart, { padding: mobil ? 18 : 22, width: yanPanel ? 290 : '100%' }]}>
            <View style={[ortak.satir, { minWidth: 0, gap: 14, alignItems: 'flex-start' }]}>
              <HareketliBas
                accessibilityLabel="Profil fotoğrafını düzenle"
                onPress={ac}
                style={s.fotografDugmesi}
              >
                <ProfilResmi ad={profil.ad} fotograf={profil.fotograf} boyut={mobil || yanPanel ? 64 : 76} />
                <View style={s.kameraRozeti}>
                  <Camera size={12} color={renk.vurguYazi} />
                </View>
              </HareketliBas>
              <View style={{ flex: 1, minWidth: 0, gap: 7, paddingTop: 3 }}>
                <Yazi numberOfLines={3} style={s.ad}>
                  {profil.ad}
                </Yazi>
                <View style={[ortak.satir, { gap: 5, minWidth: 0, alignItems: 'flex-start' }]}>
                  <MapPin size={14} color={renk.gri} style={{ marginTop: 3, flexShrink: 0 }} />
                  <Yazi numberOfLines={2} style={s.konum}>
                    {profil.konum || 'Konum belirtilmedi'}
                  </Yazi>
                </View>
              </View>
            </View>
            {profil.hakkinda.trim() ? (
              <Yazi style={s.hakkinda}>{profil.hakkinda}</Yazi>
            ) : (
              <HareketliBas onPress={ac} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Yazi style={{ fontSize: 13, color: renk.gri }}>Kendinden kısaca bahset</Yazi>
              </HareketliBas>
            )}
            <Link href={saticiYolu(oturum.id)} asChild>
              <HareketliBas
                accessibilityRole="link"
                style={{
                  minHeight: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <Yazi style={{ fontSize: 12, color: renk.gri }}>Profilimi görüntüle</Yazi>
                <ChevronRight size={16} color={renk.gri} />
              </HareketliBas>
            </Link>
            <HareketliBas onPress={ac} accessibilityLabel="Profili düzenle" style={s.duzenle}>
              <Pencil color={renk.murekkep} size={16} />
              <Yazi style={s.kucukKalin}>Profili düzenle</Yazi>
            </HareketliBas>
            <View style={s.ozetSatiri}>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Yazi style={s.ozetSayisi}>
                  {tumBenimkiler.filter((ilan) => ilan.yayinDurumu !== 'kaldirildi').length}
                </Yazi>
                <Yazi style={s.ozet}>Yayındaki ilan</Yazi>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Yazi style={s.ozetSayisi}>{kaydedilen.length}</Yazi>
                <Yazi style={s.ozet}>Kayıtlı favori</Yazi>
              </View>
            </View>
            <Link href="/ayarlar" asChild>
              <HareketliBas accessibilityLabel="Hesap ayarları" style={s.ayarlar}>
                <Settings size={18} color={renk.murekkep} />
                <Yazi style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: '600' }}>Hesap ayarları</Yazi>
                <ChevronRight size={16} color={renk.gri} />
              </HareketliBas>
            </Link>
            <CikisDugmesi />
          </View>

          <View style={[{ gap: 18 }, yanPanel ? { flex: 1, minWidth: 0 } : { width: '100%' }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0 }}
              contentContainerStyle={[s.sekmeler, mobil && { flexGrow: 1, gap: 0 }]}
              accessibilityLabel="Hesap içeriği"
            >
              {[
                { id: 'ilanlar' as const, ad: 'İlanlarım', sayi: tumBenimkiler.length, simge: Package },
                { id: 'favoriler' as const, ad: 'Favorilerim', sayi: kaydedilen.length, simge: Heart },
                {
                  id: 'alisverisler' as const,
                  ad: 'Alışverişlerim',
                  sayi: alisverisler.filter(
                    (islem) => islem.aliciId === oturum.id || islem.saticiId === oturum.id,
                  ).length,
                  simge: ShoppingBag,
                },
              ].map(({ id, ad, sayi, simge: Simge }) => (
                <HareketliBas
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={`${ad}, ${sayi} ${id === 'alisverisler' ? 'işlem' : 'ilan'}`}
                  accessibilityState={{ selected: sekme === id }}
                  onPress={() => setSekme(id)}
                  style={[
                    s.sekme,
                    mobil && { flex: 1, minWidth: 0, paddingHorizontal: 4 },
                    sekme === id ? s.seciliSekme : null,
                  ]}
                >
                  {!mobil && <Simge size={16} color={sekme === id ? renk.murekkep : renk.gri} />}
                  <Yazi style={{ fontSize: mobil ? 12 : 13, fontWeight: sekme === id ? '700' : '500' }}>
                    {ad}
                  </Yazi>
                  {!mobil && <Yazi style={s.sayac}>{sayi}</Yazi>}
                </HareketliBas>
              ))}
            </ScrollView>
            {sekme === 'ilanlar' && tumBenimkiler.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  {
                    id: 'yayinda' as const,
                    ad: 'Yayında',
                    sayi: tumBenimkiler.filter((ilan) => ilan.yayinDurumu !== 'kaldirildi').length,
                  },
                  {
                    id: 'kaldirildi' as const,
                    ad: 'Yayında değil',
                    sayi: tumBenimkiler.filter((ilan) => ilan.yayinDurumu === 'kaldirildi').length,
                  },
                ].map((secenek) => (
                  <HareketliBas
                    key={secenek.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: yayinFiltresi === secenek.id }}
                    onPress={() => setYayinFiltresi(secenek.id)}
                    style={{
                      minHeight: 40,
                      paddingHorizontal: 13,
                      borderRadius: 8,
                      flexDirection: 'row',
                      gap: 7,
                      alignItems: 'center',
                      backgroundColor: yayinFiltresi === secenek.id ? renk.sari : renk.zemin,
                    }}
                  >
                    <Yazi
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: yayinFiltresi === secenek.id ? renk.vurguYazi : renk.murekkep,
                      }}
                    >
                      {secenek.ad} ({secenek.sayi})
                    </Yazi>
                  </HareketliBas>
                ))}
              </View>
            )}
            {sekme === 'alisverisler' ? (
              <AlisverisIslemleri />
            ) : sekme === 'ilanlar' && benimkiler.length > 0 ? (
              <View style={s.ilanListesi}>
                {benimkiler.map((ilan, sira) => (
                  <View key={ilan.id} style={[s.ilanSatiri, sira > 0 && s.ilanAyirici]}>
                    <Link href={ilanYolu(ilan)} asChild>
                      <HareketliBas
                        accessibilityLabel={`${ilan.baslik}, ${ilanBedeli(ilan)}, ilanı aç`}
                        style={s.ilanBaglantisi}
                      >
                        <Gorsel
                          source={gorselKaynagi(ilan.gorsel)}
                          accessibilityLabel=""
                          style={[s.ilanResmi, mobil && { width: 72, height: 72 }]}
                        />
                        <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                          <Yazi numberOfLines={2} style={s.ilanAdi}>
                            {ilan.baslik}
                          </Yazi>
                          <Yazi style={s.fiyat}>{ilanBedeli(ilan)}</Yazi>
                          <Yazi numberOfLines={1} style={s.ilanBilgisi}>
                            {ilan.yayinDurumu === 'kaldirildi'
                              ? ilan.kaldirmaNedeni === 'satildi'
                                ? 'Satış tamamlandı'
                                : 'Yayında değil'
                              : `${ilan.durum} · ${ilan.zaman}`}
                          </Yazi>
                          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                            <View style={[ortak.satir, { gap: 4 }]}>
                              <Eye size={12} color={renk.gri} />
                              <Yazi style={s.ilanBilgisi}>
                                {ilanIstatistikleri[ilan.id]?.goruntulenme ?? 0} görüntülenme
                              </Yazi>
                            </View>
                            <View style={[ortak.satir, { gap: 4 }]}>
                              <Heart size={12} color={renk.gri} />
                              <Yazi style={s.ilanBilgisi}>
                                {ilanIstatistikleri[ilan.id]?.favori ?? 0} favori
                              </Yazi>
                            </View>
                          </View>
                          {sorular.some((soru) => soru.ilanId === ilan.id && !soru.cevap) && (
                            <Yazi style={{ fontSize: 11, fontWeight: '700' }}>
                              {sorular.filter((soru) => soru.ilanId === ilan.id && !soru.cevap).length} soru
                              cevap bekliyor
                            </Yazi>
                          )}
                        </View>
                      </HareketliBas>
                    </Link>
                    {eklenenler.some((kayit) => kayit.id === ilan.id) ? (
                      <View style={[s.ilanEylemleri, mobil && s.ilanEylemleriMobil]}>
                        <HareketliBas
                          accessibilityRole="button"
                          accessibilityLabel={`${ilan.baslik} ilanının soruları`}
                          onPress={() => {
                            const yol = ilanYolu(ilan);
                            router.push({ ...yol, params: { ...yol.params, bolum: 'sorular' } });
                          }}
                          style={[s.ilanDugmesi, s.ilanKaldir, mobil && s.ilanDugmesiMobil]}
                        >
                          <MessageCircle size={17} color={renk.murekkep} />
                          <Yazi style={s.ilanDugmesiYazisi}>Sorular</Yazi>
                        </HareketliBas>
                        <HareketliBas
                          accessibilityRole="button"
                          accessibilityLabel={`${ilan.baslik} ilanını düzenle`}
                          onPress={() => router.push({ pathname: '/ilan-duzenle', params: { id: ilan.id } })}
                          style={[s.ilanDugmesi, s.ilanDuzenle, mobil && s.ilanDugmesiMobil]}
                        >
                          <Pencil size={17} color={renk.vurguYazi} />
                          <Yazi style={[s.ilanDugmesiYazisi, { color: renk.vurguYazi }]}>Düzenle</Yazi>
                        </HareketliBas>
                        <HareketliBas
                          accessibilityLabel={
                            ilan.yayinDurumu === 'kaldirildi'
                              ? `${ilan.baslik} ilanını yeniden yayınla`
                              : `${ilan.baslik} ilanını yayından kaldır`
                          }
                          disabled={yayinMesgul}
                          onPress={() => {
                            if (ilan.yayinDurumu === 'kaldirildi') void yenidenYayinla(ilan.id);
                            else {
                              setSilinecek(ilan.id);
                              setKaldirmaNedeni('satildi');
                              setYayinHatasi('');
                            }
                          }}
                          style={[s.ilanDugmesi, s.ilanKaldir, mobil && s.ilanDugmesiMobil]}
                        >
                          {ilan.yayinDurumu === 'kaldirildi' ? (
                            <RotateCcw size={17} color={renk.murekkep} />
                          ) : (
                            <EyeOff size={17} color={renk.murekkep} />
                          )}
                          <Yazi style={s.ilanDugmesiYazisi}>
                            {ilan.yayinDurumu === 'kaldirildi' ? 'Yeniden yayınla' : 'Yayından kaldır'}
                          </Yazi>
                        </HareketliBas>
                      </View>
                    ) : (
                      <ChevronRight size={18} color={renk.gri} />
                    )}
                  </View>
                ))}
              </View>
            ) : sekme === 'favoriler' && kaydedilen.length > 0 ? (
              <IlanIzgarasi ilanlar={kaydedilen} sikisik={yanPanel} />
            ) : (
              <BosDurum
                simge={
                  sekme === 'favoriler' ? (
                    <Heart color={renk.murekkep} size={28} />
                  ) : (
                    <Package color={renk.murekkep} size={28} />
                  )
                }
                baslik={
                  sekme === 'favoriler'
                    ? 'Henüz favorin yok'
                    : yayinFiltresi === 'kaldirildi'
                      ? 'Yayından kaldırdığın ilan yok'
                      : 'Yayında ilanın yok'
                }
                aciklama={
                  sekme === 'favoriler'
                    ? 'Aklında kalan ilanları kalp düğmesiyle buraya kaydet.'
                    : yayinFiltresi === 'kaldirildi'
                      ? 'Yayından kaldırdığın ilanların burada saklanır. İstediğinde yeniden yayınlayabilirsin.'
                      : 'Fotoğraflarını ekle, fiyatını belirle. İlanını hazırlamaya başla.'
                }
                eylem={
                  <Buton onPress={() => router.push(sekme === 'favoriler' ? '/kesfet' : '/ilan-ver')}>
                    {sekme === 'favoriler' ? 'İlanları keşfet' : 'İlan ver'}
                  </Buton>
                }
              />
            )}
          </View>
        </View>
      </View>

      {duzenle ? <ProfilDuzenlemePenceresi kapat={() => setDuzenle(false)} /> : null}

      <Pencere
        acik={Boolean(silinecek)}
        kapat={() => {
          if (!yayinMesgul) setSilinecek('');
        }}
        baslik="İlanı yayından kaldır"
        altlik={
          <Buton disabled={yayinMesgul} onPress={kaldir}>
            {yayinMesgul ? 'Kaydediliyor…' : 'Yayından kaldır'}
          </Buton>
        }
      >
        <Yazi style={{ fontWeight: '600' }}>{silinecekIlan?.baslik || 'İlanın'}</Yazi>
        <Yazi style={{ color: renk.gri }}>
          İlanın listelerde görünmez. Fotoğrafları ve bilgileri hesabında saklanır; yeniden yayınlayabilirsin.
        </Yazi>
        <View accessibilityRole="radiogroup" style={{ gap: 9 }}>
          {ilanKaldirmaNedenleri.map((neden) => (
            <HareketliBas
              key={neden.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: kaldirmaNedeni === neden.id }}
              onPress={() => setKaldirmaNedeni(neden.id)}
              style={{
                padding: 15,
                minHeight: 70,
                borderWidth: 1,
                borderColor: kaldirmaNedeni === neden.id ? renk.murekkep : renk.cizgi,
                borderRadius: 10,
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 19,
                  height: 19,
                  borderRadius: 10,
                  borderWidth: kaldirmaNedeni === neden.id ? 5 : 1.5,
                  borderColor: kaldirmaNedeni === neden.id ? renk.murekkep : renk.gri,
                  flexShrink: 0,
                }}
              />
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Yazi style={{ fontSize: 14, fontWeight: '600' }}>{neden.ad}</Yazi>
                <Yazi style={{ fontSize: 12, color: renk.gri }}>{neden.aciklama}</Yazi>
              </View>
            </HareketliBas>
          ))}
        </View>
        {!!yayinHatasi && (
          <Yazi accessibilityRole="alert" style={{ fontSize: 13 }}>
            {yayinHatasi}
          </Yazi>
        )}
      </Pencere>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    profilKart: {
      gap: 16,
      minWidth: 0,
      flexShrink: 0,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 14,
      backgroundColor: renk.beyaz,
    },
    fotografDugmesi: { position: 'relative', flexShrink: 0 },
    kameraRozeti: {
      position: 'absolute',
      right: -2,
      bottom: -1,
      width: 25,
      height: 25,
      borderRadius: 13,
      backgroundColor: renk.sari,
      borderWidth: 3,
      borderColor: renk.beyaz,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ad: {
      fontFamily: kalin,
      fontWeight: '700',
      fontSize: 19,
      lineHeight: 26,
      letterSpacing: -0.4,
      minWidth: 0,
      flexShrink: 1,
    },
    konum: { fontSize: 13, lineHeight: 20, color: renk.gri, flex: 1, minWidth: 0 },
    duzenle: {
      minWidth: 44,
      minHeight: 44,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      backgroundColor: renk.beyaz,
    },
    kucukKalin: { fontSize: 13, fontWeight: '600', color: renk.murekkep },
    hakkinda: { color: renk.gri, fontSize: 13, lineHeight: 22, minWidth: 0, flexShrink: 1 },
    ozetSatiri: {
      flexDirection: 'row',
      gap: 18,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: renk.cizgi,
      paddingVertical: 14,
    },
    ozetSayisi: { fontSize: 21, lineHeight: 28, fontWeight: '700', fontFamily: kalin },
    ozet: { fontSize: 12, color: renk.gri, lineHeight: 20 },
    sekmeler: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: renk.cizgi, gap: 10 },
    sekme: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingHorizontal: 16,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    seciliSekme: { borderBottomColor: renk.murekkep },
    sayac: {
      minWidth: 20,
      paddingHorizontal: 5,
      borderRadius: 5,
      backgroundColor: renk.acik,
      fontSize: 11,
      lineHeight: 20,
      textAlign: 'center',
      color: renk.gri,
    },
    ilanListesi: {
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 12,
      paddingHorizontal: 14,
      backgroundColor: renk.beyaz,
    },
    ilanSatiri: { alignItems: 'stretch', gap: 14, paddingVertical: 18 },
    ilanAyirici: { borderTopWidth: 1, borderTopColor: renk.cizgi },
    ilanBaglantisi: { minWidth: 0, width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14 },
    ilanResmi: { width: 104, height: 84, borderRadius: 8, backgroundColor: renk.acik },
    ilanAdi: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    fiyat: { fontFamily: kalin, fontWeight: '700', fontSize: 18, letterSpacing: -0.3, lineHeight: 24 },
    ilanBilgisi: { fontSize: 11, lineHeight: 17, color: renk.gri },
    ilanEylemleri: { flexDirection: 'row', flexShrink: 0, alignSelf: 'flex-end', gap: 8 },
    ilanEylemleriMobil: { width: '100%' },
    ilanDugmesi: {
      minWidth: 44,
      minHeight: 44,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 7,
      borderRadius: 8,
      borderWidth: 1,
    },
    ilanDugmesiMobil: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'column',
      gap: 2,
      paddingHorizontal: 4,
      minHeight: 56,
    },
    ilanDuzenle: { backgroundColor: renk.sari, borderColor: renk.sari },
    ilanKaldir: { backgroundColor: renk.beyaz, borderColor: renk.murekkep },
    ilanDugmesiYazisi: { fontSize: 12, fontWeight: '600', color: renk.murekkep },
    ayarlar: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minWidth: 0,
      paddingHorizontal: 4,
    },
  }),
);
