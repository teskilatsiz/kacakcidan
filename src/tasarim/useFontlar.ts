import { useFonts } from 'expo-font';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';

export function useFontlar() {
  return useFonts({ DMSans_400Regular, DMSans_700Bold });
}
