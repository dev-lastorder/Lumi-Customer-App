
export const fetchGoogleRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  stops: { lat: number; lng: number }[] = []
) => {
  try {
    // Base endpoint
    const baseUrl = "https://api-nestjs-enatega.up.railway.app/api/v1/maps/route";

    // Construct the URL with origin, destination, and optional waypoints
    const params = new URLSearchParams({
      originLat: origin.lat.toString(),
      originLng: origin.lng.toString(),
      destinationLat: destination.lat.toString(),
      destinationLng: destination.lng.toString(),
    });

    // Add intermediate stops if any
    if (stops.length > 0) {
      params.append(
        "stops",
        stops.map((s) => `${s.lat},${s.lng}`).join("|")
      );
    }

    const url = `${baseUrl}?${params.toString()}`;
    console.log("🗺️ Fetching route from backend:", url);

    const res = await fetch(url);
    const data = await res.json();

    if (!data?.path || !Array.isArray(data.path)) {
      console.warn("⚠️ No valid path found in response:", data);
      return [];
    }

    // Convert [lat, lng] pairs into { latitude, longitude } objects for MapView
    const routeCoords = data.path.map(([lat, lng]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));

    console.log("✅ Route coordinates fetched:", routeCoords.length, "points");
    return routeCoords;
  } catch (error) {
    console.error("❌ Error fetching route:", error);
    return [];
  }
};

