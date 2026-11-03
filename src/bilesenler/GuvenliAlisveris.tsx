import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import { Buton, Pencere, Yazi } from './Temel';
import { TutarSatiri } from './AlisverisOzeti';
import { Gorsel } from './Gorsel';
import { useTema } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import { alisverisOzeti, alisverisParasi, guvenliAlisverisAyariniTemizle } from '../veri/guvenliAlisveris';
import type { Ilan } from '../veri/ilanlar';
import { kisiler, usePazar } from '../durum/Pazar';

export function GuvenliAlisveris({ ilan, kompakt = false }: { ilan: Ilan; kompakt?: boolean }) {
  const { renk } = useTema();
  const { oturum, hazir, eklenenler, mesajGonder, haberVer, alisverisTalepEt } = usePazar();
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const [hata, setHata] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const talepGonderildi = useRef(false);
  const ayar = guvenliAlisverisAyariniTemizle(ilan);
  const ozet = ayar ? alisverisOzeti(ilan.fiyat, ayar.kargoBoyutu) : undefined;
  const banaAit = Boolean(
    oturum && (ilan.saticiId === oturum.id || eklenenler.some((kayit) => kayit.id === ilan.id)),
  );
  useEffect(() => {
    setAcik(false);
  }, [ilan.id, oturum?.id]);
  if (!ozet || banaAit || ilan.yayinDurumu === 'kaldirildi') return null;
  function ac() {
    if (!hazir) return;
    if (!oturum) {
      const donus = ilan.id.startsWith('yerel-')
        ? `/ilan/yerel?kayit=${encodeURIComponent(ilan.id)}`
        : `/ilan/${encodeURIComponent(ilan.id)}`;
      router.push({ pathname: '/giris', params: { donus } });
      return;
    }
    talepGonderildi.current = false;
    setHata('');
    setAcik(true);
  }
  async function talepGonder() {
    if (!oturum || !ozet || talepGonderildi.current) return;
    talepGonderildi.current = true;
    setGonderiliyor(true);
    const sonuc = await alisverisTalepEt(ilan.id);
    setGonderiliyor(false);
    if (!sonuc.basarili) {
      talepGonderildi.current = false;
      setHata(sonuc.hata ?? 'Talebin kaydedilemedi. Yeniden dene.');
      return;
    }
    const kisi = kisiler.find((kayit) => kayit.ilanId === ilan.id)?.id ?? `ilan-${ilan.id}`;
    mesajGonder(
      kisi,
      `Merhaba, ${ilan.baslik} ilanını Param Güvende ile satın almak istiyorum. Toplam tutar: ${alisverisParasi(ozet.toplam)}. İlan hâlâ satılık mı?`,
    );
    setAcik(false);
    haberVer('Satın alma talebin görüşmeye eklendi.');
    router.push({ pathname: '/mesajlar', params: { kisi, ilan: ilan.id } });
  }
  return (
    <View style={{ gap: 6, minWidth: 0 }}>
      <Buton
        ikincil
        disabled={!hazir}
        onPress={ac}
        simge={<ShieldCheck size={18} />}
        style={{
          minHeight: 46,
          paddingHorizontal: 8,
          gap: 7,
          borderColor: renk.murekkep,
          borderRadius: 8,
        }}
        yaziStili={{ fontSize: 13, lineHeight: 20, flexShrink: 1 }}
      >
        {kompakt ? 'Satın al' : 'Param Güvende ile satın al'}
      </Buton>
      <Pencere
        acik={acik}
        kapat={() => setAcik(false)}
        baslik="Satın alma özeti"
        altlik={
          <View style={{ gap: 10 }}>
            <TutarSatiri ad="Toplam" tutar={ozet.toplam} vurgulu />
            {!!hata && (
              <Yazi accessibilityRole="alert" style={{ fontSize: 13 }}>
                {hata}
              </Yazi>
            )}
            <Buton
              disabled={gonderiliyor}
              onPress={() => void talepGonder()}
              simge={<ShieldCheck size={18} />}
            >
              {gonderiliyor ? 'Kaydediliyor…' : 'Satın alma talebi gönder'}
            </Buton>
          </View>
        }
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <Gorsel
            source={gorselKaynagi(ilan.gorsel)}
            accessibilityLabel={ilan.baslik}
            style={{ width: 72, height: 72, borderRadius: 8 }}
            contentFit="contain"
          />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Yazi style={{ fontSize: 14, fontWeight: '700' }}>{ilan.baslik}</Yazi>
            <Yazi style={{ fontSize: 12, color: renk.gri }}>Satıcı: {ilan.satici}</Yazi>
          </View>
        </View>
        <Yazi style={{ fontSize: 13, lineHeight: 21, color: renk.gri }}>
          Toplam tutara kargo ve hizmet bedeli dahildir.
        </Yazi>
        <Yazi style={{ fontSize: 13, lineHeight: 21 }}>
          Bu aşamada ödeme alınmaz. Görüşmeye bir satın alma talebi eklenir; teslimat ayrıntılarını satıcıyla
          netleştirebilirsin.
        </Yazi>
        <Yazi style={{ fontSize: 12, lineHeight: 20, color: renk.gri }}>
          Kart veya banka bilgisi istenmez. Mesajla gönderilen ödeme bağlantılarını açma; şifrelerini ve kart
          bilgilerini paylaşma.
        </Yazi>
      </Pencere>
    </View>
  );
}
