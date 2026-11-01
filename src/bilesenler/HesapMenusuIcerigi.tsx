import { View } from 'react-native';
import UserRound from 'lucide-react-native/icons/user-round';
import MessageCircle from 'lucide-react-native/icons/message-circle';
import Settings from 'lucide-react-native/icons/settings';
import LogOut from 'lucide-react-native/icons/log-out';
import { useRouter } from 'expo-router';
import { usePazar } from '../durum/Pazar';
import { useTema } from '../tasarim/tema';
import { HareketliBas } from './Hareketli';
import { TemaSecici } from './TemaSecici';
import { Yazi } from './Temel';

export function HesapMenusuIcerigi({ kapat }: { kapat: () => void }) {
  const { renk } = useTema();
  const { oturum, profil, cikisYap } = usePazar();
  const router = useRouter();
  const git = (href: '/profil' | '/giris' | '/kayit' | '/mesajlar' | '/ayarlar') => {
    kapat();
    router.push(href);
  };
  const satir = {
    minHeight: 44,
    paddingHorizontal: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    borderRadius: 8,
  };
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          gap: 3,
          paddingHorizontal: 10,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderColor: renk.cizgi,
        }}
      >
        <Yazi numberOfLines={1} style={{ fontWeight: '700' }}>
          {oturum ? profil.ad : 'Hesabım'}
        </Yazi>
        <Yazi style={{ color: renk.gri, fontSize: 12 }}>
          {oturum ? 'İlanların, mesajların ve tercihlerin.' : 'İlanlarını ve favorilerini tek yerde tut.'}
        </Yazi>
      </View>
      <HareketliBas style={satir} onPress={() => git(oturum ? '/profil' : '/giris')}>
        <UserRound size={18} color={renk.murekkep} />
        <Yazi>{oturum ? 'Profilim' : 'Giriş yap'}</Yazi>
      </HareketliBas>
      {!oturum && (
        <HareketliBas style={satir} onPress={() => git('/kayit')}>
          <UserRound size={18} color={renk.murekkep} />
          <Yazi>Hesap oluştur</Yazi>
        </HareketliBas>
      )}
      <HareketliBas style={satir} onPress={() => git('/mesajlar')}>
        <MessageCircle size={18} color={renk.murekkep} />
        <Yazi>Mesajlarım</Yazi>
      </HareketliBas>
      {oturum && (
        <HareketliBas style={satir} onPress={() => git('/ayarlar')}>
          <Settings size={18} color={renk.murekkep} />
          <Yazi>Hesap ayarları</Yazi>
        </HareketliBas>
      )}
      <View style={{ paddingTop: 12, marginTop: 4, borderTopWidth: 1, borderColor: renk.cizgi }}>
        <TemaSecici kompakt />
      </View>
      {oturum && (
        <HareketliBas
          style={satir}
          onPress={() => {
            kapat();
            cikisYap();
            router.replace('/');
          }}
        >
          <LogOut size={18} color={renk.gri} />
          <Yazi style={{ color: renk.gri }}>Çıkış yap</Yazi>
        </HareketliBas>
      )}
    </View>
  );
}
