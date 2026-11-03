import { createContext } from 'react';
import type { Ilan } from '../veri/ilanlar';
import type { Bildirim, IlanSorusu } from '../veri/ilanEtkilesimleri';
import type { IlanKaldirmaNedeni, SikayetNedeni } from '../veri/ilanYonetimi';
import type { SaticiProfili } from '../veri/saticilar';
import type { Alisveris, SaticiDegerlendirmesi } from '../veri/saticiDegerlendirmeleri';

export type Mesaj = { id: string; yazi: string; benim: boolean; saat: string };
export type Profil = {
  ad: string;
  konum: string;
  hakkinda: string;
  fotograf?: string;
  telefon?: string;
  telefonGoster?: boolean;
};

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
  saticilar: SaticiProfili[];
  alisverisler: Alisveris[];
  degerlendirmeler: SaticiDegerlendirmesi[];
  degerlendirmeHakkiKullanilanlar: string[];
  alisverisTalepEt: (ilanId: string) => Promise<HesapSonucu>;
  alisverisiOnayla: (id: string) => Promise<HesapSonucu>;
  alisverisiIptalEt: (id: string) => Promise<HesapSonucu>;
  saticiyiDegerlendir: (bilgi: { alisverisId: string; puan: number; yorum: string }) => Promise<HesapSonucu>;
  degerlendirmeGuncelle: (id: string, bilgi: { puan: number; yorum: string }) => Promise<HesapSonucu>;
  degerlendirmeSil: (id: string) => Promise<HesapSonucu>;
  degerlendirmeCevapla: (id: string, cevap: string) => Promise<HesapSonucu>;
  hazir: boolean;
  bildirim: string;
  oturum: Oturum | null;
  bildirimler: Bildirim[];
  okunmamisBildirimSayisi: number;
  bildirimOku: (id?: string) => void;
  sorular: IlanSorusu[];
  soruSor: (ilanId: string, soru: string) => HesapSonucu;
  soruCevapla: (soruId: string, cevap: string, herkeseAcik: boolean) => HesapSonucu;
  soruGorunurluguDegistir: (soruId: string) => void;
  ilaniGoruntule: (id: string) => void;
  ilanIstatistikleri: Record<string, { goruntulenme: number; favori: number }>;
  girisYap: (bilgiler: { eposta: string; sifre: string }) => Promise<HesapSonucu>;
  kayitOl: (bilgiler: { ad: string; eposta: string; sifre: string }) => Promise<HesapSonucu>;
  cikisYap: () => void;
  favoriDegistir: (id: string) => void;
  ilanEkle: (ilan: Ilan, hesapId: string) => Promise<HesapSonucu>;
  ilanGuncelle: (ilan: Ilan, hesapId: string) => Promise<HesapSonucu>;
  ilanOneCikar: (id: string, hesapId: string) => Promise<HesapSonucu>;
  ilanSil: (id: string) => void;
  ilaniYayindanKaldir: (id: string, neden: IlanKaldirmaNedeni) => Promise<HesapSonucu>;
  ilaniYenidenYayinla: (id: string) => Promise<HesapSonucu>;
  ilanSikayetEt: (id: string, neden: SikayetNedeni, aciklama: string) => Promise<HesapSonucu>;
  mesajGonder: (kisi: string, yazi: string) => void;
  profilKaydet: (profil: Profil) => Promise<HesapSonucu>;
  konumSec: (konum: string) => void;
  haberVer: (mesaj: string) => void;
};

// Sağlayıcı ve tüketiciler Fast Refresh sırasında aynı bağlamı kullanır.
export const PazarBaglami = createContext<PazarDegeri | null>(null);
