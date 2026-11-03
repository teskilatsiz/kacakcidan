import { useId, useState } from 'react';
import { View } from 'react-native';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import { Alan, Buton, Yazi } from './Temel';
import { SecimAlani } from './SecimAlani';
import { TutarSatiri } from './AlisverisOzeti';
import { HareketliBas } from './Hareketli';
import { useEkran, useTema } from '../tasarim/tema';
import {
  alisverisOzeti,
  alisverisParasi,
  kargoBoyutlari,
  kargoBoyutuGecerli,
  paketBoyutunuHesapla,
  type KargoBoyutu,
} from '../veri/guvenliAlisveris';

export function TeslimatAlanlari({
  etkin,
  kargoBoyutu,
  fiyat,
  degistir,
  hata,
  disabled = false,
}: {
  etkin: boolean;
  kargoBoyutu: KargoBoyutu | '';
  fiyat: number;
  degistir: (deger: { etkin: boolean; kargoBoyutu: KargoBoyutu | '' }) => void;
  hata?: string;
  disabled?: boolean;
}) {
  const { renk } = useTema();
  const { mobil } = useEkran();
  const kimlik = useId();
  const [hesaplayici, setHesaplayici] = useState(false);
  const [olculer, setOlculer] = useState({ en: '', boy: '', yukseklik: '', agirlik: '' });
  const [hesapHatasi, setHesapHatasi] = useState('');
  const sonuc = paketBoyutunuHesapla(
    ...((['en', 'boy', 'yukseklik', 'agirlik'] as const).map((ad) =>
      Number(olculer[ad].replace(',', '.')),
    ) as [number, number, number, number]),
  );
  const ozet = kargoBoyutuGecerli(kargoBoyutu) ? alisverisOzeti(fiyat, kargoBoyutu) : undefined;
  return (
    <View style={{ gap: 14, borderTopWidth: 1, borderTopColor: renk.cizgi, paddingTop: 20, minWidth: 0 }}>
      <HareketliBas
        accessibilityRole="checkbox"
        accessibilityState={{ checked: etkin, disabled }}
        onPress={() => degistir({ etkin: !etkin, kargoBoyutu })}
        disabled={disabled}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderWidth: 1,
            borderColor: etkin ? renk.sari : renk.cizgi,
            borderRadius: 5,
            backgroundColor: etkin ? renk.sari : renk.beyaz,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {etkin ? <Check size={16} color={renk.sabitKoyu} /> : null}
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <Yazi style={{ fontSize: 14, fontWeight: '700' }}>Param Güvende ile satışa aç</Yazi>
          <Yazi style={{ fontSize: 12, color: renk.gri, lineHeight: 19 }}>
            Kargo boyutunu seç, alıcının ödeyeceği toplamı gör.
          </Yazi>
        </View>
        <ShieldCheck size={20} color={renk.murekkep} style={{ flexShrink: 0 }} />
      </HareketliBas>
      {etkin ? (
        <View style={{ gap: 14, minWidth: 0 }}>
          <SecimAlani
            etiket="Kargo boyutu"
            deger={kargoBoyutu}
            secenekler={kargoBoyutlari.map((boyut) => ({
              id: boyut.id,
              ad: `${boyut.ad} · ${boyut.sinir} · ${alisverisParasi(boyut.ucret)}`,
            }))}
            degistir={(boyut) => {
              if (kargoBoyutuGecerli(boyut)) degistir({ etkin, kargoBoyutu: boyut });
            }}
            ipucu="Paketinin boyutunu seç"
            gerekli
            disabled={disabled}
            hata={hata}
          />
          <HareketliBas
            accessibilityRole="button"
            aria-expanded={hesaplayici}
            aria-controls={`paket-hesabi-${kimlik}`}
            accessibilityLabel="Paket boyutunu hesapla"
            onPress={() => setHesaplayici(!hesaplayici)}
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              minHeight: 44,
              alignSelf: 'flex-start',
            }}
          >
            <Yazi style={{ fontSize: 12, textDecorationLine: 'underline' }}>Paket boyutunu hesapla</Yazi>
            <ChevronDown
              size={15}
              color={renk.gri}
              style={hesaplayici ? { transform: [{ rotate: '180deg' }] } : undefined}
            />
          </HareketliBas>
          {hesaplayici ? (
            <View
              nativeID={`paket-hesabi-${kimlik}`}
              style={{ gap: 12, padding: 14, borderRadius: 8, backgroundColor: renk.zemin }}
            >
              <Yazi style={{ fontSize: 12, lineHeight: 19, color: renk.gri }}>
                Paketlenmiş ürünün ölçülerini ve ağırlığını gir. Desi ve ağırlıktan büyük olanı esas alınır.
              </Yazi>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {(
                  [
                    ['en', 'En (cm)'],
                    ['boy', 'Boy (cm)'],
                    ['yukseklik', 'Yükseklik (cm)'],
                    ['agirlik', 'Ağırlık (kg)'],
                  ] as const
                ).map(([ad, etiket]) => (
                  <View key={ad} style={{ flexBasis: mobil ? '44%' : '21%', flexGrow: 1, minWidth: 0 }}>
                    <Alan
                      nativeID={`paket-${ad}-${kimlik}`}
                      etiket={etiket}
                      keyboardType="decimal-pad"
                      inputMode="decimal"
                      value={olculer[ad]}
                      maxLength={6}
                      editable={!disabled}
                      onChangeText={(deger) => {
                        setOlculer((onceki) => ({ ...onceki, [ad]: deger.replace(/[^0-9,.]/g, '') }));
                        setHesapHatasi('');
                      }}
                    />
                  </View>
                ))}
              </View>
              {sonuc ? (
                <Yazi style={{ fontSize: 12, color: sonuc.boyut ? renk.gri : renk.hata }}>
                  {sonuc.boyut
                    ? `${sonuc.desi} desi · ${kargoBoyutlari.find((boyut) => boyut.id === sonuc.boyut)?.ad}`
                    : 'Paket 30 kg / desi sınırını aşıyor. Bu ürün için elden teslim seçebilirsin.'}
                </Yazi>
              ) : null}
              {!!hesapHatasi && (
                <Yazi accessibilityRole="alert" style={{ fontSize: 12, color: renk.hata }}>
                  {hesapHatasi}
                </Yazi>
              )}
              <Buton
                ikincil
                disabled={disabled}
                onPress={() => {
                  if (!sonuc) {
                    setHesapHatasi('Dört ölçüyü de sıfırdan büyük bir değerle tamamla.');
                    return;
                  }
                  if (!sonuc.boyut) {
                    setHesapHatasi(
                      'Bu paket kargolu satış için uygun değil. Param Güvende seçimini kapatıp elden teslim edebilirsin.',
                    );
                    return;
                  }
                  degistir({ etkin, kargoBoyutu: sonuc.boyut });
                  setHesaplayici(false);
                }}
              >
                Bu boyutu kullan
              </Buton>
            </View>
          ) : null}
          {ozet ? (
            <View
              style={{
                gap: 7,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: renk.cizgi,
              }}
            >
              <TutarSatiri ad="Ürün bedeli" tutar={ozet.urunBedeli} />
              <TutarSatiri ad="Kargo (alıcı öder)" tutar={ozet.kargoBedeli} />
              <TutarSatiri ad="Kaçakçıdan hizmet bedeli (%5)" tutar={ozet.hizmetBedeli} />
              <TutarSatiri ad="Alıcının ödeyeceği toplam" tutar={ozet.toplam} vurgulu />
              <Yazi style={{ fontSize: 12, color: renk.gri }}>
                Satış tutarın: {alisverisParasi(ozet.saticiKazanci)}. Hizmet ve kargo bedeli alıcıya aittir.
              </Yazi>
            </View>
          ) : (
            <Yazi style={{ fontSize: 12, color: renk.gri }}>
              Fiyat ve kargo boyutu tamamlandığında alıcının ödeyeceği toplam burada görünür.
            </Yazi>
          )}
          <Yazi style={{ fontSize: 11, lineHeight: 18, color: renk.gri }}>
            Kargo bedeli paket boyutuna göre hesaplanır. 30 kg / desi üzerindeki ürünler bu gönderim kapsamına
            girmez.
          </Yazi>
        </View>
      ) : null}
    </View>
  );
}
