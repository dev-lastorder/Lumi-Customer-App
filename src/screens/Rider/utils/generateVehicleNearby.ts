
export const generateNearbyVehicles = (
  userLocation: { latitude: number; longitude: number },
  count: number = 5,
  radiusInMeters: number = 500
) => {
  const vehicles = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusInMeters;

    const offsetLat = (distance * Math.cos(angle)) / 111320;
    const offsetLng =
      (distance * Math.sin(angle)) /
      (111320 * Math.cos((userLocation.latitude * Math.PI) / 180));

    vehicles.push({
      id: i + 1,
      latitude: userLocation.latitude + offsetLat,
      longitude: userLocation.longitude + offsetLng,
      type: Math.random() > 0.5 ? "car" : "bike",
    });
  }

  return vehicles;
};


export const snapToRoad = async (lat: number, lng: number) => {

  const res = await fetch(`https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&key=${apiKey}`);
  const apiData = await res.json();
  if (apiData.snappedPoints && apiData.snappedPoints.length > 0) {
    return {
      latitude: apiData.snappedPoints[0].location.latitude,
      longitude: apiData.snappedPoints[0].location.longitude,
    };
  }
  return { latitude: lat, longitude: lng };
};
