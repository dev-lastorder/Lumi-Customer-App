import { useEffect, useState } from "react";
import { LatLng } from "react-native-maps";
import * as Location from 'expo-location';


export const useCurrentLocation = () => {
  const [location, setLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      } catch (err) {
        
      }
    };

    fetchLocation();
  }, []);

  return location;
};