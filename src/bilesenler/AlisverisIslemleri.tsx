import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Check from 'lucide-react-native/icons/check';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import { Buton, Pencere, Yazi } from './Temel';
import { HareketliBas } from './Hareketli';
import { DegerlendirmePenceresi } from './SaticiDegerlendirmeleri';
import { usePazar } from '../durum/Pazar';
import { useEkran, useTema } from '../tasarim/tema';
import type { Alisveris } from '../veri/saticiDegerlendirmeleri';

export function AlisverisIslemleri() {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const {
    alisverisler,
    degerlendirmeler,
    degerlendirmeHakkiKullanilanlar,
    oturum,
    alisverisiOnayla,
    alisverisiIptalEt,
    haberVer,
  } = usePazar();
  const [yon, setYon] = useState<'alici' | 'satici'>('alici');
  const [hepsi, setHepsi] = useState(false);
  const [secili, setSecili] = useState<Alisveris>();
  const [islem, setIslem] = useState<{ kayit: Alisveris; iptal: boolean }>();
  const [onay, setOnay] = useState(false);
  const [hata, setHata] = useState('');
  const [mesgul, setMesgul] = useState(false);
  if (!oturum) return null;
  const kayitlar = alisverisler
    .filter((kayit) => (yon === 'alici' ? kayit.aliciId : kayit.saticiId) === oturum.id)
    .sort((a, b) => b.tarih.localeCompare(a.tarih));
  async function islemiKaydet() {
    if (!islem || mesgul || (!islem.iptal && !onay)) return;
    setMesgul(true);
    setHata('');
    try {
      const sonuc = islem.iptal
        ? await alisverisiIptalEt(islem.kayit.id)
        : await alisverisiOnayla(islem.kayit.id);
      if (!sonuc.basarili) {
        setHata(sonuc.hata ?? 'İşlem kaydedilemedi.');
        return;
      }
      haberVer(islem.iptal ? 'Alışveriş iptal edildi.' : 'Teslimat onayın kaydedildi.');
      setIslem(undefined);
    } catch {
      setHata('İşlem kaydedilemedi. Tekrar deneyebilirsin.');
    } finally {
      setMesgul(false);
    }
  }
  function pencereAc(kayit: Alisveris, iptal: boolean) {
    setHata('');
    setOnay(false);
    setIslem({ kayit, iptal });
  }
  const aliciOnayi = islem?.kayit.aliciId === oturum.id;
  return (
    <View style={{ gap: 16, minWidth: 0 }} dataSet={{ 'alisveris-islemleri': 'true' }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 6,
          backgroundColor: renk.acik,
          padding: 4,
          borderRadius: 10,
          alignSelf: mobil ? 'stretch' : 'flex-start',
        }}
      >
        {(['alici', 'satici'] as const).map((deger) => (
          <HareketliBas
            key={deger}
            accessibilityState={{ selected: yon === deger }}
            onPress={() => {
              setYon(deger);
              setHepsi(false);
            }}
            style={{
              flex: mobil ? 1 : undefined,
              paddingHorizontal: 16,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 7,
              backgroundColor: yon === deger ? renk.beyaz : 'transparent',
            }}
          >
            <Yazi style={{ fontSize: 13, fontWeight: yon === deger ? '700' : '500' }}>
              {deger === 'alici' ? 'Aldıklarım' : 'Sattıklarım'}
            </Yazi>
          </HareketliBas>
        ))}
      </View>
      {kayitlar.length ? (
        <>
          <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
            Alıcı ve satıcı teslimatı onayladığında alışveriş tamamlanır; alıcı değerlendirme yapabilir.
          </Yazi>
          {(hepsi ? kayitlar : kayitlar.slice(0, 5)).map((kayit) => {
            const benAliciyim = kayit.aliciId === oturum.id;
            const benOnayladim = Boolean(benAliciyim ? kayit.aliciOnay : kayit.saticiOnay);
            const yorum = degerlendirmeler.find((kayitYorum) => kayitYorum.alisverisId === kayit.id);
            return (
              <View
                key={kayit.id}
                style={{
                  borderWidth: 1,
                  borderColor: renk.cizgi,
                  borderRadius: 10,
                  backgroundColor: renk.beyaz,
                  padding: mobil ? 14 : 18,
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <View style={{ gap: 4, minWidth: 0 }}>
                  <Yazi style={{ fontSize: 14, lineHeight: 21, fontWeight: '700' }}>{kayit.ilanBasligi}</Yazi>
                  <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
                    {benAliciyim ? 'Satıcı' : 'Alıcı'}: {benAliciyim ? kayit.saticiAd : kayit.aliciAd}
                  </Yazi>
                </View>
                <Yazi style={{ fontSize: 12, lineHeight: 19, fontWeight: '600' }}>
                  {kayit.durum === 'tamamlandi'
                    ? 'Alışveriş tamamlandı'
                    : kayit.durum === 'iptal'
                      ? 'İptal edildi'
                      : benOnayladim
                        ? `${benAliciyim ? 'Satıcının' : 'Alıcının'} teslimat onayı bekleniyor`
                        : 'Teslimat onayı bekleniyor'}
                </Yazi>
                {kayit.durum === 'onay-bekliyor' && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {!benOnayladim && (
                      <Buton
                        onPress={() => pencereAc(kayit, false)}
                        style={{ minHeight: 44, paddingHorizontal: 14 }}
                        simge={<Check size={16} />}
                      >
                        {benAliciyim ? 'Teslim aldım' : 'Teslim ettim'}
                      </Buton>
                    )}
                    <Buton
                      ikincil
                      onPress={() => pencereAc(kayit, true)}
                      style={{ minHeight: 44, paddingHorizontal: 14 }}
                    >
                      Alışverişi iptal et
                    </Buton>
                  </View>
                )}
                {kayit.durum === 'tamamlandi' &&
                  benAliciyim &&
                  (Boolean(yorum) || !degerlendirmeHakkiKullanilanlar.includes(kayit.id)) && (
                    <Buton
                      ikincil
                      onPress={() => setSecili(kayit)}
                      style={{ minHeight: 44, alignSelf: 'flex-start', paddingHorizontal: 14 }}
                    >
                      {yorum ? 'Değerlendirmem' : 'Satıcıyı değerlendir'}
                    </Buton>
                  )}
                {kayit.durum === 'tamamlandi' &&
                  benAliciyim &&
                  !yorum &&
                  degerlendirmeHakkiKullanilanlar.includes(kayit.id) && (
                    <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
                      Bu alışveriş için değerlendirmeni sildin.
                    </Yazi>
                  )}
                {kayit.durum === 'tamamlandi' && !benAliciyim && (
                  <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
                    {yorum
                      ? `Alıcı ${yorum.puan} / 5 puan verdi. Yanıtını satıcı profilinden paylaşabilirsin.`
                      : 'Alıcı bu alışverişi değerlendirebilir.'}
                  </Yazi>
                )}
              </View>
            );
          })}
          {kayitlar.length > 5 && (
            <Buton
              ikincil
              style={{ alignSelf: 'flex-start', minHeight: 44 }}
              onPress={() => setHepsi((deger) => !deger)}
            >
              {hepsi ? 'Daha az göster' : 'Tüm alışverişler'}
            </Buton>
          )}
        </>
      ) : (
        <View style={{ paddingVertical: 32, alignItems: 'center', gap: 10 }}>
          <ShoppingBag size={28} color={renk.murekkep} strokeWidth={1.6} />
          <Yazi style={{ fontSize: 15, fontWeight: '700', textAlign: 'center' }}>
            {yon === 'alici' ? 'Henüz alışverişin yok' : 'Henüz satışın yok'}
          </Yazi>
          <Yazi style={{ maxWidth: 360, fontSize: 13, lineHeight: 21, color: renk.gri, textAlign: 'center' }}>
            {yon === 'alici'
              ? 'Bir ilan için başlattığın alışverişleri buradan takip edebilirsin.'
              : 'Alıcıların başlattığı alışverişler burada görünür.'}
          </Yazi>
        </View>
      )}
      {!!secili && (
        <DegerlendirmePenceresi key={secili.id} alisveris={secili} kapat={() => setSecili(undefined)} />
      )}
      <Pencere
        acik={Boolean(islem)}
        kapat={() => {
          if (!mesgul) setIslem(undefined);
        }}
        baslik={
          islem?.iptal
            ? 'Alışverişi iptal et'
            : aliciOnayi
              ? 'Teslim aldığını onayla'
              : 'Teslim ettiğini onayla'
        }
        altlik={
          <View style={{ gap: 8 }}>
            {!!hata && (
              <Yazi accessibilityRole="alert" style={{ color: renk.hata, fontSize: 13 }}>
                {hata}
              </Yazi>
            )}
            <Buton disabled={mesgul || (!islem?.iptal && !onay)} onPress={islemiKaydet}>
              {mesgul ? 'Kaydediliyor…' : islem?.iptal ? 'Alışverişi iptal et' : 'Teslimatı onayla'}
            </Buton>
          </View>
        }
      >
        <Yazi style={{ fontSize: 14, fontWeight: '700' }}>{islem?.kayit.ilanBasligi}</Yazi>
        {islem?.iptal ? (
          <Yazi style={{ fontSize: 13, lineHeight: 21 }}>
            Bu alışveriş için teslimat onayı ve değerlendirme yapılamayacak. İptal işlemi geri alınamaz.
          </Yazi>
        ) : (
          <>
            <Yazi style={{ fontSize: 13, lineHeight: 21 }}>
              {aliciOnayi
                ? 'Ürün eline ulaştıysa ve kontrol ettiysen teslim aldığını onaylayabilirsin.'
                : `Ürünü ${islem?.kayit.aliciAd} adlı alıcıya teslim ettiysen bu işlemi onaylayabilirsin.`}{' '}
              İki taraf da onayladığında alışveriş tamamlanır.
            </Yazi>
            <HareketliBas
              accessibilityRole="checkbox"
              accessibilityState={{ checked: onay }}
              onPress={() => setOnay((deger) => !deger)}
              disabled={mesgul}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: renk.murekkep,
                  backgroundColor: onay ? renk.sari : renk.beyaz,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {onay && <Check size={16} color={renk.vurguYazi} />}
              </View>
              <Yazi style={{ flex: 1, fontSize: 13, lineHeight: 21, fontWeight: '600' }}>
                {aliciOnayi ? 'Ürünü teslim aldım.' : 'Ürünü alıcıya teslim ettim.'}
              </Yazi>
            </HareketliBas>
            <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
              Bu onay ödeme işlemi başlatmaz veya para aktarmaz.
            </Yazi>
          </>
        )}
      </Pencere>
    </View>
  );
}

