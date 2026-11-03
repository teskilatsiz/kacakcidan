import { Link, type Href } from 'expo-router';
import { HareketliBas } from './Hareketli';
import { Yazi } from './Temel';

export function BilgiBaglantisi({ ad, adres }: { ad: string; adres: string }) {
  return (
    <Link href={adres as Href} asChild>
      <HareketliBas
        accessibilityRole="link"
        style={{
          minHeight: 44,
          paddingVertical: 10,
          justifyContent: 'center',
          alignSelf: 'flex-start',
          maxWidth: '100%',
        }}
      >
        <Yazi style={{ fontSize: 13, lineHeight: 22, textDecorationLine: 'underline', flexShrink: 1 }}>
          {ad}
        </Yazi>
      </HareketliBas>
    </Link>
  );
}
