/* Expo'nun parça yükleyicisine yalnızca bu yayının yerel JavaScript adresleri açılır. */
(function () {
  if (!window.trustedTypes) return;
  window.trustedTypes.createPolicy('default', {
    createScriptURL: function (deger) {
      var adres = new URL(deger, location.href);
      if (
        adres.origin !== location.origin || adres.search || adres.hash ||
        !/^\/_expo\/static\/js\/web\/[a-zA-Z0-9_+\[\].-]+-[a-f0-9]{32}\.js$/.test(adres.pathname)
      ) throw new TypeError('Betik adresine izin verilmiyor.');
      return adres.href;
    },
    createHTML: function (deger) {
      // React'in boşaltma işlemi dışında HTML dizgileri kabul edilmez.
      if (deger === '') return '';
      throw new TypeError('HTML metni yerine DOM yöntemlerini kullan.');
    },
    createScript: function (deger) {
      // Rota değişiminde güncellenen JSON-LD, çalıştırılabilir kod içermez.
      var veri = JSON.parse(deger);
      if (!veri || Array.isArray(veri) || veri['@context'] !== 'https://schema.org') {
        throw new TypeError('Betik metnine izin verilmiyor.');
      }
      return JSON.stringify(veri).replace(/</g, '\\u003c');
    }
  });
})();
