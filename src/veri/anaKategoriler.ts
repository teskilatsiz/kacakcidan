const anaKategoriler = [
  { id: 'telefon', ad: 'Telefon', simge: 'Smartphone' },
  { id: 'bilgisayar', ad: 'Bilgisayar', simge: 'Laptop' },
  { id: 'oyun', ad: 'Oyun & konsol', simge: 'Gamepad2' },
  { id: 'ev', ad: 'Ev & yaşam', simge: 'Armchair' },
  { id: 'moda', ad: 'Moda', simge: 'Shirt' },
  { id: 'fotograf', ad: 'Fotoğraf', simge: 'Camera' },
  { id: 'otomotiv', ad: 'Otomotiv', simge: 'CarFront' },
  { id: 'koleksiyon', ad: 'Koleksiyon', simge: 'Disc3' },
  { id: 'spor', ad: 'Spor & outdoor', simge: 'Bike' },
  { id: 'anne-bebek', ad: 'Anne & bebek', simge: 'Baby' },
  { id: 'muzik', ad: 'Müzik', simge: 'Guitar' },
  { id: 'kitap', ad: 'Kitap, dergi & film', simge: 'BookOpen' },
  { id: 'hobi', ad: 'Hobi & oyuncak', simge: 'Puzzle' },
  { id: 'bahce', ad: 'Bahçe & yapı market', simge: 'Flower2' },
  { id: 'kisisel-bakim', ad: 'Kişisel bakım', simge: 'Sparkles' },
  { id: 'teknik-elektronik', ad: 'Teknik elektronik', simge: 'CircuitBoard' },
  { id: 'ofis', ad: 'Ofis & kırtasiye', simge: 'BriefcaseBusiness' },
  { id: 'antika', ad: 'Antika', simge: 'Landmark' },
] as const;

export type Kategori = (typeof anaKategoriler)[number]['id'];
export const kategoriler: { id: Kategori; ad: string; simge: string }[] = anaKategoriler.map((kategori) => ({
  ...kategori,
}));
