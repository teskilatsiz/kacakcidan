import { forwardRef, useEffect, useImperativeHandle, useRef, type ComponentRef } from 'react';
import { Keyboard, ScrollView, type ScrollViewProps } from 'react-native';

type Kaydirma = ComponentRef<typeof ScrollView>;
type Girdi = Parameters<Kaydirma['scrollResponderScrollNativeHandleToKeyboard']>[0];

export const KlavyeKaydirma = forwardRef<Kaydirma, ScrollViewProps & { odagiSinirla?: boolean }>(
  function KlavyeKaydirma({ onFocusCapture, onBlurCapture, odagiSinirla = false, ...props }, ref) {
    const kaydirma = useRef<Kaydirma>(null);
    const etkinGirdi = useRef<Girdi | undefined>(undefined);
    const kare = useRef<number | undefined>(undefined);
    useImperativeHandle(ref, () => kaydirma.current!, []);
    const goster = () => {
      if (kare.current !== undefined) cancelAnimationFrame(kare.current);
      kare.current = requestAnimationFrame(() => {
        kare.current = undefined;
        if (etkinGirdi.current !== undefined && Keyboard.isVisible())
          kaydirma.current?.scrollResponderScrollNativeHandleToKeyboard(etkinGirdi.current, 16, true);
      });
    };
    useEffect(() => {
      const gorundu = Keyboard.addListener('keyboardDidShow', goster);
      const degisti = Keyboard.addListener('keyboardDidChangeFrame', goster);
      return () => {
        gorundu.remove();
        degisti.remove();
        if (kare.current !== undefined) cancelAnimationFrame(kare.current);
      };
    }, []);
    return (
      <ScrollView
        {...props}
        ref={kaydirma}
        keyboardShouldPersistTaps={props.keyboardShouldPersistTaps ?? 'handled'}
        keyboardDismissMode={props.keyboardDismissMode ?? 'on-drag'}
        automaticallyAdjustKeyboardInsets={props.automaticallyAdjustKeyboardInsets ?? false}
        onLayout={(olay) => {
          props.onLayout?.(olay);
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
