import type { PropsWithChildren } from 'react';
import { useServerDocumentContext } from 'expo-router/html';
import { acikRenkler, koyuRenkler } from '../src/tasarim/palet';

const degiskenler = (palet: typeof acikRenkler) =>
  Object.entries(palet)
    .map(([ad, deger]) => `--renk-${ad}:${deger}`)
    .join(';');
const temaCss = `:root{color-scheme:light;${degiskenler(acikRenkler)}}:root[data-tema=koyu]{color-scheme:dark;${degiskenler(koyuRenkler)}}@media(prefers-color-scheme:dark){:root:not([data-tema=acik]){color-scheme:dark;${degiskenler(koyuRenkler)}}}`;
const temaBaslat = `(function(){try{var t=localStorage.getItem('kacakcidan-gorunum');var d=t==='koyu'||(t!=='acik'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.tema=d?'koyu':'acik';document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`;

export default function Html({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();

  return (
    <html {...htmlAttributes} lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: temaCss }} />
        <script dangerouslySetInnerHTML={{ __html: temaBaslat }} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="theme-color" content="#ffd12f" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link
          rel="preload"
          href="/fonts/dm-sans-400.woff2"
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
