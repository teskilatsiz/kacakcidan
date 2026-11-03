export const ilanDurumlari = ['İkinci el', 'Sıfır'] as const;

export type IlanDurumu = (typeof ilanDurumlari)[number];

export function ilanDurumuGecerli(deger: unknown): deger is IlanDurumu {
  return deger === 'İkinci el' || deger === 'Sıfır';
}
