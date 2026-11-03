import Blog from '../../src/ekranlar/Blog';
import { blogAciklamasi, blogBasligi } from '../../src/veri/blog';
import { sayfaMetasi } from '../../src/tasarim/seo';

export function generateMetadata() {
  return sayfaMetasi(blogBasligi, blogAciklamasi, '/blog');
}
export default Blog;
