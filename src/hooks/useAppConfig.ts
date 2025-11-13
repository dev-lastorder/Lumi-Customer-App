import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setError, AppConfigState, setEmergencyContact, setCurrency } from '@/redux/slices/appConfigSlice';
import type { RootState, AppDispatch } from '@/redux';
import { getEmergencyContact } from '@/screens/Rider/utils/getEmergencyContact';
import { getCurrency } from '@/screens/Rider/utils/getConfig';


export const useAppConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector<RootState, AppConfigState>((state) => state.appConfig);

  useEffect(() => {
    const loadConfig = async () => {
      dispatch(setLoading(true));
      try {
       fetchEmergencyContact()
       fetchCurrency()
      } catch (err: any) {
        dispatch(setError(err.message || 'Something went wrong'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadConfig();
  }, [dispatch]);

  const fetchEmergencyContact = async () => {
    try {
    const emergencyData = await Promise.resolve(getEmergencyContact());
    const rawNumber = emergencyData?.contact_number || '911';
    
    dispatch(setEmergencyContact(rawNumber));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch emergency contact'));
    }
  };

  const fetchCurrency = async () => {
    try {
      const data = await Promise.resolve(getCurrency());
      if (!Array.isArray(data)) {
        throw new Error('Invalid currency data format');
      }
      const activeCurrency = data.find((item) => item.isActive) || null;
      
      dispatch(setCurrency(activeCurrency));
      console.log('Fetched currency:', activeCurrency);
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to fetch currency'));
    }
  }

  return config;
};
