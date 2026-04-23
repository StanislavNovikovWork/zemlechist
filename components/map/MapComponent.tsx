"use client";

import { useState } from "react";
import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} from "../../lib/ymaps3";
import markersData from "../../constants/markers.json";
import { DEFAULT_LOCATION } from "../../constants/map.constants";

interface MapComponentProps {
  location?: { center: [number, number]; zoom: number };
}

interface MarkerFeature {
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

export function MapComponent({ location = DEFAULT_LOCATION }: MapComponentProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const markers = (markersData as any).default || markersData;

  return (
    <div className="w-full h-full">
      <YMap location={location}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        {markers.features.map((feature: MarkerFeature) => (
          <YMapMarker
            key={feature.id}
            coordinates={feature.geometry.coordinates as [number, number]}
            zIndex={hoveredId === feature.id ? 1000 : 0}
          >
            <div
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative z-[1]"
            >
              <div className="w-6 h-6 rounded-full bg-[#ffd21e] border-2 border-white shadow-md" />
              {hoveredId === feature.id && (
                <div className="absolute bottom-[30px] left-1/2 w-[400px] h-[80px] -translate-x-1/2 bg-white px-3 py-2 rounded shadow-lg text-xs whitespace-pre-wrap">
                  {feature.properties.description}
                </div>
              )}
            </div>
          </YMapMarker>
        ))}
      </YMap>
    </div>
  );
}
