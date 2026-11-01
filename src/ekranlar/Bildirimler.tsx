import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Bell from 'lucide-react-native/icons/bell';
import CheckCheck from 'lucide-react-native/icons/check-check';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Heart from 'lucide-react-native/icons/heart';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Package from 'lucide-react-native/icons/package';
import Tag from 'lucide-react-native/icons/tag';
import { Kabuk } from '../bilesenler/Kabuk';
import { HesapGerekli } from '../bilesenler/HesapGerekli';
import { HareketliBas } from '../bilesenler/Hareketli';
import { Baslik, BosDurum, Buton, Yazi } from '../bilesenler/Temel';
import { usePazar } from '../durum/Pazar';
import type { Bildirim } from '../veri/ilanEtkilesimleri';
import { ilanYolu } from '../veri/ilanlar';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';

export default function Bildirimler() {
  const { renk } = useTema();

  const { hazir, oturum, bildirimler, okunmamisBildirimSayisi, bildirimOku, tumIlanlar, haberVer } =
    usePazar();
  const { mobil, bosluk } = useEkran();
  const router = useRouter();
  const [okunmayanlar, setOkunmayanlar] = useState(false);
  const gorunenler = okunmayanlar ? bildirimler.filter((b) => !b.okundu) : bildirimler;

  function ac(bildirim: Bildirim) {
    bildirimOku(bildirim.id);
    const ilan = tumIlanlar.find((i) => i.id === bildirim.ilanId);
    if (!ilan) {
      haberVer('Bu ilan artık yayında değil.');
      router.push(bildirim.tur === 'kaldirma' ? '/profil' : '/kesfet');
      return;
    }
    const yol = ilanYolu(ilan);
    router.push({
      ...yol,
      params: {
        ...yol.params,
        ...(bildirim.tur === 'soru' || bildirim.tur === 'cevap' ? { bolum: 'sorular' } : {}),
      },
    });
  }

  if (!hazir)
    return (
      <Kabuk>
        <YuklemeIskeleti
          etiket="Bildirimlerin yükleniyor"
          style={[
            ortak.alan,
            {
              maxWidth: 1020,
              paddingHorizontal: bosluk,
              paddingTop: mobil ? 20 : 32,
              paddingBottom: 40,
              gap: 22,
            },
          ]}
        >
          <View style={{ gap: 8 }}>
            <IskeletParcasi genislik={180} yukseklik={36} />
            <IskeletParcasi genislik={160} yukseklik={18} />
          </View>
          <View style={{ borderWidth: 1, borderColor: renk.cizgi, borderRadius: 14, overflow: 'hidden' }}>
            {Array.from({ length: 4 }, (_, sira) => (
              <View
                key={sira}
                style={{
                  flexDirection: 'row',
                  gap: mobil ? 12 : 18,
                  padding: mobil ? 16 : 22,
                  borderTopWidth: sira ? 1 : 0,
                  borderColor: renk.cizgi,
                }}
              >
                <IskeletParcasi genislik={mobil ? 36 : 42} yukseklik={mobil ? 36 : 42} yaricap={12} />
                <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
                  <IskeletParcasi genislik="68%" yukseklik={18} />
                  <IskeletParcasi />
                  <IskeletParcasi genislik="40%" yukseklik={12} />
                </View>
              </View>
            ))}
          </View>
        </YuklemeIskeleti>
      </Kabuk>
    );
  if (!oturum)
    return (
      <HesapGerekli
        baslik="Bildirimlerin için giriş yap"
        aciklama="İlanlarına gelen soruları, cevapları ve güncellemeleri buradan takip et."
        donus="/bildirimler"
      />
    );

  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 1020,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 20 : 32,
            paddingBottom: 40,
            gap: 22,
          },
        ]}
      >
        <View style={[ortak.aralikli, { alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }]}>
          <View style={{ gap: 4, flex: 1, minWidth: 180 }}>
            <Baslik buyuk>Bildirimler</Baslik>
            <Yazi accessibilityLiveRegion="polite" style={{ color: renk.gri, fontSize: 13 }}>
              {okunmamisBildirimSayisi > 0
                ? `${okunmamisBildirimSayisi} okunmamış bildirim`
                : 'Tüm bildirimlerini okudun'}
            </Yazi>
          </View>
          {okunmamisBildirimSayisi > 0 && (
            <Buton
              ikincil
              simge={<CheckCheck size={16} color={renk.murekkep} />}
              style={{ minHeight: 44, paddingHorizontal: 14 }}
              onPress={() => bildirimOku()}
            >
              Tümünü okundu say
            </Buton>
          )}
        </View>
        {bildirimler.length > 0 && (
          <View
            style={{ flexDirection: 'row', gap: 8 }}
            accessibilityRole="tablist"
            accessibilityLabel="Bildirim filtresi"
          >
            {[
              { ad: 'Tümü', deger: false },
              { ad: 'Okunmamış', deger: true },
            ].map((secim) => (
              <HareketliBas
                key={secim.ad}
                accessibilityRole="tab"
                accessibilityState={{ selected: okunmayanlar === secim.deger }}
                onPress={() => setOkunmayanlar(secim.deger)}
                style={{
                  minHeight: 44,
                  paddingHorizontal: 18,
                  borderRadius: 22,
                  backgroundColor: okunmayanlar === secim.deger ? renk.sari : renk.zemin,
                  justifyContent: 'center',
                }}
              >
                <Yazi
                  style={{
                    fontWeight: '600',
                    color: okunmayanlar === secim.deger ? renk.vurguYazi : renk.murekkep,
                  }}
                >
                  {secim.ad}
                </Yazi>
              </HareketliBas>
            ))}
          </View>
        )}
        {gorunenler.length === 0 ? (
          <BosDurum
            simge={<Bell size={30} color={renk.gri} />}
            baslik={okunmayanlar ? 'Okunmamış bildirimin yok' : 'Henüz bildirimin yok'}
            aciklama={
              okunmayanlar
                ? 'Yeni bildirimlerin burada görünecek.'
                : 'İlan verdiğinde, soru geldiğinde veya satıcı sorunu cevapladığında burada görebilirsin.'
            }
            eylem={<Buton onPress={() => router.push('/kesfet')}>İlanlara göz at</Buton>}
          />
        ) : (
          <View style={{ borderWidth: 1, borderColor: renk.cizgi, borderRadius: 14, overflow: 'hidden' }}>
            {gorunenler.map((bildirim, sira) => {
              const Simge =
                bildirim.tur === 'soru' || bildirim.tur === 'cevap'
                  ? MessageCircle
                  : bildirim.tur === 'favori'
                    ? Heart
                    : bildirim.tur === 'fiyat'
                      ? Tag
                      : Package;
              return (
                <HareketliBas
                  key={bildirim.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${bildirim.okundu ? '' : 'Okunmamış. '}${bildirim.baslik}. ${bildirim.aciklama}`}
                  onPress={() => ac(bildirim)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: mobil ? 12 : 18,
                    padding: mobil ? 16 : 22,
                    borderTopWidth: sira ? 1 : 0,
                    borderColor: renk.cizgi,
                    backgroundColor: bildirim.okundu ? renk.beyaz : renk.acik,
                  }}
                >
                  <View
                    style={{
                      width: mobil ? 36 : 42,
                      height: mobil ? 36 : 42,
                      borderRadius: 12,
                      backgroundColor: bildirim.okundu ? renk.zemin : renk.sari,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Simge size={19} color={bildirim.okundu ? renk.murekkep : renk.vurguYazi} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                    <Yazi style={{ fontWeight: bildirim.okundu ? '600' : '700', fontSize: 14 }}>
                      {bildirim.baslik}
                    </Yazi>
                    <Yazi numberOfLines={2} style={{ color: renk.gri, fontSize: 13 }}>
                      {bildirim.aciklama}
                    </Yazi>
                    <Yazi style={{ color: renk.gri, fontSize: 11 }}>
                      {new Intl.DateTimeFormat('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(bildirim.tarih))}
                    </Yazi>
                  </View>
                  <View style={{ minHeight: 36, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {!bildirim.okundu && (
                      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: renk.sari }} />
                    )}
                    <ChevronRight size={16} color={renk.gri} />
                  </View>
                </HareketliBas>
              );
            })}
          </View>
        )}
      </View>
    </Kabuk>
  );
}
