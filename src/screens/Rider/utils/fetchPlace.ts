import { BASE_URL } from '@/environment';
import axios from 'axios';

const baseUrl = BASE_URL + '/api/v1/maps'; 

/**
 * 🔍 Fetch autocomplete place suggestions
 * @param input - User's typed location text
 */
export const fetchPlaces = async (input: string) => {
  if (!input || input.length < 3) return [];

  try {
    const response = await axios.post(`${baseUrl}/places`, { input });

    if (!Array.isArray(response.data)) {
      console.warn('⚠️ Unexpected response:', response.data);
      return [];
    }

    return response.data || [];
  } catch (err) {
    console.error('❌ Error fetching places:', err);
    return [];
  }
};

/**
 * 📍 Fetch detailed place info (e.g., coordinates)
 * @param placeId - The Google Place ID
 */
export const getPlaceDetails = async (placeId: string) => {
  try {
    console.log('getPlaceDetails:', placeId);

    const response = await axios.post(`${baseUrl}/place-details`, { placeId });

    console.log('✅ Place details response:', response.data);
    const loc = response.data; // directly use the object
    if (!loc?.lat || !loc?.lng) return null;

    return { lat: loc.lat, lng: loc.lng };
  } catch (err) {
    console.error('❌ Error fetching place details:', err);
    return null;
  }
};
