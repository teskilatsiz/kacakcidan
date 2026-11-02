// Bu dosya scripts/gorsel-varyantlari.mjs ile üretilir.
export interface GorselVaryanti {
  readonly uri: string;
  readonly width: number;
  readonly height: number;
}

export interface GorselBoyutlari {
  readonly width: number;
  readonly height: number;
  readonly variants: readonly GorselVaryanti[];
}

export const gorselVaryantlari: Readonly<Record<string, GorselBoyutlari>> = {
  '/gorseller/air-jordan.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/air-jordan-668f8291c0d3-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/air-jordan-49523e88a14c-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/air-jordan-74cb07a52180-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/air-jordan-9758a387dfa8-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/akulu-matkap.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/akulu-matkap-2ae201735e6d-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/akulu-matkap-df05968a6315-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/akulu-matkap-bd1feb27b51b-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/akulu-matkap-003d34ea170a-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/akustik-gitar.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/akustik-gitar-ca81ef9e86c8-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/akustik-gitar-04ac914df832-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/akustik-gitar-29ccee24aaf2-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/akustik-gitar-1faee13b1874-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/antika-radyo.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/antika-radyo-446dd1feeb83-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/antika-radyo-68495d0b9445-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/antika-radyo-534aee354a06-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/antika-radyo-8b650ef0b4f3-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/barista-is.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/barista-is-5d027a5fb739-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/barista-is-317d86dedd46-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/barista-is-c42612ef09aa-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/barista-is-473e6cd90764-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/bebek-arabasi.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/bebek-arabasi-bf79e6eca372-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/bebek-arabasi-c58059bdff3e-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/bebek-arabasi-73ae78dafd22-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/bebek-arabasi-121f14d7a7ec-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/dijital-multimetre.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/dijital-multimetre-50b1432f6e30-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/dijital-multimetre-e33c5e9d63d7-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/dijital-multimetre-d352d49dca44-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/dijital-multimetre-26db8b5176c6-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/espresso-makinesi.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/espresso-makinesi-6a849b226f05-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/espresso-makinesi-4e0664e700a7-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/espresso-makinesi-38fab2cb71de-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/espresso-makinesi-8fc377bf6256-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/fiat-egea.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/fiat-egea-20defbb08a57-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/fiat-egea-7a1604682b82-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/fiat-egea-11515524210c-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/fiat-egea-742a82c1de58-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/fujifilm.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/fujifilm-45cc2b6fcef8-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/fujifilm-a9a0025298e6-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/fujifilm-d9ec4a9184a5-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/fujifilm-d77a931b43a5-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/hobi-satranc.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/hobi-satranc-3af93cec3883-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/hobi-satranc-621f3374c1d9-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/hobi-satranc-f82200f54c60-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/hobi-satranc-8e7190dc3900-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/honda-civic.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/honda-civic-b669aded5c8c-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/honda-civic-014fcae473f1-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/honda-civic-24c3800a518d-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/honda-civic-5c2c5867a43b-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/iphone-13.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/iphone-13-ec20d0f0ff82-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/iphone-13-e5d179ff9bea-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/iphone-13-48964accca71-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/iphone-13-8bced6d885a3-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/iphone-14-pro-max.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/iphone-14-pro-max-8c5ae410f17b-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/iphone-14-pro-max-7c9d3e404e82-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/iphone-14-pro-max-5cfa8b82e340-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/iphone-14-pro-max-49acc0c51d7a-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/iphone-15-pro-arka.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/iphone-15-pro-arka-08e458b1a2ca-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-arka-f41d54a8245f-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-arka-f1f704369835-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-arka-e4dbfbf48bf5-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/iphone-15-pro-ekran.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/iphone-15-pro-ekran-f663828a72b9-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-ekran-37233964842c-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-ekran-3b26f92ea064-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-ekran-ce804291d367-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/iphone-15-pro-video.webp': {
    width: 720,
    height: 576,
    variants: [
      {
        uri: '/gorseller/kart/iphone-15-pro-video-cb3f03cbcaba-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-video-256d65c01656-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-video-9acea33d857e-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-video-b0e29e82239b-720.webp',
        width: 720,
        height: 576,
      },
    ],
  },
  '/gorseller/iphone-15-pro.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/iphone-15-pro-7dd80a0c7a8f-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-d96bb61cb069-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-6c598f012bcd-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/iphone-15-pro-45d9147f228d-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/kapak.webp': {
    width: 1900,
    height: 828,
    variants: [
      {
        uri: '/gorseller/kart/kapak-5ac2e37e7b4a-240.webp',
        width: 240,
        height: 105,
      },
      {
        uri: '/gorseller/kart/kapak-0ba78860b5f4-360.webp',
        width: 360,
        height: 157,
      },
      {
        uri: '/gorseller/kart/kapak-777de00aa64c-480.webp',
        width: 480,
        height: 209,
      },
      {
        uri: '/gorseller/kart/kapak-35c780dbf80b-720.webp',
        width: 720,
        height: 314,
      },
    ],
  },
  '/gorseller/kategorilerde-kesfet.webp': {
    width: 1200,
    height: 800,
    variants: [
      {
        uri: '/gorseller/kart/kategorilerde-kesfet-cbbf17cc24a2-240.webp',
        width: 240,
        height: 160,
      },
      {
        uri: '/gorseller/kart/kategorilerde-kesfet-d1966f3c4f6d-360.webp',
        width: 360,
        height: 240,
      },
      {
        uri: '/gorseller/kart/kategorilerde-kesfet-68dfa91a7ad9-480.webp',
        width: 480,
        height: 320,
      },
      {
        uri: '/gorseller/kart/kategorilerde-kesfet-4580ef500a03-720.webp',
        width: 720,
        height: 480,
      },
    ],
  },
  '/gorseller/kawasaki.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/kawasaki-8e3add7456e0-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/kawasaki-054d1d0afd7e-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/kawasaki-82e7aa01569a-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/kawasaki-8b29dbc99d7c-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/kiralik-daire.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/kiralik-daire-c41f1e69b83e-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/kiralik-daire-895bd4a62718-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/kiralik-daire-e4a448bb691b-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/kiralik-daire-317f44d74ee4-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/kitap-seti.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/kitap-seti-680711d0476e-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/kitap-seti-b48f63c25d2a-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/kitap-seti-4a4b654d50a1-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/kitap-seti-5fec8f96eacc-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/macbook-air-kapak.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/macbook-air-kapak-fa4addc8d09e-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/macbook-air-kapak-4b93c1bc8124-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/macbook-air-kapak-96599dd69c02-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/macbook-air-kapak-43477efbcc7e-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/macbook-air.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/macbook-air-b7bdb075286d-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/macbook-air-65630c36fe12-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/macbook-air-75f6cff596a8-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/macbook-air-f1448640a4da-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/masa-lambasi.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/masa-lambasi-55abe8ad0c44-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/masa-lambasi-2a5a0afd4267-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/masa-lambasi-ca088fd131fe-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/masa-lambasi-2da2b475b42c-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/nothing-phone-2.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/nothing-phone-2-be61c32e4293-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/nothing-phone-2-d21c743beb5e-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/nothing-phone-2-ef1de08a9811-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/nothing-phone-2-ecf6c9a74f44-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/ofis-sandalyesi.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/ofis-sandalyesi-a1e7001e5f9a-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/ofis-sandalyesi-d106bfc2007a-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/ofis-sandalyesi-c029d02a2589-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/ofis-sandalyesi-347631924ca2-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/pixel-7.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/pixel-7-bdfc61af8ce5-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/pixel-7-65b8febe579f-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/pixel-7-c20ce136e488-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/pixel-7-224a97e4d1de-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/playstation-5-detay.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/playstation-5-detay-cf82c46af618-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/playstation-5-detay-e9758f7bd25d-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/playstation-5-detay-4d41aa6503db-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/playstation-5-detay-a73658870f17-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/playstation-5.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/playstation-5-2d8bfa12341c-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/playstation-5-a721ef8dc642-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/playstation-5-7c7ca06b121a-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/playstation-5-fb0c01ebdda1-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/renault-clio.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/renault-clio-3a3b87015265-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/renault-clio-f468947d7990-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/renault-clio-a7d9b5ec6f22-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/renault-clio-961cedbb2f53-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/renault-megane.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/renault-megane-c95a5b17626a-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/renault-megane-f903e7007b8d-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/renault-megane-eaa9222a6ccf-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/renault-megane-f94f15685166-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/saat.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/saat-e411206b8ecf-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/saat-2a51ccccb405-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/saat-e32830c9a1b0-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/saat-b9de7eea82a3-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/sac-kurutma.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/sac-kurutma-593f89a7da0d-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/sac-kurutma-31d6e79d2635-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/sac-kurutma-a5455c55a0e0-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/sac-kurutma-9e0bfc0c665a-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/samsung-s23-ultra.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/samsung-s23-ultra-4fe42ddd87a2-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/samsung-s23-ultra-1db221c3a95a-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/samsung-s23-ultra-4134d71c7ddd-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/samsung-s23-ultra-f19cc33be97f-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/sehir-bisikleti.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/sehir-bisikleti-5022ab93896f-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/sehir-bisikleti-a7935eea34d6-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/sehir-bisikleti-2df46b292965-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/sehir-bisikleti-dcc7d98be5ee-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/tesisat-hizmeti.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/tesisat-hizmeti-e18a22fb6c76-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/tesisat-hizmeti-4475884fd851-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/tesisat-hizmeti-849b5e7d8aa3-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/tesisat-hizmeti-75b2be76d451-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/toyota-corolla.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/toyota-corolla-01f97c60c43a-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/toyota-corolla-8b5583113a7b-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/toyota-corolla-7f03ecbefe3c-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/toyota-corolla-7af043c831fc-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/uclu-kanepe.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/uclu-kanepe-dec97bc967f4-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/uclu-kanepe-1b1dd0f11efe-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/uclu-kanepe-2dc3c5bce6c9-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/uclu-kanepe-764a7a9bca9e-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/volkswagen-golf.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/volkswagen-golf-273f9d695560-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/volkswagen-golf-c211430a081c-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/volkswagen-golf-52188c66508d-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/volkswagen-golf-e1d8fc293f37-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
  '/gorseller/xiaomi-13t-pro.webp': {
    width: 700,
    height: 560,
    variants: [
      {
        uri: '/gorseller/kart/xiaomi-13t-pro-82795d0b9523-240.webp',
        width: 240,
        height: 192,
      },
      {
        uri: '/gorseller/kart/xiaomi-13t-pro-4a87067b437d-360.webp',
        width: 360,
        height: 288,
      },
      {
        uri: '/gorseller/kart/xiaomi-13t-pro-0711fa4c4d67-480.webp',
        width: 480,
        height: 384,
      },
      {
        uri: '/gorseller/kart/xiaomi-13t-pro-250264be891b-700.webp',
        width: 700,
        height: 560,
      },
    ],
  },
  '/gorseller/yazilim-is.webp': {
    width: 1200,
    height: 900,
    variants: [
      {
        uri: '/gorseller/kart/yazilim-is-660a954c4602-240.webp',
        width: 240,
        height: 180,
      },
      {
        uri: '/gorseller/kart/yazilim-is-64b4690352fc-360.webp',
        width: 360,
        height: 270,
      },
      {
        uri: '/gorseller/kart/yazilim-is-b40dbbb48456-480.webp',
        width: 480,
        height: 360,
      },
      {
        uri: '/gorseller/kart/yazilim-is-fdfe839cf73c-720.webp',
        width: 720,
        height: 540,
      },
    ],
  },
};
