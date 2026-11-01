<h1 align="center">Kaçakçıdan</h1>

<p align="center"><strong>Mal burada, pazarlık sende.</strong></p>

<p align="center">
  Expo, React Native ve TypeScript ile geliştirdiğim ikinci el alışveriş pazaryeri. Web, iOS ve Android için ortak kod tabanı.
</p>

<p align="center">
  <img alt="Expo SDK 58" src="https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white" />
  <img alt="React Native 0.88" src="https://img.shields.io/badge/React%20Native-0.88-20232A?logo=react&logoColor=61DAFB" />
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="Web, iOS ve Android" src="https://img.shields.io/badge/Platformlar-web%2C%20iOS%20ve%20Android-555" />
  <img alt="MIT lisansı" src="https://img.shields.io/badge/lisans-MIT-17191b" />
</p>

## Ekran görüntüleri

<p align="center">
  <img src="screenshots/anasayfa-masaustu.png" alt="Kaçakçıdan ana sayfasının masaüstü görünümü" width="71.5%" />
  <img src="screenshots/anasayfa-mobil.png" alt="Kaçakçıdan ana sayfasının mobil görünümü" width="25.2%" />
</p>

Masaüstü ana sayfasında beş sütunlu ilan ızgarası var. Mobilde yatay kategori şeridi, iki sütunlu ilan kartları ve alt gezinme yer alıyor. İlan arama ekranında ise masaüstü kategori ağacı ile sonuçlar yan yana açılıyor.

## Proje hakkında

Kaçakçıdan’ı geliştirirken en çok ilan arama ve ilan verme akışlarına zaman ayırdım. Bir telefona bakarken depolama kapasitesini bulmak, alt kategoriler arasında geri dönmek ya da klavye açıkken mesaj göndermek kolay olmalı. Ekran düzenini bu işler üzerinden kurdum.

Proje ön yüzü kapsıyor. Hesaplar ve ilan etkileşimlerine ait kayıtlar cihazda tutuluyor; veri saklama sınırlarını aşağıda ayrıca anlattım.

## Kullanıcı deneyimi için verdiğim kararlar

### Kategoriye ulaşmak

Ana sayfada kategoriler ve ilanlar doğrudan görünüyor. İlk kategori şeridini kısa tuttum, kalan kategoriler “Daha fazla” ile açılıyor. Yatay kaydırılabilen alanların kenarındaki gölge, devamında içerik olduğunu gösteriyor.

Kategori seçildiğinde o seviyenin alt kategorileri açılıyor. Seçilen yol görünür kalıyor, kullanıcı üst seviyeye dönebiliyor. Bu yapı mobilde de ilanların üzerinde bulunuyor; alt kategoriye ulaşmak için filtre penceresini açmak gerekmiyor. Marka ve model seçimleri kategoriye bağlı. Telefon için seçilen marka, mobilyaya geçildiğinde taşınmıyor.

### Arama ve filtreler

Yazarken ilan, anahtar kelime ve kategori önerileri çıkıyor. Arama Türkçe karakterleri, marka ve model adlarını da dikkate alıyor. Klavyeyle öneriler arasında ilerlemek ve aramayı Enter ile göndermek mümkün.

Teknik özellikleri kategoriye göre tanımladım. Telefonda depolama ve ekran bilgileri, araçta yakıt ve vites, giyimde beden gibi ilgili alanlar gösteriliyor. İl ve ilçe birbirine bağlı seçim listeleri kullanıyor. Uygulanan filtreler sonuçların üstünde görülebiliyor ve tek tek kaldırılabiliyor.

### İlanı değerlendirmek

İlan detayında fiyat, ürün durumu ve satıcıya ulaşma eylemi ilk bakışta bulunabiliyor. Fotoğraf alanını açıklama ve özellikleri aşağı itecek kadar büyük tutmadım. Küçük görsellerle fotoğraf değiştirmek, galeriyi tam ekranda açıp yakınlaştırmak ve video izlemek mümkün. Mobilde fiyat ile mesaj düğmesi alt gezinmenin hemen üzerinde kalıyor.

Mesajlaşmanın yanında ilana soru sorma alanı var. İlan sahibi yanıt verebiliyor, yanıtın herkese görünmesini ya da gizlenmesini seçebiliyor. Soru ve yanıt bildirimleri doğrudan ilgili ilana götürüyor. İlan numarası düzenlemede korunuyor, görüntülenme ve favori sayıları ise sahibinin ilan yönetiminde gösteriliyor.

### Formları tamamlamak

İlan oluşturma ve düzenleme aynı adımlı formu kullanıyor. Kategori seçimine göre alanlar değişiyor, önceki adımlara dönüldüğünde girilen bilgiler korunuyor. Hesap oluşturma da kısa adımlara ayrılmış durumda. Hatalar ilgili alanın yanında gösteriliyor.

Mobil tarayıcıda klavyenin açılması ekran yüksekliğini değiştiriyor. Formlarda ve mesaj kutusunda görünen ekran alanını takip ediyor, yazılan alanın görünür kalması için kaydırmayı ayarlıyorum. Yerel uygulamada iOS ve Android’in klavye davranışlarını ayrı ele aldım. Seçim pencereleri de kullanılabilir yüksekliğe göre boyutlanıyor.

