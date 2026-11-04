# Performans

## Kodun yüklenmesi

Web sayfalarının HTML'i derleme sırasında hazırlanır. İlan başlığı, kapak görseli ve temel içerik ilk yanıtta bulunur. JavaScript yüklendiğinde bu içerik etkileşimli hale gelir.

Ana kategori bağlantıları küçük bir yardımcıdan üretilir. Tam kategori ağacı, arama veya kategori menüsü ihtiyaç duyduğunda yüklenir. İstek bileşenler arasında paylaşılır; mevcut ilan önerileri kataloğu beklemez. Karşılaştırma içeriği de pencere açıldığında yüklenir.

İlk HTML'deki metaveri hazırdır. Uygulama içi gezinmede başlığı ve paylaşım bilgilerini değiştiren bileşen, gerektiğinde yüklenir.

İlgili dosyalar: [katalog yükleyicisi](../src/veri/kategoriKatalogu.ts), [ana kategori adresleri](../src/veri/anaKategoriAdresi.ts), [web sayfa başlığı](../src/bilesenler/SayfaBasligi.web.tsx), [karşılaştırma](../src/bilesenler/IlanKarsilastirmasi.tsx).

## Görseller

Derlemede fotoğrafların farklı genişlikte WebP kopyaları hazırlanır. Tarayıcı `srcset` ve `sizes` ile uygun dosyayı seçer. İlk ekrandaki vitrin görsellerine yükleme önceliği verilir; aşağıdaki görseller tembel yüklenir.

Fotoğrafların oranı ve kapladığı alan önceden ayrılır. Galeri önizlemelerinde tam boy fotoğraf indirilmez; büyük medya kullanıcı açtığında yüklenir. Görsellerin görünürlüğü ortak bir `IntersectionObserver` ile izlenir. İzlenecek öğe kalmadığında gözlemci kapatılır.

İlgili dosyalar: [web görsel bileşeni](../src/bilesenler/Gorsel.web.tsx), [görsel varyantları](../scripts/gorsel-varyantlari.mjs).

## Arama ve vitrin

Arama metni hemen güncellenir, önerilerin hesabında `useDeferredValue` kullanılır. Enter ile yapılan arama güncel metni esas alır.

Vitrin kartları `memo` kullanır ve yalnızca gösterdikleri değerleri alır. Böylece kartta görünmeyen bir ilan bilgisi değiştiğinde gereksiz çizim yapılmaz.

Web düğmelerinde hareket azaltma tercihini CSS yönetir. Her düğme için ayrı bir JavaScript aboneliği ve ilk yüklemede ek durum güncellemesi oluşturulmaz.

Ekran ölçüsü tek sağlayıcıda izlenir. Webdeki boyut güncellemeleri React geçişiyle yayılır; tarayıcı bu sırada giriş ve tıklamaları önce işleyebilir. İlk çizimin statik HTML ile aynı olması korunur.

İlgili dosyalar: [web arama alanı](../src/bilesenler/AramaCubugu.web.tsx), [vitrin](../src/bilesenler/VitrinIzgarasi.web.tsx).

## Harita ve yerel geçmiş

Leaflet ilk uygulama paketine eklenmez. Sabit sürümü kurulum ve derlemede hazırlanır; harita belgesiyle aynı sunucudan yüklenir. Konum sekmesi açılmadan harita karoları indirilmez.

Son bakılan ilanlar için fotoğraf veya bütün ilan nesnesi saklanmaz. Hesap başına en fazla 20 ilan kimliği ve bakılma tarihi tutulur. Otuz günden eski kayıtlar okunurken elenir. Geçmiş, diğer hesap kayıtlarına dokunmadan temizlenebilir.

İlgili dosyalar: [harita hazırlığı](../scripts/harita-kaynaklari.mjs), [harita yükleyicisi](../src/veri/haritaYukleyici.ts), [gezinti deposu](../src/durum/sonBakilanDeposu.ts).

## Önbellek

İçeriğe göre adlandırılan dosyalar uzun süre önbellekte tutulur. Dosyanın içeriği değiştiğinde adresi de değişir. Adı sabit kalan Metro çalışma zamanı dosyasının adresine içerik sürümü eklenir; betik ve ön yükleme bağlantısı aynı sürümü kullanır.

Başlangıçta gereken küçük güvenlik kodu HTML içindedir. Güvenlik başlıkları derleme çıktısına göre hazırlanır. Harita belgesi ve uygulama için izin verilen kaynaklar ayrı tanımlanır.

İlgili dosyalar: [HTML başlangıcı](../app/+html.tsx), [güvenlik başlıkları](../scripts/guvenlik-basliklari.mjs), [derleme](../scripts/derle.mjs).

## Kaynaklar

- [Expo: asenkron rotalar](https://docs.expo.dev/router/web/async-routes/)
- [React: memo ve prop değişiklikleri](https://react.dev/reference/react/memo#minimizing-props-changes)
- [React: startTransition](https://react.dev/reference/react/startTransition)
- [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: hareket azaltma tercihi](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [OpenStreetMap: karo kullanım politikası](https://operations.osmfoundation.org/policies/tiles/)
