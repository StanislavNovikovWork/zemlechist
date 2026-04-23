// Marker-related types
export interface Marker {
  id: number;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    description: string;
    iconCaption: string;
    "marker-color": string;
  };
}
