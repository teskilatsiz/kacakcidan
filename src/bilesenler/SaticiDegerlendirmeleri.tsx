import { useState } from 'react';
import { View } from 'react-native';
import Star from 'lucide-react-native/icons/star';
import { Alan, Baslik, Buton, Pencere, Yazi } from './Temel';
import { HareketliBas } from './Hareketli';
import { DegerlendirmeYildizlari } from './DegerlendirmeYildizlari';
import { usePazar } from '../durum/Pazar';
import { useEkran, useTema } from '../tasarim/tema';
import {
  degerlendirmeDuzenlenebilir,
  type Alisveris,
  type SaticiDegerlendirmesi,
} from '../veri/saticiDegerlendirmeleri';

const tarihBicimi = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export function SaticiDegerlendirmeleri({ saticiId }: { saticiId: string }) {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const { degerlendirmeler, degerlendirmeHakkiKullanilanlar, alisverisler, oturum } = usePazar();
  const [hepsi, setHepsi] = useState(false);
  const [secili, setSecili] = useState<Alisveris>();
  const [yanitlanacak, setYanitlanacak] = useState<SaticiDegerlendirmesi>();
  const kayitlar = degerlendirmeler
    .filter((kayit) => kayit.saticiId === saticiId)
    .sort((a, b) => b.tarih.localeCompare(a.tarih));
  const bekleyen = alisverisler.find(
    (kayit) =>
      kayit.saticiId === saticiId &&
      kayit.aliciId === oturum?.id &&
      kayit.durum === 'tamamlandi' &&
      !degerlendirmeHakkiKullanilanlar.includes(kayit.id) &&
      !degerlendirmeler.some((yorum) => yorum.alisverisId === kayit.id),
  );
  return (
    <View
      dataSet={{ 'satici-yorumlari': 'true' }}
      style={{
        borderWidth: 1,
        borderColor: renk.cizgi,
        borderRadius: 10,
        backgroundColor: renk.beyaz,
        padding: mobil ? 16 : 20,
        minWidth: 0,
        gap: 16,
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', columnGap: 12, rowGap: 8 }}
      >
        <Baslik style={{ flex: 1, fontSize: 20, lineHeight: 28, letterSpacing: -0.4 }}>
          Değerlendirmeler{kayitlar.length ? ` (${kayitlar.length})` : ''}
        </Baslik>
        {!!bekleyen && (
          <Buton ikincil style={{ minHeight: 44, paddingHorizontal: 12 }} onPress={() => setSecili(bekleyen)}>
            Satıcıyı değerlendir
          </Buton>
        )}
      </View>
      {!kayitlar.length ? (
        <View style={{ gap: 6 }}>
          <Yazi style={{ fontSize: 14, fontWeight: '600' }}>Henüz değerlendirme yok</Yazi>
          <Yazi style={{ fontSize: 13, lineHeight: 20, color: renk.gri }}>
            Tamamlanan alışverişlerden gelen yorumlar burada görünür.
          </Yazi>
        </View>
      ) : (
        <>
          <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
            Yalnızca alışverişi tamamlayan alıcılar değerlendirme yapabilir. En yeni değerlendirmeler önce
            gösterilir.
          </Yazi>
          {(hepsi ? kayitlar : kayitlar.slice(0, 3)).map((kayit) => (
            <View
              key={kayit.id}
              style={{ minWidth: 0, borderTopWidth: 1, borderColor: renk.cizgi, paddingTop: 16, gap: 8 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  columnGap: 12,
                  rowGap: 4,
                }}
              >
                <Yazi style={{ flex: 1, minWidth: 100, fontSize: 13, fontWeight: '700' }}>
                  {kayit.yazanAd}
                </Yazi>
                <View
                  accessible
                  accessibilityLabel={`5 üzerinden ${kayit.puan} puan`}
                  style={{ flexDirection: 'row', gap: 3 }}
                >
                  {[1, 2, 3, 4, 5].map((puan) => (
                    <Star
                      key={puan}
                      size={14}
                      color={puan <= kayit.puan ? renk.murekkep : renk.gri}
                      fill={puan <= kayit.puan ? renk.sari : 'none'}
                      strokeWidth={1.5}
                    />
                  ))}
                </View>
                <Yazi style={{ fontSize: 11, lineHeight: 18, color: renk.gri }}>
                  {tarihBicimi.format(new Date(kayit.tarih))}
                </Yazi>
              </View>
              {!!kayit.yorum && (
                <Yazi selectable style={{ fontSize: 13, lineHeight: 21 }}>
                  {kayit.yorum}
                </Yazi>
              )}
              <Yazi style={{ fontSize: 11, lineHeight: 18, color: renk.gri }}>
                Aldığı ürün: {kayit.ilanBasligi}
              </Yazi>
              {!!kayit.cevap && (
                <View style={{ backgroundColor: renk.acik, borderRadius: 8, padding: 12, gap: 4 }}>
                  <Yazi style={{ fontSize: 12, fontWeight: '700' }}>Satıcının yanıtı</Yazi>
                  <Yazi selectable style={{ fontSize: 13, lineHeight: 21 }}>
                    {kayit.cevap}
                  </Yazi>
                </View>
              )}
              {oturum?.id === saticiId && (
                <HareketliBas
                  onPress={() => setYanitlanacak(kayit)}
                  style={{
                    alignSelf: 'flex-start',
                    minHeight: 44,
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Yazi style={{ fontSize: 12, fontWeight: '600' }}>
                    {kayit.cevap ? 'Yanıtı düzenle' : 'Yanıtla'}
                  </Yazi>
                </HareketliBas>
              )}
              {kayit.yazanId === oturum?.id && (
                <HareketliBas
                  onPress={() =>
                    setSecili(alisverisler.find((kayitIslem) => kayitIslem.id === kayit.alisverisId))
                  }
                  style={{
                    alignSelf: 'flex-start',
                    minHeight: 44,
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Yazi style={{ fontSize: 12, fontWeight: '600' }}>Değerlendirmem</Yazi>
                </HareketliBas>
              )}
            </View>
          ))}
          {kayitlar.length > 3 && (
            <Buton
              ikincil
              style={{ alignSelf: 'flex-start', minHeight: 44 }}
              onPress={() => setHepsi((deger) => !deger)}
            >
              {hepsi ? 'Daha az göster' : 'Tüm değerlendirmeler'}
            </Buton>
          )}
        </>
      )}
      {!!secili && (
        <DegerlendirmePenceresi key={secili.id} alisveris={secili} kapat={() => setSecili(undefined)} />
      )}
      {!!yanitlanacak && (
        <YanitPenceresi
          key={yanitlanacak.id}
          degerlendirme={yanitlanacak}
          kapat={() => setYanitlanacak(undefined)}
        />
      )}
    </View>
  );
}

export function DegerlendirmePenceresi({ alisveris, kapat }: { alisveris: Alisveris; kapat: () => void }) {
  const { renk } = useTema();
  const { oturum, degerlendirmeler, saticiyiDegerlendir, degerlendirmeGuncelle, degerlendirmeSil, haberVer } =
    usePazar();
  const onceki = degerlendirmeler.find(
    (kayit) => kayit.alisverisId === alisveris.id && kayit.yazanId === oturum?.id,
  );
  const [puan, setPuan] = useState(onceki?.puan ?? 0);
  const [yorum, setYorum] = useState(onceki?.yorum ?? '');
  const [hata, setHata] = useState('');
  const [mesgul, setMesgul] = useState(false);
  const [silmeyiOnayla, setSilmeyiOnayla] = useState(false);
  const duzenlenebilir = !onceki || degerlendirmeDuzenlenebilir(onceki, oturum?.id ?? '');
  async function kaydet() {
    if (mesgul) return;
    if (!puan) {
      setHata('Bir puan seçmelisin.');
      return;
    }
    setMesgul(true);
    setHata('');
    try {
      const sonuc = onceki
        ? await degerlendirmeGuncelle(onceki.id, { puan, yorum })
        : await saticiyiDegerlendir({ alisverisId: alisveris.id, puan, yorum });
      if (!sonuc.basarili) {
        setHata(sonuc.hata ?? 'Değerlendirme kaydedilemedi.');
        return;
      }
      haberVer(onceki ? 'Değerlendirmen güncellendi.' : 'Değerlendirmen yayınlandı.');
      kapat();
    } catch {
      setHata('Değerlendirme kaydedilemedi. Tekrar deneyebilirsin.');
    } finally {
      setMesgul(false);
    }
  }
  async function sil() {
    if (!onceki || mesgul) return;
    setMesgul(true);
    setHata('');
    try {
      const sonuc = await degerlendirmeSil(onceki.id);
      if (!sonuc.basarili) {
        setHata(sonuc.hata ?? 'Değerlendirme silinemedi.');
        return;
      }
      haberVer('Değerlendirmen silindi.');
      kapat();
    } catch {
      setHata('Değerlendirme silinemedi. Tekrar deneyebilirsin.');
    } finally {
      setMesgul(false);
    }
  }
  return (
    <Pencere
      acik
      kapat={() => {
        if (!mesgul) kapat();
      }}
      baslik={silmeyiOnayla ? 'Değerlendirmeyi sil' : onceki ? 'Değerlendirmem' : 'Satıcıyı değerlendir'}
      altlik={
        <View style={{ gap: 8 }}>
          {!!hata && (
            <Yazi accessibilityRole="alert" style={{ fontSize: 13, color: renk.hata }}>
              {hata}
            </Yazi>
          )}
          {silmeyiOnayla ? (
            <>
              <Buton disabled={mesgul} onPress={sil}>
                {mesgul ? 'Siliniyor…' : 'Değerlendirmeyi sil'}
              </Buton>
              <Buton ikincil disabled={mesgul} onPress={() => setSilmeyiOnayla(false)}>
                Vazgeç
              </Buton>
            </>
          ) : (
            <>
              {duzenlenebilir && (
                <Buton disabled={mesgul} onPress={kaydet}>
                  {mesgul ? 'Kaydediliyor…' : onceki ? 'Değişiklikleri kaydet' : 'Değerlendirmeyi yayınla'}
                </Buton>
              )}
              {!!onceki && (
                <Buton
                  ikincil
                  disabled={mesgul}
                  onPress={() => {
                    setHata('');
                    setSilmeyiOnayla(true);
                  }}
                >
                  Değerlendirmeyi sil
                </Buton>
              )}
            </>
          )}
        </View>
      }
    >
      {silmeyiOnayla ? (
        <Yazi>
          Verdiğin puan, yorumun ve satıcının yanıtı profilden kaldırılacak. Aynı alışveriş için yeniden
          değerlendirme yazamazsın.
        </Yazi>
      ) : (
        <>
          <View style={{ gap: 4 }}>
            <Yazi style={{ fontSize: 15, fontWeight: '700' }}>{alisveris.saticiAd}</Yazi>
            <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>{alisveris.ilanBasligi}</Yazi>
          </View>
          <DegerlendirmeYildizlari
            puan={puan}
            degistir={(deger) => {
              setPuan(deger);
              setHata('');
            }}
            disabled={mesgul || !duzenlenebilir}
          />
          <Alan
            nativeID={`satici-yorumu-${alisveris.id}`}
            etiket="Yorumun (isteğe bağlı)"
            placeholder="Ürün ve satıcıyla yaşadığın deneyimi paylaş."
            multiline
            maxLength={1000}
            value={yorum}
            onChangeText={setYorum}
            editable={!mesgul && duzenlenebilir}
            style={{ height: 112 }}
          />
          <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
            {onceki && !duzenlenebilir
              ? 'Değerlendirmeler yayınlandıktan sonra 14 gün içinde düzenlenebilir.'
              : 'Puanın ve yorumun satıcının profilinde yayınlanır. İlk 14 gün içinde düzenleyebilirsin.'}{' '}
            Telefon, adres ve ödeme bilgilerini paylaşma.
          </Yazi>
        </>
      )}
    </Pencere>
  );
}

function YanitPenceresi({
  degerlendirme,
  kapat,
}: {
  degerlendirme: SaticiDegerlendirmesi;
  kapat: () => void;
}) {
  const { renk } = useTema();
  const { degerlendirmeCevapla, haberVer } = usePazar();
  const [cevap, setCevap] = useState(degerlendirme.cevap ?? '');
  const [hata, setHata] = useState('');
  const [mesgul, setMesgul] = useState(false);
  async function kaydet() {
    if (mesgul) return;
    if (!cevap.trim()) {
      setHata('Yanıtını yazmalısın.');
      return;
    }
    setMesgul(true);
    setHata('');
    try {
      const sonuc = await degerlendirmeCevapla(degerlendirme.id, cevap);
      if (!sonuc.basarili) {
        setHata(sonuc.hata ?? 'Yanıt kaydedilemedi.');
        return;
      }
      haberVer('Yanıtın yayınlandı.');
      kapat();
    } catch {
      setHata('Yanıt kaydedilemedi. Tekrar deneyebilirsin.');
    } finally {
      setMesgul(false);
    }
  }
  return (
    <Pencere
      acik
      kapat={() => {
        if (!mesgul) kapat();
      }}
      baslik="Değerlendirmeye yanıt ver"
      altlik={
        <View style={{ gap: 8 }}>
          {!!hata && (
            <Yazi accessibilityRole="alert" style={{ fontSize: 13, color: renk.hata }}>
              {hata}
            </Yazi>
          )}
          <Buton disabled={mesgul} onPress={kaydet}>
            {mesgul ? 'Kaydediliyor…' : 'Yanıtı yayınla'}
          </Buton>
        </View>
      }
    >
      <View style={{ padding: 12, backgroundColor: renk.acik, borderRadius: 8, gap: 4 }}>
        <Yazi style={{ fontSize: 13, fontWeight: '700' }}>
          {degerlendirme.yazanAd} · {degerlendirme.puan} / 5
        </Yazi>
        {!!degerlendirme.yorum && <Yazi style={{ fontSize: 13, lineHeight: 21 }}>{degerlendirme.yorum}</Yazi>}
      </View>
      <Alan
        nativeID={`satici-yaniti-${degerlendirme.id}`}
        etiket="Yanıtın"
        placeholder="Alışverişle ilgili açıklamanı yaz."
        multiline
        maxLength={1000}
        value={cevap}
        onChangeText={setCevap}
        editable={!mesgul}
      />
      <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
        Yanıtın değerlendirmenin altında herkese açık görünür.
      </Yazi>
    </Pencere>
  );
}
