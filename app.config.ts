import type { ExpoConfig } from 'expo/config';

const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL || 'https://kacakcidan.netlify.app').replace(/\/$/, '');

const config: ExpoConfig = {
  name: 'Kaçakçıdan',
  slug: 'kacakcidan',
  version: '1.0.0',
  scheme: 'kacakcidan',
  orientation: 'default',
  userInterfaceStyle: 'light',
  platforms: ['ios', 'android', 'web'],
  android: { softwareKeyboardLayoutMode: 'resize' },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './public/favicon.png',
    name: 'Kaçakçıdan',
    shortName: 'Kaçakçıdan',
    description:
      'Telefon, bilgisayar, konsol ve daha pek çok ikinci el ilanını Kaçakçıdan’da bul. Fiyatları karşılaştır, satıcıya mesaj gönder, kullanmadıklarını satışa çıkar.',
    themeColor: '#ffd12f',
    backgroundColor: '#f6f6f3',
  },
  plugins: [
    [
      'expo-router',
      {
        apiRoutes: false,
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
  },
};

export default config;
