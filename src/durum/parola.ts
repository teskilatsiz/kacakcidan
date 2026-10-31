import { getRandomBytesAsync } from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha512 } from '@noble/hashes/sha2.js';
import { onaltilik, ozetlerEsit, parolaTekrari, tuzBaytlari, type ParolaKaydi } from './parola.types';

async function parolaOzeti(sifre: string, tuz: Uint8Array) {
  // Uzun hesaplama sırasında JS döngüsüne düzenli olarak zaman bırakılır.
  const ozet = await pbkdf2Async(sha512, sifre, tuz, { c: parolaTekrari, dkLen: 32, asyncTick: 8 });
  return onaltilik(ozet);
}

export async function parolaOlustur(sifre: string): Promise<ParolaKaydi> {
  const tuz = await getRandomBytesAsync(16);
  return { tuz: onaltilik(tuz), ozet: await parolaOzeti(sifre, tuz) };
}

export async function parolaDogrula(sifre: string, kayit: ParolaKaydi): Promise<boolean> {
  return ozetlerEsit(await parolaOzeti(sifre, tuzBaytlari(kayit)), kayit.ozet);
}
