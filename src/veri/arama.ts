import type { KategoriAgaci } from './kategoriler';
import type { Ilan, Kategori } from './ilanlar';

type KategoriBilgisi = { id: Kategori; ad: string };
export type AramaKutusuProps = {
  deger: string;
  degistir: (metin: string) => void;
  ara: (sorgu?: string) => void;
  buyuk?: boolean;
  inline?: boolean;
  sade?: boolean;
  secildi?: () => void;
};
export type AramaOnerisi =
  | { id: string; tur: 'ilan'; baslik: string; ilan: Ilan }
  | {
      id: string;
      tur: 'kategori';
      baslik: string;
      kategori: Kategori;
      altKategori?: string;
      marka?: string;
      model?: string;
      seviye: string;
      adet: number;
    }
  | { id: string; tur: 'sorgu'; baslik: string; sorgu: string; adet: number };

/** Türkçe karakterlerle ve telefonda ASCII yazarak aynı ürüne ulaşılabilir. */
export function aramaIcinDuzelt(yazi: string) {
  return yazi
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/ı/g, 'i')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function tumSozcukler(yazi: string, sozcukler: string[]) {
  return sozcukler.every((sozcuk) => yazi.includes(sozcuk));
}

function ilanKategoriYolu(ilan: Ilan, kategoriBilgileri: KategoriBilgisi[], agac: KategoriAgaci) {
  const kategori = kategoriBilgileri.find((secenek) => secenek.id === ilan.kategori);
  const alt = agac[ilan.kategori]?.find((secenek) => secenek.id === ilan.altKategori);
  const marka = alt?.markalar.find((secenek) => secenek.id === ilan.marka);
  const model = marka?.modeller.find((secenek) => secenek.id === ilan.model);
  return [kategori?.ad, alt?.ad ?? ilan.altKategori, marka?.ad ?? ilan.marka, model?.ad ?? ilan.model].filter(
    (ad): ad is string => Boolean(ad),
  );
}

function ilanAramaMetni(ilan: Ilan, kategoriBilgileri: KategoriBilgisi[], agac: KategoriAgaci) {
  return aramaIcinDuzelt(
    [
      ilan.baslik,
      ilan.aciklama,
      ...ilanKategoriYolu(ilan, kategoriBilgileri, agac),
      ...Object.entries(ilan.ozellikler ?? {}).flat(),
    ].join(' '),
  );
}

const durakSozcukler = new Set(['ama', 'bir', 'bu', 'da', 'daha', 'de', 'ile', 'icin', 've', 'veya']);

