import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCurrentLocation, setAddress, setZone, resetLocation, setShowLocationModal } from '@/redux/slices/locationPickerSlice';

// Types for function parameters
interface CurrentLocationPayload {
  latitude: string;
  longitude: string;
  title: string;
}

interface AddressPayload {
  addressId: string;
  label: string;
  selectedTitle: string;
  latitude: string;
  longitude: string;
  zoneId: string;
  zoneTitle: string;
  zoneCoordinates: number[][];
  showLocationModal?: boolean;
}

interface ZonePayload {
  addressId: string;
  label: string;
  selectedTitle: string;
  latitude: string;
  longitude: string;
  zoneId: string;
  zoneTitle: string;
  zoneCoordinates: number[][]
}

export const useLocationPicker = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.locationPicker);

  const updateCurrentLocation = (payload: CurrentLocationPayload) => {
    dispatch(setCurrentLocation(payload));
  };

  const updateAddress = (payload: AddressPayload) => {
    dispatch(setAddress(payload));
  };

  const updateZone = (payload: ZonePayload) => {
    dispatch(setZone(payload));
  };

  const clearLocation = () => {
    dispatch(resetLocation());
  };

  const toggleLocationModal = (payload: boolean) => {
    dispatch(setShowLocationModal(payload));
  };

  return {
    location,
    updateCurrentLocation,
    updateAddress,
    updateZone,
    clearLocation,
    toggleLocationModal,
  };
};
