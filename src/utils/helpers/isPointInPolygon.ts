
// src/utils/helpers/isPointInPolygon.ts

/**
 * Checks if a point is inside a polygon using the ray-casting algorithm.
 * The polygon coordinates are expected in [longitude, latitude] format.
 *
 * @param point - The point to check { latitude: number, longitude: number }.
 * @param polygon - An array of coordinates representing the polygon's boundary. Each coordinate is [longitude, latitude].
 * @returns true if the point is inside the polygon, false otherwise.
 */
export const isPointInPolygon = (
  point: { latitude: number; longitude: number },
  polygon: number[][]
): boolean => {
  if (!polygon || polygon.length < 3) {
    // A polygon must have at least 3 vertices
    return false;
  }

  const x = point.longitude;
  const y = point.latitude;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};
