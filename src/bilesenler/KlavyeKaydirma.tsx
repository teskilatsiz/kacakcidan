import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type ComponentRef } from 'react';
import { Keyboard, Platform, ScrollView, type ScrollViewProps } from 'react-native';

type Kaydirma = ComponentRef<typeof ScrollView>;
type Girdi = Parameters<Kaydirma['scrollResponderScrollNativeHandleToKeyboard']>[0];

export const KlavyeKaydirma = forwardRef<Kaydirma, ScrollViewProps & { odagiSinirla?: boolean }>(
  function KlavyeKaydirma({ onFocusCapture, onBlurCapture, odagiSinirla = false, ...props }, ref) {
    const kaydirma = useRef<Kaydirma>(null);
    const etkinGirdi = useRef<Girdi | undefined>(undefined);
    const kare = useRef<number | undefined>(undefined);
    useImperativeHandle(ref, () => kaydirma.current!, []);
    const goster = useCallback(() => {
      if (kare.current !== undefined) cancelAnimationFrame(kare.current);
      kare.current = requestAnimationFrame(() => {
        kare.current = undefined;
        const odak = etkinGirdi.current;
        if (odak && Keyboard.isVisible())
          kaydirma.current?.scrollResponderScrollNativeHandleToKeyboard(odak, 24, true);
      });
    }, []);
    useEffect(() => {
      const gorundu = Keyboard.addListener('keyboardDidShow', goster);
      const degisti = Keyboard.addListener('keyboardDidChangeFrame', goster);
      return () => {
        gorundu.remove();
        degisti.remove();
        if (kare.current !== undefined) cancelAnimationFrame(kare.current);
      };
    }, [goster]);
    return (
      <ScrollView
        {...props}
        ref={kaydirma}
        keyboardShouldPersistTaps={props.keyboardShouldPersistTaps ?? 'handled'}
        keyboardDismissMode={props.keyboardDismissMode ?? (Platform.OS === 'ios' ? 'interactive' : 'on-drag')}
        automaticallyAdjustKeyboardInsets={props.automaticallyAdjustKeyboardInsets ?? false}
        onLayout={(olay) => {
          props.onLayout?.(olay);
          goster();
        }}
        onContentSizeChange={(genislik, yukseklik) => {
          props.onContentSizeChange?.(genislik, yukseklik);
          goster();
        }}
        onFocusCapture={(olay) => {
          if (odagiSinirla) olay.stopPropagation();
          etkinGirdi.current = olay.nativeEvent.target;
          onFocusCapture?.(olay);
          goster();
        }}
        onBlurCapture={(olay) => {
          if (etkinGirdi.current === olay.nativeEvent.target) etkinGirdi.current = undefined;
          onBlurCapture?.(olay);
        }}
      />
    );
  },
);
