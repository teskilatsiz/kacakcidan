import { useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import { Alan, Buton, Pencere, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';
import { Giris } from './Hareketli';
import {
  alimKategorileri,
  alimTalebiHatalari,
  bosAlimTalebi,
  type AlimTalebiGirdisi,
} from '../veri/alimTalepleri';
import { kategoriYapisi } from '../veri/kategoriler';
import { iller, ilceSecenekleri, konumuAyir } from '../veri/konumlar';
import { useTema } from '../tasarim/tema';

export function AlimTalebiFormu({
  acik,
  kapat,
  olustur,
  konum,
  kaydedildi,
}: {
  acik: boolean;
  kapat: () => void;
  olustur: (girdi: AlimTalebiGirdisi) => Promise<string>;
  konum: string;
  kaydedildi: (id: string) => void;
}) {
  const { renk } = useTema();
  const [girdi, setGirdi] = useState<AlimTalebiGirdisi>(() => ({ ...bosAlimTalebi, ...konumuAyir(konum) }));
  const [adim, setAdim] = useState(1);
  const [hatalar, setHatalar] = useState<Record<string, string>>({});
  const [hata, setHata] = useState('');
  const [calisiyor, setCalisiyor] = useState(false);
  const kayitSuruyor = useRef(false);
  const yapi = girdi.kategori ? kategoriYapisi(girdi.kategori, girdi.altKategori) : undefined;
  const modeller = yapi?.modeller[girdi.marka] ?? [];
  function degistir(alan: keyof AlimTalebiGirdisi, deger: string) {
    setGirdi((onceki) => ({
      ...onceki,
      [alan]: deger,
      ...(alan === 'kategori' ? { altKategori: '', marka: '', model: '' } : {}),
      ...(alan === 'altKategori' ? { marka: '', model: '' } : {}),
      ...(alan === 'marka' ? { model: '' } : {}),
      ...(alan === 'il' ? { ilce: '' } : {}),
    }));
    setHatalar({});
    setHata('');
  }
  function devamEt() {
    const tumHatalar = alimTalebiHatalari(girdi);
    const ilkAdim = Object.fromEntries(
      Object.entries(tumHatalar).filter(([alan]) =>
        ['kategori', 'altKategori', 'marka', 'model'].includes(alan),
      ),
    );
    setHatalar(ilkAdim);
    if (Object.keys(ilkAdim).length) return;
    Keyboard.dismiss();
    setAdim(2);
  }
  async function kaydet() {
    if (kayitSuruyor.current) return;
    const tumHatalar = alimTalebiHatalari(girdi);
    setHatalar(tumHatalar);
    if (Object.keys(tumHatalar).length) return;
    kayitSuruyor.current = true;
    setCalisiyor(true);
    setHata('');
    try {
      const id = await olustur(girdi);
      Keyboard.dismiss();
      kaydedildi(id);
    } catch (sorun) {
      setHata(sorun instanceof Error ? sorun.message : 'Talep kaydedilemedi. Tekrar dene.');
    } finally {
      kayitSuruyor.current = false;
      setCalisiyor(false);
    }
  }
  return (
    <Pencere
      acik={acik}
      kapat={() => {
        if (!calisiyor) kapat();
      }}
      baslik="Alım talebi oluştur"
      altlik={
        <View style={{ gap: 10 }}>
          {!!hata && (
            <Yazi accessibilityRole="alert" style={{ color: renk.hata }}>
              {hata}
            </Yazi>
          )}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {adim === 2 && (
              <Buton
                ikincil
                disabled={calisiyor}
                simge={<ArrowLeft size={18} />}
                onPress={() => {
                  Keyboard.dismiss();
                  setAdim(1);
                }}
              >
                Geri
              </Buton>
            )}
            <Buton
              disabled={calisiyor}
              style={{ flex: 1 }}
              simge={adim === 1 ? <ArrowRight size={18} /> : undefined}
              onPress={adim === 1 ? devamEt : () => void kaydet()}
            >
              {calisiyor ? 'Kaydediliyor…' : adim === 1 ? 'Devam et' : 'Talebi kaydet'}
            </Buton>
          </View>
        </View>
      }
    >
      <Yazi style={{ color: renk.gri, fontSize: 12 }}>
        Adım {adim} / 2 · {adim === 1 ? 'Aradığın ürün' : 'Bütçe ve ayrıntılar'}
      </Yazi>
      <Giris key={adim} style={{ gap: 18 }}>
        {adim === 1 ? (
          <>
            <Yazi>
              Aradığın ürünü seç. Belirli bir marka veya model aramıyorsan bu alanları boş bırakabilirsin.
            </Yazi>
            <SecimAlani
              etiket="Kategori"
              gerekli
              deger={girdi.kategori}
              secenekler={alimKategorileri}
              hata={hatalar.kategori}
              degistir={(deger) => degistir('kategori', deger)}
              ipucu="Ürün kategorisi seç"
            />
            <SecimAlani
              etiket="Alt kategori"
              gerekli
              deger={girdi.altKategori}
              secenekler={yapi?.altKategoriler ?? []}
              disabled={!girdi.kategori}
              hata={hatalar.altKategori}
              degistir={(deger) => degistir('altKategori', deger)}
              ipucu="Ürün türü seç"
            />
            {!!yapi?.markalar.length && (
              <SecimAlani
                etiket={yapi.markaGirisi ? 'Marka' : 'Ürün grubu'}
                deger={girdi.marka}
                secenekler={yapi.markalar}
                disabled={!girdi.altKategori}
                hata={hatalar.marka}
                degistir={(deger) => degistir('marka', deger)}
                ipucu="Fark etmez"
              />
            )}
            {!!modeller.length && (
              <SecimAlani
                etiket={yapi?.modelGirisi ? 'Model' : 'Ürün türü'}
                deger={girdi.model}
                secenekler={modeller}
                hata={hatalar.model}
                degistir={(deger) => degistir('model', deger)}
                ipucu="Fark etmez"
              />
            )}
          </>
        ) : (
          <>
            <Alan
              nativeID="alim-talebi-baslik"
              etiket="Ne arıyorsun?"
              value={girdi.baslik}
              onChangeText={(deger) => degistir('baslik', deger)}
              maxLength={100}
              hata={hatalar.baslik}
              placeholder="Temiz, kutulu Galaxy S23 arıyorum"
              returnKeyType="next"
            />
            <Alan
              nativeID="alim-talebi-butce"
              etiket="En yüksek bütçe (TL)"
              value={girdi.butce}
              onChangeText={(deger) => degistir('butce', deger)}
              inputMode="decimal"
              keyboardType="decimal-pad"
              maxLength={16}
              hata={hatalar.butce}
              placeholder="Örn. 15000"
            />
            <SecimAlani
              etiket="İl"
              deger={girdi.il}
              secenekler={iller}
              hata={hatalar.il}
              degistir={(deger) => degistir('il', deger)}
              ipucu="Türkiye"
            />
            <SecimAlani
              etiket="İlçe"
              deger={girdi.ilce}
              secenekler={ilceSecenekleri(girdi.il)}
              hata={hatalar.ilce}
              disabled={!girdi.il}
              degistir={(deger) => degistir('ilce', deger)}
              ipucu="İlçe fark etmez"
            />
            <Alan
              nativeID="alim-talebi-aciklama"
              etiket="Aradığın özellikler"
              multiline
              maxLength={1500}
              value={girdi.aciklama}
              onChangeText={(deger) => degistir('aciklama', deger)}
              hata={hatalar.aciklama}
              placeholder="Ürünün durumu, yanında istediklerin ve teslim tercihin…"
            />
            <Yazi style={{ fontSize: 12, color: renk.gri }}>
              Talep bu cihazda saklanır. Başka cihazlardaki kullanıcılara iletilmez.
            </Yazi>
          </>
        )}
      </Giris>
    </Pencere>
  );
}
