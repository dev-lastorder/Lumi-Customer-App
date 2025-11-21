import { LatLng } from 'react-native-maps';



export function convertCoordsToLatLngArray(rawCoords: any): LatLng[][] {
  if (!Array.isArray(rawCoords)) return [];

  if (Array.isArray(rawCoords[0]) && Array.isArray(rawCoords[0][0]) && Array.isArray(rawCoords[0][0][0])) {
    return (rawCoords as number[][][]).map((poly) =>
      (poly as number[][]).map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
    );
  }

  if (Array.isArray(rawCoords[0]) && Array.isArray(rawCoords[0][0]) && typeof (rawCoords[0][0] as any)[0] === 'number') {
    return [(rawCoords as number[][]).map(([lng, lat]) => ({ latitude: lat, longitude: lng }))];
  }

  if (Array.isArray(rawCoords[0]) && typeof (rawCoords[0] as any)[0] === 'number') {
    return [(rawCoords as number[][]).map(([lng, lat]) => ({ latitude: lat, longitude: lng }))];
  }

  return [];
}

export function computeCentroid(polygon: LatLng[]): LatLng {
  let signedArea = 0;
  let Cx = 0;
  let Cy = 0;

  for (let i = 0; i < polygon.length; i++) {
    const { latitude: y0, longitude: x0 } = polygon[i];
    const { latitude: y1, longitude: x1 } = polygon[(i + 1) % polygon.length];
    const a = x0 * y1 - x1 * y0;
    signedArea += a;
    Cx += (x0 + x1) * a;
    Cy += (y0 + y1) * a;
  }

  signedArea *= 0.5;
  Cx /= 6 * signedArea;
  Cy /= 6 * signedArea;

  return { latitude: Cy, longitude: Cx };
}