### Hesap ve görünüm

Hesap bilgileri mobil menünün en üstünde. Profilde ilan yönetimi, ayarlarda profil bilgileri ve hesap tercihleri bulunuyor. Profil fotoğrafı eklenebiliyor, e-posta adresi profil kartında gösterilmiyor. Favoriye eklemek ve soru göndermek giriş gerektiriyor.

Açık ve koyu temalar ortak renk tanımlarıyla çalışıyor. Sistem görünümünü izlemek veya ayrı tercih kaydetmek mümkün. Sarı düğmelerde yazı ve simge rengi iki temada da koyu. Odak göstergeleri, klavyeyle gezinme ve sistemin azaltılmış hareket tercihi ortak bileşenlerde ele alınıyor.

## Performans yaklaşımı

Performans tarafında görsel yükleme, arama sırasında yapılan hesaplamalar ve ekran hareketleri üzerinde durdum.

| Alan               | Uygulama                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| İlan görselleri    | İlk görünen görseller öncelikli, aşağıdaki görseller gecikmeli yükleniyor. Kartlarda en boy oranı baştan ayrılıyor. Yerel uygulamada bellek ve disk önbelleği kullanılıyor.                                     |
| Galeri ve video    | Galeride yakın görseller önceden hazırlanıyor. Video seçilene kadar oynatıcı ekrana eklenmiyor, küçük görsel olarak ayrı bir kapak kullanılıyor. Görsel değişince video durduruluyor.                           |
| Arama ve sonuçlar  | Öneriler ve filtre sonuçları bağımlılıklarına göre hesaplanıyor. Sonuç ekranında sorgu `useDeferredValue` ile erteleniyor, ilan kartları `memo` kullanıyor.                                                     |
| Kaydırma ve klavye | Tarayıcıdaki görünür alan değişiklikleri `requestAnimationFrame` ile birleştiriliyor. Kategori şeridi, kenar gölgesi değişmediği sürece her kaydırma olayında yeniden çizilmiyor.                               |
| Hareket ve yükleme | Geçişler kısa, animasyonlar ağırlıklı olarak saydamlık ve dönüşüm üzerinden çalışıyor. Bekleyen içerik kendi düzenine uygun yükleme iskeletiyle gösteriliyor. Azaltılmış hareket açıkken iskelet sabit kalıyor. |

Webde tarayıcının kendi iletişim kutusu ve açılır pencere davranışlarından yararlanıyorum. Yerel uygulamada aynı işi React Native bileşenleri üstleniyor. Bu ayrım, tek bileşene bütün platformların davranışlarını yüklememeyi sağlıyor.

## Yerelde çalıştırma

Node.js `24.3` veya üzeri `24.x` ve npm gerekir. Sürüm yöneticisi olarak `nvm` kullanıyorsan proje sürümünü `.nvmrc` dosyasından seçebilirsin.

```bash
npm ci
npm run web
```

Expo geliştirme sunucusunu açmak için `npm start`; Android simülatöründe çalıştırmak için `npm run android` kullan. iOS simülatörü için macOS ve Xcode gerekir:

```bash
npm run ios
```

Web çıktısını üretip yerelde görüntülemek için:

```bash
npm run build
npm run preview
```

## Kontroller

```bash
npm run check
npm run format:check
npm run build
```

## Proje yapısı

```text
app/                    Expo Router sayfaları
src/
  bilesenler/           Arama, kategori ağacı, ilan kartı, galeri ve ortak kontroller
  ekranlar/             Uygulama ekranları
  durum/                Hesap, pazar durumu ve medya saklama
  tasarim/              Tema, ekran ölçüleri ve hareket tercihleri
  veri/                 İlanlar, kategoriler, konumlar ve arama
public/                 Uygulama görselleri, fontlar ve video
screenshots/            README’de kullanılan masaüstü ve mobil görüntüler
scripts/                Web derleme araçları
```

Webe özgü bileşenler `.web.tsx` uzantısıyla ayrılıyor. Kategori ağacı ve teknik özellik tanımları, arama ile ilan formunun kullandığı ortak veri yapılarında tutuluyor.

## Veri saklama

Hesap, ilan, favori, mesaj, soru-cevap ve bildirim kayıtları cihazda saklanıyor. Webde seçilen fotoğraf ve videolar IndexedDB’de tutuluyor. Yerel uygulamada seçicinin verdiği dosya adresleri kaydediliyor, dosyalar ayrı bir kalıcı dizine kopyalanmıyor. İlan numaraları ve istatistikler de bu kayıtlar üzerinden çalışıyor.

Farklı cihazlar arasında hesap eşitleme, gerçek zamanlı uzaktan mesajlaşma ve ödeme için sunucu bağlantısı gerekiyor. Bu depoda sunucu uygulaması bulunmuyor. Tarayıcı veya uygulama verilerini temizlemek yerel kayıtları da siliyor.

## Lisans

Kaynak kod [MIT lisansıyla](./LICENSE) yayımlanır. DM Sans yazı tipi kendi [OFL lisansına](./public/fonts/OFL.txt) tabidir.
