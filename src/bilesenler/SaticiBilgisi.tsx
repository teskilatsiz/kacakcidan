import { StyleSheet, View } from 'react-native';
import Star from 'lucide-react-native/icons/star';
import UserRound from 'lucide-react-native/icons/user-round';
import MapPin from 'lucide-react-native/icons/map-pin';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { Link } from 'expo-router';
import { Gorsel } from './Gorsel';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';
import { useTema } from '../tasarim/tema';
import { gorselKaynagi } from '../veri/gorseller';
import { saticiYolu, type SaticiProfili } from '../veri/saticilar';

export function SaticiOzeti({
  satici,
  rol,
  ilanSayisi,
}: {
  satici: SaticiProfili;
  rol: string;
  ilanSayisi: number;
}) {
  const { renk } = useTema();
  return (
    <View style={{ minWidth: 0, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <SaticiResmi satici={satici} boyut={48} />
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <Yazi style={{ fontSize: 16, lineHeight: 22, fontWeight: '700' }}>{satici.ad}</Yazi>
          <Yazi style={{ fontSize: 12, lineHeight: 18, color: renk.gri }}>{rol}</Yazi>
        </View>
      </View>
      <View style={{ gap: 7 }}>
        {!!satici.konum && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7 }}>
            <MapPin size={14} color={renk.gri} style={{ marginTop: 3, flexShrink: 0 }} />
            <Yazi style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 20, color: renk.gri }}>
              {satici.konum}
            </Yazi>
          </View>
        )}
        {!!satici.uyelikYili && (
          <Yazi style={{ fontSize: 12, lineHeight: 20, color: renk.gri }}>
            {satici.uyelikYili} yılından beri üye
          </Yazi>
        )}
        <SaticiPuani satici={satici} />
      </View>
      <Link href={saticiYolu(satici.id)} asChild>
        <HareketliBas
          accessibilityRole="link"
          accessibilityLabel={`${satici.ad} profilini ve yayındaki ${ilanSayisi} ilanını gör`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 48,
            gap: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: renk.acik,
          }}
        >
          <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
            <Yazi style={{ fontSize: 13, lineHeight: 19, fontWeight: '600' }}>Profili ve ilanları</Yazi>
            <Yazi style={{ fontSize: 12, lineHeight: 18, color: renk.gri }}>{ilanSayisi} ilan yayında</Yazi>
          </View>
          <ChevronRight size={16} color={renk.murekkep} style={{ flexShrink: 0 }} />
        </HareketliBas>
      </Link>
    </View>
  );
}

export function SaticiResmi({
  satici,
  boyut = 48,
}: {
  satici: Pick<SaticiProfili, 'ad' | 'fotograf'>;
  boyut?: number;
}) {
  const { renk } = useTema();
  return (
    <View
      style={{
        width: boyut,
        height: boyut,
        borderRadius: boyut / 2,
        backgroundColor: renk.sari,
        overflow: 'hidden',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {satici.fotograf ? (
        <Gorsel
          source={gorselKaynagi(satici.fotograf)}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          accessibilityLabel={`${satici.ad} profil fotoğrafı`}
        />
      ) : (
        <UserRound size={boyut * 0.44} color={renk.vurguYazi} strokeWidth={1.7} />
      )}
    </View>
  );
}

export function SaticiPuani({ satici }: { satici: Pick<SaticiProfili, 'puan' | 'degerlendirmeSayisi'> }) {
  const { renk } = useTema();
  const { puan, degerlendirmeSayisi } = satici;
  if (
    puan === undefined ||
    !Number.isFinite(puan) ||
    puan < 1 ||
    puan > 5 ||
    degerlendirmeSayisi === undefined ||
    !Number.isSafeInteger(degerlendirmeSayisi) ||
    degerlendirmeSayisi < 1
  )
    return (
      <View
        dataSet={{ 'satici-degerlendirmesi': 'true' }}
        style={{ flexDirection: 'row', alignItems: 'flex-start', minWidth: 0, gap: 6 }}
      >
        <Star
          size={14}
          fill="none"
          color={renk.gri}
          strokeWidth={1.6}
          style={{ marginTop: 3, flexShrink: 0 }}
        />
        <Yazi style={{ flexShrink: 1, color: renk.gri, fontSize: 12, lineHeight: 20 }}>
          Henüz değerlendirme yok
        </Yazi>
      </View>
    );
  const puanMetni = puan.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const sayiMetni = degerlendirmeSayisi.toLocaleString('tr-TR');
  return (
    <View
      dataSet={{ 'satici-degerlendirmesi': 'true' }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}
      accessible
      accessibilityLabel={`5 üzerinden ${puanMetni} puan, ${sayiMetni} değerlendirme`}
    >
      <Star size={14} fill={renk.sari} color={renk.murekkep} strokeWidth={1.5} />
      <Yazi style={{ fontWeight: '700', fontSize: 13 }}>{puanMetni} / 5</Yazi>
      <Yazi style={{ color: renk.gri, fontSize: 12 }}>({sayiMetni} değerlendirme)</Yazi>
    </View>
  );
}
