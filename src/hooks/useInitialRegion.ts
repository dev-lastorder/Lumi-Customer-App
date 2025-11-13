import { useMemo } from "react";
import { LatLng } from "react-native-maps";

export const useInitialRegion = (location: LatLng | null) => {
  return useMemo(() => {
    return {
      latitude: location?.latitude ?? 1.0,
      longitude: location?.longitude ?? 1.0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    };
  }, [location]);
};