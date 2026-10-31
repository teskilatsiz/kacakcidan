import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { MEDYA_SINIRLARI } from '../veri/medya';

export async function medyaSec(
  tur: 'fotograf' | 'video',
  mevcut: ImagePickerAsset[],
): Promise<ImagePickerAsset[]> {
  if (tur === 'fotograf' && mevcut.length >= MEDYA_SINIRLARI.fotografSayisi)
    throw new Error(`En fazla ${MEDYA_SINIRLARI.fotografSayisi} fotoğraf ekleyebilirsin.`);
  const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!izin.granted) throw new Error('Dosya seçmek için fotoğraf arşivine erişim izni gerekiyor.');
  const sonuc = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: tur === 'video' ? ['videos'] : ['images'],
    allowsMultipleSelection: tur === 'fotograf',
    selectionLimit: tur === 'fotograf' ? MEDYA_SINIRLARI.fotografSayisi - mevcut.length : 1,
    quality: 0.85,
    base64: false,
    videoMaxDuration: MEDYA_SINIRLARI.videoSuresi / 1000,
  });
  return sonuc.canceled ? [] : sonuc.assets;
}
