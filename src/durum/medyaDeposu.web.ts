import { useEffect, useState } from 'react';
import type { ImagePickerAsset } from 'expo-image-picker';

const VERITABANI = 'kacakcidan-medya';
const TABLO = 'dosyalar';
let baglanti: Promise<IDBDatabase> | undefined;

async function kayitHatasi(hata: unknown): Promise<Error> {
  if (hata instanceof DOMException && hata.name === 'QuotaExceededError') {
    const tahmin = await navigator.storage?.estimate?.().catch(() => undefined);
    const kalan =
      tahmin?.quota !== undefined && tahmin.usage !== undefined
        ? Math.max(0, Math.floor((tahmin.quota - tahmin.usage) / (1024 * 1024)))
        : undefined;
    return new Error(
      `Tarayıcında bu dosya için yeterli depolama alanı kalmadı.${kalan !== undefined ? ` Yaklaşık ${kalan} MB alan kullanılabilir.` : ''} Daha küçük bir dosya seç veya yer açıp tekrar dene. İlan bilgilerin burada duruyor.`,
      { cause: hata },
    );
  }
  return new Error(
    'Dosya kaydedilemedi. Tarayıcının depolama izinlerini ve boş alanı kontrol edip tekrar dene.',
    { cause: hata },
  );
}

function depoyuAc() {
  if (!baglanti) {
    baglanti = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('Medya depolaması açılamadı. Tarayıcı ayarlarını kontrol edip tekrar dene.'));
        return;
      }
      const istek = indexedDB.open(VERITABANI, 1);
      istek.onupgradeneeded = () => {
        if (!istek.result.objectStoreNames.contains(TABLO)) istek.result.createObjectStore(TABLO);
      };
      istek.onsuccess = () => {
        const db = istek.result;
        db.onversionchange = () => {
          db.close();
          baglanti = undefined;
        };
        db.onclose = () => {
          baglanti = undefined;
        };
        resolve(db);
      };
      istek.onerror = () => reject(istek.error ?? new Error('Medya depolaması açılamadı.'));
    }).catch((hata) => {
      baglanti = undefined;
      throw hata;
    });
  }
  return baglanti;
}

export async function medyaKaydet(medya: ImagePickerAsset): Promise<string> {
  if (medya.uri.startsWith('medya:')) return medya.uri;
  const dosya =
    medya.file ??
    (await fetch(medya.uri).then((yanit) => {
      if (!yanit.ok) throw new Error('Seçilen dosya okunamadı.');
      return yanit.blob();
    }));
  const db = await depoyuAc();
  const anahtar = `medya:${crypto.randomUUID()}`;
  try {
    await new Promise<void>((resolve, reject) => {
      const islem = db.transaction(TABLO, 'readwrite');
      const istek = islem.objectStore(TABLO).put(dosya, anahtar);
      islem.oncomplete = () => resolve();
      islem.onerror = () => reject(istek.error ?? islem.error);
      islem.onabort = () => reject(istek.error ?? islem.error);
    });
  } catch (hata) {
    throw await kayitHatasi(hata);
  }
  return anahtar;
}

/** Düzenlemede boyutları tek işlemle okur; dosyalar çözülmez veya yeniden yazılmaz. */
export async function medyaBoyutlariniOku(kaynaklar: string[]): Promise<Record<string, number>> {
  const yerel = [...new Set(kaynaklar.filter((kaynak) => kaynak.startsWith('medya:')))];
  if (!yerel.length) return {};
  const db = await depoyuAc();
  return new Promise((resolve, reject) => {
    const boyutlar: Record<string, number> = {};
    const islem = db.transaction(TABLO, 'readonly');
    const tablo = islem.objectStore(TABLO);
    for (const kaynak of yerel) {
      const istek = tablo.get(kaynak);
      istek.onsuccess = () => {
        if (istek.result instanceof Blob) boyutlar[kaynak] = istek.result.size;
      };
    }
    islem.oncomplete = () => resolve(boyutlar);
    islem.onerror = () => reject(new Error('Fotoğraf bilgileri okunamadı. Sayfayı yenileyip tekrar dene.'));
    islem.onabort = () => reject(new Error('Fotoğraf bilgileri okunamadı. Sayfayı yenileyip tekrar dene.'));
  });
}

export async function medyaSil(kaynak: string): Promise<void> {
  if (!kaynak.startsWith('medya:')) return;
  const db = await depoyuAc();
  await new Promise<void>((resolve, reject) => {
    const islem = db.transaction(TABLO, 'readwrite');
    islem.objectStore(TABLO).delete(kaynak);
    islem.oncomplete = () => resolve();
    islem.onerror = () => reject(islem.error);
    islem.onabort = () => reject(islem.error);
  });
}

async function medyaOku(kaynak: string): Promise<Blob | undefined> {
  const db = await depoyuAc();
  return new Promise((resolve, reject) => {
    const istek = db.transaction(TABLO, 'readonly').objectStore(TABLO).get(kaynak);
    istek.onsuccess = () => resolve(istek.result instanceof Blob ? istek.result : undefined);
    istek.onerror = () => reject(istek.error);
  });
}

/** Kalıcı medya anahtarını yalnızca görünür olduğu sürece bellekte tutar. */
export function useMedyaAdresi(kaynak: string | undefined): string | undefined {
  const [cozulmus, setCozulmus] = useState<{ kaynak: string; adres: string }>();
  useEffect(() => {
    if (!kaynak?.startsWith('medya:')) return;
    let etkin = true;
    let adres: string | undefined;
    medyaOku(kaynak)
      .then((dosya) => {
        if (!etkin || !dosya) return;
        adres = URL.createObjectURL(dosya);
        setCozulmus({ kaynak, adres });
      })
      .catch(() => {
        /* Silinen veya erişilemeyen medya için bozuk bir URL üretme. */
      });
    return () => {
      etkin = false;
      if (adres) URL.revokeObjectURL(adres);
    };
  }, [kaynak]);
  if (!kaynak?.startsWith('medya:')) return kaynak;
  return cozulmus?.kaynak === kaynak ? cozulmus.adres : undefined;
}

export function medyaOnizlemesiniBirak(kaynak: string) {
  if (kaynak.startsWith('blob:')) URL.revokeObjectURL(kaynak);
}
