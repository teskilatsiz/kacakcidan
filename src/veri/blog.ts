import type { BilgiBolumu } from './bilgiSayfalari';

export type BlogYazisi = {
  yol: string;
  baslik: string;
  konu: string;
  ozet: string;
  bolumler: BilgiBolumu[];
  kaynaklar: { ad: string; adres: string }[];
};

export const blogBasligi = 'Alışveriş rehberi | Kaçakçıdan';
export const blogAciklamasi =
  'İkinci el telefon alırken kontrol edilecekler, anlaşılır ilan hazırlama ve güvenli iletişim üzerine kısa rehberler.';

export const blogYazilari: BlogYazisi[] = [
  {
    yol: 'ikinci-el-telefon-kontrol-listesi',
    baslik: 'İkinci el telefon almadan önce neye bakmalı?',
    konu: 'Telefon',
    ozet: 'Kasanın temiz görünmesi tek başına yeterli değil. Hesap kilidini, ekranı, pili ve bağlantıları teslimden önce kontrol et.',
    bolumler: [
      {
        baslik: 'Önce cihazın kendisini kontrol et',
        paragraflar: [
          'İlandaki model ve depolama bilgilerini telefonun ayarlarıyla karşılaştır. Kılıfı çıkarıp çerçeveye, arka kapağa ve şarj girişine bak. Fotoğrafta görünmeyen bir darbe veya çatlak varsa nedenini sor. Fatura ya da servis belgesi gösteriliyorsa modelin bu cihazla eşleştiğini kontrol et; belgeyi herkese açık bir mesajda paylaşma.',
          'Ekranın farklı yerlerine dokun, kameraları dene, kısa bir ses kaydı yapıp dinle. Hoparlörü, mikrofonu, tuşları, şarjı, Wi-Fi bağlantısını ve kendi hattınla arama yapmayı kontrol et. Satıcı cihazı açamıyor ya da kontrol etmene izin vermiyorsa ödeme yapma.',
        ],
      },
      {
        baslik: 'Hesap kilidini sonraya bırakma',
        paragraflar: [
          'iPhone’da Etkinleştirme Kilidi açıkken alışverişi tamamlama. Önceki sahibin hesabından çıkarma işlemi teslim sırasında tamamlanmalı. Başlangıç ekranını görmek, cihazın senin hesabınla kurulabileceğini tek başına göstermez.',
          'Android telefonda da sıfırlama sonrası eski hesabın doğrulanması gerekebilir. Satıcı gerekli hesap işlemlerini kendi yapsın; senden kendi parolanı veya tek kullanımlık kodunu istemesin. Modelin üretici destek sayfasındaki teslim ve sıfırlama adımlarını birlikte kontrol edebilirsiniz.',
        ],
      },
      {
        baslik: 'Pili ve değişen parçaları sor',
        paragraflar: [
          'Destekleyen iPhone modellerinde pil sağlığını ve Ayarlar içindeki parça ve servis geçmişini incele. Bu ekranın kapsamı modele ve yazılım sürümüne göre değişir. Bir pil yüzdesi veya servis kaydı, cihazın bütün parçalarının sorunsuz olduğu anlamına gelmez.',
          'Satıcıya onarım görüp görmediğini, değişen parçayı ve kalan garantiyi açıkça sor. Bütçeyi yalnızca ilan fiyatına göre kurma; yakında pil veya ekran değişimi gerekecekse bunun maliyetini de düşün. Emin olmadığın cihazı teslimden önce yetkin bir servise göstermek daha iyi bir karar olabilir.',
        ],
      },
    ],
    kaynaklar: [
      {
        ad: 'Apple: İkinci el bir iPhone satın almak istiyorsanız',
        adres: 'https://support.apple.com/tr-tr/104999',
      },
      {
        ad: 'Google: Android cihazı fabrika ayarlarına sıfırlama',
        adres: 'https://support.google.com/android/answer/6088915?hl=tr',
      },
    ],
  },
  {
    yol: 'anlasilir-bir-ilan-hazirlama',
    baslik: 'Aynı soruları azaltan bir ilan nasıl hazırlanır?',
    konu: 'İlan verme',
    ozet: 'Doğru kategori, açık bir başlık ve kusurları gösteren fotoğraflar, alıcının neye baktığını anlamasını kolaylaştırır.',
    bolumler: [
      {
        baslik: 'Alıcının arayacağı bilgiyi başlığa yaz',
        paragraflar: [
          '“Temiz, kaçırılmayacak fırsat” yerine marka, model ve ayırt edici özelliği yaz. Telefon için depolama, bisiklet için kadro ölçüsü, mobilya için boyut işe yarar. Başlıkta söylemediğin ayrıntıları teknik alanlara ve açıklamaya bırak.',
          'Kategoriyi mümkün olan en uygun alt başlığa kadar seç. Bir dizüstü bilgisayar, bilgisayar aksesuarları arasında kaybolmasın. Otomatik doldurulan özellikleri kontrol et; değişebilen bir ayrıntıyı yalnızca model adına bakarak doğru kabul etme.',
        ],
      },
      {
        baslik: 'Fotoğraflar ürünü anlatmalı',
        paragraflar: [
          'İlk fotoğrafta satılan ürünün tamamı net görünsün. Sonrakilerde farklı açıları, bağlantı noktalarını, kutu içeriğini ve varsa kusurları göster. Karanlık fotoğrafı filtreyle düzeltmek yerine ürünü gün ışığında yeniden çekmek çoğu zaman daha anlaşılır bir sonuç verir.',
          'Kişisel belgeleri, ev adresini ve ekrandaki özel mesajları kadrajdan çıkar. Seri numarası ya da fatura paylaşman gerekiyorsa gereksiz kişisel bilgileri kapat. İnternetten alınmış bir ürün görseli, sattığın parçanın durumunu anlatmaz.',
        ],
      },
      {
        baslik: 'Açıklama karar vermeye yardım etsin',
        paragraflar: [
          'Ne kadar süredir kullandığını, çalışmayan bir işlevi olup olmadığını, değişen parçaları ve hangi aksesuarları vereceğini yaz. “Sorunsuz” deyip geçmek yerine kontrol ettiğin işlevleri belirt. Eksik parçayı veya çiziği açıkça söylemek, teslim sırasında anlaşmazlık çıkmasını azaltır.',
          'Benzer ilanları karşılaştırırken aynı modelin farklı depolama, garanti veya aksesuar seçeneklerine dikkat et. Teslim edebileceğin bölgeyi ve takas düşünüp düşünmediğini ilgili alanlardan seç. Satış tamamlandığında ilanı kaldır ki alıcı boşuna mesaj göndermesin.',
        ],
      },
    ],
    kaynaklar: [],
  },
  {
    yol: 'alisveriste-supheli-baglantilar',
    baslik: 'Ödeme bağlantısı geldiğinde önce adresine bak',
    konu: 'Güvenli iletişim',
    ozet: 'Bir mesajın içinde tanıdık bir logo olması yeterli değil. Acele ettiren tekliflere, kapora taleplerine ve kod isteyen kişilere dikkat et.',
    bolumler: [
      {
        baslik: 'Bağlantıyı mesajdan açmak zorunda değilsin',
        paragraflar: [
          '“Alışverişi tamamlamak için bu bağlantıya gir” denildiğinde adresi kontrol et. Harf değişiklikleri ve uzun alt alan adları gerçek bir siteyi taklit edebilir. Emin değilsen bağlantıyı açmak yerine bildiğin siteyi kendin yazarak ilana ulaş.',
          'Kilit simgesi, bağlantının şifreli olduğunu gösterir; satıcının dürüstlüğünü veya sitenin aradığın site olduğunu kanıtlamaz. Çok düşük fiyatın yanında hemen ödeme baskısı da varsa işlemi durdurup ilanı ve satıcıyı yeniden incele.',
        ],
      },
      {
        baslik: 'Kod ve parola paylaşma',
        paragraflar: [
          'Satış bedelini almak için kart şifreni, internet bankacılığı parolanı veya telefona gelen doğrulama kodunu vermen istenmez. Bunları mesajla, telefonla veya ekran paylaşımıyla iletme. Bankanla görüşmen gerekiyorsa arayan kişinin söylediği numarayı değil, bankanın resmî iletişim kanalını kullan.',
          'Bir havale ekran görüntüsü paranın hesabına geçtiğini kanıtlamaz. Kendi banka uygulamandan kontrol et. Tanımadığın birinin gönderdiği uygulamayı kurma; cihazına uzaktan erişim isteyen talepleri kabul etme.',
        ],
      },
      {
        baslik: 'Teslimi ve ürünü birlikte kontrol et',
        paragraflar: [
          'Yüz yüze teslimde ürünü kontrol edebileceğin aydınlık, kalabalık bir yer seç. İlanda yazan özellikleri ve konuştuğun aksesuarları teslim sırasında yeniden kontrol et. Kontrol etmene izin verilmiyorsa kapora baskısına rağmen ödeme yapma.',
          'Şüpheli bir ödeme yaptıysan bankanla gecikmeden iletişime geç, görüşme ve işlem kayıtlarını sakla. Gerekli başvuruları yetkili mercilere yap. Teknik bir hata bildiriminde bulunurken banka belgesini veya kimlik bilgilerini herkese açık paylaşma.',
        ],
      },
    ],
    kaynaklar: [
      {
        ad: 'Ticaret Bakanlığı: Dijital mecralardaki dolandırıcılık girişimleri',
        adres:
          'https://ticaret.gov.tr/haberler/ticaret-bakanligi-sosyal-medya-ve-dijital-mecralardaki-dolandiricilik-girisimlerine-karsi-vatandaslari-uyariyor',
      },
    ],
  },
];

export function blogYazisiniBul(yol: string | string[] | undefined) {
  return typeof yol === 'string' ? blogYazilari.find((yazi) => yazi.yol === yol) : undefined;
}

export function blogOkumaSuresi(yazi: BlogYazisi) {
  const kelimeler = yazi.bolumler
    .flatMap((bolum) => bolum.paragraflar)
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(kelimeler / 180));
}
