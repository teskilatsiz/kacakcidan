import { rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
export async function aramaDosyalariniYaz(klasor = 'dist') {
  // noindex bilgisinin botlarca okunabilmesi için sayfa isteklerine izin ver.
  await writeFile(path.join(klasor, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  // Bu proje arama sonuçlarında yer almayacağı için sitemap yayımlanmaz.
  await rm(path.join(klasor, 'sitemap.xml'), { force: true });
}
