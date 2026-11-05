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
    ozet: 'Kaçakçıdan projesinin kullanımına ilişkin bilgiler.',
    bolumler: [
      {
        baslik: 'Hizmetin kapsamı',
        paragraflar: [
          'Kaçakçıdan, gerçek alışveriş işlemlerinin yürütüldüğü bir pazaryeri platformu değildir. İlan, profil, değerlendirme ve mesaj içerikleri arayüzü tanıtmak amacıyla sunulur; gerçek kullanıcı veya ürün doğrulaması yapılmaz.',
          'Hesap, ilan ve mesaj bilgileri kullanılan cihazda saklanır ve başka kullanıcılara yayımlanmaz. İlan oluşturma ve düzenleme işlemleri ilanı internette yayımlamaz.',
          'Mesaj, soru-cevap, teklif ve alım talebi özellikleri gerçek bir satıcıya ulaşmaz. param güvende, ödeme ve kargo adımları da gerçek bir işlem başlatmaz. Bu alanlara kart veya banka bilgisi girilmemelidir.',
          'Profil puanları, telefon bilgileri ve değerlendirmeler doğrulanmış kullanıcı, ürün veya alışveriş bilgisi olarak değerlendirilmemelidir.',
        ],
      },
      {
        baslik: 'Hesap ve iletişim',
        paragraflar: [
          'Yalnızca kullanma hakkına sahip olduğunuz ad, fotoğraf ve iletişim bilgilerini giriniz. Başka kişilerin kimlik bilgilerini kullanmayınız; parolanızı veya doğrulama kodlarınızı paylaşmayınız. Tarayıcı ya da uygulama verilerinin silinmesi cihazda saklanan kayıtları da silebilir.',
          'Mesaj ve değerlendirmeler ilanla ilgili olmalıdır. Hakaret, tehdit, ayrımcı ifade, istenmeyen reklam veya başkasına ait kişisel bilgilerin izinsiz paylaşımına izin verilmez. Gerçek bir alışverişte yaş veya hukuki ehliyet nedeniyle gerekiyorsa yasal temsilciden destek alınmalıdır.',
        ],
      },
      {
        baslik: 'İlan verirken',
        paragraflar: [
          'İlan doğru kategoriye yerleştirilmeli; marka, model, fiyat, konum ve özellik bilgileri kontrol edilmelidir. İkinci el ürünlerin kusurları ve eksik parçaları açıklamada belirtilmelidir. Yalnızca kullanma hakkına sahip olunan fotoğraflar yüklenmelidir.',
          'Çalıntı, sahte veya yasaklı ürünler için ilan verilmemelidir. Başkalarının haklarını ihlal eden ya da özel izin gerektiren ürünler, gerekli izin alınmadan listelenmemelidir. Silah, yasa dışı madde, kişisel veri, hesap veya kimlik belgesi satışı için uygulama kullanılmamalıdır. İş ve emlak ilanlarında ilgili kurallara uyulmalıdır.',
          'Geçerliliğini yitiren ilan kaldırılmalıdır. Şüpheli ilanlar uygulamadaki bildirim seçeneğiyle işaretlenebilir; bu işlem yetkili mercilere yapılan başvurunun yerini tutmaz.',
        ],
      },
      {
        baslik: 'Ödeme, kargo ve teslim',
        paragraflar: [
          'Proje kapsamında ödeme veya kargo hizmeti sunulmamaktadır. param güvende ekranı ve burada gösterilen ücretler yalnızca arayüzün parçasıdır; herhangi bir ödeme kuruluşu ya da kargo şirketi adına hizmet taahhüdü oluşturmaz. Kart veya banka bilgisi girilmemelidir.',
          'Proje dışındaki alışverişlerde ürün ve satıcı kontrol edilmeli; kart şifresi, banka parolası ve tek kullanımlık kodlar paylaşılmamalıdır. Ödeme ve teslim koşulları karşı tarafla önceden netleştirilmelidir.',
        ],
      },
      {
        baslik: 'Değerlendirmeler ve içerikler',
        paragraflar: [
          'Değerlendirmeler yalnızca kişinin kendi alışveriş deneyimine dayanmalıdır. Gerçekleşmemiş bir alışveriş için puan verilmemeli ve karşı tarafın kişisel bilgileri paylaşılmamalıdır.',
          'Yüklenen metin ve fotoğrafların hakları içerik sahibinde kalır. Başkasına ait içerikler gerekli izin alınmadan kullanılmamalıdır. Blog yazıları genel bilgi niteliğindedir; uzman veya hukuki görüş yerine geçmez.',
        ],
      },
      {
        baslik: 'Kayıtlar ve güncellemeler',
        paragraflar: [
          'Tarayıcı veya uygulama verilerinin silinmesi, cihazda saklanan kayıtları da silebilir. Kayıtlar başka bir cihaza aktarılmaz. Ağ veya harita hizmetindeki kesintiler bazı bölümlerin açılmasını etkileyebilir.',
          'Bu şartlar projenin mevcut işleyişini açıklar. Buradaki hükümler, mevzuattan doğan hakları ortadan kaldırmaz.',
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
