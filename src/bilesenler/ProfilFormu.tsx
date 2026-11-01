import { useEffect, useId, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import Camera from 'lucide-react-native/icons/camera';
import Check from 'lucide-react-native/icons/check';
import Trash2 from 'lucide-react-native/icons/trash';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { TelefonBilgisiAlanlari } from './TelefonBilgisiAlanlari';
import { telefonHatasi, telefonuGoster, telefonuNormallestir } from '../veri/telefon';
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { Alan, Buton, Pencere, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';
import { usePazar } from '../durum/Pazar';
import { medyaKaydet, medyaOnizlemesiniBirak, medyaSil } from '../durum/medyaDeposu';
import { medyaSec } from '../durum/medyaSecici';
import { kalin, ortak, useEkran, useTema, temaStilleri } from '../tasarim/tema';
import { ilceSecenekleri, iller, konumuAyir, konumuBirlestir } from '../veri/konumlar';

export function ProfilResmi({ ad, fotograf, boyut = 72 }: { ad: string; fotograf?: string; boyut?: number }) {
  const { renk } = useTema();
  const s = useStiller();

  return (
    <View style={[s.avatar, { width: boyut, height: boyut, borderRadius: boyut / 2 }]}>
      {fotograf ? (
        <Gorsel
          source={{ uri: fotograf }}
          contentFit="cover"
          style={StyleSheet.absoluteFill}
          accessibilityLabel={`${ad} profil fotoğrafı`}
        />
      ) : (
        <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: boyut / 3, color: renk.sari }}>
          {ad
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((kelime) => kelime[0])
            .join('')
            .toLocaleUpperCase('tr') || 'K'}
        </Yazi>
      )}
    </View>
  );
}

type ProfilAlani = 'fotograf' | 'ad' | 'konum' | 'hakkinda' | 'telefon';
const alanBasliklari: Record<ProfilAlani, string> = {
  fotograf: 'Profil fotoğrafı',
  ad: 'Ad soyad',
  konum: 'İl ve ilçe',
  hakkinda: 'Hakkında',
  telefon: 'Telefon ve görünürlük',
};

