"use client";

import { useState, useRef } from "react";
import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} from "@/lib/ymaps3";
import { DEFAULT_LOCATION } from "@/constants/map.constants";
import MapSearch from "../MapSearch";
import MarkerModal from "../MarkerModal";
import { Marker } from "../Marker";
import { MarkerFeature } from "../types";
import { useMarkers } from "@/hooks/useMarkers";

/**
 * Пропсы компонента Map
 * @property location - Начальное расположение карты с координатами центра и уровнем масштаба
 */
interface MapProps {
  location?: { center: [number, number]; zoom: number };
}

export function Map({ location: propLocation = DEFAULT_LOCATION }: MapProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [location, setLocation] = useState(propLocation);
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerFeature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { markers } = useMarkers();

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
        {markers?.features?.slice(0, 50).map((feature: MarkerFeature) => (
          <Marker
            key={feature.id}
            feature={feature}
            isHovered={hoveredId === feature.id}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onOpenModal={handleOpenModal}
          />
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
