import { MapStyleElement } from "react-native-maps";

export const MAP_DARK_STYLE: MapStyleElement[] = [
  { elementType: 'geometry', stylers: [{ color: '#1E1E1E' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#FFFFFF' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1E1E1E' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#3C3C3C' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3C5A78' }] },
];
