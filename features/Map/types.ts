export interface MarkerFeature {
  id: number;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    phone?: string;
    name?: string;
    description?: string;
    type: string;
    website?: string;
    inn?: string;
    organizationName?: string;
    updatedAt?: string;
    email?: string;
    reliability?: number;
    orderNumber?: string;
    responsible?: string;
    paymentMethod?: string;
    duration?: {
  period1: [string, string];
  period2?: [string, string];
};
    garbageCollectionSupplier?: number;
    zones?: string[];
  };
}

export interface MarkersGeoJSON {
  type: 'FeatureCollection';
  features: MarkerFeature[];
}
