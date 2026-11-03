import { useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { sonBakilanlariTemizle } from '../durum/sonBakilanDeposu';
import { useTema } from '../tasarim/tema';
import { Buton, Yazi } from './Temel';
import { HareketliBas } from './Hareketli';

export function GezintiGecmisiDenetimi() {
  const { renk } = useTema();
  const [isleniyor, setIsleniyor] = useState(false);
  const [sonuc, setSonuc] = useState('');
  return (
    <View style={{ gap: 12, alignItems: 'flex-start' }}>
      <Buton
        ikincil
        disabled={isleniyor}
        onPress={async () => {
          setIsleniyor(true);
          setSonuc('');
          try {
            await sonBakilanlariTemizle();
            setSonuc('Son bakılan ilanlar temizlendi. Hesap, mesaj ve favorilerin korundu.');
          } catch {
            setSonuc('Geçmiş temizlenemedi. Tarayıcının depolama iznini kontrol edip tekrar dene.');
          } finally {
            setIsleniyor(false);
          }
        }}
        style={{ minHeight: 48, maxWidth: '100%', paddingHorizontal: 16 }}
        yaziStili={{ flexShrink: 1, textAlign: 'center' }}
      >
        {isleniyor ? 'Temizleniyor…' : 'Son bakılan ilanları temizle'}
      </Buton>
      {!!sonuc && (
        <Yazi role="status" style={{ fontSize: 13, lineHeight: 21, color: renk.gri }}>
          {sonuc}
        </Yazi>
      )}
    </View>
  );
}

export default function CerezTercihleri({ kapat }: { kapat: () => void }) {
  const { renk } = useTema();
  return (
    <View style={{ gap: 22, paddingBottom: 4 }}>
      <Yazi style={{ color: renk.gri, lineHeight: 24 }}>
        Reklam ve ziyaretçi analizi çerezi kullanmıyoruz. Hesapların, ilanların ve tercihlerinin bu cihazda
        nasıl tutulduğunu buradan inceleyebilirsin.
      </Yazi>
      {[
        [
          'Hesap ve ilan kayıtları',
          'Oturumun, profilin, ilanların, mesajların ve favorilerin bu cihazda saklanır. Site verilerini silersen bu kayıtlar da kaldırılır.',
        ],
        [
          'Görünüm ve konum',
          'Seçtiğin tema ve konum aynı cihazda hatırlanır. Görünüm ve konum menülerinden değiştirebilirsin.',
        ],
        [
          'Son bakılan ilanlar',
          'Karşılaştırma önerisi için en fazla 20 ilan kaydı tutulur. 30 günden eski kayıtlar yeniden okunduğunda elenir.',
        ],
        [
          'Haritalar',
          'Konum sekmesini açtığında OpenStreetMap’e bağlantı kurulur; harita sağlayıcısı bağlantı bilgilerini ve görüntülenen alanı görür.',
        ],
      ].map(([baslik, metin]) => (
        <View key={baslik} style={{ gap: 5 }}>
          <Yazi style={{ fontWeight: '700', fontSize: 14 }}>{baslik}</Yazi>
          <Yazi style={{ color: renk.gri, fontSize: 13, lineHeight: 22 }}>{metin}</Yazi>
        </View>
      ))}
      <GezintiGecmisiDenetimi />
      <Link href="/cerezler" asChild>
        <HareketliBas
          onPress={kapat}
          style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
        >
          <Yazi style={{ textDecorationLine: 'underline', fontSize: 13 }}>
            Çerezler ve cihaz verileri hakkında
          </Yazi>
        </HareketliBas>
      </Link>
    </View>
  );
}
