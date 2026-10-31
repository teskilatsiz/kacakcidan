import { onaltilik, ozetlerEsit, parolaTekrari, tuzBaytlari, type ParolaKaydi } from './parola.types.ts';

async function parolaOzeti(sifre: string, tuz: Uint8Array<ArrayBuffer>) {
  // Yerel ağdaki HTTP geliştirme adreslerinde SubtleCrypto bulunmayabilir.
  if (!globalThis.crypto?.subtle) {
    const [{ pbkdf2Async }, { sha512 }] = await Promise.all([
      import('@noble/hashes/pbkdf2.js'),
      import('@noble/hashes/sha2.js'),
    ]);
    return onaltilik(await pbkdf2Async(sha512, sifre, tuz, { c: parolaTekrari, dkLen: 32, asyncTick: 8 }));
  }
  const anahtar = await crypto.subtle.importKey('raw', new TextEncoder().encode(sifre), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const ozet = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-512', salt: tuz, iterations: parolaTekrari },
    anahtar,
    256,
  );
  return onaltilik(new Uint8Array(ozet));
}

export async function parolaOlustur(sifre: string): Promise<ParolaKaydi> {
  const tuz = crypto.getRandomValues(new Uint8Array(16));
  return { tuz: onaltilik(tuz), ozet: await parolaOzeti(sifre, tuz) };
}

export async function parolaDogrula(sifre: string, kayit: ParolaKaydi): Promise<boolean> {
  const ozet = await parolaOzeti(sifre, tuzBaytlari(kayit));
  return ozetlerEsit(ozet, kayit.ozet);
}