export function ProfilFormu({
  kompakt = false,
  iletisim = false,
  tamamlaninca,
  mesgulDegisti,
}: {
  kompakt?: boolean;
  iletisim?: boolean;
  tamamlaninca?: () => void;
  mesgulDegisti?: (mesgul: boolean) => void;
}) {
  const { renk } = useTema();
  const s = useStiller();

  const { profil, profilKaydet, haberVer, oturum } = usePazar();
  const { mobil } = useEkran();
  const [formGenisligi, setFormGenisligi] = useState(0);
  const darForm = mobil || kompakt || (formGenisligi > 0 && formGenisligi < 580);
  const kimlik = useId();
  const [taslak, setTaslak] = useState(profil);
  const [alan, setAlan] = useState<ProfilAlani | null>(null);
  const [hata, setHata] = useState('');
  const [hatalar, setHatalar] = useState<{ ad?: string }>({});
  const [fotografSeciliyor, setFotografSeciliyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const secilenFotograf = useRef<ImagePickerAsset | undefined>(undefined);
  const ekranda = useRef(true);
  const islemSuruyor = useRef(false);
  const hesapId = useRef(oturum?.id);
  const etkinHesap = useRef(oturum?.id);
  etkinHesap.current = oturum?.id;
  const adAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const hakkindaAlani = useRef<ComponentRef<typeof TextInput>>(null);
  const seciliKonum = konumuAyir(taslak.konum);
  const mesgul = fotografSeciliyor || kaydediliyor;
  const degisti =
    alan === 'telefon'
      ? (taslak.telefon ?? '') !== (profil.telefon ?? '') ||
        Boolean(taslak.telefonGoster) !== Boolean(profil.telefonGoster)
      : alan
        ? taslak[alan] !== profil[alan]
        : false;

  useEffect(() => {
    ekranda.current = true;
    return () => {
      ekranda.current = false;
      if (secilenFotograf.current) medyaOnizlemesiniBirak(secilenFotograf.current.uri);
    };
  }, []);
  useEffect(() => mesgulDegisti?.(mesgul), [mesgul, mesgulDegisti]);

  const onizlemeyiTemizle = () => {
    if (secilenFotograf.current) medyaOnizlemesiniBirak(secilenFotograf.current.uri);
    secilenFotograf.current = undefined;
  };
  const fotografSec = async () => {
    if (islemSuruyor.current) return;
    islemSuruyor.current = true;
    setFotografSeciliyor(true);
    setHata('');
    try {
      const fotograflar = await medyaSec('fotograf', []);
      const fotograf = fotograflar[0];
      fotograflar.slice(1).forEach((dosya) => medyaOnizlemesiniBirak(dosya.uri));
      if (!ekranda.current || hesapId.current !== etkinHesap.current) {
        if (fotograf) medyaOnizlemesiniBirak(fotograf.uri);
        return;
      }
      if (!fotograf) return;
      if (!fotograf.fileSize || fotograf.fileSize > 2 * 1024 * 1024) {
        medyaOnizlemesiniBirak(fotograf.uri);
        setHata('Profil fotoğrafın en fazla 2 MB olabilir.');
        return;
      }
      onizlemeyiTemizle();
      secilenFotograf.current = fotograf;
      setTaslak((onceki) => ({ ...onceki, fotograf: fotograf.uri }));
    } catch (sorun) {
      if (ekranda.current)
        setHata(sorun instanceof Error ? sorun.message : 'Fotoğraf açılamadı. Tekrar dene.');
    } finally {
      islemSuruyor.current = false;
      if (ekranda.current) setFotografSeciliyor(false);
    }
  };
  const fotografiKaldir = () => {
    if (islemSuruyor.current) return;
    onizlemeyiTemizle();
    setTaslak((onceki) => ({ ...onceki, fotograf: undefined }));
    setHata('');
  };
  const kaydet = async () => {
    if (islemSuruyor.current || !degisti || !alan || !etkinHesap.current) return;
    const yeniHatalar: typeof hatalar = {};
    if (alan === 'ad' && taslak.ad.trim().length < 2) yeniHatalar.ad = 'Adını en az iki karakterle yaz.';
    setHatalar(yeniHatalar);
    if (yeniHatalar.ad) {
      adAlani.current?.focus();
      return;
    }
    if (alan === 'telefon') {
      const sorun = telefonHatasi(taslak.telefon ?? '', Boolean(taslak.telefonGoster));
      if (sorun) {
        setHata(sorun);
        return;
      }
    }
    islemSuruyor.current = true;
    setKaydediliyor(true);
    setHata('');
    let yeniFotograf: string | undefined;
    try {
      yeniFotograf = secilenFotograf.current ? await medyaKaydet(secilenFotograf.current) : undefined;
      if (!ekranda.current || hesapId.current !== etkinHesap.current) {
        if (yeniFotograf) void medyaSil(yeniFotograf).catch(() => undefined);
        return;
      }
      const kayit = { ...profil };
      if (alan === 'telefon') {
        kayit.telefon = telefonuNormallestir(taslak.telefon);
        kayit.telefonGoster = Boolean(kayit.telefon && taslak.telefonGoster);
      } else if (alan === 'fotograf') kayit.fotograf = yeniFotograf ?? taslak.fotograf;
      else kayit[alan] = taslak[alan].trim();
      const sonuc = await profilKaydet(kayit);
      if (!sonuc.basarili) throw new Error(sonuc.hata ?? 'Profil kaydedilemedi. Tekrar dene.');
      if (!ekranda.current || hesapId.current !== etkinHesap.current) return;
      setTaslak(kayit);
      onizlemeyiTemizle();
      Keyboard.dismiss();
      haberVer('Profilin güncellendi.');
      setAlan(null);
    } catch (sorun) {
      if (yeniFotograf) void medyaSil(yeniFotograf).catch(() => undefined);
      if (ekranda.current)
        setHata(sorun instanceof Error ? sorun.message : 'Profil kaydedilemedi. Tekrar dene.');
    } finally {
      islemSuruyor.current = false;
      if (ekranda.current) setKaydediliyor(false);
    }
  };

  const alaniAc = (yeni: ProfilAlani) => {
    if (islemSuruyor.current) return;
    onizlemeyiTemizle();
    setTaslak(profil);
    setHata('');
    setHatalar({});
    setAlan(yeni);
  };
  const geri = () => {
    if (islemSuruyor.current) return;
    Keyboard.dismiss();
    onizlemeyiTemizle();
    setHata('');
    setAlan(null);
  };
  if (!alan) {
    const alanlar: ProfilAlani[] = iletisim ? ['telefon'] : ['fotograf', 'ad', 'konum', 'hakkinda'];
    return (
      <View style={{ width: '100%', minWidth: 0, gap: 16 }}>
        <View style={{ borderWidth: 1, borderColor: renk.cizgi, borderRadius: 12, overflow: 'hidden' }}>
          {alanlar.map((tur, i) => {
            const deger =
              tur === 'ad'
                ? profil.ad
                : tur === 'konum'
                  ? profil.konum || 'Eklenmedi'
                  : tur === 'hakkinda'
                    ? profil.hakkinda || 'Kendinden kısaca bahset'
                    : tur === 'telefon'
                      ? telefonuGoster(profil.telefon) || 'Numara ekle'
                      : profil.fotograf
                        ? 'Fotoğrafını değiştir'
                        : 'Fotoğraf ekle';
            return (
              <HareketliBas
                key={tur}
                accessibilityLabel={`${alanBasliklari[tur]} düzenle`}
                onPress={() => alaniAc(tur)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  minHeight: 78,
                  minWidth: 0,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: renk.cizgi,
                }}
              >
                {tur === 'fotograf' ? (
                  <ProfilResmi ad={profil.ad} fotograf={profil.fotograf} boyut={48} />
                ) : null}
                <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
                  <Yazi style={{ fontSize: 13, lineHeight: 20, fontWeight: '600' }}>
                    {alanBasliklari[tur]}
                  </Yazi>
                  <Yazi numberOfLines={2} style={{ color: renk.gri, fontSize: 12, lineHeight: 19 }}>
                    {deger}
                  </Yazi>
                  {tur === 'telefon' && profil.telefon ? (
                    <Yazi style={{ color: renk.gri, fontSize: 11 }}>
                      {profil.telefonGoster ? 'Profilinde görünür' : 'Profilinde gizli'}
                    </Yazi>
                  ) : null}
                </View>
                <ChevronRight size={18} color={renk.gri} />
              </HareketliBas>
            );
          })}
        </View>
        {kompakt && tamamlaninca ? (
          <Buton ikincil onPress={tamamlaninca}>
            Bitti
          </Buton>
        ) : null}
      </View>
    );
  }

  return (
    <View
      onLayout={(olay) => setFormGenisligi(olay.nativeEvent.layout.width)}
      style={{ width: '100%', minWidth: 0, gap: kompakt ? 16 : 22 }}
    >
      <HareketliBas
        disabled={mesgul}
        onPress={geri}
        accessibilityLabel="Profil alanlarına dön"
        style={{ flexDirection: 'row', gap: 8, alignItems: 'center', minHeight: 44, alignSelf: 'flex-start' }}
      >
        <ArrowLeft size={18} color={renk.murekkep} />
        <Yazi style={{ fontSize: 13, fontWeight: '600' }}>{alanBasliklari[alan]}</Yazi>
      </HareketliBas>
      {alan === 'fotograf' ? (
        <View style={[s.fotografSatiri, !kompakt && { paddingBottom: 20 }]}>
          <ProfilResmi ad={taslak.ad} fotograf={taslak.fotograf} boyut={kompakt || mobil ? 60 : 72} />
          <View style={{ flex: 1, minWidth: 0, gap: 7 }}>
            <View style={[ortak.satir, { flexWrap: 'wrap', gap: 8 }]}>
              <Buton
                ikincil
                onPress={() => void fotografSec()}
                disabled={mesgul}
                simge={
                  fotografSeciliyor ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Camera color={renk.murekkep} size={16} />
                  )
                }
                style={s.fotografSec}
              >
                {taslak.fotograf ? 'Değiştir' : 'Fotoğraf ekle'}
              </Buton>
              {taslak.fotograf ? (
                <HareketliBas
                  onPress={fotografiKaldir}
                  disabled={mesgul}
                  accessibilityLabel="Profil fotoğrafını kaldır"
                  style={s.fotografKaldir}
                >
                  <Trash2 size={16} color={renk.murekkep} />
                </HareketliBas>
              ) : null}
            </View>
            <Yazi style={{ color: renk.gri, fontSize: 11, lineHeight: 17 }}>
              JPG, PNG veya WebP · En fazla 2 MB
            </Yazi>
          </View>
        </View>
      ) : null}
      {alan === 'ad' ? (
        <View style={{ gap: 16, minWidth: 0 }}>
          <View style={{ width: '100%', minWidth: 0 }}>
            <Alan
              ref={adAlani}
              nativeID={`profil-${kimlik}-ad`}
              etiket="Ad soyad"
              value={taslak.ad}
              onChangeText={(ad) => {
                setTaslak((onceki) => ({ ...onceki, ad }));
                setHatalar((onceki) => ({ ...onceki, ad: undefined }));
              }}
              hata={hatalar.ad}
              maxLength={60}
              autoComplete="name"
              autoCapitalize="words"
              returnKeyType="done"
              submitBehavior="submit"
              onSubmitEditing={() => void kaydet()}
              editable={!mesgul}
            />
          </View>
        </View>
      ) : null}
      {alan === 'konum' ? (
        <View style={{ flexDirection: darForm ? 'column' : 'row', gap: 16, minWidth: 0 }}>
          <View style={darForm ? { width: '100%', minWidth: 0 } : s.alan}>
            <SecimAlani
              etiket="İl (isteğe bağlı)"
              ipucu="İl seç"
              deger={seciliKonum.il}
              secenekler={iller}
              degistir={(il) => setTaslak((onceki) => ({ ...onceki, konum: konumuBirlestir(il) }))}
              disabled={mesgul}
            />
          </View>
          <View style={darForm ? { width: '100%', minWidth: 0 } : s.alan}>
            <SecimAlani
              etiket="İlçe (isteğe bağlı)"
              ipucu={seciliKonum.il ? 'İlçe seç' : 'Önce il seç'}
              deger={seciliKonum.ilce}
              secenekler={ilceSecenekleri(seciliKonum.il)}
              degistir={(ilce) =>
                setTaslak((onceki) => ({ ...onceki, konum: konumuBirlestir(seciliKonum.il, ilce) }))
              }
              disabled={mesgul || !seciliKonum.il}
            />
          </View>
        </View>
      ) : null}
      {alan === 'hakkinda' ? (
        <View style={{ gap: 5 }}>
          <Alan
            ref={hakkindaAlani}
            nativeID={`profil-${kimlik}-hakkinda`}
            etiket="Hakkında (isteğe bağlı)"
            placeholder="Kendinden kısaca bahset"
            value={taslak.hakkinda}
            onChangeText={(hakkinda) => setTaslak((onceki) => ({ ...onceki, hakkinda }))}
            maxLength={180}
            multiline
            autoComplete="off"
            autoCapitalize="sentences"
            editable={!mesgul}
            style={{ height: kompakt ? 82 : 100 }}
          />
          <Yazi style={{ fontSize: 11, color: renk.gri, textAlign: 'right' }}>
            {taslak.hakkinda.length}/180
          </Yazi>
        </View>
      ) : null}
      {alan === 'telefon' ? (
        <TelefonBilgisiAlanlari
          telefon={taslak.telefon ?? ''}
          telefonGoster={Boolean(taslak.telefonGoster)}
          degistir={(deger) => {
            setTaslak((onceki) => ({ ...onceki, ...deger }));
            setHata('');
          }}
          disabled={mesgul}
        />
      ) : null}
      {hata ? (
        <Yazi accessibilityRole="alert" style={{ color: renk.hata, fontSize: 13 }}>
          {hata}
        </Yazi>
      ) : null}
      <View style={[s.kaydetSatiri, darForm ? undefined : { alignItems: 'flex-end' }]}>
        <Buton
          onPress={() => void kaydet()}
          disabled={mesgul || !degisti}
          simge={
            kaydediliyor ? <ActivityIndicator size="small" /> : <Check color={renk.murekkep} size={18} />
          }
          style={darForm ? { width: '100%', minWidth: 0, paddingHorizontal: 8 } : { minWidth: 220 }}
        >
          {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'}
        </Buton>
      </View>
    </View>
  );
}

export function ProfilDuzenlemePenceresi({ kapat }: { kapat: () => void }) {
  const [mesgul, setMesgul] = useState(false);
  return (
    <Pencere acik kapat={() => !mesgul && kapat()} baslik="Profili düzenle">
      <ProfilFormu kompakt tamamlaninca={kapat} mesgulDegisti={setMesgul} />
    </Pencere>
  );
}

const useStiller = temaStilleri((renk) =>
  StyleSheet.create({
    avatar: {
      backgroundColor: renk.sabitKoyu,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
    },
    fotografSatiri: { flexDirection: 'row', alignItems: 'center', gap: 14, minWidth: 0 },
    fotografSec: { minHeight: 44, paddingHorizontal: 12, maxWidth: '100%', flexShrink: 1 },
    fotografKaldir: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: renk.cizgi,
      borderRadius: 10,
      flexShrink: 0,
    },
    alan: { flexGrow: 1, flexBasis: 0, minWidth: 0 },
    kaydetSatiri: { gap: 8, paddingTop: 2 },
  }),
);
