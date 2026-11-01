import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Camera from 'lucide-react-native/icons/camera';
import Bell from 'lucide-react-native/icons/bell';
import Eye from 'lucide-react-native/icons/eye';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import MapPin from 'lucide-react-native/icons/map-pin';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Package from 'lucide-react-native/icons/package';
import Pencil from 'lucide-react-native/icons/pencil';
import Settings from 'lucide-react-native/icons/settings';
import UserRound from 'lucide-react-native/icons/user-round';
import Trash2 from 'lucide-react-native/icons/trash';
import { Gorsel } from '../bilesenler/Gorsel';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, BosDurum, Buton, Pencere, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { IlanIzgarasi } from '../bilesenler/IlanKarti';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';
import { usePazar } from '../durum/Pazar';
import { ProfilDuzenlemePenceresi, ProfilResmi } from '../bilesenler/ProfilFormu';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import { ilanYolu, para } from '../veri/ilanlar';

export default function Profil() {
  const { renk } = useTema();
  const s = useStiller();

  const {
    profil,
    tumIlanlar,
    favoriler,
    mesajlar,
    eklenenler,
    ilanSil,
    oturum,
    hazir,
    ilanIstatistikleri,
    sorular,
    okunmamisBildirimSayisi,
  } = usePazar();
  const { mobil, dar, bosluk } = useEkran();
  const yanPanel = !dar;
  const router = useRouter();
  const [duzenle, setDuzenle] = useState(false);
  const [sekme, setSekme] = useState<'ilanlar' | 'favoriler'>('ilanlar');
  const [silinecek, setSilinecek] = useState('');
  const benimkiler = tumIlanlar.filter((ilan) => ilan.benim);
  const kaydedilen = tumIlanlar.filter((ilan) => favoriler.includes(ilan.id));
  const konusmaSayisi = Object.values(mesajlar).filter((konusma) => konusma.length > 0).length;
  const silinecekIlan = eklenenler.find((ilan) => ilan.id === silinecek);

  const ac = () => setDuzenle(true);

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
                backgroundColor: renk.sariSoluk,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserRound color={renk.murekkep} size={27} strokeWidth={1.6} />
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
          <View
            style={[
              s.profilKart,
              { padding: mobil ? 18 : 22, width: yanPanel ? 290 : '100%', flexShrink: 0 },
            ]}
          >
            <View style={[ortak.aralikli, { alignItems: 'flex-start', gap: 12 }]}>
              <View
                style={[
                  ortak.satir,
                  { flex: 1, alignItems: 'center', minWidth: 0, gap: mobil || yanPanel ? 13 : 18 },
                ]}
              >
                <HareketliBas
                  accessibilityLabel="Profil fotoğrafını düzenle"
                  onPress={ac}
                  style={s.fotografDugmesi}
                >
                  <ProfilResmi
                    ad={profil.ad}
                    fotograf={profil.fotograf}
                    boyut={mobil || yanPanel ? 64 : 76}
                  />
                  <View style={s.kameraRozeti}>
                    <Camera size={12} color={renk.vurguYazi} />
                  </View>
                </HareketliBas>
                <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                  <Yazi style={s.ad}>{profil.ad}</Yazi>
                  <View style={[ortak.satir, { gap: 5, minWidth: 0 }]}>
                    <MapPin size={14} color={renk.gri} />
                    <Yazi style={s.konum}>{profil.konum || 'Konum belirtilmedi'}</Yazi>
                  </View>
                </View>
              </View>
              <HareketliBas onPress={ac} accessibilityLabel="Profili düzenle" style={s.duzenle}>
                <Pencil color={renk.vurguYazi} size={16} />
                {mobil || yanPanel ? null : <Yazi style={s.kucukKalin}>Profili düzenle</Yazi>}
              </HareketliBas>
            </View>
            {profil.hakkinda.trim() ? (
              <Yazi style={s.hakkinda}>{profil.hakkinda}</Yazi>
            ) : (
              <HareketliBas onPress={ac} style={{ minHeight: 44, justifyContent: 'center' }}>
                <Yazi style={{ fontSize: 13, color: renk.gri }}>Kendinden kısaca bahset</Yazi>
              </HareketliBas>
            )}
            <View style={s.ozetSatiri}>
              <View style={{ flex: 1, gap: 3 }}>
                <Yazi style={s.ozetSayisi}>{benimkiler.length}</Yazi>
                <Yazi style={s.ozet}>Yayındaki ilan</Yazi>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Yazi style={s.ozetSayisi}>{kaydedilen.length}</Yazi>
                <Yazi style={s.ozet}>Kayıtlı favori</Yazi>
              </View>
            </View>
            <View style={[s.hesapBaglantilari, { flexDirection: yanPanel ? 'column' : 'row' }]}>
              <Link href="/mesajlar" asChild>
                <HareketliBas
                  accessibilityLabel={`Mesajlarım, ${konusmaSayisi} konuşma`}
                  style={s.hesapBaglantisi}
                >
                  <MessageCircle size={15} color={renk.gri} />
                  <Yazi style={s.baglantiYazisi}>Mesajlarım</Yazi>
                  {konusmaSayisi > 0 && <Yazi style={s.sayac}>{konusmaSayisi}</Yazi>}
                </HareketliBas>
              </Link>
              <Link href="/bildirimler" asChild>
                <HareketliBas
                  accessibilityLabel={`Bildirimler, ${okunmamisBildirimSayisi} okunmamış`}
                  style={s.hesapBaglantisi}
                >
                  <Bell size={18} color={renk.murekkep} />
                  <Yazi style={s.baglantiYazisi}>Bildirimler</Yazi>
                  {okunmamisBildirimSayisi > 0 && <Yazi style={s.sayac}>{okunmamisBildirimSayisi}</Yazi>}
                </HareketliBas>
              </Link>
            </View>
            <Link href="/ayarlar" asChild>
              <HareketliBas accessibilityLabel="Hesap ayarları" style={s.ayarlar}>
                <Settings size={18} color={renk.murekkep} />
                <Yazi style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: '600' }}>Hesap ayarları</Yazi>
                <ChevronRight size={16} color={renk.gri} />
              </HareketliBas>
            </Link>
          </View>

          <View style={[{ gap: 18 }, yanPanel ? { flex: 1, minWidth: 0 } : { width: '100%' }]}>
            <View style={s.sekmeler} accessibilityLabel="Hesap içeriği">
              {[
                { id: 'ilanlar' as const, ad: 'İlanlarım', sayi: benimkiler.length, simge: Package },
                { id: 'favoriler' as const, ad: 'Favorilerim', sayi: kaydedilen.length, simge: Heart },
              ].map(({ id, ad, sayi, simge: Simge }) => (
                <HareketliBas
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={`${ad}, ${sayi} ilan`}
                  accessibilityState={{ selected: sekme === id }}
                  onPress={() => setSekme(id)}
                  style={[
                    s.sekme,
                    mobil && { flex: 1, paddingHorizontal: 7 },
                    sekme === id ? s.seciliSekme : null,
                  ]}
                >
                  <Simge size={16} color={sekme === id ? renk.murekkep : renk.gri} />
                  <Yazi style={{ fontSize: 13, fontWeight: sekme === id ? '700' : '500' }}>{ad}</Yazi>
                  <Yazi style={s.sayac}>{sayi}</Yazi>
                </HareketliBas>
              ))}
            </View>
            {sekme === 'ilanlar' && benimkiler.length > 0 ? (
              <View style={s.ilanListesi}>
                {benimkiler.map((ilan, sira) => (
                  <View key={ilan.id} style={[s.ilanSatiri, sira > 0 && s.ilanAyirici]}>
                    <Link href={ilanYolu(ilan)} asChild>
                      <HareketliBas
                        accessibilityLabel={`${ilan.baslik}, ${para(ilan.fiyat)}, ilanı aç`}
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
                          <Yazi style={s.fiyat}>{para(ilan.fiyat)}</Yazi>
                          <Yazi numberOfLines={1} style={s.ilanBilgisi}>
                            {ilan.durum} · {ilan.zaman}
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
                          accessibilityLabel={`${ilan.baslik} ilanını kaldır`}
                          onPress={() => setSilinecek(ilan.id)}
                          style={[s.ilanDugmesi, s.ilanKaldir, mobil && s.ilanDugmesiMobil]}
                        >
                          <Trash2 size={17} color={renk.murekkep} />
                          <Yazi style={s.ilanDugmesiYazisi}>Kaldır</Yazi>
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
                baslik={sekme === 'favoriler' ? 'Henüz favorin yok' : 'Henüz bir ilanın yok'}
                aciklama={
                  sekme === 'favoriler'
                    ? 'Aklında kalan ilanları kalp düğmesiyle buraya kaydet.'
                    : 'Fotoğraflarını ekle, fiyatını belirle. İlk ilanını hazırlamaya başla.'
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

      <Pencere acik={Boolean(silinecek)} kapat={() => setSilinecek('')} baslik="İlanı kaldır">
        <Yazi style={{ fontWeight: '600' }}>{silinecekIlan?.baslik || 'İlanın'}</Yazi>
        <Yazi style={{ color: renk.gri }}>Bu ilanı kaldırmak istediğine emin misin?</Yazi>
        <View style={ortak.satir}>
          <Buton ikincil onPress={() => setSilinecek('')} style={{ flex: 1, paddingHorizontal: 12 }}>
            Vazgeç
          </Buton>
          <Buton
            koyu
            onPress={() => {
              ilanSil(silinecek);
              setSilinecek('');
            }}
            style={{ flex: 1, paddingHorizontal: 12 }}
          >
            İlanı kaldır
          </Buton>
        </View>
      </Pencere>
    </Kabuk>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    profilKart: {
      gap: 16,
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
    ad: { fontFamily: kalin, fontWeight: '700', fontSize: 19, lineHeight: 26, letterSpacing: -0.4 },
    konum: { fontSize: 13, lineHeight: 20, color: renk.gri, flexShrink: 1 },
    duzenle: {
      minWidth: 44,
      minHeight: 44,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: renk.sari,
      borderRadius: 8,
      backgroundColor: renk.sari,
    },
    kucukKalin: { fontSize: 13, fontWeight: '600', color: renk.vurguYazi },
    hakkinda: { color: renk.gri, fontSize: 14, lineHeight: 22, maxWidth: 720 },
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
    hesapBaglantilari: { gap: 12 },
    hesapBaglantisi: {
      minHeight: 44,
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    baglantiYazisi: { flex: 1, minWidth: 0, fontSize: 13, fontWeight: '600', color: renk.murekkep },
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
      borderTopWidth: 1,
      borderTopColor: renk.cizgi,
      paddingTop: 4,
    },
  }),
);
