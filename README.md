<h1 align="center">Kaçakçıdan</h1>

<p align="center"><strong>Mal burada, pazarlık sende.</strong></p>

<p align="center">
  İkinci el ürünleri bulmayı, değerlendirmeyi ve satışa çıkarmayı kolaylaştırmak için geliştirdiğim kişiden kişiye (C2C) alışveriş arayüzü.
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

Masaüstü görünümünde beş sütunlu ilan ızgarası, mobilde kategori şeridi, iki sütunlu kartlar ve alt gezinme yer alıyor.

## Proje hakkında

Bu projede odağım, kullanıcıyı aradığı ilana kısa ve anlaşılır bir yoldan ulaştırmak. Kategori seçmekten satıcıya mesaj göndermeye ve ilan oluşturmaya kadar temel alışveriş akışlarını web, iOS ve Android ekranlarına uyarladım.

Arayüzü tasarlarken özellikle şu noktalara dikkat ettim:

- **Kategorilerde kaybolmamak:** Ana kategoriden alt kategoriye, markaya ve modele kadar seçimleri görünür ve anlaşılır bir sırada sunmak.
- **Aramayı yön bulma aracı olarak kullanmak:** Yazarken ilan başlıklarının yanı sıra anahtar kelime, kategori, marka ve model önerileri göstermek.
- **İlanı hızlı değerlendirmek:** Fiyatı, ürün durumunu, takas bilgisini, teknik özellikleri ve satıcıyla iletişimi kolay bulunur tutmak. Fotoğraf galerisi; küçük görseller, büyütme, yakınlaştırma ve video desteği içerir.
- **İlan vermeyi parçalara ayırmak:** Kategori ve ürüne göre değişen alanlar, seçim listeleri, fotoğraf ekleme ve önizleme ile kullanıcıya her adımda ne yapacağını göstermek.
- **Küçük ekranları gözetmek:** Menü, filtre, seçim alanı ve formları mobil ekrana göre düzenlemek; klavye açıldığında yazılan alanın görünür kalmasına dikkat etmek.
- **Etkileşimi anlaşılır kılmak:** Başarı ve hata bildirimleri, favori işlemleri ve hareket tercihleri için tutarlı geri bildirim kullanmak.

## Performans yaklaşımı

- İlk ekranda görünen ilan görsellerini önceliklendirip aşağıdaki görselleri ihtiyaç anına kadar erteliyorum.
- Görseller için yer ayırarak yükleme sırasında kart düzeninin sıçramasını önlüyorum; önbelleklemeden yararlanıyorum.
- Arama sonuçları ve ilan kartları gibi tekrar kullanılan alanlarda gereksiz yeniden hesaplama ve çizimleri azaltıyorum.
- Hareketleri kısa tutuyor, sistemde azaltılmış hareket tercihi açık olduğunda animasyonları sınırlıyorum.
- Aynı proje yapısını web, iOS ve Android’de kullanırken platforma özgü davranışları gereken bileşenlerde ayrı ele alıyorum.

## Öne çıkan akışlar

- Kategori, alt kategori, marka ve model üzerinden ilan keşfi
- Türkçe karakterlere uyumlu arama ve yazarken öneriler
- Kategoriye göre değişen teknik özellik filtreleri, fiyat ve konum seçimi
- İlan detayında fotoğraf galerisi, yakınlaştırma, video, özellikler ve satıcıya mesaj
- Adımlı ilan oluşturma ve mevcut ilanı düzenleme
- Hesap oluşturma, giriş, profil fotoğrafı, favoriler ve mesajlar

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

## Denetim komutları

```bash
npm run typecheck
npm run format:check
npm run doctor
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

Web ile yerel platformlarda farklı davranması gereken bileşenler `.web.tsx` uzantılı dosyalarda ayrılır.

## Veri saklama

Bu sürümde hesap, ilan, favori ve mesaj bilgileri cihazda saklanır. Webde seçilen fotoğraf ve videolar tarayıcının IndexedDB alanında tutulur. Sunucu tarafında hesap, uzaktan mesajlaşma veya ödeme altyapısı bu projeye dahil değildir.

## Lisans

Kaynak kod [MIT lisansıyla](./LICENSE) yayımlanır. DM Sans yazı tipi kendi [OFL lisansına](./public/fonts/OFL.txt) tabidir.
