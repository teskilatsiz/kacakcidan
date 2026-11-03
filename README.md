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

Kaçakçıdan, ikinci el ürünlerin yanında araç, emlak, iş ve hizmet ilanlarını da kapsayan bir pazar yeri arayüzü. Web, iOS ve Android için aynı kod tabanını kullanıyor.

Bu projede en çok ilan arama ve inceleme akışına odaklandım. Aranan modele birkaç seçimle ulaşmak, fiyatları karşılaştırırken iki sayfa arasında gidip gelmemek ve ürünün hangi bilgisinin eksik olduğunu görebilmek tasarım kararlarını belirledi. Küçük ekranlarda da aynı işleri rahatça yapabilmek için menülerin, formların ve ilan ayrıntılarının yerleşimi ekran boyutuna göre değişiyor.

## Kullanım

- Kategoriden alt kategoriye, marka ve modele ilerleme, yazarken arama önerileri ve ürüne uygun filtreler
- Aynı türdeki son bakılan ilanla fiyat ve özellik karşılaştırması, yalnızca farklı bilgileri gösterme
- Fotoğraf yakınlaştırma, video oynatma, favoriler, mesajlaşma ve ilan hakkında soru-cevap
- İlanın konumunu haritada görme ve toplam tutarı içeren satın alma özeti
- İki tarafın teslim onayıyla tamamlanan alışverişler, satıcı puanları, yorumlar ve satıcı yanıtları
- Bütçe ve konum belirterek alım talebi açma, uygun ilanları görme ve kendi ilanıyla yanıt verme
- Adımlı ilan oluşturma ve düzenleme, ilan yönetimi, profil ve hesap ayarları, açık ve koyu tema

## Kullanıcı deneyimi

Ana sayfada kategoriler ve vitrindeki ilanlar hemen görünür. Kategori seçtikçe alt seçenekler aynı menüde ilerler, seçim yolu görünür kalır. Arama alanı da kategori, marka, model ve anahtar kelime önerileriyle bu akışa katılır.

Masaüstünde ilan görselinin yanında fiyat, konum ve özellikler bulunur. Telefonda içerik tek sütuna geçer; özellikler, konum haritası ve sorular sekmelerden açılır. Satıcının puanı ve doğrulama özeti görünür kalır, uzun açıklamalar isteyen kullanıcı için açılır. Başka bir ilana bakıldığında aynı türdeki önceki ilanla karşılaştırma önerilir. Telefonda bu öneri kısa bir beklemenin ardından alt pencerede açılır. Karşılaştırmayı açıp yalnızca farkları görmek ya da öneriyi kapatıp ilana devam etmek kullanıcıya kalır.

Filtreler ürün türüne göre değişir. Telefonda pil sağlığı ve ekran durumu, bilgisayarda bellek ve donanım, mobilyada ölçüler için ayrı alanlar var. Yazılmamış bir bilgi sağlam ya da sorunsuz kabul edilmez. Değerlendirme kaydı olmadan satıcıya puan verilmez.

Satıcıyı değerlendirmek için alıcının teslim aldığını, satıcının da teslim ettiğini onaylaması gerekir. Her alışveriş için bir değerlendirme yazılabilir. Yorumu yazan kişi 14 gün içinde puanını ve yorumunu düzenleyebilir; satıcı yanıt verebilir. Satıcı kendi hakkındaki yorumu silemez. Profildeki ortalama ve değerlendirme sayısı, kayıtlı yorumlardan hesaplanır.

İlan formu kısa adımlara ayrılır, eksik bilgi ilgili alanın yanında belirtilir. Kaydı bulunan modellerde üretici belgesindeki sabit özellikler otomatik gelir ve değiştirilemez, depolama ve renk gibi seçenekleri ilan sahibi seçer. Kargoyla satılabilen ürünlerde paket boyutu ve hizmet bedeli, ilanı yayımlamadan önce hesaplanır. Uzun seçenek listelerinde arama yapılabilir, açılır menüler küçük ekranlarda pencereye dönüşür. Klavye açıldığında formun ve mesaj alanının görünür kalması için tarayıcının kullanılabilir yüksekliği takip edilir. Klavyeyle gezinme, odak göstergeleri ve pencere kapandığında önceki alana dönme ortak bileşenlerde düzenlenir.

## Performans

Görsellerin farklı ekran boyutlarına uygun WebP kopyaları derleme sırasında hazırlanır. İlk ekrandaki görsellere öncelik verilir, sayfanın aşağısındakiler ihtiyaç olduğunda yüklenir. Görsel alanları önceden ayrıldığı için fotoğraf yüklenirken kartların yerleşimi değişmez. Galeri önizlemeleri için de tam boy fotoğraflar indirilmez.

Web sayfaları önceden HTML olarak üretilir, ekran kodları ayrı parçalarda yüklenir. Harita ve menülerin ayrıntıları yalnızca açıldıklarında yüklenir. Arama sonucu hesaplamaları yazmayı bekletmeyecek şekilde ertelenir. Geçişler kısa tutulur ve cihazın azaltılmış hareket tercihi izlenir. Karşılaştırma geçmişinde en fazla 20 ilanın kimliği ve bakılma tarihi saklanır, fotoğrafları kopyalanmaz.

## Yerelde çalıştırma

Node.js `24.x` (en az `24.3.0`) ve npm gerekir.

```bash
npm ci
npm run web
```

Android için `npm run android`, iOS simülatörü için macOS ve Xcode üzerinde `npm run ios` komutunu kullanabilirsiniz. Web derlemesini üretmek ve yerelde görüntülemek için:

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
app/                    Expo Router yönlendirmeleri
src/bilesenler/         Ortak arayüz bileşenleri
src/ekranlar/           Uygulama ekranları
src/durum/              Uygulama ve cihazdaki kayıtların yönetimi
src/tasarim/            Tema ve ekran stilleri
src/veri/               Kategoriler, ilanlar ve filtre tanımları
public/                 Görseller, yazı tipleri ve diğer statik dosyalar
screenshots/            README ekran görüntüleri
```

## Veri saklama

Bu depo uygulamanın ön yüzünü içeriyor. Hesap, ilan, favori, mesaj, alım talebi ve değerlendirme kayıtları kullanıldıkları tarayıcıda veya cihazda saklanır. Alım talepleri ve teslim onayları aynı cihazda açılan başka bir hesapla yanıtlanabilir. Mesaj ekranındaki yazışmalar ise hesaba kaydedilir, karşı tarafa iletilmez. Kayıtlar başka cihazlara aktarılmaz. Merkezi üyelik, ödeme, kargo takibi ve bağımsız satıcı doğrulaması için sunucu hizmeti bulunmuyor.

Param Güvende akışı bir satın alma talebi oluşturur. Alıcı, kargo ve hizmet bedeli dahil toplam tutarı onaylamadan önce görür. Kart bilgisi veya ödeme alınmaz; tutar satıcıya aktarılmaz. Harita, seçilen ilçenin çevresini gösterir ve açık adres içermez.

Göz atma geçmişi hesaplara göre ayrılır, 30 günden eski kayıtlar kullanılmaz. Karşılaştırma penceresinden bu geçmiş temizlenebilir. Tarayıcı ya da uygulama verilerini temizlemek diğer yerel kayıtları da siler.

## Lisans

Kaynak kod [MIT lisansıyla](./LICENSE) yayımlanır. DM Sans yazı tipi kendi [OFL lisansına](./public/fonts/OFL.txt) tabidir.
