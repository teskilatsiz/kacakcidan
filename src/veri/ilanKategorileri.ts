import type { AltKategori } from './kategoriler.ts';

type Secenek = [id: string, ad: string];
type Grup = [id: string, ad: string, turler: Secenek[]];
const dal = (id: string, ad: string, gruplar: Grup[]): AltKategori => ({
  id,
  ad,
  markalar: gruplar.map(([id, ad, turler]) => ({
    id,
    ad,
    modeller: turler.map(([id, ad]) => ({ id, ad })),
  })),
});

const konutTurleri: Secenek[] = [
  ['daire', 'Daire'],
  ['mustakil-ev', 'Müstakil ev'],
  ['villa', 'Villa'],
  ['rezidans', 'Rezidans'],
  ['yazlik', 'Yazlık'],
  ['ciftlik-evi', 'Çiftlik evi'],
  ['kosk-konak', 'Köşk ve konak'],
  ['prefabrik', 'Prefabrik ev'],
];
const isyeriTurleri: Secenek[] = [
  ['dukkan', 'Dükkan ve mağaza'],
  ['ofis', 'Ofis ve büro'],
  ['depo', 'Depo ve antrepo'],
  ['atolye', 'Atölye'],
  ['fabrika', 'Fabrika'],
  ['plaza', 'Plaza'],
  ['restoran', 'Restoran ve lokanta'],
  ['kafe', 'Kafe ve bar'],
  ['ciftlik', 'Çiftlik'],
  ['otopark', 'Otopark'],
  ['imalathane', 'İmalathane'],
];

