<h1 align="center">Kaçakçıdan</h1>

<p align="center"><strong>İkinci el online ilan ve alışveriş sitesi</strong></p>

<p align="center">
  Expo, React Native ve TypeScript ile web, iOS ve Android için geliştirildi.
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
  <img src="screenshots/anasayfa-karsilastirma.png" alt="Kaçakçıdan ana sayfasının masaüstü ve mobil görünümleri yan yana" width="100%" />
</p>

## Proje

Kaçakçıdan; ikinci el ürün, araç, emlak, iş ve hizmet ilanları için geliştirdiğim bir pazar yeri arayüzü. Aynı kod tabanı web, iOS ve Android ekranlarını içeriyor.

Projede kategori içinde kaybolmadan modele ulaşmaya, iki ilanın farkını kolayca görmeye ve küçük ekranda form doldurabilmeye odaklandım. Ekranları tasarlarken geri dönüşleri, boş sonuçları, uzun metinleri ve klavye açıldığında kalan alanı da hesaba kattım.

## Neler yapılabiliyor?

- Kategori, alt kategori, marka ve model üzerinden ilan arama; yazarken öneriler ve ürüne göre değişen teknik filtreler
- İlan fotoğraflarını büyütme, video izleme, konumu haritada görme ve benzer ilanları karşılaştırma
- Favoriler, mesajlaşma, ilan soruları ve cevapları, hesap bildirimleri
- Adımlı ilan oluşturma ve düzenleme; fotoğraf, teslimat, fiyat ve teknik özellik seçimi
- Profil ve hesap ayarları; ilan yönetimi, görüntülenme ve favori sayıları
- Teslim onaylarıyla ilerleyen alışveriş talepleri, satıcı değerlendirmeleri ve yorumlara yanıt verme
- Bütçe ve konumla alım talebi açma, uygun bir ilanla talebe yanıt verme
- Açık, koyu ve sistem teması; alışveriş yazıları ve gizlilik bilgileri

## Arayüz kararları

Ana sayfada arama, kategoriler ve vitrin doğrudan görünür. Kategori seçildiğinde alt seçenekler aynı menüde ilerler; seçimin yolu kaybolmaz. Filtreler de ilan türüne göre değişir. Bir telefonla bir koltuk için aynı özellikleri sormak yerine ilgili alanlar gösterilir. Kaydı bulunan modellerin sabit üretici bilgileri otomatik gelir; renk, kapasite ve kullanım bilgilerini ilan sahibi seçer.

Masaüstünde görselin sağında fiyat, konum ve teknik özellikler bulunur. Tablet iki sütun kullanır; satıcı ve iletişim alanı altta yer alır. Telefonda içerik tek sütuna geçer, özellikler sekmeden açılır. Karşılaştır düğmesinden iki ilan seçilebilir, seçimler aynı pencere içinde değiştirilebilir. Karşılaştırma telefon ve tablette alttan açılır; masaüstünde ekranın ortasında gösterilir.

Hesap ve menü düzeni de kullanılabilir alana göre değişir. Tablet menüsünde hesap işlemleriyle kategoriler yan yanadır. Uzun adlar ve konumlar kendi alanında kalır; ana işlemler küçük ekranlarda erişilebilir olmaya devam eder. Sarı, işlem vurgusu için kullanılır; durum bilgileri yalnızca renkle anlatılmaz.

Formlar kısa adımlara ayrılır. Eksik bilgi ilgili alanın yanında gösterilir, önceki adıma dönünce girilen değerler korunur. Webde klavye açıldığında görünür alan izlenir; odaklanan alan gerekirse kaydırılır. Native tarafta klavye ve güvenli alan bileşenleri kullanılır. Açılır pencerelerde odak yönetimi, Escape ile kapatma ve açan kontrole geri dönme ortak bileşenlerde çözülür. Sistem hareket azaltma tercihi animasyonlara da uygulanır.

## Yükleme ve performans

