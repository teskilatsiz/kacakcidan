const dosyalar: Record<string, number> = {
  '/gorseller/playstation-5-detay.webp': require('../../public/gorseller/playstation-5-detay.webp'),
  '/gorseller/macbook-air-kapak.webp': require('../../public/gorseller/macbook-air-kapak.webp'),
  '/gorseller/macbook-air.webp': require('../../public/gorseller/macbook-air.webp'),
  '/gorseller/masa-lambasi.webp': require('../../public/gorseller/masa-lambasi.webp'),
  '/gorseller/kapak.webp': require('../../public/gorseller/kapak.webp'),
  '/gorseller/iphone-15-pro.webp': require('../../public/gorseller/iphone-15-pro.webp'),
  '/gorseller/iphone-15-pro-arka.webp': require('../../public/gorseller/iphone-15-pro-arka.webp'),
  '/gorseller/iphone-15-pro-ekran.webp': require('../../public/gorseller/iphone-15-pro-ekran.webp'),
  '/gorseller/playstation-5.webp': require('../../public/gorseller/playstation-5.webp'),
  '/gorseller/air-jordan.webp': require('../../public/gorseller/air-jordan.webp'),
  '/gorseller/kawasaki.webp': require('../../public/gorseller/kawasaki.webp'),
  '/gorseller/saat.webp': require('../../public/gorseller/saat.webp'),
  '/gorseller/fujifilm.webp': require('../../public/gorseller/fujifilm.webp'),
  '/gorseller/iphone-14-pro-max.webp': require('../../public/gorseller/iphone-14-pro-max.webp'),
  '/gorseller/samsung-s23-ultra.webp': require('../../public/gorseller/samsung-s23-ultra.webp'),
  '/gorseller/xiaomi-13t-pro.webp': require('../../public/gorseller/xiaomi-13t-pro.webp'),
  '/gorseller/pixel-7.webp': require('../../public/gorseller/pixel-7.webp'),
  '/gorseller/nothing-phone-2.webp': require('../../public/gorseller/nothing-phone-2.webp'),
  '/gorseller/iphone-13.webp': require('../../public/gorseller/iphone-13.webp'),
};

export function gorselKaynagi(yol: string): number | { uri: string } {
  return dosyalar[yol] ?? { uri: yol };
}
