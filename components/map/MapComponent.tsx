"use client";

import { useState, useRef } from "react";
import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} from "@/lib/ymaps3";
import markersData from "@/constants/markers.json";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "./MapSearch";
import MarkerModal from "./MarkerModal";

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
    phone: string;
    name: string;
    description: string;
    iconCaption: string;
    "marker-color": string;
  };
}

export function MapComponent({ location: propLocation = DEFAULT_LOCATION }: MapComponentProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [location, setLocation] = useState(propLocation);
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const markers = (markersData as any).default || markersData;

  const handleLocationChange = (newLocation: { center: [number, number]; zoom: number }) => {
    setLocation(newLocation);
  };

  const handleSearchResult = (coordinates: [number, number] | null) => {
    setSearchMarker(coordinates);
  };

  const handleOpenModal = (marker: MarkerFeature) => {
    setSelectedMarker(marker);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMarker(null);
  };

  const handleMouseEnter = (id: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredId(null);
    }, 200);
  };

  return (
    <div className="w-full h-full relative">
      <MapSearch onLocationChange={handleLocationChange} onSearchResult={handleSearchResult} />
      <YMap location={location}>
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        {searchMarker && (
          <YMapMarker coordinates={searchMarker} zIndex={2000}>
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md" />
          </YMapMarker>
        )}
        {markers.features.slice(0, 50).map((feature: MarkerFeature) => (
          <YMapMarker
            key={feature.id}
            coordinates={feature.geometry.coordinates as [number, number]}
            zIndex={hoveredId === feature.id ? 1000 : 0}
          >
            <div
              onMouseEnter={() => handleMouseEnter(feature.id)}
              onMouseLeave={handleMouseLeave}
              className="relative z-[1]"
            >
              <div className="w-6 h-6 rounded-full bg-[#ffd21e] border-2 border-white shadow-md" />
              {hoveredId === feature.id && (
                <div
                  onMouseEnter={() => handleMouseEnter(feature.id)}
                  onMouseLeave={handleMouseLeave}
                  className="absolute bottom-[30px] left-1/2 w-[300px] -translate-x-1/2 bg-white px-4 py-3 rounded shadow-lg text-sm"
                >
                  <div className="space-y-1">
                    {feature.properties.phone && (
                      <div>
                        <span className="font-semibold text-gray-700">Телефон:</span>{' '}
                        <span className="text-gray-900">{feature.properties.phone}</span>
                      </div>
                    )}
                    {feature.properties.name && (
                      <div>
                        <span className="font-semibold text-gray-700">Имя:</span>{' '}
                        <span className="text-gray-900">{feature.properties.name}</span>
                      </div>
                    )}
                    {feature.properties.description && (
                      <div>
                        <span className="font-semibold text-gray-700">Описание:</span>{' '}
                        <span className="text-gray-900">{feature.properties.description}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenModal(feature)}
                    className="mt-3 w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    Подробнее
                  </button>
                </div>
              )}
            </div>
          </YMapMarker>
        ))}
      </YMap>
      <MarkerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        marker={selectedMarker?.properties || null}
      />
    </div>
  );
}
