# Performans

## İlk ekranda gereken kod

Web sayfalarının HTML’i derleme sırasında hazırlanır. İlan başlığı, kapak görseli ve temel içerik sayfa açılırken hazırdır. Etkileşim için gereken JavaScript de bu içeriğin üzerine bağlanır.

Tam kategori ağacı ve kategori sayfası kayıtları ana sayfanın başlık ve footer bağlantıları için yüklenmez. Bu bağlantılar küçük bir yardımcıdan gelir. Arama veya kategori menüsü ayrıntıya ihtiyaç duyduğunda ortak katalog yükleyicisi çalışır. Aynı anda açılan bileşenler tek yükleme isteğini paylaşır; mevcut ilan önerileri kataloğu beklemez.

Sayfa metaverisi ilk HTML’de bulunur. Uygulama içi gezinmelerde bunu güncelleyen bileşen, ilk ana sayfada ayrıca yüklenmez. İlk geçişle birlikte devreye girer; başlığı, açıklamayı ve paylaşım bilgilerini açık sayfaya göre değiştirir.

İlgili dosyalar: [kategori yükleyicisi](../src/veri/kategoriKatalogu.ts), [ana kategori adresleri](../src/veri/anaKategoriAdresi.ts), [web sayfa başlığı](../src/bilesenler/SayfaBasligi.web.tsx).

## Görsellerin boyutu ve önceliği

Derleme, kaynak fotoğraflardan farklı genişliklerde WebP kopyaları üretir. `srcset` ve `sizes` ile tarayıcı, kartın ekrandaki genişliğine uygun dosyayı seçer. İlk iki vitrin görseline yüksek öncelik verilir; sayfanın aşağısındaki görseller yaklaşıldığında yüklenir.

Fotoğrafların oranı ve kapladığı alan önceden bellidir. Görsel geldiğinde çevresindeki içerik yer değiştirmez. Galerideki küçük resimler için tam boy fotoğraf indirilmez; video ve büyük medya kullanıcı açtığında yüklenir.

Yükleme iskeletinin görünürlüğünü izleyen `IntersectionObserver` kartlar arasında paylaşılır. Böylece her fotoğraf kendi gözlemcisini oluşturmaz. İzlenecek son öğe de kaldırıldığında gözlemci kapatılır.

İlgili dosyalar: [web görsel bileşeni](../src/bilesenler/Gorsel.web.tsx), [görsel varyantları](../scripts/gorsel-varyantlari.mjs).

## Arama ve vitrin

Arama alanındaki metin hemen güncellenir. Önerilerin hesabında `useDeferredValue` kullanılır; yazı yazmak, sonuç listesinin hazırlanmasını beklemez. Enter’a basıldığında güncel metin esas alınır.

Vitrin kartları `memo` kullanır ve yalnızca gösterdikleri değerleri alır. Örneğin satıcının görünmeyen bir bilgisi değiştiğinde aynı başlık, fiyat ve fotoğrafı gösteren kartın yeniden çizilmesi gerekmez. Bileşenin ihtiyaç duyduğu veri dar tutularak gereksiz güncellemeler azaltılır.

İlgili dosyalar: [web arama alanı](../src/bilesenler/AramaCubugu.web.tsx), [vitrin](../src/bilesenler/VitrinIzgarasi.web.tsx).

## Harita ve karşılaştırma kayıtları

Leaflet ana uygulamanın ilk paketine eklenmez. Sabit sürümü kurulum ve derleme sırasında hazırlanır; harita belgesiyle birlikte aynı sunucudan yüklenir. Konum sekmesi açılmadan harita karoları indirilmez. Bir menüye odaklanmak veya üzerine gelmek, harita sunucusuna arka planda istek göndermez.

Karşılaştırmada büyük ilan nesneleri veya fotoğraflar saklanmaz. Hesap başına en fazla 20 son bakılan ilanın kimliği ve bakılma tarihi tutulur; 30 günden eski kayıtlar yeniden okunduğunda elenir. Bu geçmiş, diğer hesap verilerine dokunmadan cihaz verileri panelinden temizlenebilir.

İlgili dosyalar: [harita hazırlığı](../scripts/harita-kaynaklari.mjs), [konum veri yükleyicisi](../src/veri/haritaYukleyici.ts), [harita belgesi](../public/harita.html), [gezinti deposu](../src/durum/sonBakilanDeposu.ts).

## Önbellek ve dosya sürümleri

İçeriğe göre adlandırılan dosyalar uzun süre önbellekte tutulabilir. İçeriği değiştiğinde adresi de değişir; tarayıcı yeni dosyayı alır. Metro runtime gibi adı her derlemede değişmeyen bir dosyanın adresine ise içerik sürümü eklenir. Betik ve ön yükleme bağlantısı aynı dosyayı kullanır.

Tarayıcı güvenliği için gereken küçük başlangıç kodu HTML’in içindedir. Bunun için ayrı bir ağ isteğinin bitmesi beklenmez. Güvenlik başlıkları derleme çıktısıyla birlikte hazırlanır; uygulama ve harita belgesinin ihtiyaçları ayrı tanımlanır.

İlgili dosyalar: [HTML başlangıcı](../app/+html.tsx), [güvenlik başlıkları](../scripts/guvenlik-basliklari.mjs), [derleme](../scripts/derle.mjs).

## Kaynaklar

- [Expo: asenkron rotalar](https://docs.expo.dev/router/web/async-routes/)
- [web.dev: uzun görevler](https://web.dev/articles/optimize-long-tasks)
- [React: memo ve prop değişiklikleri](https://react.dev/reference/react/memo#minimizing-props-changes)
- [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [OpenStreetMap: karo kullanım politikası](https://operations.osmfoundation.org/policies/tiles/)
