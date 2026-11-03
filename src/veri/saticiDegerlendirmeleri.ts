export type Alisveris = {
  id: string;
  ilanId: string;
  ilanBasligi: string;
  aliciId: string;
  aliciAd: string;
  saticiId: string;
  saticiAd: string;
  durum: 'onay-bekliyor' | 'tamamlandi' | 'iptal';
  tarih: string;
  aliciOnay?: string;
  saticiOnay?: string;
  tamamlanmaTarihi?: string;
  iptalTarihi?: string;
};

export type SaticiDegerlendirmesi = {
  id: string;
  alisverisId: string;
  ilanId: string;
  ilanBasligi: string;
  saticiId: string;
  yazanId: string;
  yazanAd: string;
  puan: number;
  yorum: string;
  tarih: string;
  guncellemeTarihi?: string;
  cevap?: string;
  cevapTarihi?: string;
};

export type DegerlendirmeKaydi = {
  alisverisler: Alisveris[];
  degerlendirmeler: SaticiDegerlendirmesi[];
  silinenDegerlendirmeler: string[];
};

type Sonuc = { basarili: true; kayit: DegerlendirmeKaydi } | { basarili: false; hata: string };

const duzenlemeSuresi = 14 * 24 * 60 * 60 * 1000;
const hata = (hata: string): Sonuc => ({ basarili: false, hata });

export function bosDegerlendirmeKaydi(): DegerlendirmeKaydi {
  return { alisverisler: [], degerlendirmeler: [], silinenDegerlendirmeler: [] };
}

export function degerlendirmeDuzenlenebilir(
  kayit: SaticiDegerlendirmesi,
  hesapId: string | null | undefined,
  simdi = Date.now(),
) {
  const gecen = simdi - Date.parse(kayit.tarih);
  return !!hesapId && kayit.yazanId === hesapId && gecen >= 0 && gecen <= duzenlemeSuresi;
}

export function saticiPuanOzeti(degerlendirmeler: SaticiDegerlendirmesi[], saticiId: string) {
  const liste = degerlendirmeler.filter((kayit) => kayit.saticiId === saticiId);
  const dagilim = [5, 4, 3, 2, 1].map((puan) => ({
    puan,
    sayi: liste.filter((kayit) => kayit.puan === puan).length,
  }));
  return {
    puan: liste.length
      ? Math.round((liste.reduce((toplam, kayit) => toplam + kayit.puan, 0) / liste.length) * 10) / 10
      : undefined,
    degerlendirmeSayisi: liste.length,
    dagilim,
  };
}

export function alisverisTalebiOlustur(
  kayit: DegerlendirmeKaydi,
  bilgi: Omit<Alisveris, 'durum' | 'aliciOnay' | 'saticiOnay' | 'tamamlanmaTarihi' | 'iptalTarihi'>,
): Sonuc {
  if (!bilgi.aliciId || !bilgi.saticiId) return hata('Alışverişini bildirmek için giriş yap.');
  if (bilgi.aliciId === bilgi.saticiId) return hata('Kendi ilanından alışveriş yapamazsın.');
  if (!bilgi.id || kayit.alisverisler.some((islem) => islem.id === bilgi.id))
    return hata('Bu alışveriş zaten kaydedilmiş.');
  if (kayit.alisverisler.some((islem) => islem.ilanId === bilgi.ilanId && islem.durum === 'tamamlandi'))
    return hata('Bu ilanın alışverişi tamamlanmış.');
  if (
    kayit.alisverisler.some(
      (islem) =>
        islem.ilanId === bilgi.ilanId && islem.aliciId === bilgi.aliciId && islem.durum === 'onay-bekliyor',
    )
  )
    return hata('Bu ilan için bekleyen bir alışveriş bildirimin var. Hesabından takip edebilirsin.');
  return {
    basarili: true,
    kayit: { ...kayit, alisverisler: [{ ...bilgi, durum: 'onay-bekliyor' }, ...kayit.alisverisler] },
  };
}

