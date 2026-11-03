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
    ozet: 'İlan verirken, iletişim kurarken ve alışverişe hazırlanırken geçerli olan kurallar.',
    bolumler: [
      {
        baslik: 'Hizmetin kapsamı',
        paragraflar: [
          'Kaçakçıdan; ürün, otomobil, emlak, iş ve hizmet ilanlarını incelemek ve ilan bilgilerini yönetmek için bir arayüz sunar. Hesap, ilan ve mesaj kayıtları kullandığın cihazda tutulur. Burada oluşturulan yerel bir ilan diğer kullanıcılara veya farklı cihazlara otomatik olarak yayınlanmaz.',
          'İlan bilgilerinin doğruluğu, ürünü satma yetkisi ve taraflar arasında kararlaştırılan koşullar ilan sahibinin ve alıcının sorumluluğundadır. Bir profil puanı, telefon bilgisi veya değerlendirme tek başına kimlik, ürün orijinalliği ya da alışveriş garantisi değildir.',
        ],
      },
      {
        baslik: 'Hesap ve iletişim',
        paragraflar: [
          'Yalnızca kullanma hakkın olan ad, fotoğraf ve iletişim bilgilerini gir. Başkasının kimliğine bürünme. Parolanı ve doğrulama kodlarını paylaşma. Başkasının cihazını kullanıyorsan oturumunu kapat; tarayıcı verilerinin temizlenmesinin kayıtlarını kaldıracağını unutma.',
          'Mesajlar, sorular ve değerlendirmeler ilanla ilgili olmalıdır. Hakaret, tehdit, ayrımcılık, istenmeyen reklam ve kişisel bilgileri izinsiz yayınlama kabul edilmez. Alışveriş yaparken yaşın veya hukuki ehliyetin gerektiriyorsa yasal temsilcinin yardımını al.',
        ],
      },
      {
        baslik: 'İlan verirken',
        paragraflar: [
          'İlanı uygun kategoriye yerleştir. Marka, model, fiyat, konum ve teknik özellikleri kontrol et. İkinci el üründeki kusurları, değişen parçaları ve eksik aksesuarları açıklamaya yaz; fotoğraflarda gizleme. Yalnızca kendine ait veya kullanma iznin olan görselleri yükle.',
          'Çalıntı, sahte, yasaklı, üçüncü kişilerin haklarını ihlal eden veya satışı özel izne bağlı olup gerekli izni bulunmayan ürün ve hizmetler için ilan verme. Silah, yasa dışı madde, kişisel veri, hesap ve kimlik belgesi satışı amacıyla uygulamayı kullanma. İş ve emlak ilanlarında ilgili mevzuata ve yetki gerekliliklerine uy.',
          'Satılan veya artık geçerli olmayan ilanını yayından kaldır. Şüpheli bir ilanı ilgili bildirim seçeneğiyle işaretleyebilirsin. Bu arayüzdeki bildirim kaydı, yetkili mercilere yapılan başvurunun yerine geçmez.',
        ],
      },
      {
        baslik: 'Ödeme, kargo ve teslim',
        paragraflar: [
          'Kaçakçıdan para tahsil etmez, kart bilgisi istemez ve para saklama hizmeti sunmaz. Param Güvende adıyla görünen talep adımları gerçek bir ödeme veya kargo sözleşmesi oluşturmaz. Ekranda görünen ücret hesabı, bir ödeme kuruluşunun ya da kargo şirketinin hizmet taahhüdü değildir.',
          'Ürünü ve satıcıyı kontrol etmeden kapora gönderme. Harici bir bağlantının üzerinde Kaçakçıdan yazması o bağlantının bu siteye ait olduğunu göstermez. Kart şifreni, banka parolanı ve tek kullanımlık kodlarını kimseyle paylaşma. Teslimi ve ödemeyi taraflarla açıkça kararlaştır.',
        ],
      },
      {
        baslik: 'Değerlendirmeler ve içerikler',
        paragraflar: [
          'Değerlendirmeyi yalnızca kendi alışveriş deneyimin hakkında yaz. Gerçekleşmemiş bir alışveriş için puan verme, başka hesaplarla puanı değiştirmeye çalışma. İlanla ve teslimle ilgili somut ayrıntıları anlat; karşı tarafın kişisel bilgilerini paylaşma.',
          'Kendi içeriğin üzerindeki hakların sende kalır. Fotoğraf veya metin yüklemen, başkasına ait bir içeriği kullanma hakkı vermez. Blogdaki yazılar genel bilgilendirme içindir; ürün incelemesinin, uzman görüşünün veya hukuki değerlendirmenin yerine geçmez.',
        ],
      },
      {
        baslik: 'Kayıtlar ve güncellemeler',
        paragraflar: [
          'Tarayıcı veya uygulama verilerini silmek cihazdaki kayıtları kaldırabilir. Kayıtlarının başka bir cihazda bulunacağını varsayma. Ağ veya harita hizmetindeki kesintiler bazı alanların açılmasını geciktirebilir.',
          'İşleyiş değiştikçe bu şartlar güncellenir. Bu metin kanundan doğan, sözleşmeyle kaldırılamayan haklarını sınırlamaz. Teknik bildirimleri GitHub üzerinden iletebilirsin; herkese açık bildirimlere özel bilgi ekleme.',
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
