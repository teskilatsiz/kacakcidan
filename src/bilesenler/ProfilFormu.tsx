import { useEffect, useId, useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import Camera from 'lucide-react-native/icons/camera';
import Check from 'lucide-react-native/icons/check';
import Trash2 from 'lucide-react-native/icons/trash';
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

export function ProfilFormu({
  kompakt = false,
  tamamlaninca,
  mesgulDegisti,
}: {
  kompakt?: boolean;
  tamamlaninca?: () => void;
  mesgulDegisti?: (mesgul: boolean) => void;
}) {
  const { renk } = useTema();
  const s = useStiller();

  const { profil, profilKaydet, haberVer, oturum } = usePazar();
  const { mobil } = useEkran();
  const kimlik = useId();
  const [taslak, setTaslak] = useState(profil);
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
    taslak.ad !== profil.ad ||
    taslak.konum !== profil.konum ||
    taslak.hakkinda !== profil.hakkinda ||
    taslak.fotograf !== profil.fotograf;

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
    if (islemSuruyor.current || !degisti || !etkinHesap.current) return;
    const yeniHatalar: typeof hatalar = {};
    if (taslak.ad.trim().length < 2) yeniHatalar.ad = 'Adını en az iki karakterle yaz.';
    setHatalar(yeniHatalar);
    if (yeniHatalar.ad) {
      adAlani.current?.focus();
      return;
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
      const kayit = {
        ...taslak,
        ad: taslak.ad.trim(),
        konum: taslak.konum.trim(),
        hakkinda: taslak.hakkinda.trim(),
        fotograf: yeniFotograf ?? taslak.fotograf,
      };
      profilKaydet(kayit);
      setTaslak(kayit);
      onizlemeyiTemizle();
      Keyboard.dismiss();
      haberVer('Profilin güncellendi.');
      tamamlaninca?.();
    } catch (sorun) {
      if (yeniFotograf) void medyaSil(yeniFotograf).catch(() => undefined);
      if (ekranda.current)
        setHata(sorun instanceof Error ? sorun.message : 'Profil kaydedilemedi. Tekrar dene.');
    } finally {
      islemSuruyor.current = false;
      if (ekranda.current) setKaydediliyor(false);
    }
  };

  return (
    <View style={{ gap: kompakt ? 16 : 22 }}>
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
      <View style={{ flexDirection: mobil || kompakt ? 'column' : 'row', gap: 16 }}>
        <View style={mobil || kompakt ? { width: '100%' } : s.alan}>
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
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => hakkindaAlani.current?.focus()}
            editable={!mesgul}
          />
        </View>
      </View>
      <View style={{ flexDirection: mobil || kompakt ? 'column' : 'row', gap: 16 }}>
        <View style={mobil || kompakt ? { width: '100%' } : s.alan}>
          <SecimAlani
            etiket="İl (isteğe bağlı)"
            ipucu="İl seç"
            deger={seciliKonum.il}
            secenekler={iller}
            degistir={(il) => setTaslak((onceki) => ({ ...onceki, konum: konumuBirlestir(il) }))}
            disabled={mesgul}
          />
        </View>
        <View style={mobil || kompakt ? { width: '100%' } : s.alan}>
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
      {hata ? (
        <Yazi accessibilityRole="alert" style={{ color: renk.hata, fontSize: 13 }}>
          {hata}
        </Yazi>
      ) : null}
      <View style={[s.kaydetSatiri, mobil || kompakt ? undefined : { alignItems: 'flex-end' }]}>
        <Buton
          onPress={() => void kaydet()}
          disabled={mesgul || !degisti}
          simge={
            kaydediliyor ? <ActivityIndicator size="small" /> : <Check color={renk.murekkep} size={18} />
          }
          style={!mobil && !kompakt ? { minWidth: 220 } : undefined}
        >
          {kaydediliyor ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
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
    fotografSatiri: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    fotografSec: { minHeight: 44, paddingHorizontal: 12 },
    fotografKaldir: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: renk.murekkep,
      borderRadius: 8,
    },
    alan: { flexGrow: 1, flexBasis: 0, minWidth: 0 },
    kaydetSatiri: { gap: 8, paddingTop: 2 },
  }),
);
