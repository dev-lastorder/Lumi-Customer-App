import { BASE_URL } from "@/environment";

export const getDistanceMatrix = async (
  origins: string[],
  destinations: string[]
) => {
  try {

    const url = `${BASE_URL}/api/v1/maps/distance-matrix`;

    const body = {
      origins,
      destinations,
    };

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error:", errorData);
      throw new Error(errorData?.message || "Failed to fetch distance matrix");
    }

    const data = await response.json();
    console.log("📏 Distance Matrix Data:", data);
    return data;
  } catch (error: any) {
    console.error("❌ getDistanceMatrix Error:", error.message);
    throw error;
  }
};


export const sendFareData = async (
  origins: string[],
  destinations: string[],
  isHourly: boolean,
  durationMin?: number,
  coordsData?:{
    fromCoords: { lat: any; lng: any } 
    toCoords: { lat: any; lng: any } 
  }
) => {
  try {
    // Step 1: POST to backend distance-matrix endpoint
    
    const url = `${BASE_URL}/api/v1/maps/distance-matrix`;
    
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origins, destinations }),
      }
    );

    const data = await response.json();
    console.log("📍 Backend Distance Matrix Response:", data);

    // Step 2: Validate backend data properly
    if (
      !data ||
      data.distanceKm == null ||
      data.durationMin == null ||
      isNaN(data.distanceKm) ||
      isNaN(data.durationMin)
    ) {
      throw new Error("Invalid route or missing distance data");
    }

    const distanceKm = data.distanceKm;
    const finalDurationMin = isHourly ? durationMin : data.durationMin;

    console.log("📏 Distance (km):", distanceKm, "| ⏱ Duration (min):", finalDurationMin);

    // Step 3: Fetch fare calculation from backend
  
    const apiUrl = `${BASE_URL}/api/v1/rides/fare/all?durationMin=${finalDurationMin}&distanceKm=${distanceKm}&isHourly=${isHourly}&dropoff_lng=${coordsData?.toCoords?.lng}&dropoff_lat=${coordsData?.toCoords?.lat}&pickup_lng=${coordsData?.fromCoords?.lng}&pickup_lat=${coordsData?.fromCoords?.lat}`;
    const fareResponse = await fetch(apiUrl, { method: "GET" });
    const fareData = await fareResponse.json();

    console.log("💰 Fare data:", fareData);
     return {
      fareData,
      distanceKm,
      durationMin: finalDurationMin,
    };
  } catch (err) {
    console.error("❌ sendFareData Error:", err);
    throw err;
  }
};