/** İlan metinlerinden kısa, gerçekten eşleşen arama ifadeleri çıkarır. */
function anahtarKelimeOnerileri(
  liste: Ilan[],
  kategoriBilgileri: KategoriBilgisi[],
  agac: KategoriAgaci,
  sorgu: string,
) {
  const sozcukler = sorgu.split(' ');
  const adaylar = new Map<string, { baslik: string; ilanlar: Set<string> }>();

  for (const ilan of liste) {
    const alanlar = [
      ilan.baslik,
      ilan.aciklama,
      ...ilanKategoriYolu(ilan, kategoriBilgileri, agac),
      ...Object.entries(ilan.ozellikler ?? {}).flat(),
    ];
    for (const alan of alanlar) {
      for (const bolum of alan.split(/[.!?;,:()•\n]+/)) {
        const kelimeler = bolum
          .split(/\s+/)
          .map((kelime) => kelime.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
          .filter((kelime) => {
            const duzeltilmis = aramaIcinDuzelt(kelime);
            return duzeltilmis.length > 1 && !durakSozcukler.has(duzeltilmis);
          });

        for (let baslangic = 0; baslangic < kelimeler.length; baslangic += 1) {
          for (let uzunluk = 1; uzunluk <= 3 && baslangic + uzunluk <= kelimeler.length; uzunluk += 1) {
            const ifade = kelimeler.slice(baslangic, baslangic + uzunluk).join(' ');
            const duzeltilmis = aramaIcinDuzelt(ifade);
            if (duzeltilmis === sorgu || !tumSozcukler(duzeltilmis, sozcukler)) continue;
            if (!adaylar.has(duzeltilmis)) adaylar.set(duzeltilmis, { baslik: ifade, ilanlar: new Set() });
            adaylar.get(duzeltilmis)?.ilanlar.add(ilan.id);
          }
        }
      }
    }

    // İlan başlığına tam uyan aramalar, kısa açıklama parçalarına göre önce gelir.
    const baslikSozcukleri = ilan.baslik.split(/\s+/);
    for (let baslangic = 0; baslangic < baslikSozcukleri.length; baslangic += 1) {
      for (let uzunluk = 1; uzunluk <= 3 && baslangic + uzunluk <= baslikSozcukleri.length; uzunluk += 1) {
        const ifade = baslikSozcukleri.slice(baslangic, baslangic + uzunluk).join(' ');
        const duzeltilmis = aramaIcinDuzelt(ifade);
        if (duzeltilmis === sorgu || !tumSozcukler(duzeltilmis, sozcukler)) continue;
        if (!adaylar.has(duzeltilmis)) adaylar.set(duzeltilmis, { baslik: ifade, ilanlar: new Set() });
        adaylar.get(duzeltilmis)?.ilanlar.add(ilan.id);
      }
    }
  }

  return [...adaylar.entries()]
    .filter(([duzeltilmis, aday]) => aday.baslik.length > 1 && tumSozcukler(duzeltilmis, sozcukler))
    .sort(([duzA, adayA], [duzB, adayB]) => {
      const baslangicA = duzA.startsWith(sorgu) ? 1 : 0;
      const baslangicB = duzB.startsWith(sorgu) ? 1 : 0;
      return baslangicB - baslangicA || adayB.ilanlar.size - adayA.ilanlar.size || duzA.length - duzB.length;
    })
    .slice(0, 2)
    .map(([duzeltilmis, aday]) => ({
      id: `sorgu-${duzeltilmis}`,
      tur: 'sorgu' as const,
      baslik: aday.baslik,
      sorgu: aday.baslik,
      adet: aday.ilanlar.size,
    }));
}

export function aramaOnerileri(
  liste: Ilan[],
  kategoriBilgileri: KategoriBilgisi[],
  agac: KategoriAgaci,
  sorgu: string,
): AramaOnerisi[] {
  const duz = aramaIcinDuzelt(sorgu);
  if (!duz) {
    const sorgular = ['iPhone', 'PlayStation', 'MacBook'].flatMap((baslik) => {
      const aranan = aramaIcinDuzelt(baslik);
      const adet = liste.filter((ilan) =>
        ilanAramaMetni(ilan, kategoriBilgileri, agac).includes(aranan),
      ).length;
      return adet ? [{ id: `sorgu-${aranan}`, tur: 'sorgu' as const, baslik, sorgu: baslik, adet }] : [];
    });
    const fotografSayisi = liste.filter((ilan) => ilan.kategori === 'fotograf').length;
    return [
      ...sorgular.slice(0, 2),
      ...(fotografSayisi
        ? [
            {
              id: 'kategori-fotograf',
              tur: 'kategori' as const,
              baslik: 'Fotoğraf',
              kategori: 'fotograf' as const,
              seviye: 'Kategori',
              adet: fotografSayisi,
            },
          ]
        : []),
      ...sorgular.slice(2),
    ];
  }

  const sozcukler = duz.split(' ');
  const metinler = new Map(liste.map((ilan) => [ilan.id, ilanAramaMetni(ilan, kategoriBilgileri, agac)]));
  const eslesen = liste
    .flatMap((ilan, sira) => {
      const baslik = aramaIcinDuzelt(ilan.baslik);
      const yol = aramaIcinDuzelt(ilanKategoriYolu(ilan, kategoriBilgileri, agac).join(' '));
      const metin = metinler.get(ilan.id) ?? '';
      const puan = baslik.startsWith(duz)
        ? 100
        : baslik.includes(duz)
          ? 80
          : tumSozcukler(baslik, sozcukler)
            ? 75
            : tumSozcukler(yol, sozcukler)
              ? 70
              : tumSozcukler(metin, sozcukler)
                ? 40
                : 0;
      return puan ? [{ ilan, puan, sira }] : [];
    })
    .sort((a, b) => b.puan - a.puan || a.sira - b.sira);

  const kategoriOnerileri: Extract<AramaOnerisi, { tur: 'kategori' }>[] = [];
  const adayEkle = (aday: Extract<AramaOnerisi, { tur: 'kategori' }>, yol: string) => {
    const duzeltilmisYol = aramaIcinDuzelt(yol);
    if (!aday.adet || !tumSozcukler(duzeltilmisYol, sozcukler)) return;
    kategoriOnerileri.push(aday);
  };

  for (const kategori of kategoriBilgileri) {
    const kategoriIlanlari = liste.filter((ilan) => ilan.kategori === kategori.id);
    if (!kategoriIlanlari.length) continue;
    adayEkle(
      {
        id: `kategori-${kategori.id}`,
        tur: 'kategori',
        baslik: kategori.ad,
        kategori: kategori.id,
        seviye: 'Kategori',
        adet: kategoriIlanlari.length,
      },
      kategori.ad,
    );

    for (const alt of agac[kategori.id] ?? []) {
      const altIlanlari = kategoriIlanlari.filter((ilan) => ilan.altKategori === alt.id);
      if (!altIlanlari.length) continue;
      adayEkle(
        {
          id: `kategori-${kategori.id}-${alt.id}`,
          tur: 'kategori',
          baslik: `${kategori.ad} › ${alt.ad}`,
          kategori: kategori.id,
          altKategori: alt.id,
          seviye: 'Alt kategori',
          adet: altIlanlari.length,
        },
        `${kategori.ad} ${alt.ad}`,
      );

      for (const marka of alt.markalar) {
        const markaIlanlari = altIlanlari.filter((ilan) => ilan.marka === marka.id);
        if (!markaIlanlari.length) continue;
        adayEkle(
          {
            id: `kategori-${kategori.id}-${alt.id}-${marka.id}`,
            tur: 'kategori',
            baslik: `${kategori.ad} › ${alt.ad} › ${marka.ad}`,
            kategori: kategori.id,
            altKategori: alt.id,
            marka: marka.id,
            seviye: 'Marka',
            adet: markaIlanlari.length,
          },
          `${kategori.ad} ${alt.ad} ${marka.ad}`,
        );

        for (const model of marka.modeller) {
          const modelIlanlari = markaIlanlari.filter((ilan) => ilan.model === model.id);
          if (!modelIlanlari.length) continue;
          adayEkle(
            {
              id: `kategori-${kategori.id}-${alt.id}-${marka.id}-${model.id}`,
              tur: 'kategori',
              baslik: `${kategori.ad} › ${alt.ad} › ${marka.ad} › ${model.ad}`,
              kategori: kategori.id,
              altKategori: alt.id,
              marka: marka.id,
              model: model.id,
              seviye: 'Model',
              adet: modelIlanlari.length,
            },
            `${kategori.ad} ${alt.ad} ${marka.ad} ${model.ad}`,
          );
        }
      }
    }
  }

  const enUygunKategoriler = kategoriOnerileri
    .sort((a, b) => {
      const eslesmePuani = (baslik: string) => {
        const yol = baslik.split('›').map((parca) => aramaIcinDuzelt(parca));
        const sonParca = yol.at(-1) ?? '';
        if (sonParca === duz) return 4;
        if (sonParca.startsWith(duz)) return 3;
        if (tumSozcukler(sonParca, sozcukler)) return 2;
        return yol.some((parca) => parca === duz || tumSozcukler(parca, sozcukler)) ? 1 : 0;
      };
      return (
        eslesmePuani(b.baslik) - eslesmePuani(a.baslik) ||
        b.baslik.split('›').length - a.baslik.split('›').length ||
        b.adet - a.adet
      );
    })
    .slice(0, 3);

  const anahtarKelimeler = anahtarKelimeOnerileri(liste, kategoriBilgileri, agac, duz);
  const ilanOnerileri: AramaOnerisi[] = eslesen
    .slice(0, 3)
    .map(({ ilan }) => ({ id: `ilan-${ilan.id}`, tur: 'ilan', baslik: ilan.baslik, ilan }));

  return [...anahtarKelimeler, ...enUygunKategoriler, ...ilanOnerileri];
}
