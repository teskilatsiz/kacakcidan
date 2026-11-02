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

Kaçakçıdan; ikinci el ürün, araç, emlak, iş ve hizmet ilanlarını bir araya getiren bir pazar yeri arayüzüdür. Kategori ve arama üzerinden ilanlara ulaşabilir, ayrıntıları inceleyebilir ve ilan sahibiyle iletişim kurabilirsiniz.

İlan ararken kategori içinde kaybolmamak, iki ürünün farkını görebilmek ve eksik bir bilgiyi fark etmek benim için tasarımın temel parçaları. Sayfaları, menüleri ve formları bu işlerin etrafında düzenledim.

## Kullanım

- Kategori, alt kategori, marka ve model seçimi; arama önerileri ve ürün türüne uygun filtreler
- Son bakılan aynı türdeki ilanla fiyat ve özellik karşılaştırması; yalnızca farkları görme
- Fotoğraf ve video galerisi, favoriler, mesajlar ve ilan hakkında soru-cevap
- Ürüne göre durum bilgileri, ilgili bilgiye fotoğraf ekleme ve satıcı beyanını inceleme
- Bütçeyle alım talebi oluşturma, uygun ilanları görme ve kendi ilanıyla yanıt verme
- Adımlı ilan oluşturma ve düzenleme; profil, hesap ayarları, açık ve koyu tema

## Kullanıcı deneyimi

Masaüstünde ilan görseli, fiyat ve özellikler yan yana durur. Telefonda içerik tek sütuna geçer; özellikler ve sorular sekmelerden açılır. Aynı ürün türündeki başka bir ilana bakıldığında önceki ilanla karşılaştırma önerilir. Pencere kendiliğinden açılmaz; kullanıcı ilanı incelemeye devam edebilir.

Filtreler seçilen ürüne göre değişir. Telefonda pil sağlığı ve ekran değişimi, bilgisayarda batarya ve donanım, mobilyada ölçüler ve kusurlar ayrı alanlardır. Bilgi yazılmamışsa sağlam ya da sorunsuz kabul edilmez. Satıcının yazdığı bilgiyle eklediği fotoğraf da bağımsız doğrulamadan ayrı tutulur. Gerçek değerlendirme kaydı olmadan satıcı puanı gösterilmez.

Formlar kısa adımlara bölünür. Açılır menüler küçük ekranlarda pencere olarak açılır; klavye açıldığında odaktaki alan görünür tutulur. Dokunma alanları, klavyeyle gezinme, pencereyi kapatma ve kapatınca önceki odağa dönme ortak bileşenlerde ele alınır.

## Performans

İlan görsellerinin farklı ekran boyutlarına uygun WebP kopyaları derleme sırasında hazırlanır. İlk ekranda görünen görsellere öncelik verilir; uzaktakiler gecikmeli yüklenir. Galeri önizlemeleri ve paylaşım görselleri ayrı boyutlarda tutulur.

Web sayfaları önceden HTML olarak üretilir. Ekran kodları parçalara ayrılır; arama sonuçları yazma sırasında ertelenerek hesaplanır. Animasyonlar kısa tutulur ve cihazın azaltılmış hareket tercihi izlenir. Karşılaştırma geçmişi en fazla 20 ilan kimliği ve tarihinden oluşur; fotoğraflar bu kayda kopyalanmaz.

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

Bu depoda sunucu bağlantısı bulunmuyor. Hesap, ilan, favori, mesaj ve alım talebi kayıtları kullanıldıkları tarayıcıda veya cihazda saklanır; cihazlar arasında eşitlenmez. Alım taleplerine aynı cihazdaki başka bir hesapla yanıt verilebilir. Ödeme, kargo takibi, kimlik doğrulama ve doğrulanmış satış altyapısı yoktur.

Göz atma geçmişi hesaplara göre ayrılır, 30 günden eski kayıtlar kullanılmaz ve karşılaştırma penceresinden temizlenebilir. Tarayıcı ya da uygulama verilerini temizlemek diğer yerel kayıtları da siler.

## Lisans

Kaynak kod [MIT lisansıyla](./LICENSE) yayımlanır. DM Sans yazı tipi kendi [OFL lisansına](./public/fonts/OFL.txt) tabidir.
