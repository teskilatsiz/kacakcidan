/** Cep telefonu numaraları depoda tek biçimde tutulur; gösterim biçimi kaydı değiştirmez. */
export function telefonuNormallestir(deger?: string): string | undefined {
  const giris = deger?.trim();
  if (!giris || !/^\+?[\d\s().-]+$/.test(giris)) return undefined;
  let rakamlar = giris.replace(/\D/g, '');
  if (rakamlar.startsWith('0090')) rakamlar = rakamlar.slice(4);
  else if (rakamlar.length === 12 && rakamlar.startsWith('90')) rakamlar = rakamlar.slice(2);
  else if (rakamlar.length === 11 && rakamlar.startsWith('0')) rakamlar = rakamlar.slice(1);
  if (!/^5\d{9}$/.test(rakamlar)) return undefined;
  if (giris.startsWith('+') && !giris.startsWith('+90')) return undefined;
  return `+90${rakamlar}`;
}

export function telefonHatasi(deger: string, gerekli = false): string {
  if (!deger.trim()) return gerekli ? 'Numaranı göstermek için cep telefonu numaranı yaz.' : '';
  return telefonuNormallestir(deger) ? '' : 'Geçerli bir cep telefonu numarası yaz. Örnek: 0532 123 45 67';
}

export function telefonuGoster(deger?: string): string {
  const numara = telefonuNormallestir(deger);
  if (!numara) return '';
  const yerel = numara.slice(3);
  return `0${yerel.slice(0, 3)} ${yerel.slice(3, 6)} ${yerel.slice(6, 8)} ${yerel.slice(8)}`;
}
