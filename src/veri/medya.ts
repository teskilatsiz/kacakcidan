export const MEDYA_SINIRLARI = {
  fotografSayisi: 8,
  fotografBoyutu: 25 * 1024 * 1024,
  toplamFotografBoyutu: 150 * 1024 * 1024,
  videoBoyutu: 250 * 1024 * 1024,
  videoSuresi: 60_000,
} as const;

export function megabayt(boyut: number): number {
  return boyut / (1024 * 1024);
}

type MedyaBilgisi = {
  mimeType?: string;
  fileSize?: number;
  width: number;
  height: number;
  duration?: number | null;
};

export function fotografHatasi(fotograf: MedyaBilgisi, mevcut: MedyaBilgisi[]): string {
  if (mevcut.length >= MEDYA_SINIRLARI.fotografSayisi)
    return `En fazla ${MEDYA_SINIRLARI.fotografSayisi} fotoğraf ekleyebilirsin.`;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(fotograf.mimeType ?? ''))
    return 'Fotoğraf için JPG, PNG veya WebP dosyası seç.';
  if (!fotograf.width || !fotograf.height) return 'Bu fotoğraf açılamadı. Başka bir dosya dene.';
  if (
    !Number.isFinite(fotograf.fileSize) ||
    !fotograf.fileSize ||
    fotograf.fileSize < 0 ||
    fotograf.fileSize > MEDYA_SINIRLARI.fotografBoyutu
  )
    return `Her fotoğraf en fazla ${megabayt(MEDYA_SINIRLARI.fotografBoyutu)} MB olabilir.`;
  const toplam = mevcut.reduce((boyut, f) => boyut + (f.fileSize ?? 0), fotograf.fileSize);
  if (toplam > MEDYA_SINIRLARI.toplamFotografBoyutu)
    return `Fotoğrafların toplam boyutu en fazla ${megabayt(MEDYA_SINIRLARI.toplamFotografBoyutu)} MB olabilir.`;
  return '';
}

export function videoHatasi(video: MedyaBilgisi, web = false): string {
  if (!['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'].includes(video.mimeType ?? ''))
    return 'Video için MP4, WebM veya MOV dosyası seç.';
  if (
    !Number.isFinite(video.fileSize) ||
    !video.fileSize ||
    video.fileSize < 0 ||
    video.fileSize > MEDYA_SINIRLARI.videoBoyutu
  )
    return `Video en fazla ${megabayt(MEDYA_SINIRLARI.videoBoyutu)} MB olabilir.`;
  const sure = (video.duration ?? 0) * (web ? 1000 : 1);
  if (!Number.isFinite(sure) || sure <= 0 || !video.width || !video.height)
    return 'Bu video açılamadı. Başka bir dosya dene.';
  if (sure > MEDYA_SINIRLARI.videoSuresi)
    return `Video en fazla ${MEDYA_SINIRLARI.videoSuresi / 1000} saniye olabilir.`;
  return '';
}
