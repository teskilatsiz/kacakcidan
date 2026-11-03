# Arayüz ve etkileşim

## Önce ilanlara ulaşmak

Ana sayfanın ilk işi kategori seçtirmek ve vitrindeki ilanları göstermek. Kategorileri uzun bir tanıtım alanının altına saklamadım. Her kartta görsel, başlık, fiyat ve konum var; ikincil bilgiler bunlarla yarışmıyor.

Kategori gezintisi bir seçim zinciri. Üst kategori değiştiğinde ona bağlı alt kategori, marka ve model seçimleri temizlenir. Kullanıcı seçtiği yolu görür ve doğrudan üst basamağa dönebilir. Listeyi başka bir yerde yeniden kurmak yerine aynı menünün içeriği değiştirilir. Uzun listelerde arama, dar ekranda kaydırılabilir pencere kullanılır.

Arama alanı yazılan metni hemen gösterir, öneri hesabı `useDeferredValue` ile geriden gelebilir. Böyle bir durumda Enter'a basmak eski öneriyi seçmez; güncel metinle arama yapar. Tam kategori ağacı henüz yüklenmediyse mevcut ilan önerileri çalışmaya devam eder. Ağ isteği başarısız olduğunda katalog sonraki açılışta yeniden denenebilir.

İlgili dosyalar: [IkonluKategoriler](../src/bilesenler/IkonluKategoriler.tsx), [web arama alanı](../src/bilesenler/AramaCubugu.web.tsx), [katalog yükleyicisi](../src/veri/kategoriKatalogu.ts), [keşif ekranı](../src/ekranlar/Kesfet.tsx).

## Telefon, tablet ve masaüstü

Yerleşimde iki ayrı karar var: içeriğin kaç sütun kullanacağı ve gezinmenin hangi biçimde görüneceği. Bunları tek bir “mobil mi?” değişkenine bağlamak, yatay tutulan tablette masaüstü başlığının sıkışmasına yol açıyordu.

Webde 700 px altı telefon düzeni. Kompakt gezinme 1100 px altında, birincil işaretçisi dokunmatik olan cihazlarda ise 1440 px altında kullanılır. Fare kullanan 1280 px masaüstü ile dokunmatik 1280 px tablet bu nedenle aynı gezinmeyi kullanmaz. Native tarafta yön değişikliğinde tutarlılık için kısa kenar da hesaba katılır. Bu eşikler cihaz adlarına değil, bu arayüzdeki içeriklerin sığdığı alana dayanıyor.

| Alan               | Telefon                       | Tablet                                      | Masaüstü                                     |
| ------------------ | ----------------------------- | ------------------------------------------- | -------------------------------------------- |
| Gezinme            | Kısa başlık ve alt çubuk      | Kısa başlık ve ortalanmış alt çubuk         | Arama ve hesap işlemleri başlıkta            |
| Ana kategoriler    | İki sütun                     | Dört sütun                                  | Yatay kategori alanı                         |
| İlan detayı        | Tek sütun, özellikler sekmede | Görsel ve özellikler yan yana, satıcı altta | Görsel, fiyat/özellikler ve satıcı sütunları |
| Elle karşılaştırma | Alt pencere                   | Alt pencere                                 | Ortalanmış pencere                           |
| Hesap kartı        | Tek sütun                     | Kimlik ve hesap işlemleri yan yana          | Sol yan panel                                |
| Hamburger menü     | Hesap önce, kategoriler sonra | Hesap ve kategoriler iki sütun              | Kompakt gezinme kullanılmıyor                |

Ekranın türü değişse de ana görevler ve içerik sırası korunur. Teknik özellikler masaüstünde fotoğrafın hemen sağında bulunur. Telefonda ayrı sekme kullanılması, sayfanın ilk bölümünü uzun bir özellik listesine çevirmeden fiyat ve iletişime ulaşmayı sağlar.

İlgili dosyalar: [ekran ölçüleri](../src/tasarim/tema.ts), [Kabuk](../src/bilesenler/Kabuk.tsx), [ilan yerleşimi](../src/tasarim/ilanDetayi.web.css), [Profil](../src/ekranlar/Profil.tsx).

## Kullanıcının yaptığı işi bölmemek

İlanın üstündeki Karşılaştır düğmesine her zaman ulaşılabilir. Açılan pencerede iki ilan yuvası bulunur; kullanıcı her iki yuvadaki seçimi de değiştirebilir. Aynı türdeki ilanların fiyat, konum ve özellikleri yan yana gösterilir. Telefon ve tablette alttan açılan pencere, masaüstünde ortalanmış pencere kullanılır.