export function AlisverisBaslat({ ilanId }: { ilanId: string }) {
  const { renk } = useTema();
  const { oturum, alisverisler, tumIlanlar, alisverisTalepEt, haberVer, hazir } = usePazar();
  const router = useRouter();
  const [mesgul, setMesgul] = useState(false);
  const [hata, setHata] = useState('');
  const ilan = tumIlanlar.find((kayit) => kayit.id === ilanId);
  if (!oturum || !ilan || ilan.saticiId === oturum.id || ilan.yayinDurumu === 'kaldirildi') return null;
  const mevcut = alisverisler.find(
    (kayit) => kayit.ilanId === ilanId && kayit.aliciId === oturum.id && kayit.durum !== 'iptal',
  );
  async function baslat() {
    if (mesgul || !hazir) return;
    if (mevcut) {
      router.push({ pathname: '/profil', params: { bolum: 'alisverisler' } });
      return;
    }
    setMesgul(true);
    setHata('');
    try {
      const sonuc = await alisverisTalepEt(ilanId);
      if (!sonuc.basarili) {
        setHata(sonuc.hata ?? 'Alışveriş başlatılamadı.');
        return;
      }
      haberVer('Alışverişin Alışverişlerim alanına eklendi.');
      router.push({ pathname: '/profil', params: { bolum: 'alisverisler' } });
    } catch {
      setHata('Alışveriş başlatılamadı. Tekrar deneyebilirsin.');
    } finally {
      setMesgul(false);
    }
  }
  return (
    <View style={{ minWidth: 0, gap: 6 }}>
      <Buton
        ikincil
        disabled={mesgul || !hazir}
        onPress={baslat}
        simge={<ShoppingBag size={16} />}
        style={{ minHeight: 44, paddingHorizontal: 12 }}
      >
        {mesgul ? 'Kaydediliyor…' : mevcut ? 'Alışverişlerime git' : 'Alışverişi başlat'}
      </Buton>
      {!!hata && (
        <Yazi accessibilityRole="alert" style={{ color: renk.hata, fontSize: 12 }}>
          {hata}
        </Yazi>
      )}
    </View>
  );
}
