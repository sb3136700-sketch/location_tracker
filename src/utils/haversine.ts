/**
 * Haversine Formula for geodesic distance between two latitude/longitude points on Earth.
 * Returns distance in meters.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format meters into human-readable distance (e.g. 420m or 1.4 km)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Simple text similarity using Jaccard / Token overlap for Lost & Found matching
 */
export function calculateSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  const tokenize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const setA = new Set(tokenize(textA));
  const setB = new Set(tokenize(textB));

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((word) => {
    if (setB.has(word)) intersection++;
  });

  const union = new Set([...setA, ...setB]).size;
  return Math.round((intersection / union) * 100);
}
