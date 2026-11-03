var bilgi;
function konumuOku() {
  var secenek = new URLSearchParams(location.hash.slice(1));
  var yeni = JSON.parse(secenek.get('konum') || 'null');
  if (
    !yeni ||
    !Array.isArray(yeni.merkez) ||
    yeni.merkez.length !== 2 ||
    !yeni.merkez.every(Number.isFinite) ||
    Math.abs(yeni.merkez[0]) > 85 ||
    Math.abs(yeni.merkez[1]) > 180 ||
    !Array.isArray(yeni.sinirlar) ||
    yeni.sinirlar.length !== 2 ||
    !yeni.sinirlar.every(function (nokta) {
      return (
        Array.isArray(nokta) &&
        nokta.length === 2 &&
        nokta.every(Number.isFinite) &&
        Math.abs(nokta[0]) < 85 &&
        Math.abs(nokta[1]) <= 180
      );
    }) ||
    !Number.isFinite(yeni.yaricap) ||
    yeni.yaricap <= 0 ||
    yeni.yaricap > 750000 ||
    typeof yeni.etiket !== 'string'
  ) {
    throw new Error('Harita konumu geçersiz.');
  }
  bilgi = yeni;
  document.documentElement.dataset.tema = secenek.get('tema') === 'koyu' ? 'koyu' : 'acik';
  document.getElementById('harita').setAttribute('aria-label', bilgi.etiket.slice(0, 160));
  // Başlangıç konumunu harita uygulaması sorar; burada konum izni istenmez.
  var apple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  var yolAdresi = new URL(apple ? 'https://maps.apple.com/directions' : 'https://www.google.com/maps/dir/');
  yolAdresi.searchParams.set('destination', bilgi.merkez.join(','));
  if (!apple) yolAdresi.searchParams.set('api', '1');
  var yolTarifi = document.getElementById('yol-tarifi');
  yolTarifi.href = yolAdresi.href;
  yolTarifi.title = 'İlanın bulunduğu bölge merkezine yol tarifi';
  yolTarifi.setAttribute('aria-label', 'Nasıl giderim? ' + bilgi.etiket.slice(0, 160));
  yolTarifi.hidden = false;
}
var harita;
var boyutIzleyici;
var bekleme = document.getElementById('bekleme');
var hata = document.getElementById('hata');
var azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function hataGoster() {
  bekleme.hidden = true;
  hata.hidden = false;
}
function baslat() {
  if (boyutIzleyici) boyutIzleyici.disconnect();
  if (harita) harita.remove();
  try {
    konumuOku();
    // Mobilde parmak harita üzerindeyken sayfa kaydırılabilsin. Leaflet 1.x,
    // sürükleme sürerken iptal edilemeyen touchmove olaylarında da
    // preventDefault çağırdığı için dokunmatik cihazlarda bu hareketleri kapat.
    var dokunmatik = window.matchMedia('(pointer: coarse)').matches;
    harita = L.map('harita', {
      scrollWheelZoom: false,
      zoomControl: false,
      dragging: !dokunmatik,
      touchZoom: !dokunmatik,
      zoomAnimation: !azHareket,
      fadeAnimation: !azHareket,
      minZoom: 5,
      maxZoom: 17,
    });
    harita.attributionControl.setPrefix(false);
    harita.fitBounds(bilgi.sinirlar, { padding: [22, 22], animate: false });
    var yuklenen = 0;
    var zemin = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      referrerPolicy: 'strict-origin-when-cross-origin',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
    });
    zemin.on('tileload', function () {
      yuklenen++;
      bekleme.hidden = true;
      hata.hidden = true;
    });
    zemin.on('load', function () {
      if (!yuklenen) hataGoster();
    });
    zemin.addTo(harita);
    var alan = L.circle(bilgi.merkez, {
      radius: bilgi.yaricap,
      color: '#b78c00',
      fillColor: '#ffd12f',
      fillOpacity: 0.2,
      weight: 2,
      interactive: false,
    }).addTo(harita);
    alan.getElement().setAttribute('role', 'img');
    alan.getElement().setAttribute('aria-label', bilgi.etiket);
    L.circleMarker(bilgi.merkez, {
      radius: 5,
      color: '#17191b',
      fillColor: '#ffd12f',
      fillOpacity: 1,
      weight: 2,
      interactive: false,
    }).addTo(harita);
    L.control
      .zoom({ position: 'bottomright', zoomInTitle: 'Yakınlaştır', zoomOutTitle: 'Uzaklaştır' })
      .addTo(harita);
    var kontrol = L.control({ position: 'topright' });
    kontrol.onAdd = function () {
      var alan = L.DomUtil.create('div', 'leaflet-bar');
      var dugme = L.DomUtil.create('button', 'haritaya-don', alan);
      dugme.type = 'button';
      dugme.title = 'İlanın bulunduğu bölgeye dön';
      dugme.setAttribute('aria-label', dugme.title);
      dugme.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>';
      L.DomEvent.disableClickPropagation(alan);
      dugme.addEventListener('click', function () {
        harita.fitBounds(bilgi.sinirlar, { padding: [22, 22], animate: !azHareket });
      });
      return alan;
    };
    kontrol.addTo(harita);
    if (window.ResizeObserver) {
      boyutIzleyici = new ResizeObserver(function () {
        harita.invalidateSize({ pan: false });
      });
      boyutIzleyici.observe(document.body);
    }
  } catch (_) {
    hataGoster();
  }
}
function yukle() {
  hata.hidden = true;
  bekleme.hidden = false;
  if (window.L) {
    baslat();
    return;
  }
  var betik = document.createElement('script');
  betik.src = document.getElementById('leaflet-kaynagi').src;
  betik.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  betik.crossOrigin = 'anonymous';
  betik.onload = baslat;
  betik.onerror = hataGoster;
  document.body.appendChild(betik);
}
window.addEventListener('hashchange', function () {
  yukle();
});
document.getElementById('yeniden-dene').addEventListener('click', yukle);
yukle();