Web sayfaları derleme sırasında HTML olarak üretilir. Ana sayfanın görünmesi tüm ekran kodlarının indirilmesini beklemez; tam kategori ağacı, harita ve ilgili ekranların kodları ihtiyaç olduğunda yüklenir. Arama önerileri hesaplanırken yazı alanının yanıt vermesi öncelikli tutulur.

Görsellerin farklı genişlikte WebP kopyaları hazırlanır. İlk ekrandaki ilan görsellerine yükleme önceliği verilir; aşağıdaki görseller tarayıcının tembel yüklemesini kullanır. Fotoğrafların alanı önceden ayrılır, önizlemeler için büyük fotoğraf indirilmez. Görsel görünürlüğü tek gözlemciyle takip edilir. Vitrin kartları da yalnızca kullandıkları değerleri alır; ilanın görünmeyen bir bilgisi değişince kart tekrar çizilmez.

Harita kütüphanesi uygulamanın ilk JavaScript paketine girmez. Harita açılınca aynı sunucudan yüklenir; harita karoları önceden indirilmez. Karşılaştırma geçmişinde fotoğraflar yerine en fazla 20 ilanın kimliği ve bakılma tarihi saklanır. Yükleme, boş sonuç ve hata durumları ayrı ele alınır: cihazdaki bir ilan okunurken kaybolmuş gibi gösterilmez.

Yerleşim, veri akışı ve performans kararları [geliştirme notlarında](./documentation/README.md) açıklanıyor. Notlardan ilgili kaynak dosyalarına da ulaşılabilir.

## Yerelde çalıştırma

Node.js `24.x` (en az `24.3.0`) ve npm gerekir.

```bash
npm ci
npm run web
```

Android için `npm run android`, iOS simülatörü için macOS ve Xcode üzerinde `npm run ios` kullanılabilir. Web çıktısını üretip yerelde açmak için:

```bash
npm run build
npm run preview
```

## Kod denetimi

```bash
npm run check
npm run format:check
```

## Proje yapısı

```text
app/                    Expo Router sayfaları ve yönlendirmeler
src/bilesenler/         Ortak arayüz bileşenleri ve platform sürümleri
src/ekranlar/           Ekranların içerikleri ve etkileşimleri
src/durum/              Hesap, ilan ve cihazdaki kayıtların yönetimi
src/tasarim/            Tema, yerleşim, klavye ve hareket davranışları
src/veri/               Kategoriler, ilanlar ve özellik tanımları
public/                 Görseller, yazı tipleri ve harita dosyaları
scripts/                Web çıktısını hazırlayan derleme adımları
documentation/          Arayüz, uygulama yapısı ve performans notları
screenshots/            README ekran görüntüleri
```

## Veri ve hizmet sınırları

Bu depo uygulamanın ön yüzünü içeriyor. Hesap, ilan, favori, mesaj, alım talebi ve değerlendirme kayıtları kullanıldıkları tarayıcıda veya cihazda saklanır. Başka cihazlara aktarılmaz. Alım talepleri ve teslim onayları aynı cihazdaki başka bir hesapla yanıtlanabilir; mesajlar ise karşı tarafa iletilmez.

Param Güvende akışı satın alma talebi ve tutar özeti oluşturur. Kart bilgisi veya ödeme alınmaz, satıcıya para aktarılmaz. Merkezi üyelik, ödeme, kargo takibi ve bağımsız satıcı doğrulaması için sunucu hizmeti bulunmuyor. Harita açık adres yerine seçilen ilçe çevresini gösterir.

Satıcı puanları kayıtlı yorumlardan hesaplanır. Yorum yazmak için alışverişin iki tarafça teslim edilmiş olması gerekir; her alışveriş için bir değerlendirme yapılabilir. Satıcı kendisi hakkındaki yorumu silemez. Göz atma geçmişi hesaplara göre ayrılır, 30 günden eski kayıtlar kullanılmaz. Tarayıcı veya uygulama verilerini temizlemek diğer yerel kayıtları da siler.

## Lisans

Kaynak kod [MIT lisansıyla](./LICENSE) yayımlanır. DM Sans yazı tipi kendi [OFL lisansına](./public/fonts/OFL.txt) tabidir.