export function alisverisTesliminiOnayla(
  kayit: DegerlendirmeKaydi,
  id: string,
  hesapId: string | null,
  tarih: string,
): Sonuc {
  const islem = kayit.alisverisler.find((islem) => islem.id === id);
  if (!hesapId || !islem || ![islem.aliciId, islem.saticiId].includes(hesapId))
    return hata('Yalnızca tarafı olduğun alışverişi onaylayabilirsin.');
  if (islem.durum !== 'onay-bekliyor') return hata('Bu alışveriş için onay verilemiyor.');
  const alan = islem.aliciId === hesapId ? 'aliciOnay' : 'saticiOnay';
  if (islem[alan]) return hata('Teslim onayını zaten verdin. Diğer tarafın onayı bekleniyor.');
  const yeni = { ...islem, [alan]: tarih };
  const tamamlandi = !!yeni.aliciOnay && !!yeni.saticiOnay;
  return {
    basarili: true,
    kayit: {
      ...kayit,
      alisverisler: kayit.alisverisler.map((diger) => {
        if (diger.id === id)
          return tamamlandi ? { ...yeni, durum: 'tamamlandi', tamamlanmaTarihi: tarih } : yeni;
        if (tamamlandi && diger.ilanId === islem.ilanId && diger.durum === 'onay-bekliyor')
          return { ...diger, durum: 'iptal', iptalTarihi: tarih };
        return diger;
      }),
    },
  };
}

export function alisverisTalebiniIptalEt(
  kayit: DegerlendirmeKaydi,
  id: string,
  hesapId: string | null,
  tarih: string,
): Sonuc {
  const islem = kayit.alisverisler.find((islem) => islem.id === id);
  if (!hesapId || !islem || ![islem.aliciId, islem.saticiId].includes(hesapId))
    return hata('Yalnızca tarafı olduğun alışverişi iptal edebilirsin.');
  if (islem.durum !== 'onay-bekliyor') return hata('Tamamlanan veya iptal edilen alışveriş değiştirilemez.');
  return {
    basarili: true,
    kayit: {
      ...kayit,
      alisverisler: kayit.alisverisler.map((islem) =>
        islem.id === id ? { ...islem, durum: 'iptal', iptalTarihi: tarih } : islem,
      ),
    },
  };
}

function yorumHatasi(puan: number, yorum: string) {
  if (!Number.isInteger(puan) || puan < 1 || puan > 5) return '1 ile 5 arasında bir puan seç.';
  if (yorum.trim().length > 1000) return 'Yorumunu en fazla 1000 karakterle yaz.';
}

export function degerlendirmeOlustur(
  kayit: DegerlendirmeKaydi,
  bilgi: { id: string; alisverisId: string; puan: number; yorum: string },
  hesapId: string | null,
  tarih: string,
): Sonuc {
  const islem = kayit.alisverisler.find((islem) => islem.id === bilgi.alisverisId);
  if (!hesapId || !islem || islem.aliciId !== hesapId || islem.saticiId === hesapId)
    return hata('Yalnızca kendi alışverişindeki satıcıyı değerlendirebilirsin.');
  if (islem.durum !== 'tamamlandi' || !islem.aliciOnay || !islem.saticiOnay)
    return hata('Değerlendirme için alıcı ve satıcının teslimi onaylaması gerekiyor.');
  if (
    kayit.silinenDegerlendirmeler.includes(islem.id) ||
    kayit.degerlendirmeler.some((kayit) => kayit.alisverisId === islem.id || kayit.id === bilgi.id)
  )
    return hata('Her alışveriş için bir değerlendirme yazabilirsin.');
  const sorun = yorumHatasi(bilgi.puan, bilgi.yorum);
  if (sorun) return hata(sorun);
  return {
    basarili: true,
    kayit: {
      ...kayit,
      degerlendirmeler: [
        {
          id: bilgi.id,
          alisverisId: islem.id,
          ilanId: islem.ilanId,
          ilanBasligi: islem.ilanBasligi,
          saticiId: islem.saticiId,
          yazanId: hesapId,
          yazanAd: islem.aliciAd,
          puan: bilgi.puan,
          yorum: bilgi.yorum.trim(),
          tarih,
        },
        ...kayit.degerlendirmeler,
      ],
    },
  };
}

