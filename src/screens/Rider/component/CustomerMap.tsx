import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Image, Platform, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { generateNearbyVehicles, snapToRoad } from '../utils/generateVehicleNearby';
import { getNearbyDrivers } from '../utils/getNearByVehicles';
import { fetchGoogleRoute } from '../utils/directionService';
import { useQuery } from '@apollo/client';

const { width, height } = Dimensions.get('window');

interface Stop {
  lat: string;
  lng: string;
}

interface CustomerMapProps {
  stopCoords: Stop | null;
  rideAccepted: boolean;
  myRideDataExist: any;
  rideDataExist: boolean;
  findingRide?: boolean;
}

const CustomerMap: React.FC<CustomerMapProps> = ({ stopCoords, rideAccepted, myRideDataExist, rideDataExist, findingRide }) => {
  const inset = useSafeAreaInsets();
  const location = useCurrentLocation();
  const [region, setRegion] = useState<Region | null>(null);
  const [route, setRoute] = useState<any[]>([]);
  const [newVehicles, setNewVehicles] = useState<any[]>([]);
  const findingMyRide = useSelector((state: RootState) => state.rideCreation.findingRide);
  const activeRide = useSelector((state: RootState) => state.activeRide.onGoingActiveRideData);
  const mapRef = useRef<MapView | null>(null);

  const fromLocation =
    useSelector((state: RootState) => state.rideLocation.fromLocation) || myRideDataExist?.pickup_location || activeRide?.pickup_location;
  const fromCoords = useSelector((state: RootState) => state.rideLocation.fromCoords) || myRideDataExist?.pickup || activeRide?.pickup;
  const toLocation =
    useSelector((state: RootState) => state.rideLocation.toLocation) || myRideDataExist?.dropoff_location || activeRide?.dropoff_location;
  const toCoords = useSelector((state: RootState) => state.rideLocation.toCoords) || myRideDataExist?.dropoff || activeRide?.dropoff;
  const driverCoords = useSelector((state: RootState) => state.rideLocation.driverCoords);

  // Update region whenever from/to changes
  useEffect(() => {
    if (fromCoords && toCoords) {
      const midLat = (Number(fromCoords.lat) + Number(toCoords.lat)) / 2;
      const midLng = (Number(fromCoords.lng) + Number(toCoords.lng)) / 2;
      setRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.abs(Number(fromCoords.lat) - Number(toCoords.lat)) * 2.5 || 0.08,
        longitudeDelta: Math.abs(Number(fromCoords.lng) - Number(toCoords.lng)) * 2.5 || 0.08,
      });
    } else if (fromCoords) {
      setRegion({
        latitude: Number(fromCoords.lat),
        longitude: Number(fromCoords.lng),
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      });
    } else if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      });
    }
  }, [fromCoords, toCoords, location]);

  // Fetch route when both points are available
  useEffect(() => {
    if (fromCoords && toCoords) {
      fetchGoogleRoute(
        { lat: Number(fromCoords.lat), lng: Number(fromCoords.lng) },
        { lat: Number(toCoords.lat), lng: Number(toCoords.lng) },
        stopCoords ? [{ lat: Number(stopCoords.lat), lng: Number(stopCoords.lng) }] : []
      )
        .then(setRoute)
        .catch((err) => console.error('Error fetching route:', err));
    }
  }, [fromCoords, toCoords, stopCoords]);

  // Fetch nearby drivers
  useEffect(() => {
    const fetchNearbyDrivers = async () => {
      if (!fromCoords) return;
      const rawVehicles = await getNearbyDrivers(fromCoords.lat, fromCoords.lng, 2);
      const withCoords = rawVehicles.map((v: any) => ({
        ...v,
        latitude: Number(v.user?.current_location?.latitude),
        longitude: Number(v.user?.current_location?.longitude),
      }));
      setNewVehicles(withCoords);
    };
    fetchNearbyDrivers();
  }, [fromCoords]);

  // Auto zoom to show both points (and stop if present)
  useEffect(() => {
    if (!mapRef.current) return;

    const pointsToFit: any[] = [];

    if (fromCoords?.lat && fromCoords?.lng) {
      pointsToFit.push({
        latitude: Number(fromCoords.lat),
        longitude: Number(fromCoords.lng),
      });
    }

    if (toCoords?.lat && toCoords?.lng) {
      pointsToFit.push({
        latitude: Number(toCoords.lat),
        longitude: Number(toCoords.lng),
      });
    }

    if (stopCoords?.lat && stopCoords?.lng) {
      pointsToFit.push({
        latitude: Number(stopCoords.lat),
        longitude: Number(stopCoords.lng),
      });
    }

    if (pointsToFit.length >= 2) {
      mapRef.current.fitToCoordinates(pointsToFit, {
        edgePadding: {
          top: 150,
          right: 150,
          bottom: 150,
          left: 150,
        },
        animated: true,
      });
    }
  }, [fromCoords, toCoords, stopCoords]);

  useEffect(() => {
    console.log('findingMyRide', findingMyRide);
  }, [findingMyRide]);

  if (!region) {
    return <View style={{ flex: 1, backgroundColor: '#f0f0f0' }} />;
  }

  console.log('from coordinates: customer map', fromCoords);
  console.log('to coordinates: customer map', toCoords);
  console.log('stop coordinates: customer map', stopCoords);

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? inset.top : 0 }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{
          height: height * (rideAccepted ? 0.99 : 0.8),
        }}
        region={region}
        showsUserLocation
        showsCompass={false}
        showsMyLocationButton={false}
      >
        {!findingMyRide && fromCoords && (
          <Marker
            coordinate={{
              latitude: Number(fromCoords.lat),
              longitude: Number(fromCoords.lng),
            }}
            title={fromLocation ?? 'Pickup'}
            image={require('@/assets/images/fromIcon.png')}
          />
        )}

        {findingRide && findingMyRide && (
          <Marker
            coordinate={{
              latitude: Number(fromCoords.lat),
              longitude: Number(fromCoords.lng),
            }}
            title={fromLocation ?? 'Pickup'}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('@/assets/GIFs/Searching.gif')} // your GIF file
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </Marker>
        )}

        {!findingMyRide && toCoords && (
          <Marker
            coordinate={{
              latitude: Number(toCoords.lat),
              longitude: Number(toCoords.lng),
            }}
            title={toLocation ?? 'Dropoff'}
            image={require('@/assets/images/toIcon.png')}
          />
        )}

        {!findingMyRide && stopCoords && (
          <Marker
            coordinate={{
              latitude: Number(stopCoords.lat),
              longitude: Number(stopCoords.lng),
            }}
            title={'Stop'}
          />
        )}
        {/* {driverCoords && ( */}
        <Marker
          style={{ width: 150, height: 150 }}
          opacity={driverCoords ? 1 : 0}
          coordinate={
            driverCoords
              ? {
                  latitude: Number(driverCoords?.lat),
                  longitude: Number(driverCoords?.lng),
                }
              : { latitude: 0.0, longitude: 0.0 }
          }
          title={'Driver'}
          
        >
          <Image source={require('@/assets/images/2wheel.png')} style={{width:40,height:40}}></Image>
        </Marker>
        {/* )} */}

        {newVehicles.map((v, index) => (
          <Marker
            key={`${v.driver_table_data?.id}-${index}`}
            coordinate={{ latitude: v.latitude, longitude: v.longitude }}
            title={v.user?.name}
            description={v.user?.phone}
            image={require('@/assets/images/mapVehicle.png')}
          />
        ))}

        {!findingMyRide &&
          fromCoords &&
          toCoords &&
          (route.length > 0 ? (
            <Polyline coordinates={route} strokeColor="#3B82F6" strokeWidth={4} />
          ) : (
            <Polyline
              coordinates={[
                {
                  latitude: Number(fromCoords.lat),
                  longitude: Number(fromCoords.lng),
                },
                {
                  latitude: Number(toCoords.lat),
                  longitude: Number(toCoords.lng),
                },
              ]}
              strokeColor="#3B82F6"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />
          ))}
      </MapView>
    </View>
  );
};

export default CustomerMap;