/** Aynı dört seviyeli gezinti, ürün dışında sektör/pozisyon veya ilan türü olarak adlandırılır. */
export const ilanKategorileri: Record<'is-ilanlari' | 'emlak' | 'hizmetler', AltKategori[]> = {
  'is-ilanlari': [
    dal('bilisim-yazilim', 'Bilişim ve yazılım', [
      [
        'yazilim',
        'Yazılım geliştirme',
        [
          ['frontend-gelistirici', 'Ön yüz geliştirici'],
          ['backend-gelistirici', 'Arka uç geliştirici'],
          ['mobil-gelistirici', 'Mobil uygulama geliştirici'],
          ['test-uzmani', 'Yazılım test uzmanı'],
          ['tam-yigin-gelistirici', 'Tam yığın geliştirici'],
        ],
      ],
      [
        'bilgi-islem',
        'Bilgi işlem ve altyapı',
        [
          ['destek-uzmani', 'Bilgi işlem destek uzmanı'],
          ['sistem-uzmani', 'Sistem ve ağ uzmanı'],
          ['siber-guvenlik', 'Siber güvenlik uzmanı'],
          ['veri-analisti', 'Veri analisti'],
        ],
      ],
    ]),
    dal('restoran-konaklama', 'Restoran ve konaklama', [
      [
        'servis',
        'Servis ve salon',
        [
          ['garson', 'Garson'],
          ['komi', 'Komi'],
          ['barista', 'Barista'],
          ['barmen', 'Barmen'],
          ['salon-sefi', 'Salon şefi'],
        ],
      ],
      [
        'mutfak',
        'Mutfak',
        [
          ['asci', 'Aşçı'],
          ['asci-yardimcisi', 'Aşçı yardımcısı'],
          ['bulasikci', 'Bulaşıkçı'],
          ['pastaci', 'Pastacı'],
          ['pide-pizza-ustasi', 'Pide ve pizza ustası'],
        ],
      ],
      [
        'otel',
        'Otel ve konaklama',
        [
          ['resepsiyonist', 'Resepsiyonist'],
          ['kat-gorevlisi', 'Kat görevlisi'],
          ['otel-muduru', 'Otel müdürü'],
          ['bellboy', 'Karşılama görevlisi'],
        ],
      ],
    ]),
    dal('magazacilik', 'Mağazacılık ve perakende', [
      [
        'magaza',
        'Mağaza',
        [
          ['satis-danismani', 'Satış danışmanı'],
          ['kasiyer', 'Kasiyer'],
          ['reyon-gorevlisi', 'Reyon görevlisi'],
          ['magaza-muduru', 'Mağaza müdürü'],
        ],
      ],
      [
        'operasyon',
        'E-ticaret ve depo',
        [
          ['e-ticaret-uzmani', 'E-ticaret uzmanı'],
          ['depo-gorevlisi', 'Depo görevlisi'],
          ['paketleme', 'Paketleme personeli'],
          ['stok-sorumlusu', 'Stok sorumlusu'],
        ],
      ],
    ]),
    dal('lojistik-tasima', 'Lojistik ve taşıma', [
      [
        'surucu',
        'Şoför ve kurye',
        [
          ['kurye', 'Motosikletli kurye'],
          ['sofor', 'Şoför'],
          ['tir-soforu', 'Tır şoförü'],
          ['servis-soforu', 'Servis şoförü'],
          ['forklift-operatoru', 'Forklift operatörü'],
        ],
      ],
      [
        'lojistik',
        'Lojistik operasyonu',
        [
          ['sevkiyat', 'Sevkiyat sorumlusu'],
          ['lojistik-uzmani', 'Lojistik uzmanı'],
          ['gumruk', 'Gümrük operasyon elemanı'],
        ],
      ],
    ]),
    dal('satis', 'Satış', [
      [
        'saha',
        'Saha satışı',
        [
          ['satis-temsilcisi', 'Satış temsilcisi'],
          ['bolge-sorumlusu', 'Bölge satış sorumlusu'],
          ['emlak-danismani', 'Emlak danışmanı'],
        ],
      ],
      [
        'kurumsal',
        'Kurumsal satış',
        [
          ['satis-uzmani', 'Satış uzmanı'],
          ['satis-muduru', 'Satış müdürü'],
          ['ihracat-satis', 'İhracat satış sorumlusu'],
        ],
      ],
    ]),
    dal('musteri-hizmetleri', 'Müşteri hizmetleri', [
      [
        'destek',
        'Müşteri desteği',
        [
          ['cagri-merkezi', 'Çağrı merkezi temsilcisi'],
          ['canli-destek', 'Canlı destek uzmanı'],
          ['musteri-iliskileri', 'Müşteri ilişkileri sorumlusu'],
        ],
      ],
      [
        'yonetim',
        'Ekip yönetimi',
        [
          ['takim-lideri', 'Çağrı merkezi takım lideri'],
          ['kalite-uzmani', 'Çağrı merkezi kalite uzmanı'],
        ],
      ],
    ]),
    dal('egitim', 'Eğitim', [
      [
        'ogretmenlik',
        'Öğretmenlik',
        [
          ['sinif-ogretmeni', 'Sınıf öğretmeni'],
          ['okul-oncesi', 'Okul öncesi öğretmeni'],
          ['brans-ogretmeni', 'Branş öğretmeni'],
          ['ozel-egitim', 'Özel eğitim öğretmeni'],
        ],
      ],
      [
        'egitim-destek',
        'Eğitim ve öğrenci desteği',
        [
          ['rehberlik', 'Rehber öğretmen'],
          ['egitim-danismani', 'Eğitim danışmanı'],
          ['ogrenci-isleri', 'Öğrenci işleri personeli'],
        ],
      ],
    ]),
    dal('saglik', 'Sağlık', [
      [
        'klinik',
        'Klinik ve sağlık',
        [
          ['hemsire', 'Hemşire'],
          ['saglik-teknikeri', 'Sağlık teknikeri'],
          ['dis-asistani', 'Diş hekimi asistanı'],
          ['fizyoterapist', 'Fizyoterapist'],
        ],
      ],
      [
        'bakim',
        'Bakım ve destek',
        [
          ['hasta-bakici', 'Hasta bakıcı'],
          ['yasli-bakici', 'Yaşlı bakıcı'],
          ['tibbi-sekreter', 'Tıbbi sekreter'],
        ],
      ],
    ]),
    dal('guzellik-bakim', 'Güzellik ve bakım', [
      [
        'kuafor',
        'Kuaför ve berber',
        [
          ['kadin-kuaforu', 'Kadın kuaförü'],
          ['erkek-kuaforu', 'Erkek kuaförü'],
          ['kuafor-kalfasi', 'Kuaför kalfası'],
        ],
      ],
      [
        'guzellik',
        'Güzellik hizmetleri',
        [
          ['guzellik-uzmani', 'Güzellik uzmanı'],
          ['tirnak-uzmani', 'Protez tırnak uzmanı'],
          ['makyaj-uzmani', 'Makyaj uzmanı'],
        ],
      ],
    ]),
    dal('muhasebe-finans', 'Muhasebe, finans ve bankacılık', [
      [
        'muhasebe',
        'Muhasebe',
        [
          ['on-muhasebe', 'Ön muhasebe elemanı'],
          ['muhasebe-uzmani', 'Muhasebe uzmanı'],
          ['bordro-uzmani', 'Bordro uzmanı'],
        ],
      ],
      [
        'finans',
        'Finans ve bankacılık',
        [
          ['finans-uzmani', 'Finans uzmanı'],
          ['banka-operasyon', 'Banka operasyon personeli'],
          ['sigorta-danismani', 'Sigorta danışmanı'],
        ],
      ],
    ]),
    dal('ofis-idari', 'Ofis yönetimi ve idari işler', [
      [
        'ofis',
        'Ofis desteği',
        [
          ['sekreter', 'Sekreter'],
          ['yonetici-asistani', 'Yönetici asistanı'],
          ['veri-giris', 'Veri giriş elemanı'],
          ['ofis-personeli', 'Ofis personeli'],
        ],
      ],
      [
        'idari',
        'İdari işler',
        [
          ['idari-isler', 'İdari işler sorumlusu'],
          ['satin-alma', 'Satın alma uzmanı'],
          ['temizlik', 'Temizlik personeli'],
        ],
      ],
    ]),
    dal('insan-kaynaklari', 'İnsan kaynakları', [
      [
        'ik',
        'İnsan kaynakları operasyonu',
        [
          ['ik-uzmani', 'İnsan kaynakları uzmanı'],
          ['ise-alim', 'İşe alım uzmanı'],
          ['ozluk-isleri', 'Özlük işleri uzmanı'],
        ],
      ],
      [
        'gelisim',
        'Eğitim ve gelişim',
        [
          ['kurumsal-egitim', 'Kurumsal eğitim uzmanı'],
          ['organizasyonel-gelisim', 'Organizasyonel gelişim uzmanı'],
        ],
      ],
    ]),
    dal('muhendislik', 'Mühendislik', [
      [
        'teknik',
        'Teknik mühendislik',
        [
          ['makine', 'Makine mühendisi'],
          ['elektrik-elektronik', 'Elektrik elektronik mühendisi'],
          ['endustri', 'Endüstri mühendisi'],
          ['insaat', 'İnşaat mühendisi'],
        ],
      ],
      [
        'proje',
        'Proje ve kalite',
        [
          ['proje-muhendisi', 'Proje mühendisi'],
          ['kalite-muhendisi', 'Kalite mühendisi'],
          ['ar-ge', 'Ar-Ge mühendisi'],
        ],
      ],
    ]),
    dal('insaat-yapi', 'İnşaat ve yapı', [
      [
        'santiye',
        'Şantiye ve yapı işleri',
        [
          ['insaat-ustasi', 'İnşaat ustası'],
          ['kalip-ustasi', 'Kalıp ustası'],
          ['demir-ustasi', 'Demir ustası'],
          ['boya-ustasi', 'Boya ustası'],
        ],
      ],
      [
        'teknik-ofis',
        'Teknik ofis',
        [
          ['mimar', 'Mimar'],
          ['ic-mimar', 'İç mimar'],
          ['tekniker', 'İnşaat teknikeri'],
          ['santiye-sefi', 'Şantiye şefi'],
        ],
      ],
    ]),
    dal('uretim-imalat', 'Üretim ve imalat', [
      [
        'uretim',
        'Üretim',
        [
          ['uretim-elemani', 'Üretim elemanı'],
          ['makine-operatoru', 'Makine operatörü'],
          ['montaj', 'Montaj elemanı'],
          ['kaynakci', 'Kaynakçı'],
          ['cnc-operatoru', 'CNC operatörü'],
        ],
      ],
      [
        'planlama',
        'Planlama ve kalite',
        [
          ['uretim-planlama', 'Üretim planlama sorumlusu'],
          ['kalite-kontrol', 'Kalite kontrol elemanı'],
          ['vardiya-amiri', 'Vardiya amiri'],
        ],
      ],
    ]),
    dal('tekstil-konfeksiyon', 'Tekstil ve konfeksiyon', [
      [
        'dikim',
        'Dikim ve kesim',
        [
          ['makineci', 'Dikiş makinecisi'],
          ['kesimci', 'Kesimci'],
          ['overlokcu', 'Overlokçu'],
          ['modelist', 'Modelist'],
        ],
      ],
      [
        'tamamlama',
        'Tamamlama',
        [
          ['utucu', 'Ütücü'],
          ['tekstil-paketleme', 'Paketleme elemanı'],
          ['tekstil-kalite', 'Tekstil kalite kontrol elemanı'],
        ],
      ],
    ]),
    dal('koruma-guvenlik', 'Koruma ve güvenlik', [
      [
        'guvenlik',
        'Güvenlik',
        [
          ['ozel-guvenlik', 'Özel güvenlik görevlisi'],
          ['guvenlik-amiri', 'Güvenlik amiri'],
          ['bekci', 'Bekçi'],
        ],
      ],
      [
        'isg',
        'İş sağlığı ve güvenliği',
        [
          ['is-guvenligi-uzmani', 'İş güvenliği uzmanı'],
          ['isg-teknikeri', 'İş güvenliği teknikeri'],
        ],
      ],
    ]),
    dal('pazarlama', 'Pazarlama ve ürün yönetimi', [
      [
        'dijital',
        'Dijital pazarlama',
        [
          ['dijital-pazarlama', 'Dijital pazarlama uzmanı'],
          ['sosyal-medya', 'Sosyal medya uzmanı'],
          ['icerik-editoru', 'İçerik editörü'],
          ['seo-uzmani', 'SEO uzmanı'],
        ],
      ],
      [
        'urun',
        'Ürün ve marka',
        [
          ['urun-yoneticisi', 'Ürün yöneticisi'],
          ['marka-yoneticisi', 'Marka yöneticisi'],
          ['pazarlama-uzmani', 'Pazarlama uzmanı'],
        ],
      ],
    ]),
    dal('tasarim-yaraticilik', 'Tasarım ve yaratıcılık', [
      [
        'gorsel',
        'Görsel tasarım',
        [
          ['grafik-tasarimci', 'Grafik tasarımcı'],
          ['motion-tasarimci', 'Hareketli grafik tasarımcısı'],
          ['fotografci', 'Fotoğrafçı'],
        ],
      ],
      [
        'dijital',
        'Dijital ürün tasarımı',
        [
          ['arayuz-tasarimci', 'Arayüz tasarımcısı'],
          ['urun-tasarimci', 'Ürün tasarımcısı'],
          ['uc-boyut', '3B tasarımcı'],
        ],
      ],
    ]),
    dal('tamir-bakim', 'Tamir ve bakım', [
      [
        'arac',
        'Araç bakım ve onarımı',
        [
          ['oto-mekanik', 'Oto mekanik ustası'],
          ['oto-elektrik', 'Oto elektrik ustası'],
          ['kaporta', 'Kaporta ustası'],
        ],
      ],
      [
        'teknik',
        'Teknik servis',
        [
          ['elektrikci', 'Elektrikçi'],
          ['beyaz-esya', 'Beyaz eşya teknisyeni'],
          ['klima', 'Klima teknisyeni'],
          ['tesisatci', 'Tesisatçı'],
        ],
      ],
    ]),
    dal('hukuk', 'Avukatlık ve hukuki danışmanlık', [
      [
        'hukuk',
        'Hukuk',
        [
          ['avukat', 'Avukat'],
          ['stajyer-avukat', 'Stajyer avukat'],
          ['hukuk-danismani', 'Hukuk danışmanı'],
        ],
      ],
      [
        'destek',
        'Hukuk bürosu desteği',
        [
          ['hukuk-sekreteri', 'Hukuk sekreteri'],
          ['icra-takip', 'İcra takip elemanı'],
        ],
      ],
    ]),
    dal('isletme-yonetim', 'İşletme ve yönetim', [
      [
        'yonetim',
        'Yönetim',
        [
          ['isletme-muduru', 'İşletme müdürü'],
          ['operasyon-muduru', 'Operasyon müdürü'],
          ['sube-muduru', 'Şube müdürü'],
        ],
      ],
      [
        'danismanlik',
        'İş geliştirme',
        [
          ['is-gelistirme', 'İş geliştirme uzmanı'],
          ['proje-yoneticisi', 'Proje yöneticisi'],
          ['is-analisti', 'İş analisti'],
        ],
      ],
    ]),
    dal('eglence-aktivite', 'Eğlence ve aktivite', [
      [
        'etkinlik',
        'Etkinlik',
        [
          ['animator', 'Animatör'],
          ['organizasyon', 'Organizasyon görevlisi'],
          ['etkinlik-sorumlusu', 'Etkinlik sorumlusu'],
        ],
      ],
      [
        'spor',
        'Spor ve aktivite',
        [
          ['spor-egitmeni', 'Spor eğitmeni'],
          ['yuzme-egitmeni', 'Yüzme eğitmeni'],
          ['cankurtaran', 'Cankurtaran'],
        ],
      ],
    ]),
    dal('medya', 'Radyo, sinema ve televizyon', [
      [
        'yapim',
        'Yapım ve çekim',
        [
          ['kameraman', 'Kameraman'],
          ['kurgu', 'Kurgu operatörü'],
          ['set-asistani', 'Set asistanı'],
          ['ses-teknisyeni', 'Ses teknisyeni'],
        ],
      ],
      [
        'yayin',
        'Yayıncılık',
        [
          ['sunucu', 'Sunucu'],
          ['muhabir', 'Muhabir'],
          ['yayin-editoru', 'Yayın editörü'],
        ],
      ],
    ]),
    dal('tarim-hayvancilik', 'Tarım ve hayvancılık', [
      [
        'tarim',
        'Tarım',
        [
          ['tarim-iscisi', 'Tarım işçisi'],
          ['sera', 'Sera elemanı'],
          ['ziraat-muhendisi', 'Ziraat mühendisi'],
        ],
      ],
      [
        'hayvancilik',
        'Hayvancılık',
        [
          ['ciftlik-personeli', 'Çiftlik personeli'],
          ['sagim-personeli', 'Sağım personeli'],
          ['veteriner-teknikeri', 'Veteriner teknikeri'],
        ],
      ],
    ]),
    dal('ev-personeli', 'Ev personeli ve bakım', [
      [
        'bakim',
        'Çocuk ve aile bakımı',
        [
          ['cocuk-bakici', 'Çocuk bakıcısı'],
          ['bebek-bakici', 'Bebek bakıcısı'],
          ['evde-hasta-bakici', 'Evde hasta bakıcı'],
        ],
      ],
      [
        'ev',
        'Ev işleri',
        [
          ['ev-yardimcisi', 'Ev yardımcısı'],
          ['gundelik-temizlik', 'Gündelik temizlik personeli'],
          ['yatili-personel', 'Yatılı ev personeli'],
        ],
      ],
    ]),
    dal('part-time', 'Yarı zamanlı ve ek iş', [
      [
        'yarizamanli',
        'Yarı zamanlı işler',
        [
          ['magaza-destek', 'Mağaza destek personeli'],
          ['servis-destek', 'Servis destek personeli'],
          ['tanitim', 'Tanıtım görevlisi'],
        ],
      ],
      [
        'serbest',
        'Serbest ve dönemsel işler',
        [
          ['serbest-icerik', 'İçerik üreticisi'],
          ['anket', 'Anketör'],
          ['tercuman', 'Tercüman'],
          ['ozel-ders', 'Özel ders öğretmeni'],
        ],
      ],
    ]),
  ],
  emlak: [
    dal('konut', 'Konut', [
      ['satilik', 'Satılık', konutTurleri],
      ['kiralik', 'Kiralık', konutTurleri],
      [
        'gunluk-kiralik',
        'Günlük kiralık',
        [
          ['daire', 'Daire'],
          ['villa', 'Villa'],
          ['bungalov', 'Bungalov'],
        ],
      ],
      [
        'devren-satilik',
        'Devren satılık',
        [
          ['daire', 'Daire'],
          ['mustakil-ev', 'Müstakil ev'],
        ],
      ],
    ]),
    dal('isyeri', 'İşyeri', [
      ['satilik', 'Satılık', isyeriTurleri],
      ['kiralik', 'Kiralık', isyeriTurleri],
      ['devren', 'Devren', isyeriTurleri],
    ]),
    dal('arsa', 'Arsa ve arazi', [
      [
        'satilik',
        'Satılık',
        [
          ['konut-imarli', 'Konut imarlı arsa'],
          ['ticari-imarli', 'Ticari imarlı arsa'],
          ['tarla', 'Tarla'],
          ['bahce', 'Bahçe'],
          ['zeytinlik', 'Zeytinlik'],
          ['bag', 'Bağ'],
          ['sanayi-imarli', 'Sanayi imarlı arsa'],
        ],
      ],
      [
        'kiralik',
        'Kiralık',
        [
          ['tarla', 'Tarla'],
          ['bahce', 'Bahçe'],
          ['ticari-imarli', 'Ticari imarlı arsa'],
        ],
      ],
      [
        'kat-karsiligi',
        'Kat karşılığı',
        [
          ['konut-imarli', 'Konut imarlı arsa'],
          ['ticari-imarli', 'Ticari imarlı arsa'],
        ],
      ],
    ]),
    dal('bina', 'Bina', [
      [
        'satilik',
        'Satılık',
        [
          ['apartman', 'Apartman'],
          ['ticari-bina', 'Ticari bina'],
          ['tarihi-bina', 'Tarihi bina'],
        ],
      ],
      [
        'kiralik',
        'Kiralık',
        [
          ['apartman', 'Apartman'],
          ['ticari-bina', 'Ticari bina'],
        ],
      ],
    ]),
    dal('devre-mulk', 'Devre mülk', [
      [
        'satilik',
        'Satılık',
        [
          ['daire', 'Daire'],
          ['villa', 'Villa'],
          ['termal', 'Termal tesis'],
        ],
      ],
      [
        'kiralik',
        'Kiralık',
        [
          ['daire', 'Daire'],
          ['villa', 'Villa'],
          ['termal', 'Termal tesis'],
        ],
      ],
    ]),
    dal('turistik-tesis', 'Turistik tesis', [
      [
        'satilik',
        'Satılık',
        [
          ['otel', 'Otel'],
          ['butik-otel', 'Butik otel'],
          ['pansiyon', 'Pansiyon'],
          ['apart', 'Apart otel'],
          ['kamp', 'Kamp ve karavan alanı'],
        ],
      ],
      [
        'kiralik',
        'Kiralık',
        [
          ['otel', 'Otel'],
          ['butik-otel', 'Butik otel'],
          ['pansiyon', 'Pansiyon'],
          ['apart', 'Apart otel'],
        ],
      ],
      [
        'devren',
        'Devren',
        [
          ['otel', 'Otel'],
          ['butik-otel', 'Butik otel'],
          ['pansiyon', 'Pansiyon'],
        ],
      ],
    ]),
    dal('konut-projesi', 'Konut projeleri', [
      [
        'satilik',
        'Satılık',
        [
          ['daire', 'Daire projesi'],
          ['villa', 'Villa projesi'],
          ['rezidans', 'Rezidans projesi'],
        ],
      ],
    ]),
  ],
  hizmetler: [
    dal('tadilat-dekorasyon', 'Ev tadilatı ve dekorasyon', [
      [
        'boya-yuzey',
        'Boya ve yüzey işleri',
        [
          ['boya', 'Boya ve badana'],
          ['alci', 'Alçı ve kartonpiyer'],
          ['seramik', 'Seramik ve fayans'],
          ['parke', 'Parke ve zemin kaplama'],
        ],
      ],
      [
        'tesisat',
        'Tesisat ve yalıtım',
        [
          ['su-tesisati', 'Su tesisatı'],
          ['elektrik', 'Elektrik tesisatı'],
          ['dogalgaz', 'Doğal gaz tesisatı'],
          ['yalitim', 'Isı ve su yalıtımı'],
        ],
      ],
      [
        'dekorasyon',
        'Dekorasyon ve mobilya',
        [
          ['mutfak-banyo', 'Mutfak ve banyo tadilatı'],
          ['marangoz', 'Marangoz'],
          ['doseme', 'Mobilya döşeme'],
          ['cam-balkon', 'Cam balkon ve doğrama'],
          ['peyzaj', 'Bahçe ve peyzaj'],
        ],
      ],
    ]),
    dal('nakliye', 'Nakliye ve taşıma', [
      [
        'ev-ofis',
        'Ev ve ofis taşımacılığı',
        [
          ['evden-eve', 'Evden eve nakliyat'],
          ['ofis-tasima', 'Ofis taşıma'],
          ['parca-esya', 'Parça eşya taşıma'],
          ['asansorlu', 'Asansörlü nakliyat'],
        ],
      ],
      [
        'yuk',
        'Yük ve kurye',
        [
          ['yuk-tasima', 'Yük taşıma'],
          ['kurye', 'Kurye'],
          ['depolama', 'Depolama ve paketleme'],
          ['soforlu-transfer', 'Şoförlü araç ve transfer'],
        ],
      ],
    ]),
    dal('arac-servis', 'Araç servis ve bakım', [
      [
        'bakim',
        'Servis ve bakım',
        [
          ['oto-tamir', 'Oto tamir ve periyodik bakım'],
          ['oto-elektrik', 'Oto elektrik'],
          ['lastik', 'Lastik ve jant'],
          ['kaporta-boya', 'Kaporta ve boya'],
        ],
      ],
      [
        'ekspertiz-temizlik',
        'Ekspertiz ve temizlik',
        [
          ['ekspertiz', 'Oto ekspertiz'],
          ['oto-yikama', 'Oto yıkama'],
          ['detayli-temizlik', 'Detaylı temizlik'],
          ['kaplama', 'Boya koruma ve kaplama'],
        ],
      ],
      [
        'yol-yardim',
        'Yol yardım',
        [
          ['cekici', 'Çekici'],
          ['aku-yardim', 'Akü takviye'],
          ['mobil-lastik', 'Mobil lastik servisi'],
        ],
      ],
    ]),
    dal('teknik-servis', 'Tamirat ve teknik servis', [
      [
        'ev-cihazlari',
        'Ev cihazları',
        [
          ['beyaz-esya', 'Beyaz eşya servisi'],
          ['klima', 'Klima servisi'],
          ['kombi', 'Kombi servisi'],
          ['kucuk-ev-aleti', 'Küçük ev aleti tamiri'],
        ],
      ],
      [
        'elektronik',
        'Bilgisayar ve elektronik',
        [
          ['bilgisayar', 'Bilgisayar teknik servisi'],
          ['telefon', 'Cep telefonu tamiri'],
          ['televizyon', 'Televizyon tamiri'],
          ['yazici', 'Yazıcı ve fotokopi servisi'],
        ],
      ],
      [
        'diger-tamir',
        'Diğer tamirler',
        [
          ['bisiklet', 'Bisiklet tamiri'],
          ['enstruman', 'Enstrüman tamiri'],
          ['saat', 'Saat tamiri'],
          ['tekstil-tadilat', 'Tekstil tadilatı'],
        ],
      ],
    ]),
    dal('dugun-etkinlik', 'Düğün ve etkinlik', [
      [
        'organizasyon',
        'Organizasyon',
        [
          ['dugun', 'Düğün ve nişan'],
          ['dogum-gunu', 'Doğum günü ve parti'],
          ['toplanti', 'Toplantı ve seminer'],
          ['fuar', 'Fuar organizasyonu'],
        ],
      ],
      [
        'cekim',
        'Fotoğraf ve video',
        [
          ['dugun-fotograf', 'Düğün fotoğrafçısı'],
          ['urun-fotograf', 'Ürün fotoğrafçısı'],
          ['video', 'Video çekimi'],
          ['drone', 'Drone çekimi'],
        ],
      ],
      [
        'ikram-teknik',
        'İkram ve teknik ekip',
        [
          ['catering', 'Yemek ve catering'],
          ['pasta', 'Pasta'],
          ['ses-isik', 'Ses ve ışık sistemi'],
          ['muzik', 'Canlı müzik ve DJ'],
        ],
      ],
    ]),
    dal('temizlik', 'Temizlik ve ilaçlama', [
      [
        'temizlik',
        'Temizlik',
        [
          ['ev', 'Ev temizliği'],
          ['ofis', 'Ofis temizliği'],
          ['insaat-sonrasi', 'İnşaat sonrası temizlik'],
          ['koltuk-yikama', 'Koltuk ve yatak yıkama'],
          ['hali-yikama', 'Halı yıkama'],
        ],
      ],
      [
        'ilaclama',
        'İlaçlama',
        [
          ['ev-ilaclama', 'Ev ilaçlama'],
          ['isyeri-ilaclama', 'İşyeri ilaçlama'],
          ['bahce-ilaclama', 'Bahçe ilaçlama'],
        ],
      ],
    ]),
    dal('ozel-ders', 'Özel ders', [
      [
        'okul',
        'Okul ve sınav',
        [
          ['ilkokul', 'İlkokul'],
          ['ortaokul', 'Ortaokul ve LGS'],
          ['lise', 'Lise ve YKS'],
          ['universite', 'Üniversite dersleri'],
        ],
      ],
      [
        'dil',
        'Yabancı dil',
        [
          ['ingilizce', 'İngilizce'],
          ['almanca', 'Almanca'],
          ['fransizca', 'Fransızca'],
          ['turkce', 'Yabancılar için Türkçe'],
        ],
      ],
      [
        'beceri',
        'Beceri ve sanat',
        [
          ['yazilim', 'Yazılım ve bilgisayar'],
          ['muzik', 'Müzik ve enstrüman'],
          ['spor', 'Spor'],
          ['resim', 'Resim'],
          ['direksiyon', 'Direksiyon'],
        ],
      ],
    ]),
    dal('dijital-danismanlik', 'Dijital hizmetler ve danışmanlık', [
      [
        'dijital',
        'Dijital hizmetler',
        [
          ['web', 'Web sitesi geliştirme'],
          ['mobil', 'Mobil uygulama geliştirme'],
          ['grafik', 'Grafik tasarım'],
          ['sosyal-medya', 'Sosyal medya yönetimi'],
        ],
      ],
      [
        'danismanlik',
        'Danışmanlık ve tercüme',
        [
          ['muhasebe', 'Muhasebe danışmanlığı'],
          ['kariyer', 'Kariyer danışmanlığı'],
          ['tercume', 'Tercüme'],
          ['is-gelistirme', 'İş geliştirme danışmanlığı'],
        ],
      ],
    ]),
  ],
};
