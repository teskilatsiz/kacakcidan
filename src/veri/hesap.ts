export function epostaDuzenle(eposta: string): string {
  return eposta.trim().toLowerCase();
}

export function kayitBilgisiHatasi({
  ad,
  eposta,
  sifre,
}: {
  ad: string;
  eposta: string;
  sifre: string;
}): string | undefined {
  if (ad.trim().length < 2 || ad.trim().length > 60) return 'Adın 2 ile 60 karakter arasında olmalı.';
  if (eposta.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epostaDuzenle(eposta)))
    return 'Geçerli bir e-posta adresi yaz.';
  if (sifre.length < 8 || sifre.length > 128) return 'Şifren 8 ile 128 karakter arasında olmalı.';
  return undefined;
}
