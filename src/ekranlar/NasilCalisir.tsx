import { View } from 'react-native';
import { Link } from 'expo-router';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Camera from 'lucide-react-native/icons/camera';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Search from 'lucide-react-native/icons/search';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import { Kabuk } from '../bilesenler/Kabuk';
import { Baslik, Yazi } from '../bilesenler/Temel';
import { HareketliBas } from '../bilesenler/Hareketli';
import { kalin, ortak, useEkran, useTema } from '../tasarim/tema';
export default function NasilCalisir() {
  const { renk } = useTema();

  const { mobil, bosluk } = useEkran();
  return (
    <Kabuk>
      <View style={[ortak.alan, { paddingHorizontal: bosluk, paddingVertical: mobil ? 24 : 36, gap: 28 }]}>
        <View style={{ gap: 10, maxWidth: 700 }}>
          <Baslik buyuk style={{ fontSize: mobil ? 30 : 36, lineHeight: mobil ? 38 : 44 }}>
            Nasıl çalışır?
          </Baslik>
          <Yazi style={{ color: renk.gri, lineHeight: 25, fontSize: 14 }}>
            Aradığını bul, satıcıyla konuş, ayrıntıları netleştir. Kullanmadıkların için de birkaç fotoğrafla
            ilan aç.
          </Yazi>
        </View>
        <View style={{ flexDirection: mobil ? 'column' : 'row', gap: 20 }}>
          {[
            {
              no: '01',
              simge: Search,
              ad: 'Aradığını bul',
              yazi: 'Kategori seç ya da arama kutusuna bir ürün yaz. Konum, fiyat ve ürün durumuyla sonuçları daralt. İlgini çeken ilanları kalbe dokunarak kaydet.',
            },
            {
              no: '02',
              simge: MessageCircle,
              ad: 'Satıcıyla konuş',
              yazi: 'İlandaki mesaj düğmesinden merak ettiklerini sor. İstersen fiyat teklifini ilet. Ürünün durumu, kutu içeriği ve teslim yeri konusunda anlaş.',
            },
            {
              no: '03',
              simge: Camera,
              ad: 'İlanını oluştur',
              yazi: 'Net fotoğraflar ekle, doğru kategoriyi seç, ürünün durumunu ve varsa kusurlarını açıkça yaz. Fiyatını belirle, ilanını kontrol edip paylaş.',
            },
          ].map((o) => (
            <View
              key={o.no}
              style={[ortak.kart, { flex: 1, padding: 24, gap: 16, backgroundColor: renk.acik }]}
            >
              <View style={ortak.aralikli}>
                <o.simge size={27} strokeWidth={1.3} />
                <Yazi style={{ color: renk.gri, fontSize: 16 }}>{o.no}</Yazi>
              </View>
              <Yazi style={{ fontFamily: kalin, fontWeight: '700', fontSize: 20, lineHeight: 28 }}>
                {o.ad}
              </Yazi>
              <Yazi style={{ color: renk.gri, fontSize: 14, lineHeight: 24 }}>{o.yazi}</Yazi>
            </View>
          ))}
        </View>
        <View
          style={{ backgroundColor: renk.sariSoluk, padding: mobil ? 24 : 34, borderRadius: 13, gap: 13 }}
        >
          <View style={ortak.satir}>
            <ShieldCheck color={renk.murekkep} size={24} />
            <Baslik style={{ fontSize: 23 }}>Teslimden önce</Baslik>
          </View>
          <View style={{ gap: 10, maxWidth: 900 }}>
            <Yazi style={{ color: renk.gri, lineHeight: 24 }}>
              Kalabalık ve aydınlık bir yerde buluş. Ürünü gör, çalışmasını ve ilandaki bilgilerle eşleştiğini
              kontrol et.
            </Yazi>
            <Yazi style={{ color: renk.gri, lineHeight: 24 }}>
              Ürünü görmeden kapora gönderme. Teslim ve ödeme ayrıntılarını karşı tarafla önceden netleştir.
            </Yazi>
            <Yazi style={{ color: renk.gri, lineHeight: 24 }}>
              Görüşmelerini mesajlarda tut. Kart şifreni, tek kullanımlık kodları ve kimlik fotoğrafını
              paylaşma.
            </Yazi>
          </View>
        </View>
        <View style={{ flexDirection: mobil ? 'column' : 'row', gap: 28 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <Baslik style={{ fontSize: 20, lineHeight: 28 }}>Kaydettiğim ilanlar nerede?</Baslik>
            <Yazi style={{ color: renk.gri, lineHeight: 24 }}>
              Kalp düğmesiyle kaydettiğin tüm ilanlar Favorilerim’de. Fikrini değiştirirsen aynı düğmeye
              tekrar dokunarak kaydı kaldırabilirsin.
            </Yazi>
            <Link href="/favoriler" asChild>
              <HareketliBas style={{ minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' }}>
                <Yazi style={{ fontWeight: '600', textDecorationLine: 'underline' }}>Favorilerime git</Yazi>
              </HareketliBas>
            </Link>
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <Baslik style={{ fontSize: 20, lineHeight: 28 }}>İlanımı nasıl kaldırırım?</Baslik>
            <Yazi style={{ color: renk.gri, lineHeight: 24 }}>
              Hesabım sayfasından İlanlarım’a geç. Kendi eklediğin ilanın yanındaki kaldır düğmesini kullanıp
              işlemi onayla.
            </Yazi>
            <Link href="/profil" asChild>
              <HareketliBas style={{ minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' }}>
                <Yazi style={{ fontWeight: '600', textDecorationLine: 'underline' }}>İlanlarımı yönet</Yazi>
              </HareketliBas>
            </Link>
          </View>
        </View>
        <Link href="/kesfet" asChild>
          <HareketliBas
            style={{
              backgroundColor: renk.murekkep,
              alignSelf: 'flex-start',
              paddingVertical: 15,
              paddingHorizontal: 24,
              borderRadius: 9,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <Yazi style={{ color: renk.tersYazi, fontWeight: '700' }}>İlanları keşfet</Yazi>
            <ArrowUpRight size={18} color={renk.sari} />
          </HareketliBas>
        </Link>
      </View>
    </Kabuk>
  );
}
