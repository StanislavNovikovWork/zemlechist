/**
 * Парсит строку с координатами в объект с центром карты и зумом
 * @param value - Строка с координатами (формат: "lat,lon" или "lat lon" или "lat, lon")
 * @returns Объект с координатами центра и зумом или null при неверном формате
 */
export function parseCoordinates(value: string): { center: [number, number]; zoom: number } | null {
  // Try to parse as coordinates (format: "lat,lon" or "lat lon" or "lat, lon")
  const coordMatch = value.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return { center: [lon, lat], zoom: 12 };
    }
  }

  return null;
}
