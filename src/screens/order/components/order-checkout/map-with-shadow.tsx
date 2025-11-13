// src/components/checkout/MapWithShadow.tsx

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks';
import { MAP_DARK_STYLE } from '@/utils/constants';

// Icons
import HomeIcon from '@/assets/images/home_icon.png';
import RestIcon from '@/assets/images/rest_icon.png';
import { useAppSelector } from '@/redux';

const DEFAULT_REGION: Region = {
  latitude: 48.133,
  longitude: 11.642,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};


interface MapWithShadowProps {
  sourceLocation?: Region;
  destinationLocation?: Region;
}

export const MapWithShadow: React.FC<MapWithShadowProps> = ({ sourceLocation, destinationLocation }) => {
  const theme = useThemeColor();
  const { configuration } = useAppSelector((state) => state.configuration);
  const endColor = theme.background;

  return (
    <View style={styles.container}>
      {/* <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={DEFAULT_REGION} customMapStyle={!dark ? MAP_DARK_STYLE : undefined} /> */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={(map) => {
          // Fit to markers after mount/update
          if (map && sourceLocation && destinationLocation) {
            setTimeout(() => {
              map.fitToCoordinates(
                [
                  { latitude: sourceLocation.latitude, longitude: sourceLocation.longitude },
                  { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude },
                ],
                {
                  edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                  animated: true,
                }
              );
            }, 100);
          }
        }}
        initialRegion={
          sourceLocation
            ? {
                latitude: sourceLocation.latitude,
                longitude: sourceLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : DEFAULT_REGION
        }
        customMapStyle={theme.background == '#060606' ? MAP_DARK_STYLE : undefined}
      >
        {sourceLocation && (
          <Marker
            coordinate={sourceLocation}
            title="Source"
            image={RestIcon}
            style={{ width: 32, height: 32 }}
          />
        )}
        {destinationLocation && (
          <Marker
            coordinate={destinationLocation}
            title="Destination"
            image={HomeIcon}
            style={{ width: 32, height: 32 }}
          />
        )}

        {configuration?.googleApiKey && sourceLocation && destinationLocation && (
          <MapViewDirections
            origin={sourceLocation}
            destination={destinationLocation}
            apikey={configuration.googleApiKey}
            strokeWidth={2}
            strokeColor={'#f95509'}
            precision="low"
            resetOnChange={false} // Prevents unnecessary recalculations
            onReady={(results) => {}}
            optimizeWaypoints={true}
            onError={(error) => {}}
          />
        )}
      </MapView>
      <LinearGradient colors={['transparent', endColor]} style={styles.gradient} start={[0, 0]} end={[0, 1]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // fixed height so the map actually paints
    height: 230,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
});
