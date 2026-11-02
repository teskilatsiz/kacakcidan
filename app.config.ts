import type { ExpoConfig } from 'expo/config';

const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL || 'https://kacakcidan.netlify.app').replace(/\/$/, '');

const config: ExpoConfig = {
  name: 'Kaçakçıdan',
  slug: 'kacakcidan',
  version: '1.0.0',
  scheme: 'kacakcidan',
  orientation: 'default',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android', 'web'],
  android: { softwareKeyboardLayoutMode: 'resize' },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './public/favicon.png',
    name: 'Kaçakçıdan',
    shortName: 'Kaçakçıdan',
    description:
      'İkinci el otomobil, emlak ve ürün ilanlarını ara; iş ve hizmet ilanlarını incele. Fiyat ve konuma göre filtrele, satıcıyla iletişime geç veya kendi ilanını ver.',
    themeColor: '#ffd12f',
    backgroundColor: '#f6f6f3',
  },
  plugins: [
    ['expo-video', { supportsPictureInPicture: true, supportsBackgroundPlayback: false }],
    [
      'expo-router',
      {
        apiRoutes: false,
        // Geliştirme sunucusunda ekranı ilk kez açarken parçalı paket isteği
        // başarısız olursa tüm rota yüklemesi kırılmasın. Üretimde bölme sürer.
        asyncRoutes: { web: 'production' },
        ...(siteUrl ? { origin: siteUrl } : {}),
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Fotoğraf ve video seçmek için galerine erişim izni gerekiyor.',
        cameraPermission: false,
        microphonePermission: false,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    chunking: { mode: 'granular' },
  },
};

export default config;
