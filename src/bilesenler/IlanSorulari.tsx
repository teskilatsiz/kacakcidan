import { useState } from 'react';
import { Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import { usePazar } from '../durum/Pazar';
import type { Ilan } from '../veri/ilanlar';
import type { IlanSorusu } from '../veri/ilanEtkilesimleri';
import { ortak, useEkran, useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { Alan, Buton, Pencere, Yazi } from './Temel';

const tarihYaz = (tarih: string) =>
  new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(tarih));

export function IlanSorulari({ ilan }: { ilan: Ilan }) {
  const { renk } = useTema();

  const { sorular, oturum, soruSor, soruCevapla, soruGorunurluguDegistir } = usePazar();
  const router = useRouter();
  const { mobil } = useEkran();
  const [acik, setAcik] = useState(false);
  const [cevaplanan, setCevaplanan] = useState<IlanSorusu | null>(null);
  const [metin, setMetin] = useState('');
  const [hata, setHata] = useState('');
  const [herkeseAcik, setHerkeseAcik] = useState(false);
  const ilanSorulari = sorular
    .filter((soru) => soru.ilanId === ilan.id)
    .slice()
    .reverse();

  function pencereAc(soru?: IlanSorusu) {
    if (!oturum) {
      router.push({
        pathname: '/giris',
        params: {
          donus: ilan.id.startsWith('yerel-')
            ? `/ilan/yerel?kayit=${encodeURIComponent(ilan.id)}&bolum=sorular`
            : `/ilan/${ilan.id}?bolum=sorular`,
        },
      });
      return;
    }
    setCevaplanan(soru ?? null);
    setMetin(soru?.cevap ?? '');
    setHerkeseAcik(soru?.herkeseAcik ?? false);
    setHata('');
    setAcik(true);
  }

  function gonder() {
    const sonuc = cevaplanan ? soruCevapla(cevaplanan.id, metin, herkeseAcik) : soruSor(ilan.id, metin);
    if (!sonuc.basarili) {
      setHata(sonuc.hata ?? 'Gönderilemedi. Tekrar dene.');
      return;
    }
    setAcik(false);
    setMetin('');
  }

  return (
    <View style={{ gap: 20, maxWidth: 900 }}>
      <View
        style={{ flexDirection: mobil ? 'column' : 'row', gap: 14, alignItems: mobil ? 'stretch' : 'center' }}
      >
        <Yazi style={{ color: renk.gri, flex: 1 }}>
          {ilan.benim
            ? 'Gelen soruları cevapla. Cevabını yalnızca soran kişiyle paylaşabilir veya herkesin görmesini sağlayabilirsin.'
            : 'İlanla ilgili merak ettiklerini ilan sahibine sor. Cevaplandığında bildirimlerinden takip edebilirsin.'}
        </Yazi>
        {!ilan.benim && (
          <Buton
            ikincil
            simge={<MessageCircle size={17} color={renk.murekkep} />}
            onPress={() => pencereAc()}
          >
            Soru sor
          </Buton>
        )}
      </View>
      {ilanSorulari.length === 0 ? (
        <View style={{ padding: 24, borderRadius: 12, backgroundColor: renk.zemin, gap: 5 }}>
          <Yazi style={{ fontWeight: '700' }}>
            {ilan.benim ? 'Henüz soru gelmedi' : 'İlk soruyu sen sor'}
          </Yazi>
          <Yazi style={{ color: renk.gri }}>
            {ilan.benim
              ? 'İlanınla ilgilenenlerin sorularını burada görebilirsin.'
              : 'Açıklamada bulamadığın bir ayrıntı varsa ilan sahibine sorabilirsin.'}
          </Yazi>
        </View>
      ) : (
        ilanSorulari.map((soru) => (
          <View
            key={soru.id}
            style={{
              gap: 12,
              borderWidth: 1,
              borderColor: renk.cizgi,
              borderRadius: 12,
              padding: mobil ? 16 : 22,
            }}
          >
            <View style={[ortak.aralikli, { flexWrap: 'wrap', gap: 8 }]}>
              <Yazi style={{ fontWeight: '700', fontSize: 13 }}>
                {soru.soranId === oturum?.id ? 'Sen' : soru.soranAd}
              </Yazi>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                {!soru.herkeseAcik && (
                  <View accessibilityLabel="Bu soru ve cevap yalnızca soran kişi ile ilan sahibine görünür">
                    <EyeOff size={14} color={renk.gri} />
                  </View>
                )}
                <Yazi style={{ color: renk.gri, fontSize: 12 }}>{tarihYaz(soru.tarih)}</Yazi>
              </View>
            </View>
            <Yazi>{soru.soru}</Yazi>
            {soru.cevap ? (
              <View style={{ gap: 8, padding: 14, borderRadius: 8, backgroundColor: renk.zemin }}>
                <Yazi style={{ fontWeight: '700', fontSize: 12 }}>
                  {ilan.benim ? 'Cevabın' : `${ilan.satici} · İlan sahibi`}
                </Yazi>
                <Yazi>{soru.cevap}</Yazi>
              </View>
            ) : (
              <Yazi style={{ color: renk.gri, fontSize: 12 }}>İlan sahibinin cevabı bekleniyor.</Yazi>
            )}
            {ilan.benim ? (
              <View
                style={{
                  flexDirection: mobil ? 'column' : 'row',
                  gap: 12,
                  alignItems: mobil ? 'stretch' : 'center',
                }}
              >
                <Buton ikincil onPress={() => pencereAc(soru)}>
                  {soru.cevap ? 'Cevabı düzenle' : 'Cevapla'}
                </Buton>
                {!!soru.cevap && (
                  <HareketliBas
                    accessibilityRole="button"
                    accessibilityLabel={soru.herkeseAcik ? 'Cevabı kişiye özel yap' : 'Cevabı herkese aç'}
                    onPress={() => soruGorunurluguDegistir(soru.id)}
                    style={{ minHeight: 44, flexDirection: 'row', gap: 8, alignItems: 'center', flex: 1 }}
                  >
                    {soru.herkeseAcik ? (
                      <Eye size={16} color={renk.gri} />
                    ) : (
                      <EyeOff size={16} color={renk.gri} />
                    )}
                    <Yazi style={{ fontSize: 12, flexShrink: 1 }}>
                      {soru.herkeseAcik ? 'Cevabı gizle' : 'Cevabı herkese aç'}
                    </Yazi>
                  </HareketliBas>
                )}
              </View>
            ) : null}
          </View>
        ))
      )}
      <Pencere
        acik={acik}
        kapat={() => setAcik(false)}
        baslik={cevaplanan ? 'Soruyu cevapla' : 'İlan sahibine soru sor'}
        altlik={<Buton onPress={gonder}>{cevaplanan ? 'Cevabı gönder' : 'Soruyu gönder'}</Buton>}
      >
        <Yazi style={{ color: renk.gri }}>{cevaplanan?.soru ?? ilan.baslik}</Yazi>
        <Alan
          nativeID={cevaplanan ? 'ilan-soru-cevabi' : 'ilan-sorusu'}
          etiket={cevaplanan ? 'Cevabın' : 'Sorun'}
          value={metin}
          onChangeText={(deger) => {
            setMetin(deger);
            setHata('');
          }}
          multiline
          maxLength={cevaplanan ? 1000 : 600}
          placeholder={
            cevaplanan ? 'İlanla ilgili ayrıntıları paylaş' : 'İlan hakkında ne öğrenmek istersin?'
          }
          hata={hata}
        />
        <Yazi style={{ color: renk.gri, fontSize: 12, textAlign: 'right' }}>
          {metin.length}/{cevaplanan ? 1000 : 600}
        </Yazi>
        {cevaplanan ? (
          <View style={[ortak.aralikli, { gap: 14 }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Yazi style={{ fontWeight: '700' }}>Cevabı herkes görebilsin</Yazi>
              <Yazi style={{ color: renk.gri, fontSize: 12 }}>
                Kapalıyken yalnızca soruyu soran kişi görür.
              </Yazi>
            </View>
            <Switch
              accessibilityLabel="Cevabı herkes görebilsin"
              value={herkeseAcik}
              onValueChange={setHerkeseAcik}
              trackColor={{ false: renk.cizgi, true: renk.sari }}
              thumbColor={renk.murekkep}
            />
          </View>
        ) : (
          <Yazi style={{ color: renk.gri, fontSize: 12 }}>
            Telefon, e-posta veya ödeme bilgilerini paylaşma. İlan sahibi cevabını herkese açık paylaşabilir.
          </Yazi>
        )}
      </Pencere>
    </View>
  );
}
