"use client";

import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
} from "../lib/ymaps3";

const DEFAULT_LOCATION: { center: [number, number]; zoom: number } = {
  center: [37.588144, 55.733842],
  zoom: 10,
};

interface MapComponentProps {
  location?: { center: [number, number]; zoom: number };
}

export function MapComponent({ location = DEFAULT_LOCATION }: MapComponentProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <YMap location={location}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
      </YMap>
    </div>
  );
}
