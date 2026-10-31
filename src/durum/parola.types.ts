export type ParolaKaydi = { tuz: string; ozet: string };

export const parolaTekrari = 210_000;

export function onaltilik(baytlar: Uint8Array): string {
  return Array.from(baytlar, (bayt) => bayt.toString(16).padStart(2, '0')).join('');
}

export function tuzBaytlari(kayit: ParolaKaydi): Uint8Array<ArrayBuffer> {
  if (!/^[a-f0-9]{32}$/.test(kayit.tuz) || !/^[a-f0-9]{64}$/.test(kayit.ozet)) {
    throw new Error('Geçersiz parola kaydı.');
  }
  return Uint8Array.from(kayit.tuz.match(/.{2}/g)!, (bayt) => parseInt(bayt, 16));
}

export function ozetlerEsit(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return fark === 0;
}
