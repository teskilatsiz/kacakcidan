import type { ImagePickerAsset } from 'expo-image-picker';
import { fotografHatasi, MEDYA_SINIRLARI, videoHatasi } from '../veri/medya';

function bilgileriOku(dosya: File, tur: 'fotograf' | 'video'): Promise<ImagePickerAsset> {
  const uri = URL.createObjectURL(dosya);
  return new Promise((resolve, reject) => {
    const oge = tur === 'fotograf' ? document.createElement('img') : document.createElement('video');
    const temizle = () => {
      clearTimeout(zaman);
      oge.onload = null;
      oge.onerror = null;
      if (oge instanceof HTMLVideoElement) {
        oge.onloadedmetadata = null;
        oge.removeAttribute('src');
        oge.load();
      }
    };
    const hata = () => {
      temizle();
      URL.revokeObjectURL(uri);
      reject(new Error(`${dosya.name} açılamadı. Başka bir dosya seç.`));
    };
    const zaman = setTimeout(hata, 10_000);
    const tamam = () => {
      const medya: ImagePickerAsset = {
        uri,
        width: oge instanceof HTMLVideoElement ? oge.videoWidth : oge.naturalWidth,
        height: oge instanceof HTMLVideoElement ? oge.videoHeight : oge.naturalHeight,
        duration: oge instanceof HTMLVideoElement ? oge.duration : undefined,
        fileName: dosya.name,
        fileSize: dosya.size,
        mimeType: dosya.type,
        file: dosya,
        type: tur === 'fotograf' ? 'image' : 'video',
      };
      temizle();
      resolve(medya);
    };
    if (oge instanceof HTMLVideoElement) {
      oge.preload = 'metadata';
      oge.onloadedmetadata = tamam;
    } else {
      oge.onload = tamam;
    }
    oge.onerror = hata;
    oge.src = uri;
  });
}

/** Sayı ve boyut denetimi görseller açılmadan yapılır; dosyalar sırayla okunur. */
export function medyaSec(tur: 'fotograf' | 'video', mevcut: ImagePickerAsset[]): Promise<ImagePickerAsset[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.name = `ilan-${tur}`;
    input.accept =
      tur === 'fotograf'
        ? 'image/jpeg,image/png,image/webp'
        : 'video/mp4,video/webm,video/quicktime,video/x-m4v';
    input.multiple = tur === 'fotograf';
    input.hidden = true;
    input.dataset.testid = `medya-${tur}`;
    document.body.appendChild(input);
    const kapat = () => input.remove();
    input.addEventListener(
      'cancel',
      () => {
        kapat();
        resolve([]);
      },
      { once: true },
    );
    input.addEventListener(
      'change',
      async () => {
        const dosyalar = Array.from(input.files ?? []);
        kapat();
        const secilenler: ImagePickerAsset[] = [];
        try {
          if (tur === 'fotograf' && dosyalar.length + mevcut.length > MEDYA_SINIRLARI.fotografSayisi)
            throw new Error(
              `En fazla ${MEDYA_SINIRLARI.fotografSayisi} fotoğraf ekleyebilirsin. ${Math.max(0, MEDYA_SINIRLARI.fotografSayisi - mevcut.length)} fotoğraf daha seçebilirsin.`,
            );
          if (tur === 'video' && dosyalar.length > 1) throw new Error('Bir video seçebilirsin.');
          const denetlenen = [...mevcut];
          for (const dosya of dosyalar) {
            const bilgi = { width: 1, height: 1, duration: 1, fileSize: dosya.size, mimeType: dosya.type };
            const sorun = tur === 'fotograf' ? fotografHatasi(bilgi, denetlenen) : videoHatasi(bilgi, true);
            if (sorun) throw new Error(`${dosya.name}: ${sorun}`);
            if (tur === 'fotograf') denetlenen.push({ ...bilgi, uri: '' });
          }
          for (const dosya of dosyalar) {
            const medya = await bilgileriOku(dosya, tur);
            secilenler.push(medya);
            const sorun =
              tur === 'fotograf'
                ? fotografHatasi(medya, [...mevcut, ...secilenler.slice(0, -1)])
                : videoHatasi(medya, true);
            if (sorun) throw new Error(`${dosya.name}: ${sorun}`);
          }
          resolve(secilenler);
        } catch (hata) {
          secilenler.forEach((medya) => URL.revokeObjectURL(medya.uri));
          reject(hata);
        }
      },
      { once: true },
    );
    input.click();
  });
}
