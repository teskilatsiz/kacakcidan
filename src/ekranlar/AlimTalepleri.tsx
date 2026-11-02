import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Plus from 'lucide-react-native/icons/plus';
import Search from 'lucide-react-native/icons/search';
import Check from 'lucide-react-native/icons/check';
import { Kabuk } from '../bilesenler/Kabuk';
import { Alan, Baslik, BosDurum, Buton, Pencere, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { SecimAlani } from '../bilesenler/SecimAlani';
import { AlimTalebiFormu } from '../bilesenler/AlimTalebiFormu';
import { Gorsel } from '../bilesenler/Gorsel';
import { IskeletParcasi, YuklemeIskeleti } from '../bilesenler/YuklemeIskeleti';
import { usePazar } from '../durum/Pazar';
import { useAlimTalepleri } from '../durum/useAlimTalepleri';
import { alimKategorileri, talebeUygunIlanMi, type AlimTalebi } from '../veri/alimTalepleri';
import { kategoriYapisi } from '../veri/kategoriler';
import { ilanYolu, para } from '../veri/ilanlar';
import { kalin, ortak, useEkran, useTema } from '../tasarim/tema';

function talepYolu(talep: AlimTalebi) {
  const yapi = kategoriYapisi(talep.kategori, talep.altKategori);
  return [
    alimKategorileri.find((kategori) => kategori.id === talep.kategori)?.ad,
    yapi.altKategoriler.find((alt) => alt.id === talep.altKategori)?.ad,
    yapi.markalar.find((marka) => marka.id === talep.marka)?.ad,
    yapi.modeller[talep.marka]?.find((model) => model.id === talep.model)?.ad,
  ]
    .filter(Boolean)
    .join(' / ');
}

export default function AlimTalepleri() {
  const { renk } = useTema();
  const { mobil, bosluk } = useEkran();
  const router = useRouter();
  const parametre = useLocalSearchParams<{ id?: string; yeni?: string }>();
  const { oturum, profil, tumIlanlar, haberVer, hazir: hesapHazir } = usePazar();
  const { talepler, hazir, hata, olustur, kapat, yanitla } = useAlimTalepleri();
  const [kategori, setKategori] = useState('');
  const [kapsam, setKapsam] = useState<'acik' | 'benim'>('acik');
  const [formAcik, setFormAcik] = useState(false);
  const [seciliId, setSeciliId] = useState<string | undefined>();
  const [ilanId, setIlanId] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [yanitHatasi, setYanitHatasi] = useState('');
  const [calisiyor, setCalisiyor] = useState(false);
  const [kapatmaOnayi, setKapatmaOnayi] = useState(false);
  const secili = talepler.find((talep) => talep.id === seciliId);
  const benim = secili?.hesapId === oturum?.id;
  const gorunenler = talepler.filter(
    (talep) =>
      (!kategori || talep.kategori === kategori) &&
      (kapsam === 'benim' ? talep.hesapId === oturum?.id : talep.durum === 'acik'),
  );
  const uygunIlanlar = useMemo(
    () =>
      secili
        ? tumIlanlar.filter((ilan) => ilan.saticiId !== secili.hesapId && talebeUygunIlanMi(secili, ilan))
        : [],
    [secili, tumIlanlar],
  );
  const kendiIlanlarim = uygunIlanlar.filter(
    (ilan) =>
      ilan.saticiId === oturum?.id &&
      !secili?.yanitlar.some((yanit) => yanit.hesapId === oturum?.id && yanit.ilanId === ilan.id),
  );
  useEffect(() => {
    if (typeof parametre.id === 'string') setSeciliId(parametre.id);
  }, [parametre.id]);
  useEffect(() => {
    if (parametre.yeni === '1' && oturum) setFormAcik(true);
  }, [parametre.yeni, oturum?.id]);
  useEffect(() => {
    setIlanId('');
    setMesaj('');
    setYanitHatasi('');
    setKapatmaOnayi(false);
    if (!oturum) {
      setKapsam('acik');
      setFormAcik(false);
    }
  }, [seciliId, oturum?.id]);
  function olusturAc() {
    if (!oturum) {
      router.push({ pathname: '/giris', params: { donus: '/alim-talepleri?yeni=1' } });
      return;
    }
    setFormAcik(true);
  }
  async function yanitKaydet() {
    if (!secili || calisiyor) return;
    if (!ilanId) {
      setYanitHatasi('Talebe uygun kendi ilanlarından birini seç.');
      return;
    }
    setCalisiyor(true);
    setYanitHatasi('');
    try {
      await yanitla(secili.id, ilanId, mesaj);
      setMesaj('');
      setIlanId('');
      haberVer('Yanıtın bu cihaza kaydedildi.');
    } catch (sorun) {
      setYanitHatasi(sorun instanceof Error ? sorun.message : 'Yanıt kaydedilemedi.');
    } finally {
      setCalisiyor(false);
    }
  }
  async function talebiKapat() {
    if (!secili || calisiyor) return;
    setCalisiyor(true);
    setYanitHatasi('');
    try {
      await kapat(secili.id);
      setKapatmaOnayi(false);
      haberVer('Alım talebin kapatıldı.');
    } catch (sorun) {
      setYanitHatasi(sorun instanceof Error ? sorun.message : 'Talep kapatılamadı.');
    } finally {
      setCalisiyor(false);
    }
  }
  return (
    <Kabuk>
      <View
        style={[
          ortak.alan,
          {
            maxWidth: 1120,
            paddingHorizontal: bosluk,
            paddingTop: mobil ? 22 : 36,
            paddingBottom: 48,
            gap: 24,
          },
        ]}
      >
        <View style={{ gap: 18 }}>
          <View
            style={{
              flexDirection: mobil ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: mobil ? 'stretch' : 'center',
              gap: 18,
            }}
          >
            <View style={{ gap: 8, flex: mobil ? undefined : 1, minWidth: 0 }}>
              <Baslik buyuk>Alım talepleri</Baslik>
              <Yazi style={{ color: renk.gri }}>
                Aradığın ürünü ve bütçeni belirt, uygun ilanları bir arada gör.
              </Yazi>
            </View>
            <Buton simge={<Plus size={18} />} onPress={olusturAc}>
              Alım talebi oluştur
            </Buton>
          </View>
          <Yazi style={{ color: renk.gri, fontSize: 12 }}>
            Talepler ve yanıtlar bu cihazda saklanır. Aynı cihazda kullanılan hesaplar arasında
            görüntülenebilir; başka cihazlara gönderilmez.
          </Yazi>
        </View>
        <View
          style={{
            flexDirection: mobil ? 'column' : 'row',
            gap: 18,
            alignItems: mobil ? 'stretch' : 'flex-end',
          }}
        >
          <View style={{ flex: 1 }}>
            <SecimAlani
              etiket="Kategori"
              deger={kategori}
              secenekler={alimKategorileri}
              degistir={setKategori}
              ipucu="Tüm kategoriler"
            />
          </View>
          <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 6 }}>
            {(['acik', 'benim'] as const).map((secim) => (
              <HareketliBas
                key={secim}
                accessibilityRole="tab"
                accessibilityState={{ selected: kapsam === secim }}
                onPress={() => {
                  if (secim === 'benim' && !oturum) {
                    router.push({ pathname: '/giris', params: { donus: '/alim-talepleri' } });
                    return;
                  }
                  setKapsam(secim);
                }}
                style={{
                  paddingHorizontal: 16,
                  minHeight: 48,
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: kapsam === secim ? renk.acik : renk.beyaz,
                }}
              >
                <Yazi style={{ fontWeight: kapsam === secim ? '700' : '400' }}>
                  {secim === 'acik' ? 'Açık talepler' : 'Taleplerim'}
                </Yazi>
              </HareketliBas>
            ))}
          </View>
        </View>
        {!hazir || !hesapHazir ? (
          <YuklemeIskeleti etiket="Alım talepleri yükleniyor" style={{ gap: 14 }}>
            {[0, 1, 2].map((sira) => (
              <IskeletParcasi key={sira} yukseklik={140} yaricap={14} />
            ))}
          </YuklemeIskeleti>
        ) : hata ? (
          <Yazi accessibilityRole="alert" style={{ color: renk.hata }}>
            {hata}
          </Yazi>
        ) : gorunenler.length ? (
          <View style={{ gap: 12 }}>
            {gorunenler.map((talep) => (
              <HareketliBas
                key={talep.id}
                onPress={() => setSeciliId(talep.id)}
                accessibilityLabel={`${talep.baslik}, bütçe ${para(talep.butce)}, ayrıntıları aç`}
                style={{
                  borderWidth: 1,
                  borderColor: renk.cizgi,
                  backgroundColor: renk.beyaz,
                  borderRadius: 14,
                  padding: mobil ? 18 : 22,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <Yazi
                    style={{
                      fontFamily: kalin,
                      fontWeight: '700',
                      fontSize: 18,
                      lineHeight: 26,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {talep.baslik}
                  </Yazi>
                  <ArrowUpRight color={renk.murekkep} size={19} />
                </View>
                <Yazi style={{ color: renk.gri, fontSize: 12 }}>{talepYolu(talep)}</Yazi>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                  <Yazi style={{ fontWeight: '700' }}>En fazla {para(talep.butce)}</Yazi>
                  <Yazi style={{ color: renk.gri }}>{talep.konum || 'Türkiye'}</Yazi>
                  <Yazi style={{ color: renk.gri, fontSize: 12 }}>
                    {talep.durum === 'kapali' ? 'Kapalı' : `${talep.yanitlar.length} yanıt`}
                  </Yazi>
                </View>
              </HareketliBas>
            ))}
          </View>
        ) : (
          <BosDurum
            simge={<Search color={renk.murekkep} size={28} />}
            baslik={
              kapsam === 'benim'
                ? 'Henüz alım talebin yok'
                : kategori
                  ? 'Bu kategoride alım talebi yok'
                  : 'Henüz alım talebi yok'
            }
            aciklama="Aradığın ürünü ve bütçeni belirterek bir talep oluşturabilirsin."
            eylem={<Buton onPress={olusturAc}>Alım talebi oluştur</Buton>}
          />
        )}
        {hazir &&
          typeof parametre.id === 'string' &&
          !talepler.some((talep) => talep.id === parametre.id) && (
            <Yazi style={{ color: renk.gri }}>Bu alım talebi bu cihazda bulunamadı.</Yazi>
          )}
      </View>
      {formAcik && oturum && (
        <AlimTalebiFormu
          key={oturum.id}
          acik
          kapat={() => setFormAcik(false)}
          olustur={olustur}
          konum={profil.konum}
          kaydedildi={(id) => {
            setFormAcik(false);
            setKapsam('benim');
            setSeciliId(id);
            haberVer('Alım talebin bu cihaza kaydedildi.');
          }}
        />
      )}
      <Pencere
        acik={!!secili}
        kapat={() => {
          if (!calisiyor) setSeciliId(undefined);
        }}
        baslik="Alım talebi"
        genis
      >
        {secili && (
          <>
            <View style={{ gap: 10 }}>
              <Baslik>{secili.baslik}</Baslik>
              <Yazi style={{ color: renk.gri }}>{talepYolu(secili)}</Yazi>
              <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 23, lineHeight: 30 }}>
                En fazla {para(secili.butce)}
              </Yazi>
              <Yazi style={{ color: renk.gri }}>
                {secili.ad} · {secili.konum || 'Türkiye'} ·{' '}
                {new Date(secili.tarih).toLocaleDateString('tr-TR')}
              </Yazi>
              <Yazi>{secili.aciklama}</Yazi>
            </View>
            {secili.durum === 'kapali' ? (
              <Yazi style={{ fontWeight: '700' }}>Bu talep kapatıldı.</Yazi>
            ) : benim ? (
              <View style={{ gap: 12 }}>
                <Yazi style={{ fontWeight: '700' }}>
                  {uygunIlanlar.length
                    ? 'Ürün türüne ve bütçene uyan ilanlar'
                    : 'Şu an koşullarına uyan ilan yok.'}
                </Yazi>
                {uygunIlanlar.slice(0, 6).map((ilan) => (
                  <HareketliBas
                    key={ilan.id}
                    onPress={() => {
                      setSeciliId(undefined);
                      router.push(ilanYolu(ilan));
                    }}
                    style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 8 }}
                  >
                    <Gorsel
                      source={{ uri: ilan.gorsel }}
                      accessibilityLabel={ilan.baslik}
                      style={{ width: 64, height: 64, borderRadius: 8 }}
                      contentFit="cover"
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Yazi numberOfLines={2}>{ilan.baslik}</Yazi>
                      <Yazi style={{ fontWeight: '700' }}>{para(ilan.fiyat)}</Yazi>
                    </View>
                    <ArrowUpRight color={renk.murekkep} size={18} />
                  </HareketliBas>
                ))}
                {kapatmaOnayi ? (
                  <View style={{ gap: 10 }}>
                    <Yazi>Bu talebi kapatmak istiyor musun? Yeni yanıt alınmayacak.</Yazi>
                    <Buton
                      disabled={calisiyor}
                      onPress={() => void talebiKapat()}
                      simge={<Check size={18} />}
                    >
                      {calisiyor ? 'Kapatılıyor…' : 'Talebi kapat'}
                    </Buton>
                    <Buton ikincil disabled={calisiyor} onPress={() => setKapatmaOnayi(false)}>
                      Vazgeç
                    </Buton>
                  </View>
                ) : (
                  <Buton ikincil onPress={() => setKapatmaOnayi(true)}>
                    Talebi kapat
                  </Buton>
                )}
              </View>
            ) : !oturum ? (
              <Buton
                onPress={() => {
                  setSeciliId(undefined);
                  router.push({
                    pathname: '/giris',
                    params: { donus: `/alim-talepleri?id=${encodeURIComponent(secili.id)}` },
                  });
                }}
              >
                Yanıt vermek için giriş yap
              </Buton>
            ) : (
              <View style={{ gap: 14 }}>
                <Yazi style={{ fontWeight: '700' }}>Kendi ilanınla yanıt ver</Yazi>
                {kendiIlanlarim.length ? (
                  <>
                    <SecimAlani
                      etiket="Ürün türü ve bütçeye uygun ilanların"
                      gerekli
                      deger={ilanId}
                      secenekler={kendiIlanlarim.map((ilan) => ({
                        id: ilan.id,
                        ad: `${ilan.baslik} · ${para(ilan.fiyat)}`,
                      }))}
                      degistir={(id) => {
                        setIlanId(id);
                        setYanitHatasi('');
                      }}
                      ipucu="İlan seç"
                    />
                    <Alan
                      nativeID="alim-talebi-yanit"
                      etiket="Yanıtın"
                      value={mesaj}
                      onChangeText={setMesaj}
                      maxLength={600}
                      multiline
                      placeholder="Ürünün durumunu ve teslim ayrıntılarını anlat."
                    />
                    <Buton disabled={calisiyor} onPress={() => void yanitKaydet()}>
                      {calisiyor ? 'Kaydediliyor…' : 'Yanıtı kaydet'}
                    </Buton>
                  </>
                ) : (
                  <>
                    <Yazi style={{ color: renk.gri }}>
                      Bu talebin ürün türü, model ve bütçe koşullarına uyan, henüz yanıt vermediğin bir ilanın
                      yok.
                    </Yazi>
                    <Buton
                      ikincil
                      onPress={() => {
                        setSeciliId(undefined);
                        router.push('/ilan-ver');
                      }}
                    >
                      İlan oluştur
                    </Buton>
                  </>
                )}
              </View>
            )}
            {!!yanitHatasi && (
              <Yazi accessibilityRole="alert" style={{ color: renk.hata }}>
                {yanitHatasi}
              </Yazi>
            )}
            {secili.yanitlar
              .filter((yanit) => benim || yanit.hesapId === oturum?.id)
              .map((yanit) => {
                const ilan = tumIlanlar.find((ilan) => ilan.id === yanit.ilanId);
                return (
                  <View
                    key={yanit.id}
                    style={{ gap: 10, paddingTop: 18, borderTopWidth: 1, borderColor: renk.cizgi }}
                  >
                    <Yazi style={{ fontWeight: '700' }}>{yanit.ad}</Yazi>
                    <Yazi>{yanit.mesaj}</Yazi>
                    {ilan ? (
                      <Buton
                        ikincil
                        simge={<ArrowUpRight size={17} />}
                        onPress={() => {
                          setSeciliId(undefined);
                          router.push(ilanYolu(ilan));
                        }}
                      >
                        İlanı gör
                      </Buton>
                    ) : (
                      <Yazi style={{ color: renk.gri }}>Yanıttaki ilan artık yayında değil.</Yazi>
                    )}
                  </View>
                );
              })}
          </>
        )}
      </Pencere>
    </Kabuk>
  );
}
