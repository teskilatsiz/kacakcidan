let veri: Promise<typeof import('./konumHaritasi')> | undefined;

export function haritaVerisiniYukle() {
  veri ??= import('./konumHaritasi').catch((hata: unknown) => {
    veri = undefined;
    throw hata;
  });
  return veri;
}

/** Sekmeye odaklanınca konum verisini hazırla; harita görüntülerini önceden indirme. */
export function haritaVerisiniHazirla() {
  void haritaVerisiniYukle().catch(() => {});
}
