import { createContext } from 'react';
import type { Ilan } from '../veri/ilanlar';

export type Mesaj = { id: string; yazi: string; benim: boolean; saat: string };
export type Profil = { ad: string; konum: string; hakkinda: string; fotograf?: string };

export type Kayit = {
  favoriler: string[];
  eklenenler: Ilan[];
  mesajlar: Record<string, Mesaj[]>;
  profil: Profil;
  konum: string;
};

export type Oturum = { id: string; eposta: string };
export type HesapSonucu = { basarili: boolean; hata?: string };

export type PazarDegeri = Kayit & {
  tumIlanlar: Ilan[];
  hazir: boolean;
  bildirim: string;
  oturum: Oturum | null;
  girisYap: (bilgiler: { eposta: string; sifre: string }) => Promise<HesapSonucu>;
  kayitOl: (bilgiler: { ad: string; eposta: string; sifre: string }) => Promise<HesapSonucu>;
  cikisYap: () => void;
  favoriDegistir: (id: string) => void;
  ilanEkle: (ilan: Ilan, hesapId: string) => Promise<HesapSonucu>;
  ilanGuncelle: (ilan: Ilan, hesapId: string) => Promise<HesapSonucu>;
  ilanSil: (id: string) => void;
  mesajGonder: (kisi: string, yazi: string) => void;
  profilKaydet: (profil: Profil) => void;
  konumSec: (konum: string) => void;
  haberVer: (mesaj: string) => void;
};

// Sağlayıcı ve tüketiciler Fast Refresh sırasında aynı bağlamı kullanır.
export const PazarBaglami = createContext<PazarDegeri | null>(null);
