# Arayüz ve etkileşim

## Arama ve kategori gezintisi

Ana sayfada arama, kategoriler ve vitrin doğrudan görünür. İlan kartlarında görsel, başlık, fiyat ve konum öne çıkar.

Kategori seçimi aynı menü içinde ilerler. Seçilen yol görünür kalır; üst basamağa doğrudan dönülebilir. Üst kategori değiştiğinde ona bağlı alt kategori, marka ve model seçimleri temizlenir. Uzun listelerde arama, dar ekranda kaydırma kullanılır.

Arama metni hemen güncellenir, öneriler `useDeferredValue` ile hazırlanır. Enter'a basıldığında güncel metinle arama yapılır. Kategori ağacı henüz yüklenmediyse mevcut ilan önerileri kullanılabilir; başarısız katalog isteği sonraki açılışta yeniden denenir.

İlgili dosyalar: [kategori menüsü](../src/bilesenler/IkonluKategoriler.tsx), [web arama alanı](../src/bilesenler/AramaCubugu.web.tsx), [keşif ekranı](../src/ekranlar/Kesfet.tsx).

## Ekran düzenleri

İçeriğin sütun sayısı ile gezinme düzeni ayrı belirlenir. Webde 700 px altı telefon düzenini kullanır. Kompakt başlık ve alt gezinme 1100 px altında, dokunmatik cihazlarda ise 1440 px altında görünür. Native tarafta ekranın kısa kenarı da hesaba katılır.

| Alan           | Telefon                       | Tablet                                      | Masaüstü                               |
| -------------- | ----------------------------- | ------------------------------------------- | -------------------------------------- |
| Gezinme        | Kısa başlık ve alt çubuk      | Kısa başlık ve alt çubuk                    | Arama ve hesap işlemleri başlıkta      |
| İlan detayı    | Tek sütun, özellikler sekmede | Görsel ve özellikler yan yana, satıcı altta | Görsel, özellikler ve satıcı sütunları |
| Karşılaştırma  | Alttan açılan pencere         | Alttan açılan pencere                       | Ortalanmış pencere                     |
| Profil         | Tek sütun                     | Kimlik ve hesap işlemleri yan yana          | Hesap bilgileri sol panelde            |
| Hamburger menü | Hesap önce, kategoriler sonra | Hesap ve kategoriler iki sütun              | Kompakt gezinmede görünür              |

Uzun adlar ve konumlar kendi alanları içinde kırılır. Dar ekranda işlem düğmeleri, alt gezinme ve cihazın güvenli alanı birlikte hesaplanır.

İlgili dosyalar: [ekran ölçüleri](../src/tasarim/tema.ts), [Kabuk](../src/bilesenler/Kabuk.tsx), [ilan yerleşimi](../src/tasarim/ilanDetayi.web.css), [Profil](../src/ekranlar/Profil.tsx).

## Karşılaştırma ve yükleme durumları

İlan sayfasındaki Karşılaştır düğmesi her ekran boyutunda görünür. Pencerede iki ilan ayrı ayrı seçilebilir, değiştirilebilir veya çıkarılabilir. Seçim listesinde aynı ürün türündeki favoriler önce gelir; ardından model, marka ve fiyat yakınlığına göre diğer ilanlar sıralanır. Favoriler ayrıca süzülebilir. Diğer alana eklenen ilan listeden çıkarılır; yayından kaldırılmış ilanlar gösterilmez.

Aynı türdeki ilanların fiyatı, konumu ve teknik özellikleri yan yana gösterilir. Bilgisayar parçalarında işlemci ve bellek gibi farklı türler ayrılır; telefonlarda farklı marka ve modeller karşılaştırılabilir. Yalnızca farkları göster seçeneği ortak özellikleri gizler. Webde sütun başlıkları kaydırma sırasında görünür kalır. İlanın görseli ve bilgileri kendi sayfasına bağlantıdır; seçim değiştirme işlemi ayrı düğmededir.

Daha önce bakılmış uyumlu bir ilan varsa karşılaştırma önerisi gösterilebilir. Başka pencere açıkken, klavye kullanılırken veya bildirim görünürken otomatik öneri ertelenir. Kapatılan öneri aynı oturumda aynı ilan için tekrar açılmaz. Masaüstündeki öneri şeridinin yüksekliği ölçülür; bildirimler bunun üzerinde yer alır.

Cihazdaki bir ilan okunurken bulunamadı ekranı gösterilmez. Kayıt hazır olduğunda içerik, okuma tamamlanıp kayıt bulunamadığında hata durumu gösterilir. Kısa beklemelerde iskeletin yanıp sönmemesi için görünmesi geciktirilir.

İlgili dosyalar: [karşılaştırma](../src/bilesenler/IlanKarsilastirmasi.tsx), [karşılaştırma içeriği](../src/bilesenler/KarsilastirmaIcerigi.tsx), [ilan detayı](../src/ekranlar/IlanDetayi.tsx), [yükleme iskeletleri](../src/bilesenler/YuklemeIskeleti.tsx).

## Formlar ve klavye

İlan formu kategori, medya, ilan bilgileri ve teslimat adımlarına ayrılır. Geri dönüldüğünde taslak korunur. Model kaydındaki sabit özellikler otomatik gelir; renk ve kapasite gibi seçenekler kullanıcı tarafından seçilir. Ürün durumu İkinci el veya Sıfır olabilir.

Telefon ve tutar alanları metin olarak tutulur. Klavye türü girişe göre seçilir; telefonun başındaki sıfır korunur. Alanların adları ve kimlikleri bulunur, uygun yerlerde otomatik doldurma kullanılır. Hatalar ilgili alanın yanında gösterilir.

Webde `VisualViewport` ile görünür alan izlenir. Odaklanan giriş bu alanın dışında kalırsa ilgili sayfa veya pencere içeriği kaydırılır. Ölçümler kare başına bir kez yapılır. Mesaj yazma alanı da aynı görünür alan bilgisini kullanır.

Native ekranlarda klavye ve güvenli alan bileşenleri kullanılır. Android'de klavye açılınca ekranın yeniden boyutlandırılması uygulama yapılandırmasında seçilidir.

İlgili dosyalar: [ilan formu](../src/ekranlar/IlanVer.tsx), [web klavye odağı](../src/bilesenler/KlavyeOdagi.web.tsx), [görünür alan](../src/tasarim/gorunurAlan.web.ts), [uygulama yapılandırması](../app.config.ts).

## Odak, hareket ve tema

Web pencereleri `dialog` öğesini kullanır. Açıldığında arka plan etkileşimden çıkar; Escape pencereyi kapatır, odak açan kontrole döner. Sekmeler ve arama önerileri klavyeyle kullanılabilir. Yalnız ikon gösteren düğmelerin erişilebilir adları vardır.

Renkler ortak paletten gelir. Sarı işlem düğmelerinde metin ve ikonlar açık ve koyu temada koyu kalır. Durum bilgileri yalnız renkle anlatılmaz. Hareketlerde kısa opaklık ve dönüşüm geçişleri kullanılır; sistemin hareket azaltma tercihi izlenir.

## Kaynaklar

- [React Native: useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions)
- [Expo: klavye yönetimi](https://docs.expo.dev/guides/keyboard-handling/)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [Apple: sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)
- [Android: uyarlanabilir düzenler](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts)
