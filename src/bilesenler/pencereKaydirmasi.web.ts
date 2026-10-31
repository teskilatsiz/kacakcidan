let acikPencereSayisi = 0;
let oncekiTasma = '';
let oncekiBosluk = '';

/** İç içe pencereler kapandığında sayfanın kaydırmasını erken açma. */
export function sayfaKaydirmasiniKilitle() {
  if (acikPencereSayisi === 0) {
    oncekiTasma = document.body.style.overflow;
    oncekiBosluk = document.body.style.paddingRight;
    const kaydirmaGenisligi = window.innerWidth - document.documentElement.clientWidth;
    if (kaydirmaGenisligi > 0) {
      const bosluk = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${bosluk + kaydirmaGenisligi}px`;
    }
    document.body.style.overflow = 'hidden';
  }
  acikPencereSayisi += 1;
  let serbest = false;
  return () => {
    if (serbest) return;
    serbest = true;
    acikPencereSayisi -= 1;
    if (acikPencereSayisi === 0) {
      document.body.style.overflow = oncekiTasma;
      document.body.style.paddingRight = oncekiBosluk;
    }
  };
}
