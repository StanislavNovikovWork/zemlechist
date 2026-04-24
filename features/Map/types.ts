export interface MarkerFeature {
  id: number;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    phone: string;
    name: string;
    description: string;
    iconCaption: string;
    "marker-color": string;
  };
}

export interface MarkersGeoJSON {
  type: 'FeatureCollection';
  features: MarkerFeature[];
}
