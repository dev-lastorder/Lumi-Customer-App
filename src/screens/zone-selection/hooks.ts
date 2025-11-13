import { useCallback, useMemo } from "react";
import { useLocationPicker } from "@/hooks/useLocationPicker";
import { computeCentroid, convertCoordsToLatLngArray } from "./utils";

/* ---------------------------------------------
🔁 Data Transformation: Zones → Polygons + Centroid
--------------------------------------------- */
export const useZonePolygons = (zonesData?: any[]) => {
  return useMemo(() => {
    if (!zonesData) return [];

    return zonesData.map((zone) => {
      const coordinates = zone.location.coordinates;
      const rings = Array.isArray(coordinates[0][0]) ? coordinates[0] : coordinates;
      const polygons = convertCoordsToLatLngArray(rings);
      const centroid = polygons[0]?.length ? computeCentroid(polygons[0]) : { latitude: 0, longitude: 0 };

      return {
        id: zone._id,
        title: zone.title,
        polygons,
        centroid,
      };
    });
  }, [zonesData]);
};

/* ---------------------------------------------
✅ Confirm Selection Logic
--------------------------------------------- */
export const useConfirmZone = ({
  zones,
  selectedZoneId,
  selectedZoneTitle,
  onConfirmSuccess,
}: {
  zones: any[];
  selectedZoneId: string | null;
  selectedZoneTitle: string;
  onConfirmSuccess: () => void;
}) => {
  
  const { updateZone } = useLocationPicker();

  return () => {
    if (!selectedZoneId) return;

    const selectedZone = zones.find((z) => z._id === selectedZoneId);
    if (!selectedZone) return;

    updateZone({
      addressId: '',
      label: '',     
      zoneId: selectedZoneId,
      zoneTitle: selectedZoneTitle,
      latitude: selectedZone.location.coordinates[1],
      longitude: selectedZone.location.coordinates[0],
      zoneCoordinates: selectedZone.location.coordinates,
      selectedTitle: selectedZoneTitle,
    });

    onConfirmSuccess();
  };
};

