import type { GenerateMetadataFunction } from 'expo-router/server';
import BlogYazisi from '../../src/ekranlar/BlogYazisi';
import { blogYazilari, blogYazisiniBul } from '../../src/veri/blog';
import { sayfaMetasi } from '../../src/tasarim/seo';

export function generateStaticParams() {
  return blogYazilari.map(({ yol }) => ({ yol }));
}
export const generateMetadata: GenerateMetadataFunction = (_istek, params) => {
  const yazi = blogYazisiniBul(params.yol);
  return yazi
    ? sayfaMetasi(`${yazi.baslik} | Kaçakçıdan`, yazi.ozet, `/blog/${yazi.yol}`)
    : sayfaMetasi(
        'Yazı bulunamadı | Kaçakçıdan',
        'Alışveriş rehberindeki diğer yazıları incele.',
        '/blog',
        true,
      );
};
export default BlogYazisi;
