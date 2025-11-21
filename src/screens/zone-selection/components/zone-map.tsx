import {  useCallback } from 'react';
import { Dimensions, Image, View } from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  LatLng,
} from 'react-native-maps';
import { ZoneMapProps, ZonePolygon } from './interfaces';
import { MAP_DARK_STYLE } from './constants';
import { useCurrentLocation } from '@/hooks';
import { useInitialRegion } from '@/hooks/useInitialRegion';

const { width, height } = Dimensions.get('window');


const ZoneMarker = ({
  zone,
  onPress,
}: {
  zone: ZonePolygon;
  onPress: () => void;
}) => (
  <Marker coordinate={zone.centroid} onPress={onPress}>
    <Image
      source={require('@/assets/images/locations.png')}
      style={{ width: 36, height: 36 }}
      resizeMode="contain"
    />
  </Marker>
);

const CurrentLocationMarker = ({ location }: { location: LatLng }) => (
  <Marker coordinate={location}>
    <View className="w-5 h-5 rounded-full bg-primary border-[3px] border-white" />
  </Marker>
);

// Main Component
export default function ZoneMap({
  dark,
  zonePolygons,
  setSelectedZoneId,
  setSelectedZoneTitle,
  setConfirmModalVisible,
}: ZoneMapProps) {
  const location = useCurrentLocation();
  const initialRegion = useInitialRegion(location);

  const handleZonePress = useCallback(
    (zone: ZonePolygon) => {
      setSelectedZoneId(zone.id);
      setSelectedZoneTitle(zone.title);
      setConfirmModalVisible(true);
    },
    [setSelectedZoneId, setSelectedZoneTitle, setConfirmModalVisible]
  );

  return (
    <MapView
      key={`${dark ? 'dark' : 'light'}-${zonePolygons.length}-${!!location}`}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1, width, height}}
      initialRegion={initialRegion}
      customMapStyle={dark ? MAP_DARK_STYLE : undefined}
    >
      {zonePolygons.map((zone) => (
        <ZoneMarker key={`marker-${zone.id}`} zone={zone} onPress={() => handleZonePress(zone)} />
      ))}
      {location && <CurrentLocationMarker location={location} />}
    </MapView>
  );
}