export function degerlendirmeyiGuncelle(
  kayit: DegerlendirmeKaydi,
  id: string,
  bilgi: { puan: number; yorum: string },
  hesapId: string | null,
  tarih: string,
): Sonuc {
  const onceki = kayit.degerlendirmeler.find((kayit) => kayit.id === id);
  if (!onceki || !degerlendirmeDuzenlenebilir(onceki, hesapId, Date.parse(tarih)))
    return hata('Kendi değerlendirmeni gönderdiğin tarihten itibaren 14 gün içinde düzenleyebilirsin.');
  const sorun = yorumHatasi(bilgi.puan, bilgi.yorum);
  if (sorun) return hata(sorun);
  return {
    basarili: true,
    kayit: {
      ...kayit,
      degerlendirmeler: kayit.degerlendirmeler.map((kayit) =>
        kayit.id === id
          ? { ...kayit, puan: bilgi.puan, yorum: bilgi.yorum.trim(), guncellemeTarihi: tarih }
          : kayit,
      ),
    },
  };
}

export function degerlendirmeyiSil(kayit: DegerlendirmeKaydi, id: string, hesapId: string | null): Sonuc {
  const onceki = kayit.degerlendirmeler.find((kayit) => kayit.id === id);
  if (!hesapId || !onceki || onceki.yazanId !== hesapId)
    return hata('Yalnızca kendi değerlendirmeni silebilirsin.');
  return {
    basarili: true,
    kayit: {
      ...kayit,
      degerlendirmeler: kayit.degerlendirmeler.filter((kayit) => kayit.id !== id),
      silinenDegerlendirmeler: [...kayit.silinenDegerlendirmeler, onceki.alisverisId],
    },
  };
}

export function degerlendirmeyeCevapVer(
  kayit: DegerlendirmeKaydi,
  id: string,
  cevap: string,
  hesapId: string | null,
  tarih: string,
): Sonuc {
  const onceki = kayit.degerlendirmeler.find((kayit) => kayit.id === id);
  if (!hesapId || !onceki || onceki.saticiId !== hesapId)
    return hata('Yalnızca sana yapılan değerlendirmeleri yanıtlayabilirsin.');
  const metin = cevap.trim();
  if (!metin || metin.length > 1000) return hata('Yanıtını 1–1000 karakter arasında yaz.');
  return {
    basarili: true,
    kayit: {
      ...kayit,
      degerlendirmeler: kayit.degerlendirmeler.map((kayit) =>
        kayit.id === id ? { ...kayit, cevap: metin, cevapTarihi: tarih } : kayit,
      ),
    },
  };
}

function nesne(veri: unknown): veri is Record<string, unknown> {
  return !!veri && typeof veri === 'object' && !Array.isArray(veri);
}
function tarihGecerli(veri: unknown): veri is string {
  return typeof veri === 'string' && Number.isFinite(Date.parse(veri));
}

