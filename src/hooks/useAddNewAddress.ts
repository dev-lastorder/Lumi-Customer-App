import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  updateZone,
  updateLocation,
  updateLocationType,
  updateLatitude,
  updateLongitude,
  updateOtherDetails,
  resetAddress,
  updateAddressId,
} from '@/redux/slices/addNewAddressSlice';

export const useAddNewAddress = () => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.addNewAddress);

  return {
    address,
    updateZone: (id: string, title: string) => dispatch(updateZone({ id, title })),
    updateLocation: (val: string) => dispatch(updateLocation(val)),
    updateLocationType: (val: string) => dispatch(updateLocationType(val)),
    updateLatitude: (val: string) => dispatch(updateLatitude(val)),
    updateLongitude: (val: string) => dispatch(updateLongitude(val)),
    updateOtherDetails: (val: string) => dispatch(updateOtherDetails(val)),
    updateAddressId: (value: string) => dispatch(updateAddressId(value)),
    resetAddress: () => dispatch(resetAddress()),
  };
};
