// hooks/useZoneCheck.ts
import { getZoneCheck } from "@/screens/Rider/utils/getZoneCheck";
import { useEffect, useState } from "react";

interface ZoneData {
  id?: string;
  name?: string;
  currency?: {
    code?: string;
    symbol?: string;
  };
  [key: string]: any;
}

export const useZoneCheck = (lat: number, lng: number) => {
  const [data, setData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZone = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getZoneCheck(lat, lng);
        setData(result);
      } catch (err: any) {
        console.error("❌ useZoneCheck Error:", err);

        // handle specific API error messages gracefully
        const apiMessage =
          err?.response?.data?.message?.[0] ||
          err?.response?.data?.error ||
          "Failed to fetch zone data";

        setError(apiMessage);
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) {
      fetchZone();
    }
  }, [lat, lng]);

  return { data, loading, error };
};
