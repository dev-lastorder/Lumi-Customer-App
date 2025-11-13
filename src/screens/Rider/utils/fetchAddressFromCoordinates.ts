// utils/fetchAddressFromCoordinates.ts
export const fetchAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
    apiKey: string
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        // Return the formatted address from the first result
        return data.results[0].formatted_address;
      } else {
        throw new Error('No address found');
      }
    } catch (error) {
      console.error('Error fetching address from coordinates:', error);
      throw error;
    }
  };