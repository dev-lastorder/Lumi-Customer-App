import { LatLng } from "react-native-maps";

export interface ZonePolygon {
  id: string;
  title: string;
  polygons: LatLng[][];
  centroid: LatLng;
}

export interface ZoneMapProps {
  dark: boolean;
  zonePolygons: ZonePolygon[];
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  setSelectedZoneTitle: (title: string) => void;
  setConfirmModalVisible: (visible: boolean) => void;
}
