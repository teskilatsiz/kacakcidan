import { useSyncExternalStore } from 'react';
import { gorunurAlaniIzle, klavyeDurumunuOku } from './gorunurAlan.web';

const sunucudaKapali = () => false;

export function useKlavyeAcik() {
  return useSyncExternalStore(gorunurAlaniIzle, klavyeDurumunuOku, sunucudaKapali);
}
