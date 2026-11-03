type Katalog = {
  kategoriYapisi: typeof import('./kategoriler.ts').kategoriYapisi;
  kategoriAgaci: typeof import('./kategoriler.ts').kategoriAgaci;
  kategoriAdresi: typeof import('./kategoriSayfalari.ts').kategoriAdresi;
};

let katalog: Katalog | undefined;
let istek: Promise<Katalog> | undefined;

export const kategoriKatalogunuOku = () => katalog;

/** Arama ve kategori menüsü aynı katalog isteğini paylaşır; bağlantı hatası yeniden denenebilir. */
export function kategoriKatalogunuYukle(): Promise<Katalog> {
  if (katalog) return Promise.resolve(katalog);
  if (!istek)
    istek = Promise.all([import('./kategoriler.ts'), import('./kategoriSayfalari.ts')])
      .then(([agac, sayfalar]) => {
        katalog = {
          kategoriYapisi: agac.kategoriYapisi,
          kategoriAgaci: agac.kategoriAgaci,
          kategoriAdresi: sayfalar.kategoriAdresi,
        };
        return katalog;
      })
      .catch((hata: unknown) => {
        istek = undefined;
        throw hata;
      });
  return istek;
}
