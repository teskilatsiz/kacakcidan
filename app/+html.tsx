import type { PropsWithChildren } from 'react';
import { useServerDocumentContext } from 'expo-router/html';
import { acikRenkler, koyuRenkler } from '../src/tasarim/palet';
import { ilanUrunVerisi } from '../src/tasarim/seo';
import { ilanlar } from '../src/veri/ilanlar';

const degiskenler = (palet: typeof acikRenkler) =>
  Object.entries(palet)
    .map(([ad, deger]) => `--renk-${ad}:${deger}`)
    .join(';');
const temaCss = `:root{color-scheme:light;${degiskenler(acikRenkler)}}:root[data-tema=koyu]{color-scheme:dark;${degiskenler(koyuRenkler)}}@media(prefers-color-scheme:dark){:root:not([data-tema=acik]){color-scheme:dark;${degiskenler(koyuRenkler)}}}`;
const temaBaslat = `(function(){try{var t=localStorage.getItem('kacakcidan-gorunum');var d=t==='koyu'||(t!=='acik'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.tema=d?'koyu':'acik';document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`;
const siteAdresi = (process.env.EXPO_PUBLIC_SITE_URL || 'https://kacakcidan.netlify.app').replace(/\/$/, '');
const siteYapilandirilmisVerisi = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kaçakçıdan',
  alternateName: 'Kacakcidan',
  url: `${siteAdresi}/`,
}).replace(/</g, '\\u003c');

export default function Html({ children, pathname }: PropsWithChildren<{ pathname?: string }>) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  const urunVerisi = pathname?.startsWith('/ilan/')
    ? ilanUrunVerisi(ilanlar.find(({ id }) => pathname === `/ilan/${id}`))
    : undefined;

  return (
    <html {...htmlAttributes} lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="author" content="Teşkilatsız" />
        <meta name="color-scheme" content="light dark" />
        <script src="/guvenlik.js" />
        <style dangerouslySetInnerHTML={{ __html: temaCss }} />
        <script dangerouslySetInnerHTML={{ __html: temaBaslat }} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="theme-color" content="#ffd12f" />
        <link rel="icon" type="image/png" sizes="256x256" href="/favicon.png" />
        <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="/apple-touch-icon.png" />
        {pathname === '/' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: siteYapilandirilmisVerisi }}
          />
        )}
        {urunVerisi && (
          <script
            id="ilan-urun-verisi"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(urunVerisi).replace(/</g, '\\u003c') }}
          />
        )}
        <link
          rel="preload"
          href="/fonts/dm-sans-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-sans-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-sans-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
