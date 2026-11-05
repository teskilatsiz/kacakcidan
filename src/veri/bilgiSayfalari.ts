export type BilgiBolumu = { baslik: string; paragraflar: string[] };
export type BilgiSayfasi = {
  yol: string;
  baslik: string;
  ozet: string;
  bolumler: BilgiBolumu[];
};

export const bilgiSayfalari: Record<'gizlilik' | 'kullanim' | 'cerezler', BilgiSayfasi> = {
  gizlilik: {
    yol: '/gizlilik-politikasi',
    baslik: 'Gizlilik politikası',
    ozet: 'Hangi bilgilerin nerede tutulduğunu, nelerin göründüğünü ve verilerini nasıl yönetebileceğini öğren.',
    bolumler: [
      {
        baslik: 'Cihazında tutulan bilgiler',
        paragraflar: [
          'Hesap oluştururken girdiğin ad ve e-posta, parola doğrulama kaydı, profil bilgilerin, ilanların, favorilerin ve mesajların kullandığın tarayıcıda veya uygulamanın cihaz depolamasında tutulur. Eklediğin fotoğraf ve videolar da cihazda saklanır. Bu kayıtlar bir hesap sunucusuna gönderilmez, başka bir cihaza kendiliğinden taşınmaz.',
          'Bir başkasının hesabında kullandığın parolayı burada tekrar kullanma. Paylaşılan bir cihazda işin bitince çıkış yap. Tarayıcının site verilerini silmek hesap ve ilan kayıtlarını da kaldırır; çıkış yapmak ise bu kayıtları silmez.',
        ],
      },
      {
        baslik: 'Profil ve iletişim bilgileri',
        paragraflar: [
          'Profil ekranında adın, fotoğrafın, hakkında yazdıkların ve ilanların gösterilir. E-posta adresin profil kartında gösterilmez. Telefon numaran yalnızca iletişim ayarını açtığında ilgili profil ve ilan alanlarında görünür. Bu tercihi Hesap ayarları bölümünden değiştirebilirsin.',
          'Açıklamalara veya fotoğraflara kimlik belgesi, kart numarası, tam ev adresi ya da başkasına ait iletişim bilgileri ekleme. İlanların haritası seçilen il veya ilçe merkezini gösterir; cihazının anlık GPS konumunu istemez.',
        ],
      },
      {
        baslik: 'Site açılırken ve harita kullanılırken',
        paragraflar: [
          'Web sitesi Netlify üzerinden sunulur. Sayfaları ve dosyaları almak için yapılan ağ isteklerinde IP adresi, istenen adres, tarayıcı bilgisi ve istek zamanı gibi bağlantı verileri barındırma altyapısına iletilir. Bu hizmetin kendi veri işleme koşulları geçerlidir.',
          'Konum sekmesini açtığında harita görselleri OpenStreetMap sunucularından alınır. Bu sırada IP adresin, tarayıcı bilgisi, site adresi ve görüntülediğin harita alanı harita sağlayıcısına iletilir. Yol tarifi bağlantısı kullandığında seçtiğin harita hizmetinin sitesi veya uygulaması açılır. Harita, sayfaya ilk girişte arka planda yüklenmez.',
        ],
      },
      {
        baslik: 'Çerezler ve saklama süresi',
        paragraflar: [
          'Uygulama kodunda reklam veya ziyaretçi analizi çerezi kullanılmaz. Oturum ve tercihler çerez yerine cihaz depolamasında tutulur. Tema seçimin, seçtiğin konum ve hesap kayıtların sen değiştirene veya site verilerini silene kadar kalır. Tarayıcı da kendi depolama kurallarına göre kayıtları kaldırabilir.',
          'Karşılaştırma için hesap başına en fazla 20 son bakılan ilanın kimliği ve bakılma zamanı saklanır. 30 günden eski kayıtlar yeniden okunduğunda kullanılmaz. Çerezler ve cihaz verileri panelinden bu geçmişi hesap bilgilerini silmeden temizleyebilirsin.',
        ],
      },
      {
        baslik: 'Bilgilerini düzeltme ve silme',
        paragraflar: [
          'Profil ve telefon bilgilerini Hesap ayarları bölümünde, ilanlarını İlanlarım bölümünde düzenleyebilirsin. Cihazdaki tüm kayıtları kaldırmak için tarayıcının bu siteye ait verilerini temizleyebilir veya cihazının uygulama verilerini silebilirsin. Bu işlem yerel fotoğraf, ilan ve mesaj kayıtlarını da kaldırır; geri alma ve cihazlar arası yedekleme hizmeti bulunmaz.',
          '6698 sayılı Kanun kapsamında kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi isteme, eksik veya yanlış verilerin düzeltilmesini ve kanundaki koşullarda silinmesini isteme gibi hakların vardır. Hakların ve başvuru yolları için Kişisel Verileri Koruma Kurumunun açıklamalarını inceleyebilirsin.',
        ],
      },
      {
        baslik: 'İletişim ve değişiklikler',
        paragraflar: [
          'Siteyi Teşkilatsız geliştirir. Gizlilikle ilgili soru ve taleplerini teskilatsiz@dev.com adresine gönderebilirsin. Başvurunda konuyu ve sana dönüş yapılabilecek adresi belirt; parolanı, banka bilgilerini veya gereksiz kimlik belgelerini gönderme.',
          'Teknik sorunlar için projenin GitHub bildirim alanını da kullanabilirsin. Bu alan herkese açıktır; telefon, kimlik belgesi veya özel mesaj içeriği ekleme. Veri kullanımı değişirse bu sayfa da değişen işleyişi açıklayacak şekilde güncellenir.',
        ],
      },
    ],
  },
  kullanim: {
    yol: '/kullanim-sartlari',
    baslik: 'Kullanım şartları',
    ozet: 'Kaçakçıdan projesini kullanırken bilmen gerekenler.',
    bolumler: [
      {
        baslik: 'Hizmetin kapsamı',
        paragraflar: [
          'Kaçakçıdan şu an gerçek alışveriş yapılabilen bir site değil; pazaryeri arayüzünü denemek için hazırlanmış bir proje. İlanlar, profiller, değerlendirmeler ve mesajlar örnektir; gerçek bir satıcıyı veya ürünü doğrulamaz.',
          'Hesap, ilan ve mesaj bilgileri kullandığın cihazda saklanır. Başka kullanıcılara yayımlanmaz; ilan verme ve düzenleme ekranları ilanı internette yayımlamaz.',
          'Mesaj, soru-cevap, teklif ve alım talebi ekranları gerçek bir satıcıya ulaşmaz. param güvende, ödeme ve kargo adımları da işlem başlatmaz. Kart veya banka bilgisi girme.',
          'Profil puanları, telefon bilgileri ve değerlendirmeler doğrulanmış kullanıcı, ürün ya da alışveriş bilgisi sayılmaz.',
        ],
      },
      {
        baslik: 'Hesap ve iletişim',
        paragraflar: [
          'Yalnızca kullanma hakkın olan ad, fotoğraf ve iletişim bilgilerini gir; başkasının kimliğini kullanma. Parolanı veya doğrulama kodlarını paylaşma. Bu projedeki kayıtlar cihazında tutulur; tarayıcı ya da uygulama verilerini silmek kayıtları da kaldırabilir.',
          'Mesaj ve değerlendirmelerini ilanla ilgili tut. Hakaret, tehdit, ayrımcılık, istenmeyen reklam veya başkasının kişisel bilgilerini izinsiz paylaşma. Gerçek alışverişlerde yaşın ya da hukuki ehliyetin için gerekiyorsa yasal temsilcinden destek al.',
        ],
      },
      {
        baslik: 'İlan verirken',
        paragraflar: [
          'İlanı doğru kategoriye koy; marka, model, fiyat, konum ve özellikleri kontrol et. İkinci el üründeki kusurları ve eksik parçaları açıklamada belirt. Yalnızca kullanma iznin olan fotoğrafları yükle.',
          'Çalıntı, sahte veya yasaklı ürünler için ilan verme. Başkasının haklarını ihlal eden ya da özel izin gerektiren ürünleri gerekli iznin olmadan listeleme. Silah, yasa dışı madde, kişisel veri, hesap veya kimlik belgesi satışı için uygulamayı kullanma. İş ve emlak ilanlarında ilgili kurallara uy.',
          'Artık geçerli olmayan ilanı kaldır. Şüpheli ilanları uygulamadaki bildirim seçeneğiyle işaretleyebilirsin; bu işlem yetkili mercilere başvurunun yerini tutmaz.',
        ],
      },
      {
        baslik: 'Ödeme, kargo ve teslim',
        paragraflar: [
          'Bu proje ödeme veya kargo hizmeti sunmaz. param güvende ekranı ve ücretler yalnızca arayüzde görünür; ödeme kuruluşu ya da kargo şirketi adına verilmiş bir hizmet sözü değildir. Kart veya banka bilgisi girme.',
          'Bu projeden bağımsız bir alışveriş yaparken ürünü ve satıcıyı kontrol et. Kart şifreni, banka parolanı veya tek kullanımlık kodlarını kimseyle paylaşma; ödeme ve teslim koşullarını karşı tarafla önceden netleştir.',
        ],
      },
      {
        baslik: 'Değerlendirmeler ve içerikler',
        paragraflar: [
          'Değerlendirme özelliğini kullanırken yalnızca kendi alışveriş deneyimini anlat. Gerçekleşmemiş bir alışveriş için puan verme; karşı tarafın kişisel bilgilerini paylaşma.',
          'Yüklediğin metin ve fotoğrafların hakları sende kalır. Başkasına ait içerikleri kullanmak için izin almalısın. Blog yazıları genel bilgi verir; uzman veya hukuki görüş yerine geçmez.',
        ],
      },
      {
        baslik: 'Kayıtlar ve güncellemeler',
        paragraflar: [
          'Tarayıcı veya uygulama verilerini silersen cihazındaki kayıtlar da silinebilir. Kayıtlar başka bir cihaza aktarılmaz. Ağ ya da harita hizmetindeki kesintiler bazı bölümlerin açılmasını etkileyebilir.',
          'Bu şartlar projenin şu anki işleyişini anlatır. Buradaki açıklamalar yasal haklarını ortadan kaldırmaz.',
        ],
      },
    ],
  },
  cerezler: {
    yol: '/cerezler',
    baslik: 'Çerezler ve cihaz verileri',
    ozet: 'Hangi kayıtların neden tutulduğunu incele, son bakılan ilanları temizle.',
    bolumler: [
      {
        baslik: 'Çerez kullanımı',
        paragraflar: [
          'Uygulama kodunda reklam veya ziyaretçi analizi çerezi kullanılmaz. Hesap ve tercihler tarayıcının yerel depolamasında, eklediğin medya ise IndexedDB alanında tutulur. Mobil uygulamada aynı bilgiler cihaz depolamasında saklanır. Bunlar tarayıcı çereziyle aynı teknoloji değildir.',
          'Bu sayfadan kayıtların amacını öğrenebilir, son bakılan ilan geçmişini temizleyebilirsin.',
        ],
      },
      {
        baslik: 'Oturum, ilan ve tercihler',
        paragraflar: [
          'Hesap, ilan, mesaj, favori ve alım talebi kayıtları ilgili özellikleri kullandığında oluşur. Tema ve konum seçimin de aynı cihazda hatırlanır. Sen değiştirene, site verilerini silene veya tarayıcı kaldırana kadar saklanırlar. Oturumdan çıkmak hesabı ve ilanlarını silmez.',
          'Son bakılan ilanların en fazla 20 kimliği ve bakılma zamanı, karşılaştırma önerisi için hesap bazında tutulur. 30 günden eski kayıtlar okunurken elenir. Bu geçmişi aşağıdan temizleyebilirsin; hesap, mesaj ve favorilerin etkilenmez.',
        ],
      },
      {
        baslik: 'Haritalar ve dış bağlantılar',
        paragraflar: [
          'Konum sekmesini seçtiğinde OpenStreetMap harita sunucularına bağlantı kurulur. Harita sağlayıcısı bağlantı bilgilerini ve istenen harita alanını görür. Yol tarifi veya başka bir dış bağlantıyı açtığında ilgili hizmetin kendi gizlilik koşulları geçerli olur.',
          'Tüm cihaz kayıtlarını kaldırmak istersen tarayıcının bu site için sunduğu verileri temizle seçeneğini veya mobil cihazın uygulama verilerini silme ayarını kullan. Bu işlem ilan ve mesajlarını da siler. Gizli tarayıcı pencerelerindeki kayıtlar pencere kapanınca kaldırılabilir.',
        ],
      },
    ],
  },
};