/** Eski depolara boş kayıt ekler; yetim ve birbiriyle çelişen değerlendirmeleri taşımaz. */
export function degerlendirmeKaydiniOku(veri: unknown, hesapKimlikleri: Set<string>): DegerlendirmeKaydi {
  const sonuc = bosDegerlendirmeKaydi();
  if (!nesne(veri)) return sonuc;
  const islemKimlikleri = new Set<string>();
  const tamamlananIlanlar = new Set<string>();
  for (const aday of Array.isArray(veri.alisverisler) ? veri.alisverisler : []) {
    if (
      !nesne(aday) ||
      !['id', 'ilanId', 'ilanBasligi', 'aliciId', 'aliciAd', 'saticiId', 'saticiAd'].every(
        (alan) => typeof aday[alan] === 'string' && !!aday[alan],
      ) ||
      !tarihGecerli(aday.tarih) ||
      !['onay-bekliyor', 'tamamlandi', 'iptal'].includes(String(aday.durum)) ||
      aday.aliciId === aday.saticiId ||
      !hesapKimlikleri.has(String(aday.aliciId)) ||
      islemKimlikleri.has(String(aday.id))
    )
      continue;
    const aliciOnay =
      tarihGecerli(aday.aliciOnay) && Date.parse(aday.aliciOnay) >= Date.parse(aday.tarih)
        ? aday.aliciOnay
        : undefined;
    const saticiOnay =
      hesapKimlikleri.has(String(aday.saticiId)) &&
      tarihGecerli(aday.saticiOnay) &&
      Date.parse(aday.saticiOnay) >= Date.parse(aday.tarih)
        ? aday.saticiOnay
        : undefined;
    const tamamlandi = aday.durum === 'tamamlandi' && !!aliciOnay && !!saticiOnay;
    if (tamamlandi && tamamlananIlanlar.has(String(aday.ilanId))) continue;
    const kayit: Alisveris = {
      id: String(aday.id),
      ilanId: String(aday.ilanId),
      ilanBasligi: String(aday.ilanBasligi),
      aliciId: String(aday.aliciId),
      aliciAd: String(aday.aliciAd),
      saticiId: String(aday.saticiId),
      saticiAd: String(aday.saticiAd),
      tarih: aday.tarih,
      durum: aday.durum === 'iptal' ? 'iptal' : tamamlandi ? 'tamamlandi' : 'onay-bekliyor',
      ...(aliciOnay ? { aliciOnay } : {}),
      ...(saticiOnay ? { saticiOnay } : {}),
      ...(tamamlandi ? { tamamlanmaTarihi: [aliciOnay!, saticiOnay!].sort().at(-1)! } : {}),
      ...(aday.durum === 'iptal' && tarihGecerli(aday.iptalTarihi) ? { iptalTarihi: aday.iptalTarihi } : {}),
    };
    sonuc.alisverisler.push(kayit);
    islemKimlikleri.add(kayit.id);
    if (tamamlandi) tamamlananIlanlar.add(kayit.ilanId);
  }
  const tamamlananlar = new Map(
    sonuc.alisverisler.filter((islem) => islem.durum === 'tamamlandi').map((islem) => [islem.id, islem]),
  );
  sonuc.silinenDegerlendirmeler = [
    ...new Set(
      (Array.isArray(veri.silinenDegerlendirmeler) ? veri.silinenDegerlendirmeler : []).filter(
        (id): id is string => typeof id === 'string' && tamamlananlar.has(id),
      ),
    ),
  ];
  const yorumKimlikleri = new Set<string>();
  const yorumlananlar = new Set(sonuc.silinenDegerlendirmeler);
  for (const aday of Array.isArray(veri.degerlendirmeler) ? veri.degerlendirmeler : []) {
    if (!nesne(aday)) continue;
    const islem = tamamlananlar.get(String(aday.alisverisId));
    if (
      !islem ||
      typeof aday.id !== 'string' ||
      !aday.id ||
      yorumKimlikleri.has(aday.id) ||
      yorumlananlar.has(islem.id) ||
      aday.yazanId !== islem.aliciId ||
      aday.saticiId !== islem.saticiId ||
      aday.ilanId !== islem.ilanId ||
      typeof aday.puan !== 'number' ||
      typeof aday.yorum !== 'string' ||
      yorumHatasi(aday.puan, aday.yorum) ||
      !tarihGecerli(aday.tarih) ||
      Date.parse(aday.tarih) < Date.parse(islem.tamamlanmaTarihi!)
    )
      continue;
    sonuc.degerlendirmeler.push({
      id: aday.id,
      alisverisId: islem.id,
      ilanId: islem.ilanId,
      ilanBasligi: islem.ilanBasligi,
      saticiId: islem.saticiId,
      yazanId: islem.aliciId,
      yazanAd: islem.aliciAd,
      puan: aday.puan,
      yorum: aday.yorum.trim(),
      tarih: aday.tarih,
      ...(tarihGecerli(aday.guncellemeTarihi) ? { guncellemeTarihi: aday.guncellemeTarihi } : {}),
      ...(typeof aday.cevap === 'string' &&
      aday.cevap.trim() &&
      aday.cevap.trim().length <= 1000 &&
      tarihGecerli(aday.cevapTarihi)
        ? { cevap: aday.cevap.trim(), cevapTarihi: aday.cevapTarihi }
        : {}),
    });
    yorumKimlikleri.add(aday.id);
    yorumlananlar.add(islem.id);
  }
  return sonuc;
}
