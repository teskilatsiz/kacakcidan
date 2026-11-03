/** Fiyat ve ölçü alanlarında rakamları ve tek bir Türkçe ondalık ayıracını korur. */
export function ondalikGirdisiniTemizle(deger: string, enCokOndalik = 2, enCokRakam = 12): string {
  const temiz = deger.replace(/[^\d.,]/g, '');
  const sonVirgul = temiz.lastIndexOf(',');
  const sonNokta = temiz.lastIndexOf('.');
  const ayiracKonumu = Math.max(sonVirgul, sonNokta);
  const sonEk = ayiracKonumu >= 0 ? temiz.slice(ayiracKonumu + 1).replace(/\D/g, '') : '';
  const binlikNokta =
    sonVirgul < 0 &&
    sonNokta >= 0 &&
    sonEk.length === 3 &&
    temiz.slice(0, sonNokta).replace(/\D/g, '').length > 0;
  const ondalikMi = ayiracKonumu >= 0 && !binlikNokta;
  const tamKisimHam = ondalikMi ? temiz.slice(0, ayiracKonumu) : temiz;
  const tamKisim = tamKisimHam.replace(/\D/g, '').slice(0, enCokRakam);
  if (!ondalikMi) return tamKisim;

  const kalanRakam = Math.max(0, enCokRakam - tamKisim.length);
  const kesir = sonEk.slice(0, Math.min(enCokOndalik, kalanRakam));
  return `${tamKisim},${kesir}`;
}

export function sayisalGirdiyiTemizle(deger: string, enCokRakam = 9): string {
  return deger.replace(/\D/g, '').slice(0, enCokRakam);
}

/** Türkiye cep telefonu numarasını okunaklı gösterir; +90 ile yapıştırmayı da korur. */
export function telefonGirdisiniBicimlendir(deger: string): string {
  const ham = deger.trim();
  const uluslararasi = ham.startsWith('+') || ham.startsWith('00');
  let rakamlar = ham.replace(/\D/g, '');
  let onEk = '';

  if (rakamlar.startsWith('0090')) {
    rakamlar = rakamlar.slice(4);
    onEk = '+90';
  } else if (rakamlar.startsWith('90') && (uluslararasi || rakamlar.length === 12)) {
    rakamlar = rakamlar.slice(2);
    onEk = '+90';
  } else if (uluslararasi && rakamlar.length <= 2) {
    return `+${rakamlar}`;
  }

  const yerelBaslangic = rakamlar.startsWith('0');
  rakamlar = rakamlar.slice(0, yerelBaslangic ? 11 : 10);
  const gruplar = yerelBaslangic
    ? [rakamlar.slice(0, 4), rakamlar.slice(4, 7), rakamlar.slice(7, 9), rakamlar.slice(9, 11)]
    : [rakamlar.slice(0, 3), rakamlar.slice(3, 6), rakamlar.slice(6, 8), rakamlar.slice(8, 10)];
  const numara = gruplar.filter(Boolean).join(' ');
  return onEk && numara ? `${onEk} ${numara}` : onEk || numara;
}