Daha önce bakılmış uyumlu bir ilan varsa ayrıca karşılaştırma önerisi gösterilir. Telefonda ve tablette kısa bir beklemeden sonra açılır. Başka pencere açıkken, klavye kullanılırken veya bildirim görünürken otomatik öneri ertelenir. Kapatılan öneri aynı oturumda aynı ilan için tekrar açılmaz.

Masaüstündeki otomatik öneri şeridinin yüksekliği sabit varsayılmaz. Metin büyümesi veya satır kırılmasıyla değişen yükseklik ölçülür; bildirim bunun üzerinde boşluk bırakır. Kompakt ekranda alt çubuk, güvenli alan ve klavye de hesaba katılır.

Bir ilan yerel depodan okunurken “İlan bulunamadı” gösterilmez. Hazır katalog ilanı doğrudan görünür; henüz gelmeyen yerel kayıtta mevcut iskelet bileşeni kullanılır. Bulunamadı durumu ancak okuma tamamlandıktan sonra değerlendirilir. İskeletler çok kısa beklemelerde yanıp sönmemek için gecikmeli görünür.

İlgili dosyalar: [karşılaştırma](../src/bilesenler/IlanKarsilastirmasi.tsx), [web katmanı](../src/bilesenler/KarsilastirmaKatmani.web.tsx), [ilan detayı](../src/ekranlar/IlanDetayi.tsx), [iskeletler](../src/bilesenler/YuklemeIskeleti.tsx).

## Formlar ve klavye

İlan formunda kategori/model, medya, ilan bilgileri ve teslimat gibi ilişkili alanlar adımlara ayrılır. Geri gidildiğinde taslak korunur. Modelin üretici kaydındaki sabit özellikleri kullanıcıdan tekrar istenmez; kapasite veya renk gibi değişebilen seçenekler seçilebilir kalır. Ürün durumu yalnız İkinci el veya Sıfır olabilir. Eski kayıtlar okunurken bu modele dönüştürülür.

Telefon ve tutar alanları metin olarak tutulur; klavye türü ve giriş biçimi sayısal kullanıma göre ayarlanır. Böylece telefonun başındaki sıfır korunur. E-posta ve parola alanları otomatik doldurmayı destekler, form alanlarının adları/kimlikleri bulunur. Hata yalnız sayfanın başında değil, ilgili alanın yanında da gösterilir.

Webde `VisualViewport` görünür yüksekliği ve kaydırma ofsetini verir. Klavye açıldığında odaklanan alan görünür sınırların dışındaysa kaydırılır. Pencere içindeki bir alan için arka sayfa yerine pencerenin içeriği hareket eder. Görünür alan olayları kare başına bir ölçümde birleştirilir. Mesaj yazma alanı da bu ortak ölçüleri kullanır.

Native ekranlarda güvenli alan kenarları ve klavyeye göre boyutlanan içerik kullanılır. Android'in yeniden boyutlandırma davranışı uygulama yapılandırmasında açıkça seçilidir. Alt işlemler ve form içeriği, klavye ile sistem gezinme alanının üzerinde kalacak şekilde yerleşir.

İlgili dosyalar: [İlanVer](../src/ekranlar/IlanVer.tsx), [KlavyeOdagi](../src/bilesenler/KlavyeOdagi.web.tsx), [görünür alan](../src/tasarim/gorunurAlan.web.ts), [kök düzen](../app/_layout.tsx), [uygulama yapılandırması](../app.config.ts).

## Odak, hareket ve tema

Web pencereleri yerel `dialog` öğesini kullanır. Açılınca arka plan etkileşimden çıkar; Escape kapatır, odak açan kontrole döner. Sekmeler ve arama önerileri klavyeyle kullanılabilir. İkon düğmeleri görünen metinleri olmasa da erişilebilir ad taşır. Durum bilgisi yalnız renk veya ikonla anlatılmaz.

Tema renkleri ortak paletten gelir. Sarı işlem düğmesinin içeriği açık ve koyu temada koyu kalır. Animasyonlarda kısa opaklık ve dönüşüm geçişleri tercih edilir; azaltılmış hareket açıkken gereksiz hareket kaldırılır.

## Kaynaklar

- [React Native: useWindowDimensions](https://reactnative.dev/docs/usewindowdimensions)
- [Expo: klavye yönetimi](https://docs.expo.dev/guides/keyboard-handling/)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [MDN: pointer ortam sorgusu](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer)
- [Apple: sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)
- [Android: uyarlanabilir düzenler](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts)
