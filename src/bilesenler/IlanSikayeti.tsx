import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import Flag from 'lucide-react-native/icons/flag';
import { usePazar } from '../durum/Pazar';
import { ilanYolu, type Ilan } from '../veri/ilanlar';
import { sikayetNedenleri, type SikayetNedeni } from '../veri/ilanYonetimi';
import { useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { Alan, Buton, Pencere, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';

export function IlanSikayeti({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();
  const { oturum, ilanSikayetEt } = usePazar();
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const [neden, setNeden] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [hata, setHata] = useState('');
  const [mesgul, setMesgul] = useState(false);
  function ac() {
    if (!oturum) {
      const yol = ilanYolu(ilan);
      const donus = ilan.id.startsWith('yerel-')
        ? `/ilan/yerel?kayit=${encodeURIComponent(ilan.id)}`
        : `/ilan/${yol.params.id}`;
      router.push({ pathname: '/giris', params: { donus } });
      return;
    }
    setHata('');
    setAcik(true);
  }
  async function gonder() {
    if (mesgul) return;
    if (!neden) {
      setHata('Şikayet nedenini seç.');
      return;
    }
    setMesgul(true);
    const sonuc = await ilanSikayetEt(ilan.id, neden as SikayetNedeni, aciklama);
    setMesgul(false);
    if (!sonuc.basarili) {
      setHata(sonuc.hata ?? 'Şikayetin kaydedilemedi.');
      return;
    }
    setAcik(false);
    setNeden('');
    setAciklama('');
  }
  if (ilan.benim) return null;
  return (
    <>
      <HareketliBas
        accessibilityRole="button"
        accessibilityLabel="İlanla ilgili şikayetim var"
        onPress={ac}
        style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 44 }}
      >
        <Flag size={15} color={renk.gri} />
        <Yazi style={{ fontSize: 12, color: renk.gri }}>Şikayetim var</Yazi>
      </HareketliBas>
      <Pencere
        acik={acik}
        kapat={() => {
          if (!mesgul) setAcik(false);
        }}
        baslik="İlanla ilgili şikayetim var"
        altlik={
          <Buton disabled={mesgul} onPress={gonder}>
            {mesgul ? 'Kaydediliyor…' : 'Şikayeti gönder'}
          </Buton>
        }
      >
        <Yazi style={{ color: renk.gri }}>{ilan.baslik}</Yazi>
        <SecimAlani
          etiket="Şikayet nedeni"
          deger={neden}
          degistir={(deger) => {
            setNeden(deger);
            setHata('');
          }}
          gerekli
          secenekler={sikayetNedenleri.map((ad) => ({ id: ad, ad }))}
        />
        <Alan
          nativeID="ilan-sikayet-aciklamasi"
          etiket="Açıklama"
          value={aciklama}
          onChangeText={(metin) => {
            setAciklama(metin);
            setHata('');
          }}
          multiline
          maxLength={1000}
          placeholder="İlandaki sorunu kısaca anlat"
          hata={hata}
        />
        <View style={{ gap: 6 }}>
          <Yazi style={{ fontSize: 12, color: renk.gri }}>
            Şikayet bilgilerin ilan sahibinin profilinde veya ilan sayfasında gösterilmez.
          </Yazi>
          <Yazi style={{ fontSize: 11, color: renk.gri }}>
            Kişisel bilgilerini ve ödeme bilgilerini açıklamaya yazma.
          </Yazi>
        </View>
      </Pencere>
    </>
  );
}
